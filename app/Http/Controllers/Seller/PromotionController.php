<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PromotionController extends Controller
{
    /**
     * Display promotions inside a specific shop.
     */
    public function index(Request $request, Shop $shop): InertiaResponse
    {
        $seller = $request->user()->seller;

        if (!$seller || $shop->seller_id !== $seller->id) {
            abort(403, 'Accès non autorisé.');
        }

        $promotions = $shop->promotions()->with('product')->latest()->get();
        
        // Products that are active and don't already have an active promotion (or just all products)
        $products = $shop->products()->where('is_active', true)->get();

        return Inertia::render('Seller/Promotion/Index', [
            'shop' => $shop,
            'promotions' => $promotions,
            'products' => $products,
        ]);
    }

    /**
     * Store a new promotion.
     */
    public function store(Request $request, Shop $shop): RedirectResponse
    {
        $seller = $request->user()->seller;

        if (!$seller || $shop->seller_id !== $seller->id) {
            abort(403, 'Accès non autorisé.');
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'promo_price' => 'required|numeric|min:0.01',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if ($product->shop_id !== $shop->id) {
            abort(403, 'Accès non autorisé.');
        }

        if ($validated['promo_price'] >= $product->price) {
            return back()->withErrors([
                'promo_price' => "Le prix promotionnel doit être inférieur au prix d'origine du produit (" . number_format($product->price, 2) . " €)."
            ])->withInput();
        }

        // Calculate discount percentage automatically
        $discountPercentage = (int)round((1 - ($validated['promo_price'] / $product->price)) * 100);

        // Deactivate other promotions for the same product to avoid overlaps
        Promotion::where('product_id', $product->id)
            ->where('is_active', true)
            ->update(['is_active' => false]);

        $promotion = Promotion::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'promo_price' => $validated['promo_price'],
            'discount_percentage' => $discountPercentage,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'is_active' => true,
        ]);

        ActivityLog::log(
            $request->user()->id,
            'promotion_created',
            "Promotion créée pour le produit \"{$product->name}\" dans \"{$shop->name}\" : -{$discountPercentage}% (prix réduit : {$promotion->promo_price} €)."
        );

        return redirect()->route('seller.shop.promotions.index', $shop->slug)
            ->with('success', 'La promotion a été configurée avec succès.');
    }

    /**
     * Delete a promotion.
     */
    public function destroy(Request $request, Shop $shop, Promotion $promotion): RedirectResponse
    {
        $seller = $request->user()->seller;

        if (!$seller || $shop->seller_id !== $seller->id || $promotion->shop_id !== $shop->id) {
            abort(403, 'Accès non autorisé.');
        }

        $productName = $promotion->product->name;
        $promotion->delete();

        ActivityLog::log(
            $request->user()->id,
            'promotion_deleted',
            "Promotion supprimée pour le produit \"{$productName}\" dans la boutique \"{$shop->name}\"."
        );

        return redirect()->route('seller.shop.promotions.index', $shop->slug)
            ->with('success', 'La promotion a été supprimée.');
    }

    /**
     * Display a consolidated list of promotions across all shops.
     */
    public function globalIndex(Request $request): InertiaResponse
    {
        $seller = $request->user()->seller;
        
        if (!$seller) {
            abort(403, 'Accès non autorisé.');
        }

        $shopIds = $seller->shops()->pluck('id');

        $promotions = Promotion::whereIn('shop_id', $shopIds)
            ->with(['shop', 'product'])
            ->latest()
            ->get();

        return Inertia::render('Seller/Promotion/GlobalIndex', [
            'promotions' => $promotions,
            'pack' => $seller->pack,
        ]);
    }
}
