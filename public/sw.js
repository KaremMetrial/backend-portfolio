// Service Worker for Performance Optimization
const CACHE_NAME = 'portfolio-v1.0.0';
const CRITICAL_ASSETS = [
    '/',
    '/index.html',
    '/assets/main.js',
    '/assets/main.css',
    '/fonts/inter-var.woff2',
    '/fonts/roboto-mono-var.woff2'
];

const PERFORMANCE_CONFIG = {
    cacheStrategy: 'stale-while-revalidate',
    maxCacheSize: 50, // MB
    maxCacheAge: 24 * 60 * 60 * 1000, // 24 hours
    networkTimeout: 3000 // 3 seconds
};

// Install event - cache critical assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            return cache.addAll(CRITICAL_ASSETS);
        })
        .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension requests
    if (request.url.startsWith('chrome-extension://')) {
        return;
    }

    event.respondWith(
        handleRequest(request)
    );
});

async function handleRequest(request) {
    try {
        // Check cache first for critical assets
        if (isCriticalAsset(request.url)) {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                // Update cache in background
                updateCache(request);
                return cachedResponse;
            }
        }

        // Network-first for non-critical assets with fallback
        const networkResponse = await fetchWithTimeout(request);

        if (networkResponse.ok) {
            // Cache successful responses
            cacheResponse(request, networkResponse.clone());
            return networkResponse;
        }

        // Fallback to cache if network fails
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            const offlinePage = await caches.match('/offline.html');
            return offlinePage || new Response('Offline', { status: 503 });
        }

        return networkResponse;

    } catch (error) {
        console.warn('Service Worker fetch error:', error);

        // Try cache fallback
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return error response
        return new Response('Network error', { status: 503 });
    }
}

// Cache management
async function cacheResponse(request, response) {
    if (!response.ok) return;

    const cache = await caches.open(CACHE_NAME);

    // Check cache size
    const cacheSize = await getCacheSize();
    if (cacheSize > PERFORMANCE_CONFIG.maxCacheSize * 1024 * 1024) {
        await cleanupCache();
    }

    // Add to cache
    await cache.put(request, response);
}

async function updateCache(request) {
    try {
        const networkResponse = await fetchWithTimeout(request);
        if (networkResponse.ok) {
            cacheResponse(request, networkResponse);
        }
    } catch (error) {
        console.warn('Background cache update failed:', error);
    }
}

// Cache utilities
async function getCacheSize() {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    let size = 0;

    for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
            const blob = await response.blob();
            size += blob.size;
        }
    }

    return size;
}

async function cleanupCache() {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    const now = Date.now();

    // Remove old entries
    for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
            const date = new Date(response.headers.get('date') || now);
            if (now - date.getTime() > PERFORMANCE_CONFIG.maxCacheAge) {
                await cache.delete(request);
            }
        }
    }

    // Remove excess entries
    const remainingKeys = await cache.keys();
    if (remainingKeys.length > 100) {
        const toDelete = remainingKeys.slice(0, remainingKeys.length - 100);
        for (const request of toDelete) {
            await cache.delete(request);
        }
    }
}

// Utility functions
function isCriticalAsset(url) {
    return CRITICAL_ASSETS.some(asset => url.includes(asset));
}

async function fetchWithTimeout(request) {
    return Promise.race([
        fetch(request),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Network timeout')), PERFORMANCE_CONFIG.networkTimeout)
        )
    ]);
}

// Performance monitoring
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
        const metrics = event.data.payload;
        self.registration.showNotification('Performance Alert', {
            body: `LCP: ${metrics.lcp}ms, FID: ${metrics.fid}ms, CLS: ${metrics.cls}`,
            icon: '/favicon.ico'
        });
    }
});