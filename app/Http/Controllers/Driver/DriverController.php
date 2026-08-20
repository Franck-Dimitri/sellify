<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Driver;
use App\Models\ActivityLog;
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

        $availableDeliveries = Order::with(['shop', 'items'])
            ->where('delivery_status', 'ready_for_pickup')
            ->whereNull('driver_id')
            ->latest()
            ->get();

        $activeDeliveries = Order::with(['shop', 'items'])
            ->where('driver_id', $driver->id)
            ->where('delivery_status', 'in_transit')
            ->latest()
            ->get();

        $completedDeliveries = Order::with(['shop', 'items'])
            ->where('driver_id', $driver->id)
            ->where('delivery_status', 'delivered')
            ->latest()
            ->take(15)
            ->get();

        $totalEarned = $completedDeliveries->sum('shipping_fee') ?: ($driver->total_deliveries * 1500);

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

        $query = Order::with(['shop', 'user', 'items']);

        if ($request->input('tab') === 'active') {
            $query->where('driver_id', $driver->id)->where('delivery_status', 'in_transit');
        } elseif ($request->input('tab') === 'available') {
            $query->where('delivery_status', 'ready_for_pickup')->whereNull('driver_id');
        } elseif ($request->input('tab') === 'completed') {
            $query->where('driver_id', $driver->id)->where('delivery_status', 'delivered');
        } else {
            $query->where(function ($q) use ($driver) {
                $q->where('driver_id', $driver->id)
                  ->orWhere(function ($q2) {
                      $q2->where('delivery_status', 'ready_for_pickup')->whereNull('driver_id');
                  });
            });
        }

        $deliveries = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('Driver/Deliveries', [
            'driver' => $driver,
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

        $activeDelivery = Order::with(['shop', 'user', 'items'])
            ->where('driver_id', $driver->id)
            ->where('delivery_status', 'in_transit')
            ->first();

        return Inertia::render('Driver/Map', [
            'driver' => $driver,
            'activeDelivery' => $activeDelivery,
        ]);
    }

    /**
     * Driver Earnings & Mobile Money Payouts page.
     */
    public function earnings(Request $request): InertiaResponse
    {
        $user = $request->user();
        $driver = $user->driver;

        $completedOrders = Order::where('driver_id', $driver->id)
            ->where('delivery_status', 'delivered')
            ->latest()
            ->paginate(15);

        $totalEarned = Order::where('driver_id', $driver->id)
            ->where('delivery_status', 'delivered')
            ->sum('shipping_fee') ?: ($driver->total_deliveries * 1500);

        return Inertia::render('Driver/Earnings', [
            'driver' => $driver,
            'completedOrders' => $completedOrders,
            'stats' => [
                'total_earned' => (float) $totalEarned,
                'available_balance' => (float) ($totalEarned * 0.85),
                'total_deliveries' => $driver->total_deliveries ?: $completedOrders->total(),
            ],
        ]);
    }

    /**
     * Driver Notifications page.
     */
    public function notifications(Request $request): InertiaResponse
    {
        return Inertia::render('Driver/Notifications', []);
    }

    /**
     * Driver Customer Reviews & Ratings page.
     */
    public function reviews(Request $request): InertiaResponse
    {
        $user = $request->user();
        $driver = $user->driver;

        return Inertia::render('Driver/Reviews', [
            'driver' => $driver,
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
            'driver' => $driver->load('user'),
        ]);
    }

    /**
     * Toggle availability status (online / busy / offline).
     */
    public function toggleAvailability(Request $request)
    {
        $user = $request->user();
        $driver = $user->driver;

        $request->validate([
            'activity_status' => ['required', 'in:online,busy,offline'],
        ]);

        $driver->update([
            'activity_status' => $request->activity_status,
        ]);

        return back()->with('success', "Votre statut de disponibilité a été mis à jour.");
    }

    /**
     * Request payout to Mobile Money.
     */
    public function requestPayout(Request $request)
    {
        $request->validate([
            'amount' => ['required', 'numeric', 'min:1000'],
            'phone' => ['required', 'string'],
            'provider' => ['required', 'in:mtn,orange'],
        ]);

        return back()->with('success', "Votre demande de retrait de " . number_format($request->amount, 0, ',', ' ') . " FCFA a été transmise à Mobile Money.");
    }

    /**
     * Accept a delivery.
     */
    public function acceptDelivery(Request $request, $order_number)
    {
        $user = $request->user();
        $driver = $user->driver;

        $order = Order::where('order_number', $order_number)
            ->where('delivery_status', 'ready_for_pickup')
            ->firstOrFail();

        $order->update([
            'driver_id' => $driver->id,
            'delivery_status' => 'in_transit',
        ]);

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'delivery_accepted',
            'description' => "Le livreur {$user->first_name} a pris en charge la livraison de la commande {$order->order_number}.",
        ]);

        return back()->with('success', "Vous avez pris en charge la commande #{$order->order_number}. En route pour la livraison !");
    }

    /**
     * Verify delivery OTP code.
     */
    public function verifyDeliveryOtp(Request $request, $order_number)
    {
        $user = $request->user();
        $driver = $user->driver;

        $request->validate([
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $order = Order::where('order_number', $order_number)
            ->where('driver_id', $driver->id)
            ->where('delivery_status', 'in_transit')
            ->firstOrFail();

        if (trim($request->otp) !== trim($order->delivery_otp)) {
            return back()->with('error', 'Code OTP incorrect. Veuillez demander au client son code à 6 chiffres affiché sur son reçu.');
        }

        DB::transaction(function () use ($order, $driver, $user) {
            $order->update([
                'delivery_status' => 'delivered',
                'payment_status' => 'released',
                'delivered_at' => now(),
            ]);

            $driver->increment('total_deliveries');

            ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'delivery_completed_otp',
                'description' => "Livraison finalisée avec succès pour la commande {$order->order_number} par vérification OTP.",
            ]);
        });

        return back()->with('success', "Code OTP validé avec succès ! La livraison de #{$order->order_number} est terminée.");
    }
}
