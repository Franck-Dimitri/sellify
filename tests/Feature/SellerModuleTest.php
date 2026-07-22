<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Seller;
use App\Models\Shop;
use App\Models\Product;
use App\Models\SmartLink;
use App\Models\SubscriptionPack;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SellerModuleTest extends TestCase
{
    use RefreshDatabase;

    protected User $sellerUser;
    protected Seller $seller;
    protected Shop $shop;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\SubscriptionPackSeeder::class);

        $this->sellerUser = User::create([
            'first_name' => 'Jean',
            'last_name' => 'Vendeur',
            'email' => 'seller.test@sellify.me',
            'phone' => '+237699999999',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'seller',
            'kyc_status' => 'verified',
            'kyc_verified_at' => now(),
            'email_verified_at' => now(),
            'is_active' => true,
            'status' => 'active',
        ]);

        $this->seller = Seller::create([
            'user_id' => $this->sellerUser->id,
            'status' => 'approved',
            'is_verified' => true,
            'pack' => 'pro',
        ]);

        $this->shop = Shop::create([
            'seller_id' => $this->seller->id,
            'name' => 'Boutique Test',
            'slug' => 'boutique-test',
            'company_name' => 'Test SARL',
            'address' => 'Douala Akwa',
            'phone_contact' => '+237600000000',
            'email_contact' => 'shop@test.com',
            'is_active' => true,
        ]);
    }

    /** @test */
    public function test_seller_can_access_dashboard_and_submodules()
    {
        $this->actingAs($this->sellerUser);

        $this->get(route('seller.dashboard'))->assertStatus(200);
        $this->get(route('seller.inventory.index'))->assertStatus(200);
        $this->get(route('seller.subscription.index'))->assertStatus(200);
        $this->get(route('seller.wallet.index'))->assertStatus(200);
        $this->get(route('seller.smart_links.index'))->assertStatus(200);
        $this->get(route('seller.loans.index'))->assertStatus(200);
        $this->get(route('seller.analytics.index'))->assertStatus(200);
        $this->get(route('seller.disputes.index'))->assertStatus(200);
    }

    /** @test */
    public function test_seller_can_create_duplicate_and_archive_product()
    {
        $this->actingAs($this->sellerUser);

        $response = $this->post(route('seller.shop.products.store', $this->shop->slug), [
            'name' => 'iPhone 15 Pro',
            'price' => 750000,
            'stock' => 10,
            'sku' => 'IPH-15-PRO',
            'weight' => 0.25,
            'description' => 'Smartphone haut de gamme Apple',
        ]);

        $response->assertRedirect(route('seller.shop.products.index', $this->shop->slug));
        $this->assertDatabaseHas('products', ['name' => 'iPhone 15 Pro', 'sku' => 'IPH-15-PRO']);

        $product = Product::where('slug', 'iphone-15-pro')->first();

        // Duplicate
        $dupResponse = $this->post(route('seller.shop.products.duplicate', [$this->shop->slug, $product->slug]));
        $dupResponse->assertRedirect(route('seller.shop.products.index', $this->shop->slug));
        $this->assertDatabaseHas('products', ['name' => 'iPhone 15 Pro (Copie)']);

        // Archive
        $archResponse = $this->post(route('seller.shop.products.archive', [$this->shop->slug, $product->slug]));
        $archResponse->assertRedirect(route('seller.shop.products.index', $this->shop->slug));
        $this->assertDatabaseHas('products', ['id' => $product->id, 'is_archived' => true]);
    }

    /** @test */
    public function test_seller_can_generate_multi_product_smart_link_and_process_guest_tracking()
    {
        $this->actingAs($this->sellerUser);

        $prod1 = Product::create([
            'shop_id' => $this->shop->id,
            'name' => 'Casque Bluetooth',
            'slug' => 'casque-bluetooth',
            'price' => 25000,
            'stock' => 5,
        ]);

        $prod2 = Product::create([
            'shop_id' => $this->shop->id,
            'name' => 'Coque de Protection',
            'slug' => 'coque-protection',
            'price' => 5000,
            'stock' => 10,
        ]);

        $response = $this->post(route('seller.smart_links.store'), [
            'title' => 'Pack Musique & Coque',
            'items' => [
                ['product_id' => $prod1->id, 'quantity' => 1, 'unit_price' => 25000],
                ['product_id' => $prod2->id, 'quantity' => 2, 'unit_price' => 4500],
            ],
            'discount_amount' => 2000,
            'shipping_fee' => 1500,
            'notes' => 'Livrer de préférence le matin',
            'validity_hours' => 48,
        ]);

        $response->assertRedirect(route('seller.smart_links.index'));

        $link = SmartLink::where('title', 'Pack Musique & Coque')->first();
        $this->assertNotNull($link);
        $this->assertEquals(33500, $link->total_price); // (25000 + 9000) - 2000 + 1500

        // Test public fast checkout page access
        $publicRes = $this->get(route('smartlink.checkout', $link->token));
        $publicRes->assertStatus(200);

        // Process guest checkout payment
        $payRes = $this->post(route('smartlink.pay', $link->token), [
            'customer_name' => 'Client Test',
            'phone_number' => '699112233',
            'delivery_address' => 'Akwa Nord, Rue des Ecoles',
            'city_neighborhood' => 'Douala',
            'delivery_notes' => 'Appeler à l entrée',
            'payment_method' => 'orange_money',
        ]);

        $link->refresh();
        $this->assertEquals('paid', $link->status);
        $this->assertNotNull($link->tracking_code);

        $payRes->assertRedirect(route('public.order_tracking', ['tracking_code' => $link->tracking_code]));

        // Test guest order parcel tracking page
        $trackRes = $this->get(route('public.order_tracking', ['tracking_code' => $link->tracking_code]));
        $trackRes->assertStatus(200);
    }

    /** @test */
    public function test_seller_can_upgrade_saas_pack()
    {
        $this->actingAs($this->sellerUser);

        $response = $this->post(route('seller.subscription.upgrade'), [
            'pack' => 'business',
        ]);

        $response->assertRedirect(route('seller.subscription.index'));
        $this->assertDatabaseHas('sellers', ['id' => $this->seller->id, 'pack' => 'business']);
    }

    /** @test */
    public function test_ai_floating_chat_endpoint()
    {
        $this->actingAs($this->sellerUser);

        $response = $this->postJson(route('ai.chat'), [
            'message' => 'Quel est mon stock total ?',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['reply', 'action', 'timestamp']);
    }
}
