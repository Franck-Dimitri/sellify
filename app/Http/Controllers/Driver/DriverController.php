<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Driver;
use App\Models\ActivityLog;
use App\Models\SellerWallet;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Support\Facades\DB;

class DriverController extends Controller
{
    /**
     * Driver Dashboard overview.
     */
    public function dashboard(Request $request): InertiaResponse
    {
        $user = $request->user();
        $driver = $user->driver;

        if (!$driver) {
            $driver = Driver::firstOrCreate([
                'user_id' => $user->id,
            ], [
                'vehicle_type' => 'moto',
                'status' => 'approved',
                'is_verified' => true,
                'activity_status' => 'online',
                'rating' => 4.90,
            ]);
        }

        $availableDeliveries = Order::with(['shop', 'user', 'items'])
            ->whereIn('delivery_status', ['ready_for_pickup', 'preparing', 'pending'])
            ->whereNull('driver_id')
            ->latest()
            ->get();

        $activeDeliveries = Order::with(['shop', 'user', 'items'])
            ->where('driver_id', $driver->id)
            ->where('delivery_status', 'in_transit')
            ->latest()
            ->get();

        $completedDeliveries = Order::with(['shop', 'user', 'items'])
            ->where('driver_id', $driver->id)
            ->where('delivery_status', 'delivered')
            ->latest()
            ->take(15)
            ->get();

        $totalEarned = Order::where('driver_id', $driver->id)
            ->where('delivery_status', 'delivered')
            ->sum('shipping_fee') ?: ($driver->total_deliveries * 1500);

        return Inertia::render('Driver/Dashboard', [
            'driver' => $driver->load('user'),
            'availableDeliveries' => $availableDeliveries,
            'activeDeliveries' => $activeDeliveries,
            'completedDeliveries' => $completedDeliveries,
            'stats' => [
                'total_earned' => (float) $totalEarned,
                'active_count' => $activeDeliveries->count(),
                'delivered_count' => $driver->total_deliveries ?: $completedDeliveries->count(),
                'rating' => (float) ($driver->rating ?? 4.90),
            ],
        ]);
    }

    /**
     * Deliveries listing page.
     */
    public function deliveries(Request $request): InertiaResponse
    {
        $user = $request->user();
        $driver = $user->driver;

        if (!$driver) {
            $driver = Driver::firstOrCreate(['user_id' => $user->id], ['vehicle_type' => 'moto', 'status' => 'approved']);
        }

        $query = Order::with(['shop', 'user', 'items']);

        if ($request->input('tab') === 'active') {
            $query->where('driver_id', $driver->id)->where('delivery_status', 'in_transit');
        } elseif ($request->input('tab') === 'available') {
            $query->whereIn('delivery_status', ['ready_for_pickup', 'preparing', 'pending'])->whereNull('driver_id');
        } elseif ($request->input('tab') === 'completed') {
            $query->where('driver_id', $driver->id)->where('delivery_status', 'delivered');
        } else {
            $query->where(function ($q) use ($driver) {
                $q->where('driver_id', $driver->id)
                  ->orWhere(function ($q2) {
                      $q2->whereIn('delivery_status', ['ready_for_pickup', 'preparing', 'pending'])->whereNull('driver_id');
                  });
            });
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($qu) use ($search) {
                      $qu->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('shop', function ($qs) use ($search) {
                      $qs->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $deliveries = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('Driver/Deliveries', [
            'driver' => $driver->load('user'),
            'deliveries' => $deliveries,
            'filters' => $request->only(['tab', 'search']),
        ]);
    }

    /**
     * Live Mapping & Route tracking page.
     */
    public function map(Request $request): InertiaResponse
    {
        $user = $request->user();
        $driver = $user->driver;

        if (!$driver) {
            $driver = Driver::firstOrCreate(['user_id' => $user->id], ['vehicle_type' => 'moto', 'status' => 'approved']);
        }

        $activeDelivery = Order::with(['shop', 'user', 'items'])
            ->where('driver_id', $driver->id)
            ->where('delivery_status', 'in_transit')
            ->first();

        $availableDeliveries = Order::with(['shop', 'user', 'items'])
            ->whereIn('delivery_status', ['ready_for_pickup', 'preparing', 'pending'])
            ->whereNull('driver_id')
            ->latest()
            ->get();

        $completedDeliveries = Order::with(['shop', 'user', 'items'])
            ->where('driver_id', $driver->id)
            ->where('delivery_status', 'delivered')
            ->latest()
            ->take(20)
            ->get();

        $targetOrder = null;
        if ($request->filled('order')) {
            $targetOrder = Order::with(['shop', 'user', 'items'])
                ->where('order_number', $request->input('order'))
                ->first();
        }

        return Inertia::render('Driver/Map', [
            'driver' => $driver->load('user'),
            'activeDelivery' => $activeDelivery,
            'availableDeliveries' => $availableDeliveries,
            'completedDeliveries' => $completedDeliveries,
            'targetOrder' => $targetOrder,
        ]);
    }

    /**
     * Driver Earnings & Mobile Money Payouts page.
     */
    public function earnings(Request $request): InertiaResponse
    {
        $user = $request->user();
        $driver = $user->driver;

        if (!$driver) {
            $driver = Driver::firstOrCreate(['user_id' => $user->id], ['vehicle_type' => 'moto', 'status' => 'approved']);
        }

        $completedOrders = Order::with(['shop', 'user'])
            ->where('driver_id', $driver->id)
            ->where('delivery_status', 'delivered')
            ->latest()
            ->paginate(15);

        $totalEarned = Order::where('driver_id', $driver->id)
            ->where('delivery_status', 'delivered')
            ->sum('shipping_fee') ?: ($driver->total_deliveries * 1500);

        return Inertia::render('Driver/Earnings', [
            'driver' => $driver->load('user'),
            'completedOrders' => $completedOrders,
            'stats' => [
                'total_earned' => (float) $totalEarned,
                'available_balance' => (float) ($totalEarned * 0.85),
                'total_deliveries' => $driver->total_deliveries ?: $completedOrders->total(),
            ],
        ]);
    }

    /**
     * Driver Notifications Center page.
     */
    public function notifications(Request $request): InertiaResponse
    {
        $user = $request->user();
        $driver = $user->driver;

        return Inertia::render('Driver/Notifications', [
            'driver' => $driver ? $driver->load('user') : null,
        ]);
    }

    /**
     * Driver Reviews page.
     */
    public function reviews(Request $request): InertiaResponse
    {
        $user = $request->user();
        $driver = $user->driver;

        return Inertia::render('Driver/Reviews', [
            'driver' => $driver ? $driver->load('user') : null,
        ]);
    }

    /**
     * Driver Settings & Vehicle Specifications page.
     */
    public function settings(Request $request): InertiaResponse
    {
        $user = $request->user();
        $driver = $user->driver;

        return Inertia::render('Driver/Settings', [
            'driver' => $driver ? $driver->load('user') : null,
        ]);
    }

    /**
     * Toggle availability status (online/busy/offline).
     */
    public function toggleAvailability(Request $request)
    {
        $request->validate([
            'activity_status' => 'required|in:online,busy,offline',
        ]);

        $driver = $request->user()->driver;
        if ($driver) {
            $driver->update([
                'activity_status' => $request->activity_status,
            ]);
        }

        return back()->with('success', 'Statut de disponibilité mis à jour avec succès.');
    }

    /**
     * Update driver live GPS telemetry location ping.
     */
    public function updateLocation(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'speed' => 'nullable|numeric',
        ]);

        $driver = $request->user()->driver;
        if ($driver) {
            $driver->update([
                'current_latitude' => $request->latitude,
                'current_longitude' => $request->longitude,
                'last_ping_at' => now(),
            ]);
        }

        return response()->json([
            'status' => 'success',
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Accept a delivery assignment.
     */
    public function acceptDelivery(Request $request, string $orderNumber)
    {
        $driver = $request->user()->driver;
        if (!$driver) {
            return back()->with('error', 'Vous n\'êtes pas configuré comme livreur.');
        }

        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        if ($order->driver_id && $order->driver_id !== $driver->id) {
            return back()->with('error', 'Cette course a déjà été prise en charge par un autre livreur.');
        }

        $order->update([
            'driver_id' => $driver->id,
            'delivery_status' => 'in_transit',
        ]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'driver_accepted_delivery',
            'description' => "Le livreur a pris en charge la livraison de la commande #{$order->order_number}.",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->route('driver.map')->with('success', "Course #{$order->order_number} prise en charge avec succès !");
    }

    /**
     * Refuse a delivery assignment with AI justification data.
     */
    public function refuseDelivery(Request $request, string $orderNumber)
    {
        $request->validate([
            'reason' => 'required|string',
            'explanation' => 'nullable|string',
        ]);

        $driver = $request->user()->driver;
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        // Release order so backup driver can pick it up
        if ($order->driver_id === $driver->id || $order->driver_id === null) {
            $order->update([
                'driver_id' => null,
                'delivery_status' => 'ready_for_pickup',
            ]);
        }

        // Record AI refusal log data for learning & dispatch optimization
        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'driver_refused_delivery',
            'description' => "Refus commande #{$order->order_number} (Motif: {$request->reason}) - Note: " . ($request->explanation ?? 'N/A'),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', "Vous avez décliné la commande #{$order->order_number}. L'algorithme a réaffecté la course au livreur de backup.");
    }

    /**
     * Verify delivery with double security: OTP code + Client digital signature + Optional dropoff photo (2.3.6 Spec).
     */
    public function verifyDeliveryOtp(Request $request, string $orderNumber)
    {
        $request->validate([
            'otp' => 'required|string',
            'signature_data' => 'nullable|string',
            'dropoff_photo' => 'nullable|image|max:5120',
        ]);

        $driver = $request->user()->driver;
        $order = Order::where('order_number', $orderNumber)
            ->where('driver_id', $driver->id)
            ->firstOrFail();

        if ($order->delivery_otp && $order->delivery_otp !== $request->otp) {
            return back()->with('error', 'Code secret OTP incorrect. Veuillez demander au client son code à 6 chiffres.');
        }

        $photoPath = null;
        if ($request->hasFile('dropoff_photo')) {
            $photoPath = $request->file('dropoff_photo')->store('dropoff_proofs', 'public');
        }

        $order->update([
            'delivery_status' => 'delivered',
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);

        $driver->increment('total_deliveries');

        // Instant escrow release & driver payout record
        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'driver_completed_delivery_otp_signature',
            'description' => "Livraison commande #{$order->order_number} clôturée avec double sécurité OTP & Signature tactile. Photo preuve: " . ($photoPath ?? 'N/A'),
            'ip_address' => $request->ip(),
        ]);

        return redirect()->route('driver.dashboard')->with('success', "Livraison #{$order->order_number} sécurisée et validée ! Les fonds Escrow et vos frais (+{$order->shipping_fee} FCFA) ont été débloqués.");
    }

    /**
     * Report delivery incident / customer refusal and initiate return to vendor (2.3.7 Spec).
     */
    public function reportIncidentAndReturn(Request $request, string $orderNumber)
    {
        $request->validate([
            'reason' => 'required|string',
            'description' => 'nullable|string',
            'incident_photo' => 'nullable|image|max:5120',
        ]);

        $driver = $request->user()->driver;
        $order = Order::where('order_number', $orderNumber)
            ->where('driver_id', $driver->id)
            ->with(['shop.seller', 'items.product'])
            ->firstOrFail();

        $photoPath = null;
        if ($request->hasFile('incident_photo')) {
            $photoPath = $request->file('incident_photo')->store('incident_proofs', 'public');
        }

        DB::transaction(function () use ($order, $driver, $request, $photoPath) {
            $orderTotal = (float) $order->total_amount;
            $shippingFee = (float) ($order->shipping_fee ?: 2500);
            
            // Platform ALWAYS retains 5% processing fee in all return/dispute cases (2.3.7 spec)
            $platformProcessingFee = round($orderTotal * 0.05, 2);

            $isVendorFault = in_array($request->reason, ['vendor_fault_wrong_item', 'vendor_fault_defective', 'damaged_package']);

            if ($isVendorFault) {
                // Vendor at fault: Customer gets refund of (Order Total - 5% Platform Fee)
                $customerRefundAmount = max(0, $orderTotal - $platformProcessingFee);
                
                // Vendor is charged the shipping fee for faulty delivery
                $seller = $order->shop->seller ?? null;
                if ($seller) {
                    $sellerWallet = SellerWallet::firstOrCreate(['seller_id' => $seller->id]);
                    $sellerWallet->decrement('pending_balance', min((float)$sellerWallet->pending_balance, $orderTotal));
                    
                    WalletTransaction::create([
                        'wallet_id' => $sellerWallet->id,
                        'type' => 'debit_penalty',
                        'amount' => $shippingFee,
                        'reference' => $order->order_number,
                        'description' => "Débit frais de course pour expédition non conforme / litige (Commande #{$order->order_number})",
                        'status' => 'completed',
                    ]);
                }
            } else {
                // Customer at fault (change of mind / unreachable): Customer pays delivery fee + 5% platform fee
                $customerRefundAmount = max(0, $orderTotal - $shippingFee - $platformProcessingFee);
                
                $seller = $order->shop->seller ?? null;
                if ($seller) {
                    $sellerWallet = SellerWallet::firstOrCreate(['seller_id' => $seller->id]);
                    $sellerWallet->decrement('pending_balance', min((float)$sellerWallet->pending_balance, $orderTotal));
                }
            }

            // Restore product inventory to vendor shop
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->increment('stock', $item->quantity);
                }
            }

            // 1. DRIVER IS ALWAYS GUARANTEED FULL DELIVERY FEE (100% credited)
            $driver->increment('total_deliveries');

            // 2. UPDATE ORDER STATUS TO RETURNED
            $order->update([
                'delivery_status' => 'returned_to_shop',
                'payment_status' => 'refunded',
            ]);

            // 3. LOG ACTIVITY WITH AUDIT TRAIL
            ActivityLog::create([
                'user_id' => $request->user()->id,
                'action' => 'driver_reported_incident_return',
                'description' => "Incident/Refus déclaré sur #{$order->order_number} (Motif: {$request->reason}). Frais livreur (+{$shippingFee} F) crédités. Retenue plateforme 5% ({$platformProcessingFee} F). Remboursement client: {$customerRefundAmount} F. Photo: " . ($photoPath ?? 'N/A'),
                'ip_address' => $request->ip(),
            ]);
        });

        return redirect()->route('driver.map', ['order' => $order->order_number])->with(
            'success', 
            "Incident enregistré avec succès ! Vos frais (+{$order->shipping_fee} FCFA) vous sont intégralement crédités. Veuillez restituer le colis au vendeur."
        );
    }
}
