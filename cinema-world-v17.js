/* EUNHA CINEMA V19 · eight original hi-res background images, exact gameplay layout.
 * The image and collision grid share a 24x24-tile coordinate space.
 * Runtime images are loaded once per room; the renderer never paints replacement props.
 */
(()=>{'use strict';
 const rooms=window.EUNHA_LAYOUT_V18||{},T=32;
 const entries=new Map(),MAX_LOADED=8;
 function makeFallback(s){
  const c=document.createElement('canvas');c.width=c.height=768;
  const g=c.getContext('2d');g.fillStyle='#080e17';g.fillRect(0,0,768,768);
  g.fillStyle=['lobby','ticket'].includes(s.id)?'#736a58':s.floor==='B1'?'#4a4a47':'#5a4a3c';g.fillRect(96,224,576,416);
  g.strokeStyle='#b38d55';g.lineWidth=8;g.strokeRect(90,90,588,580);
  for(let i=0;i<24;i++){g.strokeStyle='#d1ad6820';g.lineWidth=1;g.beginPath();g.moveTo(i*32,224);g.lineTo(i*32,640);g.stroke();}
  g.fillStyle='#f7e0ae';g.font='bold 21px sans-serif';g.textAlign='center';g.fillText(s.name,384,180);
  return c;
 }
 function getEntry(s){
  let e=entries.get(s.id);if(e)return e;
  e={id:s.id,image:null,ready:false,failed:false,fallback:makeFallback(s)};
  entries.set(s.id,e);
  const img=new Image();img.decoding='async';
  img.onload=()=>{e.image=img;e.ready=true;};
  img.onerror=()=>{e.failed=true;console.error('[EUNHA MAP] image could not load:',s.image);};
  img.src=new URL(s.image,document.baseURI).href;
  return e;
 }
 function renderBackground(s){
  if(typeof s==='string')s=rooms[s];if(!s)return null;
  const e=getEntry(s);return e.ready?e.image:e.fallback;
 }
 function renderRoom(id){
  const s=rooms[id];if(!s)return null;
  const canvas=document.createElement('canvas');canvas.width=1254;canvas.height=1254;
  const g=canvas.getContext('2d');
  const entry=getEntry(s);
  const paint=()=>{g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.clearRect(0,0,1254,1254);
    const source=entry.ready?entry.image:entry.fallback;g.drawImage(source,0,0,1254,1254);renderSidePortals(g,s,1254/768);
  };
  paint();if(!entry.ready&&!entry.failed){const poll=()=>{if(entry.ready){paint();return;}if(!entry.failed&&canvas.isConnected)setTimeout(poll,120);};setTimeout(poll,120);}
  return canvas;
 }
 const sidePortals={};
 function renderSidePortals(g,s,scale){
  // The generated reference art already includes real front/rear doors. Only
  // side connections were not visible and need a small physical passage overlay.
  for(const d of s.doors){
   if(d.x!==2&&d.x!==21)continue;
   const left=d.x===2,x=left?57:669,y=d.y*32-12;
   g.save();g.scale(scale,scale);
   // Slim recessed doorway: placed entirely within the side-wall footprint,
   // leaving the neighboring clue furniture uncovered.
   g.fillStyle='#101820';g.fillRect(x-5,y-5,52,65);
   g.fillStyle='#a28a68';g.fillRect(x-5,y-5,52,3);
   g.fillStyle='#655b52';g.fillRect(x-5,y+56,52,3);
   const a=g.createLinearGradient(x,y,x+42,y);
   a.addColorStop(0,'#10151d');a.addColorStop(.5,'#25313a');a.addColorStop(1,'#090d12');
   g.fillStyle=a;g.fillRect(x,y,42,55);
   for(let i=0;i<4;i++){
     g.fillStyle=i%2?'#6d6254':'#514c48';g.fillRect(x+5,y+9+i*10,32,2);
   }
   g.fillStyle='#a68a60';g.fillRect(left?x+39:x,y,3,55);
   g.fillStyle='#e3c592';g.textAlign='center';g.font='bold 12px sans-serif';g.fillText(left?'‹':'›',x+21,y+31);
   g.restore();
  }
 }
 // Drawing side connections is a separate static overlay. Cache it per room only
 // after the corresponding background image resolves (no per-frame canvas setup).
 const composited=new Map();
 const originalRender=renderBackground;
 function composed(s){
  if(typeof s==='string')s=rooms[s];if(!s)return null;
  const entry=getEntry(s),old=composited.get(s.id);
  if(old&&old.ready===entry.ready)return old.canvas;
  if(!s.doors.some(d=>d.x===2||d.x===21))return originalRender(s);
  const c=document.createElement('canvas');c.width=1254;c.height=1254;
  const g=c.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
  g.drawImage(entry.ready?entry.image:entry.fallback,0,0,1254,1254);
  renderSidePortals(g,s,1254/768);
  composited.set(s.id,{ready:entry.ready,canvas:c});return c;
 }
 function drawForeground(){ /* No duplicate prop rendering over the image/sprite. */ }
 function cacheQA(){return {rooms:[...entries.keys()],loaded:[...entries.values()].filter(e=>e.ready).map(e=>e.id),failed:[...entries.values()].filter(e=>e.failed).map(e=>e.id),limit:MAX_LOADED,scale:'native 1254px',builds:composited.size};}
 window.LS_CINEMA_V18={version:'eunha-v19-artwork-aligned',designRooms:()=>Object.keys(rooms),layout:()=>rooms,renderRoom,renderBackground:composed,drawForeground,cacheQA,zoom:()=>window.TG_viewQA?.().zoom};
 window.LS_CINEMA_V17=window.LS_CINEMA_V18;
 // Image and sprite are ready independently. The single game RAF owns rendering.
 const preload=()=>{getEntry(rooms.lobby);};
 if(typeof requestIdleCallback==='function')requestIdleCallback(preload,{timeout:1000});else setTimeout(preload,50);
})();
