<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\SmartLinkService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;

class SmartLinkCheckoutController extends Controller
{
    protected SmartLinkService $smartLinkService;

    public function __construct(SmartLinkService $smartLinkService)
    {
        $this->smartLinkService = $smartLinkService;
    }

    /**
     * Display public Fast Checkout page.
     */
    public function show(string $token): InertiaResponse|RedirectResponse
    {
        $smartLink = $this->smartLinkService->validateSmartLink($token);

        if (!$smartLink) {
            return Inertia::render('Public/SmartLinkExpired', [
                'token' => $token,
            ]);
        }

        $shop = $smartLink->product ? $smartLink->product->shop : ($smartLink->seller->shops()->first() ?? null);

        return Inertia::render('Public/FastCheckout', [
            'smartLink' => $smartLink,
            'product' => $smartLink->product,
            'shop' => $shop,
        ]);
    }

    /**
     * Process Mobile Money Fast Checkout Escrow Payment.
     */
    public function processPayment(Request $request, string $token): RedirectResponse
    {
        $smartLink = $this->smartLinkService->validateSmartLink($token);

        if (!$smartLink) {
            return back()->withErrors(['token' => 'Ce lien de paiement est expiré ou invalide.']);
        }

        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'phone_number' => 'required|string|min:8|max:20',
            'delivery_address' => 'required|string|max:500',
            'city_neighborhood' => 'nullable|string|max:255',
            'delivery_notes' => 'nullable|string|max:1000',
            'payment_method' => 'required|in:orange_money,mtn_momo',
        ]);

        $trackingCode = $smartLink->tracking_code ?: $this->smartLinkService->generateTrackingCode();

        $deliveryInfo = [
            'customer_name' => $validated['customer_name'],
            'phone_number' => $validated['phone_number'],
            'delivery_address' => $validated['delivery_address'],
            'city_neighborhood' => $validated['city_neighborhood'] ?? '',
            'delivery_notes' => $validated['delivery_notes'] ?? '',
            'payment_method' => $validated['payment_method'],
            'paid_at' => now()->toDateTimeString(),
            'current_step' => 'processing', // steps: paid, processing, shipped, out_for_delivery, delivered
        ];

        // Mark link as paid, store tracking code and delivery info, increment conversions
        $smartLink->update([
            'status' => 'paid',
            'tracking_code' => $trackingCode,
            'delivery_info' => $deliveryInfo,
        ]);
        $smartLink->increment('conversions_count');

        return redirect()->route('public.order_tracking', ['tracking_code' => $trackingCode])
            ->with('success', 'Paiement Escrow sécurisé validé ! Voici votre lien de suivi de colis.');
    }
}
