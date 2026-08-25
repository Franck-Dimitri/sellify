<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Seller;
use App\Models\Shop;
use App\Models\Product;
use App\Models\Driver;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\SellerWallet;
use App\Models\WalletTransaction;
use App\Services\EscrowService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EscrowWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected User $customerUser;
    protected User $sellerUser;
    protected Seller $seller;
    protected Shop $shop;
    protected Product $product;
    protected User $driverUser;
    protected Driver $driver;

    protected function setUp(): void
    {
        parent::setUp();

        // Customer
        $this->customerUser = User::factory()->create([
            'role' => 'customer',
            'email_verified_at' => now(),
            'loyalty_points' => 100,
        ]);

        // Seller & Shop
        $this->sellerUser = User::factory()->create([
            'role' => 'seller',
            'email_verified_at' => now(),
            'kyc_status' => 'verified',
        ]);
        $this->seller = Seller::create([
            'user_id' => $this->sellerUser->id,
            'status' => 'approved',
            'is_verified' => true,
        ]);
        $this->shop = Shop::create([
            'seller_id' => $this->seller->id,
            'name' => 'Boutique Test',
            'slug' => 'boutique-test',
            'company_name' => 'Test Sarl',
            'address' => 'Akwa Douala',
            'phone_contact' => '+237699000000',
            'email_contact' => 'test@shop.cm',
        ]);
        $this->product = Product::create([
            'shop_id' => $this->shop->id,
            'name' => 'Produit Test',
            'slug' => 'produit-test',
            'price' => 20000,
            'stock' => 10,
            'is_active' => true,
        ]);

        // Driver
        $this->driverUser = User::factory()->create([
            'role' => 'driver',
            'email_verified_at' => now(),
            'kyc_status' => 'verified',
        ]);
        $this->driver = Driver::create([
            'user_id' => $this->driverUser->id,
            'status' => 'approved',
            'is_verified' => true,
            'vehicle_plate' => 'LT-999-AA',
        ]);
    }

    public function test_escrow_hold_credits_seller_pending_balance_when_order_created(): void
    {
        $order = Order::create([
            'user_id' => $this->customerUser->id,
            'shop_id' => $this->shop->id,
            'driver_id' => $this->driver->id,
            'customer_name' => 'Acheteur Test',
            'customer_phone' => '+237699000001',
            'delivery_address' => 'Bonanjo Douala',
            'subtotal' => 20000,
            'shipping_fee' => 1500,
            'total_amount' => 21500,
            'payment_method' => 'orange_money',
            'delivery_status' => 'pending',
            'delivery_otp' => '654321',
        ]);

        $escrowService = app(EscrowService::class);
        $escrowService->holdEscrow($order);

        $wallet = SellerWallet::where('seller_id', $this->seller->id)->first();
        $this->assertNotNull($wallet);
        $this->assertEquals(21500, (float) $wallet->pending_balance);
        $this->assertEquals(0, (float) $wallet->balance);

        $order->refresh();
        $this->assertEquals('escrow_held', $order->payment_status);
    }

    public function test_customer_confirmation_releases_escrow_to_seller_available_balance(): void
    {
        $order = Order::create([
            'user_id' => $this->customerUser->id,
            'shop_id' => $this->shop->id,
            'driver_id' => $this->driver->id,
            'customer_name' => 'Acheteur Test',
            'customer_phone' => '+237699000001',
            'delivery_address' => 'Bonanjo Douala',
            'subtotal' => 20000,
            'shipping_fee' => 1500,
            'total_amount' => 21500,
            'payment_method' => 'orange_money',
            'delivery_status' => 'in_transit',
            'delivery_otp' => '654321',
        ]);

        $escrowService = app(EscrowService::class);
        $escrowService->holdEscrow($order);

        // Customer confirms receipt
        $response = $this->actingAs($this->customerUser)
            ->post(route('customer.orders.confirm', $order->order_number));

        $response->assertSessionHas('success');

        $wallet = SellerWallet::where('seller_id', $this->seller->id)->first();
        $this->assertEquals(0, (float) $wallet->pending_balance);
        $this->assertEquals(21500, (float) $wallet->balance);

        $order->refresh();
        $this->assertEquals('released', $order->payment_status);
        $this->assertEquals('delivered', $order->delivery_status);
    }

    public function test_driver_otp_verification_releases_escrow_automatically(): void
    {
        $order = Order::create([
            'user_id' => $this->customerUser->id,
            'shop_id' => $this->shop->id,
            'driver_id' => $this->driver->id,
            'customer_name' => 'Acheteur Test',
            'customer_phone' => '+237699000001',
            'delivery_address' => 'Bonanjo Douala',
            'subtotal' => 20000,
            'shipping_fee' => 1500,
            'total_amount' => 21500,
            'payment_method' => 'mtn_momo',
            'delivery_status' => 'in_transit',
            'delivery_otp' => '987654',
        ]);

        $escrowService = app(EscrowService::class);
        $escrowService->holdEscrow($order);

        // Driver validates OTP
        $response = $this->actingAs($this->driverUser)
            ->post(route('driver.delivery.verify_otp', $order->order_number), [
                'otp' => '987654',
            ]);

        $response->assertRedirect(route('driver.dashboard'));

        $wallet = SellerWallet::where('seller_id', $this->seller->id)->first();
        $this->assertEquals(0, (float) $wallet->pending_balance);
        $this->assertEquals(21500, (float) $wallet->balance);

        $order->refresh();
        $this->assertEquals('released', $order->payment_status);
        $this->assertEquals('delivered', $order->delivery_status);

        $this->driver->refresh();
        $this->assertEquals(1, $this->driver->total_deliveries);
    }

    public function test_order_cancellation_reverses_escrow_and_restores_stock(): void
    {
        $order = Order::create([
            'user_id' => $this->customerUser->id,
            'shop_id' => $this->shop->id,
            'customer_name' => 'Acheteur Test',
            'customer_phone' => '+237699000001',
            'delivery_address' => 'Bonanjo Douala',
            'subtotal' => 20000,
            'shipping_fee' => 1500,
            'total_amount' => 21500,
            'payment_method' => 'orange_money',
            'delivery_status' => 'pending',
            'delivery_otp' => '112233',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $this->product->id,
            'product_name' => 'Produit Test',
            'unit_price' => 20000,
            'quantity' => 2,
            'subtotal' => 40000,
        ]);

        $this->product->decrement('stock', 2);
        $this->assertEquals(8, $this->product->fresh()->stock);

        $escrowService = app(EscrowService::class);
        $escrowService->holdEscrow($order);

        // Cancel order
        $response = $this->actingAs($this->customerUser)
            ->post(route('customer.orders.cancel', $order->order_number));

        $response->assertSessionHas('success');

        $wallet = SellerWallet::where('seller_id', $this->seller->id)->first();
        $this->assertEquals(0, (float) $wallet->pending_balance);
        $this->assertEquals(0, (float) $wallet->balance);

        $order->refresh();
        $this->assertEquals('refunded', $order->payment_status);
        $this->assertEquals('cancelled', $order->delivery_status);

        $this->assertEquals(10, $this->product->fresh()->stock);
    }
}
