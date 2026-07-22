<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Carbon\Carbon;

class InventoryController extends Controller
{
    /**
     * Display inventory, stock alert status, active promotional products and countdown deadlines.
     */
    public function index(Request $request): InertiaResponse
    {
        $seller = $request->user()->seller;
        $products = $seller ? $seller->products()->where('products.is_archived', false)->with(['shop', 'promotions'])->get() : collect();

        $shopIds = $seller ? $seller->shops()->pluck('id') : collect();

        // Get active promotional products across seller shops
        $activePromotions = Promotion::whereIn('shop_id', $shopIds)
            ->where('is_active', true)
            ->where('end_date', '>=', now()->toDateString())
            ->with(['product', 'shop'])
            ->get();

        // Calculate countdown deadline info for each promotion
        $promoItems = $activePromotions->map(function ($promo) {
            $endDate = Carbon::parse($promo->end_date)->endOfDay();
            $now = Carbon::now();
            $diffHours = max(0, $now->diffInHours($endDate, false));
            $diffDays = max(0, $now->diffInDays($endDate, false));

            return [
                'id' => $promo->id,
                'product_id' => $promo->product_id,
                'product_name' => $promo->product->name ?? 'Produit',
                'shop_name' => $promo->shop->name ?? 'Boutique',
                'original_price' => $promo->product->price ?? 0,
                'promo_price' => $promo->promo_price,
                'discount_percentage' => $promo->discount_percentage,
                'start_date' => $promo->start_date,
                'end_date' => $promo->end_date,
                'days_remaining' => $diffDays,
                'hours_remaining' => $diffHours,
                'image' => $promo->product->images[0] ?? null,
            ];
        });

        // Top Selling Promotional Products (mocked/sorted by discount & activity)
        $topSellingPromos = $promoItems->sortByDesc('discount_percentage')->take(3)->values();

        $lowStockProducts = $products->filter(fn($p) => $p->stock <= $p->alert_threshold);

        return Inertia::render('Seller/Inventory/Index', [
            'products' => $products->values(),
            'promoItems' => $promoItems->values(),
            'topSellingPromos' => $topSellingPromos,
            'lowStockCount' => $lowStockProducts->count(),
            'totalStock' => $seller ? $seller->totalStock() : 0,
        ]);
    }

    /**
     * Batch update stock quantities.
     */
    public function updateBatch(Request $request): RedirectResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $validated = $request->validate([
            'stocks' => 'nullable|array',
            'updates' => 'nullable|array',
        ]);

        $itemsToUpdate = $validated['updates'] ?? $validated['stocks'] ?? [];

        foreach ($itemsToUpdate as $item) {
            if (!isset($item['id'])) continue;

            $product = Product::where('id', $item['id'])
                ->whereIn('shop_id', $seller->shops()->pluck('id'))
                ->first();

            if ($product) {
                $product->update([
                    'stock' => $item['stock'],
                    'stock_status' => $item['stock'] > 0 ? 'in_stock' : 'out_of_stock',
                ]);
            }
        }

        ActivityLog::log($request->user()->id, 'inventory_batch_update', "Mise à jour groupée du stock d'inventaire.");

        return back()->with('success', 'Stock d\'inventaire mis à jour avec succès.');
    }
}
