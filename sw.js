const C='tb-1781699841738';const A=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>k!==C?caches.delete(k):null))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  var req=e.request;
  // Страница/данные — сначала из сети (всегда свежее), кэш только как офлайн-запас.
  if(req.mode==='navigate'||req.destination==='document'){
    e.respondWith(fetch(req).then(function(r){var cp=r.clone();caches.open(C).then(function(c){c.put('./index.html',cp);});return r;}).catch(function(){return caches.match('./index.html');}));
    return;
  }
  // Статика — из кэша, иначе из сети.
  e.respondWith(caches.match(req).then(function(r){return r||fetch(req);}));
});