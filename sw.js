// Service Worker for Graham and Doddsville Website
// Provides offline functionality and performance optimization

const CACHE_NAME = 'graham-doddsville-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Handle different types of requests
    if (request.method === 'GET') {
        // Static files - cache first strategy
        if (STATIC_FILES.includes(url.pathname) || url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
            event.respondWith(cacheFirst(request));
        }
        // API requests - network first strategy
        else if (url.pathname.startsWith('/api/')) {
            event.respondWith(networkFirst(request));
        }
        // Images - cache first with fallback
        else if (request.destination === 'image') {
            event.respondWith(cacheFirstWithFallback(request));
        }
        // Other requests - network first
        else {
            event.respondWith(networkFirst(request));
        }
    }
});

// Cache first strategy - good for static assets
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Cache first strategy failed:', error);
        return new Response('Offline content not available', { status: 503 });
    }
}

// Network first strategy - good for dynamic content
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Content not available offline', { status: 503 });
    }
}

// Cache first with fallback for images
async function cacheFirstWithFallback(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        // Return a placeholder image or default response
        return new Response('', { 
            status: 200,
            headers: { 'Content-Type': 'image/svg+xml' }
        });
    }
}

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'newsletter-sync') {
        event.waitUntil(syncNewsletterSubscriptions());
    }
});

async function syncNewsletterSubscriptions() {
    try {
        // Get pending subscriptions from IndexedDB
        const pendingSubscriptions = await getPendingSubscriptions();
        
        for (const subscription of pendingSubscriptions) {
            try {
                await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(subscription)
                });
                
                // Remove from pending list
                await removePendingSubscription(subscription.id);
            } catch (error) {
                console.error('Failed to sync subscription:', error);
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notification handling
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey
            },
            actions: [
                {
                    action: 'explore',
                    title: 'View Article',
                    icon: '/icons/icon-72x72.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/icons/icon-72x72.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Utility functions for IndexedDB operations
async function getPendingSubscriptions() {
    // Implementation would depend on your IndexedDB setup
    return [];
}

async function removePendingSubscription(id) {
    // Implementation would depend on your IndexedDB setup
    console.log('Removing pending subscription:', id);
}

// Performance monitoring
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'PERFORMANCE_METRIC') {
        // Log performance metrics
        console.log('Performance metric:', event.data.metric);
        
        // In production, you might want to send this to an analytics service
        if (event.data.metric.type === 'page_load') {
            // Send to analytics
        }
    }
});

// Cache size management
async function manageCacheSize() {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        // If cache is too large, remove oldest entries
        if (keys.length > 100) {
            const keysToDelete = keys.slice(0, keys.length - 100);
            await Promise.all(keysToDelete.map(key => cache.delete(key)));
        }
    }
}

// Periodic cache cleanup
setInterval(manageCacheSize, 24 * 60 * 60 * 1000); // Daily cleanup
