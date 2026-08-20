<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ShopController extends Controller
{
    /**
     * Display a list of all seller shops with search, status filtering, and stats.
     */
    public function index(Request $request): InertiaResponse
    {
        $query = Shop::with(['seller.user', 'products'])
            ->withCount(['products', 'promotions']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('email_contact', 'like', "%{$search}%")
                  ->orWhereHas('seller.user', function ($u) use ($search) {
                      $u->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status')) {
            if ($request->input('status') === 'active') {
                $query->where('is_active', true);
            } elseif ($request->input('status') === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $shops = $query->latest()->paginate(12)->withQueryString();

        $stats = [
            'total_shops' => Shop::count(),
            'active_shops' => Shop::where('is_active', true)->count(),
            'inactive_shops' => Shop::where('is_active', false)->count(),
            'holiday_shops' => Shop::where('is_holiday_mode', true)->count(),
        ];

        return Inertia::render('Admin/Shops/Index', [
            'shops' => $shops,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    /**
     * Activate a shop.
     */
    public function activate(Request $request, Shop $shop)
    {
        $shop->update(['is_active' => true]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'admin_shop_activated',
            'description' => "L'administrateur a réactivé la boutique \"{$shop->name}\".",
        ]);

        return back()->with('success', "La boutique \"{$shop->name}\" a été réactivée avec succès.");
    }

    /**
     * Suspend a shop.
     */
    public function suspend(Request $request, Shop $shop)
    {
        $shop->update(['is_active' => false]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'admin_shop_suspended',
            'description' => "L'administrateur a suspendu la boutique \"{$shop->name}\".",
        ]);

        return back()->with('success', "La boutique \"{$shop->name}\" a été suspendue.");
    }

    /**
     * Display detailed shop page.
     */
    public function show(Shop $shop): InertiaResponse
    {
        $shop->load(['seller.user', 'products', 'promotions']);

        $orders = \App\Models\Order::where('shop_id', $shop->id)
            ->with(['user', 'driver.user'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Shops/Show', [
            'shop' => $shop,
            'orders' => $orders,
        ]);
    }
}
