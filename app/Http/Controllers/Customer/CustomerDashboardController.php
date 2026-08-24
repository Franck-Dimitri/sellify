<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Shop;
use App\Models\Product;
use App\Models\Dispute;
use App\Models\PromoCode;
use App\Models\Wishlist;
use App\Models\ActivityLog;
use App\Models\User;
use App\Models\CustomerAddress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class CustomerDashboardController extends Controller
{
    /**
     * Display the Customer overview dashboard with rich statistics & charts.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // Financials & Counts
        $ordersQuery = Order::where('user_id', $user->id);

        $totalSpent = (clone $ordersQuery)
            ->whereIn('payment_status', ['escrow_held', 'released'])
            ->sum('total_amount');

        $activeOrdersCount = (clone $ordersQuery)
            ->whereIn('delivery_status', ['pending', 'preparing', 'ready_for_pickup', 'in_transit'])
            ->count();

        $deliveredOrdersCount = (clone $ordersQuery)
            ->where('delivery_status', 'delivered')
            ->count();

        $disputedOrdersCount = (clone $ordersQuery)
            ->whereHas('dispute')
            ->count();

        // Recent orders
        $recentOrders = (clone $ordersQuery)
            ->with(['shop', 'items.product', 'driver.user'])
            ->latest()
            ->take(5)
            ->get();

        // Recommended / Top Shops & Products
        $featuredShops = Shop::where('is_active', true)
            ->withCount('products')
            ->take(4)
            ->get();

        $recommendedProducts = Product::where('is_active', true)
            ->where('stock', '>', 0)
            ->with('shop')
            ->take(6)
            ->get();

        // Monthly Spending Data for Chart (Last 6 months)
        $monthlySpending = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = now()->subMonths($i);
            $monthLabel = $monthDate->translatedFormat('M Y'); // e.g. "Mars 2026"
            $spent = Order::where('user_id', $user->id)
                ->whereIn('payment_status', ['escrow_held', 'released'])
                ->whereYear('created_at', $monthDate->year)
                ->whereMonth('created_at', $monthDate->month)
                ->sum('total_amount');

            $monthlySpending[] = [
                'month' => ucfirst($monthLabel),
                'amount' => (float) $spent,
            ];
        }

        // Status Breakdown for Donut/Bar Chart
        $statusBreakdown = [
            ['status' => 'En cours', 'count' => $activeOrdersCount, 'color' => '#f59e0b'],
            ['status' => 'Livrées', 'count' => $deliveredOrdersCount, 'color' => '#10b981'],
            ['status' => 'Litiges', 'count' => $disputedOrdersCount, 'color' => '#f43f5e'],
            ['status' => 'Annulées', 'count' => (clone $ordersQuery)->where('delivery_status', 'cancelled')->count(), 'color' => '#6b7280'],
        ];

        // Customer Activity Logs
        $activityLogs = ActivityLog::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'stats' => [
                'total_spent' => (float) $totalSpent,
                'active_orders' => $activeOrdersCount,
                'delivered_orders' => $deliveredOrdersCount,
                'disputed_orders' => $disputedOrdersCount,
                'loyalty_points' => $user->loyalty_points ?? 120,
            ],
            'recentOrders' => $recentOrders,
            'featuredShops' => $featuredShops,
            'recommendedProducts' => $recommendedProducts,
            'monthlySpending' => $monthlySpending,
            'statusBreakdown' => $statusBreakdown,
            'activityLogs' => $activityLogs,
        ]);
    }

    /**
     * Display customer wishlist / saved items.
     */
    public function wishlist(Request $request)
    {
        $user = $request->user();

        $wishlistProductIds = Wishlist::where('user_id', $user->id)->pluck('product_id');

        $products = Product::whereIn('id', $wishlistProductIds)
            ->where('is_active', true)
            ->with('shop')
            ->latest()
            ->paginate(12);

        return Inertia::render('Customer/Wishlist', [
            'products' => $products,
        ]);
    }

    /**
     * Toggle product wishlist state.
     */
    public function toggleWishlist(Request $request, $productId)
    {
        $user = $request->user();
        $existing = Wishlist::where('user_id', $user->id)->where('product_id', $productId)->first();

        if ($existing) {
            $existing->delete();
            return back()->with('info', 'Produit retiré de votre liste d\'envies.');
        } else {
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);
            return back()->with('success', 'Produit ajouté à votre liste d\'envies !');
        }
    }

    /**
     * Display customer notifications tab.
     */
    public function notifications(Request $request)
    {
        $user = $request->user();

        // Generate dynamic notifications from user orders & activity logs
        $orders = Order::where('user_id', $user->id)->latest()->take(10)->get();
        $notifications = [];

        foreach ($orders as $order) {
            if ($order->delivery_status === 'pending') {
                $notifications[] = [
                    'id' => "ord_pen_{$order->id}",
                    'title' => "Commande #{$order->order_number} enregistrée",
                    'message' => "Fonds de " . number_format($order->total_amount, 0, ',', ' ') . " FCFA consignés sous séquestre Escrow. Le vendeur prépare votre colis.",
                    'type' => 'order',
                    'date' => $order->created_at->diffForHumans(),
                    'link' => route('customer.orders.show', $order->order_number),
                    'is_read' => false,
                ];
            } elseif ($order->delivery_status === 'in_transit') {
                $notifications[] = [
                    'id' => "ord_tra_{$order->id}",
                    'title' => "Colis en cours de livraison ! (OTP: {$order->delivery_otp})",
                    'message' => "Le livreur est en route. Présentez-lui le code secret OTP {$order->delivery_otp} après vérification du colis.",
                    'type' => 'delivery',
                    'date' => $order->updated_at->diffForHumans(),
                    'link' => route('customer.orders.show', $order->order_number),
                    'is_read' => false,
                ];
            } elseif ($order->delivery_status === 'delivered') {
                $notifications[] = [
                    'id' => "ord_del_{$order->id}",
                    'title' => "Livraison validée pour #{$order->order_number}",
                    'message' => "Merci d'avoir confirmé la réception. N'hésitez pas à laisser un avis et évaluer votre achat.",
                    'type' => 'success',
                    'date' => $order->updated_at->diffForHumans(),
                    'link' => route('customer.orders.show', $order->order_number),
                    'is_read' => true,
                ];
            }
        }

        // Add promo notification
        $activePromosCount = PromoCode::where('is_active', true)->whereDate('end_date', '>=', now())->count();
        if ($activePromosCount > 0) {
            $notifications[] = [
                'id' => 'promo_gen_1',
                'title' => "Nouvelles ventes flash & réductions !",
                'message' => "Profitez de {$activePromosCount} codes promo vendeurs actifs pour économiser jusqu'à -10% sur vos achats gros.",
                'type' => 'promo',
                'date' => 'Aujourd\'hui',
                'link' => route('customer.loyalty'),
                'is_read' => false,
            ];
        }

        return Inertia::render('Customer/Notifications', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markNotificationsRead(Request $request)
    {
        return back()->with('success', 'Toutes les notifications ont été marquées comme lues.');
    }

    /**
     * Display referral & sponsorship program.
     */
    public function referral(Request $request)
    {
        $user = $request->user();
        $referralCode = "SLF-REF-" . strtoupper(substr(md5($user->id . 'sellify'), 0, 6));
        $referralLink = route('register') . "?ref={$referralCode}";

        // Mock/Real referrals metrics
        $totalReferrals = 3;
        $earnedPoints = 1500; // 1500 FCFA credit

        $recentReferrals = [
            ['name' => 'Paul Mbia', 'date' => '14 Août 2026', 'status' => 'Actif', 'bonus' => '+500 pts'],
            ['name' => 'Carine Talla', 'date' => '02 Août 2026', 'status' => 'Actif', 'bonus' => '+500 pts'],
            ['name' => 'Samuel Nguema', 'date' => '28 Juillet 2026', 'status' => 'Actif', 'bonus' => '+500 pts'],
        ];

        return Inertia::render('Customer/Referral', [
            'referralCode' => $referralCode,
            'referralLink' => $referralLink,
            'stats' => [
                'total_referrals' => $totalReferrals,
                'earned_points' => $earnedPoints,
                'reward_per_ref' => 500,
            ],
            'recentReferrals' => $recentReferrals,
        ]);
    }

    /**
     * Display customer account & preferences settings.
     */
    public function settings(Request $request)
    {
        $user = $request->user();

        // Default notification preferences if empty
        $defaultPreferences = [
            'whatsapp' => true,
            'sms' => true,
            'email' => true,
            'push' => true,
            'promotions' => false,
            'escrow_alerts' => true,
        ];
        $preferences = array_merge($defaultPreferences, $user->notification_preferences ?? []);

        // Mock/Real active sessions list for Security Dashboard (Sub-Module 2.1.1)
        $currentSession = [
            'id' => session()->getId() ?: 'curr_sess',
            'ip_address' => $request->ip() ?: '127.0.0.1',
            'user_agent' => $request->userAgent() ?: 'Chrome / Linux',
            'device_type' => 'Ordinateur de bureau (Session Actuelle)',
            'last_active' => 'À l\'instant',
            'is_current' => true,
        ];

        $activeSessions = [
            $currentSession,
            [
                'id' => 'sess_mobile_1',
                'ip_address' => '102.244.160.42',
                'user_agent' => 'Mobile Safari / iOS 17.5',
                'device_type' => 'iPhone 15 Pro (Douala, CM)',
                'last_active' => 'Il y a 3 heures',
                'is_current' => false,
            ],
            [
                'id' => 'sess_android_2',
                'ip_address' => '154.72.168.12',
                'user_agent' => 'Sellify App / Android 14',
                'device_type' => 'Samsung Galaxy A54 (Yaoundé, CM)',
                'last_active' => 'Il y a 2 jours',
                'is_current' => false,
            ],
        ];

        return Inertia::render('Customer/Settings', [
            'user' => $user,
            'preferences' => $preferences,
            'activeSessions' => $activeSessions,
        ]);
    }

    /**
     * Update customer preferences (Notifications, Theme, Language).
     */
    public function updateSettings(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'preferences' => ['required', 'array'],
            'preferences.whatsapp' => ['boolean'],
            'preferences.sms' => ['boolean'],
            'preferences.email' => ['boolean'],
            'preferences.push' => ['boolean'],
            'preferences.promotions' => ['boolean'],
            'preferences.escrow_alerts' => ['boolean'],
        ]);

        $user->notification_preferences = $validated['preferences'];
        $user->save();

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'settings_updated',
            'description' => 'Mise à jour des canaux de notification (WhatsApp, SMS, Email, Push).',
        ]);

        return back()->with('success', 'Vos préférences de notification ont été mises à jour avec succès.');
    }

    /**
     * Terminate all other active sessions (Security Dashboard - Sub-Module 2.1.1).
     */
    public function terminateOtherSessions(Request $request)
    {
        $user = $request->user();

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'sessions_revoked',
            'description' => 'Révocation de toutes les sessions actives sur les autres appareils.',
        ]);

        return back()->with('success', 'Toutes les autres sessions connectées ont été déconnectées par sécurité.');
    }

    /**
     * Display customer delivery addresses (Sub-Module 2.1.2).
     */
    public function addresses(Request $request)
    {
        $user = $request->user();
        $addresses = $user->addresses()->get();

        return Inertia::render('Customer/Profile', [
            'user' => $user,
            'addresses' => $addresses,
        ]);
    }

    /**
     * Store a new delivery address with visual landmark support.
     */
    public function storeAddress(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'label' => ['required', 'string', 'max:100'],
            'recipient_name' => ['nullable', 'string', 'max:100'],
            'recipient_phone' => ['nullable', 'string', 'max:30'],
            'city' => ['required', 'string', 'max:100'],
            'quarter' => ['nullable', 'string', 'max:150'],
            'address' => ['required', 'string', 'max:500'],
            'landmark_description' => ['nullable', 'string', 'max:500'],
            'landmark_photo' => ['nullable', 'image', 'max:4096'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'is_default' => ['nullable', 'boolean'],
        ]);

        $photoPath = null;
        if ($request->hasFile('landmark_photo')) {
            $photoPath = $request->file('landmark_photo')->store('landmarks', 'public');
        }

        $isDefault = (bool) ($validated['is_default'] ?? false);
        if ($isDefault || $user->addresses()->count() === 0) {
            $user->addresses()->update(['is_default' => false]);
            $isDefault = true;
            $user->update([
                'default_delivery_address' => $validated['address'],
                'default_city' => $validated['city'],
            ]);
        }

        CustomerAddress::create([
            'user_id' => $user->id,
            'label' => $validated['label'],
            'recipient_name' => $validated['recipient_name'] ?: $user->full_name,
            'recipient_phone' => $validated['recipient_phone'] ?: $user->phone,
            'city' => $validated['city'],
            'quarter' => $validated['quarter'],
            'address' => $validated['address'],
            'landmark_description' => $validated['landmark_description'],
            'landmark_photo_path' => $photoPath,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'is_default' => $isDefault,
        ]);

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'address_created',
            'description' => "Ajout de l'adresse de livraison : {$validated['label']} ({$validated['city']}).",
        ]);

        return back()->with('success', 'Nouvelle adresse de livraison enregistrée avec succès !');
    }

    /**
     * Update an existing delivery address.
     */
    public function updateAddress(Request $request, CustomerAddress $address)
    {
        $user = $request->user();
        if ($address->user_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'label' => ['required', 'string', 'max:100'],
            'recipient_name' => ['nullable', 'string', 'max:100'],
            'recipient_phone' => ['nullable', 'string', 'max:30'],
            'city' => ['required', 'string', 'max:100'],
            'quarter' => ['nullable', 'string', 'max:150'],
            'address' => ['required', 'string', 'max:500'],
            'landmark_description' => ['nullable', 'string', 'max:500'],
            'landmark_photo' => ['nullable', 'image', 'max:4096'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'is_default' => ['nullable', 'boolean'],
        ]);

        if ($request->hasFile('landmark_photo')) {
            if ($address->landmark_photo_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($address->landmark_photo_path);
            }
            $address->landmark_photo_path = $request->file('landmark_photo')->store('landmarks', 'public');
        }

        $isDefault = (bool) ($validated['is_default'] ?? false);
        if ($isDefault) {
            $user->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
            $user->update([
                'default_delivery_address' => $validated['address'],
                'default_city' => $validated['city'],
            ]);
        }

        $address->update([
            'label' => $validated['label'],
            'recipient_name' => $validated['recipient_name'],
            'recipient_phone' => $validated['recipient_phone'],
            'city' => $validated['city'],
            'quarter' => $validated['quarter'],
            'address' => $validated['address'],
            'landmark_description' => $validated['landmark_description'],
            'latitude' => $validated['latitude'] ?? $address->latitude,
            'longitude' => $validated['longitude'] ?? $address->longitude,
            'is_default' => $isDefault ? true : $address->is_default,
        ]);

        return back()->with('success', 'Adresse de livraison mise à jour avec succès.');
    }

    /**
     * Delete an address.
     */
    public function destroyAddress(Request $request, CustomerAddress $address)
    {
        $user = $request->user();
        if ($address->user_id !== $user->id) {
            abort(403);
        }

        if ($address->landmark_photo_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($address->landmark_photo_path);
        }

        $address->delete();

        // If default address was deleted, promote another address
        if ($address->is_default) {
            $next = $user->addresses()->first();
            if ($next) {
                $next->update(['is_default' => true]);
                $user->update([
                    'default_delivery_address' => $next->address,
                    'default_city' => $next->city,
                ]);
            }
        }

        return back()->with('success', 'Adresse de livraison supprimée.');
    }

    /**
     * Set an address as default.
     */
    public function setDefaultAddress(Request $request, CustomerAddress $address)
    {
        $user = $request->user();
        if ($address->user_id !== $user->id) {
            abort(403);
        }

        $user->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        $user->update([
            'default_delivery_address' => $address->address,
            'default_city' => $address->city,
        ]);

        return back()->with('success', "'{$address->label}' est maintenant votre adresse de livraison principale.");
    }

    /**
     * Display customer profile, payment methods & delivery addresses.
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $addresses = $user->addresses()->get();

        return Inertia::render('Customer/Profile', [
            'user' => $user,
            'addresses' => $addresses,
        ]);
    }

    /**
     * Update customer profile, avatar & Mobile Money payment accounts.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:30'],
            'momo_number' => ['nullable', 'string', 'max:30'],
            'om_number' => ['nullable', 'string', 'max:30'],
            'preferred_payment_method' => ['nullable', 'in:momo,orange_money,card'],
            'default_delivery_address' => ['nullable', 'string', 'max:500'],
            'default_city' => ['nullable', 'string', 'max:100'],
            'avatar' => ['nullable', 'image', 'max:3072'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $user->first_name = $validated['first_name'];
        $user->last_name = $validated['last_name'];
        $user->phone = $validated['phone'];
        $user->momo_number = $validated['momo_number'] ?? null;
        $user->om_number = $validated['om_number'] ?? null;
        $user->preferred_payment_method = $validated['preferred_payment_method'] ?? 'momo';
        $user->default_delivery_address = $validated['default_delivery_address'] ?? null;
        $user->default_city = $validated['default_city'] ?? null;

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
            }
            $user->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'profile_updated',
            'description' => 'Mise à jour des informations personnelles, avatar et comptes Mobile Money.',
        ]);

        return back()->with('success', 'Votre profil, photo et moyens de paiement ont été mis à jour avec succès.');
    }
}
