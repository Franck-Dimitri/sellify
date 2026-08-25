<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Seller;
use App\Models\Driver;
use App\Models\Shop;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PromoCode;
use App\Models\SmartLink;
use App\Models\KycDocument;
use App\Models\KycRequest;
use App\Models\ActivityLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin
        $admin = User::create([
            'first_name' => 'Sellify',
            'last_name' => 'Admin',
            'email' => 'admin@sellify.me',
            'phone' => '+237600000000',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
            'kyc_status' => 'verified',
            'kyc_verified_at' => now(),
            'status' => 'active',
            'is_active' => true,
        ]);

        $this->call(SubscriptionPackSeeder::class);

        ActivityLog::log($admin->id, 'system_seed', 'Initialisation de la base de données avec l\'administrateur.');

        // 2. Create Clients (Customers)
        $customers = [];
        for ($i = 1; $i <= 5; $i++) {
            $customer = User::create([
                'first_name' => 'Client',
                'last_name' => (string)$i,
                'email' => "client{$i}@sellify.me",
                'phone' => "+23761000000{$i}",
                'password' => Hash::make('password'),
                'role' => 'customer',
                'email_verified_at' => now(),
                'kyc_status' => 'none',
                'status' => 'active',
                'is_active' => true,
                'loyalty_points' => rand(50, 500),
            ]);

            $customers[] = $customer;
            ActivityLog::log($customer->id, 'registration', 'Inscription en tant que Client.');
        }

        // Create dummy KYC files
        Storage::makeDirectory('kyc/test');
        $dummyImageContent = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        Storage::put('kyc/test/dummy_cni.png', $dummyImageContent);
        Storage::put('kyc/test/dummy_selfie.png', $dummyImageContent);
        Storage::put('kyc/test/dummy_registre.png', $dummyImageContent);
        Storage::put('kyc/test/dummy_permis.png', $dummyImageContent);
        Storage::put('kyc/test/dummy_carte_grise.png', $dummyImageContent);
        Storage::put('kyc/test/dummy_vehicule.png', $dummyImageContent);

        // 3. Create Sellers
        // A. Approved Seller (Pro Pack)
        $sellerApprovedUser = User::create([
            'first_name' => 'Jean',
            'last_name' => 'Vendeur',
            'email' => 'vendeur.approved@sellify.me',
            'phone' => '+237620000001',
            'password' => Hash::make('password'),
            'role' => 'seller',
            'email_verified_at' => now(),
            'kyc_status' => 'verified',
            'kyc_verified_at' => now()->subDays(5),
            'status' => 'active',
            'is_active' => true,
        ]);

        $sellerApproved = Seller::create([
            'user_id' => $sellerApprovedUser->id,
            'status' => 'approved',
            'is_verified' => true,
            'verified_at' => now()->subDays(5),
            'verified_by' => $admin->id,
            'pack' => 'pro',
        ]);

        \App\Models\SellerWallet::create([
            'seller_id' => $sellerApproved->id,
            'balance' => 385000.00,
            'pending_balance' => 95000.00,
            'currency' => 'FCFA',
        ]);

        $this->seedKycDocs($sellerApprovedUser, 'seller', 'approved', $admin);

        // B. Pending Seller
        $sellerPendingUser = User::create([
            'first_name' => 'Marc',
            'last_name' => 'Pending',
            'email' => 'vendeur.pending@sellify.me',
            'phone' => '+237620000002',
            'password' => Hash::make('password'),
            'role' => 'seller',
            'email_verified_at' => now(),
            'kyc_status' => 'pending',
            'status' => 'active',
            'is_active' => true,
        ]);

        Seller::create([
            'user_id' => $sellerPendingUser->id,
            'status' => 'pending',
            'pack' => 'starter',
        ]);

        $this->seedKycDocs($sellerPendingUser, 'seller', 'pending');

        // C. Rejected Seller
        $sellerRejectedUser = User::create([
            'first_name' => 'Paul',
            'last_name' => 'Rejete',
            'email' => 'vendeur.rejected@sellify.me',
            'phone' => '+237620000003',
            'password' => Hash::make('password'),
            'role' => 'seller',
            'email_verified_at' => now(),
            'kyc_status' => 'rejected',
            'status' => 'active',
            'is_active' => true,
        ]);

        Seller::create([
            'user_id' => $sellerRejectedUser->id,
            'status' => 'rejected',
            'rejection_reason' => 'Photo de CNI floue et illisible.',
            'rejected_at' => now()->subDay(),
        ]);

        $this->seedKycDocs($sellerRejectedUser, 'seller', 'rejected', $admin, 'CNI floue');

        // 4. Create Drivers
        // A. Approved Driver
        $driverApprovedUser = User::create([
            'first_name' => 'Pierre',
            'last_name' => 'Livreur',
            'email' => 'livreur.approved@sellify.me',
            'phone' => '+237630000001',
            'password' => Hash::make('password'),
            'role' => 'driver',
            'email_verified_at' => now(),
            'kyc_status' => 'verified',
            'kyc_verified_at' => now()->subDays(3),
            'status' => 'active',
            'is_active' => true,
        ]);

        $driverApproved = Driver::create([
            'user_id' => $driverApprovedUser->id,
            'vehicle_type' => 'moto',
            'license_number' => 'DL-98218-A',
            'vehicle_plate' => 'LT-129-XX',
            'coverage_zone' => 'Douala (Akwa, Bonapriso, Deido, Bonamoussadi)',
            'current_latitude' => 4.0485000,
            'current_longitude' => 9.7020000,
            'heading' => 45.0,
            'last_location_updated_at' => now(),
            'status' => 'approved',
            'is_verified' => true,
            'verified_at' => now()->subDays(3),
            'verified_by' => $admin->id,
            'rating' => 4.90,
            'total_deliveries' => 48,
        ]);

        $this->seedKycDocs($driverApprovedUser, 'driver', 'approved', $admin);

        // B. Pending Driver
        $driverPendingUser = User::create([
            'first_name' => 'Alice',
            'last_name' => 'Pending',
            'email' => 'livreur.pending@sellify.me',
            'phone' => '+237630000002',
            'password' => Hash::make('password'),
            'role' => 'driver',
            'email_verified_at' => now(),
            'kyc_status' => 'pending',
            'status' => 'active',
            'is_active' => true,
        ]);

        Driver::create([
            'user_id' => $driverPendingUser->id,
            'vehicle_type' => 'voiture',
            'license_number' => 'DL-44821-B',
            'vehicle_plate' => 'CE-992-YY',
            'coverage_zone' => 'Yaoundé (Bastos, Omnisports, Tsinga)',
            'current_latitude' => 3.8820000,
            'current_longitude' => 11.5150000,
            'status' => 'pending',
        ]);

        $this->seedKycDocs($driverPendingUser, 'driver', 'pending');

        // 5. Create Shops for Approved Seller
        $shopTech = Shop::create([
            'seller_id' => $sellerApproved->id,
            'name' => 'Tech & Gadgets Express',
            'slug' => 'tech-gadgets-express',
            'slogan' => 'Le meilleur de l\'électronique livrable en 2h chrono',
            'description' => 'Boutique officielle certifiée spécialisée dans les smartphones, accessoires connectés et matériel informatique neuf.',
            'company_name' => 'Tech Express Sarl',
            'registration_number' => 'RC/DLA/2024/B/1892',
            'address' => 'Boulevard de la Liberté, Akwa, Douala',
            'latitude' => 4.0511000,
            'longitude' => 9.7085000,
            'city' => 'Douala',
            'phone_contact' => '+237620000001',
            'email_contact' => 'contact@techexpress.cm',
            'theme_color' => '#EAB308',
            'is_active' => true,
        ]);

        $shopFashion = Shop::create([
            'seller_id' => $sellerApproved->id,
            'name' => 'Mode & Élégance Panafricaine',
            'slug' => 'mode-elegance-panafricaine',
            'slogan' => 'L\'authenticité du wax et de la haute couture africaine',
            'description' => 'Créations de prêt-à-porter en pagne tissé, tenues de soirée et accessoires artisanaux haut de gamme.',
            'company_name' => 'Afrik Style Couture',
            'registration_number' => 'RC/DLA/2025/A/0411',
            'address' => 'Rue Joss, Bonanjo, Douala',
            'latitude' => 4.0435000,
            'longitude' => 9.6895000,
            'city' => 'Douala',
            'phone_contact' => '+237620000001',
            'email_contact' => 'boutique@afrikstyle.cm',
            'theme_color' => '#10B981',
            'is_active' => true,
        ]);

        // 6. Create Products for Shops
        $productsTech = [
            [
                'name' => 'Smartphone Galaxy A55 5G - 256Go',
                'slug' => 'smartphone-galaxy-a55-5g-256go',
                'sku' => 'TECH-SAM-A55',
                'description' => 'Écran Super AMOLED 120Hz, triple capteur photo 50MP, batterie 5000mAh. Garantie constructeur 12 mois.',
                'price' => 245000,
                'stock' => 12,
                'alert_threshold' => 3,
                'stock_status' => 'in_stock',
                'is_active' => true,
            ],
            [
                'name' => 'Écouteurs Sans Fil Pro TWS ANC',
                'slug' => 'ecouteurs-sans-fil-pro-tws-anc',
                'sku' => 'TECH-TWS-ANC',
                'description' => 'Réduction active du bruit, autonomie 32h avec boîtier, son haute définition avec basses profondes.',
                'price' => 28000,
                'stock' => 35,
                'alert_threshold' => 5,
                'stock_status' => 'in_stock',
                'is_active' => true,
            ],
            [
                'name' => 'Montre Connectée Smart Watch Ultra 2',
                'slug' => 'montre-connectee-smart-watch-ultra-2',
                'sku' => 'TECH-WATCH-U2',
                'description' => 'Suivi cardiaque, GPS intégré, appels Bluetooth, étanchéité IP68 et batterie longue durée 7 jours.',
                'price' => 35000,
                'stock' => 18,
                'alert_threshold' => 4,
                'stock_status' => 'in_stock',
                'is_active' => true,
            ],
            [
                'name' => 'Power Bank 30 000 mAh Charge Rapide 22.5W',
                'slug' => 'power-bank-30000-mah-charge-rapide',
                'sku' => 'TECH-PB-30K',
                'description' => 'Batterie externe haute capacité avec 3 sorties USB et affichage LED du pourcentage.',
                'price' => 18500,
                'stock' => 40,
                'alert_threshold' => 10,
                'stock_status' => 'in_stock',
                'is_active' => true,
            ],
        ];

        $createdProducts = [];
        foreach ($productsTech as $p) {
            $createdProducts[] = Product::create(array_merge($p, ['shop_id' => $shopTech->id]));
        }

        $productsFashion = [
            [
                'name' => 'Robe Longue en Pagne Wax Royal Kente',
                'slug' => 'robe-longue-pagne-wax-royal-kente',
                'sku' => 'FASH-ROBE-KNT',
                'description' => 'Coupe ajustée élégante pour cérémonies et soirées, 100% coton véritable wax hollandais.',
                'price' => 45000,
                'stock' => 8,
                'alert_threshold' => 2,
                'stock_status' => 'in_stock',
                'is_active' => true,
            ],
            [
                'name' => 'Chemise Homme Broderie Manuelle Africaine',
                'slug' => 'chemise-homme-broderie-manuelle',
                'sku' => 'FASH-CHM-BRD',
                'description' => 'Chemise en lin pur avec col mao et broderies artistiques dorées sur le buste.',
                'price' => 32000,
                'stock' => 15,
                'alert_threshold' => 3,
                'stock_status' => 'in_stock',
                'is_active' => true,
            ],
        ];

        foreach ($productsFashion as $p) {
            $createdProducts[] = Product::create(array_merge($p, ['shop_id' => $shopFashion->id]));
        }

        // 7. Create Promo Codes
        PromoCode::create([
            'shop_id' => $shopTech->id,
            'code' => 'BIENVENUE10',
            'type' => 'percentage',
            'value' => 10,
            'min_order_amount' => 20000,
            'usage_limit' => 100,
            'used_count' => 8,
            'start_date' => now()->subDays(5),
            'end_date' => now()->addDays(30),
            'is_active' => true,
        ]);

        PromoCode::create([
            'shop_id' => $shopTech->id,
            'code' => 'SOLDES2026',
            'type' => 'fixed',
            'value' => 5000,
            'min_order_amount' => 50000,
            'usage_limit' => 50,
            'used_count' => 12,
            'start_date' => now()->subDays(2),
            'end_date' => now()->addDays(15),
            'is_active' => true,
        ]);

        // 8. Create Smart-Links
        SmartLink::create([
            'seller_id' => $sellerApproved->id,
            'product_id' => $createdProducts[0]->id,
            'title' => 'Pack Promo WhatsApp - Galaxy A55 + Écouteurs TWS',
            'token' => 'LNK-SMP-' . Str::random(8),
            'tracking_code' => 'TRK-WA-001',
            'price_at_time' => 260000,
            'total_price' => 260000,
            'status' => 'active',
            'clicks_count' => 64,
            'conversions_count' => 5,
            'expires_at' => now()->addDays(7),
        ]);

        // 9. Create Rich Sample Orders Across Lifecycle
        $ordersData = [
            [
                'order_number' => 'SLF-2026-9821',
                'user_id' => $customers[0]->id,
                'shop_id' => $shopTech->id,
                'driver_id' => null,
                'customer_name' => 'Hervé Ngueme',
                'customer_phone' => '+237699112233',
                'delivery_address' => 'Face Hôtel Akwa Palace, Rue Mandessi Bell',
                'delivery_landmark' => 'Portail vitré face Hôtel Akwa Palace',
                'latitude' => 4.0470000,
                'longitude' => 9.6965000,
                'city' => 'Douala',
                'subtotal' => 28000,
                'shipping_fee' => 1500,
                'total_amount' => 29500,
                'payment_method' => 'orange_money',
                'payment_status' => 'escrow_held',
                'delivery_status' => 'pending',
                'delivery_otp' => '482910',
                'items' => [
                    ['product_id' => $createdProducts[1]->id, 'name' => 'Écouteurs Sans Fil Pro TWS ANC', 'price' => 28000, 'qty' => 1],
                ],
            ],
            [
                'order_number' => 'SLF-2026-9819',
                'user_id' => $customers[1]->id,
                'shop_id' => $shopTech->id,
                'driver_id' => null,
                'customer_name' => 'Clarisse Ngo',
                'customer_phone' => '+237677445566',
                'delivery_address' => 'Carrefour Kotto, Bonamoussadi',
                'delivery_landmark' => 'Immeuble beige face Station Tradex Kotto',
                'latitude' => 4.0845000,
                'longitude' => 9.7420000,
                'city' => 'Douala',
                'subtotal' => 53500,
                'shipping_fee' => 2000,
                'total_amount' => 55500,
                'payment_method' => 'mtn_momo',
                'payment_status' => 'escrow_held',
                'delivery_status' => 'preparing',
                'delivery_otp' => '719304',
                'items' => [
                    ['product_id' => $createdProducts[2]->id, 'name' => 'Montre Connectée Smart Watch Ultra 2', 'price' => 35000, 'qty' => 1],
                    ['product_id' => $createdProducts[3]->id, 'name' => 'Power Bank 30 000 mAh Charge Rapide', 'price' => 18500, 'qty' => 1],
                ],
            ],
            [
                'order_number' => 'SLF-2026-9815',
                'user_id' => $customers[2]->id,
                'shop_id' => $shopFashion->id,
                'driver_id' => null,
                'customer_name' => 'Marc Kamga',
                'customer_phone' => '+237655889900',
                'delivery_address' => 'Total Deido, Boulevard de la République',
                'delivery_landmark' => 'Pharmacie du Rond-Point Deido',
                'latitude' => 4.0620000,
                'longitude' => 9.7150000,
                'city' => 'Douala',
                'subtotal' => 77000,
                'shipping_fee' => 1500,
                'total_amount' => 78500,
                'payment_method' => 'orange_money',
                'payment_status' => 'escrow_held',
                'delivery_status' => 'ready_for_pickup',
                'delivery_otp' => '503819',
                'items' => [
                    ['product_id' => $createdProducts[4]->id, 'name' => 'Robe Longue en Pagne Wax Royal Kente', 'price' => 45000, 'qty' => 1],
                    ['product_id' => $createdProducts[5]->id, 'name' => 'Chemise Homme Broderie Manuelle Africaine', 'price' => 32000, 'qty' => 1],
                ],
            ],
            [
                'order_number' => 'SLF-2026-9812',
                'user_id' => $customers[3]->id,
                'shop_id' => $shopTech->id,
                'driver_id' => $driverApproved->id,
                'customer_name' => 'Amina Bello',
                'customer_phone' => '+237699334455',
                'delivery_address' => 'Derrière Direction Générale MTN, Bonanjo',
                'delivery_landmark' => 'Immeuble Verre Bleu face Banque Atlantique',
                'latitude' => 4.0150000,
                'longitude' => 9.7050000,
                'city' => 'Douala',
                'subtotal' => 245000,
                'shipping_fee' => 2500,
                'total_amount' => 247500,
                'payment_method' => 'mtn_momo',
                'payment_status' => 'escrow_held',
                'delivery_status' => 'in_transit',
                'delivery_otp' => '938201',
                'items' => [
                    ['product_id' => $createdProducts[0]->id, 'name' => 'Smartphone Galaxy A55 5G - 256Go', 'price' => 245000, 'qty' => 1],
                ],
            ],
            [
                'order_number' => 'SLF-2026-9801',
                'user_id' => $customers[4]->id,
                'shop_id' => $shopTech->id,
                'driver_id' => $driverApproved->id,
                'customer_name' => 'Jean-Paul Koffi',
                'customer_phone' => '+237677112299',
                'delivery_address' => 'Résidence Les Palmiers, Bonapriso',
                'delivery_landmark' => 'Villa 4, Rue Njo-Njo',
                'latitude' => 4.0180000,
                'longitude' => 9.6980000,
                'city' => 'Douala',
                'subtotal' => 63000,
                'shipping_fee' => 1500,
                'total_amount' => 64500,
                'payment_method' => 'orange_money',
                'payment_status' => 'released',
                'delivery_status' => 'delivered',
                'delivery_otp' => '120945',
                'delivered_at' => now()->subDay(),
                'items' => [
                    ['product_id' => $createdProducts[1]->id, 'name' => 'Écouteurs Sans Fil Pro TWS ANC', 'price' => 28000, 'qty' => 1],
                    ['product_id' => $createdProducts[2]->id, 'name' => 'Montre Connectée Smart Watch Ultra 2', 'price' => 35000, 'qty' => 1],
                ],
            ],
        ];

        foreach ($ordersData as $oData) {
            $items = $oData['items'];
            unset($oData['items']);

            $order = Order::create($oData);

            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['name'],
                    'unit_price' => $item['price'],
                    'quantity' => $item['qty'],
                    'subtotal' => $item['price'] * $item['qty'],
                ]);
            }
        }
    }

    /**
     * Helper to seed KYC documents and requests.
     */
    private function seedKycDocs(User $user, string $type, string $status, ?User $admin = null, ?string $reason = null): void
    {
        $docs = [];
        if ($type === 'seller') {
            $docs = [
                'cni' => 'kyc/test/dummy_cni.png',
                'registre_commerce' => 'kyc/test/dummy_registre.png',
                'selfie' => 'kyc/test/dummy_selfie.png',
            ];
        } else {
            $docs = [
                'cni' => 'kyc/test/dummy_cni.png',
                'permis_conduire' => 'kyc/test/dummy_permis.png',
                'carte_grise' => 'kyc/test/dummy_carte_grise.png',
                'photo_vehicule' => 'kyc/test/dummy_vehicule.png',
                'selfie' => 'kyc/test/dummy_selfie.png',
            ];
        }

        foreach ($docs as $docType => $path) {
            KycDocument::create([
                'user_id' => $user->id,
                'type' => $docType,
                'file_path' => $path,
                'original_name' => basename($path),
                'mime_type' => 'image/png',
                'file_size' => 12345,
                'status' => $status === 'pending' ? 'pending' : ($status === 'approved' ? 'approved' : 'rejected'),
                'rejection_reason' => $status === 'rejected' ? $reason : null,
                'reviewed_by' => $admin ? $admin->id : null,
                'reviewed_at' => $admin ? now() : null,
            ]);
        }

        KycRequest::create([
            'user_id' => $user->id,
            'type' => $type,
            'status' => $status,
            'rejection_reason' => $status === 'rejected' ? $reason : null,
            'reviewed_by' => $admin ? $admin->id : null,
            'submitted_at' => now()->subDays(4),
            'reviewed_at' => $admin ? now() : null,
            'documents_count' => count($docs),
            'approved_documents_count' => $status === 'approved' ? count($docs) : 0,
            
            // CNI Seeding Details
            'cni_number' => 'CNI-' . rand(100000000, 999999999),
            'cni_first_name' => $user->first_name,
            'cni_last_name' => $user->last_name,
            'cni_dob' => '1992-06-20',
            'cni_pob' => 'Douala',
            'cni_issue_date' => '2021-04-12',
            'cni_expiry_date' => '2031-04-12',
            'cni_gender' => rand(0, 1) ? 'M' : 'F',
            'cni_nationality' => 'Camerounaise',
        ]);

        ActivityLog::log($user->id, 'kyc_submission', "Documents KYC soumis pour validation.");

        if ($status === 'approved' && $admin) {
            ActivityLog::log($user->id, 'kyc_approved', "Dossier KYC validé par l'administrateur {$admin->full_name}.");
        } elseif ($status === 'rejected' && $admin) {
            ActivityLog::log($user->id, 'kyc_rejected', "Dossier KYC rejeté. Motif: {$reason}");
        }
    }
}
