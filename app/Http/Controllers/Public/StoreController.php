<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Shop;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * Display the public marketplace product catalog (Alibaba / Marketplace layout).
     */
    public function indexProducts(Request $request)
    {
        $query = Product::where('products.is_archived', false)
            ->where('products.is_active', true)
            ->where('products.stock', '>', 0)
            ->with(['shop.seller.user', 'activePromotion']);

        // Search by keyword
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('products.name', 'like', "%{$search}%")
                  ->orWhere('products.description', 'like', "%{$search}%");
            });
        }

        // Filter by shop slug
        if ($request->filled('shop_slug')) {
            $query->whereHas('shop', function ($q) use ($request) {
                $q->where('slug', $request->input('shop_slug'));
            });
        }

        // Filter by promo
        if ($request->boolean('on_sale')) {
            $query->whereHas('activePromotion');
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('products.price', '>=', $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('products.price', '<=', $request->input('max_price'));
        }

        $products = $query->latest('products.created_at')->paginate(16)->withQueryString();

        // Daily Deals / Flash Sale Products
        $featuredDeals = Product::where('is_archived', false)
            ->where('is_active', true)
            ->where('stock', '>', 0)
            ->whereHas('activePromotion')
            ->with(['shop.seller.user', 'activePromotion'])
            ->take(6)
            ->get();

        // Top Verified Shops with RCCM & Ratings
        $topShops = Shop::where('is_active', true)
            ->where('is_holiday_mode', false)
            ->with(['seller.user', 'products' => function ($q) {
                $q->where('is_archived', false)->where('is_active', true);
            }])
            ->take(8)
            ->get();

        // Categories List with static icons
        $categories = [
            ['id' => 'tech', 'name' => 'High-Tech & Smartphones', 'count' => 124, 'icon' => 'Smartphone'],
            ['id' => 'fashion', 'name' => 'Mode & Accessoires', 'count' => 88, 'icon' => 'Shirt'],
            ['id' => 'home', 'name' => 'Maison, Déco & Électroménager', 'count' => 54, 'icon' => 'Home'],
            ['id' => 'beauty', 'name' => 'Beauté & Santé', 'count' => 42, 'icon' => 'Sparkles'],
            ['id' => 'auto', 'name' => 'Auto & Moto', 'count' => 31, 'icon' => 'Car'],
            ['id' => 'sports', 'name' => 'Sports & Loisirs', 'count' => 29, 'icon' => 'Activity'],
        ];

        return Inertia::render('Public/Products/Index', [
            'products' => $products,
            'featuredDeals' => $featuredDeals,
            'topShops' => $topShops,
            'categories' => $categories,
            'filters' => $request->only(['search', 'shop_slug', 'on_sale', 'min_price', 'max_price']),
        ]);
    }

    /**
     * Display a detailed product page with seller and shop profile.
     */
    public function showProduct(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->where('is_archived', false)
            ->with(['shop.seller.user', 'activePromotion'])
            ->firstOrFail();

        // Fetch related products from the same shop
        $relatedProducts = Product::where('shop_id', $product->shop_id)
            ->where('id', '!=', $product->id)
            ->where('is_archived', false)
            ->where('is_active', true)
            ->with(['activePromotion'])
            ->latest()
            ->take(4)
            ->get();

        return Inertia::render('Public/Products/Show', [
            'product' => $product,
            'shop' => $product->shop,
            'seller' => $product->shop->seller,
            'sellerUser' => $product->shop->seller->user,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Display the public directory of verified shops.
     */
    public function indexShops(Request $request)
    {
        $query = Shop::where('is_active', true)
            ->with(['seller.user', 'products' => function ($q) {
                $q->where('is_archived', false)->where('is_active', true);
            }]);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slogan', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        $shops = $query->latest()->paginate(9)->withQueryString();

        return Inertia::render('Public/Shops/Index', [
            'shops' => $shops,
            'filters' => $request->only(['search']),
        ]);
    }
}
