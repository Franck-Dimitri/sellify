<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\PromoCode;
use App\Models\Shop;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Support\Str;

class PromoCodeController extends Controller
{
    /**
     * Display all promo codes for the seller's shops.
     */
    public function index(Request $request): InertiaResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $shops = $seller->shops()->with('promoCodes')->get();
        $shopIds = $shops->pluck('id');

        $promoCodes = PromoCode::whereIn('shop_id', $shopIds)
            ->with('shop:id,name,slug')
            ->latest()
            ->get();

        return Inertia::render('Seller/Promotion/PromoCodes', [
            'promoCodes' => $promoCodes,
            'shops' => $shops,
        ]);
    }

    /**
     * Store a new promo code.
     */
    public function store(Request $request): RedirectResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $shopIds = $seller->shops()->pluck('id')->toArray();

        $validated = $request->validate([
            'shop_id' => 'required|in:' . implode(',', $shopIds),
            'code' => 'required|string|max:30',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0.01',
            'min_order_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $codeFormatted = strtoupper(Str::slug($validated['code'], ''));

        // Check uniqueness per shop
        $exists = PromoCode::where('shop_id', $validated['shop_id'])
            ->where('code', $codeFormatted)
            ->exists();

        if ($exists) {
            return back()->withErrors(['code' => 'Ce code promo existe déjà pour cette boutique.'])->withInput();
        }

        $shop = Shop::find($validated['shop_id']);

        $promo = PromoCode::create([
            'shop_id' => $validated['shop_id'],
            'code' => $codeFormatted,
            'type' => $validated['type'],
            'value' => $validated['value'],
            'min_order_amount' => $validated['min_order_amount'] ?? 0,
            'usage_limit' => $validated['usage_limit'] ?? null,
            'start_date' => $validated['start_date'] ?? now(),
            'end_date' => $validated['end_date'] ?? now()->addMonth(),
            'is_active' => true,
        ]);

        ActivityLog::log(
            $request->user()->id,
            'promo_code_created',
            "Code promo {$promo->code} créé pour la boutique {$shop->name} ({$promo->value} " . ($promo->type === 'percentage' ? '%' : 'FCFA') . ")."
        );

        return back()->with('success', "Le code promo {$promo->code} a été créé avec succès.");
    }

    /**
     * Delete a promo code.
     */
    public function destroy(Request $request, PromoCode $promoCode): RedirectResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $shopIds = $seller->shops()->pluck('id')->toArray();

        if (!in_array($promoCode->shop_id, $shopIds)) {
            abort(403, 'Action non autorisée.');
        }

        $code = $promoCode->code;
        $promoCode->delete();

        ActivityLog::log(
            $request->user()->id,
            'promo_code_deleted',
            "Code promo {$code} supprimé."
        );

        return back()->with('success', "Le code promo {$code} a été supprimé.");
    }
}
