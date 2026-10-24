/* LAST SCREENING V17 · cinema interior / smooth local sprite motion.
 * Keeps 8 scene grids, fixed doors, collision, evidence, Firebase intact.
 */
(() => {
  'use strict';
  if (window.LS_CINEMA_V17) return;
  const host = document.getElementById('tgHost');
  const sh = host && host.shadowRoot;
  if (!sh || typeof window.TG_open !== 'function') return;
  const $ = id => sh.getElementById(id);
  const safe = str => String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ZOOM = 3;
  const style = document.createElement('style');
  style.id = 'ls-v17-cinema-style';
  style.textContent = `
  #zoom { display:none !important; }
  #game { background:#090b12 !important; }
  #view { image-rendering:auto !important; }
  #top { backdrop-filter:blur(5px); }
  #status { font-weight:700; }
  #top { background:linear-gradient(180deg,rgba(7,12,20,.98),rgba(11,18,29,.88) 72%,transparent) !important; border-top:2px solid rgba(213,174,105,.66); }
  #title b { color:#f9dca3 !important; letter-spacing:.025em; }
  #travel { background:linear-gradient(135deg,#3c2630,#1b2737) !important; border-color:#c39a5e !important; color:#f5dbab !important; font-weight:750; }
  #exit { border-color:#7f7580 !important; color:#e5d9cd !important; }
  #status { color:#efe0bd !important; text-shadow:0 2px 4px #03070c; }
  #inspect { background:radial-gradient(circle at 30% 25%,#b1935d,#795431 74%) !important; border-color:#f1d9a4 !important; color:#fff6df; }
  #book { background:#172838 !important; border-color:#997849 !important; }
  #hint { background:#0a1424eb !important; border:1px solid #a28659a8 !important; color:#efe7d1; }
  #ls-joystick { background:radial-gradient(circle at 45% 35%,#3b3440,#1a2432 64%,#0b111f) !important; border-color:#d5aa70 !important; }
  #paper { background:linear-gradient(145deg,#14202d,#111623) !important; border:1px solid #bc935a !important; box-shadow:0 14px 55px #000c,inset 0 0 0 1px #b88b3340 !important; }
  #paper h2 { color:#f4d496 !important; }
  #ls-v15-plan { color:#efe5d0; }
  #ls-v15-plan .ls-floors { display:flex;gap:7px;margin:12px 0 13px; }
  #ls-v15-plan .ls-floors button { flex:1;padding:10px 7px;border-radius:7px;border:1px solid #675744;background:#152333;color:#c9c2b1;font-weight:700;font-size:12px; }
  #ls-v15-plan .ls-floors button[aria-selected="true"] { background:#8e633d;border-color:#f3d49b;color:#fff7e5; }
  #ls-v15-plan .ls-map-frame { background:radial-gradient(ellipse at 50% 30%,#293344,#0a1220 80%);border:1px solid #8b734a;border-radius:9px;overflow:hidden; }
  #ls-v15-plan svg { display:block;width:100%;height:auto;max-height:54dvh; }
  #ls-v15-plan .ls-map-bottom { color:#baa98b;font-size:11px;line-height:1.7;margin-top:12px; }
  #ls-v15-plan .ls-map-status { color:#f9dfa7;font-size:12px;line-height:1.7;margin:5px 0 0; }
  @media(max-width:359px){ #top { gap:4px !important; } #travel,#exit{font-size:10px!important;padding:7px 6px!important} }
  @media(orientation:landscape) and (max-height:530px){#ls-v15-plan svg{max-height:43dvh} }
  `;
  sh.appendChild(style);
  const zoomBtn = $('zoom');
  function forceZoom() {
    for(let i=0;i<3;i++) {
      const z = window.TG_viewQA?.().zoom;
      if (z === ZOOM || zoomBtn?.textContent?.includes('확대 3×')) break;
      if (!zoomBtn || typeof zoomBtn.onclick !== 'function') break;
      zoomBtn.click();
    }
    if (zoomBtn) {zoomBtn.hidden=true;zoomBtn.setAttribute('aria-hidden','true');zoomBtn.tabIndex=-1;}
  }
  forceZoom();
  const oldOpen=window.TG_open;
  window.TG_open=function(...args){forceZoom();const result=oldOpen.apply(this,args);forceZoom();return result;};
  // Protect the fixed 3x setting if an old script or an injected click attempts to change it.
  zoomBtn?.addEventListener('click', e=>{if(e.isTrusted){e.preventDefault();e.stopImmediatePropagation();}},true);

  // 8 original scenes. Objects here are decoration masks only, never collision edits.
  const rooms={
    lobby:{w:20,h:22,areas:[[2,7,4,2],[14,7,4,2],[3,10,2,2],[15,10,2,2],[2,17,2,2],[16,17,2,2],[8,14,4,2],[2,4,2,2],[16,4,2,2]],marks:[[9,14],[15,4],[4,10],[3,7]],doors:[[5,21],[14,21],[10,3],[1,15],[18,15]],c:'#b8a783'},
    ticket:{w:16,h:17,areas:[[2,7,12,2],[2,4,3,2],[10,4,3,2],[7,4,1,1],[2,12,2,2]],marks:[[3,4],[11,4]],doors:[[8,16]],c:'#c3a87e'},
    office:{w:17,h:18,areas:[[7,7,5,2],[9,5,1,1],[2,4,3,2],[13,4,2,2],[13,10,2,4],[2,12,4,2],[2,8,2,2]],marks:[[9,7],[11,12],[13,4],[3,4]],doors:[[8,17]],c:'#826346'},
    theatre:{w:20,h:20,areas:[[3,3,14,2],[2,7,6,2],[12,7,6,2],[2,10,6,2],[12,10,6,2],[2,13,6,2],[12,13,6,2],[9,5,2,1]],marks:[[9,16]],doors:[[10,19]],c:'#3a2739'},
    projection:{w:18,h:19,areas:[[2,5,14,2],[3,10,3,3],[12,10,3,3],[2,14,3,2]],marks:[[4,5],[13,5],[8,15],[14,15],[3,14]],doors:[[9,18],[15,18]],c:'#344b52'},
    archive:{w:18,h:20,areas:[[2,4,5,2],[11,4,5,2],[2,8,5,2],[11,8,5,2],[2,12,5,2],[11,12,5,2],[8,13,2,2]],marks:[[4,4],[13,4],[13,12]],doors:[[9,19]],c:'#69543f'},
    storage:{w:18,h:20,areas:[[2,4,5,2],[11,4,5,2],[2,8,5,2],[11,8,5,2],[2,13,4,3],[11,13,4,3]],marks:[[4,4],[3,13]],doors:[[9,19],[14,19]],c:'#394349'},
    workshop:{w:18,h:19,areas:[[2,4,4,2],[11,4,4,4],[2,10,13,2],[2,14,4,2]],marks:[[8,10]],doors:[[9,18]],c:'#414e51'}
  };
  const pretty={lobby:'로비',ticket:'매표소',office:'관리사무실',theatre:'상영관',projection:'영사실',archive:'기록보관실',storage:'설비창고',workshop:'정비 작업실'};
  function sceneFor(canvas){const st=window.TG_state?.();if(st&&rooms[st.f]&&rooms[st.f].w*32===canvas.width&&rooms[st.f].h*32===canvas.height)return st.f;return Object.keys(rooms).find(id=>rooms[id].w*32===canvas.width&&rooms[id].h*32===canvas.height)||null;}
  function floorBlocked(meta,x,y){if(x===0||x===meta.w-1||y<3||y===meta.h-1)return true;for(const [ox,oy,w,h] of meta.areas)if(x>=ox&&x<ox+w&&y>=oy&&y<oy+h)return true;return meta.marks.some(p=>p[0]===x&&p[1]===y)||meta.doors.some(p=>p[0]===x&&p[1]===y);}
  function rect(g,x,y,w,h,color){g.fillStyle=color;g.fillRect(x,y,w,h);}
  function gradientLight(g,x,y,r,hue){const grad=g.createRadialGradient(x,y,2,x,y,r);grad.addColorStop(0,hue);grad.addColorStop(1,'#ffffff00');g.fillStyle=grad;g.beginPath();g.arc(x,y,r,0,7);g.fill();}

  // V16: complete architectural tilemap redraw, not a color filter on the old map.
  // All fixture rectangles, hotspots and doorway coordinates match cinema.js.
  const architecture={
    lobby:[['sofa',2,7,4,2],['sofa',14,7,4,2],['table',3,10,2,2],['table',15,10,2,2],['plant',2,17,2,2],['plant',16,17,2,2],['desk',8,14,4,2],['poster',2,4,2,2],['poster',16,4,2,2]],
    ticket:[['counter',2,7,12,2],['cabinet',2,4,3,2],['console',10,4,3,2],['chair',7,4,1,1],['plant',2,12,2,2]],
    office:[['desk',7,7,5,2],['chair',9,5,1,1],['cabinet',2,4,3,2],['printer',13,4,2,2],['cabinet',13,10,2,4],['sofa',2,12,4,2],['plant',2,8,2,2]],
    theatre:[['screen',3,3,14,2],['seats',2,7,6,2],['seats',12,7,6,2],['seats',2,10,6,2],['seats',12,10,6,2],['seats',2,13,6,2],['seats',12,13,6,2],['podium',9,5,2,1]],
    projection:[['console',2,5,14,2],['projector',3,10,3,3],['projector',12,10,3,3],['cabinet',2,14,3,2]],
    archive:[['shelf',2,4,5,2],['shelf',11,4,5,2],['shelf',2,8,5,2],['shelf',11,8,5,2],['shelf',2,12,5,2],['shelf',11,12,5,2],['boxes',8,13,2,2]],
    storage:[['shelf',2,4,5,2],['shelf',11,4,5,2],['shelf',2,8,5,2],['shelf',11,8,5,2],['boxes',2,13,4,3],['generator',11,13,4,3]],
    workshop:[['breaker',2,4,4,2],['generator',11,4,4,4],['workbench',2,10,13,2],['tools',2,14,4,2]]
  };
  const themes={
    lobby:{floor:'#b6ada1',tile:'#a2998b',join:'#857b73',wall:'#44343b',trim:'#b58b55',glow:'#ffcf86'},
    ticket:{floor:'#a79882',tile:'#bbad96',join:'#7e6b59',wall:'#48352d',trim:'#cd9f62',glow:'#ffd08c'},
    office:{floor:'#735442',tile:'#85634a',join:'#3c2c2c',wall:'#35404b',trim:'#b49468',glow:'#ffd09d'},
    theatre:{floor:'#32262d',tile:'#402834',join:'#231d28',wall:'#241d26',trim:'#b67b57',glow:'#ffd6a5'},
    projection:{floor:'#35434a',tile:'#44535a',join:'#243239',wall:'#222e3a',trim:'#8bafb7',glow:'#a8dcdb'},
    archive:{floor:'#75604c',tile:'#81674e',join:'#3a2e2a',wall:'#383633',trim:'#bda36a',glow:'#e6c38c'},
    storage:{floor:'#354147',tile:'#414e54',join:'#27353b',wall:'#252d36',trim:'#95a3a2',glow:'#bedbca'},
    workshop:{floor:'#3b4249',tile:'#495158',join:'#2c333a',wall:'#30343b',trim:'#c2a26d',glow:'#d7bd83'}
  };
  const pixel=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
  function textTile(g,text,x,y,size=11,color='#f3dfb3') {g.fillStyle='#10131a';g.font=`bold ${size}px sans-serif`;g.textAlign='center';g.fillText(text,x+1,y+1);g.fillStyle=color;g.fillText(text,x,y);}
  function outline(g,x,y,w,h,base,hi='#e3c699',lo='#22232b'){
    pixel(g,x,y,w,h,'#151821');pixel(g,x+2,y+2,w-4,h-4,base);
    pixel(g,x+3,y+2,w-6,2,hi);pixel(g,x+2,y+h-5,w-4,3,lo);
    pixel(g,x+2,y+2,2,h-5,hi);pixel(g,x+w-5,y+2,3,h-5,lo);
  }
  function circle(g,x,y,r,color){g.fillStyle=color;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();}
  function light(g,x,y,r,color){const grad=g.createRadialGradient(x,y,1,x,y,r);grad.addColorStop(0,color);grad.addColorStop(1,'#ffffff00');g.fillStyle=grad;g.fillRect(x-r,y-r,2*r,2*r);}
  // Larger continuous surfaces rather than alternating 32px checkerboard squares.
  function floorTile(g,id,x,y,p){
    const X=x*32,Y=y*32;
    if(id==='lobby'||id==='ticket'){
      const variations=['#b4ac9d','#b8aea1','#b6ac9e','#b3aa9c'];
      pixel(g,X,Y,32,32,variations[(Math.floor(x/3)+Math.floor(y/3))%4]);
      if(x%3===0)pixel(g,X,Y,1,32,'#776d6542');
      if(y%3===0)pixel(g,X,Y,32,1,'#776d6542');
      if(id==='lobby'&&x>=7&&x<=12&&y>=5&&y<=19){
        pixel(g,X,Y,32,32,'#713842');
        if(x===7){pixel(g,X,Y,4,32,'#c9a676');pixel(g,X+5,Y,1,32,'#e3c89988');}
        if(x===12){pixel(g,X+28,Y,4,32,'#c9a676');pixel(g,X+26,Y,1,32,'#e3c89988');}
        if(y%3===1){pixel(g,X+5,Y+15,22,1,'#da8b7742');}
      }else if(y>3 && (x+y*3)%19===0){pixel(g,X+4,Y+21,19,1,'#e9e2d333');}
    }else if(id==='theatre'){
      pixel(g,X,Y,32,32,'#36242d');
      if(x>=8&&x<=11&&y>=5&&y<=18){pixel(g,X,Y,32,32,'#703944');if(x===8)pixel(g,X,Y,4,32,'#ac795e');if(x===11)pixel(g,X+28,Y,4,32,'#ac795e');}
      if((y%5)===0)pixel(g,X,Y+4,32,1,'#a9777930');
    }else if(id==='office'||id==='archive'){
      pixel(g,X,Y,32,32,(y%3===0?'#765944':'#70533f'));
      if(y%3===0)pixel(g,X,Y,32,2,'#291e183c');
      if((x*7+y)%8===0){pixel(g,X+4,Y+9,25,1,'#d9b68a1e');}
    }else{
      pixel(g,X,Y,32,32,p.floor);
      if(x%4===0)pixel(g,X,Y,1,32,'#15242d35');
      if(y%4===0)pixel(g,X,Y,32,1,'#15242d35');
      if(id==='workshop'&&x>6&&x<11&&y>6&&y%3===0){pixel(g,X,Y+27,32,3,'#aa986651');}
      if((x*13+y*7)%11===0)pixel(g,X+13,Y+12,14,1,'#c1ced01c');
    }
  }
  function wallTile(g,id,x,y,r,p){
    const X=x*32,Y=y*32;
    if(y<3){
      if(y===0){pixel(g,X,Y,32,32,'#141b25');for(let k=0;k<4;k++)pixel(g,X+k*8,Y+2,1,26,'#25303a');pixel(g,X,Y+26,32,5,p.trim);return;}
      if(y===1){pixel(g,X,Y,32,32,p.wall);pixel(g,X,Y,32,3,p.trim);pixel(g,X,Y+28,32,3,'#0b111b');if(x%3===1){pixel(g,X+7,Y+5,18,20,'#272b34');pixel(g,X+9,Y+7,14,16,'#513a37');pixel(g,X+11,Y+9,10,12,'#af8660');}return;}
      pixel(g,X,Y,32,32,'#33313a');pixel(g,X,Y+2,32,3,'#b89564');pixel(g,X+2,Y+8,28,16,'#242832');pixel(g,X,Y+27,32,5,'#1b202a');return;
    }
    pixel(g,X,Y,32,32,'#18202b');pixel(g,X+2,Y,28,32,p.wall);pixel(g,X+2,Y,4,32,'#79685c');pixel(g,X+25,Y,4,32,'#191c25');
    if(y%3===0)pixel(g,X+6,Y+2,19,2,p.trim);
    if(y===r.h-1){pixel(g,X,Y,32,32,'#3b3135');pixel(g,X,Y,32,4,p.trim);pixel(g,X,Y+7,32,3,'#1d1a24');}
  }
  // Architectural continuous wall with inset paneling, pilasters and sconces.
  function wallDecor(g,id,r,p){
    const W=r.w*32,inner=W-64;
    const surface=g.createLinearGradient(0,2,0,110);
    surface.addColorStop(0,'#151b26');surface.addColorStop(.12,p.wall);
    surface.addColorStop(.75,p.wall);surface.addColorStop(1,'#202129');
    g.fillStyle=surface;g.fillRect(32,0,inner,108);
    const trim=g.createLinearGradient(0,0,0,17);
    trim.addColorStop(0,'#f5d8a6');trim.addColorStop(.3,p.trim);trim.addColorStop(1,'#564438');
    g.fillStyle=trim;g.fillRect(32,14,inner,10);
    pixel(g,32,4,inner,6,'#111923');
    pixel(g,32,29,inner,3,'#14191f');
    for(let x=1;x<r.w-1;x++){
      const X=x*32;
      // Flat rectangles are replaced by long, contiguous wainscoting panels.
      if(x%3===1){
        g.fillStyle='#0b151c4a';g.fillRect(X+7,40,83,54);
        g.strokeStyle='#bd9c674e';g.lineWidth=2;g.strokeRect(X+9,42,80,51);
        g.fillStyle='#a7895630';g.fillRect(X+13,45,72,5);
      }
      if(x%5===1){
        const column=g.createLinearGradient(X+3,0,X+19,0);
        column.addColorStop(0,'#2f2c30');column.addColorStop(.25,'#b99a6b');
        column.addColorStop(.5,'#8b744f');column.addColorStop(1,'#29282f');
        g.fillStyle=column;g.fillRect(X+2,28,16,79);
        pixel(g,X-1,28,22,5,'#ceae7a');pixel(g,X-1,100,22,7,'#6a503e');
      }
    }
    // Wall sconces have a gentle halo, not a hard square edge.
    for(let x=2;x<r.w-2;x+=5){
      const X=x*32+16;
      light(g,X,66,40,'#f4c77d60');
      outline(g,X-6,59,12,19,'#987342','#efd49d','#554637');
      circle(g,X,64,5,'#ffdfa0');
    }
    pixel(g,32,108,inner,4,p.trim);
    pixel(g,32,112,inner,3,'#191921');
    for(let y=4;y<r.h-1;y++){
      const Y=y*32;
      for(const X of [6,W-24]){
        pixel(g,X,Y,15,32,p.wall);
        pixel(g,X,Y,3,32,'#c7a26a');
        pixel(g,X+4,Y,2,32,'#f5e0b12d');
        pixel(g,X+13,Y,2,32,'#141923');
      }
    }
    const titles={lobby:'E U N H A    C I N E M A',ticket:'BOX  OFFICE',office:'MANAGEMENT',theatre:'SCREEN   01',projection:'PROJECTION  ROOM',archive:'FILM ARCHIVE',storage:'EQUIPMENT  B1',workshop:'MAINTENANCE'};
    const label=titles[id]||'EUNHA CINEMA';
    const width=Math.min(W-118,g.measureText(label).width+48);
    g.fillStyle='#141923';g.fillRect((W-width)/2,48,width,38);
    g.strokeStyle='#c5a475';g.lineWidth=1.5;g.strokeRect((W-width)/2+2,50,width-4,34);
    textTile(g,label,W/2,72,id==='lobby'?14:12,'#edcfa0');
    if(id==='lobby'){
      for(const xx of [2,16]){
        const X=xx*32;
        outline(g,X+5,4*32+2,52,58,'#403b46','#dbba79');
        const poster=g.createLinearGradient(X+9,4*32+9,X+44,4*32+54);
        poster.addColorStop(0,'#344e60');poster.addColorStop(1,'#171e2a');
        g.fillStyle=poster;g.fillRect(X+11,4*32+8,40,44);
        circle(g,X+30,4*32+19,9,'#d2ac72');
        pixel(g,X+18,4*32+33,24,11,'#9a4c54');textTile(g,'잔 상',X+31,4*32+55,9);
      }
    }
  }
  function prop(g,id,o){
    const [kind,x,y,tw,th]=o,X=x*32,Y=y*32,W=tw*32,H=th*32;
    // Grounding shadow inside original solid tile footprint.
    pixel(g,X+3,Y+7,W-3,H-7,'#080d16b0');
    const cabinet=(c='#604735')=>{outline(g,X+2,Y+2,W-4,H-7,c,'#c3a273','#2a2529');for(let k=1;k<Math.max(2,Math.floor(W/32));k++){const a=X+k*32;pixel(g,a,Y+11,2,H-22,'#372d2c');pixel(g,a-12,Y+19,5,3,'#d4bd86');}};
    if(kind==='sofa'){
      outline(g,X+2,Y+4,W-4,H-7,'#602b37','#c18477','#211b24');
      pixel(g,X+7,Y+7,W-14,17,'#9c5160');pixel(g,X+7,Y+27,W-14,H-38,'#7e3646');
      for(let q=1;q<4;q++){pixel(g,X+q*(W-14)/4+5,Y+29,2,H-42,'#47262e');pixel(g,X+q*(W-14)/4+7,Y+32,1,H-44,'#b67269');}
      pixel(g,X+2,Y+12,8,H-22,'#572733');pixel(g,X+W-11,Y+12,8,H-22,'#572733');
    }else if(kind==='table'){
      outline(g,X+4,Y+4,W-8,H-12,'#623f36','#dfb477','#252735');outline(g,X+8,Y+8,W-16,H-20,'#85604e','#d2a371');
      pixel(g,X+W/2-4,Y+15,8,11,'#d6c2a8');pixel(g,X+W/2-8,Y+15,16,2,'#e7dec7');
    }else if(kind==='plant'){
      pixel(g,X+W/2-10,Y+H-21,20,15,'#9b6d4b');pixel(g,X+W/2-12,Y+H-21,24,4,'#cf9d66');
      for(const [dx,dy] of [[-14,-26],[7,-32],[-2,-44],[15,-23],[-20,-39]]){circle(g,X+W/2+dx,Y+H/2+dy,13,'#203f36');circle(g,X+W/2+dx-2,Y+H/2+dy-3,8,'#4e7760');circle(g,X+W/2+dx-4,Y+H/2+dy-6,4,'#719779');}
    }else if(kind==='desk'||kind==='counter'||kind==='workbench'){
      outline(g,X+2,Y+3,W-4,H-7,id==='projection'?'#465e64':'#68463b','#d6b486','#2d2429');
      pixel(g,X+5,Y+8,W-10,14,'#c79d6a');pixel(g,X+5,Y+25,W-10,H-35,'#613f36');
      for(let b=0;b<Math.max(1,tw-1);b++){pixel(g,X+10+b*32,Y+H-23,21,12,'#483337');pixel(g,X+20+b*32,Y+H-19,4,2,'#e1c391');}
      if(kind==='counter'){textTile(g,'TICKET  SERVICE',X+W/2,Y+39,12);for(let k=1;k<tw-1;k+=3){pixel(g,X+k*32,Y+9,19,12,'#264850');pixel(g,X+k*32+3,Y+11,13,6,'#9cc4b7');}}
      if(kind==='workbench'){for(let k=1;k<tw;k+=2){pixel(g,X+k*32,Y+9,17,5,'#b9c0ba');pixel(g,X+k*32+3,Y+10,3,8,'#202b31');}}
      if(kind==='desk'){pixel(g,X+W/2-20,Y+8,40,11,'#e1d5ad');pixel(g,X+W/2-13,Y+11,26,2,'#8c7b63');}
    }else if(kind==='poster'){
      outline(g,X+3,Y+1,W-6,H-7,'#b18858','#e3c690','#161e29');pixel(g,X+8,Y+7,W-16,H-18,'#283b4e');
      circle(g,X+W/2,Y+18,11,'#e4b878');pixel(g,X+12,Y+34,W-24,8,'#a34f5d');textTile(g,'2042',X+W/2,Y+H-18,11);
    }else if(kind==='screen'){
      pixel(g,X-1,Y+3,W+2,H-4,'#441e2d');for(const xx of [X+3,X+W-19]){for(let k=0;k<5;k++)pixel(g,xx+k*3,Y+2,3,H-3,k%2?'#6e3049':'#a44c5c');}
      outline(g,X+17,Y+2,W-34,H-7,'#d8cfc0','#fff3e2','#4b5061');
      pixel(g,X+25,Y+10,W-50,H-26,'#b1adab');pixel(g,X+25,Y+12,W-50,8,'#c9c3b8');textTile(g,'THE LAST SCREENING',X+W/2,Y+H-16,13,'#272935');
    }else if(kind==='seats'){
      for(let i=0;i<tw;i++){
        const px=X+i*32;
        outline(g,px+2,Y+5,28,H-10,'#5a2335','#b06867','#241b28');
        pixel(g,px+5,Y+9,22,22,'#aa4256');pixel(g,px+7,Y+11,18,17,'#c2676a');
        pixel(g,px+4,Y+35,24,20,'#7f2b40');pixel(g,px+9,Y+39,14,12,'#ad4158');
        pixel(g,px+1,Y+27,5,25,'#3a1c2c');pixel(g,px+26,Y+27,5,25,'#3a1c2c');
        pixel(g,px+9,Y+55,14,3,'#cf9f6d');
      }
    }else if(kind==='podium'){
      outline(g,X+9,Y+2,W-18,H-5,'#5e342e','#deb579','#211e25');pixel(g,X+W/2-2,Y+7,4,20,'#dbb378');
    }else if(kind==='console'){
      outline(g,X+3,Y+2,W-6,H-7,'#273941','#8bb4ac','#101e29');pixel(g,X+7,Y+6,W-14,17,'#526e72');
      for(let k=0;k<tw;k++){const xx=X+k*32+7;pixel(g,xx,Y+8,19,14,'#182e36');pixel(g,xx+2,Y+10,15,7,k%2?'#90baa9':'#77a6af');pixel(g,xx+6,Y+31,5,3,'#d1b277');circle(g,xx+18,Y+34,2,'#dd8c6b');}
      pixel(g,X+7,Y+H-16,W-14,6,'#243944');
    }else if(kind==='projector'){
      outline(g,X+3,Y+H-39,W-6,31,'#3c4e59','#9ab9b6','#1d2934');pixel(g,X+12,Y+38,W-24,H-80,'#42515b');
      for(const xc of [X+W*.28,X+W*.72]){
        circle(g,xc,Y+37,17,'#0d1a24');circle(g,xc,Y+37,14,'#8ca4a5');circle(g,xc,Y+37,9,'#293b42');
        for(let t=0;t<6;t++){const a=t*Math.PI/3;circle(g,xc+Math.cos(a)*9,Y+37+Math.sin(a)*9,3,'#cad2ba');}
        circle(g,xc,Y+37,3,'#dfc995');
      }
      pixel(g,X+W/2-9,Y+H-34,18,9,'#b7c0b5');circle(g,X+W/2,Y+H-28,4,'#ffd990');
    }else if(kind==='shelf'||kind==='cabinet'){
      cabinet(id==='archive'?'#65513f':id==='storage'?'#3f535a':'#5d4b40');
      if(kind==='shelf')for(let j=0;j<2;j++){const yy=Y+9+j*21;for(let k=0;k<Math.floor((W-10)/16);k++){const xx=X+7+k*16;const cc=['#a87e59','#394c56','#915459','#ba9c6c','#657879'][k%5];pixel(g,xx,yy,13,16,cc);pixel(g,xx+2,yy+3,9,1,'#e0cdaa');if(k%3===0)circle(g,xx+6,yy+10,3,'#dbcda2');}pixel(g,X+4,yy+17,W-8,4,'#2d2a2c');}
    }else if(kind==='chair'){
      outline(g,X+4,Y+3,W-8,H-6,'#4f3139','#a86a62');pixel(g,X+9,Y+8,W-18,H-18,'#763b49');
    }else if(kind==='printer'){
      outline(g,X+4,Y+16,W-8,H-19,'#a8aca5','#eff0d5','#5b646a');pixel(g,X+12,Y+7,W-24,17,'#dbd7c3');pixel(g,X+13,Y+12,W-26,2,'#535b64');pixel(g,X+9,Y+H-19,W-18,4,'#394c51');
    }else if(kind==='boxes'){
      for(let yy=0;yy<th;yy++)for(let xx=0;xx<tw;xx++){const bx=X+xx*32+3,by=Y+yy*32+3;outline(g,bx,by,26,25,(xx+yy)%2?'#8d7351':'#937653','#d0ad74','#4a332d');pixel(g,bx+10,by+4,6,11,'#cfb18a');pixel(g,bx+3,by+13,20,2,'#624b3c');}
    }else if(kind==='generator'){
      outline(g,X+3,Y+4,W-6,H-10,'#3e555c','#9aabb0','#17262e');pixel(g,X+9,Y+12,W-18,21,'#1d3039');
      for(let k=0;k<tw;k++){pixel(g,X+12+k*31,Y+10,15,7,k%2?'#adbdba':'#5a7a7c');circle(g,X+19+k*31,Y+H/2,9,'#202c36');circle(g,X+19+k*31,Y+H/2,4,'#95a49f');}
      pixel(g,X+8,Y+H-19,W-16,7,'#c99d54');for(let k=0;k<tw*2;k++)pixel(g,X+13+k*14,Y+H-19,6,7,'#30343a');
    }else if(kind==='breaker'){
      outline(g,X+3,Y+4,W-6,H-9,'#485862','#b5c0b8','#222b33');for(let k=0;k<tw;k++){pixel(g,X+7+k*32,Y+8,26,36,'#263c44');pixel(g,X+13+k*32,Y+15,14,6,'#aab8ad');pixel(g,X+17+k*32,Y+28,6,11,'#dfac63');}
    }else if(kind==='tools'){
      outline(g,X+2,Y+3,W-4,H-7,'#655341','#b39568','#2d3137');for(let k=0;k<tw;k++){const xx=X+k*32+10;pixel(g,xx,Y+12,3,35,'#b9c1b9');pixel(g,xx-5,Y+9,12,6,'#c1b9a1');pixel(g,xx+10,Y+19,3,21,'#c1c3b1');}
    }else cabinet();
  }
  function decorate(g,id,r,p){
    const W=r.w*32,H=r.h*32;
    if(id==='lobby'){
      for(const x of [7,12])for(let y=5;y<20;y+=2){circle(g,x*32+(x===7?7:25),y*32+17,2,'#efbd79');}
      for(const [x,y] of [[2,6],[17,6],[2,19],[17,19]])light(g,x*32,y*32,59,'#ffd49125');
      textTile(g,'RED CARPET',W/2,19*32+21,11);
    }else if(id==='theatre'){
      light(g,W/2,6*32,144,'#f7e7c532');
      for(let y=7;y<18;y+=2)for(const x of [1,18]){circle(g,x*32+16,y*32+16,3,'#ffd083');light(g,x*32+16,y*32+16,24,'#f6bd4c50');}
    }else if(id==='projection'){
      // Large projection lens and narrow light ribbon connecting console to film reels.
      light(g,W/2,10*32,104,'#86d6e022');
      pixel(g,8*32+11,9*32+12,13,2,'#92c7d9a8');
      pixel(g,9*32+3,9*32+12,14,2,'#92c7d968');
    }else if(id==='archive'){
      for(let y=6;y<15;y+=3)for(const x of [7,10]){pixel(g,x*32+9,y*32,10,5,'#d0b278');pixel(g,x*32+12,y*32+1,4,2,'#7c6050');}
    }else if(id==='ticket'){
      textTile(g,'ADMIT ONE',W/2,10*32+16,12,'#e5c18a');
      for(let x=6;x<=9;x++)pixel(g,x*32+13,12*32+15,14,2,'#d8ad7e');
    }else if(id==='storage'||id==='workshop'){
      for(let x=1;x<r.w-1;x+=4)for(let y=4;y<r.h-2;y+=6){pixel(g,x*32+10,y*32+28,20,2,'#d4b36166');pixel(g,x*32+18,y*32+22,3,10,'#30343c');}
      light(g,W/2,H/2,166,'#b7ddb81e');
    }else light(g,W/2,H/2,150,'#f1c38b15');
    // Ambient occlusion along room boundaries; soft pools of light connect tiles.
    const sideShadow=g.createLinearGradient(0,0,W,0);
    sideShadow.addColorStop(0,'#050a14b0');sideShadow.addColorStop(.085,'#04081100');
    sideShadow.addColorStop(.915,'#04081100');sideShadow.addColorStop(1,'#050a14b0');
    g.fillStyle=sideShadow;g.fillRect(0,116,W,H-116);
    for(const xx of [W*.27,W*.73]){
      light(g,xx,178,id==='theatre'?140:110,id==='theatre'?'#ffaf7340':'#e6bf8040');
    }
    const shade=g.createLinearGradient(0,0,0,H);shade.addColorStop(0,'#1e293b16');shade.addColorStop(.72,'#00000000');shade.addColorStop(1,'#00071236');g.fillStyle=shade;g.fillRect(0,0,W,H);
  }
  // Front-elevation wooden doors, recessed jambs and cast shadows.
  // Geometry and action triggers stay on their original single tiles.
  function drawDoor(g,id,r,d){
    const [x,y]=d,X=x*32,Y=y*32,p=themes[id];
    const nearTop=y<=3,nearBottom=y>=r.h-1,side=!nearTop&&!nearBottom;
    const center=X+16;
    const top=nearTop?Y-43:nearBottom?Y-40:Y-27;
    const height=side?61:72;
    const width=side?39:47;
    const left=center-width/2;
    g.save();
    g.shadowColor='#080a14a6';g.shadowBlur=12;g.shadowOffsetY=8;
    g.fillStyle='#1b151e';g.fillRect(left-4,top-5,width+8,height+9);
    g.restore();
    const surround=g.createLinearGradient(left,top,left+width,top);
    surround.addColorStop(0,'#4d322b');surround.addColorStop(.16,'#e4bf83');
    surround.addColorStop(.46,'#8e6347');surround.addColorStop(.85,'#ba8b5c');surround.addColorStop(1,'#3f2b2a');
    g.fillStyle=surround;g.fillRect(left-3,top-4,width+6,height+4);
    pixel(g,left-7,top-6,width+14,7,p.trim);
    pixel(g,left-7,top-7,width+14,2,'#edcf9d');
    const recess=g.createLinearGradient(left,top,left+width,top+height);
    recess.addColorStop(0,'#151720');recess.addColorStop(.65,'#25232b');recess.addColorStop(1,'#0d1019');
    g.fillStyle=recess;g.fillRect(left+4,top+4,width-8,height-7);
    const wood=g.createLinearGradient(left+7,top,left+width-7,top);
    wood.addColorStop(0,'#4b2c2c');wood.addColorStop(.28,'#a06b4b');
    wood.addColorStop(.65,'#754533');wood.addColorStop(1,'#36232c');
    g.fillStyle=wood;g.fillRect(left+7,top+8,width-14,height-15);
    g.strokeStyle='#c79b69';g.lineWidth=1.5;
    const panelWidth=width-22;
    for(const [py,ph] of [[top+14,17],[top+37,22]]){
      g.strokeRect(left+11,py,panelWidth,ph);
      g.fillStyle='#edc39724';g.fillRect(left+13,py+2,panelWidth-4,4);
      pixel(g,left+13,py+ph-4,panelWidth-4,2,'#271a1b60');
    }
    circle(g,left+width-12,top+46,3.5,'#f0d08e');
    circle(g,left+width-12,top+46,1.3,'#805533');
    pixel(g,left+7,top+height-10,width-14,3,'#211b22');
    pixel(g,left-4,top+height-2,width+8,4,'#9d7853');
    const sign=nearTop?'SCREEN':side?'STAIRS':'EXIT';
    g.font='bold 7px system-ui,sans-serif';g.textAlign='center';
    g.fillStyle='#f6dcae';g.fillText(sign,center,top+2);
    // Subtle lit threshold, not a yellow square covering an entire tile.
    light(g,center,Y+20,25,'#e4c37b38');
    pixel(g,X+9,Y+30,14,2,'#e8c389');
  }
  function makeSceneCanvas(original,id){
    const r=rooms[id],p=themes[id],c=document.createElement('canvas');
    c.width=r.w*32;c.height=r.h*32;
    const g=c.getContext('2d');g.imageSmoothingEnabled=false;
    for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++){
      if(x===0||x===r.w-1||y<3||y===r.h-1)wallTile(g,id,x,y,r,p);
      else floorTile(g,id,x,y,p);
    }
    wallDecor(g,id,r,p);
    for(const o of architecture[id])prop(g,id,o);
    decorate(g,id,r,p);
    for(const d of r.doors)drawDoor(g,id,r,d);
    return c;
  }
  // Cosmetic renderer hook: does not touch the integer collision grid or network positions.
  // It interpolates only the local character sprite over 218ms, while all game actions
  // continue using the original engine's authoritative grid coordinates.
  const nativeDraw=CanvasRenderingContext2D.prototype.drawImage;
  const decorated=new WeakMap();
  const camera={scene:null,ox:0,oy:0,tile:36,awaitOwn:false};
  const motion={scene:null,x:0,y:0,fromX:0,fromY:0,toX:0,toY:0,start:0,duration:218,steps:0};
  function clamp01(v){return Math.max(0,Math.min(1,v));}
  function smoothStep(v){const t=clamp01(v);return t*t*(3-2*t);}
  function easePosition(now){
    const p=smoothStep((now-motion.start)/motion.duration);
    return {x:motion.fromX+(motion.toX-motion.fromX)*p,y:motion.fromY+(motion.toY-motion.fromY)*p};
  }
  function localMotion(st,now){
    if(motion.scene!==st.f||Math.abs(motion.toX-st.x)>1.1||Math.abs(motion.toY-st.y)>1.1){
      Object.assign(motion,{scene:st.f,x:st.x,y:st.y,fromX:st.x,fromY:st.y,toX:st.x,toY:st.y,start:now,steps:0});
      return {x:st.x,y:st.y};
    }
    if(motion.toX!==st.x||motion.toY!==st.y){
      const cur=easePosition(now);
      motion.fromX=cur.x;motion.fromY=cur.y;
      motion.toX=st.x;motion.toY=st.y;
      motion.start=now;motion.steps++;
    }
    const current=easePosition(now);motion.x=current.x;motion.y=current.y;
    return current;
  }
  CanvasRenderingContext2D.prototype.drawImage=function(source,...args){
    // Apply the v17 environment canvas only to the main game background.
    if(this.canvas?.id==='view'&&source instanceof HTMLCanvasElement&&args.length===4&&source.width>=480&&source.height>=480&&source.width%32===0&&source.height%32===0){
      const id=sceneFor(source);
      if(id){
        let item=decorated.get(source);
        if(!item||item.id!==id){item={id,canvas:makeSceneCanvas(source,id)};decorated.set(source,item);}
        camera.scene=id;camera.ox=args[0];camera.oy=args[1];
        camera.tile=32*args[2]/source.width;camera.awaitOwn=true;
        return nativeDraw.call(this,item.canvas,...args);
      }
    }
    // The engine draws the local avatar immediately after the background and hotspot markers.
    // Other players use the original multiplayer renderer unchanged.
    if(this.canvas?.id==='view'&&camera.awaitOwn&&source instanceof HTMLCanvasElement&&source.width===32&&source.height===48&&args.length===8){
      camera.awaitOwn=false;
      const st=window.TG_state?.();
      if(st&&st.f===camera.scene&&Number.isFinite(st.x)&&Number.isFinite(st.y)){
        const now=performance.now(),pos=localMotion(st,now),tile=camera.tile;
        const walking=Math.hypot(motion.toX-pos.x,motion.toY-pos.y)>.02;
        const bob=walking?Math.sin((now-motion.start)/motion.duration*Math.PI*2)*tile*.012:0;
        const destX=camera.ox+(pos.x+.5)*tile-args[6]/2;
        const destY=camera.oy+(pos.y+1)*tile-args[7]+bob;
        return nativeDraw.call(this,source,args[0],args[1],args[2],args[3],destX,destY,args[6],args[7]);
      }
    }
    return nativeDraw.call(this,source,...args);
  };

  const floorOf = id => ({lobby:'1F',ticket:'1F',office:'1F',theatre:'1F',projection:'2F',archive:'2F',storage:'B1',workshop:'B1'})[id]||'1F';
  const diagrams={
    '1F':[{id:'theatre',x:111,y:26,w:220,h:103,sub:'SCREEN 01'}, {id:'lobby',x:113,y:167,w:216,h:150,sub:'FOYER / LOUNGE'}, {id:'ticket',x:16,y:365,w:183,h:99,sub:'BOX OFFICE'}, {id:'office',x:239,y:365,w:183,h:99,sub:'OFFICE'}],
    '2F':[{id:'projection',x:23,y:139,w:188,h:191,sub:'PROJECTION'}, {id:'archive',x:231,y:139,w:188,h:191,sub:'ARCHIVE'}],
    'B1':[{id:'storage',x:23,y:139,w:188,h:191,sub:'STORAGE'}, {id:'workshop',x:231,y:139,w:188,h:191,sub:'WORKSHOP'}]
  };
  function routeSvg(floor){
    const gold='#bd9a65',path=(d)=>`<path d="${d}" stroke="${gold}" stroke-width="4" fill="none" stroke-dasharray="7 7" stroke-linecap="round"/>`;
    if(floor==='1F')return path('M221 128 V167')+path('M221 317 V345 H108 V365')+path('M221 345 H331 V365')+`<g fill="#d8bc8a"><circle cx="221" cy="145" r="5"/><circle cx="221" cy="345" r="5"/></g>`;
    return path('M211 239 H231')+`<circle cx="221" cy="239" r="5" fill="#d8bc8a"/>`;
  }
  function mapSvg(floor){
    const current=window.TG_state?.().f||'lobby';
    const icon={theatre:'◉',lobby:'✦',ticket:'▤',office:'▣',projection:'◎',archive:'▥',storage:'▦',workshop:'⚙'};
    const roomsSvg=diagrams[floor].map(r=>{
      const active=current===r.id;
      return `<g><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="8" fill="${active?'#66433f':'#213047'}" stroke="${active?'#f6d79a':'#978060'}" stroke-width="${active?'4':'2'}"/><rect x="${r.x+6}" y="${r.y+6}" width="${r.w-12}" height="${r.h-12}" rx="3" fill="none" stroke="#d4b58155" stroke-width="1"/><text x="${r.x+r.w/2}" y="${r.y+Math.min(42,r.h*.33)}" font-size="${active?'26':'23'}" text-anchor="middle" fill="${active?'#ffe8ae':'#bea67e'}">${icon[r.id]}</text><text x="${r.x+r.w/2}" y="${r.y+Math.min(70,r.h*.64)}" font-family="sans-serif" font-weight="800" font-size="${r.w<190?'17':'19'}" text-anchor="middle" fill="#f5e9d6">${pretty[r.id]}</text><text x="${r.x+r.w/2}" y="${r.y+r.h-14}" font-size="10" letter-spacing="1.7" text-anchor="middle" fill="#d4bfa0">${active?'● 현재 위치':r.sub}</text></g>`;
    }).join('');
    const links=floor==='1F'?`<text x="18" y="266" fill="#d2c49d" font-size="13">◀ 2F 영사실</text><text x="315" y="266" fill="#d2c49d" font-size="13">B1 설비 ▶</text>`:`<text x="221" y="397" fill="#d2c49d" font-size="14" text-anchor="middle">↕ 로비 / 계단 이용</text>`;
    return `<svg viewBox="0 0 440 492" role="img" aria-label="${floor} 내부 공간 배치도"><defs><pattern id="floorgrid" width="21" height="21" patternUnits="userSpaceOnUse"><path d="M21 0H0V21" fill="none" stroke="#b6a07318" stroke-width="1"/></pattern></defs><rect width="440" height="492" fill="#101a2a"/><rect width="440" height="492" fill="url(#floorgrid)"/><rect x="10" y="10" width="420" height="472" rx="9" stroke="#7c6744" stroke-width="2" fill="none"/><text x="220" y="23" text-anchor="middle" fill="#e3c899" font-size="11" letter-spacing="2">EUNHA CINEMA  ·  ${floor} PLAN</text>${routeSvg(floor)}${roomsSvg}${links}</svg>`;
  }
  let currentFloor='1F';
  function showVisualMap(){
    const paper=$('paper');const title=paper?.querySelector('h2');
    if(!paper||!title||!title.textContent.includes('은하극장 안내도')||paper.dataset.lsMapV15==='yes')return;
    currentFloor=floorOf(window.TG_state?.().f);
    const summary=paper.querySelector('small');
    const old=[...paper.children].filter(node=>node!==title && !node.classList.contains('close') && node.id!=='sheetActions');
    for(const node of old)node.remove();
    const inner=document.createElement('div');inner.id='ls-v15-plan';
    inner.innerHTML=`<div class="ls-map-status">현재 위치: ${safe(pretty[window.TG_state?.().f]||'로비')} · ${safe(currentFloor)}</div><div class="ls-floors">${['1F','2F','B1'].map(f=>`<button data-floor="${f}" aria-selected="${f===currentFloor}">${f}</button>`).join('')}</div><div class="ls-map-frame" id="ls-v15-diagram">${mapSvg(currentFloor)}</div><p class="ls-map-bottom">현재 위치는 밝게 표시됩니다. 방은 출입문으로 이동하고, 층간 이동은 로비·영사실·설비창고 쪽 계단을 이용하세요. ※ 탐색용 개략 평면도입니다.</p>`;
    title.insertAdjacentElement('afterend',inner);
    for(const b of inner.querySelectorAll('[data-floor]'))b.addEventListener('click',()=>{
      currentFloor=b.dataset.floor;
      for(const q of inner.querySelectorAll('[data-floor]'))q.setAttribute('aria-selected',String(q===b));
      inner.querySelector('#ls-v15-diagram').innerHTML=mapSvg(currentFloor);
    });
    paper.dataset.lsMapV15='yes';
  }
  const paper=$('paper');
  if(paper){new MutationObserver(()=>{if(paper.dataset.lsMapV15==='yes' && !paper.querySelector('#ls-v15-plan'))delete paper.dataset.lsMapV15;showVisualMap();}).observe(paper,{childList:true});}
  // The header's original '안내도' button and the notebook's 안내도 action
  // both call the original overview(): we only replace its text body, so
  // the engine's modal state and close handlers remain authoritative.
  window.LS_CINEMA_V17={version:'eunha-cinema-map-v17',zoom:()=>window.TG_viewQA?.().zoom,designRooms:()=>Object.keys(rooms),renderRoom:(id)=>rooms[id]?makeSceneCanvas(null,id):null,motion:()=>({...motion}),mapOpen:()=>!!paper?.querySelector('#ls-v15-plan'),floor:()=>currentFloor};
})();
