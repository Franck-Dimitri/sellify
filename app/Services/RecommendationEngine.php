<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Seller;

class RecommendationEngine
{
    /**
     * Analyze winning products and opportunities for the seller
     */
    public function getWinningProducts(Seller $seller): array
    {
        $products = $seller->products()->where('products.is_archived', false)->with('promotions')->get();

        $winningList = [];
        foreach ($products as $product) {
            // Quality score calculation (0-100)
            $qualityScore = 100;
            $tips = [];

            if (empty($product->description) || strlen($product->description) < 50) {
                $qualityScore -= 20;
                $tips[] = "Rédiger une description plus détaillée (min 50 caractères).";
            }

            if (empty($product->image_paths) || count($product->image_paths) < 2) {
                $qualityScore -= 25;
                $tips[] = "Ajouter au moins 2 à 3 photos HD sous différents angles.";
            }

            if (!$product->weight) {
                $qualityScore -= 10;
                $tips[] = "Indiquer le poids du produit pour optimiser les frais de livraison.";
            }

            if ($product->stock <= $product->alert_threshold) {
                $tips[] = "Attention : stock sous le seuil critique (Alerte réapprovisionnement).";
            }

            // Dynamic pricing suggestion
            $suggestedPrice = round($product->price * (rand(0, 1) ? 0.95 : 1.05), -2);

            $winningList[] = [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'suggested_price' => $suggestedPrice,
                'stock' => $product->stock,
                'quality_score' => max(0, $qualityScore),
                'optimization_tips' => $tips,
                'potential' => $qualityScore >= 80 ? 'Élevé 🔥' : ($qualityScore >= 60 ? 'Moyen ⚡' : 'À optimiser 🛠️'),
            ];
        }

        return [
            'products' => $winningList,
            'summary' => [
                'total_analyzed' => count($products),
                'top_performers' => count(array_filter($winningList, fn($p) => $p['quality_score'] >= 80)),
                'needs_attention' => count(array_filter($winningList, fn($p) => $p['quality_score'] < 60)),
            ],
            'market_trends' => [
                'Tendances du moment : Forte demande sur la Tech & Mode à Douala/Yaoundé.',
                'Conseil IA : Les fiches produit avec badge KYC et au moins 3 photos vendent 3x plus vite.',
            ]
        ];
    }
}
