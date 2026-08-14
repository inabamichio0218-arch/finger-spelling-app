const CACHE_NAME = 'finger-spelling-shell-v2';
const SHELL_FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './images/title.png',
  './images/btn-a.png',
  './images/btn-ka.png',
  './images/btn-sa.png',
  './images/btn-ta.png',
  './images/btn-na.png',
  './images/btn-ha.png',
  './images/btn-ma.png',
  './images/btn-ya.png',
  './images/btn-ra.png',
  './images/btn-other.png',
  './images/btn-omake.png'
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-64.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Let the browser stream and cache MP4 files normally. This avoids forcing
  // all 118 MB of video into the offline cache during installation.
  if (url.pathname.toLowerCase().endsWith('.mp4')) return;

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (!response || response.status !== 200 || response.type !== 'basic') return response;
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      return response;
    }))
  );
});
