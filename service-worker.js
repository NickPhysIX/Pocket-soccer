const CACHE_NAME = 'pocket-five-aside-v2-1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-1024.png',
  './assets/player.png',
  './assets/teammate.png',
  './assets/opponent.png',
  './assets/keeper_home.png',
  './assets/keeper_away.png',
  './assets/ball.png',
  './assets/goal.png',
  './assets/audio/cheer1.mp3',
  './assets/audio/cheer3.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});
