'use strict';
const BUILD='last-screening-v19d-enginefix-20261024';
const CACHE='last-screening-2042-'+BUILD;
// Do not prefetch the 17MB inline map script while the page is also loading it (important on mobile).
const CORE=['./','./index.html','./CHECK_V19D.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
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
