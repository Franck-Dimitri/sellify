<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;

class ShopController extends Controller
{
    /**
     * Show the shop creation form.
     */
    public function create(Request $request): InertiaResponse|RedirectResponse
    {
        $seller = $request->user()->seller;
        $maxShops = $seller && $seller->pack === 'pro' ? 2 : 1;
        $reachedLimit = $seller && $seller->shops()->count() >= $maxShops;

        return Inertia::render('Seller/Shop/Create', [
            'reachedLimit' => $reachedLimit
        ]);
    }

    /**
     * Store a newly created shop.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $seller = $user->seller;

        if (!$seller) {
            return redirect()->route('login')->with('error', 'Compte vendeur non trouvé.');
        }

        $maxShops = $seller->pack === 'pro' ? 2 : 1;
        if ($seller->shops()->count() >= $maxShops) {
            return redirect()->route('seller.dashboard')
                ->with('error', "Vous possédez déjà {$maxShops} boutique(s). Votre pack actuel ne permet pas d'en créer d'autres.");
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slogan' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048', // Max 2MB
            'banner' => 'nullable|image|max:5120', // Max 5MB
            'company_name' => 'required|string|max:255',
            'registration_number' => 'nullable|string|max:100',
            'address' => 'required|string|max:255',
            'phone_contact' => 'required|string|max:50',
            'email_contact' => 'required|email|max:255',
            'opening_hours' => 'nullable|array',
            'social_links' => 'nullable|array',
            'theme_color' => ['nullable', 'string', 'regex:/^#[a-fA-F0-9]{6}$/'],
        ]);

        // Generate unique slug
        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $count = 1;
        while (Shop::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$count}";
            $count++;
        }

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('shops/logos', 'public');
        }

        $bannerPath = null;
        if ($request->hasFile('banner')) {
            $bannerPath = $request->file('banner')->store('shops/banners', 'public');
        }

        $shop = Shop::create([
            'seller_id' => $seller->id,
            'name' => $validated['name'],
            'slug' => $slug,
            'slogan' => $validated['slogan'] ?? null,
            'description' => $validated['description'] ?? null,
            'logo_path' => $logoPath,
            'banner_path' => $bannerPath,
            'company_name' => $validated['company_name'],
            'registration_number' => $validated['registration_number'] ?? null,
            'address' => $validated['address'],
            'phone_contact' => $validated['phone_contact'],
            'email_contact' => $validated['email_contact'],
            'opening_hours' => $validated['opening_hours'] ?? null,
            'social_links' => $validated['social_links'] ?? null,
            'theme_color' => $validated['theme_color'] ?? '#EAB308',
            'is_active' => true,
        ]);

        ActivityLog::log(
            $user->id,
            'shop_created',
            "Création de la boutique professionnelle : {$shop->name}."
        );

        return redirect()->route('seller.dashboard')
            ->with('success', 'Votre boutique professionnelle a été créée avec succès !');
    }

    /**
     * Show the local shop dashboard.
     */
    public function localDashboard(Request $request, Shop $shop): InertiaResponse|RedirectResponse
    {
        $seller = $request->user()->seller;

        if (!$seller || $shop->seller_id !== $seller->id) {
            abort(403, 'Accès non autorisé.');
        }

        return Inertia::render('Seller/Shop/LocalDashboard', [
            'shop' => $shop
        ]);
    }

    /**
     * Show the form for editing the shop.
     */
    public function edit(Request $request, Shop $shop): InertiaResponse|RedirectResponse
    {
        $seller = $request->user()->seller;

        if (!$seller || $shop->seller_id !== $seller->id) {
            abort(403, 'Accès non autorisé.');
        }

        return Inertia::render('Seller/Shop/Edit', [
            'shop' => $shop
        ]);
    }

    /**
     * Update the shop details.
     */
    public function update(Request $request, Shop $shop): RedirectResponse
    {
        $user = $request->user();
        $seller = $user->seller;

        if (!$seller || $shop->seller_id !== $seller->id) {
            abort(403, 'Accès non autorisé.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slogan' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048', // Max 2MB
            'banner' => 'nullable|image|max:5120', // Max 5MB
            'company_name' => 'required|string|max:255',
            'registration_number' => 'nullable|string|max:100',
            'address' => 'required|string|max:255',
            'phone_contact' => 'required|string|max:50',
            'email_contact' => 'required|email|max:255',
            'opening_hours' => 'nullable|array',
            'return_policy' => 'nullable|array',
            'shipping_settings' => 'nullable|array',
            'social_links' => 'nullable|array',
            'theme_color' => ['nullable', 'string', 'regex:/^#[a-fA-F0-9]{6}$/'],
            'is_holiday_mode' => 'nullable|boolean',
        ]);

        // Generate unique slug only if name changes
        if ($validated['name'] !== $shop->name) {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug;
            $count = 1;
            while (Shop::where('slug', $slug)->where('id', '!=', $shop->id)->exists()) {
                $slug = "{$baseSlug}-{$count}";
                $count++;
            }
            $shop->slug = $slug;
        }

        if ($request->hasFile('logo')) {
            if ($shop->logo_path) {
                Storage::disk('public')->delete($shop->logo_path);
            }
            $shop->logo_path = $request->file('logo')->store('shops/logos', 'public');
        }

        if ($request->hasFile('banner')) {
            if ($shop->banner_path) {
                Storage::disk('public')->delete($shop->banner_path);
            }
            $shop->banner_path = $request->file('banner')->store('shops/banners', 'public');
        }

        $shop->update([
            'name' => $validated['name'],
            'slogan' => $validated['slogan'] ?? null,
            'description' => $validated['description'] ?? null,
            'company_name' => $validated['company_name'],
            'registration_number' => $validated['registration_number'] ?? null,
            'address' => $validated['address'],
            'phone_contact' => $validated['phone_contact'],
            'email_contact' => $validated['email_contact'],
            'opening_hours' => $validated['opening_hours'] ?? null,
            'return_policy' => $validated['return_policy'] ?? null,
            'shipping_settings' => $validated['shipping_settings'] ?? null,
            'social_links' => $validated['social_links'] ?? null,
            'theme_color' => $validated['theme_color'] ?? '#EAB308',
            'is_holiday_mode' => $validated['is_holiday_mode'] ?? $shop->is_holiday_mode,
        ]);

        ActivityLog::log(
            $user->id,
            'shop_updated',
            "Mise à jour de la boutique professionnelle : {$shop->name}."
        );

        return redirect()->route('seller.shop.edit', $shop->slug)
            ->with('success', 'Votre boutique a été mise à jour avec succès.');
    }

    /**
     * Display a list of the seller's shops.
     */
    public function index(Request $request): InertiaResponse
    {
        $seller = $request->user()->seller;
        $shops = $seller ? $seller->shops()->get() : [];
        
        // Fetch activity logs for these shops
        $logs = ActivityLog::where('user_id', $request->user()->id)
            ->whereIn('action', ['shop_created', 'shop_updated', 'shop_deleted'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Seller/Shop/Index', [
            'shops' => $shops,
            'logs' => $logs,
            'pack' => $seller ? $seller->pack : 'starter'
        ]);
    }

    /**
     * Delete a shop.
     */
    public function destroy(Request $request, Shop $shop): RedirectResponse
    {
        $user = $request->user();
        $seller = $user->seller;

        if (!$seller || $shop->seller_id !== $seller->id) {
            abort(403, 'Accès non autorisé.');
        }

        // Delete logo and banner if they exist
        if ($shop->logo_path) {
            Storage::disk('public')->delete($shop->logo_path);
        }
        if ($shop->banner_path) {
            Storage::disk('public')->delete($shop->banner_path);
        }

        $shopName = $shop->name;
        $shop->delete();

        ActivityLog::log(
            $user->id,
            'shop_deleted',
            "Suppression de la boutique professionnelle : {$shopName}."
        );

        return redirect()->route('seller.shop.index')
            ->with('success', "La boutique \"{$shopName}\" a été supprimée avec succès.");
    }

    /**
     * Show the public shop page.
     */
    public function showPublic(string $slug): InertiaResponse
    {
        $shop = Shop::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Load seller & user for contact details if needed
        $shop->load(['seller.user']);

        $products = $shop->products()
            ->with(['promotions'])
            ->where('is_active', true)
            ->latest()
            ->get();

        return Inertia::render('Shop/Show', [
            'shop' => $shop,
            'products' => $products
        ]);
    }

    /**
     * Process direct on-platform order for shop products under Escrow.
     */
    public function directCheckout(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'customer_name' => 'required|string|max:255',
            'phone_number' => 'required|string|min:8|max:20',
            'delivery_address' => 'required|string|max:500',
            'city_neighborhood' => 'nullable|string|max:255',
            'delivery_notes' => 'nullable|string|max:1000',
            'payment_method' => 'required|in:orange_money,mtn_momo',
        ]);

        $product = \App\Models\Product::with('shop', 'promotions')->findOrFail($validated['product_id']);

        $hasPromo = $product->promotions()->where('is_active', true)->where('end_date', '>=', now()->toDateString())->first();
        $unitPrice = $hasPromo ? $hasPromo->promo_price : $product->price;
        $totalPrice = $unitPrice * $validated['quantity'];

        $smartLinkService = app(\App\Services\SmartLinkService::class);
        $trackingCode = $smartLinkService->generateTrackingCode();

        $deliveryInfo = [
            'customer_name' => $validated['customer_name'],
            'phone_number' => $validated['phone_number'],
            'delivery_address' => $validated['delivery_address'],
            'city_neighborhood' => $validated['city_neighborhood'] ?? '',
            'delivery_notes' => $validated['delivery_notes'] ?? '',
            'payment_method' => $validated['payment_method'],
            'paid_at' => now()->toDateTimeString(),
            'current_step' => 'processing',
        ];

        \App\Models\SmartLink::create([
            'seller_id' => $product->shop->seller_id,
            'product_id' => $product->id,
            'title' => "Commande en ligne - {$product->name}",
            'token' => \Illuminate\Support\Str::random(32),
            'items' => [
                [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'quantity' => $validated['quantity'],
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                ]
            ],
            'total_price' => $totalPrice,
            'status' => 'paid',
            'tracking_code' => $trackingCode,
            'delivery_info' => $deliveryInfo,
        ]);

        // Decrement stock
        $product->decrement('stock', $validated['quantity']);

        return redirect()->route('public.order_tracking', ['tracking_code' => $trackingCode])
            ->with('success', 'Votre commande en ligne a été validée avec succès sous la garantie séquestre Sellify !');
    }
}
