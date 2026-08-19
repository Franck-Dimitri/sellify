<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\Seller;
use App\Models\SellerWallet;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerCartAndOrderModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_add_item_to_cart_and_process_checkout_with_escrow()
    {
        // 1. Setup Seller & Shop
        $sellerUser = User::factory()->create(['role' => 'seller', 'first_name' => 'Vendeur', 'last_name' => 'Gros']);
        $seller = Seller::create([
            'user_id' => $sellerUser->id,
            'status' => 'approved',
            'pack' => 'pro',
            'activity_status' => 'available',
        ]);
        $shop = Shop::create([
            'seller_id' => $seller->id,
            'name' => 'Boutique Cameroun Gros',
            'company_name' => 'SARL Cameroun Gros',
            'slug' => 'boutique-cameroun-gros',
            'address' => 'Akwa Nord',
            'phone_contact' => '699112233',
            'email_contact' => 'gros@cameroun.cm',
            'city' => 'Douala',
        ]);
        $product = Product::create([
            'shop_id' => $shop->id,
            'name' => 'Smartphone Pro 5G',
            'slug' => 'smartphone-pro-5g',
            'price' => 100000,
            'stock' => 50,
            'is_active' => true,
        ]);

        // 2. Setup Buyer
        $buyer = User::factory()->create(['role' => 'customer', 'first_name' => 'Jean', 'last_name' => 'Dupont', 'phone' => '699001122']);
        $this->actingAs($buyer);

        // 3. Add to Cart
        $response = $this->post(route('public.cart.add'), [
            'product_id' => $product->id,
            'quantity' => 5, // 5 units -> 5% discount (95 000 FCFA / unit)
        ]);
        $response->assertSessionHasNoErrors();

        $cart = Cart::where('user_id', $buyer->id)->first();
        $this->assertNotNull($cart);
        $this->assertCount(1, $cart->items);

        // 4. View Cart
        $cartRes = $this->get(route('public.cart.index'));
        $cartRes->assertStatus(200);

        // 5. View Checkout Page
        $checkoutRes = $this->get(route('public.checkout.index'));
        $checkoutRes->assertStatus(200);

        // 6. Process Checkout
        $processRes = $this->post(route('public.checkout.process'), [
            'customer_name' => 'Jean Dupont',
            'customer_phone' => '699001122',
            'delivery_address' => 'Akwa, Rue Silo',
            'city' => 'Douala',
            'payment_method' => 'orange_money',
        ]);

        // Verify Order Created
        $order = Order::where('user_id', $buyer->id)->first();
        $this->assertNotNull($order);
        $this->assertEquals('escrow_held', $order->payment_status);
        $this->assertEquals('pending', $order->delivery_status);
        $this->assertEquals(6, strlen($order->delivery_otp));
        $this->assertCount(1, $order->items);

        // Verify Seller Wallet Escrow Pending Balance
        $wallet = SellerWallet::where('seller_id', $seller->id)->first();
        $this->assertNotNull($wallet);
        $this->assertEquals(475000, $wallet->pending_balance); // 5 * 95000

        // 7. Customer Confirms Delivery Receipt
        $confirmRes = $this->post(route('customer.orders.confirm', $order->order_number));
        $confirmRes->assertSessionHasNoErrors();

        $order->refresh();
        $wallet->refresh();
        $this->assertEquals('delivered', $order->delivery_status);
        $this->assertEquals('released', $order->payment_status);
        $this->assertEquals(0, $wallet->pending_balance);
        $this->assertEquals(475000, $wallet->balance);
    }
}
