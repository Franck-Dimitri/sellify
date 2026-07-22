<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Seller;
use App\Models\Shop;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicStoreTest extends TestCase
{
    use RefreshDatabase;

    private function createSellerUser(string $email = 'seller@sellify.me'): User
    {
        return User::create([
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
            'email' => $email,
            'phone' => '+237690000000',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'seller',
            'kyc_status' => 'verified',
            'kyc_verified_at' => now(),
            'email_verified_at' => now(),
            'is_active' => true,
            'status' => 'active',
        ]);
    }

    public function test_can_view_public_products_catalog()
    {
        $user = $this->createSellerUser('seller1@sellify.me');
        $seller = Seller::create(['user_id' => $user->id, 'pack' => 'starter', 'kyc_status' => 'approved']);
        $shop = Shop::create([
            'seller_id' => $seller->id,
            'name' => 'Boutique Tech',
            'slug' => 'boutique-tech',
            'company_name' => 'Tech SARL',
            'address' => 'Akwa Douala',
            'city' => 'Douala',
            'phone_contact' => '+237690000000',
            'email_contact' => 'tech@sellify.me',
            'is_active' => true,
        ]);
        Product::create([
            'shop_id' => $shop->id,
            'name' => 'Laptop Gamer',
            'slug' => 'laptop-gamer',
            'price' => 500000,
            'stock' => 5,
            'is_active' => true,
            'is_archived' => false,
        ]);

        $response = $this->get('/store');
        $response->assertStatus(200);
    }

    public function test_can_view_public_product_detail_page()
    {
        $user = $this->createSellerUser('seller2@sellify.me');
        $seller = Seller::create(['user_id' => $user->id, 'pack' => 'starter', 'kyc_status' => 'approved']);
        $shop = Shop::create([
            'seller_id' => $seller->id,
            'name' => 'Boutique Pro',
            'slug' => 'boutique-pro',
            'company_name' => 'Pro SARL',
            'address' => 'Bastos Yaoundé',
            'city' => 'Yaoundé',
            'phone_contact' => '+237690000001',
            'email_contact' => 'pro@sellify.me',
            'is_active' => true,
            'rccm_number' => 'RC/DLA/2026/B/1234',
        ]);
        Product::create([
            'shop_id' => $shop->id,
            'name' => 'Smartphone Galaxy S24',
            'slug' => 'smartphone-galaxy-s24',
            'price' => 350000,
            'stock' => 10,
            'is_active' => true,
            'is_archived' => false,
        ]);

        $response = $this->get('/produit/smartphone-galaxy-s24');
        $response->assertStatus(200);
    }

    public function test_can_view_public_shops_directory()
    {
        $user = $this->createSellerUser('seller3@sellify.me');
        $seller = Seller::create(['user_id' => $user->id, 'pack' => 'starter', 'kyc_status' => 'approved']);
        Shop::create([
            'seller_id' => $seller->id,
            'name' => 'Boutique Mode',
            'slug' => 'boutique-mode',
            'company_name' => 'Mode SARL',
            'address' => 'Bonanjo Douala',
            'city' => 'Douala',
            'phone_contact' => '+237690000002',
            'email_contact' => 'mode@sellify.me',
            'is_active' => true,
        ]);

        $response = $this->get('/boutiques');
        $response->assertStatus(200);
    }
}
