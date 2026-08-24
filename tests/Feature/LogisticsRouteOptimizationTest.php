<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Driver;
use App\Models\Shop;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\Logistics\Routing\Engines\HaversineRoutingEngine;
use App\Services\Logistics\Optimization\VrpOptimizerService;
use App\Services\Logistics\Ai\RouteAiBriefingService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LogisticsRouteOptimizationTest extends TestCase
{
    use RefreshDatabase;

    protected User $driverUser;
    protected Driver $driver;

    protected function setUp(): void
    {
        parent::setUp();

        $this->driverUser = User::factory()->create([
            'first_name' => 'Alain',
            'last_name' => 'Livreur',
            'role' => 'driver',
            'kyc_status' => 'verified',
            'status' => 'active',
        ]);

        $this->driver = Driver::create([
            'user_id' => $this->driverUser->id,
            'vehicle_type' => 'moto',
            'license_number' => 'DL-98218-A',
            'vehicle_plate' => 'LT-492-BX',
            'coverage_zone' => 'Douala',
            'status' => 'approved',
            'is_verified' => true,
            'rating' => 4.90,
            'total_deliveries' => 52,
        ]);
    }

    public function test_haversine_engine_calculates_valid_distances(): void
    {
        $engine = new HaversineRoutingEngine();
        
        // Akwa to Bonapriso (~4 km)
        $result = $engine->calculateDistance(4.0511, 9.7085, 4.0150, 9.7050, 'moto');
        
        $this->assertGreaterThan(3.0, $result['distance_km']);
        $this->assertLessThan(10.0, $result['distance_km']);
        $this->assertGreaterThan(0, $result['duration_min']);
    }

    public function test_vrp_optimizer_respects_pickup_before_dropoff_precedence(): void
    {
        $optimizer = new VrpOptimizerService();

        $driverPos = ['lat' => 4.0511, 'lng' => 9.7085];
        $deliveries = [
            [
                'order_id' => 101,
                'order_number' => '#ORD-101',
                'pickup_lat' => 4.0520,
                'pickup_lng' => 9.7090,
                'delivery_lat' => 4.0150,
                'delivery_lng' => 9.7050,
            ],
            [
                'order_id' => 102,
                'order_number' => '#ORD-102',
                'pickup_lat' => 4.0480,
                'pickup_lng' => 9.6950,
                'delivery_lat' => 4.0420,
                'delivery_lng' => 9.6880,
            ],
        ];

        $tour = $optimizer->optimizeTour($driverPos, $deliveries, 'moto');

        $this->assertCount(4, $tour['stops']);
        $this->assertEquals('Moto Express', $tour['vehicle_profile']);

        // Vérifier que chaque pickup arrive avant son dropoff
        $pickup101Index = null;
        $dropoff101Index = null;
        $pickup102Index = null;
        $dropoff102Index = null;

        foreach ($tour['stops'] as $idx => $stop) {
            if ($stop['order_id'] == 101 && $stop['type'] === 'pickup') $pickup101Index = $idx;
            if ($stop['order_id'] == 101 && $stop['type'] === 'dropoff') $dropoff101Index = $idx;
            if ($stop['order_id'] == 102 && $stop['type'] === 'pickup') $pickup102Index = $idx;
            if ($stop['order_id'] == 102 && $stop['type'] === 'dropoff') $dropoff102Index = $idx;
        }

        $this->assertNotNull($pickup101Index);
        $this->assertNotNull($dropoff101Index);
        $this->assertLessThan($dropoff101Index, $pickup101Index, 'Pickup 101 must occur before Dropoff 101');

        $this->assertNotNull($pickup102Index);
        $this->assertNotNull($dropoff102Index);
        $this->assertLessThan($dropoff102Index, $pickup102Index, 'Pickup 102 must occur before Dropoff 102');
    }

    public function test_driver_can_optimize_tour_via_api_endpoint(): void
    {
        \App\Ai\Agents\SellifyAgent::fake([
            'Voici votre feuille de route optimisée. Respectez le code OTP client pour sécuriser les fonds.'
        ]);

        $response = $this->actingAs($this->driverUser)->postJson(route('driver.routes.optimize'), [
            'driver_lat' => 4.0511,
            'driver_lng' => 9.7085,
            'vehicle_type' => 'moto',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'tour' => [
                'vehicle_profile',
                'stops',
                'route_geometry',
                'metrics' => [
                    'total_distance_km',
                    'total_duration_min',
                    'distance_saved_km',
                    'time_saved_min',
                    'fuel_saved_fcfa',
                ],
            ],
            'ai_briefing',
        ]);

        $this->assertEquals('success', $response->json('status'));
        $this->assertNotEmpty($response->json('tour.stops'));
    }
}
