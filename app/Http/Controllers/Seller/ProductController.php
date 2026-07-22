<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ProductController extends Controller
{
    /**
     * Display a listing of the shop's products.
     */
    public function index(Request $request, Shop $shop): InertiaResponse
    {
        $seller = $request->user()->seller;
        
        if (!$seller || $shop->seller_id !== $seller->id) {
            abort(403, 'Accès non autorisé.');
        }

        $maxProducts = match ($seller->pack) {
            'business', 'pro' => 99999,
            default => 50,
        };
        $products = $shop->products()->where('is_archived', false)->latest()->get();
        $totalProducts = $products->count();

        return Inertia::render('Seller/Product/Index', [
            'shop' => $shop,
            'products' => $products,
            'totalStock' => $seller->totalStock(),
            'maxProductsLimit' => $maxProducts,
            'remainingProducts' => max(0, $maxProducts - $totalProducts),
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(Request $request, Shop $shop): InertiaResponse
    {
        $seller = $request->user()->seller;

        if (!$seller || $shop->seller_id !== $seller->id) {
            abort(403, 'Accès non autorisé.');
        }

        $maxProducts = match ($seller->pack) {
            'business', 'pro' => 99999,
            default => 50,
        };
        $totalProducts = $shop->products()->where('is_archived', false)->count();

        return Inertia::render('Seller/Product/Create', [
            'shop' => $shop,
            'remainingProducts' => max(0, $maxProducts - $totalProducts),
            'maxProductsLimit' => $maxProducts,
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request, Shop $shop): RedirectResponse
    {
        $seller = $request->user()->seller;

        if (!$seller || $shop->seller_id !== $seller->id) {
            abort(403, 'Accès non autorisé.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100',
            'price' => 'required|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'alert_threshold' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $maxProducts = match ($seller->pack) {
            'business', 'pro' => 99999,
            default => 50,
        };
        if ($shop->products()->where('is_archived', false)->count() >= $maxProducts) {
            return back()->withErrors([
                'stock' => "Limite de produits atteinte pour votre pack ({$maxProducts} produits max). Passez au pack Pro pour un catalogue illimité !"
            ])->withInput();
        }

        // Upload images
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $imageFile) {
                $path = $imageFile->store('products', 'public');
                $imagePaths[] = $path;
            }
        }

        $slug = Str::slug($validated['name']);
        $count = Product::where('slug', 'like', "{$slug}%")->count();
        if ($count > 0) {
            $slug = $slug . '-' . time();
        }

        $product = Product::create([
            'shop_id' => $shop->id,
            'name' => $validated['name'],
            'slug' => $slug,
            'sku' => $validated['sku'] ?? strtoupper(Str::random(8)),
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'weight' => $validated['weight'] ?? null,
            'stock' => (int)$validated['stock'],
            'alert_threshold' => $validated['alert_threshold'] ?? 5,
            'stock_status' => (int)$validated['stock'] > 0 ? 'in_stock' : 'out_of_stock',
            'image_paths' => $imagePaths,
            'is_active' => true,
        ]);

        ActivityLog::log(
            $request->user()->id,
            'product_created',
            "Produit \"{$product->name}\" ajouté dans la boutique \"{$shop->name}\" avec {$product->stock} unités en stock."
        );

        return redirect()->route('seller.shop.products.index', $shop->slug)
            ->with('success', 'Produit créé avec succès.');
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Request $request, Shop $shop, Product $product): InertiaResponse
    {
        $seller = $request->user()->seller;

        if (!$seller || $shop->seller_id !== $seller->id || $product->shop_id !== $shop->id) {
            abort(403, 'Accès non autorisé.');
        }

        return Inertia::render('Seller/Product/Edit', [
            'shop' => $shop,
            'product' => $product,
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, Shop $shop, Product $product): RedirectResponse
    {
        $seller = $request->user()->seller;

        if (!$seller || $shop->seller_id !== $seller->id || $product->shop_id !== $shop->id) {
            abort(403, 'Accès non autorisé.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100',
            'price' => 'required|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'alert_threshold' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
            'keep_images' => 'nullable|array',
        ]);

        $keptImages = $request->input('keep_images', []);
        $currentImages = $product->image_paths ?? [];
        $imagesToDelete = array_diff($currentImages, $keptImages);

        foreach ($imagesToDelete as $oldImagePath) {
            Storage::disk('public')->delete($oldImagePath);
        }

        $imagePaths = $keptImages;

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $imageFile) {
                $path = $imageFile->store('products', 'public');
                $imagePaths[] = $path;
            }
        }

        $newStock = (int)$validated['stock'];

        $product->update([
            'name' => $validated['name'],
            'sku' => $validated['sku'] ?? $product->sku,
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'weight' => $validated['weight'] ?? $product->weight,
            'stock' => $newStock,
            'alert_threshold' => $validated['alert_threshold'] ?? $product->alert_threshold,
            'stock_status' => $newStock > 0 ? 'in_stock' : 'out_of_stock',
            'image_paths' => $imagePaths,
        ]);

        ActivityLog::log(
            $request->user()->id,
            'product_updated',
            "Produit \"{$product->name}\" mis à jour dans la boutique \"{$shop->name}\"."
        );

        return redirect()->route('seller.shop.products.index', $shop->slug)
            ->with('success', 'Produit mis à jour avec succès.');
    }

    /**
     * Duplicate a product.
     */
    public function duplicate(Request $request, Shop $shop, Product $product): RedirectResponse
    {
        $seller = $request->user()->seller;

        if (!$seller || $shop->seller_id !== $seller->id || $product->shop_id !== $shop->id) {
            abort(403, 'Accès non autorisé.');
        }

        $newProduct = $product->replicate();
        $newProduct->name = $product->name . ' (Copie)';
        $newProduct->slug = Str::slug($newProduct->name) . '-' . time();
        $newProduct->sku = strtoupper(Str::random(8));
        $newProduct->save();

        ActivityLog::log(
            $request->user()->id,
            'product_duplicated',
            "Duplication du produit \"{$product->name}\"."
        );

        return redirect()->route('seller.shop.products.index', $shop->slug)
            ->with('success', 'Produit dupliqué avec succès.');
    }

    /**
     * Soft archive a product (preserves historical order data).
     */
    public function archive(Request $request, Shop $shop, Product $product): RedirectResponse
    {
        $seller = $request->user()->seller;

        if (!$seller || $shop->seller_id !== $seller->id || $product->shop_id !== $shop->id) {
            abort(403, 'Accès non autorisé.');
        }

        $product->update([
            'is_archived' => true,
            'is_active' => false,
        ]);

        ActivityLog::log(
            $request->user()->id,
            'product_archived',
            "Archivage du produit \"{$product->name}\"."
        );

        return redirect()->route('seller.shop.products.index', $shop->slug)
            ->with('success', "Le produit \"{$product->name}\" a été archivé.");
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Request $request, Shop $shop, Product $product): RedirectResponse
    {
        $seller = $request->user()->seller;

        if (!$seller || $shop->seller_id !== $seller->id || $product->shop_id !== $shop->id) {
            abort(403, 'Accès non autorisé.');
        }

        $imagePaths = $product->image_paths ?? [];
        foreach ($imagePaths as $path) {
            Storage::disk('public')->delete($path);
        }

        $productName = $product->name;
        $product->delete();

        ActivityLog::log(
            $request->user()->id,
            'product_deleted',
            "Suppression du produit \"{$productName}\"."
        );

        return redirect()->route('seller.shop.products.index', $shop->slug)
            ->with('success', "Le produit \"{$productName}\" a été supprimé.");
    }
}
