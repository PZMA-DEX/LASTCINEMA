'use strict';
const BUILD='last-screening-v19-artmap-20261024';
const CACHE='last-screening-2042-'+BUILD;
const CORE=['./','./index.html',...['cinema-layout-v18.js','cinema-surfaces-v18.js','cinema-props-v18.js','cinema.js','cinema-world-v17.js','mobile-controls-v12.js'].map(name=>'./assets/game/'+name+'?v='+BUILD),...['lobby','ticket','office','theatre','projection','archive','storage','workshop'].map(id=>'./assets/game/maps/'+id+'.png'),'./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 // A missing optional poster must not prevent a complete engine update.
 await Promise.all(CORE.map(async path=>{try{const response=await fetch(new Request(path,{cache:'reload'}));if(response.ok)await cache.put(path,response);}catch(_){} }));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith('last-screening-2042-')&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin||event.request.headers.has('range')||/\.(mp4|webm|m4v)$/i.test(url.pathname))return;
 event.respondWith((async()=>{
  try{const response=await fetch(event.request);if(response.ok){const cache=await caches.open(CACHE);await cache.put(event.request,response.clone());}return response;}
  catch(_){return await caches.match(event.request)||(event.request.mode==='navigate'?await caches.match('./index.html'):null)||Response.error();}
 })());
});
