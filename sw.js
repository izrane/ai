// sw.js - Service Worker pour Izran PWA
const CACHE_NAME = 'izran-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Ressources à mettre en cache lors de l'installation
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/style.css',
  '/js/main.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Installation - pré-cache des ressources essentielles
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pré-cache des ressources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[Service Worker] Activation immédiate');
        return self.skipWaiting();
      })
  );
});

// Activation - nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Prise de contrôle des clients');
        return self.clients.claim();
      })
  );
});

// Stratégie de cache : Network First avec fallback
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET et les appels API
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  // Ignorer les requêtes vers d'autres domaines (optionnel)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mise en cache des réponses valides
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // En cas d'échec réseau, essayer le cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            
            // Si la page demandée n'est pas en cache, afficher la page offline
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            return new Response('Contenu non disponible hors ligne', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Gestion des notifications push (optionnel)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Nouvelle notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Izran', options)
  );
});

// Clic sur notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});