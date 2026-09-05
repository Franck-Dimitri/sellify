<?php

namespace App\Services\Logistics\Routing\Contracts;

/**
 * Interface contractuelle pour les moteurs de calcul géospatial et de routage.
 * Permet d'interchanger OSRM, GraphHopper, Google Maps ou un moteur local sans impacter le code métier.
 */
interface RoutingEngineInterface
{
    /**
     * Calcule l'itinéraire réel sur route entre plusieurs waypoints ordonnés.
     *
     * @param array $waypoints Liste ordonnée de coordonnées [['lat' => float, 'lng' => float], ...]
     * @param string $vehicleProfile Profil du véhicule ('moto', 'voiture', 'van')
     * @return array Résultat contenant ['success' => bool, 'coordinates' => array, 'distance_km' => float, 'duration_min' => int]
     */
    public function calculateRoute(array $waypoints, string $vehicleProfile = 'moto'): array;

    /**
     * Calcule la distance directe (en km) et la durée estimée entre deux points GPS.
     *
     * @param float $lat1
     * @param float $lon1
     * @param float $lat2
     * @param float $lon2
     * @param string $vehicleProfile
     * @return array ['distance_km' => float, 'duration_min' => int]
     */
    public function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2, string $vehicleProfile = 'moto'): array;
}
