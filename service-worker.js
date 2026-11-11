// ═══════════════════════════════════════════════════════════
//  SERVICE WORKER — ChatMBR (mode hors-ligne + installation)
// ═══════════════════════════════════════════════════════════

const CACHE_NAME = 'chatmbr-v21.2';
const RUNTIME_CACHE = 'chatmbr-runtime';

// Fichiers à mettre en cache dès l'installation
const PRECACHE_URLS = [
  '/',
  'index.html',
  'manifest.json',
  'favicon.ico',
   'studio.html',
  'emoji.html', 
  'i18n.js',
  'mbr.png',
  'dico-old.js',
  'dico1.js',
  'dico2.js',
  'dico-chawi1.js', 
  'dico-chawi2.js',
  'dico-moz1.js', 
  'dico-moz2.js', 
  'dico-moz3.js',
  'dico-nafusa1.js',
  'dico-touareg1.js',
  'dico-touareg2.js',
'dico-blida.js',
'dico-tamazirt.js',
  'dico-siwi.js', 
  'dico-tachelhit·js'
  'icon-192.png',
  'icon-512.png',
  'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js',
  'backgrounds/bg1.jpg',
  'backgrounds/bg2.jpg',
  'backgrounds/bg3.jpg',
  'backgrounds/bg4.jpg',
    'backgrounds/bg5.jpg',
  'clock-aero.js',
   '2.html',
  '1.html',
  'ak.jpg',
  'lame.min.js'
];

// ── INSTALLATION : cache initial ──
self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Mise en cache des fichiers...');
        // Cache chaque fichier individuellement (plus robuste)
        return Promise.allSettled(
          PRECACHE_URLS.map(url => cache.add(url).catch(err => {
            console.warn(`[SW] Impossible de cacher: ${url}`, err);
          }))
        );
      })
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATION : nettoyage des anciens caches ──
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map(name => {
            console.log('[SW] Suppression ancien cache:', name);
            return caches.delete(name);
          })
      );
    })
    .then(() => self.clients.claim())
  );
});

// ── FETCH : stratégie Cache-First avec fallback réseau ──
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1) Réponse trouvée dans le cache → retourner directement
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2) Sinon → aller chercher sur le réseau
      return fetch(event.request)
        .then((response) => {
          // Vérifier si la réponse est valide
          if (!response || response.status !== 200) {
            return response;
          }

          // Mettre en cache la nouvelle ressource
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        })
        .catch(() => {
          // 3) Hors-ligne et pas en cache → fallback
          console.log('[SW] Hors-ligne, pas en cache:', event.request.url);

          // Si c'est une navigation de page → retourner la page principale
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }

          // Réponse d'erreur générique
          return new Response(
            JSON.stringify({ error: 'Offline' }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        });
    })
  );
});

// ── Message : mise à jour forcée ──
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── Synchronisation en arrière-plan (optionnel) ──
self.addEventListener('sync', (event) => {
  if (event.tag === 'chatmbr-sync') {
    console.log('[SW] Background sync...');
    // Pourrait être utilisé pour synchroniser les favoris, etc.
  }
});
