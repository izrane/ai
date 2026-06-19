const CACHE_NAME = 'tawiza-ai-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js'
];

// INSTALL : mise en cache des ressources essentielles
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// FETCH : répondre avec le cache si possible, sinon réseau
self.addEventListener('fetch', (event) => {
  // Ne pas cacher les requêtes API (comme le TTS ou ton moteur de recherche)
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('huggingface.co') ||
      event.request.url.includes('se.tawiza.org') ||
      event.request.url.includes('tawiza.org/i/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});