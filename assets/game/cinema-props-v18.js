/* Eunha Cinema V18 — authored vector furnishings, in logical 32 px tiles.
   Static artwork is rendered once at the world's chosen resolution. */
(() => {
  'use strict';
  const T=32,TAU=Math.PI*2;
  const C={ink:'#12171d',bronze:'#b28e59',gold:'#e0c18a',walnut:'#71503a',woodLight:'#99704b',woodDark:'#342a26',velvet:'#713442',velvetLight:'#a05a62',velvetDark:'#3e202e',metal:'#43575d',metalLight:'#a0aeaa',paper:'#d7c9a7'};
  function rr(g,x,y,w,h,r=3){r=Math.max(0,Math.min(r,w/2,h/2));g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
  function fill(g,x,y,w,h,c,r=0){if(w<=0||h<=0)return;g.fillStyle=c;if(r){rr(g,x,y,w,h,r);g.fill();}else g.fillRect(x,y,w,h);}
  function line(g,x1,y1,x2,y2,c,w=1){g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();}
  function circle(g,x,y,r,c){if(r<=0)return;g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();}
  function ellipse(g,x,y,rx,ry,c){if(rx<=0||ry<=0)return;g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,TAU);g.fill();}
  function gradient(g,x,y,w,h,colors,vertical=true){const v=g.createLinearGradient(x,y,vertical?x:x+w,vertical?y+h:y);colors.forEach((c,i)=>v.addColorStop(i/(colors.length-1),c));return v;}
  function volume(g,x,y,w,h,top,face,depth=11,r=3){fill(g,x+1,y+3,w,h,'#10171b');fill(g,x,y+depth,w,h-depth,face,r);fill(g,x,y,w,h-depth,top,r);line(g,x+3,y+1,x+w-3,y+1,'#f1e0bd45');line(g,x+3,y+h-2,x+w-3,y+h-2,'#0d131a75');}
  function shadow(g,w,h,type){g.save();g.shadowColor='#03080d60';g.shadowBlur=7;g.shadowOffsetX=3;g.shadowOffsetY=5;if(['plant','coatstand','rail','chair','filmcan','podium'].includes(type))ellipse(g,w*.5,h-5,w*(type==='plant'?.28:.4),Math.min(7,h*.12),'#07121935');else fill(g,5,Math.max(6,h*.4),w-10,h*.53,'#07121935',5);g.restore();}
  function wood(g,x,y,w,h,dark=false){fill(g,x,y,w,h,gradient(g,x,y,w,h,dark?['#4a332c','#6c4c36','#46322a']:['#98724e','#b28a5f','#79563b'],false),2);g.save();g.beginPath();g.rect(x,y,w,h);g.clip();for(let k=0;k<Math.ceil(h/4);k++){const yy=y+k*4+1;line(g,x+2,yy,x+w-2,yy+Math.sin(k*2.7)*.7,k%3?'#231c171e':'#ead0a02a',.5);}g.restore();}
  function screw(g,x,y){circle(g,x,y,1.15,'#c3b99a');line(g,x-.6,y+.5,x+.6,y-.5,'#384347',.6);}
  function label(g,text,x,y,size=6,c=C.paper){g.save();g.font=`600 ${size}px system-ui,sans-serif`;g.textAlign='center';g.textBaseline='middle';g.fillStyle=c;g.fillText(text,x,y);g.restore();}
  function paper(g,x,y,w=20,h=14,angle=-.05){g.save();g.translate(x,y);g.rotate(angle);fill(g,1,2,w,h,'#19202644');fill(g,0,0,w,h,'#d5c9ad',.8);fill(g,2.5,3,w-5,1,'#82786775');for(let k=6;k<h-2;k+=3)fill(g,3,k,w-7-(k%3)*2,.6,'#80766280');g.restore();}
  function mug(g,x,y){ellipse(g,x+1,y+2,4.6,2.9,'#101b2540');fill(g,x-3,y-3,6,6,'#e5d5b5',2);ellipse(g,x,y-3,3,1.7,'#c3b693');ellipse(g,x,y-3,2.1,1.05,'#4d3328');g.strokeStyle='#c7b798';g.lineWidth=1.4;g.beginPath();g.arc(x+3,y-1,2.1,-1.7,1.6);g.stroke();}
  function monitor(g,x,y,w=24,h=20,green=false){fill(g,x+w*.4,y+h-1,w*.2,5,'#19252c',1);fill(g,x+w*.2,y+h+3,w*.6,2,'#738580',1);volume(g,x,y,w,h,'#52666b','#23343c',3,2);fill(g,x+3,y+3,w-6,h-7,gradient(g,x,y,w,h,green?['#547e75','#1c3e3b']:['#66888e','#243d49']),1);fill(g,x+4,y+4,w-9,1.2,'#d2e2cb42');for(let yy=y+6;yy<y+h-6;yy+=3)line(g,x+5,yy,x+w-6,yy,'#afd9bb26',.5);circle(g,x+w-4,y+h-3,.9,'#cba76a');}
  function reel(g,x,y,r){ellipse(g,x+1,y+3,r+1,r*.84,'#0d172655');const gr=g.createRadialGradient(x-3,y-5,1,x,y,r);gr.addColorStop(0,'#bdc4b8');gr.addColorStop(.7,'#73898b');gr.addColorStop(1,'#273f49');circle(g,x,y,r,gr);g.strokeStyle='#d2d4bb';g.lineWidth=.8;g.beginPath();g.arc(x,y,r-1.5,0,TAU);g.stroke();for(let k=0;k<5;k++){const a=k*TAU/5-.7;circle(g,x+Math.cos(a)*r*.57,y+Math.sin(a)*r*.57,r*.22,'#2c434d');circle(g,x+Math.cos(a)*r*.57-1,y+Math.sin(a)*r*.57-1,r*.13,'#182a35');}circle(g,x,y,r*.16,'#cfb27c');circle(g,x,y,r*.065,'#3e4e50');}
  function sofa(g,w,h){
    const legs=[10,w-16];for(const x of legs){fill(g,x,h-10,5,8,'#8f744e',1);fill(g,x,h-5,5,2,'#d2b67e');}
    fill(g,4,11,w-8,h-18,C.velvetDark,8);fill(g,7,5,w-14,h*.42,gradient(g,0,4,w,h*.42,['#a66368','#783a49','#492433']),7);
    const n=Math.max(2,Math.round(w/38)),cw=(w-24)/n;
    for(let k=0;k<n;k++){const x=12+k*cw;fill(g,x+1,10,cw-3,h*.26,gradient(g,x,10,cw,h*.26,['#bd7b78','#8e4955','#7b3949']),4);line(g,x+4,13,x+cw-5,13,'#f0c7a237',.65);circle(g,x+cw/2,19,1.1,'#662b39');fill(g,x+1,h*.51,cw-3,h*.3,gradient(g,0,h*.51,0,h*.3,['#a25860','#783444','#4e2434']),4);line(g,x+4,h*.52+2,x+cw-5,h*.52+2,'#f2c7b83b',.7);}
    for(const x of [2,w-13]){fill(g,x,18,11,h-28,gradient(g,x,0,11,0,['#8a4954','#512534','#3c202d'],false),5);line(g,x+2,22,x+2,h-16,'#d99b8a42',.8);circle(g,x+5.5,h-17,1,'#b89968');}
    line(g,13,h-12,w-13,h-12,'#c08d67',1.3);
  }
  function table(g,w,h){
    const x=4,y=4,ww=w-8,hh=h-12;
    fill(g,9,h-12,5,9,'#4d3930',1);fill(g,w-14,h-12,5,9,'#4d3930',1);
    volume(g,x,y,ww,hh,'#ac885b','#4f342b',8,5);wood(g,x+3,y+3,ww-6,hh-13);line(g,x+5,y+6,x+ww-5,y+6,'#e4c99855');
    paper(g,w*.24,h*.22,Math.min(26,w*.35),Math.min(17,h*.3),-.1);mug(g,w*.76,h*.32);
    if(w>80){paper(g,w*.55,h*.26,19,13,.1);}
  }
  function plant(g,w,h){
    const cx=w*.5,cy=h*.67,rx=Math.min(w*.25,14);
    ellipse(g,cx+3,h-5,rx+4,4,'#0b161d66');
    const pot=gradient(g,cx-rx,cy,rx*2,h-cy,['#bd9567','#765342','#ac8058'],false);
    g.fillStyle=pot;g.beginPath();g.moveTo(cx-rx,cy);g.lineTo(cx+rx,cy);g.lineTo(cx+rx*.7,h-5);g.quadraticCurveTo(cx,h+1,cx-rx*.7,h-5);g.closePath();g.fill();ellipse(g,cx,cy,rx,4,'#d5b181');ellipse(g,cx,cy,rx-2,2.6,'#302c22');
    const leaves=[[-.8,-.2,-1.4],[.7,-.2,-1.7],[-1,-.6,-2.1],[.95,-.65,-1],[-.3,-1,-1.85],[.4,-1.2,-.8],[0,-1.6,-1.4],[-1.2,-1.1,-2.2],[1.2,-1.1,-.7]];
    leaves.forEach(([dx,dy,a],i)=>{const ex=cx+dx*rx*.85,ey=cy+dy*rx*1.4;line(g,cx,cy,ex,ey,'#385545',1.1);g.save();g.translate(ex,ey);g.rotate(a);g.fillStyle=i%2?'#446d56':'#587c60';g.beginPath();g.moveTo(0,7);g.bezierCurveTo(-10,-1,-9,-11,0,-16);g.bezierCurveTo(9,-9,8,2,0,7);g.fill();line(g,0,4,0,-12,'#b5c09744',.6);g.restore();});
  }
  function desk(g,w,h,kind,scene){
    const wb=kind==='workbench',counter=kind==='counter',d=counter?19:14;
    fill(g,7,h-11,6,9,'#312a27');fill(g,w-13,h-11,6,9,'#312a27');
    volume(g,3,3,w-6,h-10,gradient(g,3,3,w-6,h-d,['#b28b5c','#845c3e']),wb?'#3c4c50':'#493029',d,3);
    wood(g,5,5,w-10,h-d-14,wb);
    const n=Math.max(1,Math.floor(w/40));
    for(let k=0;k<n;k++){const x=9+k*(w-18)/n,ww=(w-18)/n-5;fill(g,x,h-d-7,ww,d-1,wb?'#536265':'#6c4937',1);line(g,x+2,h-d-5,x+ww-2,h-d-5,'#c0a17b55',.65);fill(g,x+ww/2-4,h-d-1,8,1.8,'#bca778',.6);}
    if(counter){
      const stations=Math.max(1,Math.floor(w/100));for(let k=0;k<stations;k++){const x=20+k*(w-35)/stations;monitor(g,x,8,28,19,true);fill(g,x-2,32,33,6,'#283b3f',1);for(let j=0;j<7;j++)line(g,x+j*4,33,x+j*4,36,'#82958a',.5);}
      label(g,'B O X   O F F I C E',w*.57,h-18,Math.min(8,w/30),'#d8b981');
    }else if(wb){
      for(let k=0;k<Math.max(2,Math.floor(w/55));k++){const x=18+k*46;line(g,x,12,x+19,23,'#ced1b9',2);line(g,x+14,16,x+15,25,'#39433f',5);fill(g,x+23,12,10,14,'#bca377',1);screw(g,x+28,16);}
    }else{paper(g,w*.4,9,Math.min(35,w*.3),18,.04);paper(g,w*.62,12,23,16,-.04);mug(g,18,17);if(w>115){fill(g,w-26,10,14,17,'#31444b',2);label(g,'E',w-19,18,7,'#bcad88');}}
  }
  function chair(g,w,h){
    const cx=w/2;fill(g,cx-2,h*.51,4,h*.28,'#253139');line(g,cx,h*.75,cx-10,h-4,'#586468',2);line(g,cx,h*.75,cx+10,h-4,'#586468',2);line(g,cx,h*.75,cx,h-2,'#586468',2);for(const xx of [cx-11,cx+11])circle(g,xx,h-3,2,'#15242c');
    fill(g,4,2,w-8,h*.46,gradient(g,0,0,w,h,['#986064','#61343f','#3c232e']),5);fill(g,5,h*.47,w-10,h*.23,gradient(g,0,0,w,h,['#aa6a68','#6c3541']),4);line(g,7,5,w-7,5,'#d7ae8c66',.75);
  }
  function cabinet(g,w,h,scene,shelf=false){
    const industrial=['storage','workshop','projection'].includes(scene.id),depth=Math.min(15,h*.26);
    volume(g,3,1,w-6,h-5,industrial?'#6a7b7b':'#846142',industrial?'#32454b':'#49342b',depth,2);
    fill(g,6,5,w-12,h-depth-9,industrial?'#253c44':'#392a26',1);
    const columns=Math.max(1,Math.floor((w-14)/35)),cw=(w-16)/columns;
    if(shelf){
      const rows=h>80?3:2,rh=(h-depth-10)/rows;
      for(let row=0;row<rows;row++){
        const yy=7+row*rh;
        for(let col=0;col<Math.max(2,Math.floor((w-16)/17));col++){
          const xx=9+col*17,hh=rh-6;
          if((col+row)%4===0){ellipse(g,xx+7,yy+hh*.58,7,hh*.43,'#9a9e8c');ellipse(g,xx+7,yy+hh*.58,5,hh*.32,'#2c3e42');circle(g,xx+7,yy+hh*.58,1.5,'#d5c4a0');}
          else{const colors=['#9b7651','#617774','#8c5258','#b6a27b','#52646b'];fill(g,xx,yy+2,12,hh,colors[(col+row*2)%colors.length],1);fill(g,xx+3,yy+5,6,3,'#d7ccb0');line(g,xx+2,yy+hh-2,xx+10,yy+hh-2,'#192e334d',.6);}
        }
        fill(g,5,yy+rh-4,w-10,3,industrial?'#97a096':'#b18c5a');fill(g,5,yy+rh-1,w-10,2,'#151f2377');
      }
    }else{
      for(let k=0;k<columns;k++){
        const xx=8+k*cw;fill(g,xx,7,cw-3,h-depth-12,industrial?'#566b70':'#74513b',1);line(g,xx+2,10,xx+cw-6,10,industrial?'#b1c1b45a':'#dab77b55',.7);fill(g,xx+cw-10,h*.4,2,8,'#d2b985',.7);if(industrial){for(let j=0;j<3;j++)fill(g,xx+4,13+j*3,cw-13,.7,'#263c42');}else{g.strokeStyle='#34292188';g.lineWidth=.6;g.strokeRect(xx+4,15,cw-12,Math.max(6,h-depth-25));}
      }
    }
    line(g,6,h-8,w-6,h-8,'#bfa27c66');
  }
  function poster(g,w,h,o){
    const x=4,y=1,ww=w-8,hh=h-9;
    fill(g,x+2,y+4,ww,hh,'#0d192166',2);fill(g,x,y,ww,hh,gradient(g,x,y,ww,hh,['#e2c48b','#80613f','#c9a46a'],false),1);fill(g,x+3,y+3,ww-6,hh-6,'#0b1823');
    const gr=gradient(g,x+5,y+5,ww-10,hh-10,['#4d6871','#1f3346','#392c3a']);fill(g,x+5,y+5,ww-10,hh-10,gr);
    circle(g,w*.54,h*.28,Math.min(ww*.18,14),'#d4b27e');
    g.fillStyle='#152530';g.beginPath();g.moveTo(x+7,y+hh*.73);g.lineTo(w*.38,h*.41);g.lineTo(w*.59,h*.7);g.lineTo(w*.76,h*.37);g.lineTo(w-10,h*.75);g.closePath();g.fill();
    line(g,w*.21,h*.54,w*.77,h*.54,'#bc97804a',.6);label(g,o.label||'잔  상',w/2,h*.7,Math.min(11,w*.18),'#ecdfbf');label(g,'THE LAST SCREENING',w/2,h*.84,Math.min(3.8,w*.055),'#d2b88c');
    line(g,x+5,y+6,x+5,y+hh-5,'#fff5d526',.6);ellipse(g,w*.35,h*.25,ww*.14,hh*.12,'#ffffff08');
  }
  function screen(g,w,h){
    fill(g,1,2,w-2,h-5,'#201e29',2);fill(g,4,5,w-8,h-9,'#562b3b',2);
    const curtain=Math.max(12,Math.min(25,w*.08));
    for(const x of [5,w-curtain-5]){
      for(let k=0;k<curtain;k+=4)fill(g,x+k,5,4,h-12,k%8?'#6f3448':'#9e4c5a');line(g,x+2,5,x+2,h-10,'#d093734c',.75);
    }
    fill(g,curtain+7,6,w-2*curtain-14,h-17,gradient(g,0,6,0,h,['#c8cabc','#e2ddcc','#bac4bf']),1);line(g,curtain+8,8,w-curtain-9,8,'#fbf1cf',1.2);
    label(g,'잔  상',w/2,h*.46,Math.min(20,h*.27),'#6e7b7b');label(g,'A F T E R I M A G E',w/2,h*.7,Math.min(7,h*.09),'#738281');
    fill(g,7,h-10,w-14,7,'#30272c',1);line(g,10,h-9,w-10,h-9,'#a68a61',.8);
  }
  function seats(g,w,h){
    const n=Math.max(1,Math.floor(w/T)),sw=w/n;
    for(let i=0;i<n;i++){
      const x=i*sw+2,ww=sw-4;
      fill(g,x+5,h-12,3,9,'#a28455',1);fill(g,x+ww-8,h-12,3,9,'#a28455',1);
      fill(g,x+2,4,ww-4,h*.48,gradient(g,0,0,0,h,['#b5666a','#743543','#4d2836']),6);fill(g,x+5,7,ww-10,h*.31,'#a4505d',4);line(g,x+7,10,x+ww-7,10,'#d6998770',.8);
      fill(g,x+3,h*.51,ww-6,h*.27,gradient(g,0,h*.51,0,h*.27,['#b15b64','#7c3445','#532739']),4);line(g,x+5,h*.54,x+ww-5,h*.54,'#d98b8277',.8);
      for(const xx of [x,x+ww-4]){fill(g,xx,h*.42,4,h*.34,'#30272d',2);fill(g,xx,h*.42,4,4,'#9b8056',1);circle(g,xx+2,h*.45,1,'#1b2530');}
      label(g,String(i+1).padStart(2,'0'),x+ww/2,h-7,4,'#c6a472');
    }
  }
  function projector(g,w,h){
    const cx=w/2,baseY=h*.72,bodyTop=Math.max(27,h*.35);
    fill(g,9,h-11,w-18,8,'#2d3c43',2);for(const x of [13,w-18])fill(g,x,h-8,5,7,'#8a9a94',1);
    volume(g,7,baseY,w-14,h-baseY-7,'#6c7b78','#273d45',6,3);
    fill(g,w*.3,bodyTop,w*.4,baseY-bodyTop+6,gradient(g,w*.3,0,w*.4,0,['#384f59','#8d9a94','#354f59'],false),3);
    const r=Math.min(w*.22,20),ry=bodyTop-4;
    line(g,cx-2,bodyTop+6,cx-w*.21,ry,'#7d918c',4);line(g,cx+2,bodyTop+6,cx+w*.21,ry,'#7d918c',4);
    reel(g,cx-w*.21,ry,r);reel(g,cx+w*.21,ry,r);
    fill(g,w*.35,bodyTop+12,w*.3,9,'#263f49',2);line(g,w*.39,bodyTop+13,w*.6,bodyTop+13,'#a7b8b1',.6);
    ellipse(g,cx,baseY-7,12,6,'#293e46');ellipse(g,cx,baseY-9,10,5,'#b6c4b7');ellipse(g,cx,baseY-10,6,3.5,'#395d65');ellipse(g,cx-1,baseY-11,3.5,1.7,'#d7d5ac');
    fill(g,13,baseY+4,13,8,'#263c44',1);circle(g,18,baseY+8,2,'#d2ac70');label(g,'E-35',w-20,baseY+9,5,'#c3c9b2');
  }
  function console(g,w,h){
    volume(g,3,4,w-6,h-8,gradient(g,0,4,0,h,['#82928b','#536e72','#364d58']),'#283c45',13,3);
    const count=Math.max(1,Math.floor(w/52));
    for(let k=0;k<count;k++){
      const x=11+k*(w-20)/count;monitor(g,x,6,Math.min(32,(w-20)/count-9),Math.min(25,h*.43),k%2===0);
      for(let q=0;q<4;q++){circle(g,x+3+q*6,h*.65,1.6,q===2?'#ba8c5c':'#9ba995');line(g,x+2+q*6,h*.73,x+3+q*6,h*.73+4,'#182c35',1.2);}
    }
    for(let x=10;x<w-6;x+=9)line(g,x,h-13,x+4,h-13,'#142e37',.8);
  }
  function printer(g,w,h){
    volume(g,4,h*.29,w-8,h*.58,'#b1b6a9','#596c70',10,4);fill(g,11,h*.19,w-22,h*.28,'#1f343c',2);paper(g,13,3,w-26,h*.35,.01);fill(g,8,h*.51,w-16,8,'#2f444c',2);paper(g,w*.22,h*.6,w*.56,h*.24,-.02);circle(g,w-11,h*.36,1.8,'#6da18c');line(g,9,h*.4,w*.4,h*.4,'#e5e4cd',1);
  }
  function boxes(g,w,h){
    const cols=Math.max(1,Math.floor(w/36)),rows=Math.max(1,Math.floor(h/33)),bw=(w-7)/cols,bh=(h-7)/rows;
    for(let yy=0;yy<rows;yy++)for(let xx=0;xx<cols;xx++){
      const x=3+xx*bw+(yy%2?1:0),y=3+yy*bh;
      volume(g,x,y,bw-4,bh-3,'#ac8d61','#73583e',7,1);line(g,x+bw*.5,y+1,x+bw*.5,y+bh-8,'#dfc99e',4);line(g,x+2,y+3,x+bw-7,y+3,'#d6b27c',.6);fill(g,x+5,y+bh-12,Math.min(12,bw-10),4,'#d7c8a3',.6);label(g,'FRAGILE',x+bw/2,y+bh-5,3.1,'#342e28');
    }
  }
  function generator(g,w,h){
    volume(g,4,4,w-8,h-10,'#71817a','#31484f',14,4);
    const grilleW=w*.44;fill(g,10,12,grilleW,h-31,'#1f343d',2);for(let y=16;y<h-22;y+=4)line(g,12,y,8+grilleW,y,'#788b85',1);
    const cx=w*.75,cy=Math.max(19,h*.35),r=Math.min(w*.15,h*.22,19);circle(g,cx,cy,r+2,'#243c45');circle(g,cx,cy,r,'#647f7b');for(let k=0;k<8;k++){const a=k*TAU/8;line(g,cx,cy,cx+Math.cos(a)*r*.85,cy+Math.sin(a)*r*.85,'#1f3b45',2);}circle(g,cx,cy,4,'#b2b9a5');
    fill(g,w*.61,h-31,w*.26,11,'#c5b388',1);label(g,'EUNHA',w*.74,h-25,4.7,'#314349');
    for(let x=7;x<w-7;x+=11){fill(g,x,h-17,6,5,'#c6a765');fill(g,x+5,h-17,5,5,'#2a373d');}
    screw(g,9,8);screw(g,w-9,8);
  }
  function breaker(g,w,h){
    volume(g,3,1,w-6,h-6,'#81918c','#324a53',8,2);fill(g,7,5,w-14,h-19,'#405e65',1);
    const cols=Math.max(2,Math.floor(w/31)),cw=(w-17)/cols;
    for(let k=0;k<cols;k++){
      const x=9+k*cw;fill(g,x,8,cw-4,h-26,'#243c45',1);fill(g,x+4,12,cw-12,7,'#acb7a0',1);line(g,x+6,16,x+cw-10,14,'#536a63',1);fill(g,x+cw/2-3,24,6,Math.max(7,h-44),'#d4b17a',1);fill(g,x+cw/2-3,24,6,4,'#e9d0a2',1);label(g,String(k+1),x+cw/2,h-12,4,'#e2d4b5');
    }
    for(const x of [7,w-7]){screw(g,x,5);screw(g,x,h-10);}
  }
  function tools(g,w,h){
    volume(g,3,1,w-6,h-5,'#a88c62','#574936',8,2);fill(g,6,4,w-12,h-17,'#655842',1);
    for(let y=7;y<h-16;y+=7)for(let x=9;x<w-8;x+=7)circle(g,x,y,.65,'#302f29');
    const count=Math.max(2,Math.floor(w/29));for(let k=0;k<count;k++){
      const x=15+k*(w-24)/count;line(g,x,13,x,h-20,'#c0c3ad',2);g.strokeStyle='#c2c7b0';g.lineWidth=2;g.beginPath();g.arc(x,12,4,.4,2.7);g.stroke();fill(g,x+11,16,4,h-34,'#b88758',1);fill(g,x+8,11,10,5,'#b8c1af',1);
    }
    line(g,6,h-12,w-6,h-12,'#cdb080',1);
  }
  function filmcan(g,w,h){
    const n=Math.max(1,Math.floor(w/31));for(let k=0;k<n;k++){const x=(k+.5)*w/n,ry=Math.min(10,h*.22),rx=Math.min(14,w/n*.42);for(let z=0;z<Math.max(1,Math.floor(h/14)-1);z++){const y=h-8-z*7;fill(g,x-rx,y-5,rx*2,5,'#6d8586',1);ellipse(g,x,y-5,rx,ry,'#9daea4');ellipse(g,x,y-5,rx-3,ry-2,'#7e9693');line(g,x-rx+3,y-5,x+rx-3,y-5,'#cad1b833',.7);}fill(g,x-8,h-15,16,4,'#cebea0',.6);}
  }
  function bench(g,w,h){
    fill(g,8,h-10,5,9,'#46473d');fill(g,w-13,h-10,5,9,'#46473d');
    for(let k=0;k<4;k++){wood(g,3,5+k*(h-16)/4,w-6,(h-17)/4);line(g,6,6+k*(h-16)/4,w-6,6+k*(h-16)/4,'#dac49155',.5);}for(const x of [5,w-9])fill(g,x,h*.25,4,h*.56,'#9d865a',1);
  }
  function displaycase(g,w,h){
    volume(g,3,4,w-6,h-9,'#aa855b','#4b352e',12,3);fill(g,7,7,w-14,h-26,'#243942',2);
    paper(g,w*.2,12,22,Math.max(12,h*.26),.03);reel(g,w*.72,h*.34,Math.min(15,h*.22));fill(g,7,7,w-14,h-26,'#c2d9c91a',2);line(g,12,10,w*.45,h-24,'#e7f5d72e',3);line(g,w*.7,10,w-10,h-26,'#e7f5d71c',1.5);g.strokeStyle='#d2b17d';g.lineWidth=1;g.strokeRect(6,6,w-12,h-24);label(g,'EUNHA COLLECTION',w/2,h-15,5,'#cfb486');
  }
  function luggage(g,w,h){
    volume(g,5,5,w-10,h-10,'#5e5545','#343e3d',8,4);g.strokeStyle='#a89c78';g.lineWidth=1.2;g.strokeRect(9,9,w-18,h-22);fill(g,w/2-6,1,12,5,'#9a8d67',2);fill(g,w*.25,8,3,h-18,'#ad8a5e');fill(g,w*.75-3,8,3,h-18,'#ad8a5e');paper(g,w*.35,h*.35,13,9,.1);
  }
  function rail(g,w,h){const yy=h*.5;for(let x=9;x<w;x+=32){ellipse(g,x,yy+9,6,3,'#615841');fill(g,x-1.5,yy-10,3,19,gradient(g,x-2,0,4,0,['#b99b63','#ede0b3','#776041'],false),1);circle(g,x,yy-11,3,'#d5b681');}line(g,9,yy-7,w-8,yy-7,'#7f3b47',4);line(g,9,yy-8,w-8,yy-8,'#c57675',.7);}
  function podium(g,w,h){
    volume(g,5,3,w-10,h-7,'#a07a51','#49302c',10,2);g.strokeStyle='#c2a06b';g.lineWidth=.8;g.strokeRect(10,h*.45,w-20,h*.4);line(g,w*.6,8,w*.64,-7,'#b7b19c',1.2);circle(g,w*.64,-8,2,'#2b3f47');label(g,'E',w/2,h*.65,7,'#d4b47d');
  }
  function noticeboard(g,w,h){
    for(const x of [w*.2,w*.8-4]){fill(g,x,h-16,4,14,'#806748',1);fill(g,x-3,h-4,10,3,'#b49762',1);}
    volume(g,4,2,w-8,h-14,'#a78457','#513b2e',7,2);
    fill(g,8,6,w-16,h-29,gradient(g,0,6,0,h,['#9b8663','#b29a70','#937953']),1);
    g.strokeStyle='#d4ba86';g.lineWidth=.8;g.strokeRect(7,5,w-14,h-27);
    for(let yy=9;yy<h-25;yy+=5)for(let xx=11;xx<w-9;xx+=7)circle(g,xx+(yy%3),yy,.45,'#5d523248');
    paper(g,w*.18,11,w*.42,h*.36,-.07);paper(g,w*.51,h*.27,w*.3,h*.3,.08);
    circle(g,w*.38,14,1.7,'#7d3f43');circle(g,w*.66,h*.29,1.6,'#527b74');
    label(g,'NOTICE',w/2,h-17,4.6,'#e2c99c');
  }
  function cart(g,w,h){
    for(const xx of [9,w-10])circle(g,xx,h-5,3,'#243943');volume(g,4,h*.58,w-8,h*.28,'#8b9c93','#455d62',7,2);fill(g,6,h*.27,w-12,h*.26,'#a48b63',1);line(g,5,3,5,h-7,'#9ba79b',2);line(g,w-5,3,w-5,h-7,'#9ba79b',2);line(g,5,4,w-5,4,'#b6bca6',2);reel(g,w/2,h*.42,Math.min(12,w*.28));
  }
  const drawers={sofa,table,plant,chair,poster,screen,seats,projector,console,printer,boxes,generator,breaker,tools,filmcan,bench,displaycase,luggage,rail,podium,cart,noticeboard};
  const riseFor=o=>({sofa:5,noticeboard:6,cabinet:9,shelf:10,screen:7,projector:10,coatstand:8,breaker:5,tools:5}[o.type||o.kind]||0);
  function draw(g,o,scene={},theme={}){
    if(!o||!Number.isFinite(o.x)||!Number.isFinite(o.y))return;
    const w=o.w*T,rise=riseFor(o),h=o.h*T+rise;if(w<=0||h<=0)return;
    const type=o.type||o.kind;
    g.save();g.translate(o.x*T,o.y*T-rise);g.lineJoin='round';g.lineCap='round';shadow(g,w,h,type);
    if(['desk','counter','workbench'].includes(type))desk(g,w,h,type,scene);
    else if(type==='cabinet'||type==='shelf')cabinet(g,w,h,scene,type==='shelf');
    else if(drawers[type])drawers[type](g,w,h,o);
    else if(type==='coatstand'){line(g,w/2,h-7,w/2,4,'#997c52',3);for(const dx of [-10,10])line(g,w/2,14,w/2+dx,7,'#b49b6a',2);ellipse(g,w/2,h-5,12,3,'#4c5047');circle(g,w/2,4,3,'#d2ba83');}
    else cabinet(g,w,h,scene,false);
    g.restore();
  }
  window.EUNHA_V18_PROPS={draw,overhang:riseFor,tallTypes:['noticeboard','sofa','cabinet','shelf','screen','projector','coatstand','breaker','tools'],version:'eunha-authored-props-v18',types:[...Object.keys(drawers),'desk','counter','workbench','cabinet','shelf','coatstand']};
})();
