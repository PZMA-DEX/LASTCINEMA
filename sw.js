'use strict';
const BUILD='last-screening-v34-evidence-sharing-20261029';
const CACHE='last-screening-2042-'+BUILD;
// Room art, actor sheets, portraits and all engine modules live inside index.html.
// Cache installation never depends on obsolete external maps or engine paths.
const CORE=[
 './index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'
];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 try{
  await Promise.all(CORE.map(async path=>{
   const response=await fetch(new Request(path,{cache:'reload'}));
   if(!response.ok)throw new Error('Required game asset unavailable: '+path);
   await cache.put(path,response);
  }));
 }catch(error){await caches.delete(CACHE);throw error;}
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
  try{
   const response=await fetch(event.request);
   if(response.ok){
    const cache=await caches.open(CACHE);
    // The embedded HTML is large; keep one canonical copy across navigation URLs.
    await cache.put(event.request.mode==='navigate'?'./index.html':event.request,response.clone());
   }
   return response;
  }catch(_){
   const cache=await caches.open(CACHE);
   const exact=await cache.match(event.request);
   if(exact)return exact;
   // Versioned and unversioned references share the current build's offline copy.
   const canonical=await cache.match(url.origin+url.pathname,{ignoreSearch:true});
   if(canonical)return canonical;
   return event.request.mode==='navigate'?(await cache.match('./index.html')||Response.error()):Response.error();
  }
 })());
});
