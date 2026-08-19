<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\SellerWallet;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    private function getCart(Request $request)
    {
        $userId = auth()->id();
        $sessionId = $request->session()->getId();

        return Cart::where('user_id', $userId)
            ->orWhere('session_id', $sessionId)
            ->first();
    }

    /**
     * Display checkout page.
     */
    public function show(Request $request)
    {
        $cart = $this->getCart($request);

        if (!$cart) {
            return redirect()->route('public.cart.index')->with('error', 'Votre panier est vide.');
        }

        $cartItems = CartItem::where('cart_id', $cart->id)
            ->with(['product.shop', 'product.activePromotion'])
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('public.cart.index')->with('error', 'Votre panier est vide.');
        }

        $formattedItems = $cartItems->map(function ($item) {
            $product = $item->product;
            $hasPromo = $product && $product->activePromotion !== null;
            $basePrice = $hasPromo ? (float)$product->activePromotion->promo_price : (float)$product->price;

            $unitPrice = $basePrice;
            if ($item->quantity >= 10) {
                $unitPrice = $basePrice * 0.90;
            } elseif ($item->quantity >= 5) {
                $unitPrice = $basePrice * 0.95;
            }

            return [
                'id' => $item->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'quantity' => $item->quantity,
                'unit_price' => round($unitPrice, 2),
                'subtotal' => round($unitPrice * $item->quantity, 2),
                'shop' => [
                    'id' => $product->shop->id,
                    'name' => $product->shop->name,
                    'slug' => $product->shop->slug,
                    'seller_id' => $product->shop->seller_id,
                ]
            ];
        });

        $subtotal = $formattedItems->sum('subtotal');
        $shippingFee = 1500; // Fixed shipping per order
        $grandTotal = $subtotal + $shippingFee;

        $user = auth()->user();

        return Inertia::render('Public/Checkout/Index', [
            'items' => $formattedItems,
            'subtotal' => $subtotal,
            'shippingFee' => $shippingFee,
            'grandTotal' => $grandTotal,
            'customerName' => $user ? "{$user->first_name} {$user->last_name}" : '',
            'customerPhone' => $user ? $user->phone : '',
        ]);
    }

    /**
     * Process checkout with Escrow hold.
     */
    public function process(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'delivery_address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'payment_method' => 'required|in:orange_money,mtn_momo,bank_transfer',
        ]);

        $cart = $this->getCart($request);

        if (!$cart) {
            return redirect()->route('public.cart.index')->with('error', 'Panier introuvable.');
        }

        $cartItems = CartItem::where('cart_id', $cart->id)
            ->with(['product.shop.seller', 'product.activePromotion'])
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('public.cart.index')->with('error', 'Votre panier est vide.');
        }

        // Group items by shop_id
        $itemsByShop = $cartItems->groupBy(fn($item) => $item->product->shop_id);

        $createdOrders = [];

        DB::transaction(function () use ($itemsByShop, $request, &$createdOrders, $cart) {
            foreach ($itemsByShop as $shopId => $items) {
                $shop = $items->first()->product->shop;
                $seller = $shop->seller;

                // Calculate order amounts
                $orderSubtotal = 0;
                $orderItemsData = [];

                foreach ($items as $item) {
                    $product = $item->product;
                    $hasPromo = $product->activePromotion !== null;
                    $basePrice = $hasPromo ? (float)$product->activePromotion->promo_price : (float)$product->price;

                    $unitPrice = $basePrice;
                    if ($item->quantity >= 10) {
                        $unitPrice = $basePrice * 0.90;
                    } elseif ($item->quantity >= 5) {
                        $unitPrice = $basePrice * 0.95;
                    }

                    $itemSubtotal = round($unitPrice * $item->quantity, 2);
                    $orderSubtotal += $itemSubtotal;

                    $orderItemsData[] = [
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'unit_price' => round($unitPrice, 2),
                        'quantity' => $item->quantity,
                        'subtotal' => $itemSubtotal,
                    ];

                    // Deduct product stock
                    $product->decrement('stock', $item->quantity);
                }

                $shippingFee = 1500;
                $totalAmount = $orderSubtotal + $shippingFee;

                // Create Order
                $order = Order::create([
                    'user_id' => auth()->id(),
                    'shop_id' => $shopId,
                    'customer_name' => $request->customer_name,
                    'customer_phone' => $request->customer_phone,
                    'delivery_address' => $request->delivery_address,
                    'city' => $request->city,
                    'subtotal' => $orderSubtotal,
                    'shipping_fee' => $shippingFee,
                    'total_amount' => $totalAmount,
                    'payment_method' => $request->payment_method,
                    'payment_status' => 'escrow_held',
                    'delivery_status' => 'pending',
                ]);

                // Create Order Items
                foreach ($orderItemsData as $itemData) {
                    $itemData['order_id'] = $order->id;
                    OrderItem::create($itemData);
                }

                // Credit seller's wallet pending_balance (Escrow Hold)
                if ($seller) {
                    $wallet = SellerWallet::firstOrCreate(['seller_id' => $seller->id]);
                    $wallet->increment('pending_balance', $orderSubtotal);

                    WalletTransaction::create([
                        'wallet_id' => $wallet->id,
                        'type' => 'credit_escrow',
                        'amount' => $orderSubtotal,
                        'reference' => $order->order_number,
                        'description' => "Vente sous séquestre Escrow (Commande #{$order->order_number})",
                        'status' => 'completed',
                    ]);
                }

                $createdOrders[] = $order;
            }

            // Clear Cart
            CartItem::where('cart_id', $cart->id)->delete();
        });

        // Redirect to order success page
        $firstOrder = $createdOrders[0] ?? null;

        if (auth()->check()) {
            return redirect()->route('customer.orders.index')->with('success', "Commande de " . count($createdOrders) . " boutique(s) validée avec succès ! Fonds consignés sous séquestre Escrow.");
        }

        return redirect()->route('public.order_tracking', $firstOrder ? $firstOrder->order_number : 'success')
            ->with('success', "Votre commande a été enregistrée avec succès ! Code de livraison OTP généré.");
    }
}
