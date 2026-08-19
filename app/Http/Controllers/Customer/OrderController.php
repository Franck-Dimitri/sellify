<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Dispute;
use App\Models\Order;
use App\Models\SellerWallet;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display customer's orders list.
     */
    public function index(Request $request)
    {
        $orders = Order::where('user_id', auth()->id())
            ->with(['shop', 'items.product', 'driver.user', 'dispute'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Customer/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display a single order detail.
     */
    public function show(string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('user_id', auth()->id())
            ->with(['shop.seller.user', 'items.product', 'driver.user', 'dispute'])
            ->firstOrFail();

        return Inertia::render('Customer/Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Customer confirms delivery receipt (Releases Escrow hold to Seller).
     */
    public function confirmDelivery(Request $request, string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('user_id', auth()->id())
            ->with('shop.seller')
            ->firstOrFail();

        if ($order->delivery_status === 'delivered' && $order->payment_status === 'released') {
            return back()->with('info', 'Cette commande a déjà été confirmée.');
        }

        DB::transaction(function () use ($order) {
            $order->update([
                'delivery_status' => 'delivered',
                'payment_status' => 'released',
                'delivered_at' => now(),
            ]);

            // Release Escrow funds from seller pending_balance to balance
            $seller = $order->shop->seller;
            if ($seller) {
                $wallet = SellerWallet::firstOrCreate(['seller_id' => $seller->id]);
                
                // Deduct from pending, add to available balance
                $amountToRelease = $order->subtotal;
                $wallet->decrement('pending_balance', min($wallet->pending_balance, $amountToRelease));
                $wallet->increment('balance', $amountToRelease);

                WalletTransaction::create([
                    'wallet_id' => $wallet->id,
                    'type' => 'release_escrow',
                    'amount' => $amountToRelease,
                    'reference' => $order->order_number,
                    'description' => "Libération des fonds séquestres (Commande #{$order->order_number} livrée & confirmée)",
                    'status' => 'completed',
                ]);
            }
        });

        return back()->with('success', 'Merci ! Votre confirmation a libéré les fonds séquestres en toute sécurité au vendeur.');
    }

    /**
     * Open a dispute for an order.
     */
    public function openDispute(Request $request, string $orderNumber)
    {
        $request->validate([
            'reason' => 'required|string|min:10|max:1000',
        ]);

        $order = Order::where('order_number', $orderNumber)
            ->where('user_id', auth()->id())
            ->with('shop.seller')
            ->firstOrFail();

        if ($order->dispute) {
            return back()->with('error', 'Un litige est déjà ouvert pour cette commande.');
        }

        Dispute::create([
            'order_id' => $order->id,
            'seller_id' => $order->shop->seller_id,
            'client_id' => auth()->id(),
            'reason' => $request->reason,
            'status' => 'open',
        ]);

        $order->update(['delivery_status' => 'cancelled']);

        return back()->with('success', 'Votre réclamation a été transmise au service d\'arbitrage Sellify. L\'administrateur va examiner le dossier.');
    }
}
