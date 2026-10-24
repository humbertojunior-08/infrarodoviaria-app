/* Service worker mínimo: permite instalar o atalho.
   Não guarda o painel em cache — ele sempre abre a versão publicada. */
var CACHE = 'atalho-v2';
var BASICO = ['./', 'index.html', 'manifest.webmanifest', 'apple-touch-icon.png', 'icones/icon-192.png', 'icones/icon-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(BASICO); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
/* Só a casca do atalho (mesma origem) usa o cache, e só se estiver sem internet. */
self.addEventListener('fetch', function (e) {
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).catch(function () { return caches.match(e.request); }));
});
