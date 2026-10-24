/* EUNHA CINEMA · V18 architectural surfaces.
 * Authored at 32 logical px per tile; the room renderer supersamples this artwork.
 * Every raised wall stays inside the collision perimeter. Textures are seeded.
 */
(() => {
  'use strict';
  const T = 32, TAU = Math.PI * 2;
  const palettes = {
    lobby: {floor:'#b9b2a2',floorLight:'#d5cbb6',floorDark:'#938d82',wall:'#48483f',panel:'#2d3532',trim:'#b89b67',metal:'#a88d60',light:'#f9d999',wood:'#664b37',accent:'#724149',ink:'#1d2828'},
    ticket: {floor:'#aaa38e',floorLight:'#c4bba3',floorDark:'#8a8678',wall:'#51483c',panel:'#383a31',trim:'#b09a69',metal:'#aa9362',light:'#f6dca3',wood:'#71543e',accent:'#74484b',ink:'#282e2c'},
    office: {floor:'#765b44',floorLight:'#8e7151',floorDark:'#544333',wall:'#344d48',panel:'#263b37',trim:'#ae9161',metal:'#ac946a',light:'#f0d19b',wood:'#64472f',accent:'#39564f',ink:'#22342f'},
    theatre: {floor:'#302b31',floorLight:'#43323a',floorDark:'#231f26',wall:'#45363b',panel:'#2d282f',trim:'#aa8a5c',metal:'#ae9169',light:'#eed3a0',wood:'#594437',accent:'#6c3d48',ink:'#211e28'},
    projection: {floor:'#5a6866',floorLight:'#6c7a75',floorDark:'#495753',wall:'#384d4b',panel:'#293c3a',trim:'#9aab99',metal:'#a3ada2',light:'#c9e6ce',wood:'#5f6352',accent:'#466c69',ink:'#1f3735'},
    archive: {floor:'#7a6449',floorLight:'#927858',floorDark:'#5a4937',wall:'#555145',panel:'#383e35',trim:'#b59e70',metal:'#ac9b75',light:'#ead7a6',wood:'#65503a',accent:'#3b5349',ink:'#28392e'},
    storage: {floor:'#67726a',floorLight:'#7b8479',floorDark:'#4e5c55',wall:'#46564b',panel:'#334238',trim:'#9caa8c',metal:'#9ca68e',light:'#d6e2b7',wood:'#62614b',accent:'#71806a',ink:'#293e35'},
    workshop: {floor:'#6a736a',floorLight:'#7e8678',floorDark:'#505c52',wall:'#4c5a4f',panel:'#34443a',trim:'#b1a16d',metal:'#b2b39c',light:'#e4dfb6',wood:'#68634c',accent:'#a58c53',ink:'#293e35'}
  };
  const English = {lobby:'E U N H A   C I N E M A',ticket:'BOX OFFICE',office:'MANAGEMENT SUITE',theatre:'SCREEN 01',projection:'PROJECTION ROOM',archive:'FILM & RECORDS',storage:'EQUIPMENT STORE',workshop:'MAINTENANCE'};
  function themeFor(s) { return {...(palettes[s.id] || palettes.lobby)}; }
  function theme(s,p) { return {...themeFor(s),...(p||{})}; }
  function hash(x,y,k=0) { let a=Math.imul(x+131,k+197)^Math.imul(y+29,23497);a=Math.imul(a^(a>>>13),1274126177);return((a^(a>>>16))>>>0)/4294967296; }
  function rect(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(x,y,w,h);}
  function line(g,x1,y1,x2,y2,c,w=1){g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();}
  function ellipse(g,x,y,rx,ry,c){g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,TAU);g.fill();}
  function poly(g,points,c){g.fillStyle=c;g.beginPath();points.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();g.fill();}
  function glow(g,x,y,rx,ry,c) {
    g.save();g.translate(x,y);g.scale(1,ry/rx);
    const q=g.createRadialGradient(0,0,0,0,0,rx);q.addColorStop(0,c);q.addColorStop(.35,c.slice(0,7)+'23');q.addColorStop(1,c.slice(0,7)+'00');
    g.fillStyle=q;g.fillRect(-rx,-rx,rx*2,rx*2);g.restore();
  }
  function strokeRect(g,x,y,w,h,c,l=1){g.strokeStyle=c;g.lineWidth=l;g.strokeRect(x,y,w,h);}
  function floorClip(g,s) {g.beginPath();g.rect(T,3*T,(s.w-2)*T,(s.h-4)*T);g.clip();}
  function floorGradient(g,s,p){const q=g.createLinearGradient(0,3*T,0,s.h*T);q.addColorStop(0,p.floorDark);q.addColorStop(.2,p.floor);q.addColorStop(.8,p.floor);q.addColorStop(1,p.floorDark);return q;}
  function stone(g,s,p){
    const W=s.w*T,H=s.h*T;
    rect(g,T,3*T,W-2*T,H-4*T,p.floor);
    // Broad honed slabs. The material variation remains much quieter than its brass inlay.
    for(let y=3*T;y<H-T;y+=96)for(let x=T;x<W-T;x+=96){
      const a=hash(x,y,11);rect(g,x+1,y+1,95,95,a>.6?'#eee0bf0b':a>.3?'#ffffff05':'#202b2b08');
      line(g,x,y,x+96,y,'#eee7d51f',.75);line(g,x,y,x,y+96,'#eee7d526',.75);
      line(g,x+1,y+1,x+96,y+1,'#3c49432a',.6);line(g,x+1,y+1,x+1,y+96,'#3c494324',.6);
      // Very faint mineral veins; no regular checkerboard.
      if(a>.64){g.strokeStyle='#eee4ca18';g.lineWidth=.6;g.beginPath();g.moveTo(x+7,y+81);g.bezierCurveTo(x+41,y+65,x+49,y+18,x+91,y+9);g.stroke();}
    }
    for(let i=0;i<(W*H)/145;i++){
      const x=T+hash(i,1,8)*(W-2*T),y=3*T+hash(i,2,8)*(H-4*T),a=hash(i,3,8);
      const r=.3+hash(i,4,8)*1.15;
      poly(g,[[x-r,y],[x+.6*r,y-.6*r],[x+r,y+.4*r],[x,y+.8*r]],a>.72?'#eee0bd3d':a>.43?'#65716831':'#c5b69c25');
    }
    const inlay=T+18;
    strokeRect(g,inlay,3*T+18,W-inlay*2,H-4*T-36,'#665c4c72',2.1);
    strokeRect(g,inlay+4,3*T+22,W-inlay*2-8,H-4*T-44,'#e0c7919c',.9);
    const border=10;
    for(let x=T+36;x<W-T;x+=96)for(const y of [3*T+18,H-T-18])poly(g,[[x,y-3],[x+3,y],[x,y+3],[x-3,y]],'#9a81536e');
    for(let y=3*T+45;y<H-T-30;y+=96)for(const x of [T+18,W-T-18])poly(g,[[x,y-3],[x+3,y],[x,y+3],[x-3,y]],'#9a81536e');
  }
  function medallion(g,x,y,r,p){
    // Inlaid stone compass, rather than a painted glow or an impassable feature.
    ellipse(g,x,y,r,r,'#9d9b8d');ellipse(g,x,y,r-2,r-2,'#c8beaa');
    for(const rr of [r-5,r-10,r-19]){g.strokeStyle=rr===r-10?'#f0d8a3':'#8c7b5b';g.lineWidth=rr===r-10?1.2:.7;g.beginPath();g.arc(x,y,rr,0,TAU);g.stroke();}
    for(let i=0;i<16;i++){
      const a=i*Math.PI/8-Math.PI/2,outer=i%2===0?r-22:r*.43,inner=r*.18,side=Math.PI/16;
      const top=[x+Math.cos(a)*outer,y+Math.sin(a)*outer];
      const l=[x+Math.cos(a-side)*inner,y+Math.sin(a-side)*inner],q=[x+Math.cos(a+side)*inner,y+Math.sin(a+side)*inner];
      poly(g,[[x,y],l,top],i%2?'#7f755e':'#5d6c64');poly(g,[[x,y],top,q],i%2?'#a08c65':'#8f9b87');
    }
    ellipse(g,x,y,5,5,'#d5bd87');ellipse(g,x,y,2.2,2.2,'#746c51');
  }
  function wood(g,s,p){
    const W=s.w*T,H=s.h*T,boardH=15,boardW=106;
    rect(g,T,3*T,W-2*T,H-4*T,p.floorDark);
    for(let row=0,y=3*T;y<H-T;row++,y+=boardH){
      const off=(row%3)*35;
      for(let col=-1,x=T-off;x<W-T;col++,x+=boardW){
        const a=hash(col,row,51),c=a>.75?p.floorLight:a>.25?p.floor:p.floorDark;
        rect(g,x+.5,y+.5,boardW-1,boardH-1,c);
        rect(g,x+1,y+1,boardW-2,1,'#d3b48c24');rect(g,x+1,y+boardH-1,boardW-2,.6,'#1b29215a');
        for(let i=0;i<3;i++){
          const yy=y+3+i*3.4,xx=x+4+hash(row+i,col,3)*16;
          line(g,xx,yy,x+boardW-8-hash(col+i,row,1)*20,yy+(hash(row,col+i,6)-.5)*1.4,'#dfbb821b',.45);
        }
        if(a>.91)ellipse(g,x+40,y+7,7,1.3,'#342d2438');
      }
    }
    strokeRect(g,T+12,3*T+12,W-2*T-24,H-4*T-24,'#352d2661',3);
    strokeRect(g,T+15,3*T+15,W-2*T-30,H-4*T-30,'#be9d685c',.65);
  }
  function rug(g,x,y,w,h,p,ornate=false){
    rect(g,x-2,y-2,w+4,h+4,'#161e2133');rect(g,x,y,w,h,p.accent);
    strokeRect(g,x+3,y+3,w-6,h-6,'#252f2b72',4);strokeRect(g,x+8,y+8,w-16,h-16,'#c8b28270',1);
    strokeRect(g,x+11,y+11,w-22,h-22,'#e4c99025',.65);
    for(let yy=y+7;yy<y+h;yy+=3.3)line(g,x+3,yy,x+w-3,yy,'#f1dcc408',.6);
    if(ornate){
      for(const xx of [x+18,x+w-18])for(let yy=y+25;yy<y+h-14;yy+=32)poly(g,[[xx,yy-4],[xx+4,yy],[xx,yy+4],[xx-4,yy]],'#d3b98547');
    }
  }
  function carpet(g,s,p){
    const W=s.w*T,H=s.h*T;
    rect(g,T,3*T,W-2*T,H-4*T,p.floor);
    // Woven acoustic carpet with small, low contrast diamond flecks.
    for(let y=3*T+7;y<H-T;y+=14)for(let x=T+7;x<W-T;x+=14){
      const xx=x+(Math.round(y/14)%2)*7;
      poly(g,[[xx,y-1.6],[xx+1.4,y],[xx,y+1.6],[xx-1.4,y]],'#b19d8620');
    }
    const left=10*T,right=14*T;
    rect(g,left,7*T,right-left,H-8*T,p.accent);
    rect(g,left+5,7*T,1.1,H-8*T,'#b595675b');rect(g,right-6,7*T,1.1,H-8*T,'#b595675b');
    for(let y=7*T+9;y<H-T;y+=3.1)line(g,left+6,y,right-6,y,'#cda2a30a',.7);
    // The screen apron and cross aisles remain flat and fully walkable.
    rect(g,3*T,6*T,18*T,12,'#151e23a6');line(g,3*T,6*T+12,21*T,6*T+12,'#b89c6869',1.2);
    for(const y of [13*T,17*T,21*T])line(g,2*T,y,W-2*T,y,'#b4936245',.8);
    for(const x of [2*T+10,W-2*T-10])for(let y=8*T;y<H-2*T;y+=2*T){
      rect(g,x-2,y-2,4,4,'#e3c48c');glow(g,x,y,15,10,'#f2d09b55');
    }
  }
  function industrial(g,s,p){
    const W=s.w*T,H=s.h*T;
    g.fillStyle=floorGradient(g,s,p);g.fillRect(T,3*T,W-2*T,H-4*T);
    const projection=s.id==='projection',spacing=projection?64:128;
    for(let x=T;x<W-T;x+=spacing){line(g,x,3*T,x,H-T,'#243b3446',1);line(g,x+1,3*T,x+1,H-T,'#d8e1ca21',.8);}
    for(let y=3*T;y<H-T;y+=spacing){line(g,T,y,W-T,y,'#263d3445',1);line(g,T,y+1,W-T,y+1,'#d8e1ca20',.8);}
    for(let i=0;i<W*H/330;i++){
      const x=T+hash(i,5,5)*(W-2*T),y=3*T+hash(i,7,5)*(H-4*T),r=.25+hash(i,9,5)*1.15;
      ellipse(g,x,y,r,r*.58,i%3===0?'#e4e2c82c':'#172c2430');
    }
    if(!projection){
      // Unobtrusive oil rubs and wear, cast into the material rather than over furniture.
      for(let i=0;i<16;i++){
        const x=T+hash(i,10,10)*(W-2*T),y=3*T+hash(i,13,10)*(H-4*T),r=10+hash(i,20,10)*22;
        const q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,'#1f302824');q.addColorStop(1,'#1f302800');g.fillStyle=q;g.fillRect(x-r,y-r,2*r,2*r);
      }
    }
    // Flat floor paint describes a clear central service lane.
    const laneL=W/2-45,laneR=W/2+45;
    for(const x of [laneL,laneR])line(g,x,7*T,x,H-3*T,projection?'#c1cabb34':'#d2bd6e58',1.5);
    for(let y=7*T+40;y<H-3*T;y+=88){
      line(g,W/2-7,y+4,W/2,y-3,'#c5c99e66',1.4);line(g,W/2,y-3,W/2+7,y+4,'#c5c99e66',1.4);
    }
    for(const x of [T+7,W-T-7]){
      rect(g,x,3*T,3,H-4*T,'#172b2b5c');rect(g,x+1,3*T,1,H-4*T,'#a1aaa13d');
    }
  }
  function drawFloor(g,s,input){
    const p=theme(s,input),W=s.w*T,H=s.h*T;
    g.save();rect(g,0,0,W,H,'#111a1c');floorClip(g,s);
    if(s.id==='lobby'||s.id==='ticket')stone(g,s,p);
    else if(s.id==='office'||s.id==='archive')wood(g,s,p);
    else if(s.id==='theatre')carpet(g,s,p);
    else industrial(g,s,p);
    if(s.id==='lobby')medallion(g,W/2,11*T,76,p);
    if(s.id==='office')rug(g,7*T,10*T+8,8*T,3*T+8,p,true);
    if(s.id==='archive')rug(g,8*T+8,4*T,3*T,12*T,p,true);
    if(s.id==='ticket'){
      // A brass queue guide is an inlay, deliberately not a physical rail.
      for(const x of [7*T,11*T])line(g,x,12*T,x,16*T,'#826c4759',1.2);
      g.fillStyle='#645e4d84';g.font='600 8px Georgia,serif';g.textAlign='center';g.fillText('T I C K E T S',W/2,14*T);
    }
    // Soft contact at the floor/wall junction gives an unambiguous raised edge.
    let q=g.createLinearGradient(0,3*T,0,3*T+20);q.addColorStop(0,'#0c181b72');q.addColorStop(1,'#0c181b00');g.fillStyle=q;g.fillRect(T,3*T,W-2*T,20);
    q=g.createLinearGradient(T,0,T+14,0);q.addColorStop(0,'#0c181b72');q.addColorStop(1,'#0c181b00');g.fillStyle=q;g.fillRect(T,3*T,14,H-4*T);
    q=g.createLinearGradient(W-T-14,0,W-T,0);q.addColorStop(0,'#0c181b00');q.addColorStop(1,'#0c181b72');g.fillStyle=q;g.fillRect(W-T-14,3*T,14,H-4*T);
    g.restore();
  }
  function panel(g,x,y,w,h,p){
    rect(g,x,y,w,h,p.panel);strokeRect(g,x+.8,y+.8,w-1.6,h-1.6,'#adac8c26',.8);
    strokeRect(g,x+4,y+4,w-8,h-8,p.trim+'42',.65);
    line(g,x+6,y+6,x+w-6,y+6,'#e0ce9b15',.8);
  }
  function pilaster(g,x,p){
    const q=g.createLinearGradient(x,0,x+12,0);q.addColorStop(0,'#26322d');q.addColorStop(.18,p.trim);q.addColorStop(.46,'#bcb18d');q.addColorStop(.8,p.trim);q.addColorStop(1,'#334033');
    g.fillStyle=q;g.fillRect(x,23,12,65);
    rect(g,x-3,21,18,4,p.trim);rect(g,x-2,26,16,2,'#1a30234b');rect(g,x-3,85,18,5,p.trim);rect(g,x-3,89,18,2,'#1b2d24');
    for(const xx of [x+3,x+6,x+9])line(g,xx,30,xx,83,'#172d244d',.7);
  }
  function sconce(g,x,y,p){
    glow(g,x,y+10,37,39,p.light+'35');
    rect(g,x-3,y-7,6,26,'#26342e');rect(g,x-4,y-8,8,2,p.trim);
    rect(g,x-6,y-3,12,13,p.trim);rect(g,x-5,y-2,10,10,p.light);line(g,x,y-2,x,y+8,'#73654666',.7);
    poly(g,[[x-6,y-3],[x-4,y-6],[x+4,y-6],[x+6,y-3]],'#ddc28e');
    rect(g,x-3,y+11,6,3,'#c2aa76');rect(g,x-2,y+14,4,4,'#4f5c40');
  }
  function wallTitle(g,s,p){
    const W=s.w*T,text=English[s.id]||'EUNHA CINEMA',isMain=s.id==='lobby';
    const topPortal=(s.doors||[]).some(d=>d.y<3),center=topPortal?W*.275:W/2;
    const plaqueW=Math.min(W-156,isMain?(topPortal?228:259):238),plaqueH=isMain?42:36,x=center-plaqueW/2,y=38;
    rect(g,x-3,y+2,plaqueW+6,plaqueH+3,'#111f23a6');
    const q=g.createLinearGradient(x,y,x,y+plaqueH);q.addColorStop(0,'#283832');q.addColorStop(1,'#182a28');g.fillStyle=q;g.fillRect(x,y,plaqueW,plaqueH);
    strokeRect(g,x+.5,y+.5,plaqueW-1,plaqueH-1,p.trim,1);strokeRect(g,x+4,y+4,plaqueW-8,plaqueH-8,p.trim+'70',.65);
    g.textAlign='center';g.textBaseline='alphabetic';g.font=(isMain?'600 12px':'600 10px')+' Georgia,serif';
    g.fillStyle=p.light;g.fillText(text,center,y+(isMain?19:17),plaqueW-22);
    g.font='500 7px system-ui,sans-serif';g.fillStyle='#d0c7a5c4';
    const sub=isMain?'은 하 극 장  ·  EST. 1978':s.name;
    g.fillText(sub,center,y+(isMain?32:28),plaqueW-22);
    if(isMain){
      for(const side of [-1,1]){
        const xx=center+side*(plaqueW/2+19),yy=y+plaqueH/2;
        line(g,xx-side*8,yy-8,xx+side*8,yy,p.trim,.9);line(g,xx+side*8,yy,xx-side*8,yy+8,p.trim,.9);
        line(g,xx-side*15,yy-8,xx+side,yy,p.trim,.8);line(g,xx+side,yy,xx-side*15,yy+8,p.trim,.8);
      }
    }
  }
  function drawShell(g,s,input){
    const p=theme(s,input),W=s.w*T,H=s.h*T,industrial=s.floor==='B1'||s.id==='projection';
    g.save();
    // Back wall elevation: three solid tiles with a cornice, recessed panels and skirting.
    rect(g,0,0,W,3*T,'#152322');
    const wall=g.createLinearGradient(0,13,0,95);wall.addColorStop(0,p.wall);wall.addColorStop(.62,p.wall);wall.addColorStop(1,p.panel);g.fillStyle=wall;g.fillRect(T,12,W-2*T,83);
    rect(g,T,4,W-2*T,9,'#22302a');rect(g,T,12,W-2*T,2,'#b6b1966b');rect(g,T,17,W-2*T,4,p.trim);
    rect(g,T,22,W-2*T,3,'#142923b0');
    const pitch=industrial?86:102;
    for(let x=T+13;x<W-T-14;x+=pitch)panel(g,x,33,Math.min(pitch-13,W-T-13-x),47,p);
    rect(g,T,84,W-2*T,5,p.trim);rect(g,T,89,W-2*T,3,'#273c30');rect(g,T,92,W-2*T,4,'#c2b38a60');
    if(!industrial)for(let x=T+9;x<W-T-10;x+=5*T)pilaster(g,x,p);
    else{
      for(let x=T+12;x<W-T;x+=5*T){
        rect(g,x,26,8,58,'#a8b59a38');line(g,x+2,28,x+2,82,'#d9dfc763',1);rect(g,x-2,26,12,3,'#b7bc9a58');
      }
      // A contained services conduit, mounted on the wall rather than the walking floor.
      line(g,T+8,29,W-T-8,29,'#172e2b',5);line(g,T+8,28,W-T-8,28,'#9fac974f',2);
      for(let x=T+28;x<W-T;x+=79){rect(g,x,26,3,6,'#a2ad92');rect(g,x+1,27,1,4,'#283b30');}
    }
    wallTitle(g,s,p);
    for(const x of [2.55*T,W-2.55*T])sconce(g,x,52,p);
    // Side and lower cutaway walls have a stone cap and a shaded inward face.
    for(const x of [0,W-T]){
      const q=g.createLinearGradient(x,0,x+T,0);q.addColorStop(0,x===0?'#121f1f':p.wall);q.addColorStop(.55,p.wall);q.addColorStop(1,x===0?p.wall:'#121f1f');
      g.fillStyle=q;g.fillRect(x,0,T,H);
      rect(g,x+5,4,22,H-8,'#18292480');rect(g,x+8,7,16,H-14,p.wall);
      const edge=x===0?T-4:x+1;
      rect(g,edge,3*T,3,H-4*T,p.trim);rect(g,x===0?T-1:x,3*T,1,H-4*T,'#112822');
      for(let y=3*T+15;y<H-T;y+=64)line(g,x+8,y,x+24,y,'#101f1a49',1.1);
    }
    rect(g,0,H-T,W,T,'#1b2c25');rect(g,4,H-T+5,W-8,23,p.wall);rect(g,3,H-T+3,W-6,3,p.trim);
    rect(g,7,H-T+10,W-14,12,'#21352b54');line(g,0,H-T+.4,W,H-T+.4,'#132b25',1.5);
    // Clear openings are painted back to floor material before the separate door painter.
    // This is aligned with the exact doorway cell, including side stair portals.
    for(const d of s.doors||[]){
      if(d.x===0||d.x===s.w-1){
        const x=d.x*T,y=d.y*T;rect(g,x,y,T,T,p.floor);rect(g,x,y+1,T,1,p.trim+'cc');rect(g,x,y+T-2,T,1,p.trim+'88');
      }else if(d.y===s.h-1){
        const x=d.x*T,y=d.y*T;rect(g,x,y,T,T,p.floor);line(g,x,y+2,x+T,y+2,p.trim,1.2);
      }else if(d.y<3){
        rect(g,d.x*T,d.y*T,T,3*T-d.y*T,p.panel);rect(g,d.x*T+3,d.y*T+2,T-6,3*T-d.y*T-2,'#12221d');
      }
    }
    g.restore();
  }
  function drawAccents(g,s,input){
    const p=theme(s,input),W=s.w*T,H=s.h*T;
    g.save();floorClip(g,s);
    // Restrained light is composited after furniture to place everything in one interior.
    // Alpha stays low: furniture silhouettes and evidence markers remain legible.
    const cool=s.floor==='B1'||s.id==='projection';
    for(const x of [2.55*T,W-2.55*T])glow(g,x,3*T+12,90,79,cool?'#e3efc51b':'#ffdda51d');
    if(s.id==='lobby'){
      glow(g,W/2,11*T,145,132,'#f9e6b117');
      // A floor entry wordmark sits in the clear approach below the reception island.
      g.textAlign='center';g.font='600 8px Georgia,serif';g.fillStyle='#574f3f70';g.fillText('E U N H A  ·  1 9 7 8',W/2,21*T+12);
    }
    if(s.id==='theatre'){
      const q=g.createLinearGradient(0,6*T,0,10*T);q.addColorStop(0,'#eee6d118');q.addColorStop(1,'#eee6d100');g.fillStyle=q;g.fillRect(4*T,6*T,16*T,4*T);
    }
    if(s.id==='projection')glow(g,W/2,7*T,132,75,'#a7e1ce13');
    // Tiny corner fasteners strengthen scale on the technical floors.
    if(cool){
      for(const x of [T+16,W-T-16])for(let y=3*T+16;y<H-T;y+=96){ellipse(g,x,y,1.4,1.4,'#202f28a1');ellipse(g,x-.3,y-.4,.7,.7,'#d6d9bc91');}
    }
    g.restore();
  }
  window.EUNHA_V18_SURFACES=Object.freeze({drawFloor,drawShell,drawAccents,themeFor,version:'eunha-architecture-v18'});
})();
