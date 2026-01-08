// Enhanced Service Worker for PWA - Optimized for performance and offline functionality
const CACHE_NAME = 'portfolio-v2.0';
const STATIC_CACHE = 'portfolio-static-v2.0';
const DYNAMIC_CACHE = 'portfolio-dynamic-v2.0';
const API_CACHE = 'portfolio-api-v2.0';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/cloudless-favicon.ico',
  '/next.svg',
  '/vercel.svg',
  '/file.svg',
  '/window.svg',
  '/globe.svg',
];

// API endpoints to cache
const API_ENDPOINTS = ['/api/contact'];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(API_CACHE).then((cache) => {
        console.log('[SW] Caching API endpoints');
        return cache.addAll(API_ENDPOINTS);
      }),
    ]).catch((error) => {
      console.error('[SW] Cache installation failed:', error);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, API_CACHE].includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim(),
    ])
  );
});

// Enhanced fetch event with different strategies for different resource types
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // API requests - Network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Static assets - Cache first
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Pages - Network first with cache fallback
  if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
    event.respondWith(handlePageRequest(request));
    return;
  }

  // Other resources - Stale while revalidate
  event.respondWith(handleDynamicRequest(request));
});

function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/) ||
    STATIC_ASSETS.includes(url.pathname)
  );
}

async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Network failed for API, trying cache');
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline response for contact API
  if (request.url.includes('/api/contact')) {
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'Contact form is not available offline. Please try again when online.',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  throw new Error('API request failed');
}

async function handleStaticRequest(request) {
  // Cache first strategy
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Static asset fetch failed:', error);
    throw error;
  }
}

async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache successful page responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Network failed for page, trying cache');
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline page
  const offlineResponse = await caches.match('/');
  if (offlineResponse) {
    return offlineResponse;
  }

  return new Response(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Offline - Themistoklis Baltzakis</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: system-ui, sans-serif; text-align: center; padding: 2rem; }
          h1 { color: #0284c7; }
        </style>
      </head>
      <body>
        <h1>You're Offline</h1>
        <p>This page is not available offline. Please check your internet connection and try again.</p>
        <button onclick="window.location.reload()">Retry</button>
      </body>
    </html>
    `,
    {
      headers: { 'Content-Type': 'text/html' },
    }
  );
}

async function handleDynamicRequest(request) {
  // Stale while revalidate strategy
  const cachedResponse = await caches.match(request);
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then((cache) => cache.put(request, networkResponse.clone()));
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Background sync for contact form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  // Implementation for syncing offline contact form submissions
  console.log('[SW] Syncing contact form data');
  // This would typically retrieve stored form data and submit it
}

// Push notification support
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/cloudless-favicon.ico',
    badge: '/cloudless-favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});

// Message handler for various operations
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'GET_CACHE_INFO':
      event.ports[0].postMessage({
        staticCache: STATIC_CACHE,
        dynamicCache: DYNAMIC_CACHE,
        apiCache: API_CACHE,
      });
      break;

    case 'CLEAR_CACHE':
      event.waitUntil(
        Promise.all([
          caches.delete(STATIC_CACHE),
          caches.delete(DYNAMIC_CACHE),
          caches.delete(API_CACHE),
        ]).then(() => {
          event.ports[0].postMessage({ success: true });
        })
      );
      break;

    default:
      console.log('[SW] Unknown message type:', type);
  }
});
