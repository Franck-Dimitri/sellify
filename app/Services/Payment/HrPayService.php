<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Models\OrderItem;
use App\Services\EscrowService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class HrPayService
{
    protected string $mode;
    protected string $baseUrl;
    protected EscrowService $escrowService;

    public function __construct(EscrowService $escrowService)
    {
        $this->mode = config('hrpay.mode', 'live');
        $this->baseUrl = rtrim(config('hrpay.base_url', 'https://api.hrskills-pay.com'), '/');
        $this->escrowService = $escrowService;
    }

    /**
     * Get the active Public Key (Clé A).
     */
    public function getPublicKey(): string
    {
        return config("hrpay.{$this->mode}.public_key") 
            ?: config("hrpay.live.public_key") 
            ?: '';
    }

    /**
     * Get the active Secret Key (Clé B).
     */
    public function getSecretKey(): string
    {
        return config("hrpay.{$this->mode}.secret_key") 
            ?: config("hrpay.live.secret_key") 
            ?: '';
    }

    /**
     * Get the active mode ('live' or 'sandbox').
     */
    public function getMode(): string
    {
        return $this->mode;
    }

    /**
     * Set mode on the fly (useful for switching or testing).
     */
    public function setMode(string $mode): self
    {
        $this->mode = $mode;
        return $this;
    }

    /**
     * Step 1 — Exchange Clé A and Clé B to get or retrieve cached JWT Transaction Token.
     * Token is valid for 45 minutes (2700s). Cached for 40 minutes (2400s).
     */
    public function getTransactionToken(): string
    {
        $cacheKey = "hrpay_transaction_token_{$this->mode}";

        return Cache::remember($cacheKey, config('hrpay.token_ttl', 2400), function () {
            $publicKey = $this->getPublicKey();
            $secretKey = $this->getSecretKey();

            if (empty($publicKey) || empty($secretKey)) {
                Log::warning('[HrPayService] Clés API HR-Skills Pay manquantes dans la configuration.');
                throw new \Exception("Les clés API HR-Skills Pay (Clé A / Clé B) ne sont pas configurées.");
            }

            $response = Http::timeout(config('hrpay.timeout', 30))
                ->withHeaders([
                    'Authorization' => "Bearer {$publicKey}",
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])
                ->post("{$this->baseUrl}/v1/auth/transaction-token", [
                    'api_secret' => $secretKey,
                ]);

            if ($response->failed()) {
                Log::error('[HrPayService] Échec lors de la récupération du Transaction Token', [
                    'status' => $response->status(),
                    'body' => $response->json() ?? $response->body(),
                ]);

                $errorMessage = $response->json('message') 
                    ?? $response->json('error') 
                    ?? "Impossible d'obtenir un Transaction Token HR-Skills Pay ({$response->status()}).";
                throw new \Exception($errorMessage);
            }

            $data = $response->json();
            $token = $data['transaction_token'] ?? null;

            if (empty($token)) {
                throw new \Exception("Réponse invalide de HR-Skills Pay: transaction_token manquant.");
            }

            Log::info('[HrPayService] Transaction Token généré avec succès', [
                'environment' => $data['environment'] ?? $this->mode,
                'merchant_id' => $data['merchant_id'] ?? null,
            ]);

            return $token;
        });
    }

    /**
     * Clear cached transaction token.
     */
    public function clearTokenCache(): void
    {
        Cache::forget("hrpay_transaction_token_{$this->mode}");
    }

    /**
     * Build standard headers for API calls.
     */
    protected function buildHeaders(bool $isPost = true): array
    {
        $headers = [
            'Authorization' => "Bearer {$this->getPublicKey()}",
            'X-Transaction-Token' => $this->getTransactionToken(),
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ];

        if ($isPost) {
            $headers['Idempotency-Key'] = (string) Str::uuid();
        }

        return $headers;
    }

    /**
     * Step 2 — Initiate Mobile Money Collection (Cash-In)
     * Endpoint: POST /api/v1/payin/mobile-money
     */
    public function initiateMobileMoney(Order $order, string $operator, string $phoneNumber, ?string $country = null): array
    {
        $cleanPhone = $this->formatPhoneNumber($phoneNumber, $country ?? config('hrpay.default_country', 'CM'));
        $operatorCode = $this->normalizeOperator($operator);
        $amount = (int) round((float) $order->total_amount);
        $currency = config('hrpay.default_currency', 'XAF');
        $countryCode = strtoupper($country ?? config('hrpay.default_country', 'CM'));

        $payload = [
            'operator' => $operatorCode,
            'country' => $countryCode,
            'phone_number' => $cleanPhone,
            'amount' => $amount,
            'currency' => $currency,
            'description' => "Paiement Commande #{$order->order_number} - Sellify",
            'metadata' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'shop_id' => $order->shop_id,
                'customer_name' => $order->customer_name,
                'platform' => 'Sellify',
            ],
        ];

        Log::info('[HrPayService] Initiation Cash-In Mobile Money', [
            'order_number' => $order->order_number,
            'operator' => $operatorCode,
            'phone' => $cleanPhone,
            'amount' => $amount,
        ]);

        $response = Http::timeout(config('hrpay.timeout', 30))
            ->withHeaders($this->buildHeaders(true))
            ->post("{$this->baseUrl}/api/v1/payin/mobile-money", $payload);

        // Handle expired token retry once
        if ($response->status() === 401 && Str::contains($response->body(), ['INVALID_TRANSACTION_TOKEN', 'MISSING_TRANSACTION_TOKEN'])) {
            Log::warning('[HrPayService] Token expiré ou invalide, renouvellement automatique et nouvel essai...');
            $this->clearTokenCache();
            $response = Http::timeout(config('hrpay.timeout', 30))
                ->withHeaders($this->buildHeaders(true))
                ->post("{$this->baseUrl}/api/v1/payin/mobile-money", $payload);
        }

        $responseData = $response->json();

        if ($response->failed() || !($responseData['success'] ?? false)) {
            Log::error('[HrPayService] Erreur Cash-In Mobile Money', [
                'order_id' => $order->id,
                'status' => $response->status(),
                'response' => $responseData ?? $response->body(),
            ]);

            $errorMsg = $responseData['message'] ?? $responseData['error'] ?? "Erreur lors de l'initiation du paiement Mobile Money ({$response->status()}).";
            
            $order->update([
                'payment_status' => 'failed',
                'payment_details' => array_merge($order->payment_details ?? [], [
                    'last_error' => $errorMsg,
                    'failed_at' => now()->toIso8601String(),
                ]),
            ]);

            throw new \Exception($errorMsg);
        }

        $paymentData = $responseData['data'] ?? [];
        $reference = $paymentData['reference'] ?? null;
        $transactionId = $paymentData['transaction_id'] ?? null;
        $status = $paymentData['status'] ?? 'PENDING';

        // Update order with reference and details
        $order->update([
            'payment_reference' => $reference,
            'payment_transaction_id' => $transactionId,
            'payment_gateway' => 'hrpay',
            'payment_status' => 'pending',
            'payment_details' => array_merge($order->payment_details ?? [], [
                'operator' => $operatorCode,
                'phone_number' => $cleanPhone,
                'fee' => $paymentData['fee'] ?? null,
                'net_amount' => $paymentData['net_amount'] ?? null,
                'initiated_at' => $paymentData['initiated_at'] ?? now()->toIso8601String(),
                'raw_initiation' => $paymentData,
            ]),
        ]);

        return [
            'success' => true,
            'reference' => $reference,
            'transaction_id' => $transactionId,
            'status' => $status,
            'amount' => $amount,
            'currency' => $currency,
            'pending_action' => $paymentData['pending_action'] ?? "GET /v1/payments/{$reference}",
            'message' => 'Une notification de débit a été envoyée sur votre téléphone. Veuillez valider la transaction.',
        ];
    }

    /**
     * Step 2 (Alternative) — Create Payment Link for Card (Visa / Mastercard) payments
     * Endpoint: POST /api/v1/payment-links
     */
    public function createCardPaymentLink(Order $order, ?string $returnUrl = null): array
    {
        $amount = (int) round((float) $order->total_amount);
        $currency = config('hrpay.default_currency', 'XAF');

        $payload = [
            'amount' => $amount,
            'currency' => $currency,
            'description' => "Paiement sécurisé par carte - Commande #{$order->order_number}",
            'allowed_methods' => ['CARD'],
            'expires_at' => now()->addMinutes(60)->toIso8601String(),
            'metadata' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'payment_type' => 'card',
                'return_url' => $returnUrl,
            ],
        ];

        Log::info('[HrPayService] Création Lien de Paiement par Carte', [
            'order_number' => $order->order_number,
            'amount' => $amount,
        ]);

        $response = Http::timeout(config('hrpay.timeout', 30))
            ->withHeaders($this->buildHeaders(true))
            ->post("{$this->baseUrl}/api/v1/payment-links", $payload);

        if ($response->status() === 401 && Str::contains($response->body(), ['INVALID_TRANSACTION_TOKEN', 'MISSING_TRANSACTION_TOKEN'])) {
            $this->clearTokenCache();
            $response = Http::timeout(config('hrpay.timeout', 30))
                ->withHeaders($this->buildHeaders(true))
                ->post("{$this->baseUrl}/api/v1/payment-links", $payload);
        }

        $responseData = $response->json();

        if ($response->failed() || !($responseData['success'] ?? false)) {
            Log::error('[HrPayService] Erreur création lien de paiement carte', [
                'status' => $response->status(),
                'response' => $responseData ?? $response->body(),
            ]);

            $errorMsg = $responseData['message'] ?? $responseData['error'] ?? "Impossible de générer le lien de paiement carte.";
            throw new \Exception($errorMsg);
        }

        // Support both wrapped {data: {...}} and root level object responses
        $data = isset($responseData['data']) && is_array($responseData['data']) 
            ? $responseData['data'] 
            : $responseData;

        $linkId = $data['id'] ?? $data['slug'] ?? $data['reference'] ?? Str::random(16);
        $slug = $data['slug'] ?? $linkId;
        $paymentUrl = $data['url'] 
            ?? $data['payment_url'] 
            ?? ($slug ? "https://hrskills-pay.com/pay/{$slug}" : "https://hrskills-pay.com/pay/{$linkId}");

        $order->update([
            'payment_reference' => $linkId,
            'payment_gateway' => 'hrpay',
            'payment_status' => 'pending',
            'payment_details' => array_merge($order->payment_details ?? [], [
                'payment_link_id' => $linkId,
                'slug' => $slug,
                'payment_url' => $paymentUrl,
                'created_at' => now()->toIso8601String(),
                'raw_payment_link' => $data,
            ]),
        ]);

        return [
            'success' => true,
            'reference' => $linkId,
            'slug' => $slug,
            'payment_url' => $paymentUrl,
            'status' => 'PENDING',
        ];
    }

    /**
     * Check payment status by reference.
     * Endpoint: GET /v1/payments/:reference, with fallback to GET /api/v1/payment-links/:reference
     */
    public function checkPaymentStatus(string $reference): array
    {
        $response = Http::timeout(config('hrpay.timeout', 20))
            ->withHeaders($this->buildHeaders(false))
            ->get("{$this->baseUrl}/v1/payments/{$reference}");

        if ($response->status() === 401 && Str::contains($response->body(), ['INVALID_TRANSACTION_TOKEN', 'MISSING_TRANSACTION_TOKEN'])) {
            $this->clearTokenCache();
            $response = Http::timeout(config('hrpay.timeout', 20))
                ->withHeaders($this->buildHeaders(false))
                ->get("{$this->baseUrl}/v1/payments/{$reference}");
        }

        // Fallback for payment links if not found in transaction payments
        if ($response->status() === 404) {
            $linkResponse = Http::timeout(config('hrpay.timeout', 20))
                ->withHeaders($this->buildHeaders(false))
                ->get("{$this->baseUrl}/api/v1/payment-links/{$reference}");

            if ($linkResponse->successful()) {
                $linkData = $linkResponse->json('data') ?? $linkResponse->json() ?? [];
                $totalReceived = (float)($linkData['total_received'] ?? 0);
                $amountRequired = (float)($linkData['amount'] ?? 0);
                $payments = $linkData['payments'] ?? [];

                $hasSuccessfulPayment = false;
                $hasFailedPayment = false;
                foreach ($payments as $p) {
                    $pStatus = strtoupper((string)($p['Status'] ?? $p['status'] ?? ''));
                    if (in_array($pStatus, ['SUCCESS', 'SUCCEEDED', 'PAID', 'COMPLETED'])) {
                        $hasSuccessfulPayment = true;
                        break;
                    }
                    if (in_array($pStatus, ['FAILED', 'CANCELLED', 'EXPIRED', 'REJECTED'])) {
                        $hasFailedPayment = true;
                    }
                }

                $status = 'PENDING';
                // Strictly require real payment confirmation (total_received or SUCCESS status in payment list)
                if (($totalReceived > 0 && $totalReceived >= $amountRequired) || $hasSuccessfulPayment) {
                    $status = 'SUCCESS';
                } elseif (isset($linkData['is_active']) && $linkData['is_active'] === false && $hasFailedPayment) {
                    $status = 'FAILED';
                }

                return [
                    'success' => true,
                    'reference' => $reference,
                    'status' => $status,
                    'data' => $linkData,
                ];
            }
        }

        if ($response->failed()) {
            Log::error('[HrPayService] Échec polling statut paiement', [
                'reference' => $reference,
                'status' => $response->status(),
                'response' => $response->json() ?? $response->body(),
            ]);

            return [
                'success' => false,
                'status' => 'UNKNOWN',
                'message' => 'Impossible de joindre le service de paiement.',
            ];
        }

        $data = $response->json('data') ?? $response->json() ?? [];
        $status = strtoupper($data['status'] ?? 'PENDING');

        return [
            'success' => true,
            'reference' => $reference,
            'status' => $status,
            'data' => $data,
        ];
    }

    /**
     * Finalize Order upon payment SUCCESS (triggers Escrow hold).
     */
    public function handlePaymentSuccess(Order $order, array $data = []): bool
    {
        if ($order->payment_status === 'escrow_held' || $order->payment_status === 'released') {
            return true;
        }

        $order->update([
            'payment_status' => 'escrow_held',
            'payment_details' => array_merge($order->payment_details ?? [], [
                'confirmed_at' => now()->toIso8601String(),
                'confirmation_data' => $data,
            ]),
        ]);

        // Place seller funds under Escrow hold
        $this->escrowService->holdEscrow($order);

        Log::info('[HrPayService] Paiement confirmé et fonds consignés sous séquestre Escrow', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'amount' => $order->total_amount,
        ]);

        return true;
    }

    /**
     * Finalize Order upon payment FAILURE (restores stock).
     */
    public function handlePaymentFailure(Order $order, string $reason = 'Échec ou délai expiré'): bool
    {
        if ($order->payment_status === 'failed') {
            return true;
        }

        // Restore reserved inventory stock
        foreach ($order->items as $item) {
            if ($item->product) {
                $item->product->increment('stock', $item->quantity);
            }
        }

        $order->update([
            'payment_status' => 'failed',
            'delivery_status' => 'cancelled',
            'payment_details' => array_merge($order->payment_details ?? [], [
                'failure_reason' => $reason,
                'failed_at' => now()->toIso8601String(),
            ]),
        ]);

        Log::warning('[HrPayService] Paiement échoué, commande annulée et stocks restaurés', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'reason' => $reason,
        ]);

        return true;
    }

    /**
     * Verify incoming Webhook HMAC-SHA256 signature.
     * Header: X-Hub-Signature: sha256=<hmac>
     */
    public function verifyWebhookSignature(string $rawPayload, ?string $signature): bool
    {
        $secret = config('hrpay.webhook_secret');
        if (empty($secret) || empty($signature)) {
            Log::warning('[HrPayService] Webhook secret ou signature absente');
            return false;
        }

        $expected = hash_hmac('sha256', $rawPayload, $secret);

        return hash_equals("sha256={$expected}", $signature) || hash_equals($expected, $signature);
    }

    /**
     * Format phone numbers to country code without '+'
     * (e.g. '237655500393')
     */
    public function formatPhoneNumber(string $phone, string $country = 'CM'): string
    {
        // Strip non-digits
        $digits = preg_replace('/\D/', '', $phone);

        if (empty($digits)) {
            return $phone;
        }

        if (strtoupper($country) === 'CM') {
            // Cameroon numbers typically 9 digits starting with 6 (or 2)
            if (strlen($digits) === 9 && in_array($digits[0], ['6', '2'])) {
                return '237' . $digits;
            }
            if (str_starts_with($digits, '237') && strlen($digits) === 12) {
                return $digits;
            }
        }

        return $digits;
    }

    /**
     * Normalize operator to recognized codes:
     * 'mtn', 'orange', 'moov', 'airtel', 'mpesa', 'wave', 'free', 'tmoney', 'afrimoney'
     */
    public function normalizeOperator(string $operator): string
    {
        $clean = strtolower(trim($operator));

        if (Str::contains($clean, ['orange', 'om'])) {
            return 'orange';
        }
        if (Str::contains($clean, ['mtn', 'momo'])) {
            return 'mtn';
        }
        if (Str::contains($clean, 'moov')) {
            return 'moov';
        }
        if (Str::contains($clean, 'airtel')) {
            return 'airtel';
        }
        if (Str::contains($clean, 'wave')) {
            return 'wave';
        }
        if (Str::contains($clean, 'mpesa')) {
            return 'mpesa';
        }

        return $clean;
    }
}
