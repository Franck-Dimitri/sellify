<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\SellerWallet;
use App\Models\WalletTransaction;
use App\Models\Withdrawal;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class WalletController extends Controller
{
    /**
     * Display seller wallet, multi-shop financial breakdown and transaction history.
     */
    public function index(Request $request): InertiaResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $wallet = SellerWallet::firstOrCreate(
            ['seller_id' => $seller->id],
            ['balance' => 250000.00, 'pending_balance' => 45000.00, 'currency' => 'FCFA']
        );

        $shops = $seller->shops()->with('products')->get();
        
        // Multi-shop breakdown calculation
        $shopsBreakdown = [];
        $totalShopsCount = $shops->count();

        foreach ($shops as $idx => $shop) {
            // Distribute balance and pending balance proportionally across shops for demonstration
            $ratio = $totalShopsCount > 0 ? (1 / $totalShopsCount) : 1;
            $shopBalance = round($wallet->balance * $ratio, 2);
            $shopPending = round($wallet->pending_balance * $ratio, 2);
            $productsCount = $shop->products->count();

            $shopsBreakdown[] = [
                'id' => $shop->id,
                'name' => $shop->name,
                'slug' => $shop->slug,
                'balance' => $shopBalance,
                'pending_balance' => $shopPending,
                'products_count' => $productsCount,
                'currency' => 'FCFA',
            ];
        }

        $transactions = WalletTransaction::where('wallet_id', $wallet->id)
            ->latest()
            ->take(30)
            ->get();

        $withdrawals = Withdrawal::where('seller_id', $seller->id)
            ->latest()
            ->get();

        return Inertia::render('Seller/Wallet/Index', [
            'wallet' => $wallet,
            'shopsBreakdown' => $shopsBreakdown,
            'transactions' => $transactions,
            'withdrawals' => $withdrawals,
        ]);
    }

    /**
     * Request a withdrawal to Mobile Money or Bank Account.
     */
    public function requestWithdrawal(Request $request): RedirectResponse
    {
        $seller = $request->user()->seller;
        if (!$seller) {
            abort(403);
        }

        $wallet = SellerWallet::where('seller_id', $seller->id)->firstOrFail();

        $validated = $request->validate([
            'amount' => "required|numeric|min:5000|max:{$wallet->balance}",
            'payment_method' => 'required|in:orange_money,mtn_momo,bank_transfer',
            'phone_number' => 'required_if:payment_method,orange_money,mtn_momo|nullable|string',
            'bank_details' => 'required_if:payment_method,bank_transfer|nullable|array',
            'shop_id' => 'nullable|exists:shops,id',
        ]);

        $amount = (float)$validated['amount'];
        $fee = 0; // Gratuit pour les vendeurs Sellify
        $netAmount = $amount - $fee;

        // Create withdrawal record
        $withdrawal = Withdrawal::create([
            'seller_id' => $seller->id,
            'amount' => $amount,
            'fee' => $fee,
            'net_amount' => $netAmount,
            'payment_method' => $validated['payment_method'],
            'phone_number' => $validated['phone_number'] ?? null,
            'bank_details' => $validated['bank_details'] ?? null,
            'status' => 'pending',
        ]);

        // Deduct from wallet balance & create transaction log
        $wallet->decrement('balance', $amount);

        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'type' => 'debit_withdrawal',
            'amount' => $amount,
            'reference' => 'WITHDRAW-' . $withdrawal->id,
            'description' => "Demande de retrait via " . strtoupper(str_replace('_', ' ', $validated['payment_method'])),
            'status' => 'pending',
        ]);

        ActivityLog::log(
            $request->user()->id,
            'withdrawal_requested',
            "Demande de retrait de {$amount} FCFA vers " . strtoupper($validated['payment_method'])
        );

        return redirect()->route('seller.wallet.index')
            ->with('success', 'Votre demande de retrait a été enregistrée avec succès. Les fonds seront transférés sous 24h.');
    }
}
