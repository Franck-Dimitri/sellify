<?php

namespace App\Services\Logistics\Optimization;

use App\Services\Logistics\Routing\Contracts\RoutingEngineInterface;
use App\Services\Logistics\Routing\Engines\OsrmRoutingEngine;

/**
 * Service d'Optimisation des Tournées Multi-Arrêts (Vehicle Routing Problem - VRP).
 * Résout l'ordonnancement optimal avec contraintes de précédence (Pickup -> Dropoff)
 * et calcule les économies de carburant et de temps selon le type de véhicule.
 */
class VrpOptimizerService
{
    protected RoutingEngineInterface $routingEngine;

    /**
     * Paramètres énergétiques et de consommation par type de véhicule au Cameroun (FCFA / Litre).
     */
    protected array $vehicleProfiles = [
        'moto' => [
            'label' => 'Moto Express',
            'liters_per_100km' => 3.2,
            'fuel_price_fcfa' => 750, // Super / Essence
            'avg_speed_kmh' => 25.0,
            'traffic_factor' => 1.15,
        ],
        'voiture' => [
            'label' => 'Voiture Berline',
            'liters_per_100km' => 8.5,
            'fuel_price_fcfa' => 850,
            'avg_speed_kmh' => 18.0,
            'traffic_factor' => 1.50,
        ],
        'van' => [
            'label' => 'Camionnette / Van B2B',
            'liters_per_100km' => 12.0,
            'fuel_price_fcfa' => 850,
            'avg_speed_kmh' => 15.0,
            'traffic_factor' => 1.70,
        ],
    ];

    public function __construct(?RoutingEngineInterface $routingEngine = null)
    {
        $this->routingEngine = $routingEngine ?: new OsrmRoutingEngine();
    }

    /**
     * Optimise une liste de livraisons pour un chauffeur à partir de sa position GPS actuelle.
     *
     * @param array $driverPosition ['lat' => float, 'lng' => float]
     * @param array $deliveriesData Liste de commandes à ramasser et livrer
     * @param string $vehicleType Type de véhicule ('moto', 'voiture', 'van')
     * @return array Tournée optimisée avec géométrie de tracé et métriques financières
     */
    public function optimizeTour(array $driverPosition, array $deliveriesData, string $vehicleType = 'moto'): array
    {
        if (empty($deliveriesData)) {
            return [
                'stops' => [],
                'route_geometry' => [],
                'metrics' => [
                    'total_distance_km' => 0,
                    'total_duration_min' => 0,
                    'distance_saved_km' => 0,
                    'time_saved_min' => 0,
                    'fuel_saved_fcfa' => 0,
                ],
            ];
        }

        $vehicle = $this->vehicleProfiles[$vehicleType] ?? $this->vehicleProfiles['moto'];

        // 1. Préparation des tâches (Pickups & Dropoffs)
        $tasks = [];
        $unvisitedPickups = [];
        $unlockedDropoffs = [];
        $pendingDropoffsByOrder = [];

        foreach ($deliveriesData as $item) {
            $orderId = $item['order_id'] ?? $item['id'] ?? uniqid('ord_');
            $orderNumber = $item['order_number'] ?? "#ORD-{$orderId}";

            $pickupTask = [
                'task_id' => "pick_{$orderId}",
                'order_id' => $orderId,
                'order_number' => $orderNumber,
                'type' => 'pickup',
                'location_name' => $item['seller_shop_name'] ?? $item['pickup_name'] ?? 'Boutique Vendeur',
                'address' => $item['pickup_address'] ?? 'Adresse Boutique',
                'lat' => (float)($item['pickup_lat'] ?? $item['pickup']['lat'] ?? 4.0511),
                'lng' => (float)($item['pickup_lng'] ?? $item['pickup']['lng'] ?? 9.7085),
                'contact_name' => $item['seller_name'] ?? 'Commerçant',
                'contact_phone' => $item['seller_phone'] ?? $item['pickup_phone'] ?? '+237600000000',
                'landmark' => $item['pickup_landmark'] ?? '',
                'package_details' => $item['items_summary'] ?? '1 Colis',
            ];

            $dropoffTask = [
                'task_id' => "drop_{$orderId}",
                'order_id' => $orderId,
                'order_number' => $orderNumber,
                'type' => 'dropoff',
                'location_name' => $item['customer_name'] ?? $item['dropoff_name'] ?? 'Client Destinataire',
                'address' => $item['delivery_address'] ?? 'Adresse Client',
                'lat' => (float)($item['delivery_lat'] ?? $item['dropoff']['lat'] ?? 4.0482),
                'lng' => (float)($item['delivery_lng'] ?? $item['dropoff']['lng'] ?? 9.7042),
                'contact_name' => $item['customer_name'] ?? 'Client',
                'contact_phone' => $item['customer_phone'] ?? $item['delivery_phone'] ?? '+237600000000',
                'landmark' => $item['delivery_landmark'] ?? '',
                'package_details' => $item['items_summary'] ?? '1 Colis',
            ];

            $unvisitedPickups[$pickupTask['task_id']] = $pickupTask;
            $pendingDropoffsByOrder[$orderId] = $dropoffTask;
        }

        // 2. Ordonnancement heuristique du plus proche voisin avec respect strict de précédence
        $currentLat = (float)$driverPosition['lat'];
        $currentLng = (float)$driverPosition['lng'];
        $orderedStops = [];
        $stepCounter = 1;

        while (!empty($unvisitedPickups) || !empty($unlockedDropoffs)) {
            // Pool des cibles accessibles immédiatement
            $accessibleTargets = array_merge(array_values($unvisitedPickups), array_values($unlockedDropoffs));

            // Trouver la cible la plus proche de la position courante
            $bestTarget = null;
            $shortestDist = PHP_FLOAT_MAX;

            foreach ($accessibleTargets as $target) {
                $distInfo = $this->routingEngine->calculateDistance($currentLat, $currentLng, $target['lat'], $target['lng'], $vehicleType);
                $dist = $distInfo['distance_km'];

                if ($dist < $shortestDist) {
                    $shortestDist = $dist;
                    $bestTarget = $target;
                }
            }

            if (!$bestTarget) {
                break;
            }

            // Ajouter à la séquence ordonnée
            $bestTarget['step_number'] = $stepCounter++;
            $bestTarget['estimated_distance_from_prev_km'] = round($shortestDist, 1);
            $orderedStops[] = $bestTarget;

            // Mettre à jour la position courante
            $currentLat = $bestTarget['lat'];
            $currentLng = $bestTarget['lng'];

            // Si c'était un Pickup, on le retire des pickups et on déverrouille son Dropoff
            if ($bestTarget['type'] === 'pickup') {
                unset($unvisitedPickups[$bestTarget['task_id']]);
                $orderId = $bestTarget['order_id'];
                if (isset($pendingDropoffsByOrder[$orderId])) {
                    $unlockedDropoffs[$pendingDropoffsByOrder[$orderId]['task_id']] = $pendingDropoffsByOrder[$orderId];
                    unset($pendingDropoffsByOrder[$orderId]);
                }
            } else {
                // C'était un Dropoff, on le retire des dropoffs déverrouillés
                unset($unlockedDropoffs[$bestTarget['task_id']]);
            }
        }

        // 3. Construction des Waypoints complets (Départ Chauffeur -> Arrêt 1 -> Arrêt 2 -> ...)
        $waypointsForRoute = [
            ['lat' => (float)$driverPosition['lat'], 'lng' => (float)$driverPosition['lng']]
        ];

        foreach ($orderedStops as $stop) {
            $waypointsForRoute[] = [
                'lat' => (float)$stop['lat'],
                'lng' => (float)$stop['lng']
            ];
        }

        // 4. Calcul du tracé réel auprès du moteur de routage (OSRM / OpenStreetMap)
        $routeResult = $this->routingEngine->calculateRoute($waypointsForRoute, $vehicleType);

        $totalDistanceKm = (float)($routeResult['distance_km'] ?? 0);
        $totalDurationMin = (int)($routeResult['duration_min'] ?? 0);

        // 5. Calcul des économies par rapport à des allers-retours désordonnés naïfs (Sans IA)
        // Estimation naïve : chaque commande traitée séparément A->B puis retour
        $naiveDistanceKm = 0;
        foreach ($deliveriesData as $d) {
            $pLat = (float)($d['pickup_lat'] ?? $d['pickup']['lat'] ?? 4.05);
            $pLng = (float)($d['pickup_lng'] ?? $d['pickup']['lng'] ?? 9.70);
            $dLat = (float)($d['delivery_lat'] ?? $d['dropoff']['lat'] ?? 4.04);
            $dLng = (float)($d['delivery_lng'] ?? $d['dropoff']['lng'] ?? 9.70);

            $leg1 = $this->routingEngine->calculateDistance((float)$driverPosition['lat'], (float)$driverPosition['lng'], $pLat, $pLng, $vehicleType);
            $leg2 = $this->routingEngine->calculateDistance($pLat, $pLng, $dLat, $dLng, $vehicleType);
            $naiveDistanceKm += ($leg1['distance_km'] + $leg2['distance_km']);
        }

        $distanceSavedKm = max(0, round($naiveDistanceKm - $totalDistanceKm, 1));
        $timeSavedMin = max(0, (int) round(($distanceSavedKm / $vehicle['avg_speed_kmh']) * 60));
        
        $litersSaved = round(($distanceSavedKm * $vehicle['liters_per_100km']) / 100, 2);
        $fuelSavedFcfa = (int) round($litersSaved * $vehicle['fuel_price_fcfa']);

        return [
            'vehicle_profile' => $vehicle['label'],
            'vehicle_type' => $vehicleType,
            'stops' => $orderedStops,
            'route_geometry' => $routeResult['coordinates'] ?? [],
            'metrics' => [
                'total_distance_km' => $totalDistanceKm,
                'total_duration_min' => $totalDurationMin,
                'distance_saved_km' => $distanceSavedKm,
                'time_saved_min' => $timeSavedMin,
                'fuel_saved_liters' => $litersSaved,
                'fuel_saved_fcfa' => $fuelSavedFcfa,
                'total_stops_count' => count($orderedStops),
            ],
        ];
    }
}
