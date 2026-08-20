<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\SellerWallet;
use App\Models\WalletTransaction;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display all platform orders.
     */
    public function index(Request $request): InertiaResponse
    {
        $query = Order::with(['user', 'shop.seller', 'driver.user', 'items.product']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($u) use ($search) {
                      $u->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('shop', function ($s) use ($search) {
                      $s->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('delivery_status', $request->input('status'));
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        $stats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::whereIn('delivery_status', ['pending', 'preparing'])->count(),
            'in_transit_orders' => Order::where('delivery_status', 'in_transit')->count(),
            'delivered_orders' => Order::where('delivery_status', 'delivered')->count(),
            'cancelled_orders' => Order::where('delivery_status', 'cancelled')->count(),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    /**
     * Display Escrow transactions management.
     */
    public function escrow(Request $request): InertiaResponse
    {
        $query = Order::with(['user', 'shop.seller', 'driver.user'])
            ->whereIn('payment_status', ['escrow_held', 'released', 'refunded']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($u) use ($search) {
                      $u->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('shop', function ($s) use ($search) {
                      $s->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('payment_status') && $request->input('payment_status') !== 'all') {
            $query->where('payment_status', $request->input('payment_status'));
        }

        $escrowOrders = $query->latest()->paginate(15)->withQueryString();

        $totalVolume = Order::whereIn('payment_status', ['escrow_held', 'released'])->sum('total_amount');
        $escrowHeld = Order::where('payment_status', 'escrow_held')->sum('total_amount');
        $released = Order::where('payment_status', 'released')->sum('total_amount');
        $refunded = Order::where('payment_status', 'refunded')->sum('total_amount');

        $stats = [
            'total_volume' => (float) $totalVolume,
            'escrow_held' => (float) $escrowHeld,
            'released' => (float) $released,
            'refunded' => (float) $refunded,
            'platform_commission' => (float) ($totalVolume * 0.03),
        ];

        return Inertia::render('Admin/Escrow/Index', [
            'orders' => $escrowOrders,
            'filters' => $request->only(['search', 'payment_status']),
            'stats' => $stats,
        ]);
    }

    /**
     * Admin forces Escrow hold release to Seller.
     */
    public function forceReleaseEscrow(Request $request, string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->with('shop.seller')->firstOrFail();

        if ($order->payment_status === 'released') {
            return back()->with('info', 'Cette consigne Escrow a déjà été libérée.');
        }

        DB::transaction(function () use ($order) {
            $order->update([
                'delivery_status' => 'delivered',
                'payment_status' => 'released',
                'delivered_at' => now(),
            ]);

            $seller = $order->shop ? $order->shop->seller : null;
            if ($seller) {
                $wallet = SellerWallet::firstOrCreate(['seller_id' => $seller->id]);
                $amountToRelease = (float) $order->total_amount;
                $pendingToDeduct = (float) min((float) $wallet->pending_balance, $amountToRelease);

                if ($pendingToDeduct > 0) {
                    $wallet->decrement('pending_balance', $pendingToDeduct);
                }
                $wallet->increment('balance', $amountToRelease);

                WalletTransaction::create([
                    'wallet_id' => $wallet->id,
                    'type' => 'credit_escrow',
                    'amount' => $amountToRelease,
                    'reference' => $order->order_number,
                    'description' => "Libération manuelle du séquestre par l'Administrateur (Commande #{$order->order_number})",
                    'status' => 'completed',
                ]);
            }

            ActivityLog::create([
                'user_id' => auth()->id(),
                'action' => 'admin_escrow_forced_release',
                'description' => "L'administrateur a forcé la libération des fonds Escrow de " . number_format($order->total_amount, 0, ',', ' ') . " FCFA au vendeur pour la commande #{$order->order_number}.",
            ]);
        });

        return back()->with('success', "Les fonds sous séquestre de la commande #{$order->order_number} ont été versés au vendeur.");
    }

    /**
     * Admin forces Escrow refund to Buyer.
     */
    public function forceRefundEscrow(Request $request, string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->with('shop.seller', 'items.product')->firstOrFail();

        if ($order->payment_status === 'refunded') {
            return back()->with('info', 'Cette commande a déjà été remboursée.');
        }

        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->increment('stock', $item->quantity);
                }
            }

            $order->update([
                'delivery_status' => 'cancelled',
                'payment_status' => 'refunded',
            ]);

            $seller = $order->shop ? $order->shop->seller : null;
            if ($seller) {
                $wallet = SellerWallet::firstOrCreate(['seller_id' => $seller->id]);
                $pendingToDeduct = (float) min((float) $wallet->pending_balance, (float) $order->total_amount);
                if ($pendingToDeduct > 0) {
                    $wallet->decrement('pending_balance', $pendingToDeduct);
                }
            }

            ActivityLog::create([
                'user_id' => auth()->id(),
                'action' => 'admin_escrow_forced_refund',
                'description' => "L'administrateur a forcé le remboursement intégral de " . number_format($order->total_amount, 0, ',', ' ') . " FCFA à l'acheteur pour la commande #{$order->order_number}.",
            ]);
        });

        return back()->with('success', "La commande #{$order->order_number} a été annulée et le remboursement sous séquestre a été effectué.");
    }

    /**
     * Admin locks/freezes Escrow hold due to investigation.
     */
    public function lockEscrow(Request $request, string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        $order->update([
            'payment_status' => 'escrow_held',
            'delivery_status' => 'disputed',
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'admin_escrow_locked',
            'description' => "L'administrateur a gelé/bloqué temporairement les fonds sous séquestre de la commande #{$order->order_number} pour examen de litige.",
        ]);

        return back()->with('success', "Les fonds sous séquestre de la commande #{$order->order_number} ont été gelés pour investigation.");
    }

    /**
     * Display single order inspection page.
     */
    public function show(string $orderNumber): InertiaResponse
    {
        $order = Order::where('order_number', $orderNumber)
            ->with(['user', 'shop.seller.user', 'driver.user', 'items.product', 'dispute'])
            ->firstOrFail();

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Display single escrow conscription inspection page.
     */
    public function escrowShow(string $orderNumber): InertiaResponse
    {
        $order = Order::where('order_number', $orderNumber)
            ->with(['user', 'shop.seller.user', 'driver.user', 'items.product', 'dispute'])
            ->firstOrFail();

        return Inertia::render('Admin/Escrow/Show', [
            'order' => $order,
        ]);
    }
}
