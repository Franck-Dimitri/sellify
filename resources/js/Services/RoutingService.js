/**
 * RoutingService.js
 * Helper for fetching OSRM (Open Source Routing Machine) routes & GeoJSON polylines,
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

    // Fallback: Return straight line segment with Haversine distance calculation
    const fallbackDist = calculateHaversineDistance(startLat, startLng, endLat, endLng);
    const fallbackDuration = Math.ceil((fallbackDist / 30) * 60); // 30 km/h average speed

    return {
        success: false,
        coordinates: [
            [startLat, startLng],
            [endLat, endLng]
        ],
        distanceKm: fallbackDist,
        durationMin: fallbackDuration > 1 ? fallbackDuration : 2,
    };
}
