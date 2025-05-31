self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('7mr-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/script.js',
        '/manifest.json',
        '/icon-192.png',
        'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
