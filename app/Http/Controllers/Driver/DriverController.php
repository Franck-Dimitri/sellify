<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Driver;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DriverController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $driver = $user->driver;

        if (!$driver) {
            return redirect()->route('welcome')->with('error', 'Profil livreur introuvable.');
        }

        // Available packages ready for pickup in driver's general area or overall
        $availableDeliveries = Order::with(['shop', 'items'])
            ->where('delivery_status', 'ready_for_pickup')
            ->whereNull('driver_id')
            ->latest()
            ->get();

        // Active ongoing deliveries for this driver
        $activeDeliveries = Order::with(['shop', 'items'])
            ->where('driver_id', $driver->id)
            ->where('delivery_status', 'in_transit')
            ->latest()
            ->get();

        // Past completed deliveries
        $completedDeliveries = Order::with(['shop', 'items'])
            ->where('driver_id', $driver->id)
            ->where('delivery_status', 'delivered')
            ->latest()
            ->take(15)
            ->get();

        // Stats calculation
        $totalEarned = $completedDeliveries->sum('shipping_fee');
        $activeCount = $activeDeliveries->count();
        $deliveredCount = $completedDeliveries->count();

        return Inertia::render('Driver/Dashboard', [
            'driver' => $driver->load('user'),
            'availableDeliveries' => $availableDeliveries,
            'activeDeliveries' => $activeDeliveries,
            'completedDeliveries' => $completedDeliveries,
            'stats' => [
                'total_earned' => $totalEarned,
                'active_count' => $activeCount,
                'delivered_count' => $deliveredCount,
                'rating' => $driver->rating ?? 4.9,
            ],
        ]);
    }

    public function acceptDelivery(Request $request, $order_number)
    {
        $user = $request->user();
        $driver = $user->driver;

        if (!$driver || $user->kyc_status !== 'verified') {
            return back()->with('error', 'Votre compte livreur doit être validé pour accepter des courses.');
        }

        $order = Order::where('order_number', $order_number)
            ->where('delivery_status', 'ready_for_pickup')
            ->whereNull('driver_id')
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

        return back()->with('success', "Vous avez pris en charge la commande {$order->order_number}. En route pour la livraison !");
    }

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

            // Release escrow money to seller wallet
            $shop = $order->shop;
            if ($shop && $shop->seller) {
                $seller = $shop->seller;
                $seller->increment('balance', $order->subtotal);
                if ($seller->pending_balance >= $order->subtotal) {
                    $seller->decrement('pending_balance', $order->subtotal);
                }
            }

            // Increment driver deliveries count
            $driver->increment('total_deliveries');

            ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'delivery_completed_otp',
                'description' => "Livraison finalisée avec succès pour la commande {$order->order_number} par vérification OTP. Fonds Escrow débloqués.",
            ]);
        });

        return back()->with('success', "Code OTP validé avec succès ! La livraison de {$order->order_number} est terminée et le paiement a été débloqué.");
    }
}
