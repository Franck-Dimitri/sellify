<?php

namespace App\Services\Logistics\Routing\Engines;

use App\Services\Logistics\Routing\Contracts\RoutingEngineInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Moteur de routage OpenStreetMap (OSRM - Open Source Routing Machine).
 * Calcule les tracés routiers réels avec coordonnées GeoJSON complètes pour affichage Leaflet.
 */
class OsrmRoutingEngine implements RoutingEngineInterface
{
    protected HaversineRoutingEngine $fallbackEngine;
    protected string $osrmBaseUrl;

    public function __construct(?string $baseUrl = null)
    {
        $this->osrmBaseUrl = $baseUrl ?: config('services.osrm.url', 'https://router.project-osrm.org');
        $this->fallbackEngine = new HaversineRoutingEngine();
    }

    public function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2, string $vehicleProfile = 'moto'): array
    {
        return $this->fallbackEngine->calculateDistance($lat1, $lon1, $lat2, $lon2, $vehicleProfile);
    }

    public function calculateRoute(array $waypoints, string $vehicleProfile = 'moto'): array
    {
        if (count($waypoints) < 2) {
            return $this->fallbackEngine->calculateRoute($waypoints, $vehicleProfile);
        }

        try {
            // OSRM attend les coordonnées sous la forme lng,lat;lng,lat;...
            $coordStrings = array_map(function ($wp) {
                return "{$wp['lng']},{$wp['lat']}";
            }, $waypoints);

            $coordsParam = implode(';', $coordStrings);
            $url = "{$this->osrmBaseUrl}/route/v1/driving/{$coordsParam}?overview=full&geometries=geojson&steps=true";

            $response = Http::timeout(6)->get($url);

            if ($response->successful()) {
                $data = $response->json();

                if (!empty($data['routes'][0])) {
                    $route = $data['routes'][0];

                    // Conversion des coordonnées GeoJSON [lng, lat] vers format Leaflet [lat, lng]
                    $leafletCoords = array_map(function ($coord) {
                        return [(float)$coord[1], (float)$coord[0]];
                    }, $route['geometry']['coordinates'] ?? []);

                    $distanceKm = round(($route['distance'] ?? 0) / 1000, 1);
                    $durationMin = (int) ceil(($route['duration'] ?? 0) / 60);

                    // Ajustement urbain pour les motos (plus agiles) vs voitures
                    if ($vehicleProfile === 'moto') {
                        $durationMin = (int) max(1, round($durationMin * 0.85)); // -15% de temps en moto
                    }

                    return [
                        'success' => true,
                        'engine' => 'osrm_real_roads',
                        'coordinates' => $leafletCoords,
                        'distance_km' => $distanceKm,
                        'duration_min' => $durationMin,
                    ];
                }
            }
        } catch (\Throwable $e) {
            Log::info("OSRM API fallback to Haversine engine: " . $e->getMessage());
        }

        // Si OSRM échoue ou est hors ligne, on bascule de manière transparente sur le moteur mathématique Haversine
        return $this->fallbackEngine->calculateRoute($waypoints, $vehicleProfile);
    }
}
