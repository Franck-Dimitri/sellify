<?php

namespace App\Services\Logistics\Routing\Engines;

use App\Services\Logistics\Routing\Contracts\RoutingEngineInterface;

/**
 * Moteur géodésique de secours (Haversine Formula).
 * Calcule instantanément les distances en kilomètres et les temps de trajet sans dépendance externe.
 */
class HaversineRoutingEngine implements RoutingEngineInterface
{
    /**
     * Vitesse moyenne urbaine par défaut en km/h selon le véhicule.
     */
    protected array $averageSpeeds = [
        'moto' => 25.0,    // 25 km/h en ville (peut se faufiler)
        'voiture' => 18.0, // 18 km/h en ville
        'van' => 15.0,     // 15 km/h en ville
    ];

    /**
     * Calcule la distance grand cercle Haversine en km.
     */
    public function haversineGreatCircleDistance(float $latitudeFrom, float $longitudeFrom, float $latitudeTo, float $longitudeTo): float
    {
        $earthRadius = 6371; // Rayon moyen de la Terre en km

        $latFrom = deg2rad($latitudeFrom);
        $lonFrom = deg2rad($longitudeFrom);
        $latTo = deg2rad($latitudeTo);
        $lonTo = deg2rad($longitudeTo);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
            cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));

        return round($angle * $earthRadius, 2);
    }

    public function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2, string $vehicleProfile = 'moto'): array
    {
        $directDistance = $this->haversineGreatCircleDistance($lat1, $lon1, $lat2, $lon2);
        
        // Facteur de détour urbain moyen (les rues ne sont pas en ligne droite, ratio moyen 1.25)
        $roadDistance = round($directDistance * 1.25, 2);
        
        $speed = $this->averageSpeeds[$vehicleProfile] ?? 22.0;
        $durationMin = (int) max(1, ceil(($roadDistance / $speed) * 60));

        return [
            'distance_km' => $roadDistance,
            'duration_min' => $durationMin,
        ];
    }

    public function calculateRoute(array $waypoints, string $vehicleProfile = 'moto'): array
    {
        if (count($waypoints) < 2) {
            return [
                'success' => true,
                'coordinates' => array_map(fn($w) => [$w['lat'], $w['lng']], $waypoints),
                'distance_km' => 0.0,
                'duration_min' => 0,
            ];
        }

        $totalDistance = 0.0;
        $totalDuration = 0;
        $coordinates = [];

        for ($i = 0; $i < count($waypoints) - 1; $i++) {
            $from = $waypoints[$i];
            $to = $waypoints[$i + 1];

            $segment = $this->calculateDistance($from['lat'], $from['lng'], $to['lat'], $to['lng'], $vehicleProfile);
            $totalDistance += $segment['distance_km'];
            $totalDuration += $segment['duration_min'];

            if ($i === 0) {
                $coordinates[] = [(float)$from['lat'], (float)$from['lng']];
            }
            $coordinates[] = [(float)$to['lat'], (float)$to['lng']];
        }

        return [
            'success' => true,
            'engine' => 'haversine_local',
            'coordinates' => $coordinates,
            'distance_km' => round($totalDistance, 1),
            'duration_min' => (int)$totalDuration,
        ];
    }
}
