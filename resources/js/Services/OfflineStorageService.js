/**
 * OfflineStorageService.js
 * LocalStorage / IndexedDB helper to save active delivery contracts and customer addresses
 * for terrain use when network connectivity is lost.
 */

const STORAGE_KEYS = {
    ACTIVE_DELIVERIES: 'sellify_offline_active_deliveries',
    AVAILABLE_DELIVERIES: 'sellify_offline_available_deliveries',
    DRIVER_PROFILE: 'sellify_offline_driver_profile',
    GPS_LOGS: 'sellify_offline_gps_logs',
};

export const OfflineStorageService = {
    /**
     * Save active deliveries to local storage
     */
    saveActiveDeliveries(deliveries) {
        try {
            localStorage.setItem(STORAGE_KEYS.ACTIVE_DELIVERIES, JSON.stringify({
                timestamp: new Date().toISOString(),
                data: deliveries
            }));
        } catch (e) {
            console.warn('[OfflineStorage] Error saving active deliveries:', e);
        }
    },

    /**
     * Get offline active deliveries
     */
    getActiveDeliveries() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_DELIVERIES);
            if (raw) {
                const parsed = JSON.parse(raw);
                return parsed.data || [];
            }
        } catch (e) {
            console.warn('[OfflineStorage] Error reading active deliveries:', e);
        }
        return [];
    },

    /**
     * Save GPS logs offline
     */
    saveGpsLog(log) {
        try {
            const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.GPS_LOGS) || '[]');
            existing.push({
                ...log,
                timestamp: new Date().toISOString()
            });
            // Keep maximum 100 offline logs before sync
            if (existing.length > 100) existing.shift();
            localStorage.setItem(STORAGE_KEYS.GPS_LOGS, JSON.stringify(existing));
        } catch (e) {
            console.warn('[OfflineStorage] Error saving GPS log:', e);
        }
    },

    /**
     * Clear synced offline GPS logs
     */
    getAndClearGpsLogs() {
        try {
            const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.GPS_LOGS) || '[]');
            localStorage.removeItem(STORAGE_KEYS.GPS_LOGS);
            return logs;
        } catch (e) {
            return [];
        }
    }
};
