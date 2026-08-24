<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\PromoCode;
use App\Models\SellerWallet;
use App\Models\WalletTransaction;
use App\Models\User;
use App\Models\ActivityLog;
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
     * Display checkout page (Sub-Module 2.1.6 - Tunnel Escrow 10 étapes).
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
        $shippingFee = 1500; // Frais fixes de livraison standard par boutique
        
        // Calculate applied promo code discount from session if present
        $appliedPromo = $request->session()->get('applied_promo');
        $discount = 0;

        if ($appliedPromo) {
            if ($appliedPromo['type'] === 'percentage') {
                $discount = round($subtotal * ($appliedPromo['value'] / 100), 2);
            } else {
                $discount = min($subtotal, (float)$appliedPromo['value']);
            }
        }

        $grandTotal = max(0, $subtotal - $discount + $shippingFee);
        $user = auth()->user();

        // Customer's saved addresses with visual landmarks
        $savedAddresses = $user ? $user->addresses()->get() : [];
        $defaultAddress = $user ? $user->addresses()->where('is_default', true)->first() : null;

        return Inertia::render('Public/Checkout/Index', [
            'items' => $formattedItems,
            'subtotal' => $subtotal,
            'discount' => $discount,
            'appliedPromo' => $appliedPromo,
            'shippingFee' => $shippingFee,
            'grandTotal' => $grandTotal,
            'customerName' => $user ? "{$user->first_name} {$user->last_name}" : '',
            'customerPhone' => $user ? $user->phone : '',
            'momoNumber' => $user ? ($user->momo_number ?? $user->phone ?? '') : '',
            'omNumber' => $user ? ($user->om_number ?? '') : '',
            'preferredPaymentMethod' => $user ? ($user->preferred_payment_method ?? 'momo') : 'momo',
            'savedAddresses' => $savedAddresses,
            'defaultDeliveryAddress' => $defaultAddress ? $defaultAddress->address : ($user ? ($user->default_delivery_address ?? '') : ''),
            'defaultLandmark' => $defaultAddress ? $defaultAddress->landmark_description : '',
            'defaultCity' => $defaultAddress ? $defaultAddress->city : ($user ? ($user->default_city ?? 'Douala') : 'Douala'),
        ]);
    }

    /**
     * Apply a Promo Code to the checkout session.
     */
    public function applyPromoCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $code = strtoupper(trim($request->code));
        $promo = PromoCode::where('code', $code)
            ->where('is_active', true)
            ->whereDate('start_date', '<=', now())
            ->whereDate('end_date', '>=', now())
            ->first();

        if (!$promo) {
            return back()->with('error', "Le code promo \"{$code}\" n'est pas valide ou a expiré.");
        }

        if ($promo->usage_limit && $promo->used_count >= $promo->usage_limit) {
            return back()->with('error', "Le code promo \"{$code}\" a atteint son nombre maximal d'utilisations.");
        }

        $cart = $this->getCart($request);
        $cartSubtotal = 0;
        if ($cart) {
            $cartItems = CartItem::where('cart_id', $cart->id)->with('product.activePromotion')->get();
            foreach ($cartItems as $item) {
                $basePrice = $item->product->activePromotion ? (float)$item->product->activePromotion->promo_price : (float)$item->product->price;
                $unitPrice = $item->quantity >= 10 ? $basePrice * 0.90 : ($item->quantity >= 5 ? $basePrice * 0.95 : $basePrice);
                $cartSubtotal += $unitPrice * $item->quantity;
            }
        }

        if ($promo->min_order_amount && $cartSubtotal < $promo->min_order_amount) {
            return back()->with('error', "Ce code promo nécessite un panier minimum de " . number_format($promo->min_order_amount, 0, ',', ' ') . " FCFA.");
        }

        $request->session()->put('applied_promo', [
            'id' => $promo->id,
            'code' => $promo->code,
            'type' => $promo->type,
            'value' => (float)$promo->value,
            'shop_id' => $promo->shop_id,
        ]);

        return back()->with('success', "Code promo \"{$code}\" appliqué avec succès !");
    }

    /**
     * Remove applied promo code from checkout session.
     */
    public function removePromoCode(Request $request)
    {
        $request->session()->forget('applied_promo');
        return back()->with('info', 'Code promo retiré du panier.');
    }

    /**
     * Process checkout with Escrow hold & Loyalty points accumulation (Sub-Module 2.1.6 & 2.1.10).
     */
    public function process(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'delivery_address' => 'required|string|max:500',
            'delivery_landmark' => 'nullable|string|max:500',
            'city' => 'required|string|max:100',
            'payment_method' => 'required|in:orange_money,mtn_momo,bank_transfer,momo',
            'save_default_address' => 'nullable|boolean',
        ]);

        $user = auth()->user();

        // Optionally save as user default address
        if ($user && $request->save_default_address) {
            $user->update([
                'default_delivery_address' => $request->delivery_address,
                'default_city' => $request->city,
            ]);
        }

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

        // Applied promo info
        $appliedPromo = $request->session()->get('applied_promo');

        // Group items by shop_id
        $itemsByShop = $cartItems->groupBy(fn($item) => $item->product->shop_id);
        $createdOrders = [];
        $totalSpentAllOrders = 0;

        DB::transaction(function () use ($itemsByShop, $request, &$createdOrders, &$totalSpentAllOrders, $cart, $appliedPromo, $user) {
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

                // Apply promo discount if applicable to this shop or overall
                $orderDiscount = 0;
                if ($appliedPromo && (empty($appliedPromo['shop_id']) || $appliedPromo['shop_id'] == $shopId)) {
                    if ($appliedPromo['type'] === 'percentage') {
                        $orderDiscount = round($orderSubtotal * ($appliedPromo['value'] / 100), 2);
                    } else {
                        $orderDiscount = min($orderSubtotal, (float)$appliedPromo['value']);
                    }
                    
                    // Increment promo code used count
                    PromoCode::where('id', $appliedPromo['id'])->increment('used_count');
                }

                $shippingFee = 1500;
                $totalAmount = max(0, $orderSubtotal - $orderDiscount + $shippingFee);
                $totalSpentAllOrders += $totalAmount;

                // Create Order with visual landmark preserved
                $order = Order::create([
                    'user_id' => auth()->id(),
                    'shop_id' => $shopId,
                    'customer_name' => $request->customer_name,
                    'customer_phone' => $request->customer_phone,
                    'delivery_address' => $request->delivery_address,
                    'delivery_landmark' => $request->delivery_landmark,
                    'city' => $request->city,
                    'subtotal' => $orderSubtotal,
                    'shipping_fee' => $shippingFee,
                    'total_amount' => $totalAmount,
                    'payment_method' => $request->payment_method === 'momo' ? 'mtn_momo' : $request->payment_method,
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
                    $wallet->increment('pending_balance', $totalAmount);

                    WalletTransaction::create([
                        'wallet_id' => $wallet->id,
                        'type' => 'credit_escrow',
                        'amount' => $totalAmount,
                        'reference' => $order->order_number,
                        'description' => "Vente sous séquestre Escrow (Commande #{$order->order_number})",
                        'status' => 'completed',
                    ]);
                }

                $createdOrders[] = $order;
            }

            // Sub-Module 2.1.10: Accumulate Loyalty Points (1 FCFA = 1 pt)
            if ($user) {
                $earnedPoints = (int) round($totalSpentAllOrders);
                $user->increment('loyalty_points', $earnedPoints);

                ActivityLog::create([
                    'user_id' => $user->id,
                    'action' => 'points_earned',
                    'description' => "Gain de {$earnedPoints} points de fidélité pour vos achats.",
                ]);
            }

            // Clear Cart & Promo session
            CartItem::where('cart_id', $cart->id)->delete();
            $request->session()->forget('applied_promo');
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
