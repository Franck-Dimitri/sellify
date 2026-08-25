<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Seller;
use App\Models\SellerWallet;
use App\Models\WalletTransaction;
use App\Models\Driver;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EscrowService
{
    /**
     * Step 1: Hold funds under Escrow when an order is paid.
     */
    public function holdEscrow(Order $order): bool
    {
        return DB::transaction(function () use ($order) {
            $seller = $order->shop->seller ?? null;
            if (!$seller) {
                return false;
            }

            $orderAmount = (float) $order->total_amount;

            $wallet = SellerWallet::firstOrCreate(
                ['seller_id' => $seller->id],
                ['balance' => 0, 'pending_balance' => 0, 'currency' => 'FCFA']
            );

            // Increment seller's pending escrow balance
            $wallet->increment('pending_balance', $orderAmount);

            // Record transaction ledger
            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'credit_escrow',
                'amount' => $orderAmount,
                'reference' => $order->order_number,
                'description' => "Consignation sous séquestre Escrow (Commande #{$order->order_number})",
                'status' => 'completed',
            ]);

            $order->update([
                'payment_status' => 'escrow_held',
            ]);

            ActivityLog::create([
                'user_id' => $order->user_id ?? $seller->user_id,
                'action' => 'escrow_held',
                'description' => "Fonds de {$orderAmount} FCFA consignés sous séquestre pour la commande #{$order->order_number}.",
            ]);

            return true;
        });
    }

    /**
     * Step 2: Release Escrow funds automatically to the seller & driver upon delivery validation.
     * Triggered by: Customer Confirm Receipt OR Driver OTP Validation OR Admin Arbitrage.
     */
    public function releaseEscrow(Order $order, string $releasedBy = 'system', ?int $actorUserId = null): bool
    {
        return DB::transaction(function () use ($order, $releasedBy, $actorUserId) {
            // Idempotency: Prevent double release
            if ($order->payment_status === 'released') {
                return true;
            }

            $seller = $order->shop->seller ?? null;
            $orderTotal = (float) $order->total_amount;
            $shippingFee = (float) ($order->shipping_fee ?: 0);

            // 1. Update Order Status
            $order->update([
                'delivery_status' => 'delivered',
                'payment_status' => 'released',
                'delivered_at' => now(),
            ]);

            // 2. Release Seller Escrow (Move from pending_balance -> available balance)
            if ($seller) {
                $sellerWallet = SellerWallet::firstOrCreate(
                    ['seller_id' => $seller->id],
                    ['balance' => 0, 'pending_balance' => 0, 'currency' => 'FCFA']
                );

                // Deduct safely from pending_balance and add to available balance
                $pendingToDeduct = (float) min((float) $sellerWallet->pending_balance, $orderTotal);
                if ($pendingToDeduct > 0) {
                    $sellerWallet->decrement('pending_balance', $pendingToDeduct);
                }
                $sellerWallet->increment('balance', $orderTotal);

                // Record ledger transaction
                WalletTransaction::create([
                    'wallet_id' => $sellerWallet->id,
                    'type' => 'release_escrow',
                    'amount' => $orderTotal,
                    'reference' => $order->order_number,
                    'description' => "Fonds débloqués du séquestre Escrow (Commande #{$order->order_number} livrée & validée)",
                    'status' => 'completed',
                ]);
            }

            // 3. Driver Delivery Stats & Payout Update
            if ($order->driver_id) {
                $driver = Driver::find($order->driver_id);
                if ($driver) {
                    $driver->increment('total_deliveries');
                }
            }

            // 4. Reward Customer Loyalty Points
            if ($order->user_id) {
                $customer = User::find($order->user_id);
                if ($customer) {
                    $pointsEarned = max(10, (int) round($order->total_amount / 100)); // 1 pt pour 100 FCFA
                    $customer->increment('loyalty_points', $pointsEarned);
                }
            }

            // 5. Activity Log Audit Trail
            ActivityLog::create([
                'user_id' => $actorUserId ?: ($order->user_id ?? 1),
                'action' => 'escrow_released',
                'description' => "Libération automatique du séquestre Escrow pour la commande #{$order->order_number} (Déclenché par: {$releasedBy}). Vendeur crédité de {$orderTotal} FCFA.",
            ]);

            return true;
        });
    }

    /**
     * Step 3: Refund Escrow funds to customer (Order cancelled or dispute won by buyer).
     */
    public function refundEscrow(Order $order, string $reason = 'cancelled', ?int $actorUserId = null): bool
    {
        return DB::transaction(function () use ($order, $reason, $actorUserId) {
            if ($order->payment_status === 'refunded') {
                return true;
            }

            $seller = $order->shop->seller ?? null;
            $orderTotal = (float) $order->total_amount;

            // 1. Revert product stock
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->increment('stock', $item->quantity);
                }
            }

            // 2. Reverse seller pending balance
            if ($seller && $order->payment_status === 'escrow_held') {
                $sellerWallet = SellerWallet::firstOrCreate(
                    ['seller_id' => $seller->id],
                    ['balance' => 0, 'pending_balance' => 0, 'currency' => 'FCFA']
                );

                $pendingToDeduct = (float) min((float) $sellerWallet->pending_balance, $orderTotal);
                if ($pendingToDeduct > 0) {
                    $sellerWallet->decrement('pending_balance', $pendingToDeduct);
                }

                WalletTransaction::create([
                    'wallet_id' => $sellerWallet->id,
                    'type' => 'refund_escrow',
                    'amount' => $orderTotal,
                    'reference' => $order->order_number,
                    'description' => "Remboursement des fonds séquestres ({$reason}) pour la commande #{$order->order_number}",
                    'status' => 'completed',
                ]);
            }

            // 3. Update Order
            $order->update([
                'delivery_status' => 'cancelled',
                'payment_status' => 'refunded',
            ]);

            ActivityLog::create([
                'user_id' => $actorUserId ?: ($order->user_id ?? 1),
                'action' => 'escrow_refunded',
                'description' => "Annulation et remboursement intégral des fonds sous séquestre pour la commande #{$order->order_number} ({$reason}).",
            ]);

            return true;
        });
    }
}
