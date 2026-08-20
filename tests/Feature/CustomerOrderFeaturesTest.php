<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\PromoCode;
use App\Models\Seller;
use App\Models\Shop;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerOrderFeaturesTest extends TestCase
{
    use RefreshDatabase;

    private User $customer;
    private User $sellerUser;
    private Shop $shop;
    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        // Create Customer
        $this->customer = User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'customer@test.com',
            'phone' => '699000111',
            'password' => bcrypt('password123'),
            'role' => 'customer',
            'email_verified_at' => now(),
        ]);

        // Create Seller & Shop
        $this->sellerUser = User::create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'seller@test.com',
            'phone' => '699000222',
            'password' => bcrypt('password123'),
            'role' => 'seller',
            'email_verified_at' => now(),
        ]);

        $seller = Seller::create([
            'user_id' => $this->sellerUser->id,
            'company_name' => 'Tech Shop SARL',
            'status' => 'approved',
        ]);

        $this->shop = Shop::create([
            'seller_id' => $seller->id,
            'name' => 'Tech Shop',
            'company_name' => 'Tech Shop SARL',
            'slug' => 'tech-shop',
            'address' => 'Akwa, Douala',
            'phone_contact' => '699112233',
            'email_contact' => 'contact@techshop.cm',
            'city' => 'Douala',
            'is_active' => true,
        ]);

        $this->product = Product::create([
            'shop_id' => $this->shop->id,
            'name' => 'Smartphone Pro',
            'slug' => 'smartphone-pro',
            'price' => 100000,
            'stock' => 20,
            'is_active' => true,
            'is_archived' => false,
        ]);
    }

    public function test_customer_can_toggle_wishlist()
    {
        $this->actingAs($this->customer);

        // Add to wishlist
        $response = $this->post(route('customer.wishlist.toggle', $this->product->id));
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('wishlists', [
            'user_id' => $this->customer->id,
            'product_id' => $this->product->id,
        ]);

        // Remove from wishlist
        $response = $this->post(route('customer.wishlist.toggle', $this->product->id));
        $response->assertSessionHas('info');
        $this->assertDatabaseMissing('wishlists', [
            'user_id' => $this->customer->id,
            'product_id' => $this->product->id,
        ]);
    }

    public function test_customer_can_cancel_pending_order()
    {
        $this->actingAs($this->customer);

        $order = Order::create([
            'user_id' => $this->customer->id,
            'shop_id' => $this->shop->id,
            'customer_name' => 'John Doe',
            'customer_phone' => '699000111',
            'delivery_address' => 'Akwa, Douala',
            'city' => 'Douala',
            'subtotal' => 100000,
            'shipping_fee' => 1500,
            'total_amount' => 101500,
            'payment_method' => 'orange_money',
            'payment_status' => 'escrow_held',
            'delivery_status' => 'pending',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'unit_price' => 100000,
            'quantity' => 1,
            'subtotal' => 100000,
        ]);

        $this->product->decrement('stock', 1); // 19 stock left

        $response = $this->post(route('customer.orders.cancel', $order->order_number));
        $response->assertSessionHas('success');

        $order->refresh();
        $this->assertEquals('cancelled', $order->delivery_status);
        $this->assertEquals('refunded', $order->payment_status);
        $this->assertEquals(20, $this->product->fresh()->stock); // Stock restored
    }

    public function test_customer_can_submit_verified_review_for_delivered_order()
    {
        $this->actingAs($this->customer);

        $order = Order::create([
            'user_id' => $this->customer->id,
            'shop_id' => $this->shop->id,
            'customer_name' => 'John Doe',
            'customer_phone' => '699000111',
            'delivery_address' => 'Akwa, Douala',
            'city' => 'Douala',
            'subtotal' => 100000,
            'shipping_fee' => 1500,
            'total_amount' => 101500,
            'payment_method' => 'orange_money',
            'payment_status' => 'released',
            'delivery_status' => 'delivered',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'unit_price' => 100000,
            'quantity' => 1,
            'subtotal' => 100000,
        ]);

        $response = $this->post(route('customer.orders.review', $order->order_number), [
            'product_id' => $this->product->id,
            'rating' => 5,
            'comment' => 'Excellente qualité et livraison rapide !',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('product_reviews', [
            'user_id' => $this->customer->id,
            'product_id' => $this->product->id,
            'rating' => 5,
            'comment' => 'Excellente qualité et livraison rapide !',
        ]);
    }

    public function test_customer_can_apply_and_remove_promo_code_at_checkout()
    {
        $promo = PromoCode::create([
            'shop_id' => $this->shop->id,
            'code' => 'PROMO10',
            'type' => 'percentage',
            'value' => 10,
            'start_date' => now()->subDay(),
            'end_date' => now()->addMonth(),
            'is_active' => true,
        ]);

        $cart = Cart::create(['user_id' => $this->customer->id]);
        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $this->product->id,
            'quantity' => 1,
        ]);

        $this->actingAs($this->customer);

        // Apply promo code
        $response = $this->post(route('public.checkout.promo.apply'), ['code' => 'PROMO10']);
        $response->assertSessionHas('success');
        $this->assertEquals('PROMO10', session('applied_promo.code'));

        // Remove promo code
        $response = $this->post(route('public.checkout.promo.remove'));
        $response->assertSessionHas('info');
        $this->assertNull(session('applied_promo'));
    }

    public function test_customer_can_update_default_delivery_address()
    {
        $this->actingAs($this->customer);

        $response = $this->post(route('customer.profile.update'), [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'phone' => '699000111',
            'default_delivery_address' => 'Bonanjo, Rue de la poste',
            'default_city' => 'Douala',
        ]);

        $response->assertSessionHas('success');
        $this->customer->refresh();
        $this->assertEquals('Bonanjo, Rue de la poste', $this->customer->default_delivery_address);
        $this->assertEquals('Douala', $this->customer->default_city);
    }
}
