const CACHE_NAME = 'emoji-planner-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/assets/index.css',
  '/assets/index.js',
  '/assets/fonts/PressStart2P-Regular.ttf',
  // Cache emoji data
  '/lib/emojiData.js',
  // Cache additional UI assets
  '/assets/cloud-background.svg',
  // Cache base icon
  '/base-icon.svg'
];

// Cache emoji images and additional dynamic content
const EMOJI_CACHE_NAME = 'emoji-cache-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1';

// Install event - cache assets with improved error handling
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return Promise.all(
          ASSETS_TO_CACHE.map(url => {
            return cache.add(url).catch(error => {
              console.error(`[ServiceWorker] Failed to cache ${url}:`, error);
              // Continue with other files even if one fails
              return Promise.resolve();
            });
          })
        );
      })
      .catch((error) => {
        console.error('[ServiceWorker] Cache failed:', error);
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache with retry mechanism
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(async (response) => {
        // Return cached response if available
        if (response) {
          console.log('[ServiceWorker] Serving from cache:', event.request.url);
          
          // Fetch and cache updated version in background (stale-while-revalidate)
          event.waitUntil(
            fetch(event.request)
              .then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                  const cache = caches.open(CACHE_NAME);
                  cache.then(cache => cache.put(event.request, networkResponse.clone()));
                }
              })
              .catch(error => console.log('[ServiceWorker] Background fetch failed:', error))
          );
          
          return response;
        }

        // Special handling for emoji data requests
        if (event.request.url.includes('emojiData')) {
          return caches.open(EMOJI_CACHE_NAME)
            .then(cache => cache.match(event.request))
            .then(response => response || fetch(event.request));
        }

        // Implement retry mechanism for network requests
        const MAX_RETRIES = 3;
        let retries = 0;
        
        while (retries < MAX_RETRIES) {
          try {
            console.log(`[ServiceWorker] Fetching resource (attempt ${retries + 1}):`, event.request.url);
            const networkResponse = await fetch(event.request);
            
            // Cache valid responses
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const cache = await caches.open(CACHE_NAME);
              cache.put(event.request, networkResponse.clone());
              console.log('[ServiceWorker] Resource cached:', event.request.url);
            }
            
            return networkResponse;
          } catch (error) {
            retries++;
            console.warn(`[ServiceWorker] Fetch attempt ${retries} failed:`, error);
            
            // On final retry, return offline page for document requests
            if (retries === MAX_RETRIES) {
              console.error('[ServiceWorker] All fetch attempts failed');
              
              // Return offline page for navigation requests
              if (event.request.mode === 'navigate') {
                return caches.match('/offline.html');
              }
              
              return new Response('Offline content not available', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            }
            
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
          }
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Ensure service worker takes control immediately
  clients.claim();
});

// Handle service worker updates
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
