<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\CustomerAddress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CustomerProfileAndAddressesTest extends TestCase
{
    use RefreshDatabase;

    protected User $customer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->customer = User::factory()->create([
            'first_name' => 'Paul',
            'last_name' => 'Ondobo',
            'email' => 'paul.ondobo@test.cm',
            'phone' => '+237690000000',
            'role' => 'customer',
            'status' => 'active',
        ]);
    }

    public function test_customer_can_update_profile_and_mobile_money(): void
    {
        Storage::fake('public');

        $response = $this->actingAs($this->customer)->post(route('customer.profile.update'), [
            'first_name' => 'Paul Valery',
            'last_name' => 'Ondobo',
            'phone' => '+237690001122',
            'momo_number' => '677112233',
            'om_number' => '699445566',
            'preferred_payment_method' => 'orange_money',
            'default_city' => 'Douala',
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
        ]);

        $response->assertRedirect();
        $this->customer->refresh();

        $this->assertEquals('Paul Valery', $this->customer->first_name);
        $this->assertEquals('677112233', $this->customer->momo_number);
        $this->assertEquals('699445566', $this->customer->om_number);
        $this->assertEquals('orange_money', $this->customer->preferred_payment_method);
        $this->assertNotNull($this->customer->avatar);
    }

    public function test_customer_can_create_and_manage_multiple_addresses_with_landmarks(): void
    {
        Storage::fake('public');

        // 1. Create first address (becomes default automatically)
        $response = $this->actingAs($this->customer)->post(route('customer.addresses.store'), [
            'label' => 'Domicile Akwa',
            'recipient_name' => 'Paul Ondobo',
            'recipient_phone' => '+237690000000',
            'city' => 'Douala',
            'quarter' => 'Akwa Nord',
            'address' => 'Rue des Palmiers',
            'landmark_description' => 'Portail bleu en face de la pharmacie du Soleil',
            'landmark_photo' => UploadedFile::fake()->image('landmark.jpg'),
            'latitude' => 4.0511,
            'longitude' => 9.7085,
            'is_default' => false, // Will become default because it is the first address
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('customer_addresses', [
            'user_id' => $this->customer->id,
            'label' => 'Domicile Akwa',
            'city' => 'Douala',
            'is_default' => true,
        ]);

        $firstAddress = CustomerAddress::where('user_id', $this->customer->id)->first();
        $this->assertNotNull($firstAddress->landmark_photo_path);

        // 2. Create second address (Bureau)
        $this->actingAs($this->customer)->post(route('customer.addresses.store'), [
            'label' => 'Bureau Bonanjo',
            'recipient_name' => 'Paul Ondobo (Pro)',
            'recipient_phone' => '+237690000000',
            'city' => 'Douala',
            'quarter' => 'Bonanjo',
            'address' => 'Immeuble Titanium, 3e étage',
            'landmark_description' => 'En face du Palais de Justice',
            'is_default' => true, // Explicitly set as default
        ]);

        $firstAddress->refresh();
        $this->assertFalse($firstAddress->is_default);

        $secondAddress = CustomerAddress::where('label', 'Bureau Bonanjo')->first();
        $this->assertTrue($secondAddress->is_default);

        // 3. Set first address back to default
        $this->actingAs($this->customer)->post(route('customer.addresses.default', $firstAddress->id));
        $firstAddress->refresh();
        $secondAddress->refresh();
        $this->assertTrue($firstAddress->is_default);
        $this->assertFalse($secondAddress->is_default);

        // 4. Delete second address
        $this->actingAs($this->customer)->delete(route('customer.addresses.destroy', $secondAddress->id));
        $this->assertDatabaseMissing('customer_addresses', ['id' => $secondAddress->id]);
    }

    public function test_customer_can_update_notification_preferences_and_terminate_sessions(): void
    {
        $response = $this->actingAs($this->customer)->post(route('customer.settings.update'), [
            'preferences' => [
                'whatsapp' => true,
                'sms' => false,
                'email' => true,
                'push' => true,
                'promotions' => true,
                'escrow_alerts' => true,
            ],
        ]);

        $response->assertRedirect();
        $this->customer->refresh();

        $this->assertTrue($this->customer->notification_preferences['whatsapp']);
        $this->assertFalse($this->customer->notification_preferences['sms']);
        $this->assertTrue($this->customer->notification_preferences['promotions']);

        // Terminate other sessions
        $termResponse = $this->actingAs($this->customer)->post(route('customer.settings.sessions.terminate'));
        $termResponse->assertRedirect();
    }
}
