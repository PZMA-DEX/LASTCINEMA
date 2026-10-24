/* EUNHA_JOYSTICK_VIEWPORT_V8 · Eunha Cinema · standalone scene engine. One renderer, one collision grid, one sprite scale. */
(()=>{'use strict';
const VERSION='eunha-cinema-artmap-v19b-20261024',TILE=32,SPRITE_SCALE=1.15,DIR={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]},D=window.TG_DATA;
const scenes={};
function scene(id,name,floor,w,h){return scenes[id]={id,name,floor,w,h,objects:[],spots:[],doors:[],spawn:{x:Math.floor(w/2),y:h-4}};}
const lobby=scene('lobby','로비','1F',20,22),ticket=scene('ticket','매표소','1F',16,17),office=scene('office','관리사무실','1F',17,18),theatre=scene('theatre','상영관 입구','1F',20,20),projection=scene('projection','영사실','2F',18,19),archive=scene('archive','기록보관실','2F',18,20),storage=scene('storage','설비창고','B1',18,20),workshop=scene('workshop','정비 작업실','B1',18,19);
function obj(s,type,x,y,w,h){s.objects.push({type,x,y,w,h});}
function spot(s,id,x,y,type){s.spots.push({id,x,y,type});}
function door(s,x,y,to,tx,ty,label){s.doors.push({x,y,to,tx,ty,label});}
function landing(s,x,y){if(y<=3)return{x,y:y+1};if(y>=s.h-1)return{x,y:y-1};if(x<=1)return{x:x+1,y};if(x>=s.w-2)return{x:x-1,y};return{x,y:y-1};}
function pair(a,x,y,b,bx,by,labelA,labelB){const p=landing(b,bx,by),q=landing(a,x,y);door(a,x,y,b.id,p.x,p.y,labelA);door(b,bx,by,a.id,q.x,q.y,labelB);}
// Every fixture below is also a solid collision footprint.
obj(lobby,'sofa',2,7,4,2);obj(lobby,'sofa',14,7,4,2);obj(lobby,'table',3,10,2,2);obj(lobby,'table',15,10,2,2);obj(lobby,'plant',2,17,2,2);obj(lobby,'plant',16,17,2,2);obj(lobby,'desk',8,14,4,2);obj(lobby,'poster',2,4,2,2);obj(lobby,'poster',16,4,2,2);
spot(lobby,'scene_c01',9,14,'document');spot(lobby,'scene_c02',15,4,'notice');spot(lobby,'scene_c08',4,10,'document');
obj(ticket,'counter',2,7,12,2);obj(ticket,'cabinet',2,4,3,2);obj(ticket,'console',10,4,3,2);obj(ticket,'chair',7,4,1,1);obj(ticket,'plant',2,12,2,2);spot(ticket,'scene_c06',3,4,'document');spot(ticket,'scene_c13',11,4,'monitor');
obj(office,'desk',7,7,5,2);obj(office,'chair',9,5,1,1);obj(office,'cabinet',2,4,3,2);obj(office,'printer',13,4,2,2);obj(office,'cabinet',13,10,2,4);obj(office,'sofa',2,12,4,2);obj(office,'plant',2,8,2,2);spot(office,'scene_c10',9,7,'object');spot(office,'scene_c11',11,12,'envelope');spot(office,'scene_c15',13,4,'printer');spot(office,'scene_c17',3,4,'document');
obj(theatre,'screen',3,3,14,2);for(const y of [7,10,13]){obj(theatre,'seats',2,y,6,2);obj(theatre,'seats',12,y,6,2);}obj(theatre,'podium',9,5,2,1);spot(theatre,'scene_c03',9,16,'document');
obj(projection,'console',2,5,14,2);obj(projection,'projector',3,10,3,3);obj(projection,'projector',12,10,3,3);obj(projection,'cabinet',2,14,3,2);spot(projection,'scene_c04',4,5,'monitor');spot(projection,'scene_c12',13,5,'monitor');spot(projection,'scene_c18',8,15,'card');spot(projection,'scene_c16',14,15,'notice');spot(projection,'bag_B',3,14,'bag');
for(const y of [4,8,12]){obj(archive,'shelf',2,y,5,2);obj(archive,'shelf',11,y,5,2);}obj(archive,'boxes',8,13,2,2);spot(archive,'scene_c07',4,4,'document');spot(archive,'scene_c14',13,4,'box');spot(archive,'bag_D',13,12,'bag');
for(const y of [4,8]){obj(storage,'shelf',2,y,5,2);obj(storage,'shelf',11,y,5,2);}obj(storage,'boxes',2,13,4,3);obj(storage,'generator',11,13,4,3);spot(storage,'scene_c05',4,4,'document');spot(storage,'bag_C',3,13,'bag');
obj(workshop,'breaker',2,4,4,2);obj(workshop,'generator',11,4,4,4);obj(workshop,'workbench',2,10,13,2);obj(workshop,'tools',2,14,4,2);spot(workshop,'scene_c09',8,10,'document');
spot(lobby,'bag_A',3,7,'bag');
pair(lobby,5,21,ticket,8,16,'매표소','로비');pair(lobby,14,21,office,8,17,'관리사무실','로비');pair(lobby,10,3,theatre,10,19,'상영관','로비');pair(lobby,1,15,projection,9,18,'2층 영사실','1층 로비');pair(lobby,18,15,storage,9,19,'지하 설비창고','1층 로비');pair(projection,15,18,archive,9,19,'기록보관실','영사실');pair(storage,14,19,workshop,9,18,'정비 작업실','설비창고');
// A single layout owns both artwork and collision; v18 replaces the original scene geometry.
if(window.EUNHA_LAYOUT_V18){
 const supplied=window.EUNHA_LAYOUT_V18.scenes||window.EUNHA_LAYOUT_V18.rooms||window.EUNHA_LAYOUT_V18;
 for(const [id,definition] of Object.entries(supplied)){
  if(!definition||!Number.isFinite(definition.w)||!Number.isFinite(definition.h))continue;
  scenes[id]={...definition,id,objects:(definition.objects||[]).map(o=>({...o})),spots:(definition.spots||[]).map(o=>({...o})),doors:(definition.doors||[]).map(o=>({...o})),spawn:{...(definition.spawn||{x:Math.floor(definition.w/2),y:definition.h-3})}};
 }
}
// Forward doors at the upper wall use a safe landing in the destination.
for(const s of Object.values(scenes)){s.grid=Array.from({length:s.h},(_,y)=>Array.from({length:s.w},(_,x)=>x<3||x>20||y<7||y>19?'#':'.'));for(const o of s.objects)for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++)if(s.grid[y]&&x>=0&&x<s.w)s.grid[y][x]='X';for(const p of s.spots)if(s.grid[p.y]&&p.x>=0&&p.x<s.w)s.grid[p.y][p.x]='X';for(const d of s.doors)if(s.grid[d.y]&&d.x>=0&&d.x<s.w)s.grid[d.y][d.x]='D';}
const spotIndex=Object.fromEntries(Object.values(scenes).flatMap(s=>s.spots.map(p=>[p.id,{...p,scene:s.id}])));
const cluesAt=id=>D.clues.filter(c=>c.spot===id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let opened=false,admin=false,modal=false,busy=false,zoom=3,lastMove=-Infinity,held=null,frame=0,px=0,py=0,canvasScale=1,offsetX=0,offsetY=0,ready=false;
let S={f:'lobby',x:scenes.lobby.spawn.x,y:scenes.lobby.spawn.y,dir:'down',role:1,phase:1,used:{1:0,2:0,3:0},got:{},seen:{},visited:{}};
// Linear time-based tile traversal: no acceleration reset, second easing layer, or key-repeat clock.
const STEP_MS=148,SAVE_MS=450,NETWORK_MS=175;
let step=null,lastTick=0,loopRequest=0,doorLatch=null,pendingInteraction=false,dirtySave=false,saveTimer=0,lastSaveAt=0,lastNetworkAt=0,externalInput=null;
let vignette=null,visibleSpots=[],visibleSpotsScene='',visibleSpotsAt=-Infinity;
const motionStats={frames:0,steps:0,blocked:0,doorTransitions:0,saves:0,networkEvents:0,maxFrameMs:0,drawMs:0,frameTimes:[]};
const root=document.createElement('div');root.id='tgHost';root.style.cssText='position:fixed;inset:0;z-index:9000;display:none;background:#10131b';document.body.appendChild(root);const shadow=root.attachShadow({mode:'open'});
shadow.innerHTML=`<style>
*{box-sizing:border-box} :host{font-family:system-ui,-apple-system,sans-serif;color:#f2e7cc}button{font:inherit;touch-action:none;cursor:pointer;color:inherit;background:#17202be8;border:1px solid #9e8559;border-radius:10px;padding:8px 11px}button:active{background:#70543b}button:disabled{opacity:.4}#game{position:absolute;inset:0;overflow:hidden;touch-action:none;background:#10131b}canvas{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated}#top{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;gap:8px;padding:9px 10px;background:linear-gradient(#080d16f0,#080d16b0,transparent);z-index:2}#title{flex:1;min-width:0;font-size:12px;color:#c7b88f;line-height:1.5}#title b{display:block;color:#f7dfac;font-size:15px}#top button{font-size:12px;padding:7px 9px}#status{position:absolute;top:62px;left:12px;font-size:11px;color:#d0c9b6;text-shadow:0 1px 3px #000}#hint{position:absolute;left:50%;bottom:110px;transform:translateX(-50%);font-size:12px;max-width:85%;padding:7px 12px;border-radius:20px;background:#0b121de0;white-space:nowrap;border:1px solid #847451}#pad{position:absolute;left:12px;bottom:max(12px,env(safe-area-inset-bottom));width:132px;height:94px}#pad button{position:absolute;width:42px;height:42px;padding:0;background:#121f2bd9;border-color:#64726e}#pad [data-dir=up]{left:45px;top:0}#pad [data-dir=down]{left:45px;top:48px}#pad [data-dir=left]{left:0;top:48px}#pad [data-dir=right]{left:90px;top:48px}#actions{position:absolute;right:12px;bottom:max(16px,env(safe-area-inset-bottom));display:flex;align-items:end;gap:9px}#inspect{width:72px;height:72px;border-radius:50%;font-weight:700;font-size:18px;background:#8c7041e8;border:2px solid #ddc896}#book{height:43px;font-size:13px}#sheet{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:#050a12aa;z-index:5;padding:14px}#sheet.open{display:flex}#paper{position:relative;max-width:600px;width:100%;max-height:85dvh;overflow:auto;padding:21px;background:#15202d;border:1px solid #ad8d59;border-radius:14px;box-shadow:0 15px 60px #0008}#paper h2{margin:0 25px 12px 0;font-size:19px;color:#efcf8e}#paper p{white-space:pre-wrap;line-height:1.85;font-size:14px;color:#e1ddcf}#paper small{color:#aab6bd}#paper .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}#paper .list{display:grid;gap:8px;margin-top:12px}#paper .list button{text-align:left}#paper .close{float:right;border:0;background:none;padding:0;font-size:22px}#paper .gold{color:#e7c889}#toast{position:absolute;top:95px;left:50%;transform:translateX(-50%);background:#ead3a4;color:#211c16;padding:10px 16px;border-radius:10px;max-width:85%;font-size:13px;z-index:8;display:none} @media(min-width:800px){#pad{left:25px;bottom:22px}#actions{right:25px;bottom:25px}#top{padding:12px 20px}#title b{font-size:17px}}
/* Cheongmyeong-style captured joystick; controls adapt to available phone space. */
#game{--joy-size:clamp(112px,32vmin,148px);--action-size:clamp(65px,18vmin,78px);--book-size:clamp(50px,14vmin,59px);isolation:isolate;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
#top{min-height:58px;align-items:center;padding:calc(env(safe-area-inset-top,0px) + 8px) max(10px,env(safe-area-inset-right)) 10px max(10px,env(safe-area-inset-left));gap:7px;flex-wrap:nowrap}
#title{line-height:1.45;overflow-wrap:anywhere}#title b{font-size:clamp(13px,3.7vw,17px)}
#top button{min-height:44px;min-width:44px;flex:0 0 auto;white-space:nowrap;padding:7px 9px;font-size:12px;touch-action:manipulation}
#status{top:auto;right:12px;font-size:11px;line-height:1.5;pointer-events:none}
#controls{position:absolute;z-index:3;left:0;right:0;bottom:0;display:flex;justify-content:space-between;align-items:flex-end;gap:16px;padding:16px max(14px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left));background:linear-gradient(transparent,#0b1721b8 32%,#0b1721e8);touch-action:none;pointer-events:none}
#joystick{width:var(--joy-size);height:var(--joy-size);position:relative;flex:0 0 var(--joy-size);border:1px solid #98ada866;border-radius:50%;background:radial-gradient(circle at 50% 46%,#5f777c22,#14283335 62%,#020a1055 76%);box-shadow:inset 0 0 0 2px #bdd2cf0f,inset 0 0 22px #02060d99,0 5px 16px #0005;touch-action:none;pointer-events:auto;outline:0;cursor:grab}
#joystick:before,#joystick:after{content:'';position:absolute;pointer-events:none;border:1px solid #9cb7b029;border-radius:50%;inset:12%}#joystick:after{inset:24%;border-color:#93aba426}
#joystick.active{border-color:#dac295;cursor:grabbing;box-shadow:inset 0 0 0 2px #c8b47d18,inset 0 0 22px #02060d99,0 5px 16px #0005}
#joyKnob{position:absolute;left:50%;top:50%;width:44%;height:44%;border-radius:50%;transform:translate(-50%,-50%);border:1px solid #bed2bf8c;background:radial-gradient(circle at 40% 30%,#bac5b18c,#5b77716b 55%,#264843a3);box-shadow:inset 0 2px 3px #f3f3d533,inset 0 -3px 5px #0b1a1e99,0 3px 8px #0008;pointer-events:none;will-change:transform}
#joyKnob:after{content:'';position:absolute;inset:15%;border-radius:50%;border:1px solid #cbd3c524}
#joystick .joy-label{position:absolute;bottom:5%;left:0;right:0;text-align:center;font-size:9px;letter-spacing:.2em;color:#b9c7b69c;pointer-events:none}
#actions{position:static;right:auto;bottom:auto;display:flex;align-items:center;gap:10px;flex:0 0 auto;pointer-events:auto;padding-bottom:7px}
#inspect{width:var(--action-size);height:var(--action-size);min-height:44px;padding:0;border-radius:50%;font-size:17px;color:#f1dfac;background:radial-gradient(circle at 35% 28%,#64716bd4,#344b49d9);border:1px solid #d3bd85;box-shadow:inset 0 1px 6px #dcd5b331,0 5px 12px #0007}
#book{width:var(--book-size);height:var(--book-size);min-height:44px;padding:0;border-radius:50%;font-size:14px;line-height:1.2;background:#344f4bd9;border:1px solid #8da691;box-shadow:inset 0 1px 5px #d6e0ce22,0 4px 11px #0007}
#actions small{display:block;font-size:10px;opacity:.55;line-height:1.1}
#hint{bottom:calc(var(--joy-size) + 44px + env(safe-area-inset-bottom));max-width:calc(100% - 28px);width:max-content;white-space:normal;text-align:center;line-height:1.5;font-size:12px;pointer-events:none;margin:0}
#sheet{padding:max(12px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left))}
#paper{max-height:100%;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;touch-action:pan-y}
#paper button{min-height:44px;touch-action:manipulation}
@media(max-width:370px){#top{gap:5px}#top button{padding:6px 7px;font-size:11px}#title{font-size:10px}#top #zoom{font-size:10px}#controls{gap:12px;padding-left:max(12px,env(safe-area-inset-left));padding-right:max(12px,env(safe-area-inset-right))}}
@media(max-height:500px) and (orientation:landscape){
 #game{--joy-size:90px;--action-size:63px;--book-size:49px}
 #top{min-height:51px;padding-top:calc(env(safe-area-inset-top,0px) + 5px);padding-bottom:6px}
 #top #title b{font-size:14px}#top #title{font-size:10px}#top button{min-height:44px;padding:6px 10px}
 #controls{padding-top:4px;padding-bottom:max(7px,env(safe-area-inset-bottom));padding-left:max(20px,env(safe-area-inset-left));padding-right:max(20px,env(safe-area-inset-right))}
 #hint{font-size:11px;max-width:min(52%,440px);bottom:calc(var(--joy-size) + 21px + env(safe-area-inset-bottom));padding:5px 9px}
 #actions{padding-bottom:3px}#status{font-size:10px}
 #paper{padding:15px;max-width:720px}#paper h2{font-size:17px}#paper p{font-size:13px;line-height:1.65}
}
@media(min-width:700px) and (min-height:501px){#controls{padding-left:26px;padding-right:26px;padding-bottom:max(22px,env(safe-area-inset-bottom))}#game{--joy-size:148px;--action-size:82px;--book-size:62px}}

</style><div id="game"><canvas id="view"></canvas><div id="top"><div id="title"></div><button id="zoom">확대 3×</button><button id="travel">안내도</button><button id="exit">나가기</button></div><div id="status"></div><div id="hint"></div><div id="controls"><div id="joystick" role="group" aria-label="이동 조이스틱: 누른 채 원하는 방향으로 끌기"><span id="joyKnob"></span><span class="joy-label">MOVE</span></div><div id="actions"><button id="book" type="button" aria-label="수사 수첩">수첩<small>B</small></button><button id="inspect" type="button" aria-label="가까운 물체 조사">조사<small>A</small></button></div></div><div id="sheet"><div id="paper"></div></div><div id="toast"></div></div>`;
const $=id=>shadow.getElementById(id),cv=$('view'),ctx=cv.getContext('2d'),cache={},sprites={};
const palette=[['#29202a','#33465e','#202735'],['#69492f','#bca27b','#45414a'],['#36373c','#dad7ca','#3b4956'],['#211c25','#a38861','#3b3333'],[],[],['#77756e','#665e4c','#2b3744']];
function sprite(id,dir='down',step=0){
 const key=id+dir+step;if(sprites[key])return sprites[key];
 const out=document.createElement('canvas');out.width=32;out.height=48;const g=out.getContext('2d');
 const [hair,coat,pants]=palette[id-1]||palette[0],side=dir==='left'||dir==='right',back=dir==='up',flip=dir==='right',ink='#19202a',skin='#ecc9a8';
 const r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(flip?32-x-w:x,y,w,h);};
 g.fillStyle='#0007';g.beginPath();g.ellipse(16,44,11,3,0,0,7);g.fill();
 const a=step===1?2:0,b=step===2?2:0;
 r(8,35,7,9-a,ink);r(18,35,7,9-b,ink);r(9,36,5,7-a,pants);r(19,36,5,7-b,pants);
 r(7,42-a,9,3,ink);r(17,42-b,9,3,ink);r(8,42-a,6,1,'#737875');r(18,42-b,6,1,'#737875');
 // Broad 20px tailored body and separate arms, still below one floor tile in width.
 r(6,23,21,15,ink);r(7,24,19,13,coat);r(8,25,2,10,'#ffffff20');r(24,25,2,11,'#00000030');
 r(4,25+(step===1?1:0),4,11,coat);r(25,25-(step===1?1:0),4,11,coat);
 r(4,34,4,3,skin);r(25,34,4,3,skin);
 if(!back){r(13,23,7,4,'#e2d9c7');r(16,27,2,8,id===1?'#7b3f51':'#4e3d48');r(16,29,1,1,'#cfb579');r(16,33,1,1,'#cfb579');}
 // 20×18 head, with rounded corners and hair silhouettes distinct from the old square sprite.
 r(7,5,18,18,ink);r(6,8,20,12,ink);r(8,7,16,15,skin);r(7,5,18,7,hair);r(9,4,14,2,hair);
 r(6,9,3,11,hair);r(23,8,3,12,hair);r(9,6,13,2,'#ffffff1a');
 if(back){r(7,8,18,13,hair);r(9,20,14,2,'#00000025');}
 else if(side){r(17,8,8,12,hair);r(8,12,9,5,skin);r(10,14,2,3,ink);r(7,17,3,3,skin);r(10,21,6,1,'#b78474');}
 else{r(8,11,15,2,hair);r(11,15,2,3,ink);r(20,15,2,3,ink);r(11,15,1,1,'#faf0d7');r(20,15,1,1,'#faf0d7');r(15,21,4,1,'#bd8877');
  if(id===3){r(9,14,7,4,'#3f5963');r(18,14,7,4,'#3f5963');r(11,15,4,1,'#a2bbbc');r(19,15,4,1,'#a2bbbc');r(16,15,2,1,'#3f5963');}
 }
 if(id===1){r(6,10,3,15,hair);r(24,10,3,15,hair);}
 if(id===2&&!back){r(8,7,8,4,'#7e5c3b');r(8,11,4,2,hair);}
 if(id===4&&!back){r(9,6,13,3,'#3b3034');r(20,9,4,4,hair);}
 if(id===7){r(8,6,17,3,'#bbb8a6');r(22,10,3,7,'#a8a696');r(12,29,4,2,'#d3b879');}
 return sprites[key]=out;
}
// 32×48 display box on a 32px tile: opaque head/body remain 20px wide; feet anchor to the floor.
function spriteRect(x,y,ox,oy,t,sc){const w=32*sc*SPRITE_SCALE,h=48*sc*SPRITE_SCALE;return{x:ox+(x+.5)*t-w/2,y:oy+(y+1)*t-h,width:w,height:h};}
window.TG_spriteRect=spriteRect;
function roomAt(f){const s=scenes[f];return s?{id:s.id,name:s.name}:null;}
function tileFree(f,x,y,ph=phase()){const s=scenes[f];return !!s&&Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x<s.w&&y<s.h&&s.grid[y][x]!=='#'&&s.grid[y][x]!=='X'&&(admin||ph>=2||f!=='office');}
function rr(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(x,y,w,h);}
function background(s){if(cache[s.id])return cache[s.id];const c=document.createElement('canvas');c.width=s.w*TILE;c.height=s.h*TILE;const g=c.getContext('2d');g.imageSmoothingEnabled=false;const basement=s.floor==='B1';
for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++){const X=x*32,Y=y*32,ch=s.grid[y][x];if(ch==='#'){
 if(y===1){rr(g,X,Y,32,32,basement?'#3e494a':'#5b504a');for(let i=5;i<32;i+=8){rr(g,X+i,Y+3,1,29,'#78624f');for(const j of [10,24]){g.fillStyle='#8b7058';g.beginPath();g.moveTo(X+i,Y+j-3);g.lineTo(X+i+3,Y+j);g.lineTo(X+i,Y+j+3);g.lineTo(X+i-3,Y+j);g.fill();}}rr(g,X,Y,32,4,'#241d25');rr(g,X,Y+4,32,1,'#bf985f');}
 else if(y===2){rr(g,X,Y,32,32,basement?'#38454b':'#49332d');rr(g,X,Y,32,3,'#c19a63');rr(g,X+3,Y+7,26,20,basement?'#2a383e':'#2d2329');rr(g,X+5,Y+9,22,16,basement?'#495457':'#694a35');rr(g,X,Y+29,32,3,'#181b23');if(x%5===2){rr(g,X+11,Y-9,10,18,'#1e2029');rr(g,X+12,Y-8,8,9,'#edcd89');rr(g,X+14,Y-6,4,5,'#fff3ba');}}
 else{rr(g,X,Y,32,32,'#11151d');if(x===0)rr(g,X+27,Y,5,32,'#80674d');if(x===s.w-1)rr(g,X,Y,5,32,'#80674d');if(y===s.h-1)rr(g,X,Y,32,4,'#99794e');}continue;}
 if(basement){rr(g,X,Y,32,32,((x+y)%3)?'#3e484d':'#39444b');rr(g,X+31,Y,1,32,'#2c373f');rr(g,X,Y+31,32,1,'#2c373f');for(let i=0;i<5;i++)rr(g,X+(x*13+y*7+i*17)%30,Y+(x*7+y*19+i*11)%30,1,1,'#596265');}
 else if(s.id==='lobby'||s.id==='ticket'){rr(g,X,Y,32,32,(x+y)%2?'#a59a80':'#b6ab8d');rr(g,X,Y,32,1,'#706d62');rr(g,X,Y,1,32,'#706d62');for(let i=0;i<10;i++)rr(g,X+(x*13+y*7+i*17)%30,Y+(x*7+y*19+i*11)%30,2,1,i%2?'#d1c5a4':'#7b8075');if((x+y)%2===0){g.fillStyle='#65736d';g.beginPath();g.moveTo(X+16,Y+10);g.lineTo(X+22,Y+16);g.lineTo(X+16,Y+22);g.lineTo(X+10,Y+16);g.fill();}}
 else if(s.id==='theatre'){rr(g,X,Y,32,32,'#442832');rr(g,X+15,Y+15,2,2,'#826344');}
 else{for(let i=0;i<4;i++){rr(g,X,Y+i*8,32,8,(x+y+i)%2?'#76583f':'#674d39');rr(g,X,Y+i*8+7,32,1,'#44362e');rr(g,X+(x*13+y*7+i*17)%30,Y+i*8,1,7,'#42352c');rr(g,X+5,Y+i*8+2,12,1,'#8b684a');}}
 if(y===3)rr(g,X,Y,32,5,'#29272b70');}
// Center runner defines the walking route; the lobby is a cinema, with terrazzo instead of a timber hotel hall.
if(s.id==='lobby'){const X=7*32,Y=5*32,w=6*32,h=15*32;rr(g,X,Y,w,h,'#40242d');rr(g,X+4,Y+4,w-8,h-8,'#773440');g.strokeStyle='#b2925b';g.lineWidth=2;g.strokeRect(X+9,Y+9,w-18,h-18);for(let yy=Y+32;yy<Y+h-20;yy+=64){g.fillStyle='#b2925b';g.beginPath();g.moveTo(X+w/2,yy-7);g.lineTo(X+w/2+7,yy);g.lineTo(X+w/2,yy+7);g.lineTo(X+w/2-7,yy);g.fill();}}
for(const o of s.objects)drawObject(g,o,s);
for(const p of s.spots)drawSpot(g,p);
for(const d of s.doors){const X=d.x*32,Y=d.y*32;rr(g,X,Y,32,32,'#6a5b43');rr(g,X+3,Y+2,26,4,'#cbb17a');rr(g,X+3,Y+26,26,3,'#cbb17a');g.font='bold 11px sans-serif';g.textAlign='center';g.fillStyle='#f7e7bf';g.fillText(d.label,X+16,Y-5);}
// Marquee and illuminated entrance lettering remain attached to solid wall cells.
const title=s.id==='lobby'?'E U N H A   C I N E M A':s.id==='theatre'?'S C R E E N  0 1':s.name;g.textAlign='center';g.font='bold '+(s.id==='lobby'?20:16)+'px sans-serif';const tw=Math.min(c.width-80,g.measureText(title).width+28);rr(g,c.width/2-tw/2,35,tw,43,'#211d28');rr(g,c.width/2-tw/2,35,tw,2,'#e0bc74');rr(g,c.width/2-tw/2,76,tw,2,'#a9814e');g.fillStyle='#f6dba0';g.fillText(title,c.width/2,63);
cache[s.id]=c;return c;}
function drawObject(g,o,s){const X=o.x*32,Y=o.y*32,w=o.w*32,h=o.h*32,r=(x,y,a,b,c)=>rr(g,X+x,Y+y,a,b,c);r(4,6,w-4,h-6,'#12192399');
if(['sofa','seats'].includes(o.type)){r(2,3,w-6,h-8,'#2a2029');r(4,2,w-10,h-13,'#6a303c');for(let x=7;x<w-17;x+=28){r(x,5,24,18,'#a75a5e');r(x,25,24,h-36,'#8a414e');r(x+1,6,22,2,'#c88375');}r(3,9,5,h-20,'#bd945b');r(w-12,9,5,h-20,'#bd945b');}
else if(['cabinet','shelf','tools'].includes(o.type)){r(0,0,w-3,h-6,'#4a332a');r(2,2,w-7,4,'#ab8254');for(let y=10;y<h-12;y+=22){for(let x=6;x<w-12;x+=9){r(x,y,6,14,['#b29b6c','#526775','#945760','#738064'][(x+y)%4]);r(x+1,y+3,4,1,'#d0ba85');}r(3,y+15,w-9,3,'#ae8653');}}
else if(o.type==='screen'){r(0,0,w,h,'#1c202b');r(7,5,w-14,h-15,'#d1d7c4');r(15,11,w-30,h-28,'#b8c5ba');r(w/2-45,19,90,2,'#e7e8cf');g.font='12px sans-serif';g.fillStyle='#5c706e';g.textAlign='center';g.fillText('2042 · 마지막 상영회',X+w/2,Y+42);}
else if(o.type==='plant'){r(12,h-21,w-24,16,'#8d6950');for(const [x,y]of [[16,9],[36,14],[24,28],[44,34],[14,40]]){g.fillStyle='#3f624b';g.beginPath();g.ellipse(X+x,Y+y,12,8,0,0,7);g.fill();}}
else if(o.type==='counter'){r(0,0,w-3,h-8,'#523a2b');r(3,3,w-9,5,'#d0a66b');r(3,h-29,w-9,3,'#b58d58');for(let x=8;x<w-40;x+=56){r(x,10,48,22,'#3b5c64');r(x+3,12,41,16,'#6c8e8d');r(x+3,12,2,14,'#c2d6bd');r(x+44,9,4,25,'#c9a267');r(x+11,38,25,10,'#dbcda7');r(x+14,41,18,2,'#a4895d');}g.textAlign='center';g.font='bold 12px sans-serif';g.fillStyle='#d3b47c';g.fillText('T I C K E T S',X+w/2,Y+h-15);}
else if(['console','printer','breaker','generator','projector'].includes(o.type)){r(0,0,w-3,h-7,'#29353e');r(3,3,w-9,h-17,'#69776f');r(4,3,w-11,3,'#a6ad98');if(o.type==='generator'){for(let y=15;y<h-28;y+=8)r(9,y,w/3,3,'#273940');g.fillStyle='#263940';g.beginPath();g.ellipse(X+w*.73,Y+h*.48,w*.18,h*.22,0,0,7);g.fill();g.strokeStyle='#acb7a2';g.lineWidth=3;g.stroke();g.beginPath();g.moveTo(X+w*.57,Y+h*.48);g.lineTo(X+w*.89,Y+h*.48);g.moveTo(X+w*.73,Y+h*.3);g.lineTo(X+w*.73,Y+h*.67);g.stroke();for(let x=5;x<w-10;x+=14)r(x,h-18,8,5,'#d0b569');}
else if(o.type==='projector'){for(const y of [h*.28,h*.66]){g.fillStyle='#c3bca4';g.beginPath();g.arc(X+w*.43,Y+y,15,0,7);g.fill();g.fillStyle='#344750';for(let i=0;i<4;i++){g.beginPath();g.arc(X+w*.43+Math.cos(i*Math.PI/2)*9,Y+y+Math.sin(i*Math.PI/2)*9,3,0,7);g.fill();}}r(w-18,h/2-10,15,20,'#b9b59a');}
else if(o.type==='breaker'){for(let x=10;x<w-20;x+=24){r(x,13,14,25,'#26343d');r(x+4,16,6,9,'#d3cbb1');r(x+4,29,6,3,'#b86950');}r(10,h-21,w-23,5,'#d9bc60');}
else{for(let x=9;x<w-40;x+=52){r(x,10,35,h-32,'#1b2f38');r(x+3,13,29,h-40,'#68908a');r(x+7,17,19,2,'#a9c3ac');r(x+39,16,5,4,'#c89b61');}r(9,h-21,w-23,5,'#a4b29e');}}
else if(o.type==='poster'){r(3,1,w-8,h-8,'#bb9863');r(6,4,w-14,h-14,'#284652');g.fillStyle='#dac9a1';g.beginPath();g.arc(X+w/2,Y+18,7,0,7);g.fill();g.fillStyle='#914e58';g.beginPath();g.moveTo(X+12,Y+h-17);g.lineTo(X+w/2,Y+24);g.lineTo(X+w-13,Y+h-17);g.fill();}
else{r(0,2,w-3,h-9,'#5b402c');r(3,3,w-9,h/2,'#997349');r(4,4,w-11,3,'#bd985f');r(3,h/2+3,w-9,2,'#b28a57');for(let x=8;x<w-15;x+=28){r(x,h/2+9,22,h/2-22,'#6c4c32');r(x+6,h/2+11,9,2,'#c8a568');}if(o.type!=='boxes'){r(10,12,24,14,'#d6cdaf');r(13,16,18,1,'#94816a');}}}
function drawSpot(g,p){const X=p.x*32,Y=p.y*32;if(p.type==='bag'){rr(g,X+5,Y+9,22,19,'#3d5260');rr(g,X+10,Y+5,12,5,'#1c2734');rr(g,X+7,Y+12,18,2,'#bca46d');rr(g,X+19,Y+20,7,6,'#d9c9a3');}else if(p.type==='envelope'){g.fillStyle='#a34e52';g.beginPath();g.moveTo(X+4,Y+18);g.lineTo(X+26,Y+13);g.lineTo(X+29,Y+27);g.lineTo(X+7,Y+30);g.fill();}else if(p.type==='monitor'){rr(g,X+4,Y+7,24,19,'#22363e');rr(g,X+6,Y+9,20,13,'#77a5a0');rr(g,X+10,Y+27,14,3,'#bbc1a9');}else{rr(g,X+5,Y+11,22,16,'#dfd4b4');rr(g,X+8,Y+15,16,1,'#8b7d66');rr(g,X+8,Y+19,13,1,'#8b7d66');rr(g,X+8,Y+23,10,1,'#8b7d66');}}
function phase(){return admin||['explore2','explore3'].includes(state.stage)?2:1;}
function round(){return state.stage==='explore3'?3:phase();}
const LIMIT_KEY='lastscreening2042_tg_limits';
function limits(){try{return {...D.defaultLimits,...JSON.parse(localStorage.getItem(LIMIT_KEY)||'{}'),3:1};}catch{return {...D.defaultLimits,3:1};}}
window.TG_getLimits=limits;window.TG_setLimits=(a,b)=>localStorage.setItem(LIMIT_KEY,JSON.stringify({1:Math.max(0,+a||0),2:Math.max(0,+b||0)}));
function save(){
 clearTimeout(saveTimer);saveTimer=0;dirtySave=false;lastSaveAt=performance.now();
 const key=admin?'tgAdmin':'tg';state[key]={...(state[key]||{}),mv:VERSION,...S};
 try{persist();motionStats.saves++;}catch{}
}
function scheduleSave(){dirtySave=true;if(saveTimer)return;const wait=Math.max(0,SAVE_MS-(performance.now()-lastSaveAt));saveTimer=setTimeout(()=>{saveTimer=0;if(dirtySave)save();},wait);}
function flushSave(){if(dirtySave)save();}
function emitPosition(force=false){if(!opened)return;const now=performance.now();if(!force&&now-lastNetworkAt<NETWORK_MS)return;lastNetworkAt=now;motionStats.networkEvents++;window.TG_onMove?.({...S,x:px,y:py},force);}
function settleMotion(){
 if(!step)return;
 if(!step.door&&step.progress>=.5){S.x=step.toX;S.y=step.toY;scheduleSave();}
 step=null;pendingInteraction=false;px=S.x;py=S.y;frame=0;updateHud();if(opened)emitPosition(true);
}
function finishStep(){
 const completed=step;step=null;if(!completed)return;
 S.x=completed.toX;S.y=completed.toY;px=S.x;py=S.y;motionStats.steps++;
 if(completed.door){travel(completed.door);return;}
 frame=frame===1?2:1;scheduleSave();updateHud();if(!activeDirection()){flushSave();emitPosition(true);}
}
function activeDirection(){return doorLatch&&held===doorLatch?null:held;}
function advanceMotion(delta){
 if(modal||busy)return;
 let remaining=Math.max(0,Math.min(delta,64)),iterations=0;
 while(iterations++<5){
  if(!step){const direction=activeDirection();if(!direction||!move(direction))break;}
  const amount=Math.min(remaining,(1-step.progress)*STEP_MS);step.progress=Math.min(1,step.progress+amount/STEP_MS);remaining-=amount;
  px=step.fromX+(step.toX-step.fromX)*step.progress;py=step.fromY+(step.toY-step.fromY)*step.progress;
  if(step.progress>=1-1e-7){finishStep();if(pendingInteraction){pendingInteraction=false;interact();break;}if(doorLatch)break;}
  else break;
  if(remaining<=.001)break;
 }
 if(step||held)emitPosition();else frame=0;
}

function toast(t){$('toast').textContent=t;$('toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').style.display='none',2300);}
function updateHud(){const s=scenes[S.f],lim=+limits()[round()]||0;$('title').innerHTML=`<b>${esc(s.floor+' · '+s.name)}</b>EUNHA CINEMA`;const left=Math.max(0,lim-(S.used[round()]||0));$('status').textContent=admin?'관리자 시찰 · 증거 수집 안 함':`${phase()}차 조사 · ${lim?'남은 조사권 '+left+' / '+lim:'조사권 무제한'} · ${typeof liveName==='function'?liveName(state.role):''}`;const near=nearest();$('hint').textContent=near?(near.kind==='spot'?(D.spotNames[near.id]||cluesAt(near.id)[0]?.room||'조사 지점')+' · 조사 A':near.label+' · 조사 A'):'조이스틱으로 이동 · 물건 가까이에서 조사';$('hint').style.opacity=near?'1':'.65';}
function show(title,body,buttons=[]){stopInputs();settleMotion();flushSave();modal=true;held=null;$('paper').innerHTML=`<button class="close" id="sheetClose" aria-label="닫기">×</button><h2>${esc(title)}</h2>${body}<div class="row" id="sheetActions"></div>`;$('sheet').classList.add('open');shadow.getElementById('sheetClose').onclick=hide;for(const [label,action] of buttons){const b=document.createElement('button');b.textContent=label;b.onclick=action;shadow.getElementById('sheetActions').appendChild(b);}}
function hide(){modal=false;$('sheet').classList.remove('open');if(!opened)root.style.display='none';}
function message(title,text){show(title,`<p>${esc(text)}</p>`,[['확인',hide]]);}
function nearest(){const s=scenes[S.f],all=[...s.spots.map(p=>({...p,kind:'spot'})),...s.doors.map(d=>({...d,kind:'door'}))];return all.filter(p=>Math.abs(p.x-S.x)+Math.abs(p.y-S.y)<=1).sort((a,b)=>((a.x-S.x)**2+(a.y-S.y)**2)-((b.x-S.x)**2+(b.y-S.y)**2))[0]||null;}
function travel(d){
 if(d.to==='office'&&!admin&&phase()<2){toast('관리사무실은 2차 수색부터 들어갈 수 있습니다.');return false;}
 const dest=scenes[d.to];if(!dest)return false;
 step=null;pendingInteraction=false;doorLatch=held;S.f=d.to;S.x=d.tx;S.y=d.ty;
 if(!tileFree(S.f,S.x,S.y)){const safe=findSafe(dest);S.x=safe.x;S.y=safe.y;}
 px=S.x;py=S.y;S.dir='up';routeTarget=null;visibleSpotsAt=-Infinity;motionStats.doorTransitions++;
 save();updateHud();emitPosition(true);return true;
}
function findSafe(s){if(tileFree(s.id,s.spawn.x,s.spawn.y,2))return s.spawn;for(let y=s.h-2;y>=3;y--)for(let x=1;x<s.w-1;x++)if(tileFree(s.id,x,y,2))return{x,y};return{x:1,y:3};}
function move(dir){
 if(!opened||modal||busy||step||!DIR[dir])return false;
 const [dx,dy]=DIR[dir],nx=S.x+dx,ny=S.y+dy;S.dir=dir;
 const door=scenes[S.f].doors.find(d=>d.x===nx&&d.y===ny);
 if(door&&door.to==='office'&&!admin&&phase()<2){if(doorLatch!==dir)toast('관리사무실은 2차 수색부터 들어갈 수 있습니다.');doorLatch=dir;return false;}
 if(!tileFree(S.f,nx,ny)){motionStats.blocked++;return false;}
 step={fromX:S.x,fromY:S.y,toX:nx,toY:ny,progress:0,dir,door};frame=frame||1;return true;
}
async function interact(){
 if(!opened||modal||busy)return;
 if(step){pendingInteraction=true;held=null;return;}
 const near=nearest();if(!near)return toast('조사할 물건 가까이 이동해 주세요.');
 if(near.kind==='door')return travel(near);return inspect(near.id);
}
function owner(c){try{return claimOwnerV11('E:'+c.id);}catch{return null;}}
function card(c){show(c.id+' · '+c.title,`<small>${esc(c.room)} · ${c.phase}차 자료</small><p>${esc(c.text||c.content||c.detail)}</p>`,[['수첩',notebook],['닫기',hide]]);}
async function inspect(id){const all=cluesAt(id);if(!all.length)return;if(admin){return message(D.spotNames[id]||all[0].room,all.map(c=>`${c.id} · ${c.title} · ${c.phase}차\n${c.kind==='bag'?'소지품 열람 지점':owner(c)?owner(c).name+' 조사 완료':'미조사'}`).join('\n\n')+'\n\n관리자 시찰에서는 증거를 수집하지 않습니다.');}if(!isExploring())return message('현장 보존','지금은 증거 수집 시간이 아닙니다.');const available=all.filter(c=>c.phase<=phase());if(!available.length)return message('현장 보존','2차 증거 수집이 시작되면 정밀 조사할 수 있습니다.');const c=available[0];if(c.kind==='bag')return bag(c);const claim=owner(c);if(claim&&claim.owner!==state.role)return message('조사 완료','이미 '+claim.name+'이 조사했습니다. 현장 물건은 그대로 남아 있습니다. 증거카드 공개 여부는 최초 조사자와 토론하세요.');if(S.got[c.id]||state.inventory.includes(c.id))return card(c);const r=round(),lim=+limits()[r]||0;if(lim>0&&(S.used[r]||0)>=lim)return message('조사권','현재 단계의 조사권을 모두 사용했습니다.');
// The content is revealed only after an awaited, successful first-claim transaction.
show(D.spotNames[id]||c.room,`<p>이 지점을 조사하고 증거카드를 기록합니다.${lim?' 조사권 1개를 사용합니다.':''}</p>`,[['조사하고 기록',async()=>{if(busy)return;busy=true;const b=shadow.getElementById('sheetActions');if(b)for(const q of b.children)q.disabled=true;try{if(!isExploring())return message('현장 보존','수색 단계가 끝났습니다.');const granted=await doWorldClaimV11('E:'+c.id);if(!granted){message('조사 기록','기록하지 못했습니다. 다른 참가자의 조사 여부와 연결 상태를 확인해 주세요.');return;}if(!S.got[c.id]){S.got[c.id]={phase:phase(),at:Date.now()};S.used[r]=(S.used[r]||0)+1;}if(!state.inventory.includes(c.id))state.inventory.push(c.id);S.visited[id]=phase();save();updateHud();card(c);}catch{message('조사 기록','저장하지 못했습니다. 연결 상태를 확인한 뒤 다시 조사해 주세요.');}finally{busy=false;}}],['돌아가기',hide]]);}
function bag(c){if(phase()<2)return message('소지품 보관대','개인 소지품은 2차 증거 수집부터 확인할 수 있습니다.');const pi=Number(c.owner)-1,p=DATA.people[pi];if(!p)return;const items=p.personalItems||[];show((typeof liveName==='function'?liveName(pi):p.name)+'의 소지품',`<small>물건은 그 자리에 둔 채 열람합니다. 소유권은 바뀌지 않습니다.</small>${items.map(it=>`<p><b>${esc(it[0])}</b>\n${esc(it[1]||'')}</p>`).join('')}`,[['닫기',hide]]);}
function notebook(){const own=D.clues.filter(c=>c.kind!=='bag'&&state.inventory.includes(c.id));show('수사 수첩',`<small>내가 기록한 증거 · ${own.length}개</small><div class="list">${own.map(c=>`<button data-card="${esc(c.id)}">${esc(c.id+' · '+c.title)}<br><small>${esc(c.room)}</small></button>`).join('')||'<p>기록한 증거가 없습니다.</p>'}</div>`,[['극장 안내도',overview],['닫기',hide]]);shadow.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>card(D.clues.find(c=>c.id===b.dataset.card)));}
function overview(){const links=scenes[S.f].doors;show('은하극장 안내도',`<small>현재 위치 ${esc(scenes[S.f].floor+' · '+scenes[S.f].name)}</small><p>1F  로비 ─ 매표소 · 상영관 · 관리사무실\n2F  영사실 ─ 기록보관실\nB1  설비창고 ─ 정비 작업실</p><small>방을 옮기려면 표시된 출입문 가까이 이동한 뒤 조사 버튼을 누르세요.</small><div class="list">${links.map(d=>`<button data-route="${esc(d.to)}">${esc(d.label)} 방향 표시</button>`).join('')}</div>`,[['닫기',hide]]);shadow.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>{const d=links.find(d=>d.to===b.dataset.route);hide();routeTarget=d;toast(d.label+' 출입문을 강조했습니다.');});}
let routeTarget=null;
function resize(){
 const v=window.visualViewport,width=Math.max(1,v?.width||window.innerWidth||document.documentElement.clientWidth||390),height=Math.max(1,v?.height||window.innerHeight||document.documentElement.clientHeight||844);
 root.style.inset='auto';root.style.left=(v?.offsetLeft||0)+'px';root.style.top=(v?.offsetTop||0)+'px';root.style.width=width+'px';root.style.height=height+'px';
 const r=cv.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);const newWidth=Math.max(1,Math.round((r.width||width)*dpr)),newHeight=Math.max(1,Math.round((r.height||height)*dpr));if(cv.width!==newWidth||cv.height!==newHeight){cv.width=newWidth;cv.height=newHeight;vignette=null;}
 const top=$('top').getBoundingClientRect(),controls=$('controls').getBoundingClientRect();
 $('status').style.top=(top.height+4)+'px';$('hint').style.bottom=(controls.height+7)+'px';
 const status=$('status').getBoundingClientRect(),hint=$('hint').getBoundingClientRect();
 metrics.width=r.width||width;metrics.height=r.height||height;metrics.dpr=dpr;metrics.top=Math.max(top.height+status.height+12,64);metrics.bottom=Math.max(controls.height+hint.height+18,116);
}
function draw(time){const s=scenes[S.f];if(!s)return;const dpr=Math.min(window.devicePixelRatio||1,2),w=cv.width,h=cv.height,marginTop=metrics.top*dpr,marginBottom=metrics.bottom*dpr;ctx.imageSmoothingEnabled=false;rr(ctx,0,0,w,h,'#0d121b');let sc;if(zoom===1)sc=Math.min(w/(s.w*32),Math.max(64*dpr,h-marginTop-marginBottom)/(s.h*32));else{const tileCSS=Math.min(zoom===2?28:36,Math.max(18,Math.min(metrics.width/9,(metrics.height-metrics.top-metrics.bottom)/6)));sc=tileCSS*dpr/32;}sc=Math.max(.2,Math.min(sc,1.6*dpr));canvasScale=sc;const worldW=s.w*32*sc,worldH=s.h*32*sc;offsetX=worldW<=w?(w-worldW)/2:Math.max(w-worldW,Math.min(0,w/2-(px+.5)*32*sc));const usable=Math.max(64*dpr,h-marginTop-marginBottom);offsetY=worldH<=usable?marginTop+(usable-worldH)/2:Math.max(h-marginBottom-worldH,Math.min(marginTop,marginTop+usable/2-(py+.5)*32*sc));const roomBackground=window.LS_CINEMA_V18?.renderBackground?.(s)||background(s);ctx.imageSmoothingEnabled=roomBackground.width>s.w*32;ctx.imageSmoothingQuality='high';ctx.drawImage(roomBackground,offsetX,offsetY,worldW,worldH);ctx.imageSmoothingEnabled=false;
if(visibleSpotsScene!==S.f||time-visibleSpotsAt>250){visibleSpotsScene=S.f;visibleSpotsAt=time;visibleSpots=s.spots.filter(p=>{const all=cluesAt(p.id);return all.some(c=>c.phase<=phase())&&!all.every(c=>c.kind!=='bag'&&(S.got[c.id]||owner(c)));});}
for(const p of visibleSpots){const a=.5+.5*Math.sin(time/370+p.x),x=offsetX+(p.x+.5)*32*sc,y=offsetY+(p.y+.3)*32*sc;rr(ctx,x-5*sc,y-sc,10*sc,2*sc,`rgba(255,224,144,${a})`);rr(ctx,x-sc,y-5*sc,2*sc,10*sc,`rgba(255,224,144,${a})`);}
if(routeTarget&&scenes[S.f].doors.includes(routeTarget)){const x=offsetX+(routeTarget.x+.5)*32*sc,y=offsetY+(routeTarget.y+.5)*32*sc;ctx.strokeStyle='#f9df8d';ctx.lineWidth=3*dpr;ctx.strokeRect(x-18*sc,y-18*sc,36*sc,36*sc);}
const box=spriteRect(px,py,offsetX,offsetY,32*sc,sc),sp=sprite(S.role,S.dir,step?(Math.floor(time/105)%2+1):0);ctx.drawImage(sp,0,0,32,48,box.x,box.y,box.width,box.height);
try{window.TG_drawOthers?.(ctx,S.f,offsetX,offsetY,32*sc,sc,time,sprite,roomAt,S);}catch{}
window.LS_CINEMA_V18?.drawForeground?.(ctx,s,offsetX,offsetY,32*sc,sc,time,{x:px,y:py,dir:S.dir,role:S.role,moving:!!step});
// A restrained vignette keeps the floor readable instead of hiding collision edges.
if(!vignette){vignette=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.3,w/2,h/2,Math.max(w,h)*.7);vignette.addColorStop(0,'#02081400');vignette.addColorStop(1,'#02081445');}ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);}
function loop(t){
 loopRequest=0;if(!opened)return;S.phase=phase();
 const elapsed=lastTick?Math.max(0,t-lastTick):0;lastTick=t;
 if(elapsed>0){motionStats.frames++;motionStats.maxFrameMs=Math.max(motionStats.maxFrameMs,elapsed);motionStats.frameTimes.push(elapsed);if(motionStats.frameTimes.length>180)motionStats.frameTimes.shift();}
 advanceMotion(elapsed);const drawStarted=performance.now();draw(t);motionStats.drawMs=performance.now()-drawStarted;
 loopRequest=requestAnimationFrame(loop);
}
function open(flag=false){
 stopInputs();settleMotion();admin=flag===true;window.TG_ADMIN=admin;if(!admin&&!role())return;
 const old=state[admin?'tgAdmin':'tg']||{},spawn=scenes.lobby.spawn;
 S={f:'lobby',x:spawn.x,y:spawn.y,dir:'down',role:admin?7:state.role+1,phase:phase(),used:old.used||{1:0,2:0,3:0},got:old.got||{},seen:old.seen||{},visited:old.visited||{}};
 if(old.mv===VERSION&&tileFree(old.f,old.x,old.y)){S.f=old.f;S.x=old.x;S.y=old.y;S.dir=old.dir||'down';}
 px=S.x;py=S.y;step=null;doorLatch=null;lastTick=0;visibleSpotsAt=-Infinity;root.style.display='block';document.documentElement.style.overflow='hidden';hide();
 opened=true;root.style.display='block';resize();updateHud();save();if(!loopRequest)loopRequest=requestAnimationFrame(loop);emitPosition(true);
}
function close(){
 stopInputs();settleMotion();flushSave();opened=false;held=null;modal=false;lastTick=0;if(loopRequest){cancelAnimationFrame(loopRequest);loopRequest=0;}
 root.style.display='none';$('sheet').classList.remove('open');document.documentElement.style.overflow='';
 try{const key=admin?'admin':String(state.role);if(typeof SYNC!=='undefined'&&SYNC.on)SYNC.db.remove(SYNC.R('pos/'+key)).catch(()=>{});}catch{}
}
window.TG_open=open;window.TG_close=close;window.TG_state=()=>S;window.TG_renderPosition=()=>({f:S.f,x:px,y:py,dir:S.dir,moving:!!step});window.TG_isOpen=()=>opened;window.TG_resetMine=()=>{state.tg={};try{persist();}catch{}};
window.TG_openCard=id=>{const c=D.clues.find(c=>c.id===id);if(!c)return;if(!window.TG_ADMIN&&state.stage!=='finished'&&!state.inventory.includes(id))return;root.style.display='block';card(c);};
window.TG_alibiHtml=(id,filter='all')=>{const a=(D.alibis||[]).find(a=>a.id===Number(id));if(!a)return '';return `<p>${esc(a.summary||'')}</p>${(a.timeline||[]).filter(t=>filter==='all'||t.say===filter).map(t=>`<div class="entry"><b>${esc(t.t)}</b> · ${esc(t.place)}<p>${esc(t.action)}</p><small>${esc(t.witness||'')}${t.tip?' · '+esc(t.tip):''}</small></div>`).join('')}`;};
$('exit').onclick=close;$('book').onclick=notebook;$('inspect').onclick=interact;$('travel').onclick=overview;$('zoom')?.remove(); // Art-map v19: fixed close-up camera, no accidental zoom changes.
// Input is owned by the thumb pointer, while actions remain available to a second finger.
const joystick=$('joystick'),joyKnob=$('joyKnob'),keyDirections=[],metrics={top:75,bottom:150,width:0,height:0,dpr:1};
let joyPointer=null,joyDirection=null,viewportFrame=0;
function currentInput(){return joyPointer!==null?joyDirection:externalInput||keys[keyDirections[keyDirections.length-1]]||null;}
function setHeld(dir,immediate=false){
 held=DIR[dir]?dir:null;if(!held||held!==doorLatch)doorLatch=null;
 if(held&&opened&&!modal&&!busy&&!step&&!doorLatch)move(held);
 if(!held&&!step){flushSave();emitPosition(true);}
}
window.TG_setInput=dir=>{externalInput=DIR[dir]?dir:null;setHeld(currentInput());};
window.TG_clearInput=()=>{externalInput=null;setHeld(currentInput());};
function joystickReset(release=true){
 const pointer=joyPointer;joyPointer=null;joyDirection=null;joystick.classList.remove('active');joyKnob.style.transform='translate(-50%,-50%)';
 if(release&&pointer!==null)try{if(joystick.hasPointerCapture?.(pointer))joystick.releasePointerCapture(pointer);}catch(_){}
 setHeld(currentInput());
}
function stopInputs(){keyDirections.length=0;externalInput=null;joystickReset();held=null;doorLatch=null;lastTick=0;flushSave();}
function joystickAim(e,initial=false){
 const r=joystick.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,distance=Math.hypot(dx,dy),radius=r.width*.3,k=distance?Math.min(radius,distance)/distance:0;
 joyKnob.style.transform=`translate(calc(-50% + ${dx*k}px),calc(-50% + ${dy*k}px))`;
 if(distance<r.width*.10)joyDirection=null;
 else{const horizontal=Math.abs(dx),vertical=Math.abs(dy),previousHorizontal=joyDirection==='left'||joyDirection==='right';
 const useHorizontal=joyDirection?(previousHorizontal?vertical<=horizontal*1.22:horizontal>vertical*1.22):horizontal>vertical;
 joyDirection=useHorizontal?(dx>0?'right':'left'):(dy>0?'down':'up');}
 if(!opened||modal||busy){held=null;return;}if(initial)lastMove=-Infinity;setHeld(joyDirection,initial);
}
joystick.addEventListener('pointerdown',e=>{
 if(joyPointer!==null||!opened||modal||busy||e.isPrimary===false&&e.pointerType==='mouse')return;
 e.preventDefault();joyPointer=e.pointerId;joystick.classList.add('active');try{joystick.setPointerCapture(e.pointerId);}catch(_){}joystickAim(e,true);
});
joystick.addEventListener('pointermove',e=>{if(e.pointerId!==joyPointer)return;e.preventDefault();joystickAim(e);});
for(const name of ['pointerup','pointercancel','lostpointercapture'])joystick.addEventListener(name,e=>{if(e.pointerId===joyPointer)joystickReset(name!=='lostpointercapture');});
joystick.addEventListener('contextmenu',e=>e.preventDefault());
// The action controls fire on touch-down, not only after a synthesized click.
for(const[id,action]of [['inspect',interact],['book',notebook]]){
 const b=$(id);b.onclick=null;
 b.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;e.preventDefault();action();});
 b.addEventListener('click',e=>{if(e.detail===0){e.preventDefault();action();}});
}
const keys={ArrowUp:'up',KeyW:'up',ArrowRight:'right',KeyD:'right',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left'};
window.addEventListener('keydown',e=>{
 if(!opened)return;
 if(modal){if(e.code==='Escape'){e.preventDefault();hide();}return;}
 if(keys[e.code]){e.preventDefault();if(modal||busy)return;const code=e.code;if(!keyDirections.includes(code)){keyDirections.push(code);lastMove=-Infinity;setHeld(currentInput(),true);}}
 else if(['Space','Enter','KeyE'].includes(e.code)){e.preventDefault();if(!e.repeat)interact();}
 else if(e.code==='KeyB'&&!e.repeat){e.preventDefault();notebook();}
 else if(e.code==='Escape'){e.preventDefault();modal?hide():close();}
});
window.addEventListener('keyup',e=>{if(!keys[e.code])return;const i=keyDirections.indexOf(e.code);if(i>=0)keyDirections.splice(i,1);setHeld(currentInput());});
window.addEventListener('blur',()=>{stopInputs();settleMotion();flushSave();});window.addEventListener('pagehide',()=>{stopInputs();settleMotion();flushSave();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopInputs();settleMotion();flushSave();}});
function scheduleResize(){if(!opened)return;if(!viewportFrame)viewportFrame=requestAnimationFrame(()=>{viewportFrame=0;if(opened)resize();});}
window.addEventListener('resize',scheduleResize,{passive:true});window.addEventListener('orientationchange',()=>{stopInputs();scheduleResize();},{passive:true});
if(window.visualViewport){window.visualViewport.addEventListener('resize',scheduleResize,{passive:true});window.visualViewport.addEventListener('scroll',scheduleResize,{passive:true});}
if(typeof ResizeObserver!=='undefined')new ResizeObserver(scheduleResize).observe($('game'));
// No touch scrolling or browser gestures while the scene is open; sheets retain native scrolling.
$('game').addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});
if(new URL(location.href).searchParams.has('qa'))window.TG_controlsQA=()=>({
 pointer:joyPointer,direction:joyDirection,held,keys:keyDirections.map(code=>keys[code]),keyCodes:[...keyDirections],modal,opened,viewport:{...metrics},
 joystickRect:joystick.getBoundingClientRect().toJSON?.()||{width:joystick.getBoundingClientRect().width,height:joystick.getBoundingClientRect().height},
 actions:Array.from($('actions').querySelectorAll('button')).map(e=>{const r=e.getBoundingClientRect();return{id:e.id,x:r.x,y:r.y,width:r.width,height:r.height};})
});

// Read-only reproducible geometry, scale and runtime inspection hooks.
function geometryQA(){const result={version:VERSION,scenes:{},phases:{}};for(const s of Object.values(scenes))result.scenes[s.id]={w:s.w,h:s.h,objects:s.objects.length,spots:s.spots.length,doors:s.doors.length};for(const ph of [1,2]){const start=['lobby',scenes.lobby.spawn.x,scenes.lobby.spawn.y],q=[start],seen=new Set([start.join(':')]);const free=(f,x,y)=>{const a=scenes[f];return a&&x>=0&&y>=0&&x<a.w&&y<a.h&&a.grid[y][x]!== '#'&&a.grid[y][x]!=='X'&&(ph>=2||f!=='office');};for(let i=0;i<q.length;i++){const[f,x,y]=q[i],ns=Object.values(DIR).map(([dx,dy])=>[f,x+dx,y+dy]);for(const d of scenes[f].doors)if(d.x===x&&d.y===y&&!(ph===1&&d.to==='office'))ns.push([d.to,d.tx,d.ty]);for(const n of ns){const k=n.join(':');if(!seen.has(k)&&free(...n)){seen.add(k);q.push(n);}}}const missing=D.clues.filter(c=>c.phase<=ph).filter(c=>{const p=spotIndex[c.spot];return !p||!Object.values(DIR).some(([dx,dy])=>seen.has([p.scene,p.x+dx,p.y+dy].join(':')));}).map(c=>c.id);result.phases[ph]={reachable:seen.size,unreachableClues:missing,passed:missing.length===0};}return result;}
window.TG_motionQA=()=>({...motionStats,frameTimes:[...motionStats.frameTimes],render:{x:px,y:py},logical:{x:S.x,y:S.y,f:S.f},step:step?{...step,door:step.door?.to||null}:null,held,doorLatch,pendingInteraction,speedTilesPerSecond:1000/STEP_MS,saveIntervalMs:SAVE_MS});
window.TG_mapGeometryQA=geometryQA;window.TG_mapQA=geometryQA;window.TG_viewQA=()=>({version:VERSION,opened,scene:S.f,zoom,sprite:{widthTiles:1*SPRITE_SCALE,heightTiles:1.5*SPRITE_SCALE,authored:[32,48],scale:SPRITE_SCALE},tileCSS:32*canvasScale/(Math.min(window.devicePixelRatio||1,2)),viewport:{w:cv.width,h:cv.height},render:{x:px,y:py},state:{...S}});
if(new URL(location.href).searchParams.has('qa'))window.TG_sceneQA={scenes,spotIndex,tileFree,move,inspect,interact,render:draw,background,sprite,geometry:geometryQA,advance(ms){advanceMotion(ms);draw(performance.now());},place(id,x,y){if(!scenes[id]||!tileFree(id,x,y,2))return false;S.f=id;S.x=x;S.y=y;step=null;doorLatch=null;px=x;py=y;visibleSpotsAt=-Infinity;updateHud();return true;},visit(id){if(!scenes[id])return;S.f=id;const p=findSafe(scenes[id]);S.x=p.x;S.y=p.y;step=null;doorLatch=null;lastTick=0;px=S.x;py=S.y;visibleSpotsAt=-Infinity;if(opened){updateHud();draw(performance.now());}},setZoom(){zoom=3;},getCanvas:()=>cv};
window.MAPS=scenes;window.MAP_VERSION=VERSION;ready=true;
})();
