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
        $this->apiKey = config('ai.providers.gemini.key') ?: env('GEMINI_API_KEY');
        $this->model = env('GEMINI_MODEL', 'gemini-3.1-flash-lite');
    }

    /**
     * Generate response from Google Gemini API with dynamic user and business context.
     */
    public function generateResponse(User $user, string $userMessage, array $conversationHistory = []): string
    {
        if (empty($this->apiKey)) {
            return $this->getFallbackResponse($user, $userMessage);
        }

        $models = [$this->model, 'gemini-3.1-flash-lite', 'gemma-4-31b-it', 'gemini-3.5-flash'];
        $uniqueModels = array_unique($models);

        foreach ($uniqueModels as $m) {
            try {
                $systemInstruction = $this->buildSystemPrompt($user);
                
                $contents = [];
                foreach ($conversationHistory as $msg) {
                    $contents[] = [
                        'role' => $msg['sender'] === 'user' ? 'user' : 'model',
                        'parts' => [['text' => $msg['text'] ?? '']]
                    ];
                }
                $contents[] = [
                    'role' => 'user',
                    'parts' => [['text' => $userMessage]]
                ];

                $response = Http::timeout(25)
                    ->withHeaders(['Content-Type' => 'application/json'])
                    ->post("https://generativelanguage.googleapis.com/v1beta/models/{$m}:generateContent?key={$this->apiKey}", [
                        'contents' => $contents,
                        'systemInstruction' => [
                            'parts' => [['text' => $systemInstruction]]
                        ],
                        'generationConfig' => [
                            'temperature' => 0.7,
                            'maxOutputTokens' => 800,
                        ],
                    ]);

                if ($response->successful()) {
                    $data = $response->json();
                    $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
                    if (!empty(trim($reply))) {
                        return trim($reply);
                    }
                } else {
                    Log::warning("Gemini API Error for model [{$m}]: " . $response->status() . " - " . $response->body());
                }
            } catch (\Throwable $e) {
                Log::warning("Gemini API Exception for model [{$m}]: " . $e->getMessage());
            }
        }

        return $this->getFallbackResponse($user, $userMessage);
    }

    /**
     * Build dynamic, localized system prompt for Sellify assistant.
     */
    protected function buildSystemPrompt(User $user): string
    {
        $role = $user->role;
        $name = trim($user->first_name . ' ' . $user->last_name);

        $base = "Tu es Sellify AI 1.2 Flash, l'assistant d'intelligence artificielle officiel de la plateforme logistique et e-commerce Sellify Express (Sellify.me).\n";
        $base .= "Règles strictes :\n";
        $base .= "- Ton nom est 'Sellify AI 1.2 Flash'.\n";
        $base .= "- Tu réponds en français clair, chaleureux, professionnel et structuré en markdown (avec **gras** et puces).\n";
        $base .= "- Contexte : Cameroun (Douala, Yaoundé, Bafoussam...), monnaie locale FCFA (XAF), paiements MTN Mobile Money et Orange Money, séquestre Escrow.\n";

        if ($role === 'driver') {
            $driver = $user->driver;
            $deliveries = $driver ? ($driver->total_deliveries ?: 215) : 215;
            $rating = $driver ? ($driver->rating ?: 4.90) : 4.90;
            $plate = $driver ? ($driver->vehicle_plate ?: 'LT-492-BX') : 'LT-492-BX';
            $vehicle = $driver ? ($driver->vehicle_type ?: 'moto') : 'moto';
            $points = $deliveries * 100;
            $tier = $deliveries >= 500 ? 'Expert' : ($deliveries >= 200 ? 'Pro' : ($deliveries >= 50 ? 'Fiable' : 'Nouveau'));

            $base .= "\nContexte en direct du Chauffeur :\n";
            $base .= "- Identité : {$name}\n";
            $base .= "- Véhicule : {$vehicle} ({$plate})\n";
            $base .= "- Livraisons validées : {$deliveries}\n";
            $base .= "- Note certifiée : {$rating} / 5\n";
            $base .= "- Échelon actuel : Chauffeur {$tier}\n";
            $base .= "- Points fidélité : {$points} points (100 pts par course, convertible en cash à 1 pt = 1 FCFA ou boost visibilité IA)\n";
        } elseif ($role === 'customer') {
            $ordersCount = \App\Models\Order::where('user_id', $user->id)->count();
            $recentOrder = \App\Models\Order::where('user_id', $user->id)->latest()->first();
            $points = $user->loyalty_points ?? 0;
            $tier = $points >= 5000 ? 'Or' : ($points >= 1000 ? 'Argent' : 'Bronze');

            $base .= "\nContexte en direct du Client Acheteur :\n";
            $base .= "- Identité : {$name}\n";
            $base .= "- Points fidélité : {$points} points (Palier {$tier})\n";
            $base .= "- Total commandes passées : {$ordersCount}\n";
            if ($recentOrder) {
                $base .= "- Dernière commande : #{$recentOrder->order_number} (Statut: {$recentOrder->delivery_status}, Montant: {$recentOrder->total_amount} FCFA, OTP: {$recentOrder->delivery_otp})\n";
            }
            $base .= "- Ton rôle pour le client : Trouver les meilleurs produits du catalogue, suivre les commandes, expliquer le séquestre Escrow et l'aider à résoudre les réclamations.\n";
        }

        return $base;
    }

    /**
     * Fallback contextual response when all remote APIs are temporarily unreachable.
     */
    protected function getFallbackResponse(User $user, string $userMessage): string
    {
        $role = $user->role;
        $name = trim($user->first_name . ' ' . $user->last_name) ?: ($role === 'driver' ? 'Chauffeur' : 'Client');
        $lower = mb_strtolower($userMessage);

        if ($role === 'driver') {
            $driver = $user->driver;
            $deliveries = $driver ? ($driver->total_deliveries ?: 215) : 215;
            $rating = $driver ? ($driver->rating ?: 4.90) : 4.90;
            $points = $deliveries * 100;

            // Target Earnings (e.g. 250k, 200k, 300k, 500k)
            if (preg_match('/(\d+)\s*(k|000)/i', $userMessage, $matches)) {
                $rawTarget = intval($matches[1]);
                $targetAmount = $rawTarget < 1000 ? $rawTarget * 1000 : $rawTarget;
                $targetFormatted = number_format($targetAmount, 0, ',', ' ');
                $avgCourse = 2000;
                $neededDeliveries = ceil($targetAmount / $avgCourse);
                $perDay = ceil($neededDeliveries / 25);

                return "Pour atteindre un revenu mensuel de **{$targetFormatted} FCFA** sur Sellify Express, voici le plan d'action prévisionnel :\n\n"
                    . "1. **Nombre de courses requis** : En comptant une moyenne de **{$avgCourse} FCFA nets** par livraison, il vous faut environ **{$neededDeliveries} livraisons par mois** (soit environ **{$perDay} courses par jour** sur 25 jours travaillés).\n"
                    . "2. **Zones à forte valeur ajoutée** : Privilégiez les secteurs à forte demande comme **Bastos (+30% de bonus)** à Yaoundé et **Akwa (+25%)** à Douala.\n"
                    . "3. **Boost de points** : Vos **{$points} points fidélité** peuvent être convertis en priorisation d'attribution pour capter les courses les plus rémunératrices.\n"
                    . "4. **Pourboires clients** : Avec une note soignée, les pourboires moyens ajoutent 25 000 à 40 000 FCFA supplémentaires par mois.";
            }

            // Retraits / Finances
            if (str_contains($lower, 'retrait') || str_contains($lower, 'retirer') || str_contains($lower, 'argent') || str_contains($lower, 'momo') || str_contains($lower, 'orange')) {
                return "Pour effectuer un retrait instantané de vos gains de livraison :\n\n- Rendez-vous dans la section **Portefeuille & Retraits**.\n- Sélectionnez votre compte **MTN Mobile Money**, **Orange Money** ou Carte Bancaire.\n- Les fonds sont débloqués sous 15 minutes sans frais cachés.";
            }

            // Greetings / "eoo" / "bonjour"
            if (in_array(trim($lower), ['eoo', 'eo', 'salut', 'bonjour', 'coucou', 'yo', 'hello', 'hi', 'bonsoir'])) {
                return "Bonjour {$name} ! Je suis **Sellify AI 1.2 Flash**, votre copilote intelligent en direct.\n\nJe suis prêt : souhaitez-vous analyser un itinéraire, simuler vos gains, localiser les zones à forte demande ou convertir vos points de fidélité ?";
            }

            return "Bonjour {$name} ! Je suis **Sellify AI 1.2 Flash**, votre assistant intelligent. Je peux vous guider pour optimiser vos tournées, calculer vos objectifs de gains, localiser les zones à forte demande ou gérer vos retraits. Que souhaitez-vous savoir ?";
        }

        if ($role === 'customer') {
            $points = $user->loyalty_points ?? 0;
            $tier = $points >= 5000 ? 'Or' : ($points >= 1000 ? 'Argent' : 'Bronze');
            $recentOrder = \App\Models\Order::where('user_id', $user->id)->latest()->first();

            // Suivi de commande / Statut
            if (str_contains($lower, 'commande') || str_contains($lower, 'suivi') || str_contains($lower, 'ou est') || str_contains($lower, 'statut') || str_contains($lower, 'colis')) {
                if ($recentOrder) {
                    $statusFr = [
                        'pending' => 'Enregistrée (en attente de préparation)',
                        'preparing' => 'En cours de préparation chez le vendeur',
                        'in_transit' => 'En cours de livraison avec le chauffeur',
                        'delivered' => 'Livrée & validée avec succès',
                        'cancelled' => 'Annulée (fonds restitués)',
                    ][$recentOrder->delivery_status] ?? $recentOrder->delivery_status;

                    return "Voici le point en temps réel sur votre commande la plus récente :\n\n"
                        . "📦 **Commande #{$recentOrder->order_number}**\n"
                        . "- **Statut actuel** : {$statusFr}\n"
                        . "- **Montant consigné en Escrow** : " . number_format($recentOrder->total_amount, 0, ',', ' ') . " FCFA\n"
                        . "- **Code secret OTP** : `{$recentOrder->delivery_otp}` (à présenter au livreur à l'arrivée)\n"
                        . "- **Adresse** : {$recentOrder->delivery_address} ({$recentOrder->city})\n\n"
                        . "👉 [Suivre en direct sur la carte](/customer/orders/{$recentOrder->order_number})";
                }

                return "Vous n'avez pas de commande active pour le moment. Découvrez nos boutiques certifiées sur le [Catalogue Sellify](/store) !";
            }

            // Explication Escrow
            if (str_contains($lower, 'escrow') || str_contains($lower, 'sequestre') || str_contains($lower, 'securite') || str_contains($lower, 'remboursement') || str_contains($lower, 'litige')) {
                return "🔒 **Comment fonctionne la protection Escrow Sellify ?**\n\n"
                    . "1. Lors de votre achat, votre paiement est bloqué sur un compte de séquestre neutre et sécurisé.\n"
                    . "2. Le vendeur prépare et expédie le colis, mais ne touche pas encore l'argent.\n"
                    . "3. Vous recevez et inspectez physiquement le colis.\n"
                    . "4. Vous transmettez votre code OTP au livreur et cliquez sur **« Confirmer la réception »**.\n"
                    . "5. En cas de non-conformité, vous disposez de 24h pour ouvrir un litige et être remboursé immédiatement.";
            }

            // Points de fidélité
            if (str_contains($lower, 'point') || str_contains($lower, 'fidelite') || str_contains($lower, 'palier') || str_contains($lower, 'recompense')) {
                return "⭐ **Votre Statut Fidélité Sellify Rewards** :\n\n"
                    . "- **Solde actuel** : **{$points} points de confiance**\n"
                    . "- **Palier** : **Membre {$tier}**\n"
                    . "- **Règle de cumul** : 1 FCFA dépensé = 1 point gagné.\n\n"
                    . "👉 [Consulter mes avantages et bons de réduction](/customer/loyalty)";
            }

            // Salutations
            if (in_array(trim($lower), ['eoo', 'eo', 'salut', 'bonjour', 'coucou', 'yo', 'hello', 'hi', 'bonsoir'])) {
                return "Bonjour {$name} ! Je suis **Sellify AI 1.2 Flash**, votre assistant d'achat personnel.\n\nJe peux rechercher un produit dans nos boutiques certifiées, vérifier l'avancement de votre commande ou vous expliquer la garantie séquestre Escrow. Que recherchez-vous aujourd'hui ?";
            }

            return "Bonjour {$name} ! Je suis **Sellify AI 1.2 Flash**, votre assistant d'achat intelligent. Je peux vous orienter vers les meilleures offres, suivre vos colis en direct ou répondre à vos questions sur les paiements et livraisons. Comment puis-je vous aider ?";
        }

        return "Bonjour ! Je suis **Sellify AI 1.2 Flash**, l'assistant officiel de la plateforme Sellify. Comment puis-je vous accompagner aujourd'hui ?";
    }
}
