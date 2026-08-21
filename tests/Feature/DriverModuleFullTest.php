<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Driver;
use App\Models\Seller;
use App\Models\Shop;
use App\Models\Order;
use App\Models\SubscriptionPack;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DriverModuleFullTest extends TestCase
{
    use RefreshDatabase;

    protected User $driverUser;
    protected Driver $driver;
    protected Shop $shop;
    protected Order $order;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\SubscriptionPackSeeder::class);

        // Driver User
        $this->driverUser = User::create([
            'first_name' => 'Alain',
            'last_name' => 'Livreur',
            'email' => 'driver.test@sellify.me',
            'phone' => '+237670112233',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'driver',
            'kyc_status' => 'verified',
            'kyc_verified_at' => now(),
            'email_verified_at' => now(),
            'is_active' => true,
            'status' => 'active',
        ]);

        $this->driver = Driver::create([
            'user_id' => $this->driverUser->id,
            'vehicle_type' => 'moto',
            'vehicle_plate' => 'LT-492-BX',
            'status' => 'approved',
            'activity_status' => 'available',
            'total_deliveries' => 215,
            'rating' => 4.90,
        ]);

        // Seller & Shop
        $sellerUser = User::create([
            'first_name' => 'Vendeur',
            'last_name' => 'Test',
            'email' => 'seller@sellify.me',
            'phone' => '+237699887766',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'seller',
            'kyc_status' => 'verified',
            'kyc_verified_at' => now(),
            'email_verified_at' => now(),
            'is_active' => true,
            'status' => 'active',
        ]);

        $seller = Seller::create([
            'user_id' => $sellerUser->id,
            'status' => 'approved',
            'is_verified' => true,
        ]);

        $this->shop = Shop::create([
            'seller_id' => $seller->id,
            'name' => 'Boutique Express',
            'slug' => 'boutique-express',
            'company_name' => 'Express SARL',
            'address' => 'Yaoundé Bastos',
            'phone_contact' => '+237600000000',
            'email_contact' => 'express@test.com',
            'is_active' => true,
        ]);

        // Sample Order
        $this->order = Order::create([
            'order_number' => 'SLF-TEST-9901',
            'user_id' => $this->driverUser->id,
            'shop_id' => $this->shop->id,
            'customer_name' => 'Paul Ondobo',
            'customer_phone' => '+237690000000',
            'delivery_address' => 'Bastos, Rue des Ambassades, Yaoundé',
            'city' => 'Yaoundé',
            'subtotal' => 47500,
            'shipping_fee' => 2500,
            'total_amount' => 50000,
            'payment_method' => 'mtn_momo',
            'payment_status' => 'escrow_held',
            'delivery_status' => 'pending',
            'delivery_otp' => '482910',
        ]);
    }

    public function test_driver_can_access_dashboard_and_deliveries_pages(): void
    {
        $response = $this->actingAs($this->driverUser)->get(route('driver.dashboard'));
        $response->assertStatus(200);

        $response = $this->actingAs($this->driverUser)->get(route('driver.deliveries'));
        $response->assertStatus(200);

        $response = $this->actingAs($this->driverUser)->get(route('driver.map'));
        $response->assertStatus(200);

        $response = $this->actingAs($this->driverUser)->get(route('driver.earnings'));
        $response->assertStatus(200);

        $response = $this->actingAs($this->driverUser)->get(route('driver.reviews'));
        $response->assertStatus(200);

        $response = $this->actingAs($this->driverUser)->get(route('driver.settings'));
        $response->assertStatus(200);

        $response = $this->actingAs($this->driverUser)->get(route('driver.assistant'));
        $response->assertStatus(200);
    }

    public function test_driver_can_accept_and_verify_delivery_otp(): void
    {
        // 1. Accept
        $response = $this->actingAs($this->driverUser)->post(route('driver.delivery.accept', $this->order->order_number));
        $response->assertRedirect(route('driver.map'));

        $this->order->refresh();
        $this->assertEquals($this->driver->id, $this->order->driver_id);
        $this->assertEquals('in_transit', $this->order->delivery_status);

        // 2. Verify OTP & signature
        $otpResponse = $this->actingAs($this->driverUser)->post(route('driver.delivery.verify_otp', $this->order->order_number), [
            'otp_code' => '482910',
            'signature_data' => 'data:image/png;base64,sample_signature_data',
        ]);

        $otpResponse->assertSessionHas('success');
        $this->order->refresh();
        $this->assertEquals('delivered', $this->order->delivery_status);
        $this->assertEquals('released', $this->order->payment_status);
    }

    public function test_driver_can_request_payout_and_convert_points(): void
    {
        // Payout MoMo
        $payoutRes = $this->actingAs($this->driverUser)->post(route('driver.withdraw'), [
            'amount' => 15000,
            'provider' => 'mtn',
            'phone' => '+237670112233',
        ]);
        $payoutRes->assertSessionHas('success');

        // Convert points to cash
        $pointsRes = $this->actingAs($this->driverUser)->post(route('driver.points.convert'), [
            'type' => 'cash',
            'points' => 500,
        ]);
        $pointsRes->assertSessionHas('success');

        // Convert points to boost
        $boostRes = $this->actingAs($this->driverUser)->post(route('driver.points.convert'), [
            'type' => 'boost',
            'points' => 500,
        ]);
        $boostRes->assertSessionHas('success');
    }

    public function test_driver_can_interact_with_ai_business_assistant(): void
    {
        \App\Ai\Agents\SellifyDriverAgent::fake([
            'Analyse en direct : Forte demande détectée sur Bastos et Akwa avec bonus de commission.'
        ]);

        $chatRes = $this->actingAs($this->driverUser)->postJson(route('driver.assistant.chat'), [
            'message' => '/zones',
        ]);

        $chatRes->assertStatus(200);
        $chatRes->assertJsonStructure([
            'status',
            'reply',
            'action',
        ]);
        $this->assertStringContainsString('Bastos', $chatRes->json('reply'));
    }

    public function test_driver_can_update_vehicle_settings_and_telemetry(): void
    {
        $settingsRes = $this->actingAs($this->driverUser)->post(route('driver.settings.update'), [
            'vehicle_type' => 'voiture',
            'vehicle_plate' => 'LT-888-ZZ',
            'coverage_radius_km' => 20,
            'coverage_city' => 'Douala',
        ]);
        $settingsRes->assertSessionHas('success');

        $this->driver->refresh();
        $this->assertEquals('voiture', $this->driver->vehicle_type);
        $this->assertEquals('LT-888-ZZ', $this->driver->vehicle_plate);

        // Telemetry GPS Ping
        $pingRes = $this->actingAs($this->driverUser)->postJson(route('driver.telemetry.location'), [
            'latitude' => 3.8680,
            'longitude' => 11.5180,
            'speed' => 42.5,
        ]);
        $pingRes->assertStatus(200);
        $pingRes->assertJson(['status' => 'success']);
    }
}
