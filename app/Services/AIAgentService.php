<?php

namespace App\Services;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Support\Str;

class AIAgentService
{
    /**
     * Handle incoming AI chat message for any role (seller, customer, driver, admin)
     */
    public function handleMessage(User $user, string $message): array
    {
        $role = $user->role;
        $lowerMsg = mb_strtolower($message);
        
        $response = "";
        $actionTaken = null;

        if ($role === 'seller') {
            $seller = $user->seller;
            
            if (str_contains($lowerMsg, 'stock') || str_contains($lowerMsg, 'inventaire')) {
                $totalStock = $seller ? $seller->totalStock() : 0;
                $lowStockCount = $seller ? $seller->products()->where('stock', '<=', 5)->count() : 0;
                $response = "Votre boutique compte actuellement un stock total de **{$totalStock} articles**. Vous avez **{$lowStockCount} produit(s)** proches du seuil de rupture.";
                $actionTaken = ['type' => 'info_stock', 'data' => ['total_stock' => $totalStock, 'low_stock' => $lowStockCount]];
            } elseif (str_contains($lowerMsg, 'smart-link') || str_contains($lowerMsg, 'lien')) {
                $firstProduct = $seller ? $seller->products()->first() : null;
                if ($firstProduct) {
                    $smartLinkService = new SmartLinkService();
                    $link = $smartLinkService->generateSmartLink($seller, $firstProduct);
                    $response = "Voici votre Smart-Link généré pour le produit **{$firstProduct->name}** :\n🔗 [https://sellify.me/pay/{$link->token}](http://localhost:8000/pay/{$link->token})";
                    $actionTaken = ['type' => 'generate_smart_link', 'data' => ['url' => "http://localhost:8000/pay/{$link->token}"]];
                } else {
                    $response = "Veuillez d'abord ajouter au moins un produit dans votre boutique pour générer un Smart-Link.";
                }
            } elseif (str_contains($lowerMsg, 'solde') || str_contains($lowerMsg, 'gain') || str_contains($lowerMsg, 'argent')) {
                $wallet = $seller ? $seller->wallet : null;
                $balance = $wallet ? number_format($wallet->balance, 0, ',', ' ') : '0';
                $pending = $wallet ? number_format($wallet->pending_balance, 0, ',', ' ') : '0';
                $response = "Votre solde disponible en portefeuille est de **{$balance} FCFA** (Fonds en attente Escrow : **{$pending} FCFA**).";
                $actionTaken = ['type' => 'wallet_info', 'data' => ['balance' => $balance, 'pending' => $pending]];
            } else {
                $response = "Bonjour ! Je suis votre Copilote IA Sellify. Je peux vous informer sur vos ventes, générer un Smart-Link, vérifier vos stocks ou préparer vos retraits de portefeuille. Que souhaitez-vous effectuer ?";
            }
        } else {
            $response = "Bonjour ! Je suis l'Assistant IA Sellify.me. Comment puis-je vous assister aujourd'hui ?";
        }

        // Log action for compliance & audit trail
        ActivityLog::log($user->id, 'ai_chat_interaction', "IA Assistant: " . Str::limit($message, 50));

        return [
            'reply' => $response,
            'action' => $actionTaken,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
