<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected ?string $apiKey;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');
        $this->model = config('services.gemini.model', 'gemini-3.5-flash');
    }

    /**
     * Generate response from Google Gemini API with dynamic user and business context.
     */
    public function generateResponse(User $user, string $userMessage, array $conversationHistory = []): string
    {
        if (empty($this->apiKey)) {
            return $this->getFallbackResponse($user, $userMessage);
        }

        try {
            $systemInstruction = $this->buildSystemPrompt($user);

            // Construct contents with system instruction and history
            $contents = [];

            // Add system prompt context as first user turn or system instruction
            $fullPrompt = "### INSTRUCTIONS SYSTÈME :\n" . $systemInstruction . "\n\n### MESSAGE DE L'UTILISATEUR :\n" . $userMessage;

            $contents[] = [
                'role' => 'user',
                'parts' => [
                    ['text' => $fullPrompt]
                ]
            ];

            $response = Http::timeout(25)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post("https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}", [
                    'contents' => $contents,
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'maxOutputTokens' => 800,
                    ]
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
                if (!empty($reply)) {
                    return trim($reply);
                }
            } else {
                Log::warning('Gemini API Error: ' . $response->status() . ' - ' . $response->body());
            }
        } catch (\Throwable $e) {
            Log::error('Gemini Service Exception: ' . $e->getMessage());
        }

        return $this->getFallbackResponse($user, $userMessage);
    }

    /**
     * Build rich system prompt with real platform and user business context.
     */
    protected function buildSystemPrompt(User $user): string
    {
        $role = $user->role;
        $name = trim($user->first_name . ' ' . $user->last_name) ?: 'Utilisateur Sellify';
        
        $base = "Tu es Sellify AI, l'assistant d'intelligence artificielle officiel de la plateforme e-commerce et logistique Sellify (Sellify.me / Sellify Express).\n";
        $base .= "Règles strictes :\n";
        $base .= "- Ton nom est UNIQUEMENT 'Sellify AI'.\n";
        $base .= "- Réponds de manière claire, professionnelle, bienveillante et concise en français.\n";
        $base .= "- Utilise une mise en page markdown propre (gras, listes à puces) mais N'UTILISE PAS d'émojis superflus ou en désordre.\n";
        $base .= "- Contexte local : Cameroun (Douala, Yaoundé, Bafoussam, Kribi...), devises en FCFA (XAF), paiements Mobile Money (MTN MoMo, Orange Money, Carte bancaire) et protection Escrow.\n";

        if ($role === 'driver') {
            $driver = $user->driver;
            $deliveries = $driver ? $driver->total_deliveries : 0;
            $rating = $driver ? ($driver->rating ?: 4.90) : 4.90;
            $plate = $driver ? ($driver->vehicle_plate ?: 'LT-492-BX') : 'LT-492-BX';
            $vehicle = $driver ? ($driver->vehicle_type ?: 'moto') : 'moto';
            $points = $deliveries * 100;
            $tier = $deliveries >= 500 ? 'Expert' : ($deliveries >= 200 ? 'Pro' : ($deliveries >= 50 ? 'Fiable' : 'Nouveau'));

            $base .= "\nContexte du chauffeur connecté :\n";
            $base .= "- Nom : {$name}\n";
            $base .= "- Véhicule : {$vehicle} (Plaque : {$plate})\n";
            $base .= "- Livraisons complétées : {$deliveries}\n";
            $base .= "- Note certifiée : {$rating} / 5\n";
            $base .= "- Échelon actuel : Chauffeur {$tier}\n";
            $base .= "- Points fidélité : {$points} points (100 pts par course, convertible en cash à 1 pt = 1 FCFA ou boost visibilité IA)\n";
            $base .= "- Rôle de Sellify AI : Conseiller le livreur pour maximiser ses gains, optimiser ses itinéraires, l'orienter vers les zones à forte demande (Surge pricing Bastos/Akwa), l'aider à atteindre le rang Expert et répondre à toutes ses questions terrain ou administratives.";
        } elseif ($role === 'seller') {
            $seller = $user->seller;
            $shopName = $seller && $seller->shop ? $seller->shop->name : 'Boutique Sellify';
            $base .= "\nContexte du commerçant connecté :\n";
            $base .= "- Nom : {$name}\n";
            $base .= "- Boutique : {$shopName}\n";
            $base .= "- Rôle : Aider le vendeur à gérer son catalogue, ses Smart-Links, ses promotions, ses stocks et ses paiements Escrow.";
        }

        return $base;
    }

    /**
     * Fallback contextual response when offline or API key is absent.
     */
    protected function getFallbackResponse(User $user, string $userMessage): string
    {
        $role = $user->role;
        $lower = mb_strtolower($userMessage);

        if ($role === 'driver') {
            $driver = $user->driver;
            $deliveries = $driver ? $driver->total_deliveries : 215;
            $rating = $driver ? ($driver->rating ?: 4.90) : 4.90;
            $points = $deliveries * 100;

            if (str_contains($lower, 'retrait') || str_contains($lower, 'retirer') || str_contains($lower, 'argent')) {
                return "Pour effectuer un retrait de vos gains de livraison :\n\n- Rendez-vous sur votre Portefeuille.\n- Choisissez votre mode de transfert (MTN Mobile Money, Orange Money ou Carte Bancaire).\n- Le transfert s'effectue sans frais sous 15 minutes.";
            }

            if (str_contains($lower, 'zone') || str_contains($lower, 'demande') || str_contains($lower, 'chaude')) {
                return "Analyse des zones de forte affluence en temps réel :\n\n- Bastos & Quartier des Ambassades (Yaoundé) : Bonus de +30% sur les courses.\n- Akwa & Boulevard de la Liberté (Douala) : Bonus de +25%.\n- Marché Central : Forte demande continue.\n\nPositionnez-vous dans ces secteurs pour recevoir les missions en priorité.";
            }

            if (str_contains($lower, 'expert') || str_contains($lower, 'badge') || str_contains($lower, 'rang')) {
                $left = max(0, 500 - $deliveries);
                return "Progression vers l'échelon Chauffeur Expert :\n\n- Vous avez actuellement complété {$deliveries} livraisons avec une note de {$rating}/5.\n- Il vous reste {$left} courses pour débloquer le rang Expert et accéder aux commandes B2B haute valeur ainsi qu'aux micro-prêts SellifyPay.";
            }

            return "Bonjour ! Je suis Sellify AI, votre assistant intelligent. Je peux vous guider pour optimiser vos tournées de livraison, vous renseigner sur les zones à forte demande, vos points de fidélité ({$points} points) ou vos demandes de retrait. Que souhaitez-vous savoir ?";
        }

        return "Bonjour ! Je suis Sellify AI, l'assistant officiel de la plateforme Sellify. Comment puis-je vous accompagner aujourd'hui ?";
    }
}
