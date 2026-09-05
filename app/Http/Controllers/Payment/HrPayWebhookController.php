<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Payment\HrPayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HrPayWebhookController extends Controller
{
    protected HrPayService $hrPayService;

    public function __construct(HrPayService $hrPayService)
    {
        $this->hrPayService = $hrPayService;
    }

    /**
     * Handle incoming HR-Skills Pay Webhooks.
     * Endpoint: POST /api/webhooks/hrpay
     */
    public function handle(Request $request): JsonResponse
    {
        $signature = $request->header('X-Hub-Signature');
        $rawPayload = $request->getContent();

        Log::info('[HrPayWebhook] Webhook reçu', [
            'has_signature' => !empty($signature),
            'ip' => $request->ip(),
        ]);

        // Verify cryptographic signature if secret is set
        if (config('hrpay.webhook_secret')) {
            if (!$this->hrPayService->verifyWebhookSignature($rawPayload, $signature)) {
                Log::warning('[HrPayWebhook] Signature de webhook invalide', [
                    'received_signature' => $signature,
                ]);
                return response()->json(['error' => 'Invalid signature'], 401);
            }
        }

        $payload = $request->json()->all();
        $event = $payload['event'] ?? $payload['type'] ?? 'unknown';
        $data = $payload['data'] ?? $payload;

        $reference = $data['reference'] ?? null;
        $linkId = $data['payment_link_id'] ?? $data['id'] ?? $data['slug'] ?? null;
        $orderNumber = $data['metadata']['order_number'] ?? null;

        $order = null;
        if ($reference) {
            $order = Order::where('payment_reference', $reference)->first();
        }
        if (!$order && $linkId) {
            $order = Order::where('payment_reference', $linkId)
                ->orWhere('payment_details->payment_link_id', $linkId)
                ->orWhere('payment_details->slug', $linkId)
                ->first();
        }
        if (!$order && $orderNumber) {
            $order = Order::where('order_number', $orderNumber)->first();
        }

        if (!$order) {
            Log::warning('[HrPayWebhook] Aucune commande trouvée pour la référence', [
                'event' => $event,
                'reference' => $reference,
                'order_number' => $orderNumber,
            ]);
            // Return 200 anyway so the provider doesn't endlessly retry unknown orders
            return response()->json(['received' => true, 'order_found' => false]);
        }

        switch ($event) {
            case 'payment.succeeded':
            case 'payment_succeeded':
            case 'SUCCESS':
                $this->hrPayService->handlePaymentSuccess($order, $data);
                break;

            case 'payment.failed':
            case 'payment_failed':
            case 'FAILED':
                $reason = $data['reason'] ?? $payload['message'] ?? 'Échec confirmé par HR-Skills Pay';
                $this->hrPayService->handlePaymentFailure($order, $reason);
                break;

            case 'payment.hold':
                $order->update([
                    'payment_status' => 'hold',
                    'payment_details' => array_merge($order->payment_details ?? [], [
                        'hold_reason' => $data['reason'] ?? 'Bloqué par AML',
                        'held_at' => now()->toIso8601String(),
                    ]),
                ]);
                Log::warning('[HrPayWebhook] Paiement mis en HOLD AML pour la commande ' . $order->order_number);
                break;

            case 'payment.refunded':
                $order->update([
                    'payment_status' => 'refunded',
                    'payment_details' => array_merge($order->payment_details ?? [], [
                        'refunded_at' => now()->toIso8601String(),
                    ]),
                ]);
                Log::info('[HrPayWebhook] Paiement remboursé pour la commande ' . $order->order_number);
                break;

            default:
                Log::info('[HrPayWebhook] Événement non géré: ' . $event);
                break;
        }

        return response()->json(['received' => true, 'status' => 'processed']);
    }
}
