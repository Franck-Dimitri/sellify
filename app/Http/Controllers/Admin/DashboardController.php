<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Seller;
use App\Models\Driver;
use App\Models\Shop;
use App\Models\Product;
use App\Models\Order;
use App\Models\Dispute;
use App\Models\KycRequest;
use App\Models\PromoCode;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Show comprehensive admin dashboard statistics across all client, seller & driver operations.
     */
    public function index(): InertiaResponse
    {
        // 1. Financial & Escrow Metrics
        $totalEscrowVolume = Order::whereIn('payment_status', ['escrow_held', 'released'])->sum('total_amount');
        $escrowHeldAmount = Order::where('payment_status', 'escrow_held')->sum('total_amount');
        $releasedAmount = Order::where('payment_status', 'released')->sum('total_amount');
        $platformCommission = (float) ($totalEscrowVolume * 0.03); // 3% platform commission
        $totalRefundedAmount = Order::where('payment_status', 'refunded')->sum('total_amount');

        // 2. Order & Logistics Metrics
        $totalOrdersCount = Order::count();
        $pendingOrdersCount = Order::whereIn('delivery_status', ['pending', 'preparing'])->count();
        $inTransitOrdersCount = Order::where('delivery_status', 'in_transit')->count();
        $deliveredOrdersCount = Order::where('delivery_status', 'delivered')->count();
        $disputedOrdersCount = Order::whereHas('dispute')->count();
        $cancelledOrdersCount = Order::where('delivery_status', 'cancelled')->count();

        // 3. User & Entity Metrics
        $stats = [
            'total_users' => User::count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_sellers' => Seller::count(),
            'verified_sellers' => Seller::where('status', 'approved')->count(),
            'pending_sellers' => Seller::where('status', 'pending')->count(),
            'total_shops' => Shop::where('is_active', true)->count(),
            'total_products' => Product::where('is_active', true)->count(),
            'total_drivers' => Driver::count(),
            'verified_drivers' => Driver::where('status', 'approved')->count(),
            'pending_drivers' => Driver::where('status', 'pending')->count(),
            'pending_kyc_requests' => KycRequest::where('status', 'pending')->count(),
            'active_promo_codes' => PromoCode::where('is_active', true)->whereDate('end_date', '>=', now())->count(),
            
            // Financials
            'total_escrow_volume' => (float) $totalEscrowVolume,
            'escrow_held_amount' => (float) $escrowHeldAmount,
            'released_amount' => (float) $releasedAmount,
            'platform_commission' => $platformCommission,
            'total_refunded' => (float) $totalRefundedAmount,

            // Order counts
            'total_orders' => $totalOrdersCount,
            'pending_orders' => $pendingOrdersCount,
            'in_transit_orders' => $inTransitOrdersCount,
            'delivered_orders' => $deliveredOrdersCount,
            'disputed_orders' => $disputedOrdersCount,
            'cancelled_orders' => $cancelledOrdersCount,
        ];

        // 4. Monthly Escrow Trend (Last 6 Months)
        $monthlyTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = now()->subMonths($i);
            $monthLabel = ucfirst($monthDate->translatedFormat('M Y'));
            
            $volume = Order::whereIn('payment_status', ['escrow_held', 'released'])
                ->whereYear('created_at', $monthDate->year)
                ->whereMonth('created_at', $monthDate->month)
                ->sum('total_amount');

            $commission = $volume * 0.03;

            $monthlyTrend[] = [
                'month' => $monthLabel,
                'volume' => (float) $volume,
                'commission' => (float) $commission,
            ];
        }

        // 5. Recent Escrow Orders
        $recentOrders = Order::with(['user', 'shop.seller', 'driver.user'])
            ->latest()
            ->take(6)
            ->get();

        // 6. Urgent Disputes Requiring Admin Arbitration
        $urgentDisputes = Dispute::whereIn('status', ['opened', 'defense_submitted'])
            ->with(['order.user', 'order.shop'])
            ->latest()
            ->take(5)
            ->get();

        // 7. Recent KYC Submissions
        $recentKycSubmissions = KycRequest::with(['user'])
            ->orderByDesc('submitted_at')
            ->limit(5)
            ->get();

        // 8. Recent Activity Logs
        $recentActivities = ActivityLog::with(['user'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'monthlyTrend' => $monthlyTrend,
            'recentOrders' => $recentOrders,
            'urgentDisputes' => $urgentDisputes,
            'recentKyc' => $recentKycSubmissions,
            'activities' => $recentActivities,
        ]);
    }

    /**
     * Resolve dispute (Admin Arbitration).
     */
    public function resolveDispute(Request $request, Dispute $dispute)
    {
        $validated = $request->validate([
            'resolution' => ['required', 'in:refund_buyer,release_seller'],
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $order = $dispute->order;

        if ($validated['resolution'] === 'refund_buyer') {
            $dispute->update([
                'status' => 'resolved_refund',
                'admin_notes' => $validated['admin_notes'] ?? 'Arbitrage Admin: Remboursement intégral de l\'acheteur.',
                'resolved_at' => now(),
            ]);

            $order->update([
                'delivery_status' => 'cancelled',
                'payment_status' => 'refunded',
            ]);

            // Reverse seller escrow pending balance
            if ($order->shop && $order->shop->seller) {
                $wallet = \App\Models\SellerWallet::firstOrCreate(['seller_id' => $order->shop->seller->id]);
                $pendingToDeduct = (float) min((float)$wallet->pending_balance, (float)$order->total_amount);
                if ($pendingToDeduct > 0) {
                    $wallet->decrement('pending_balance', $pendingToDeduct);
                }
            }

            $message = 'Le litige a été résolu en faveur de l\'acheteur. Les fonds ont été remboursés.';
        } else {
            $dispute->update([
                'status' => 'resolved_seller',
                'admin_notes' => $validated['admin_notes'] ?? 'Arbitrage Admin: Rejet de la réclamation client, fonds débloqués au vendeur.',
                'resolved_at' => now(),
            ]);

            $order->update([
                'delivery_status' => 'delivered',
                'payment_status' => 'released',
                'delivered_at' => now(),
            ]);

            // Credit seller wallet
            if ($order->shop && $order->shop->seller) {
                $wallet = \App\Models\SellerWallet::firstOrCreate(['seller_id' => $order->shop->seller->id]);
                $amountToRelease = (float) $order->total_amount;
                $pendingToDeduct = (float) min((float)$wallet->pending_balance, $amountToRelease);
                if ($pendingToDeduct > 0) {
                    $wallet->decrement('pending_balance', $pendingToDeduct);
                }
                $wallet->increment('balance', $amountToRelease);
            }

            $message = 'Le litige a été résolu en faveur du vendeur. Les fonds sous séquestre ont été versés sur son solde disponible.';
        }

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'admin_dispute_resolved',
            'description' => "Arbitrage Admin sur la commande #{$order->order_number} : {$message}",
        ]);

        return back()->with('success', $message);
    }
}
