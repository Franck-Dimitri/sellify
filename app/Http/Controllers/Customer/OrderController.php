<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Dispute;
use App\Models\Order;
use App\Models\ProductReview;
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
            ->with(['shop', 'items.product', 'driver.user', 'dispute', 'reviews'])
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
            ->with(['shop.seller.user', 'items.product', 'driver.user', 'dispute', 'reviews'])
            ->firstOrFail();

        return Inertia::render('Customer/Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Cancel an order before dispatch (status pending or preparing).
     */
    public function cancelOrder(Request $request, string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('user_id', auth()->id())
            ->with(['shop.seller', 'items.product'])
            ->firstOrFail();

        if (!in_array($order->delivery_status, ['pending', 'preparing'])) {
            return back()->with('error', 'Cette commande ne peut plus être annulée car elle est déjà en cours de livraison ou livrée.');
        }

        DB::transaction(function () use ($order) {
            // Restore product stock
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->increment('stock', $item->quantity);
                }
            }

            // Reverse seller escrow pending balance
            $seller = $order->shop->seller;
            if ($seller && $order->payment_status === 'escrow_held') {
                $wallet = SellerWallet::firstOrCreate(['seller_id' => $seller->id]);
                $amountToDecrement = (float) min((float) $wallet->pending_balance, (float) $order->total_amount);
                if ($amountToDecrement > 0) {
                    $wallet->decrement('pending_balance', $amountToDecrement);
                }

                WalletTransaction::create([
                    'wallet_id' => $wallet->id,
                    'type' => 'debit_escrow',
                    'amount' => $order->total_amount,
                    'reference' => $order->order_number,
                    'description' => "Annulation de commande par le client (Commande #{$order->order_number})",
                    'status' => 'completed',
                ]);
            }

            $order->update([
                'delivery_status' => 'cancelled',
                'payment_status' => 'refunded',
            ]);

            ActivityLog::create([
                'user_id' => auth()->id(),
                'action' => 'order_cancelled_by_customer',
                'description' => "Le client a annulé la commande #{$order->order_number}. Fonds sous séquestre restitués.",
            ]);
        });

        return back()->with('success', 'Votre commande a été annulée et le remboursement sous séquestre a été déclenché.');
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
                $amountToRelease = (float) $order->total_amount;
                $pendingToDeduct = (float) min((float) $wallet->pending_balance, $amountToRelease);
                if ($pendingToDeduct > 0) {
                    $wallet->decrement('pending_balance', $pendingToDeduct);
                }
                $wallet->increment('balance', $amountToRelease);

                WalletTransaction::create([
                    'wallet_id' => $wallet->id,
                    'type' => 'release_escrow',
                    'amount' => $amountToRelease,
                    'reference' => $order->order_number,
                    'description' => "Libération des fonds séquestres (Commande #{$order->order_number} livrée & confirmée)",
                    'status' => 'completed',
                ]);
                ActivityLog::create([
                    'user_id' => auth()->id(),
                    'action' => 'escrow_released',
                    'description' => "Le client a confirmé la réception du colis pour la commande #{$order->order_number}. Fonds séquestres débloqués.",
                ]);
            }
        });

        return back()->with('success', 'Merci ! Votre confirmation a libéré les fonds séquestres en toute sécurité au vendeur.');
    }

    /**
     * Submit a rating and review for an item in a delivered order.
     * (Sub-Module 2.1.9: Double notation Vendeur 1-5★ + Livreur 1-5★ + Photos réelles)
     */
    public function submitReview(Request $request, string $orderNumber)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'driver_rating' => 'nullable|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'photo' => 'nullable|image|max:4096',
        ]);

        $order = Order::where('order_number', $orderNumber)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        if ($order->delivery_status !== 'delivered' && $order->payment_status !== 'released') {
            return back()->with('error', 'Vous devez avoir reçu votre commande pour déposer un avis.');
        }

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('review_photos', 'public');
        }

        ProductReview::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'order_id' => $order->id,
                'product_id' => $request->product_id,
            ],
            [
                'shop_id' => $order->shop_id,
                'rating' => $request->rating,
                'driver_rating' => $request->driver_rating ?? 5,
                'comment' => $request->comment,
                'photo_path' => $photoPath,
            ]
        );

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'product_review_submitted',
            'description' => "Avis laissé sur le produit #{$request->product_id} pour la commande #{$order->order_number}.",
        ]);

        return back()->with('success', 'Votre avis vérifié et évaluation livreur ont été publiés avec succès !');
    }

    /**
     * Re-order in 1 click: add order products to cart (Sub-Module 2.1.8).
     */
    public function reorder(Request $request, string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('user_id', auth()->id())
            ->with('items.product')
            ->firstOrFail();

        $cart = \App\Models\Cart::firstOrCreate(['user_id' => auth()->id()]);

        foreach ($order->items as $item) {
            if ($item->product && $item->product->is_active && $item->product->stock > 0) {
                $existingItem = \App\Models\CartItem::where('cart_id', $cart->id)
                    ->where('product_id', $item->product_id)
                    ->first();

                if ($existingItem) {
                    $existingItem->increment('quantity', $item->quantity);
                } else {
                    \App\Models\CartItem::create([
                        'cart_id' => $cart->id,
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                    ]);
                }
            }
        }

        return redirect()->route('public.cart.index')->with('success', "Les articles de la commande #{$order->order_number} ont été réajoutés à votre panier !");
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

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'dispute_opened',
            'description' => "Ouverture d'une réclamation / litige sur la commande #{$order->order_number}.",
        ]);

        return back()->with('success', 'Votre réclamation a été transmise au service d\'arbitrage Sellify. L\'administrateur va examiner le dossier.');
    }

    /**
     * Printable Official Invoice / Receipt for Customer.
     */
    public function invoice(string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->where('user_id', auth()->id())
            ->with(['shop.seller.user', 'items.product', 'driver.user'])
            ->firstOrFail();

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'invoice_viewed',
            'description' => "Téléchargement / consultation de la facture officielle #{$order->order_number}.",
        ]);

        return Inertia::render('Customer/Orders/Invoice', [
            'order' => $order,
        ]);
    }
}
