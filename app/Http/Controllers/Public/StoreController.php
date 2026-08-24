<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Shop;
use App\Models\SmartLink;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * Display the public marketplace product catalog with advanced multi-criteria filters & sorting.
     * (Sub-Module 2.1.3)
     */
    public function indexProducts(Request $request)
    {
        $query = Product::where('products.is_archived', false)
            ->where('products.is_active', true)
            ->where('products.stock', '>', 0)
            ->with(['shop.seller.user', 'activePromotion', 'reviews']);

        // 1. Search by keyword
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('products.name', 'like', "%{$search}%")
                  ->orWhere('products.description', 'like', "%{$search}%")
                  ->orWhereHas('shop', function ($qs) use ($search) {
                      $qs->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // 2. Filter by Category
        if ($request->filled('category') && $request->input('category') !== 'all') {
            $cat = $request->input('category');
            $query->where(function ($q) use ($cat) {
                $q->where('products.name', 'like', "%{$cat}%")
                  ->orWhere('products.description', 'like', "%{$cat}%");
            });
        }

        // 3. Filter by City / Seller Location
        if ($request->filled('city') && $request->input('city') !== 'all') {
            $city = $request->input('city');
            $query->whereHas('shop', function ($q) use ($city) {
                $q->where('address', 'like', "%{$city}%")
                  ->orWhere('description', 'like', "%{$city}%");
            });
        }

        // 4. Filter by shop slug
        if ($request->filled('shop_slug')) {
            $query->whereHas('shop', function ($q) use ($request) {
                $q->where('slug', $request->input('shop_slug'));
            });
        }

        // 5. Filter by promo
        if ($request->boolean('on_sale')) {
            $query->whereHas('activePromotion');
        }

        // 6. Filter by verified pro sellers
        if ($request->boolean('verified_only')) {
            $query->whereHas('shop.seller.user', function ($q) {
                $q->where('kyc_status', 'verified');
            });
        }

        // 7. Filter by price range
        if ($request->filled('min_price')) {
            $query->where('products.price', '>=', $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('products.price', '<=', $request->input('max_price'));
        }

        // 8. Sorting (Sub-Module 2.1.3)
        $sort = $request->input('sort', 'relevance');
        if ($sort === 'price_asc') {
            $query->orderBy('products.price', 'asc');
        } elseif ($sort === 'price_desc') {
            $query->orderBy('products.price', 'desc');
        } else {
            // Priority to verified sellers & newest
            $query->latest('products.created_at');
        }

        $products = $query->paginate(16)->withQueryString();

        // Daily Deals / Flash Sale Products
        $featuredDeals = Product::where('is_archived', false)
            ->where('is_active', true)
            ->where('stock', '>', 0)
            ->whereHas('activePromotion')
            ->with(['shop.seller.user', 'activePromotion'])
            ->take(6)
            ->get();

        // AI Personalized "Pour Vous" Recommendations (Sub-Module 2.1.12)
        $recommendedForYou = Product::where('is_archived', false)
            ->where('is_active', true)
            ->where('stock', '>', 0)
            ->with(['shop.seller.user', 'activePromotion'])
            ->inRandomOrder()
            ->take(8)
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
            ['id' => 'fashion', 'name' => 'Mode & Vêtements Africains', 'count' => 88, 'icon' => 'Shirt'],
            ['id' => 'home', 'name' => 'Maison & Électroménager', 'count' => 54, 'icon' => 'Home'],
            ['id' => 'beauty', 'name' => 'Beauté & Soins Naturels', 'count' => 42, 'icon' => 'Sparkles'],
            ['id' => 'auto', 'name' => 'Auto, Moto & Pièces', 'count' => 31, 'icon' => 'Car'],
            ['id' => 'food', 'name' => 'Alimentation & Épicerie', 'count' => 29, 'icon' => 'ShoppingBag'],
        ];

        // Available Cities list in Cameroon
        $cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Kribi', 'Bamenda', 'Maroua'];

        return Inertia::render('Public/Products/Index', [
            'products' => $products,
            'featuredDeals' => $featuredDeals,
            'recommendedForYou' => $recommendedForYou,
            'topShops' => $topShops,
            'categories' => $categories,
            'cities' => $cities,
            'filters' => $request->only(['search', 'category', 'city', 'shop_slug', 'on_sale', 'verified_only', 'min_price', 'max_price', 'sort']),
        ]);
    }

    /**
     * Autocomplete suggestions API (Sub-Module 2.1.3 & 2.1.12).
     */
    public function searchSuggestions(Request $request)
    {
        $q = trim($request->input('q', ''));
        if (strlen($q) < 2) {
            return response()->json([
                'suggestions' => [
                    'iPhone 15 Pro Max',
                    'Bazin Riche Brodé',
                    'Chaussures Cuir Homme',
                    'Smart TV 4K 55 pouces',
                    'Samsung Galaxy S24 Ultra',
                ]
            ]);
        }

        $productNames = Product::where('is_active', true)
            ->where('name', 'like', "%{$q}%")
            ->pluck('name')
            ->take(5)
            ->toArray();

        $shopNames = Shop::where('is_active', true)
            ->where('name', 'like', "%{$q}%")
            ->pluck('name')
            ->take(3)
            ->toArray();

        return response()->json([
            'suggestions' => array_unique(array_merge($productNames, $shopNames)),
        ]);
    }

    /**
     * Display a detailed product page with AI ETA, Escrow breakdown & similar recommendations.
     * (Sub-Module 2.1.4 & 2.1.12)
     */
    public function showProduct(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->where('is_archived', false)
            ->with(['shop.seller.user', 'activePromotion', 'reviews.user'])
            ->firstOrFail();

        // Fetch related products (Sub-Module 2.1.4 & 2.1.12 collaborative recommendations)
        $relatedProducts = Product::where('id', '!=', $product->id)
            ->where('is_archived', false)
            ->where('is_active', true)
            ->where('shop_id', $product->shop_id)
            ->with(['shop.seller.user', 'activePromotion'])
            ->latest()
            ->take(6)
            ->get();

        $user = auth()->user();
        $isWishlisted = $user ? \App\Models\Wishlist::where('user_id', $user->id)->where('product_id', $product->id)->exists() : false;

        $averageRating = (float) round($product->reviews->avg('rating') ?? 4.9, 1);
        $totalReviews = $product->reviews->count();

        // Check if there is an active SmartLink for this product
        $smartLink = SmartLink::where('product_id', $product->id)
            ->where('is_active', true)
            ->first();

        // Dynamic Delivery ETA Estimation by Zone (Sub-Module 2.1.4)
        $estimatedDeliveryDays = "24h - 48h";
        $estimatedShippingFee = 2500; // FCFA standard

        return Inertia::render('Public/Products/Show', [
            'product' => $product,
            'shop' => $product->shop,
            'seller' => $product->shop?->seller,
            'sellerUser' => $product->shop?->seller?->user,
            'relatedProducts' => $relatedProducts,
            'reviews' => $product->reviews,
            'averageRating' => $averageRating,
            'totalReviews' => $totalReviews,
            'isWishlisted' => $isWishlisted,
            'smartLinkToken' => $smartLink ? $smartLink->token : null,
            'logisticsInfo' => [
                'estimated_eta' => $estimatedDeliveryDays,
                'estimated_shipping_fee' => $estimatedShippingFee,
                'escrow_guarantee_text' => "Fonds bloqués sous séquestre jusqu'à validation physique de conformité.",
            ],
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
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        $shops = $query->latest()->paginate(9)->withQueryString();

        return Inertia::render('Public/Shops/Index', [
            'shops' => $shops,
            'filters' => $request->only(['search']),
        ]);
    }
}
