<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Seller;
use App\Models\Driver;
use App\Models\KycDocument;
use App\Models\KycRequest;
use App\Models\ActivityLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

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

        ActivityLog::log($admin->id, 'system_seed', 'Initialisation de la base de données avec l\'administrateur.');

        // 2. Create Clients (Customers)
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
                'loyalty_points' => rand(10, 500),
            ]);

            ActivityLog::log($customer->id, 'registration', 'Inscription en tant que Customer.');
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
        // A. Approved Seller
        $sellerApprovedUser = User::create([
            'first_name' => 'Jean',
            'last_name' => 'Vendeur',
            'email' => 'vendeur.approved@sellify.me',
            'phone' => '+237620000001',
            'password' => Hash::make('password'),
            'role' => 'seller',
            'email_verified_at' => now(),
            'kyc_status' => 'verified',
            'kyc_verified_at' => now()->subDays(2),
            'status' => 'active',
            'is_active' => true,
        ]);

        $sellerApproved = Seller::create([
            'user_id' => $sellerApprovedUser->id,
            'status' => 'approved',
            'is_verified' => true,
            'verified_at' => now()->subDays(2),
            'verified_by' => $admin->id,
            'pack' => 'pro',
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

        Driver::create([
            'user_id' => $driverApprovedUser->id,
            'vehicle_type' => 'moto',
            'license_number' => 'DL-98218-A',
            'vehicle_plate' => 'LT-129-XX',
            'coverage_zone' => 'Douala (Akwa, Bonapriso)',
            'status' => 'approved',
            'is_verified' => true,
            'verified_at' => now()->subDays(3),
            'verified_by' => $admin->id,
            'rating' => 4.85,
            'total_deliveries' => 42,
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
            'coverage_zone' => 'Yaoundé (Bastos, Omnisports)',
            'status' => 'pending',
        ]);

        $this->seedKycDocs($driverPendingUser, 'driver', 'pending');
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


