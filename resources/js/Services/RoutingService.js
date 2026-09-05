/**
 * RoutingService.js
 * Helper for fetching OSRM routes, TSP Multi-Stop Optimization (Voyageur de commerce),
 * calculating Haversine fallback distances, and estimating travel time (ETA).
 */

/**
 * Calculate direct Haversine distance between two coordinates in km.
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
}

/**
 * Fetch OSRM real road route polyline coordinates, distance (km), and ETA (minutes).
 */
export async function fetchOSRMRoute(startLat, startLng, endLat, endLng) {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`OSRM API error: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const coordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            const distanceKm = parseFloat((route.distance / 1000).toFixed(1));
            const durationMin = Math.ceil(route.duration / 60);

            return {
                success: true,
                coordinates,
                distanceKm,
                durationMin,
            };
        }
    } catch (error) {
        console.warn("OSRM Routing API fallback to direct polyline:", error);
    }

    const fallbackDist = calculateHaversineDistance(startLat, startLng, endLat, endLng);
    const fallbackDuration = Math.ceil((fallbackDist / 30) * 60);

    return {
        success: false,
        coordinates: [
            [startLat, startLng],
            [endLat, endLng]
        ],
        distanceKm: fallbackDist,
        durationMin: fallbackDuration
    };
}

/**
 * Solve Traveling Salesman Problem (TSP) for Multi-Stop Batch Deliveries
 * Enforces Pickup 1 ➔ Pickup 2 ➔ Dropoff 1 ➔ Dropoff 2 precedence constraint
 * and returns OSRM multi-waypoint route polyline.
 */
export async function solveMultiStopTSPRoute(driverPos, rawStops = []) {
    if (!rawStops || rawStops.length === 0) {
        return { optimizedStops: [], coordinates: [], distanceKm: 0, durationMin: 0 };
    }

    // Separate pickups and dropoffs
    const pickups = rawStops.filter((s) => s.type === 'pickup');
    const dropoffs = rawStops.filter((s) => s.type === 'dropoff');

    // Simple TSP heuristic: All pickups first sorted by distance from driver, then all dropoffs sorted by distance
    let current = { lat: driverPos.lat, lng: driverPos.lng };
    const unvisitedPickups = [...pickups];
    const optimizedStops = [];

    while (unvisitedPickups.length > 0) {
        unvisitedPickups.sort((a, b) => {
            const dA = calculateHaversineDistance(current.lat, current.lng, a.lat, a.lng);
            const dB = calculateHaversineDistance(current.lat, current.lng, b.lat, b.lng);
            return dA - dB;
        });
        const nextPickup = unvisitedPickups.shift();
        optimizedStops.push(nextPickup);
        current = { lat: nextPickup.lat, lng: nextPickup.lng };
    }

    const unvisitedDropoffs = [...dropoffs];
    while (unvisitedDropoffs.length > 0) {
        unvisitedDropoffs.sort((a, b) => {
            const dA = calculateHaversineDistance(current.lat, current.lng, a.lat, a.lng);
            const dB = calculateHaversineDistance(current.lat, current.lng, b.lat, b.lng);
            return dA - dB;
        });
        const nextDropoff = unvisitedDropoffs.shift();
        optimizedStops.push(nextDropoff);
        current = { lat: nextDropoff.lat, lng: nextDropoff.lng };
    }

    // Build OSRM multi-waypoint string: driverPos ; stop1 ; stop2 ; stop3...
    const waypoints = [
        `${driverPos.lng},${driverPos.lat}`,
        ...optimizedStops.map((s) => `${s.lng},${s.lat}`)
    ].join(';');

    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                const coordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
                return {
                    success: true,
                    optimizedStops,
                    coordinates,
                    distanceKm: parseFloat((route.distance / 1000).toFixed(1)),
                    durationMin: Math.ceil(route.duration / 60)
                };
            }
        }
    } catch (e) {
        console.warn("OSRM Multi-stop TSP fallback:", e);
    }

    // Fallback coordinates
    const fallbackCoords = [
        [driverPos.lat, driverPos.lng],
        ...optimizedStops.map((s) => [s.lat, s.lng])
    ];

    let totalDist = 0;
    let prev = driverPos;
    optimizedStops.forEach((s) => {
        totalDist += calculateHaversineDistance(prev.lat, prev.lng, s.lat, s.lng);
        prev = s;
    });

    return {
        success: false,
        optimizedStops,
        coordinates: fallbackCoords,
        distanceKm: parseFloat(totalDist.toFixed(1)),
        durationMin: Math.ceil((totalDist / 25) * 60)
    };
}
