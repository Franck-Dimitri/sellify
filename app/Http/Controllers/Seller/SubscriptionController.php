<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPack;
use App\Models\SellerSubscription;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    /**
     * Display SaaS packs, active subscription, time remaining and quota usage.
     */
    public function index(Request $request): InertiaResponse
    {
        $seller = $request->user()->seller;
        $packs = SubscriptionPack::all();
        $currentSubscription = $seller ? $seller->activeSubscription()->with('pack')->first() : null;

        // Quota calculations
        $shopsCount = $seller ? $seller->shops()->count() : 0;
        $productsCount = $seller ? $seller->products()->where('products.is_archived', false)->count() : 0;

        // Time remaining calculations
        $daysRemaining = null;
        $percentTimeUsed = 0;
        $startedAtFormatted = null;
        $expiresAtFormatted = null;

        if ($currentSubscription && $currentSubscription->expires_at) {
            $started = Carbon::parse($currentSubscription->started_at ?: $currentSubscription->created_at);
            $expires = Carbon::parse($currentSubscription->expires_at);
            $now = Carbon::now();

            $totalDurationDays = max(1, $started->diffInDays($expires));
            $daysPassed = max(0, $started->diffInDays($now));
            $daysRemaining = max(0, $now->diffInDays($expires, false));

            $percentTimeUsed = min(100, max(0, round(($daysPassed / $totalDurationDays) * 100)));
            $startedAtFormatted = $started->toLocaleDateString('fr-FR');
            $expiresAtFormatted = $expires->toLocaleDateString('fr-FR');
        }

        $packName = $seller ? $seller->pack : 'starter';

        // Pack limits
        $maxShops = $packName === 'starter' ? 1 : ($packName === 'pro' ? 2 : 999);
        $maxProducts = $packName === 'starter' ? 30 : 9999;
        $commissionRate = $packName === 'business' ? '3.5%' : ($packName === 'pro' ? '5.0%' : '8.0%');

        return Inertia::render('Seller/Subscription/Index', [
            'packs' => $packs,
            'currentPack' => $packName,
            'currentSubscription' => $currentSubscription,
            'usage' => [
                'shops_count' => $shopsCount,
                'max_shops' => $maxShops,
                'products_count' => $productsCount,
                'max_products' => $maxProducts,
                'commission_rate' => $commissionRate,
            ],
            'cycle' => [
                'days_remaining' => $daysRemaining,
                'percent_used' => $percentTimeUsed,
                'started_at' => $startedAtFormatted,
                'expires_at' => $expiresAtFormatted,
            ]
        ]);
    }

    /**
     * Change or upgrade SaaS pack.
     */
    public function upgrade(Request $request): RedirectResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $validated = $request->validate([
            'pack' => 'required|in:starter,pro,business',
        ]);

        $pack = SubscriptionPack::where('name', $validated['pack'])->firstOrFail();

        // Expire active subscription
        $seller->subscriptions()->update(['status' => 'expired']);

        SellerSubscription::create([
            'seller_id' => $seller->id,
            'pack_id' => $pack->id,
            'status' => 'active',
            'started_at' => now(),
            'expires_at' => $pack->monthly_price > 0 ? now()->addMonth() : null,
            'next_billing_at' => $pack->monthly_price > 0 ? now()->addMonth() : null,
        ]);

        $seller->update(['pack' => $pack->name]);

        ActivityLog::log(
            $request->user()->id,
            'subscription_changed',
            "Changement d'abonnement vers le pack : {$pack->display_name}."
        );

        return redirect()->route('seller.subscription.index')
            ->with('success', "Félicitations ! Vous êtes désormais abonné au {$pack->display_name}.");
    }
}
