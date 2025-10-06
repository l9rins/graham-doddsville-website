// Service Worker for Performance Optimization
const CACHE_NAME = 'graham-doddsville-v2';
const urlsToCache = [
    '/',
    '/styles.css',
    '/index.html',
    '/news-scraper.js'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache.map(url => new Request(url, {cache: 'reload'})))
                    .catch(error => {
                        console.log('Cache addAll failed:', error);
                        // Continue even if some files fail to cache
                    });
            })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    // Skip caching for external domains
    if (event.request.url.includes('via.placeholder.com') || 
        event.request.url.includes('picsum.photos') ||
        event.request.url.includes('fonts.googleapis.com') ||
        event.request.url.includes('googleapis.com')) {
        return; // Let the browser handle these requests normally
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
            .catch(error => {
                console.log('Fetch failed:', error);
                // Return a fallback response or let the browser handle it
                return fetch(event.request);
            })
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
