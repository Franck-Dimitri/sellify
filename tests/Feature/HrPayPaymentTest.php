<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Seller;
use App\Models\SellerWallet;
use App\Models\Shop;
use App\Models\User;
use App\Services\Payment\HrPayService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class HrPayPaymentTest extends TestCase
{
    use RefreshDatabase;

    protected User $buyer;
    protected User $sellerUser;
    protected Seller $seller;
    protected Shop $shop;
    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('hrpay.mode', 'live');
        Config::set('hrpay.base_url', 'https://api.hrskills-pay.com');
        Config::set('hrpay.live.public_key', 'hrsk_pk_live_testkey123');
        Config::set('hrpay.live.secret_key', 'hrsk_sk_live_testsecret456');
        Config::set('hrpay.webhook_secret', 'whsec_testing_secret_key');

        $this->sellerUser = User::factory()->create(['role' => 'seller']);
        $this->seller = Seller::create([
            'user_id' => $this->sellerUser->id,
            'status' => 'approved',
            'pack' => 'pro',
            'activity_status' => 'available',
        ]);
        $this->shop = Shop::create([
            'seller_id' => $this->seller->id,
            'name' => 'Boutique Cameroun Connect',
            'company_name' => 'SARL Cameroun Connect',
            'slug' => 'boutique-cameroun-connect',
            'address' => 'Akwa Douala',
            'phone_contact' => '699112233',
            'email_contact' => 'contact@cameroun.cm',
            'city' => 'Douala',
        ]);
        $this->product = Product::create([
            'shop_id' => $this->shop->id,
            'name' => 'MacBook Pro M3',
            'slug' => 'macbook-pro-m3',
            'price' => 1500000,
            'stock' => 10,
            'is_active' => true,
        ]);

        $this->buyer = User::factory()->create([
            'role' => 'customer',
            'first_name' => 'Alain',
            'last_name' => 'Fotso',
            'phone' => '699112233',
        ]);
    }

    public function test_hrpay_service_can_exchange_keys_for_jwt_token_and_cache_it()
    {
        Cache::flush();

        Http::fake([
            'https://api.hrskills-pay.com/v1/auth/transaction-token' => Http::response([
                'transaction_token' => 'jwt_mock_token_abc123',
                'expires_in' => 2700,
                'merchant_id' => 'm_998877',
                'environment' => 'LIVE',
            ], 200),
        ]);

        $service = app(HrPayService::class);
        $token = $service->getTransactionToken();

        $this->assertEquals('jwt_mock_token_abc123', $token);
        $this->assertTrue(Cache::has('hrpay_transaction_token_live'));
        $this->assertEquals('jwt_mock_token_abc123', Cache::get('hrpay_transaction_token_live'));
    }

    public function test_hrpay_service_can_initiate_mobile_money_cashin()
    {
        Http::fake([
            'https://api.hrskills-pay.com/v1/auth/transaction-token' => Http::response([
                'transaction_token' => 'jwt_mock_token_abc123',
                'expires_in' => 2700,
            ], 200),
            'https://api.hrskills-pay.com/api/v1/payin/mobile-money' => Http::response([
                'success' => true,
                'data' => [
                    'transaction_id' => 'tx_a959b6ca_mock',
                    'reference' => 'ref_d5b40df948dc52cc',
                    'status' => 'PENDING',
                    'amount' => 50000,
                    'fee' => 750,
                    'net_amount' => 49250,
                    'currency' => 'XAF',
                    'operator' => 'ORANGE',
                    'phone_number' => '237699112233',
                    'initiated_at' => now()->toIso8601String(),
                ],
            ], 202),
        ]);

        $order = Order::create([
            'user_id' => $this->buyer->id,
            'shop_id' => $this->shop->id,
            'customer_name' => 'Alain Fotso',
            'customer_phone' => '237699112233',
            'delivery_address' => 'Bonapriso, Douala',
            'city' => 'Douala',
            'subtotal' => 50000,
            'shipping_fee' => 1500,
            'total_amount' => 51500,
            'payment_method' => 'orange_money',
            'payment_status' => 'pending',
        ]);

        $service = app(HrPayService::class);
        $result = $service->initiateMobileMoney($order, 'orange', '699112233');

        $this->assertTrue($result['success']);
        $this->assertEquals('ref_d5b40df948dc52cc', $result['reference']);
        $this->assertEquals('PENDING', $result['status']);

        $order->refresh();
        $this->assertEquals('ref_d5b40df948dc52cc', $order->payment_reference);
        $this->assertEquals('tx_a959b6ca_mock', $order->payment_transaction_id);
        $this->assertEquals('pending', $order->payment_status);
        $this->assertEquals('hrpay', $order->payment_gateway);
    }

    public function test_hrpay_service_can_create_card_payment_link()
    {
        Http::fake([
            'https://api.hrskills-pay.com/v1/auth/transaction-token' => Http::response([
                'transaction_token' => 'jwt_mock_token_abc123',
                'expires_in' => 2700,
            ], 200),
            'https://api.hrskills-pay.com/api/v1/payment-links' => Http::response([
                'success' => true,
                'data' => [
                    'id' => 'link_card_998877',
                    'payment_url' => 'https://api.hrskills-pay.com/checkout/pay/link_card_998877',
                    'amount' => 100000,
                    'currency' => 'XAF',
                ],
            ], 200),
        ]);

        $order = Order::create([
            'user_id' => $this->buyer->id,
            'shop_id' => $this->shop->id,
            'customer_name' => 'Alain Fotso',
            'customer_phone' => '699112233',
            'delivery_address' => 'Bonapriso, Douala',
            'city' => 'Douala',
            'subtotal' => 100000,
            'shipping_fee' => 1500,
            'total_amount' => 101500,
            'payment_method' => 'card',
            'payment_status' => 'pending',
        ]);

        $service = app(HrPayService::class);
        $result = $service->createCardPaymentLink($order);

        $this->assertTrue($result['success']);
        $this->assertEquals('link_card_998877', $result['reference']);
        $this->assertEquals('https://api.hrskills-pay.com/checkout/pay/link_card_998877', $result['payment_url']);
    }

    public function test_check_status_endpoint_confirms_payment_and_holds_escrow()
    {
        Http::fake([
            'https://api.hrskills-pay.com/v1/auth/transaction-token' => Http::response([
                'transaction_token' => 'jwt_mock_token_abc123',
                'expires_in' => 2700,
            ], 200),
            'https://api.hrskills-pay.com/v1/payments/ref_test_success_123' => Http::response([
                'success' => true,
                'data' => [
                    'reference' => 'ref_test_success_123',
                    'status' => 'SUCCESS',
                    'amount' => 100000,
                    'net_amount' => 98500,
                ],
            ], 200),
        ]);

        $this->actingAs($this->buyer);

        $order = Order::create([
            'user_id' => $this->buyer->id,
            'shop_id' => $this->shop->id,
            'customer_name' => 'Alain Fotso',
            'customer_phone' => '699112233',
            'delivery_address' => 'Bonapriso',
            'city' => 'Douala',
            'subtotal' => 100000,
            'shipping_fee' => 1500,
            'total_amount' => 101500,
            'payment_reference' => 'ref_test_success_123',
            'payment_method' => 'orange_money',
            'payment_status' => 'pending',
        ]);

        $response = $this->getJson(route('public.checkout.payment.status', ['reference' => 'ref_test_success_123']));

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'status' => 'SUCCESS',
        ]);

        $order->refresh();
        $this->assertEquals('escrow_held', $order->payment_status);

        // Verify seller wallet pending escrow balance
        $wallet = SellerWallet::where('seller_id', $this->seller->id)->first();
        $this->assertNotNull($wallet);
        $this->assertEquals(101500, $wallet->pending_balance);
    }

    public function test_check_status_endpoint_handles_failure_and_restores_stock()
    {
        Http::fake([
            'https://api.hrskills-pay.com/v1/auth/transaction-token' => Http::response([
                'transaction_token' => 'jwt_mock_token_abc123',
                'expires_in' => 2700,
            ], 200),
            'https://api.hrskills-pay.com/v1/payments/ref_test_failed_456' => Http::response([
                'success' => true,
                'data' => [
                    'reference' => 'ref_test_failed_456',
                    'status' => 'FAILED',
                    'reason' => 'Solde insuffisant ou rejet client',
                ],
            ], 200),
        ]);

        $this->actingAs($this->buyer);

        $initialStock = $this->product->stock;

        $order = Order::create([
            'user_id' => $this->buyer->id,
            'shop_id' => $this->shop->id,
            'customer_name' => 'Alain Fotso',
            'customer_phone' => '699112233',
            'delivery_address' => 'Bonapriso',
            'city' => 'Douala',
            'subtotal' => 100000,
            'shipping_fee' => 1500,
            'total_amount' => 101500,
            'payment_reference' => 'ref_test_failed_456',
            'payment_method' => 'mtn_momo',
            'payment_status' => 'pending',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'unit_price' => $this->product->price,
            'quantity' => 2,
            'subtotal' => 200000,
        ]);

        // Stock was reserved (decremented by 2)
        $this->product->decrement('stock', 2);
        $this->assertEquals($initialStock - 2, $this->product->fresh()->stock);

        $response = $this->getJson(route('public.checkout.payment.status', ['reference' => 'ref_test_failed_456']));

        $response->assertStatus(200);
        $response->assertJson([
            'success' => false,
            'status' => 'FAILED',
        ]);

        $order->refresh();
        $this->assertEquals('failed', $order->payment_status);

        // Stock restored!
        $this->assertEquals($initialStock, $this->product->fresh()->stock);
    }

    public function test_webhook_verifies_signature_and_confirms_escrow_payment()
    {
        $order = Order::create([
            'user_id' => $this->buyer->id,
            'shop_id' => $this->shop->id,
            'customer_name' => 'Alain Fotso',
            'customer_phone' => '699112233',
            'delivery_address' => 'Bonapriso',
            'city' => 'Douala',
            'subtotal' => 75000,
            'shipping_fee' => 1500,
            'total_amount' => 76500,
            'payment_reference' => 'ref_webhook_test_789',
            'payment_method' => 'orange_money',
            'payment_status' => 'pending',
        ]);

        $payload = json_encode([
            'event' => 'payment.succeeded',
            'data' => [
                'reference' => 'ref_webhook_test_789',
                'amount' => 76500,
                'status' => 'SUCCESS',
            ],
        ]);

        $secret = 'whsec_testing_secret_key';
        $signature = hash_hmac('sha256', $payload, $secret);

        $response = $this->withHeaders([
            'X-Hub-Signature' => "sha256={$signature}",
            'Content-Type' => 'application/json',
        ])->postJson(route('webhooks.hrpay'), json_decode($payload, true));

        $response->assertStatus(200);
        $response->assertJson(['received' => true]);

        $order->refresh();
        $this->assertEquals('escrow_held', $order->payment_status);

        $wallet = SellerWallet::where('seller_id', $this->seller->id)->first();
        $this->assertNotNull($wallet);
        $this->assertEquals(76500, $wallet->pending_balance);
    }

    public function test_webhook_rejects_invalid_hmac_signature()
    {
        $payload = [
            'event' => 'payment.succeeded',
            'data' => ['reference' => 'ref_fake'],
        ];

        $response = $this->withHeaders([
            'X-Hub-Signature' => 'sha256=invalid_tampered_signature',
            'Content-Type' => 'application/json',
        ])->postJson(route('webhooks.hrpay'), $payload);

        $response->assertStatus(401);
    }

    public function test_payment_link_polling_strictly_requires_completed_payment()
    {
        $linkId = 'link_test_uuid_123';

        Http::fake([
            'https://api.hrskills-pay.com/v1/auth/transaction-token' => Http::response([
                'transaction_token' => 'jwt_mock_token_abc123',
                'expires_in' => 2700,
            ], 200),
            'https://api.hrskills-pay.com/v1/payments/' . $linkId => Http::response(['error' => 'NOT_FOUND'], 404),
            'https://api.hrskills-pay.com/api/v1/payment-links/' . $linkId => Http::sequence()
                // Call 1: user clicked to pay, but status is PENDING and total_received = 0
                ->push([
                    'id' => $linkId,
                    'amount' => 100,
                    'total_received' => 0,
                    'used_count' => 1,
                    'is_active' => true,
                    'payments' => [
                        [
                            'ID' => 'pay_1',
                            'Amount' => 100,
                            'Status' => 'PENDING',
                        ],
                    ],
                    'success' => true,
                ], 200)
                // Call 2: user completed card transaction on Smobilpay, status is SUCCESS and total_received = 100
                ->push([
                    'id' => $linkId,
                    'amount' => 100,
                    'total_received' => 100,
                    'used_count' => 1,
                    'is_active' => true,
                    'payments' => [
                        [
                            'ID' => 'pay_1',
                            'Amount' => 100,
                            'Status' => 'SUCCESS',
                        ],
                    ],
                    'success' => true,
                ], 200),
        ]);

        $service = app(HrPayService::class);

        // First check must return PENDING
        $resultPending = $service->checkPaymentStatus($linkId);
        $this->assertEquals('PENDING', $resultPending['status']);

        // Second check must return SUCCESS
        $resultSuccess = $service->checkPaymentStatus($linkId);
        $this->assertEquals('SUCCESS', $resultSuccess['status']);
    }
}
