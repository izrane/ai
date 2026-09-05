// ⬇️⬇️ INCRÉMENTE CE NUMÉRO À CHAQUE MISE À JOUR DU SITE ⬇️⬇️
const CACHE_NAME = 'izran-ai-v7';

const A_INSTALLER = [
  '/',
  '/index.html',
  '/dico1.js',   // ⬅️ le dico devient dispo hors-ligne
  '/dico2.js',
  '/dico-old.js',
  '/favicon.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js'
];

// INSTALL : un fichier manquant ne bloque plus TOUT (fini l'échec silencieux)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.allSettled(A_INSTALLER.map((u) => cache.add(u))))
      .then(() => self.skipWaiting())   // ⬅️ active immédiatement la nouvelle version
  );
});

// ACTIVATE : supprime les ANCIENS caches (dont 'tawiza-ai-v1') + prend les onglets en main
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(
        cles.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1) API / TTS : jamais de cache
  if (url.pathname.includes('/api/') ||
      url.hostname === 'huggingface.co' ||
      url.hostname === 'social.melodyno.com' ||
      url.hostname === 'web.melodyno.com' ||
      url.hostname === 'melodyno.com') {
    return;
  }

  // 2) CDN (axios) : cache d'abord, ces fichiers ne changent pas
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((r) => r || fetch(event.request))
    );
    return;
  }

  // 3) TES fichiers (pages, dico, données) : RÉSEAU d'abord (toujours frais),
  //    cache en secours (hors-ligne). C'est le changement-clé : plus jamais figé.
  event.respondWith(
    fetch(event.request)
      .then((reponse) => {
        if (reponse && reponse.ok) {
          const copie = reponse.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, copie));
        }
        return reponse;
      })
      .catch(() => caches.match(event.request))
  );
});
