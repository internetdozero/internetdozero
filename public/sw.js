const CACHE_NAME = 'idz-tools-v3';
const OFFLINE_ASSETS = ['/manifest.webmanifest', '/pwa-icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(OFFLINE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin || event.request.method !== 'GET' || requestUrl.pathname.startsWith('/api')) return;

  // Always Network-First for HTML navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request).then((cached) => cached || caches.match('/tools')))
    );
    return;
  }

  // Network-First for scripts and stylesheets to always get latest builds
  if (['script', 'style'].includes(event.request.destination)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-First for immutable fonts and static images
  if (['font', 'image'].includes(event.request.destination)) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }))
    );
  }
});
