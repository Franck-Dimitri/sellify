<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Shop;
use App\Models\Seller;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductReview;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CustomerOrdersAndReviewsTest extends TestCase
{
    use RefreshDatabase;

    protected User $customer;
    protected User $sellerUser;
    protected Shop $shop;
    protected Product $product;
    protected Order $order;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Setup Customer
        $this->customer = User::factory()->create([
            'first_name' => 'Paul',
            'last_name' => 'Ondobo',
            'email' => 'paul.ondobo@test.cm',
            'phone' => '+237690000000',
            'role' => 'customer',
            'status' => 'active',
            'loyalty_points' => 1500,
        ]);

        // 2. Setup Seller & Shop
        $this->sellerUser = User::factory()->create(['role' => 'seller', 'status' => 'active']);
        $seller = Seller::create(['user_id' => $this->sellerUser->id, 'store_name' => 'Tech Hub Cameroun']);
        $this->shop = Shop::create([
            'seller_id' => $seller->id,
            'name' => 'Tech Hub Cameroun',
            'company_name' => 'Tech Hub SARL',
            'slug' => 'tech-hub-cameroun',
            'address' => 'Akwa, Douala',
            'phone_contact' => '+237699112233',
            'email_contact' => 'techhub@test.cm',
            'city' => 'Douala',
            'is_active' => true,
        ]);

        // 3. Setup Product
        $this->product = Product::create([
            'shop_id' => $this->shop->id,
            'name' => 'iPhone 15 Pro Max',
            'slug' => 'iphone-15-pro-max',
            'price' => 850000,
            'stock' => 10,
            'is_active' => true,
            'is_archived' => false,
        ]);

        // 4. Setup Order
        $this->order = Order::create([
            'order_number' => 'SLF-2026-TEST01',
            'user_id' => $this->customer->id,
            'shop_id' => $this->shop->id,
            'customer_name' => 'Paul Ondobo',
            'customer_phone' => '+237690000000',
            'delivery_address' => 'Rue des Palmiers, Akwa Nord',
            'delivery_landmark' => 'Portail bleu face à la pharmacie',
            'city' => 'Douala',
            'subtotal' => 850000,
            'shipping_fee' => 1500,
            'total_amount' => 851500,
            'payment_method' => 'orange_money',
            'payment_status' => 'released',
            'delivery_status' => 'delivered',
            'delivery_otp' => '123456',
            'delivered_at' => now(),
        ]);

        OrderItem::create([
            'order_id' => $this->order->id,
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'unit_price' => 850000,
            'quantity' => 1,
            'subtotal' => 850000,
        ]);
    }

    public function test_customer_can_reorder_items_in_one_click(): void
    {
        $response = $this->actingAs($this->customer)->post(route('customer.orders.reorder', $this->order->order_number));

        $response->assertRedirect(route('public.cart.index'));

        $cart = Cart::where('user_id', $this->customer->id)->first();
        $this->assertNotNull($cart);

        $cartItem = CartItem::where('cart_id', $cart->id)->where('product_id', $this->product->id)->first();
        $this->assertNotNull($cartItem);
        $this->assertEquals(1, $cartItem->quantity);
    }

    public function test_customer_can_submit_review_with_driver_rating_and_photo(): void
    {
        Storage::fake('public');

        $response = $this->actingAs($this->customer)->post(route('customer.orders.review', $this->order->order_number), [
            'product_id' => $this->product->id,
            'rating' => 5,
            'driver_rating' => 4,
            'comment' => 'Produit conforme, livreur très poli et ponctuel !',
            'photo' => UploadedFile::fake()->image('proof.jpg'),
        ]);

        $response->assertRedirect();

        $review = ProductReview::where('order_id', $this->order->id)->where('product_id', $this->product->id)->first();
        $this->assertNotNull($review);
        $this->assertEquals(5, $review->rating);
        $this->assertEquals(4, $review->driver_rating);
        $this->assertNotNull($review->photo_path);
    }

    public function test_customer_can_view_invoice_and_search_suggestions(): void
    {
        // 1. Invoice
        $invResponse = $this->actingAs($this->customer)->get(route('customer.orders.invoice', $this->order->order_number));
        $invResponse->assertOk();

        // 2. Search Autocomplete API
        $sugResponse = $this->get(route('public.search.suggestions', ['q' => 'iPhone']));
        $sugResponse->assertOk();
        $sugResponse->assertJsonFragment(['suggestions' => ['iPhone 15 Pro Max']]);
    }

    public function test_customer_ai_chat_provides_contextual_order_and_escrow_info(): void
    {
        $response = $this->actingAs($this->customer)->postJson(route('ai.chat'), [
            'message' => 'Où est ma commande et comment marche le code OTP ?',
        ]);

        $response->assertOk();
        $data = $response->json();
        $this->assertNotEmpty($data['reply']);
        $this->assertStringContainsStringIgnoringCase('commande', $data['reply']);
        $this->assertStringContainsStringIgnoringCase('OTP', $data['reply']);
    }

    public function test_customer_can_access_disputes_loyalty_and_ai_pages(): void
    {
        $disputesRes = $this->actingAs($this->customer)->get(route('customer.disputes.index'));
        $disputesRes->assertOk();

        $loyaltyRes = $this->actingAs($this->customer)->get(route('customer.loyalty'));
        $loyaltyRes->assertOk();

        $aiRes = $this->actingAs($this->customer)->get(route('customer.ai.index'));
        $aiRes->assertOk();
    }
}
