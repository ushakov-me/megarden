// MeGarden PWA service worker: офлайн-оболочка (cache-first).
// Версию поднимать при каждом изменении index.html (иначе клиенты держат старую).
var CACHE='MG3_SW_V1';
var SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL);})  .then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;})      .map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET'){return;}
  e.respondWith(
    caches.match(e.request).then(function(hit){return hit||fetch(e.request);})
      .catch(function(){return caches.match('index.html');})
  );
});
