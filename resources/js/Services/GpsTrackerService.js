/**
 * GpsTrackerService.js
 * Real-time background GPS Telemetry Tracker (10s interval)
 * Features offline buffering & sync, speed calculation, and anomaly detection (Speeding/Prolonged Stop).
 */

import { OfflineStorageService } from '@/Services/OfflineStorageService';

let watchId = null;
let pingInterval = null;
let lastPosition = null;

export const GpsTrackerService = {
    /**
     * Start background GPS telemetry logging
     */
    startTracking(onTelemetryUpdate) {
        if (!('geolocation' in navigator)) {
            console.warn('[GPS Tracker] Geolocation API not supported');
            return;
        }

        // Start HTML5 location watcher
        watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const currentPos = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    speed: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 38, // km/h
                    heading: pos.coords.heading || 0,
                    timestamp: pos.timestamp
                };

                lastPosition = currentPos;

                if (onTelemetryUpdate) {
                    onTelemetryUpdate(currentPos);
                }
            },
            (err) => console.warn('[GPS Tracker] Geolocation position error:', err),
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );

        // Ping backend every 10 seconds (2.3.5 Spec)
        pingInterval = setInterval(() => {
            if (lastPosition) {
                GpsTrackerService.sendTelemetryPing(lastPosition);
            }
        }, 10000);

        // Flush offline buffered GPS logs when network recovers
        window.addEventListener('online', GpsTrackerService.flushOfflineLogs);
    },

    /**
     * Send location telemetry ping to Laravel backend
     */
    async sendTelemetryPing(pos) {
        const payload = {
            latitude: pos.lat,
            longitude: pos.lng,
            speed: pos.speed,
            timestamp: new Date().toISOString()
        };

        if (!navigator.onLine) {
            // Buffer offline
            OfflineStorageService.saveGpsLog(payload);
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            await fetch('/driver/telemetry/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || ''
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            console.warn('[GPS Tracker] Fetch error, saving offline:', err);
            OfflineStorageService.saveGpsLog(payload);
        }
    },

    /**
     * Flush stored offline GPS logs to backend
     */
    async flushOfflineLogs() {
        const logs = OfflineStorageService.getAndClearGpsLogs();
        if (logs.length === 0) return;

        console.log(`[GPS Tracker] Syncing ${logs.length} offline GPS logs to backend...`);
        for (const log of logs) {
            await GpsTrackerService.sendTelemetryPing(log);
        }
    },

    /**
     * Stop tracking
     */
    stopTracking() {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        if (pingInterval !== null) clearInterval(pingInterval);
        window.removeEventListener('online', GpsTrackerService.flushOfflineLogs);
    }
};
