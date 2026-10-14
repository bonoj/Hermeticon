import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
// Adapted from Interstice/betwixt SixCitiesCatch baseline observer swarm.
// Twelve miniature glass observers, with original hover/wander/return,
// investigation/dismissal phases and pairwise sphere separation.
export function createObserverSwarm({parent,terrain=null,offset=()=>({x:0,z:0}),seed=741}={}){
 const root=new T.Group();root.name='Betwixt observer swarm';parent?.add(root);
 const glassMat=new T.MeshPhysicalMaterial({color:0xb8dfe5,transparent:true,opacity:.23,roughness:.12,metalness:.08,depthWrite:false});
 const whiteMat=new T.MeshStandardMaterial({color:0xe8e5dc,roughness:.48});
 const irisMat=new T.MeshStandardMaterial({color:0x596d6d,roughness:.42,side:T.DoubleSide});
 const pupilMat=new T.MeshStandardMaterial({color:0x151817,roughness:.36,side:T.DoubleSide});
 const brass=new T.MeshStandardMaterial({color:0xb99a60,roughness:.34,metalness:.75});
 const glassGeo=new T.IcosahedronGeometry(.50,3),whiteGeo=new T.SphereGeometry(.20,22,14);
 const irisGeo=new T.CircleGeometry(.105,24),pupilGeo=new T.CircleGeometry(.052,24);
 const ringGeo=new T.TorusGeometry(.535,.035,8,32);
 const bindingGeo=new T.CylinderGeometry(.027,.034,.11,8);
 let state=seed>>>0;const rand=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296};
 const safeY=(x,z,y)=>terrain?Math.max(y,terrainHeight(x,z)+1.25):y;
 const terrainHeight=(x,z)=>{
  if(!terrain?.sample)return -3.6;
  const o=offset();
  // Find the highest solid-to-air boundary using the terrain signed field.
  let prev=terrain.sample(x+o.x,7,z+o.z)>0;
  for(let y=6.8;y>=-4.5;y-=.2){
   const solid=terrain.sample(x+o.x,y,z+o.z)>0;
   if(solid&&!prev)return y+.2;
   prev=solid;
  }
  return -3.6;
 };
 const center=new T.Vector3(0,5.5,0);
 const home=center.clone();
 const pick=(homeward=false)=>{
  const angle=rand()*Math.PI*2,radius=homeward?1+rand()*2:2+rand()*4;
  const x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;
  return new T.Vector3(x,safeY(x,z,homeward?home.y+rand():4+rand()*3),z);
 };
 const swarm=[];
 for(let i=0;i<12;i++){
  const node=new T.Group();node.name='catch:observer:'+i;root.add(node);
  const glass=new T.Mesh(glassGeo,glassMat);node.add(glass);
  const eye=new T.Group();eye.name='observer:eye';node.add(eye);
  eye.add(new T.Mesh(whiteGeo,whiteMat));
  const iris=new T.Mesh(irisGeo,irisMat);iris.position.z=.188;eye.add(iris);
  const pupil=new T.Mesh(pupilGeo,pupilMat);pupil.position.z=.191;eye.add(pupil);
  const seat=new T.Group();seat.name='observer:ocular-seat';node.add(seat);
  const front=new T.Mesh(ringGeo,brass);seat.add(front);
  const back=new T.Mesh(ringGeo,brass);back.position.z=-.11;seat.add(back);
  for(let j=0;j<3;j++){
   const angle=Math.PI/2+j*Math.PI*2/3;
   const binding=new T.Mesh(bindingGeo,brass);
   binding.position.set(Math.cos(angle)*.535,Math.sin(angle)*.535,-.055);
   binding.rotation.x=Math.PI/2;seat.add(binding);
  }
  const angle=i*Math.PI*2/12,rad=1.5+(i%3)*.45;
  node.position.set(Math.cos(angle)*rad,home.y+(i%4)*.32,Math.sin(angle)*rad);
  swarm.push({node,eye,seat,phase:rand()*Math.PI*2,mode:'hover',until:1.5+rand()*7,target:pick(true),speed:2+rand()*1.4});
 }
 let time=0,updates=0,traveling=0,curiosity='idle',separations=0;
 const forward=new T.Vector3(0,0,1),focus=new T.Vector3(0,4.8,0);
 const q=new T.Quaternion();
 const update=dt=>{
  const step=Math.max(0,Math.min(.05,dt));time+=step;updates++;
  const cycle=time%44,phase=cycle<17?'idle':cycle<34?'investigate':'dismiss';
  if(phase!==curiosity){
   curiosity=phase;
   for(let i=1;i<swarm.length;i++){
    const a=swarm[i];
    if(phase==='investigate'){a.mode='investigate';a.until=Infinity}
    else if(phase==='dismiss'){a.mode='return';a.target=pick(true);a.until=Infinity;a.speed=7}
    else{a.mode='hover';a.until=time+2+rand()*4;a.speed=2.5}
   }
  }
  for(let i=1;i<swarm.length;i++)if(phase==='investigate'){
   const a=swarm[i],angle=(i-1)*Math.PI*2/11+time*.23,r=1.4+(i%3)*.28;
   const x=focus.x+Math.cos(angle)*r,z=focus.z+Math.sin(angle)*r;
   a.target.set(x,safeY(x,z,focus.y+(i%4)*.25),z);a.speed=4.2;
  }
  swarm[0].mode='sentinel';swarm[0].until=Infinity;
  swarm[0].target.set(0,6.6,0);
  for(let i=0;i<swarm.length;i++){
   const a=swarm[i];
   if(time>=a.until&&i!==0&&a.mode!=='investigate'){
    if(a.mode==='hover'){a.mode='wander';a.target=pick();a.until=time+6+rand()*9}
    else if(a.mode==='wander'){a.mode='return';a.target=pick(true);a.until=Infinity}
    else{a.mode='hover';a.until=time+4+rand()*5}
   }
   if(a.mode!=='hover'){
    const delta=a.target.clone().sub(a.node.position),distance=delta.length();
    if(a.mode==='return'&&distance<.35){a.mode='hover';a.until=time+4+rand()*5}
    else if(distance>.001){
     const motion=Math.min(distance,a.speed*step);
     const next=a.node.position.clone().addScaledVector(delta,motion/distance);
     if(next.length()<9.45&&(!terrain?.intersectsSphere||!terrain.intersectsSphere(next,.55,offset()))){
      a.node.position.copy(next);traveling++;
     }else{a.mode='hover';a.until=time+1+rand()*2}
    }
   }else a.node.position.y+=Math.sin(time*1.1+a.phase)*step*.12;
   a.node.position.y=Math.min(9.4,safeY(a.node.position.x,a.node.position.z,a.node.position.y));
   const dir=(a.mode==='investigate'||a.mode==='sentinel'?focus.clone().sub(a.node.position):a.target.clone().sub(a.node.position));
   if(dir.lengthSq()>.0001){q.setFromUnitVectors(forward,dir.normalize());a.eye.quaternion.slerp(q,.12);a.seat.quaternion.copy(a.eye.quaternion)}
  }
  for(let pass=0;pass<3;pass++)for(let i=0;i<swarm.length;i++)for(let j=i+1;j<swarm.length;j++){
   const a=swarm[i].node.position,b=swarm[j].node.position,delta=b.clone().sub(a),d=delta.length();
   if(d>=1.12)continue;
   if(d<.00001)delta.set(Math.cos(i+j),.5,Math.sin(i+j)).normalize();else delta.divideScalar(d);
   const push=(1.12-d)*.5+.0001;
   const na=a.clone().addScaledVector(delta,-push),nb=b.clone().addScaledVector(delta,push);
   if(na.length()<9.45&&nb.length()<9.45){a.copy(na);b.copy(nb);separations++}
  }
 };
 return {group:root,update,inspect:()=>({name:'Betwixt observer swarm',count:swarm.length,updates,traveling,curiosity,separations,agents:swarm.map((a,i)=>({id:i,mode:a.mode,position:a.node.position.toArray()}))})};
}
