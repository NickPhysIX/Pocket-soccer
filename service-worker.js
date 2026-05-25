const CACHE_NAME = 'pocket-five-aside-v4-3';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-1024.png',
  './player.png',
  './teammate.png',
  './opponent.png',
  './keeper_home.png',
  './keeper_away.png',
  './ball.png',
  './goal.png'
];

const OPTIONAL_ASSETS = [
  './cheer1.mp3',
  './cheer3.mp3'
];

async function cacheAssetList(cache, urls) {
  await Promise.all(urls.map(async (url) => {
    try {
      await cache.add(url);
    } catch (err) {
      console.warn('[SW] Cache skipped:', url, err);
    }
  }));
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cacheAssetList(cache, CORE_ASSETS);
    await cacheAssetList(cache, OPTIONAL_ASSETS);
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || networkFetch;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(staleWhileRevalidate(event.request));
});
