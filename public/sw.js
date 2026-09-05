/**
 * Sellify.Express PWA Service Worker (sw.js)
 * Provides offline caching for driver routes, static assets, and web push notifications.
 */

const CACHE_NAME = 'sellify-express-v1';
const DYNAMIC_CACHE = 'sellify-express-dynamic-v1';

const STATIC_ASSETS = [
    '/',
    '/driver/dashboard',
    '/driver/deliveries',
    '/driver/map',
    '/driver/earnings',
    '/manifest.json',
    '/build/assets/app-1DTFk8zz.css'
];

// Install Event - Cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching driver PWA app shell');
            return cache.addAll(STATIC_ASSETS).catch((err) => {
                console.warn('[ServiceWorker] Partial pre-cache error:', err);
            });
        })
    );
    self.skipWaiting();
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
                        console.log('[ServiceWorker] Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch Event - Network First with Cache Fallback for Offline Mode
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Offline fallback from Cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('/driver/dashboard');
                    }
                });
            })
    );
});

// Listen for Web Push Notifications
self.addEventListener('push', (event) => {
    let data = { title: 'Sellify Express Notification', body: 'Nouvelle alerte de livraison disponible !' };
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: '/build/assets/layers-BWBAp2CZ.png',
        badge: '/build/assets/layers-BWBAp2CZ.png',
        vibrate: [200, 100, 200],
        data: { url: data.url || '/driver/dashboard' },
        actions: [
            { action: 'open', title: 'Ouvrir la course' },
            { action: 'close', title: 'Ignorer' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});
