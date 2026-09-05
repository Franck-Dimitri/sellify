<?php

namespace App\Services\Logistics\Ai;

use App\Models\User;
use App\Ai\Agents\SellifyAgent;
use Illuminate\Support\Facades\Log;

/**
 * Service d'Analyse et de Briefing Tactique par Sellify AI 1.2 Flash.
 * Transforme les métriques mathématiques de tournée en conseils opérationnels personnalisés pour le chauffeur.
 */
class RouteAiBriefingService
{
    /**
     * Génère un briefing IA complet pour la tournée optimisée.
     */
    public function generateTacticalBriefing(User $driverUser, array $tourData): string
    {
        $stops = $tourData['stops'] ?? [];
        $metrics = $tourData['metrics'] ?? [];
        $vehicleType = $tourData['vehicle_type'] ?? 'moto';
        $driverName = trim($driverUser->first_name . ' ' . $driverUser->last_name) ?: 'Chauffeur';

        if (empty($stops)) {
            return "Aucune course active à optimiser pour le moment. Activez votre statut 'En ligne' pour recevoir des propositions de livraison.";
        }

        // Préparation du prompt condensé pour l'IA
        $stopsSummary = [];
        foreach ($stops as $s) {
            $typeLabel = $s['type'] === 'pickup' ? 'Ramassage Colis' : 'Livraison Client';
            $stopsSummary[] = "Arrêt {$s['step_number']} ({$typeLabel}) : {$s['location_name']} à {$s['address']} (Commande {$s['order_number']})";
        }
        $stopsListText = implode("\n", $stopsSummary);

        $prompt = "Voici les détails d'une tournée de livraison optimisée pour {$driverName} ({$vehicleType}) :\n"
            . "- Nombre d'arrêts : " . count($stops) . "\n"
            . "- Distance totale optimisée : {$metrics['total_distance_km']} km (Économie : {$metrics['distance_saved_km']} km)\n"
            . "- Temps estimé : {$metrics['total_duration_min']} min (Gain : {$metrics['time_saved_min']} min)\n"
            . "- Carburant économisé : {$metrics['fuel_saved_fcfa']} FCFA ({$metrics['fuel_saved_liters']} L)\n\n"
            . "Liste ordonnée des étapes :\n{$stopsListText}\n\n"
            . "En tant que Sellify AI 1.2 Flash, rédige un briefing tactique court, percutant et ultra-clair en 3 points :\n"
            . "1. **Plan de route résumé** : explique pourquoi cet ordre est le plus intelligent.\n"
            . "2. **Conseils circulation & terrain** : vigilance aux carrefours clés ou gestion du chargement.\n"
            . "3. **Validation OTP & Sécurité** : rappel rapide pour sécuriser le déblocage des fonds Escrow.";

        // 1. Tenter la génération via Sellify AI (Laravel AI SDK)
        try {
            $agent = new SellifyAgent($driverUser);
            $response = $agent->forUser($driverUser)->prompt($prompt, model: 'gemini-3.1-flash-lite');
            $aiText = (string) $response;
            if (!empty(trim($aiText))) {
                return trim($aiText);
            }
        } catch (\Throwable $e) {
            Log::info("RouteAiBriefingService fallback: " . $e->getMessage());
        }

        // 2. Fallback dynamique haute qualité si le réseau externe est indisponible
        return $this->generateLocalFallbackBriefing($driverName, $tourData);
    }

    /**
     * Briefing de secours local en cas de déconnexion.
     */
    protected function generateLocalFallbackBriefing(string $driverName, array $tourData): string
    {
        $stops = $tourData['stops'] ?? [];
        $metrics = $tourData['metrics'] ?? [];
        $stopsCount = count($stops);
        $firstStop = $stops[0] ?? null;

        $firstStopText = $firstStop 
            ? "Démarrez par l'arrêt 1 chez **{$firstStop['location_name']}** ({$firstStop['address']})."
            : "Suivez l'ordre numéroté des arrêts sur votre carte.";

        return "Bonjour {$driverName} ! Voici votre feuille de route optimisée par **Sellify AI 1.2 Flash** :\n\n"
            . "1. **Stratégie d'itinéraire** : L'algorithme a ordonné vos **{$stopsCount} arrêts** pour regrouper les ramassages proches avant livraison. Vous économisez **{$metrics['distance_saved_km']} km** et gagnez **{$metrics['time_saved_min']} minutes**.\n"
            . "2. **Économie financière** : Cette tournée vous fait économiser environ **{$metrics['fuel_saved_fcfa']} FCFA** d'essence ({$metrics['fuel_saved_liters']} L).\n"
            . "3. **Prochaine action** : {$firstStopText} N'oubliez pas de demander le code OTP au client pour libérer instantanément vos fonds.";
    }
}
