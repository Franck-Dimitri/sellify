<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class InventoryController extends Controller
{
    /**
     * Display inventory & stock alert status.
     */
    public function index(Request $request): InertiaResponse
    {
        $seller = $request->user()->seller;
        $products = $seller ? $seller->products()->where('products.is_archived', false)->with('shop')->get() : [];

        $lowStockProducts = $products->filter(fn($p) => $p->stock <= $p->alert_threshold);

        return Inertia::render('Seller/Inventory/Index', [
            'products' => $products->values(),
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
            'stocks' => 'required|array',
            'stocks.*.id' => 'required|exists:products,id',
            'stocks.*.stock' => 'required|integer|min:0',
            'stocks.*.alert_threshold' => 'nullable|integer|min:0',
        ]);

        foreach ($validated['stocks'] as $item) {
            $product = Product::where('id', $item['id'])
                ->whereIn('shop_id', $seller->shops()->pluck('id'))
                ->first();

            if ($product) {
                $product->update([
                    'stock' => $item['stock'],
                    'alert_threshold' => $item['alert_threshold'] ?? $product->alert_threshold,
                    'stock_status' => $item['stock'] > 0 ? 'in_stock' : 'out_of_stock',
                ]);
            }
        }

        ActivityLog::log($request->user()->id, 'inventory_batch_update', "Mise à jour groupée du stock d'inventaire.");

        return back()->with('success', 'Stock d\'inventaire mis à jour avec succès.');
    }
}
