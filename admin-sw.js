// Service worker for the Larna House admin PWA (dashboard/customers/accounting/stock).
// Deliberately does no caching — this is a live data dashboard, showing stale
// cached numbers would be worse than just hitting the network every time.
// Only exists because Chrome's Android "Add to Home Screen" install prompt
// requires a registered service worker with a fetch handler to consider a
// page installable.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
