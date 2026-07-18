<?php

namespace App\Services;

use App\Models\User;
use App\Models\KycDocument;
use App\Models\KycRequest;
use App\Models\ActivityLog;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\DriverKycApprovedMail;
use App\Mail\SellerKycApprovedMail;
use Exception;

class KycService
{
    /**
     * Submit KYC documents for a user (seller or driver).
     *
     * @param User $user
     * @param array<string, UploadedFile> $documents Key-value array where key is document type and value is the file.
     * @return KycRequest
     * @throws Exception
     */
    public function submitKyc(User $user, array $documents): KycRequest
    {
        if (! in_array($user->role, ['seller', 'driver'])) {
            throw new Exception("Seuls les vendeurs et livreurs peuvent soumettre un dossier KYC.");
        }

        return DB::transaction(function () use ($user, $documents) {
            $submittedDocs = [];
            $roleType = $user->role;

            foreach ($documents as $type => $file) {
                if (! $file instanceof UploadedFile) {
                    continue;
                }

                // Define path: kyc/{user_id}/{type}_{timestamp}.{extension}
                $filename = "{$type}_" . time() . "." . $file->getClientOriginalExtension();
                $path = $file->storeAs("kyc/{$user->id}", $filename);

                // Create KycDocument entry
                $kycDoc = KycDocument::create([
                    'user_id' => $user->id,
                    'type' => $type,
                    'file_path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                    'status' => 'pending',
                ]);

                $submittedDocs[] = $kycDoc;
            }

            if (empty($submittedDocs)) {
                throw new Exception("Aucun document valide n'a été soumis.");
            }

            // Create a KYC Request for traceability
            $kycRequest = KycRequest::create([
                'user_id' => $user->id,
                'type' => $roleType,
                'status' => 'pending',
                'submitted_at' => now(),
                'documents_count' => count($submittedDocs),
            ]);

            // Update user status
            $user->update([
                'kyc_status' => 'pending',
            ]);

            // Log activity
            ActivityLog::log(
                $user->id,
                'kyc_submission',
                "Soumission de " . count($submittedDocs) . " documents pour validation KYC (Demande #{$kycRequest->id})."
            );

            return $kycRequest;
        });
    }

    /**
     * Review a full KYC Request (approve or reject).
     */
    public function reviewKycRequest(KycRequest $kycRequest, string $status, ?string $reason, User $admin, array $cniDetails = []): KycRequest
    {
        $updatedRequest = DB::transaction(function () use ($kycRequest, $status, $reason, $admin, $cniDetails) {
            $updateData = [
                'status' => $status,
                'rejection_reason' => $status === 'rejected' ? $reason : null,
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
            ];

            if ($status === 'approved' && !empty($cniDetails)) {
                $updateData = array_merge($updateData, $cniDetails);
            }

            $kycRequest->update($updateData);

            $targetUser = $kycRequest->user;

            if ($status === 'approved') {
                // Update all pending documents of this request to approved
                KycDocument::where('user_id', $targetUser->id)
                    ->where('status', 'pending')
                    ->update([
                        'status' => 'approved',
                        'reviewed_by' => $admin->id,
                        'reviewed_at' => now(),
                    ]);

                $targetUser->update([
                    'kyc_status' => 'verified',
                    'kyc_verified_at' => now(),
                ]);

                // Also update seller/driver profiles
                if ($targetUser->isSeller()) {
                    $targetUser->seller()->update([
                        'status' => 'approved',
                        'is_verified' => true,
                        'verified_at' => now(),
                        'verified_by' => $admin->id,
                    ]);
                } elseif ($targetUser->isDriver()) {
                    $targetUser->driver()->update([
                        'status' => 'approved',
                        'is_verified' => true,
                        'verified_at' => now(),
                        'verified_by' => $admin->id,
                    ]);
                }

                ActivityLog::log(
                    $targetUser->id,
                    'kyc_approved',
                    "Dossier KYC approuvé par l'administrateur {$admin->full_name}.",
                    ['admin_id' => $admin->id]
                );

            } elseif ($status === 'rejected') {
                // Update all pending documents of this request to rejected
                KycDocument::where('user_id', $targetUser->id)
                    ->where('status', 'pending')
                    ->update([
                        'status' => 'rejected',
                        'rejection_reason' => $reason,
                        'reviewed_by' => $admin->id,
                        'reviewed_at' => now(),
                    ]);

                $targetUser->update([
                    'kyc_status' => 'rejected',
                ]);

                if ($targetUser->isSeller()) {
                    $targetUser->seller()->update([
                        'status' => 'rejected',
                        'rejection_reason' => $reason,
                        'rejected_at' => now(),
                    ]);
                } elseif ($targetUser->isDriver()) {
                    $targetUser->driver()->update([
                        'status' => 'rejected',
                        'rejection_reason' => $reason,
                        'rejected_at' => now(),
                    ]);
                }

                ActivityLog::log(
                    $targetUser->id,
                    'kyc_rejected',
                    "Dossier KYC rejeté par l'administrateur {$admin->full_name}. Motif: {$reason}",
                    ['admin_id' => $admin->id, 'reason' => $reason]
                );
            }

            return $kycRequest;
        });

        // Send email notification upon successful KYC approval outside database transaction
        if ($status === 'approved') {
            $targetUser = $updatedRequest->user;
            try {
                if ($targetUser->isSeller()) {
                    Mail::to($targetUser->email)->send(new SellerKycApprovedMail($targetUser));
                } elseif ($targetUser->isDriver()) {
                    Mail::to($targetUser->email)->send(new DriverKycApprovedMail($targetUser));
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning("Failed to send KYC approval email to {$targetUser->email}: " . $e->getMessage());
            }
        }

        return $updatedRequest;
    }
}
