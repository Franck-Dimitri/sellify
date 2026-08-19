<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Shop;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class OrderController extends Controller
{
    /**
     * Display a listing of orders for seller's shops.
     */
    public function index(Request $request): InertiaResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $shopIds = $seller->shops()->pluck('id');
        $shops = $seller->shops()->select('id', 'name', 'slug')->get();

        $selectedShopId = $request->input('shop_id');
        $status = $request->input('status', 'all');
        $paymentStatus = $request->input('payment_status', 'all');
        $search = $request->input('search');

        $query = Order::whereIn('shop_id', $shopIds)
            ->with(['shop:id,name,slug', 'items.product', 'driver.user:id,first_name,last_name,phone', 'dispute']);

        if ($selectedShopId && $selectedShopId !== 'all') {
            $query->where('shop_id', $selectedShopId);
        }

        if ($status && $status !== 'all') {
            $query->where('delivery_status', $status);
        }

        if ($paymentStatus && $paymentStatus !== 'all') {
            $query->where('payment_status', $paymentStatus);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_phone', 'like', "%{$search}%")
                    ->orWhere('delivery_address', 'like', "%{$search}%");
            });
        }

        // Aggregate statistics for seller orders
        $allOrdersQuery = Order::whereIn('shop_id', $shopIds);
        if ($selectedShopId && $selectedShopId !== 'all') {
            $allOrdersQuery->where('shop_id', $selectedShopId);
        }

        $stats = [
            'total' => (clone $allOrdersQuery)->count(),
            'pending_prep' => (clone $allOrdersQuery)->whereIn('delivery_status', ['pending', 'preparing'])->count(),
            'ready_for_pickup' => (clone $allOrdersQuery)->where('delivery_status', 'ready_for_pickup')->count(),
            'in_transit' => (clone $allOrdersQuery)->where('delivery_status', 'in_transit')->count(),
            'delivered' => (clone $allOrdersQuery)->where('delivery_status', 'delivered')->count(),
            'escrow_locked_amount' => (clone $allOrdersQuery)->where('payment_status', 'escrow_held')->sum('total_amount'),
            'total_revenue' => (clone $allOrdersQuery)->whereIn('payment_status', ['escrow_held', 'released'])->sum('total_amount'),
        ];

        $orders = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Seller/Orders/Index', [
            'orders' => $orders,
            'stats' => $stats,
            'shops' => $shops,
            'filters' => [
                'shop_id' => $selectedShopId ?? 'all',
                'status' => $status,
                'payment_status' => $paymentStatus,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display order detail.
     */
    public function show(Request $request, string $orderNumber): InertiaResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $shopIds = $seller->shops()->pluck('id');

        $order = Order::where('order_number', $orderNumber)
            ->whereIn('shop_id', $shopIds)
            ->with(['shop', 'items.product', 'driver.user', 'dispute'])
            ->firstOrFail();

        return Inertia::render('Seller/Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Update order delivery status by the seller.
     */
    public function updateStatus(Request $request, string $orderNumber): RedirectResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $shopIds = $seller->shops()->pluck('id');

        $order = Order::where('order_number', $orderNumber)
            ->whereIn('shop_id', $shopIds)
            ->firstOrFail();

        $validated = $request->validate([
            'status' => 'required|string|in:preparing,ready_for_pickup,cancelled',
        ]);

        $prevStatus = $order->delivery_status;
        $order->update([
            'delivery_status' => $validated['status'],
        ]);

        $statusLabels = [
            'preparing' => 'En préparation',
            'ready_for_pickup' => 'Prêt pour enlèvement livreur',
            'cancelled' => 'Annulée',
        ];

        ActivityLog::log(
            $request->user()->id,
            'order_status_updated',
            "Statut de la commande {$order->order_number} passé à : " . ($statusLabels[$validated['status']] ?? $validated['status'])
        );

        return back()->with('success', "Le statut de la commande {$order->order_number} a été mis à jour avec succès.");
    }

    /**
     * View and print packing slip.
     */
    public function printSlip(Request $request, string $orderNumber): InertiaResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $shopIds = $seller->shops()->pluck('id');

        $order = Order::where('order_number', $orderNumber)
            ->whereIn('shop_id', $shopIds)
            ->with(['shop', 'items.product', 'driver.user'])
            ->firstOrFail();

        return Inertia::render('Seller/Orders/PrintSlip', [
            'order' => $order,
        ]);
    }
}
