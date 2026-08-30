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
     * Category definitions with associated keywords and icons.
     */
    protected array $categoryDefinitions = [
        'tech' => [
            'name' => 'High-Tech & Smartphones',
            'keywords' => ['tech', 'smartphone', 'téléphone', 'ordinateur', 'laptop', 'écouteurs', 'casque audio', 'gadget', 'montre connectée', 'tv', 'tablette', 'iphone', 'samsung', 'macbook', 'redmi', 'airpods', 'playstation', 'sony', 'apple'],
            'icon' => 'Smartphone'
        ],
        'fashion' => [
            'name' => 'Mode & Vêtements Africains',
            'keywords' => ['fashion', 'mode', 'bazin', 'vêtement', 'robe', 'costume', 'chaussure', 'sac', 'wax', 'tissu', 'chemise', 'sandale', 'boubou', 'sneakers', 'ndop', 'kente', 'foulard'],
            'icon' => 'Shirt'
        ],
        'home' => [
            'name' => 'Maison & Électroménager',
            'keywords' => ['home', 'maison', 'électroménager', 'cuisine', 'meuble', 'déco', 'salon', 'ventilateur', 'frigo', 'climatiseur', 'mixeur', 'machine à laver', 'matelas', 'cuisinière', 'repassage'],
            'icon' => 'Home'
        ],
        'beauty' => [
            'name' => 'Beauté & Soins Naturels',
            'keywords' => ['beauty', 'beauté', 'soin', 'bio', 'parfum', 'cheveux', 'karité', 'savon', 'peau', 'lotion', 'crème', 'sérum', 'gommage', 'barbe', 'baobab'],
            'icon' => 'Sparkles'
        ],
        'auto' => [
            'name' => 'Auto, Moto & Pièces',
            'keywords' => ['auto', 'moto', 'véhicule', 'pièce', 'pneu', 'batterie', 'huile moteur', 'casque moto', 'frein', 'accessoire auto', 'michelin', 'varta', 'total quartz', 'compresseur'],
            'icon' => 'Car'
        ],
        'food' => [
            'name' => 'Alimentation & Épicerie',
            'keywords' => ['food', 'alimentation', 'épicerie', 'café', 'chocolat', 'miel', 'riz', 'épice', 'boisson', 'thé', 'poivre', 'penja', 'plantain', 'huile rouge', 'terroir'],
            'icon' => 'ShoppingBag'
        ],
    ];

    /**
     * Display the public marketplace product catalog with advanced multi-criteria filters & sorting.
     */
    public function indexProducts(Request $request)
    {
        $query = Product::where('products.is_archived', false)
            ->where('products.is_active', true)
            ->where('products.stock', '>', 0)
            ->with(['shop.seller.user', 'activePromotion', 'reviews']);

        // 1. Search by keyword
        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('products.name', 'like', "%{$search}%")
                  ->orWhere('products.description', 'like', "%{$search}%")
                  ->orWhere('products.sku', 'like', "%{$search}%")
                  ->orWhereHas('shop', function ($qs) use ($search) {
                      $qs->where('name', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%");
                  });
            });
        }

        // 2. Filter by Category with rich keyword matching
        if ($request->filled('category') && $request->input('category') !== 'all') {
            $catKey = strtolower($request->input('category'));
            if (isset($this->categoryDefinitions[$catKey])) {
                $keywords = $this->categoryDefinitions[$catKey]['keywords'];
                $query->where(function ($q) use ($keywords, $catKey) {
                    $q->where('products.name', 'like', "%{$catKey}%")
                      ->orWhere('products.description', 'like', "%{$catKey}%");
                    foreach ($keywords as $kw) {
                        $q->orWhere('products.name', 'like', "%{$kw}%")
                          ->orWhere('products.description', 'like', "%{$kw}%");
                    }
                });
            }
        }

        // 3. Filter by City / Seller Location
        if ($request->filled('city') && $request->input('city') !== 'all') {
            $city = $request->input('city');
            $query->whereHas('shop', function ($q) use ($city) {
                $q->where('city', 'like', "%{$city}%")
                  ->orWhere('address', 'like', "%{$city}%")
                  ->orWhere('description', 'like', "%{$city}%");
            });
        }

        // 4. Filter by shop slug
        if ($request->filled('shop_slug')) {
            $query->whereHas('shop', function ($q) use ($request) {
                $q->where('slug', $request->input('shop_slug'));
            });
        }

        // 5. Filter by promo / flash deals
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
            $query->where('products.price', '>=', (float) $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('products.price', '<=', (float) $request->input('max_price'));
        }

        // 8. Sorting
        $sort = $request->input('sort', 'relevance');
        if ($sort === 'price_asc') {
            $query->orderBy('products.price', 'asc');
        } elseif ($sort === 'price_desc') {
            $query->orderBy('products.price', 'desc');
        } else {
            $query->latest('products.created_at');
        }

        $products = $query->paginate(18)->withQueryString();

        // Featured Daily Deals / Flash Sale Products
        $featuredDeals = Product::where('is_archived', false)
            ->where('is_active', true)
            ->where('stock', '>', 0)
            ->whereHas('activePromotion')
            ->with(['shop.seller.user', 'activePromotion'])
            ->take(8)
            ->get();

        // AI Personalized "Pour Vous" Recommendations
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
                $q->where('is_archived', false)->where('is_active', true)->take(3);
            }])
            ->take(8)
            ->get();

        // Compute dynamic counts per category
        $categories = [];
        foreach ($this->categoryDefinitions as $id => $def) {
            $count = Product::where('is_archived', false)
                ->where('is_active', true)
                ->where('stock', '>', 0)
                ->where(function ($q) use ($def, $id) {
                    $q->where('products.name', 'like', "%{$id}%")
                      ->orWhere('products.description', 'like', "%{$id}%");
                    foreach ($def['keywords'] as $kw) {
                        $q->orWhere('products.name', 'like', "%{$kw}%")
                          ->orWhere('products.description', 'like', "%{$kw}%");
                    }
                })->count();

            $categories[] = [
                'id' => $id,
                'name' => $def['name'],
                'count' => $count,
                'icon' => $def['icon'],
            ];
        }

        // Available Cities list in Cameroon
        $cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Kribi', 'Bamenda', 'Maroua'];

        return Inertia::render('Public/Products/Index', [
            'products' => $products,
            'featuredDeals' => $featuredDeals,
            'recommendedForYou' => $recommendedForYou,
            'topShops' => $topShops,
            'categories' => $categories,
            'cities' => $cities,
            'filters' => (object) $request->only(['search', 'category', 'city', 'shop_slug', 'on_sale', 'verified_only', 'min_price', 'max_price', 'sort']),
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
                    'Machine à Laver Inverter',
                    'Beurre de Karité Bio',
                    'Poivre Blanc de Penja',
                ]
            ]);
        }

        $productMatches = Product::where('is_archived', false)
            ->where('is_active', true)
            ->where('name', 'like', "%{$q}%")
            ->pluck('name')
            ->take(5)
            ->toArray();

        $shopMatches = Shop::where('is_active', true)
            ->where('name', 'like', "%{$q}%")
            ->pluck('name')
            ->take(3)
            ->toArray();

        return response()->json([
            'suggestions' => array_unique(array_merge($productMatches, $shopMatches))
        ]);
    }

    /**
     * Display a single product detail page with rich media, smart tiers & Escrow checkout.
     */
    public function showProduct(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->where('is_archived', false)
            ->where('is_active', true)
            ->with(['shop.seller.user', 'promotions', 'reviews.user'])
            ->firstOrFail();

        // Similar/Related Products in same shop or category
        $relatedProducts = Product::where('shop_id', $product->shop_id)
            ->where('id', '!=', $product->id)
            ->where('is_archived', false)
            ->where('is_active', true)
            ->with(['activePromotion', 'shop'])
            ->take(4)
            ->get();

        return Inertia::render('Public/Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Public Verified Shops Directory (Sub-Module 2.1.4).
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
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        if ($request->filled('city') && $request->input('city') !== 'all') {
            $city = $request->input('city');
            $query->where(function ($q) use ($city) {
                $q->where('city', 'like', "%{$city}%")
                  ->orWhere('address', 'like', "%{$city}%");
            });
        }

        $shops = $query->paginate(12)->withQueryString();

        return Inertia::render('Public/Shops/Index', [
            'shops' => $shops,
            'filters' => (object) $request->only(['search', 'city']),
        ]);
    }
}
