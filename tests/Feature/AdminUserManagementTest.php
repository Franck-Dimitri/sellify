<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Seller;
use App\Models\Driver;
use App\Models\KycRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $customer;
    protected User $seller;
    protected User $driver;

    protected function setUp(): void
    {
        parent::setUp();

        // Create admin user
        $this->admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin.test@sellify.me',
            'phone' => '+237699999999',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'status' => 'active',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create customer user
        $this->customer = User::create([
            'first_name' => 'Customer',
            'last_name' => 'User',
            'email' => 'customer.test@sellify.me',
            'phone' => '+237688888888',
            'password' => bcrypt('password'),
            'role' => 'customer',
            'status' => 'active',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create seller user with pending KYC request
        $this->seller = User::create([
            'first_name' => 'Seller',
            'last_name' => 'User',
            'email' => 'seller.test@sellify.me',
            'phone' => '+237677777777',
            'password' => bcrypt('password'),
            'role' => 'seller',
            'status' => 'active',
            'is_active' => true,
            'kyc_status' => 'pending',
            'email_verified_at' => now(),
        ]);
        Seller::create([
            'user_id' => $this->seller->id,
            'status' => 'pending',
            'pack' => 'pro',
        ]);

        // Create driver user
        $this->driver = User::create([
            'first_name' => 'Driver',
            'last_name' => 'User',
            'email' => 'driver.test@sellify.me',
            'phone' => '+237666666666',
            'password' => bcrypt('password'),
            'role' => 'driver',
            'status' => 'active',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        Driver::create([
            'user_id' => $this->driver->id,
            'vehicle_type' => 'moto',
            'status' => 'pending',
        ]);
    }

    /** @test */
    public function test_guests_cannot_access_admin_user_routes()
    {
        $this->get(route('admin.users.all'))->assertRedirect(route('login'));
        $this->get(route('admin.users.sellers'))->assertRedirect(route('login'));
    }

    /** @test */
    public function test_non_admins_cannot_access_admin_user_routes()
    {
        $this->actingAs($this->customer);
        $this->get(route('admin.users.all'))->assertStatus(403);
    }

    /** @test */
    public function test_admins_can_access_user_all_page_with_correct_props()
    {
        $this->actingAs($this->admin);

        $response = $this->get(route('admin.users.all'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Users/All')
            ->has('users')
            ->has('filters')
            ->has('stats')
        );
    }

    /** @test */
    public function test_admins_can_access_sellers_list_page()
    {
        $this->actingAs($this->admin);

        $response = $this->get(route('admin.users.sellers'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Users/Sellers')
            ->has('sellers')
            ->has('filters')
            ->has('stats')
        );
    }

    /** @test */
    public function test_kyc_approval_requires_cni_metadata()
    {
        $this->actingAs($this->admin);

        $kycRequest = KycRequest::create([
            'user_id' => $this->seller->id,
            'type' => 'seller',
            'status' => 'pending',
            'submitted_at' => now(),
            'documents_count' => 2,
        ]);

        $response = $this->post(route('admin.kyc.review', $kycRequest->id), [
            'status' => 'approved',
        ]);

        $response->assertSessionHasErrors([
            'cni_number',
            'cni_first_name',
            'cni_last_name',
            'cni_dob',
            'cni_pob',
            'cni_issue_date',
            'cni_expiry_date',
            'cni_gender',
            'cni_nationality',
        ]);
    }

    /** @test */
    public function test_kyc_approval_succeeds_with_valid_cni_details()
    {
        $this->actingAs($this->admin);

        $kycRequest = KycRequest::create([
            'user_id' => $this->seller->id,
            'type' => 'seller',
            'status' => 'pending',
            'submitted_at' => now(),
            'documents_count' => 2,
        ]);

        $cniDetails = [
            'status' => 'approved',
            'cni_number' => '1122334455',
            'cni_first_name' => 'Jean',
            'cni_last_name' => 'Vendeur',
            'cni_dob' => '1995-10-15',
            'cni_pob' => 'Yaoundé',
            'cni_issue_date' => '2020-05-10',
            'cni_expiry_date' => '2030-05-10',
            'cni_gender' => 'M',
            'cni_nationality' => 'Camerounaise',
        ];

        $response = $this->post(route('admin.kyc.review', $kycRequest->id), $cniDetails);

        $response->assertRedirect(route('admin.users.all'));
        $response->assertSessionHasNoErrors();

        // Verify KYC request is updated in database
        $this->assertDatabaseHas('kyc_requests', [
            'id' => $kycRequest->id,
            'status' => 'approved',
            'cni_number' => '1122334455',
            'cni_first_name' => 'Jean',
            'cni_last_name' => 'Vendeur',
            'cni_gender' => 'M',
        ]);

        // Verify seller profile is approved
        $this->assertDatabaseHas('sellers', [
            'user_id' => $this->seller->id,
            'status' => 'approved',
            'is_verified' => true,
        ]);

        // Verify user kyc_status is verified
        $this->assertDatabaseHas('users', [
            'id' => $this->seller->id,
            'kyc_status' => 'verified',
        ]);
    }

    /** @test */
    public function test_kyc_rejection_does_not_require_cni_metadata()
    {
        $this->actingAs($this->admin);

        $kycRequest = KycRequest::create([
            'user_id' => $this->seller->id,
            'type' => 'seller',
            'status' => 'pending',
            'submitted_at' => now(),
            'documents_count' => 2,
        ]);

        $response = $this->post(route('admin.kyc.review', $kycRequest->id), [
            'status' => 'rejected',
            'rejection_reason' => 'Photo illisible',
        ]);

        $response->assertRedirect(route('admin.users.all'));
        $response->assertSessionHasNoErrors();

        // Verify KYC request is updated in database
        $this->assertDatabaseHas('kyc_requests', [
            'id' => $kycRequest->id,
            'status' => 'rejected',
            'rejection_reason' => 'Photo illisible',
        ]);

        // Verify seller profile is rejected
        $this->assertDatabaseHas('sellers', [
            'user_id' => $this->seller->id,
            'status' => 'rejected',
            'rejection_reason' => 'Photo illisible',
        ]);

        // Verify user kyc_status is rejected
        $this->assertDatabaseHas('users', [
            'id' => $this->seller->id,
            'kyc_status' => 'rejected',
        ]);
    }
}
