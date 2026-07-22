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

class SubscriptionController extends Controller
{
    /**
     * Display SaaS packs & active subscription.
     */
    public function index(Request $request): InertiaResponse
    {
        $seller = $request->user()->seller;
        $packs = SubscriptionPack::all();
        $currentSubscription = $seller ? $seller->activeSubscription()->with('pack')->first() : null;

        return Inertia::render('Seller/Subscription/Index', [
            'packs' => $packs,
            'currentPack' => $seller ? $seller->pack : 'starter',
            'currentSubscription' => $currentSubscription,
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

        // Update active subscription
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
            "Changement vers le pack : {$pack->display_name}."
        );

        return redirect()->route('seller.subscription.index')
            ->with('success', "Félicitations ! Vous êtes désormais abonné au {$pack->display_name}.");
    }
}
