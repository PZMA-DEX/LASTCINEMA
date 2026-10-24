/* Eunha Cinema V18 · explicit, cached architectural renderer.
 * No native canvas patches, no extra motion easing, no second game loop.
 * Logical scene units stay32px; art is authored at3× and cached two rooms at a time.
 */
(()=>{'use strict';
 const rooms=window.EUNHA_LAYOUT_V18||{},T=32,SCALE=3,MAX_CACHE=2;
 const cache=new Map();let builds=0,warmingId=null,warmCheckAt=0,isWarming=false;
 const names={lobby:'중앙 로비',ticket:'매표소',office:'관리사무실',theatre:'제1상영관',projection:'영사실',archive:'기록보관실',storage:'설비창고',workshop:'정비 작업실'};
 const english={lobby:'GRAND FOYER',ticket:'BOX OFFICE',office:'MANAGEMENT',theatre:'AUDITORIUM 01',projection:'PROJECTION',archive:'FILM ARCHIVE',storage:'EQUIPMENT STORE',workshop:'MAINTENANCE'};
 const fallbackTheme={wall:'#3f3840',trim:'#c09b60',glow:'#f4d7a3',floor:'#958c7b'};
 const themeFor=s=>window.EUNHA_V18_SURFACES?.themeFor?.(s)||fallbackTheme;
 const box=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
 const ellipse=(g,x,y,rx,ry,c)=>{g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();};
 const label=(g,t,x,y,n=7,color='#f5dfb5')=>{g.save();g.fillStyle=color;g.font=`600 ${n}px system-ui,sans-serif`;g.textAlign='center';g.fillText(t,x,y);g.restore();};
 function doorArt(g,s,d,p){
  const X=d.x*T,Y=d.y*T,W=s.w*T,H=s.h*T,cx=X+16,cy=Y+16;
  const up=d.y<3,down=d.y===s.h-1,left=d.x===0,right=d.x===s.w-1;
  const stairs=rooms[d.to]?.floor!==s.floor;
  g.save();
  if(up){
   // Back-wall portal sits inside the actual solid elevation, with its foot on the door cell.
   const x=cx-26,y=23,w=52,h=74;
   box(g,x-5,y-5,w+10,h+7,'#141218');box(g,x-3,y-4,w+6,h+4,p.trim||'#c8a16a');
   const wood=g.createLinearGradient(x,y,x+w,y+h);wood.addColorStop(0,'#755747');wood.addColorStop(.45,'#44333a');wood.addColorStop(1,'#1c2029');
   g.fillStyle=wood;g.fillRect(x+2,y,w-4,h-2);
   box(g,x+w/2-1,y+2,2,h-5,'#171921');
   for(const side of [0,1]){const lx=x+6+side*24;g.strokeStyle='#bc9b66';g.lineWidth=.7;g.strokeRect(lx,y+9,16,41);box(g,lx+1,y+10,14,3,'#e8c18b20');ellipse(g,lx+(side?2:14),y+50,1.4,2,'#e7c085');}
   box(g,x-6,y-8,w+12,4,'#e5c896');box(g,x+2,91,w-4,5,'#cfad7d');
   label(g,'SCREEN 01',cx,18,7,'#e5c896');
  }else if(left||right){
   const x=left?0:W-32;
   box(g,x,Y-7,32,48,'#0c1721');
   const depth=g.createLinearGradient(x,0,x+32,0);depth.addColorStop(0,left?'#080d15':'#75634e');depth.addColorStop(1,left?'#75634e':'#080d15');
   g.fillStyle=depth;g.fillRect(x+3,Y-4,26,40);
   for(let i=0;i<5;i++){const yy=Y+3+i*7;box(g,x+4,yy,24,2,'#b9a382');box(g,x+4,yy+2,24,3,'#2a3036');}
   box(g,x+1,Y-7,30,4,p.trim||'#bca16b');box(g,x+1,Y+38,30,3,'#cfb387');
   box(g,left?x+28:x+1,Y-6,3,47,'#d1b17d');
   const arrow=left?'‹':'›';label(g,arrow,x+16,Y+29,21,'#e8c995');
   const signX=left?43:W-43;
   g.textAlign=left?'left':'right';g.fillStyle='#d6c7a5';g.font='600 7px system-ui,sans-serif';g.fillText((rooms[d.to]?.floor||'')+'  '+names[d.to],signX,Y-10);
  }else if(down){
   // Cutaway front wall: a doorway threshold, never a tall fake obstacle on the aisle.
   box(g,cx-25,Y,50,32,'#111820');box(g,cx-26,Y,4,32,p.trim||'#bda272');box(g,cx+22,Y,4,32,p.trim||'#bda272');
   box(g,cx-22,Y+1,44,3,'#d7be92');box(g,cx-22,Y+26,44,2,'#786552');
   if(stairs)for(let i=0;i<3;i++)box(g,cx-19,Y+7+i*6,38,2,'#a49275');
   else{box(g,cx-18,Y+7,36,16,'#253439');box(g,cx-16,Y+9,32,1,'#789087');}
   const toText=stairs?(rooms[d.to]?.floor||'')+'  STAIRS':d.to==='office'?'OFFICE':d.to==='ticket'?'BOX OFFICE':'FOYER';
   label(g,toText,cx,Y-7,7,'#e9d4ab');
  }else{
   // Interior portal fallback; all V18 production doors use perimeter cells.
   box(g,X+2,Y+2,28,28,'#2a3339');box(g,X+2,Y+27,28,3,'#d9bb80');
  }
  // Exact trigger tile stays legible as a modest warm threshold.
  if(!up&&!down&&!left&&!right)box(g,X+9,Y+29,14,2,'#e5c68b');
  g.restore();
 }
 function spotArt(g,s,p){
  const X=p.x*T,Y=p.y*T,cx=X+16;
  const furniture=s.objects.find(o=>p.x>=o.x&&p.x<o.x+o.w&&p.y>=o.y&&p.y<o.y+o.h);
  const tabletop=furniture&&['desk','table','workbench','counter'].includes(furniture.type);
  const cy=tabletop?furniture.y*T+Math.min(24,furniture.h*T*.38):Y+17;
  g.save();
  if(p.id==='scene_c10'){
   ellipse(g,cx,cy+5,9,3,'#2c211c66');
   const brass=g.createLinearGradient(cx-7,cy-6,cx+8,cy+6);brass.addColorStop(0,'#f2d49d');brass.addColorStop(.45,'#b88b49');brass.addColorStop(1,'#614527');g.fillStyle=brass;g.fillRect(cx-7,cy-3,14,7);ellipse(g,cx,cy-3,7,3,'#d9b574');ellipse(g,cx+1,cy-3,3.4,1.3,'#ecd3a0');
  }else if(p.type==='bag'){
   ellipse(g,cx,cy+10,10,3,'#070c1555');
   g.lineWidth=2;g.strokeStyle='#c2a47a';g.beginPath();g.arc(cx,cy-5,5,Math.PI,Math.PI*2);g.stroke();
   box(g,cx-9,cy-6,18,16,'#4b3d36');box(g,cx-8,cy-5,16,6,'#9b7955');box(g,cx-7,cy+2,14,7,'#674e3b');box(g,cx-1,cy-1,3,4,'#d8bb7f');box(g,cx-8,cy+9,16,1,'#c1a074');
  }else if(p.id==='scene_c11'){
   g.translate(cx,cy);g.rotate(-.18);box(g,-10,-6,20,13,'#733c40');box(g,-8,-5,16,11,'#aa5961');
   g.fillStyle='#dbb1a0';g.beginPath();g.moveTo(-8,-4);g.lineTo(-3,1);g.lineTo(1,-2);g.lineTo(5,2);g.lineTo(9,-4);g.closePath();g.fill();box(g,-12,6,4,3,'#a75a62');
  }else if(p.id==='scene_c16'){
   g.translate(cx,cy);g.rotate(.16);box(g,-9,-5,11,5,'#c6ad80');box(g,3,0,8,3,'#8b5153');box(g,-5,4,9,3,'#c3b99c');g.strokeStyle='#514d42';g.lineWidth=1;g.beginPath();g.arc(6,-4,4,0,4.5);g.stroke();
  }else if(p.type==='monitor'||p.type==='printer'){
   // The object itself is the investigation point; a small status lamp is enough.
   ellipse(g,cx+8,cy+3,1.7,1.7,'#e5c98a');
  }else{
   const angle=(p.x%3-1)*.12;g.translate(cx,cy);g.rotate(angle);box(g,-9,-7,18,14,'#332c2c66');box(g,-9,-9,17,14,'#e3d7b9');box(g,-7,-7,13,2,p.type==='notice'?'#9a544c':'#9f956f');box(g,-7,-3,12,.8,'#92856d');box(g,-7,0,9,.8,'#9c8c72');
   if(p.type==='card')box(g,-7,2,4,1,'#9a5454');
  }
  g.restore();
 }
 function build(s,scale=SCALE){
  const canvas=document.createElement('canvas');canvas.width=s.w*T*scale;canvas.height=s.h*T*scale;
  const g=canvas.getContext('2d',{alpha:false});g.scale(scale,scale);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
  const p=themeFor(s),surfaces=window.EUNHA_V18_SURFACES,props=window.EUNHA_V18_PROPS;
  box(g,0,0,s.w*T,s.h*T,p.floor||'#776d62');surfaces?.drawFloor?.(g,s,p);surfaces?.drawShell?.(g,s,p);
  for(const o of [...s.objects].sort((a,b)=>(a.y+a.h)-(b.y+b.h)))props?.draw?.(g,o,s,p);
  for(const point of s.spots)spotArt(g,s,point);
  surfaces?.drawAccents?.(g,s,p);
  for(const d of s.doors)doorArt(g,s,d,p);
  builds++;
  return canvas;
 }
 function warmNearDoor(s){
  if(isWarming||warmingId||typeof requestIdleCallback!=='function'||!window.TG_isOpen?.())return;
  const now=performance.now();if(now-warmCheckAt<200)return;warmCheckAt=now;
  const st=window.TG_state?.();if(st?.f!==s.id)return;
  const closest=s.doors.map(d=>({d,distance:Math.abs(st.x-d.x)+Math.abs(st.y-d.y)})).filter(q=>q.distance<=4).sort((a,b)=>a.distance-b.distance)[0];
  if(!closest||cache.has(closest.d.to)||!rooms[closest.d.to])return;
  const target=closest.d.to;warmingId=target;
  requestIdleCallback(()=>{
   warmingId=null;const current=window.TG_state?.();if(current?.f!==s.id||cache.has(target))return;
   isWarming=true;try{renderBackground(rooms[target]);}finally{isWarming=false;}
  },{timeout:700});
 }
 function renderBackground(s){
  if(typeof s==='string')s=rooms[s];if(!s)return null;
  const key=s.id;let entry=cache.get(key);
  if(entry){cache.delete(key);cache.set(key,entry);warmNearDoor(s);return entry.canvas;}
  entry={canvas:build(s),scene:s,overlays:new Map()};cache.set(key,entry);
  while(cache.size>MAX_CACHE){const first=cache.keys().next().value;cache.delete(first);}
  warmNearDoor(s);return entry.canvas;
 }
 function renderRoom(id){const s=rooms[id];return s?build(s):null;}
 // Cache already shaded high-resolution fixture slices; only intersecting tall fixtures draw again.
 // This is a depth layer, not a motion effect. Avatar and camera use the engine's single position.
 function drawForeground(ctx,s,ox,oy,tile,sc,time,position){
  if(!s||!position||!Number.isFinite(position.x)||!Number.isFinite(position.y))return;
  const props=window.EUNHA_V18_PROPS;if(!props)return;
  const feet=(position.y+1)*T,avatarTop=feet-48,avatarLeft=position.x*T,avatarRight=avatarLeft+T;
  for(let i=0;i<s.objects.length;i++){
   const o=s.objects[i],rise=props.overhang?.(o)||0;if(!rise)continue;
   const x=o.x*T,y=o.y*T,w=o.w*T,h=o.h*T,top=y-rise-8;
   if(feet>y+h-3||feet<top||avatarTop>y+h||avatarRight<x-4||avatarLeft>x+w+4)continue;
   renderBackground(s);const entry=cache.get(s.id);if(!entry)continue;
   let overlay=entry.overlays.get(i);
   if(!overlay){
    const extra=12,height=h+rise+20,c=document.createElement('canvas');c.width=(w+extra*2)*SCALE;c.height=height*SCALE;
    const g=c.getContext('2d');g.scale(SCALE,SCALE);g.translate(-x+extra,-top);props.draw(g,o,s,themeFor(s));
    for(const p of s.spots)if(p.x>=o.x&&p.x<o.x+o.w&&p.y>=o.y&&p.y<o.y+o.h)spotArt(g,s,p);
    overlay={canvas:c,left:x-extra,top,width:w+extra*2,height};entry.overlays.set(i,overlay);
   }
   ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
   ctx.drawImage(overlay.canvas,ox+overlay.left*sc,oy+overlay.top*sc,overlay.width*sc,overlay.height*sc);ctx.restore();
  }
 }

 window.LS_CINEMA_V18={version:'eunha-v18-architectural-rebuild',designRooms:()=>Object.keys(rooms),renderRoom,renderBackground,drawForeground,
  cacheQA:()=>({rooms:[...cache.keys()],limit:MAX_CACHE,scale:SCALE,builds,warming:warmingId}),layout:()=>rooms,zoom:()=>window.TG_viewQA?.().zoom};
 // Compatibility read-only alias used by older preview and diagnostics; motion belongs to cinema.js.
 window.LS_CINEMA_V17=window.LS_CINEMA_V18;
 const host=document.getElementById('tgHost'),sh=host?.shadowRoot;
 if(!sh)return;
 if(typeof requestIdleCallback==='function')requestIdleCallback(()=>renderBackground(rooms.lobby),{timeout:1000});
 else setTimeout(()=>renderBackground(rooms.lobby),120);
 const $=id=>sh.getElementById(id),style=document.createElement('style');
 style.id='eunha-architecture-v18-ui';style.textContent=`
 #game{background:#101820!important}#view{image-rendering:auto!important}
 #top{background:linear-gradient(180deg,#101722fa,#17202be8 78%,transparent)!important;border-top:2px solid #c6a36c80}
 #title b{color:#ead6ad!important;letter-spacing:.015em}#status{color:#c9c5b7!important}
 #travel{border-color:#9f8e6d!important;background:#25323ae8!important}#paper{background:#16222c!important;border-color:#9e8761!important}
 #eunha-plan{color:#ded8c7}#eunha-plan .plan-tabs{display:flex;gap:8px;margin:14px 0}#eunha-plan .plan-tabs button{flex:1;background:#21323c;border-color:#6d756e;color:#c7c9bb}
 #eunha-plan .plan-tabs button[aria-selected=true]{background:#836849;border-color:#e2c795;color:#fff0cf}
 #eunha-plan svg{display:block;width:100%;height:auto;max-height:54dvh;border:1px solid #697267;border-radius:8px;background:#101e29}
 #eunha-plan p{font-size:12px;line-height:1.7;color:#b8bbaa;margin:10px 0}#eunha-plan .plan-here{font-size:12px;color:#edd3a0}
 @media(max-height:540px) and (orientation:landscape){#eunha-plan svg{max-height:42dvh}}
 `;sh.appendChild(style);
 const plans={
  '1F':[{id:'theatre',x:128,y:30,w:224,h:118},{id:'lobby',x:128,y:185,w:224,h:156},{id:'ticket',x:26,y:382,w:180,h:96},{id:'office',x:274,y:382,w:180,h:96}],
  '2F':[{id:'projection',x:28,y:151,w:194,h:190},{id:'archive',x:258,y:151,w:194,h:190}],
  'B1':[{id:'storage',x:28,y:151,w:194,h:190},{id:'workshop',x:258,y:151,w:194,h:190}]
 };
 function planSvg(floor,current){
  const route=floor==='1F'?'M240 148V185 M240 341V363H116V382 M240 363H364V382':'M222 246H258';
  const mini=plans[floor].map(r=>{
   const active=r.id===current,s=rooms[r.id],padding=9,innerW=r.w-padding*2,innerH=r.h-48,k=Math.min(innerW/(s.w*T),innerH/(s.h*T));
   const fixtures=s.objects.map(o=>`<rect x="${r.x+r.w/2-s.w*T*k/2+o.x*T*k}" y="${r.y+8+o.y*T*k}" width="${o.w*T*k}" height="${o.h*T*k}" rx="1" fill="${active?'#b8a27b':'#7c8c8a'}" opacity=".65"/>`).join('');
   return `<g><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="7" fill="${active?'#354346':'#1a2e3c'}" stroke="${active?'#ecd09b':'#7d8a7f'}" stroke-width="${active?3:1.5}"/>${fixtures}<text x="${r.x+r.w/2}" y="${r.y+r.h-22}" fill="#ece1c8" font-size="15" font-weight="700" text-anchor="middle">${names[r.id]}</text><text x="${r.x+r.w/2}" y="${r.y+r.h-7}" fill="${active?'#e6ca92':'#8ea3a7'}" font-size="8" text-anchor="middle" letter-spacing="1">${active?'● 현재 위치':english[r.id]}</text></g>`;
  }).join('');
  const stairs=floor==='1F'?'<text x="20" y="246" fill="#b9c0ae" font-size="11">2F 영사실 ◂</text><text x="366" y="246" fill="#b9c0ae" font-size="11">▸ B1 설비</text>':'<text x="240" y="407" fill="#b9c0ae" font-size="12" text-anchor="middle">계단으로 1층 중앙 로비 연결</text>';
  return `<svg viewBox="0 0 480 500" role="img" aria-label="은하극장 ${floor} 공간 안내도"><path d="${route}" fill="none" stroke="#b4a17b" stroke-width="3" stroke-dasharray="5 5"/>${mini}${stairs}</svg>`;
 }
 const paper=$('paper');let planFloor='1F';
 function decorateOverview(){
  if(!paper||!paper.querySelector('h2')?.textContent.includes('은하극장 안내도')||paper.querySelector('#eunha-plan'))return;
  const current=window.TG_state?.().f||'lobby';planFloor=rooms[current]?.floor||'1F';
  for(const child of [...paper.children])if(child.tagName!=='H2'&&!child.classList.contains('close')&&child.id!=='sheetActions')child.remove();
  const container=document.createElement('div');container.id='eunha-plan';
  const draw=()=>{container.innerHTML=`<div class="plan-here">${rooms[current]?.floor||'1F'} · ${names[current]||'중앙 로비'}</div><div class="plan-tabs">${['1F','2F','B1'].map(f=>`<button type="button" data-floor="${f}" aria-selected="${f===planFloor}">${f}</button>`).join('')}</div>${planSvg(planFloor,current)}<p>문과 계단으로 공간을 오갑니다. 가구가 배치된 작은 평면도는 방의 형태를 보여 줍니다. 관리사무실은 2차 수색부터 열립니다.</p>`;for(const button of container.querySelectorAll('[data-floor]'))button.addEventListener('click',()=>{planFloor=button.dataset.floor;draw();});};
  draw();paper.querySelector('h2').insertAdjacentElement('afterend',container);
 }
 if(paper)new MutationObserver(decorateOverview).observe(paper,{childList:true});
})();
