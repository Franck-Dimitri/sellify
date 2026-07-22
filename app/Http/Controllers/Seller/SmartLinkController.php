<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\SmartLink;
use App\Services\SmartLinkService;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class SmartLinkController extends Controller
{
    protected SmartLinkService $smartLinkService;

    public function __construct(SmartLinkService $smartLinkService)
    {
        $this->smartLinkService = $smartLinkService;
    }

    /**
     * List seller Smart-Links & stats.
     */
    public function index(Request $request): InertiaResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $smartLinks = SmartLink::where('seller_id', $seller->id)
            ->with('product')
            ->latest()
            ->get();

        $products = $seller ? $seller->products()->where('products.is_active', true)->where('products.is_archived', false)->get() : [];

        return Inertia::render('Seller/SmartLink/Index', [
            'smartLinks' => $smartLinks,
            'products' => $products,
            'baseUrl' => config('app.url', 'http://localhost:8000') . '/pay/',
        ]);
    }

    /**
     * Generate a new Smart-Link (Multi-Product or Single Product).
     */
    public function store(Request $request): RedirectResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'product_id' => 'nullable|exists:products,id',
            'items' => 'nullable|array|min:1',
            'items.*.product_id' => 'required_with:items|exists:products,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
            'items.*.unit_price' => 'required_with:items|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'shipping_fee' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
            'validity_hours' => 'nullable|integer|in:24,48,72,168',
        ]);

        $validityHours = $validated['validity_hours'] ?? 48;
        $discountAmount = (float)($validated['discount_amount'] ?? 0);
        $shippingFee = (float)($validated['shipping_fee'] ?? 0);
        $notes = $validated['notes'] ?? null;
        $title = $validated['title'] ?? null;

        if (!empty($validated['items'])) {
            // Multi-product creation
            $itemsData = [];
            foreach ($validated['items'] as $item) {
                $product = Product::where('id', $item['product_id'])
                    ->whereIn('shop_id', $seller->shops()->pluck('id'))
                    ->firstOrFail();

                $itemsData[] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'quantity' => (int)$item['quantity'],
                    'unit_price' => (float)$item['unit_price'],
                    'variant' => $item['variant'] ?? null,
                    'image_url' => is_array($product->images) ? ($product->images[0] ?? null) : null,
                ];
            }

            $link = $this->smartLinkService->createMultiProductSmartLink(
                seller: $seller,
                items: $itemsData,
                title: $title,
                discountAmount: $discountAmount,
                shippingFee: $shippingFee,
                notes: $notes,
                validityHours: $validityHours
            );
        } else if (!empty($validated['product_id'])) {
            // Single product creation
            $product = Product::where('id', $validated['product_id'])
                ->whereIn('shop_id', $seller->shops()->pluck('id'))
                ->firstOrFail();

            $link = $this->smartLinkService->generateSmartLink(
                $seller,
                $product,
                $validityHours
            );

            if ($discountAmount > 0 || $shippingFee > 0 || $notes || $title) {
                $link->update([
                    'title' => $title ?: $link->title,
                    'discount_amount' => $discountAmount,
                    'shipping_fee' => $shippingFee,
                    'notes' => $notes,
                    'total_price' => max(0, $link->price_at_time - $discountAmount + $shippingFee)
                ]);
            }
        } else {
            return back()->withErrors(['product_id' => 'Veuillez sélectionner au moins un produit.']);
        }

        ActivityLog::log(
            $request->user()->id,
            'smart_link_created',
            "Génération du Smart-Link \"{$link->title}\" (Token: {$link->token})."
        );

        return redirect()->route('seller.smart_links.index')
            ->with('success', "Smart-Link généré avec succès ! Lien : " . config('app.url') . "/pay/{$link->token}");
    }
}
