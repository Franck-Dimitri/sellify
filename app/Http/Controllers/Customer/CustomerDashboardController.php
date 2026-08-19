<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Shop;
use App\Models\Product;
use App\Models\Dispute;
use App\Models\PromoCode;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class CustomerDashboardController extends Controller
{
    /**
     * Display the Customer overview dashboard.
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
            ->with(['shop', 'items', 'driver.user'])
            ->latest()
            ->take(6)
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

        return Inertia::render('Customer/Dashboard', [
            'stats' => [
                'total_spent' => (float) $totalSpent,
                'active_orders' => $activeOrdersCount,
                'delivered_orders' => $deliveredOrdersCount,
                'disputed_orders' => $disputedOrdersCount,
                'loyalty_points' => $user->loyalty_points ?? 0,
            ],
            'recentOrders' => $recentOrders,
            'featuredShops' => $featuredShops,
            'recommendedProducts' => $recommendedProducts,
        ]);
    }

    /**
     * Display customer wishlist / saved items.
     */
    public function wishlist(Request $request)
    {
        $user = $request->user();

        // Get active products from shops
        $products = Product::where('is_active', true)
            ->where('stock', '>', 0)
            ->with('shop')
            ->latest()
            ->paginate(12);

        return Inertia::render('Customer/Wishlist', [
            'products' => $products,
        ]);
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
            'loyaltyPoints' => $user->loyalty_points ?? 0,
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
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $user->first_name = $validated['first_name'];
        $user->last_name = $validated['last_name'];
        $user->phone = $validated['phone'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'profile_updated',
            'description' => 'Mise à jour des informations personnelles du profil client.',
        ]);

        return back()->with('success', 'Votre profil client a été mis à jour avec succès.');
    }
}
