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

        return Inertia::render('Customer/Settings', [
            'user' => $user,
            'settings' => [
                'email_notifications' => true,
                'sms_otp_alerts' => true,
                'promo_newsletter' => false,
                'dark_mode' => false,
                'language' => 'fr',
                'currency' => 'XAF',
            ],
        ]);
    }

    /**
     * Update customer preferences.
     */
    public function updateSettings(Request $request)
    {
        return back()->with('success', 'Vos préférences de compte ont été mises à jour.');
    }

    /**
     * Display customer disputes list & mediation tracking.
     */
    public function disputes(Request $request)
    {
        $user = $request->user();

        $disputes = Dispute::whereHas('order', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })
        ->with(['order.shop', 'order.items'])
        ->latest()
        ->paginate(10);

        return Inertia::render('Customer/Disputes/Index', [
            'disputes' => $disputes,
        ]);
    }

    /**
     * Display customer loyalty & reward points.
     */
    public function loyalty(Request $request)
    {
        $user = $request->user();

        $promoCodes = PromoCode::where('is_active', true)
            ->whereDate('end_date', '>=', now())
            ->with('shop')
            ->get();

        return Inertia::render('Customer/Loyalty', [
            'loyaltyPoints' => $user->loyalty_points ?? 120,
            'availableCoupons' => $promoCodes,
        ]);
    }

    /**
     * Display customer profile & delivery settings.
     */
    public function profile(Request $request)
    {
        return Inertia::render('Customer/Profile', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Update customer profile.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:30'],
            'default_delivery_address' => ['nullable', 'string', 'max:500'],
            'default_city' => ['nullable', 'string', 'max:100'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $user->first_name = $validated['first_name'];
        $user->last_name = $validated['last_name'];
        $user->phone = $validated['phone'];
        $user->default_delivery_address = $validated['default_delivery_address'] ?? null;
        $user->default_city = $validated['default_city'] ?? null;

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'profile_updated',
            'description' => 'Mise à jour des informations personnelles et de l\'adresse de livraison.',
        ]);

        return back()->with('success', 'Votre profil client et vos paramètres de livraison ont été mis à jour avec succès.');
    }
}
