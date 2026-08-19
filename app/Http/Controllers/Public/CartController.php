<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Get or create active cart instance for user or session.
     */
    private function getCart(Request $request)
    {
        $userId = auth()->id();
        $sessionId = $request->session()->getId();

        if ($userId) {
            $cart = Cart::firstOrCreate(['user_id' => $userId]);
        } else {
            $cart = Cart::firstOrCreate(['session_id' => $sessionId]);
        }

        return $cart;
    }

    /**
     * Display the shopping cart page.
     */
    public function index(Request $request)
    {
        $cart = $this->getCart($request);

        $cartItems = CartItem::where('cart_id', $cart->id)
            ->with(['product.shop', 'product.activePromotion'])
            ->get();

        // Calculate tier pricing and group by shop
        $itemsFormatted = $cartItems->map(function ($item) {
            $product = $item->product;
            $hasPromo = $product && $product->activePromotion !== null;
            $basePrice = $hasPromo ? (float)$product->activePromotion->promo_price : (float)$product->price;

            // Apply MOQ Wholesale Discounts
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
                'slug' => $product->slug,
                'image' => $product->image_paths && count($product->image_paths) > 0 ? "/storage/" . $product->image_paths[0] : null,
                'stock' => $product->stock,
                'quantity' => $item->quantity,
                'base_price' => $basePrice,
                'unit_price' => round($unitPrice, 2),
                'subtotal' => round($unitPrice * $item->quantity, 2),
                'shop' => [
                    'id' => $product->shop->id,
                    'name' => $product->shop->name,
                    'slug' => $product->shop->slug,
                    'city' => $product->shop->city ?? 'Douala',
                ],
            ];
        });

        // Group by shop ID
        $groupedByShop = $itemsFormatted->groupBy(fn($item) => $item['shop']['id']);

        $grandTotal = $itemsFormatted->sum('subtotal');

        return Inertia::render('Public/Cart/Index', [
            'cartItems' => $itemsFormatted,
            'groupedShops' => $groupedByShop,
            'grandTotal' => $grandTotal,
        ]);
    }

    /**
     * Add item to cart.
     */
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);
        $cart = $this->getCart($request);

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $newQuantity = min($cartItem->quantity + $request->quantity, $product->stock);
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => min($request->quantity, $product->stock),
            ]);
        }

        return back()->with('success', "{$product->name} ajouté au panier avec succès !");
    }

    /**
     * Update item quantity in cart.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::with('product')->findOrFail($id);
        $newQuantity = min($request->quantity, $cartItem->product->stock);
        $cartItem->update(['quantity' => $newQuantity]);

        return back()->with('success', 'Quantité mise à jour.');
    }

    /**
     * Remove item from cart.
     */
    public function remove($id)
    {
        $cartItem = CartItem::findOrFail($id);
        $cartItem->delete();

        return back()->with('success', 'Article retiré du panier.');
    }

    /**
     * Clear cart.
     */
    public function clear(Request $request)
    {
        $cart = $this->getCart($request);
        CartItem::where('cart_id', $cart->id)->delete();

        return back()->with('success', 'Votre panier a été vidé.');
    }
}
