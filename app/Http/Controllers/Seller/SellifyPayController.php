<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\SellerLoan;
use App\Services\FintechEngine;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class SellifyPayController extends Controller
{
    protected FintechEngine $fintechEngine;

    public function __construct(FintechEngine $fintechEngine)
    {
        $this->fintechEngine = $fintechEngine;
    }

    /**
     * Display SellifyPay dashboard, credit score, simulator & loans.
     */
    public function index(Request $request): InertiaResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $creditData = $this->fintechEngine->calculateSellerScore($seller);
        $loans = SellerLoan::where('seller_id', $seller->id)
            ->with('repayments')
            ->latest()
            ->get();

        return Inertia::render('Seller/Loans/Index', [
            'creditData' => $creditData,
            'loans' => $loans,
            'pack' => $seller->pack,
        ]);
    }

    /**
     * Submit a loan request.
     */
    public function requestLoan(Request $request): RedirectResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $creditData = $this->fintechEngine->calculateSellerScore($seller);

        if (!$creditData['is_eligible']) {
            return back()->withErrors([
                'amount' => 'Votre score de crédit ou vos critères actuels ne permettent pas encore de contracter un prêt SellifyPay.'
            ]);
        }

        $validated = $request->validate([
            'amount' => "required|numeric|min:50000|max:{$creditData['max_loan_amount']}",
            'duration_months' => 'required|integer|in:3,6,12',
        ]);

        $amount = (float)$validated['amount'];
        $duration = (int)$validated['duration_months'];
        $rate = $creditData['interest_rate'];

        $simulation = $this->fintechEngine->simulateLoan($amount, $duration, $rate);

        $loan = SellerLoan::create([
            'seller_id' => $seller->id,
            'amount' => $amount,
            'interest_rate' => $rate,
            'duration_months' => $duration,
            'monthly_payment' => $simulation['monthly_payment'],
            'total_amount_due' => $simulation['total_due'],
            'amount_repaid' => 0,
            'ai_score_at_approval' => $creditData['score'],
            'status' => 'approved',
        ]);

        // Auto disburse for instant demo/experience
        $this->fintechEngine->disburseLoan($loan);

        ActivityLog::log(
            $request->user()->id,
            'loan_requested',
            "Demande et approbation du prêt SellifyPay de {$amount} FCFA sur {$duration} mois."
        );

        return redirect()->route('seller.loans.index')
            ->with('success', "Votre prêt SellifyPay de {$amount} FCFA a été approuvé et crédité sur votre portefeuille !");
    }
}
