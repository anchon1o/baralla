// Service worker de Baralla: garda a páxina para xogar sen conexión contra a máquina
const CACHE = 'baralla-v1';
const FICHEIROS = ['./', './index.html', './manifest.webmanifest', './icono-192.png', './icono-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHEIROS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // Supabase, fontes e CDN van sempre pola rede
  // rede primeiro (para recibir versións novas) e caché se non hai conexión
  e.respondWith(fetch(e.request).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
