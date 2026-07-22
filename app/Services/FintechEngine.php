<?php

namespace App\Services;

use App\Models\Seller;
use App\Models\SellerLoan;
use App\Models\SellerWallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Carbon;

class FintechEngine
{
    /**
     * Calculate seller credit score (0-100) based on platform history:
     * - Average monthly GMV (3 months)
     * - Account seniority
     * - Ratings & dispute rate
     */
    public function calculateSellerScore(Seller $seller): array
    {
        // 1. Seniority score (max 25 pts) - 3+ months required for max pts
        $createdMonths = max(1, (int)$seller->created_at->diffInMonths(now()));
        $seniorityScore = min(25, $createdMonths * 8);

        // 2. GMV / Ventes score (max 40 pts)
        // Simulated / calculated GMV based on seller products and activity
        $totalStockValue = $seller->products()->sum(\DB::raw('price * stock'));
        $estimatedMonthlyGmv = max(100000, $totalStockValue * 0.4); // Estimé selon stock si nouvelles transactions
        $gmvScore = min(40, ($estimatedMonthlyGmv / 500000) * 40);

        // 3. KYC & Pack bonus (max 20 pts)
        $packScore = match ($seller->pack) {
            'business' => 20,
            'pro' => 15,
            default => 5,
        };

        // 4. Repayment / History score (max 15 pts)
        $completedLoans = $seller->loans()->where('status', 'completed')->count();
        $historyScore = min(15, $completedLoans * 7.5 + 10);

        $totalScore = (int)round($seniorityScore + $gmvScore + $packScore + $historyScore);
        $totalScore = min(100, max(0, $totalScore));

        // Plafond initial : 50% du GMV mensuel moyen sur 3 mois
        $maxLoanAmount = round($estimatedMonthlyGmv * 0.5, -3); // Arrondi au millier près

        // Prerequisites check
        $hasRequiredPack = in_array($seller->pack, ['pro', 'business']);
        $isKycVerified = $seller->is_verified;
        $hasActiveLoan = $seller->loans()->whereIn('status', ['pending', 'approved', 'active'])->exists();
        $isEligible = $hasRequiredPack && $isKycVerified && !$hasActiveLoan && $totalScore >= 60;

        return [
            'score' => $totalScore,
            'is_eligible' => $isEligible,
            'estimated_monthly_gmv' => $estimatedMonthlyGmv,
            'max_loan_amount' => max(100000, $maxLoanAmount),
            'requirements' => [
                'pack_eligible' => $hasRequiredPack,
                'kyc_verified' => $isKycVerified,
                'no_active_loan' => !$hasActiveLoan,
                'min_score_met' => $totalScore >= 60,
            ],
            'interest_rate' => $seller->pack === 'business' ? 0.05 : 0.08, // 5% business, 8% pro
        ];
    }

    /**
     * Simulate loan repayment details
     */
    public function simulateLoan(float $amount, int $durationMonths, float $annualInterestRate): array
    {
        $interest = $amount * $annualInterestRate * ($durationMonths / 12);
        $totalDue = $amount + $interest;
        $monthlyPayment = round($totalDue / $durationMonths, 2);

        return [
            'amount' => $amount,
            'duration_months' => $durationMonths,
            'annual_interest_rate' => $annualInterestRate,
            'total_interest' => round($interest, 2),
            'total_due' => round($totalDue, 2),
            'monthly_payment' => $monthlyPayment,
            'taeg' => round($annualInterestRate * 100, 2) . '%',
        ];
    }

    /**
     * Disburse loan funds into seller wallet
     */
    public function disburseLoan(SellerLoan $loan): bool
    {
        if ($loan->status !== 'approved') {
            return false;
        }

        $wallet = SellerWallet::firstOrCreate(
            ['seller_id' => $loan->seller_id],
            ['balance' => 0, 'pending_balance' => 0, 'currency' => 'FCFA']
        );

        $wallet->increment('balance', $loan->amount);

        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'type' => 'credit_loan_disbursement',
            'amount' => $loan->amount,
            'reference' => 'LOAN-' . $loan->id,
            'description' => "Décaissement du micro-prêt SellifyPay #{$loan->id}",
            'status' => 'completed',
        ]);

        $loan->update([
            'status' => 'active',
            'disbursed_at' => now(),
        ]);

        return true;
    }
}
