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

        if ($seller && $seller->shop()->exists()) {
            return redirect()->route('seller.dashboard')
                ->with('error', 'Vous possédez déjà une boutique. Le pack Starter est limité à une seule boutique.');
        }

        return Inertia::render('Seller/Shop/Create');
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

        if ($seller->shop()->exists()) {
            return redirect()->route('seller.dashboard')
                ->with('error', 'Vous possédez déjà une boutique.');
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
            'social_links' => 'nullable|array',
            'theme_color' => ['nullable', 'string', 'regex:/^#[a-fA-F0-9]{6}$/'],
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
            'social_links' => $validated['social_links'] ?? null,
            'theme_color' => $validated['theme_color'] ?? '#EAB308',
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
     * Show the public shop page.
     */
    public function showPublic(string $slug): InertiaResponse
    {
        $shop = Shop::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Load seller & user for contact details if needed
        $shop->load(['seller.user']);

        return Inertia::render('Shop/Show', [
            'shop' => $shop,
            // In the future we will load products here:
            'products' => []
        ]);
    }
}
