/* EUNHA CINEMA · architectural rebuild V18. 32px logical units, renderer supersamples. */
(()=>{'use strict';
 const rooms={};
 const room=(id,name,floor,w,h,spawn)=>rooms[id]={id,name,floor,w,h,spawn,objects:[],spots:[],doors:[]};
 const object=(s,type,x,y,w,h)=>s.objects.push({type,x,y,w,h});
 const spot=(s,id,x,y,type)=>s.spots.push({id,x,y,type});
 const link=(a,ax,ay,b,bx,by,aLabel,bLabel)=>{
  const land=(s,x,y)=>y<3?{x,y:3}:y===s.h-1?{x,y:y-1}:x===0?{x:1,y}:x===s.w-1?{x:x-1,y}:{x,y:y-1};
  const pa=land(a,ax,ay),pb=land(b,bx,by);
  a.doors.push({x:ax,y:ay,to:b.id,tx:pb.x,ty:pb.y,label:aLabel});
  b.doors.push({x:bx,y:by,to:a.id,tx:pa.x,ty:pa.y,label:bLabel});
 };
 const lobby=room('lobby','중앙 로비','1F',24,24,{x:10,y:18});
 const ticket=room('ticket','매표소','1F',18,20,{x:9,y:17});
 const office=room('office','관리사무실','1F',20,22,{x:10,y:19});
 const theatre=room('theatre','제1상영관','1F',24,24,{x:12,y:21});
 const projection=room('projection','영사실','2F',22,20,{x:11,y:17});
 const archive=room('archive','기록보관실','2F',20,23,{x:10,y:20});
 const storage=room('storage','설비창고','B1',22,22,{x:11,y:19});
 const workshop=room('workshop','정비 작업실','B1',22,20,{x:10,y:16});
 // Foyer: two waiting salons frame the broad medallion aisle, with a freestanding reception island.
 object(lobby,'poster',2,4,2,2);object(lobby,'poster',20,4,2,2);
 object(lobby,'sofa',3,8,5,2);object(lobby,'sofa',17,8,4,2);
 object(lobby,'table',4,12,3,2);object(lobby,'table',17,12,3,2);
 object(lobby,'desk',10,16,5,2);object(lobby,'plant',3,19,2,2);object(lobby,'plant',19,17,2,2);object(lobby,'noticeboard',20,20,2,2);
 spot(lobby,'scene_c01',12,17,'document');spot(lobby,'scene_c02',20,21,'notice');spot(lobby,'scene_c08',5,13,'document');spot(lobby,'bag_A',4,9,'bag');
 // Ticket hall: a public counter across the centre, with staff passage on either side.
 object(ticket,'cabinet',2,4,4,2);object(ticket,'console',11,4,4,2);object(ticket,'chair',8,5,1,1);
 object(ticket,'counter',3,9,12,2);object(ticket,'plant',2,15,2,2);object(ticket,'bench',12,15,3,2);
 spot(ticket,'scene_c06',3,5,'document');spot(ticket,'scene_c13',12,5,'monitor');
 // Management suite: executive desk, personal papers on a side table, print and filing wall.
 object(office,'cabinet',2,4,4,2);object(office,'printer',14,4,3,2);object(office,'chair',10,6,1,1);
 object(office,'desk',8,8,6,2);object(office,'cabinet',16,10,2,3);object(office,'sofa',3,14,5,2);
 object(office,'table',13,14,3,2);object(office,'plant',3,18,2,2);
 spot(office,'scene_c10',10,9,'object');spot(office,'scene_c11',11,15,'envelope');spot(office,'scene_c15',15,5,'printer');spot(office,'scene_c17',3,5,'document');
 // Full auditorium: raised screen, central processional aisle and generous cross aisles.
 object(theatre,'screen',4,4,16,2);object(theatre,'podium',11,7,2,1);
 for(const y of [10,14,18]){object(theatre,'seats',3,y,7,2);object(theatre,'seats',14,y,7,2);}
 spot(theatre,'scene_c03',11,21,'document');
 // Projection deck: two complete reel machines, a wall of controls, and separate archive access.
 object(projection,'console',3,4,16,2);object(projection,'projector',4,9,4,4);object(projection,'projector',14,9,4,4);
 object(projection,'cabinet',2,15,4,2);object(projection,'poster',19,7,2,2);
 spot(projection,'scene_c04',5,5,'monitor');spot(projection,'scene_c12',16,5,'monitor');spot(projection,'scene_c18',12,18,'card');spot(projection,'scene_c16',20,14,'notice');spot(projection,'bag_B',3,16,'bag');
 // Archive: three stacks, separated by broad cross aisles and a central records passage.
 for(const y of [5,10,15]){object(archive,'shelf',2,y,5,2);object(archive,'shelf',12,y,5,2);}
 object(archive,'boxes',8,17,3,2);
 spot(archive,'scene_c07',4,6,'document');spot(archive,'scene_c14',14,6,'box');spot(archive,'bag_D',14,16,'bag');
 // Lower plant: steel shelving, packed equipment and the generator island.
 object(storage,'shelf',2,5,6,2);object(storage,'shelf',14,5,6,2);object(storage,'shelf',2,10,5,2);object(storage,'shelf',15,10,5,2);
 object(storage,'boxes',3,15,4,3);object(storage,'generator',14,15,5,3);
 spot(storage,'scene_c05',4,6,'document');spot(storage,'bag_C',4,17,'bag');
 object(workshop,'breaker',2,4,5,2);object(workshop,'generator',15,4,4,4);object(workshop,'workbench',7,10,10,2);
 object(workshop,'tools',2,14,4,2);object(workshop,'boxes',16,15,3,2);spot(workshop,'scene_c09',10,11,'document');
 link(lobby,5,23,ticket,9,19,'매표소','중앙 로비');
 link(lobby,18,23,office,10,21,'관리사무실 · 2차 수색','중앙 로비');
 link(lobby,12,2,theatre,12,23,'제1상영관','중앙 로비');
 link(lobby,0,14,projection,11,19,'2F · 영사실','1F · 중앙 로비');
 link(lobby,23,14,storage,11,21,'B1 · 설비창고','1F · 중앙 로비');
 link(projection,21,15,archive,0,17,'기록보관실','영사실');
 link(storage,21,13,workshop,0,13,'정비 작업실','설비창고');
 window.EUNHA_LAYOUT_V18=rooms;
 window.EUNHA_LAYOUT_VERSION='eunha-cinema-rebuilt-v18-20261024';
})();
