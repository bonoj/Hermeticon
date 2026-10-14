import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {createHermeticon} from '../hermeticon.js';
import {inspectObjectSpace} from '../observation/world-space.js';
import {createSphericalBody} from '../physics/spherical-body.js';

/**
 * DESIGN CONTRACT: see ./HERMETICON_EYE.md for character, anatomy,\n * attention and locomotion.\n * COMPOSABLE CONTRACT — nested Hermeticon eye.
 * Inputs: {parent,id}; parent is the rendered Genesis world.content.
 * Mount chain MUST be parent -> root -> vessel.group -> vessel.content
 * -> interior -> instanced BB eye. Both parent.add(root) and
 * vessel.group.add(vessel.content) are required (the missing first link
 * caused the entire eye orb to vanish on 2026-10-14).
 * Eye anatomy faces local +Z; brass meridian and iris rotate together.
 * World coordinates: mobile inside inner radius 10.07, scaled shell radius 1.28125;
 * Uses terrain.sample for collision; gaze follows interest, not camera lock.
 * Exposes {group,childWorld,update,contactBead,inspect}. This factory
 * does not own Genesis updates; caller must isolate experimental failures.
 * If invisible: inspect attachment and world-space diagnostics FIRST,
 * then deployed runtime; do not randomly move the eye or alter terrain.
 */
export function createHermeticonDrone({parent,id='drone-1',terrain=null,offset=()=>({x:0,z:0}),observe=()=>[]}={}){
 const root=new T.Group();root.name='Hermeticon eye '+id;
 const vessel=createHermeticon();
 vessel.group.scale.setScalar(.125);
 vessel.group.rotation.x=Math.PI/2; // brass equator normal points along the iris (+Z)
 // Glass remains spatially steady while the ocular meridian rotates around it.
 for(const child of [...vessel.group.children])if(child.name==='Hermeticon glass'){
  vessel.group.remove(child);child.scale.setScalar(.125);root.add(child);
 }
 root.add(vessel.group);
 if(parent)parent.add(root);
 vessel.group.add(vessel.content);
 const interior=new T.Group();interior.name='BB eye interior '+id;
 interior.rotation.x=-Math.PI/2; // cancel brass' fixed local mounting rotation
 vessel.content.add(interior);
 // Eye anatomy faces +Z. Cancel the static meridian alignment here;
 // the shared root then rotates both iris and brass together.
 const geometry=new T.IcosahedronGeometry(1,1);
 const material=new T.MeshStandardMaterial({roughness:.45,metalness:.03,emissive:0x161b24,emissiveIntensity:.12});
 const points=[],colors=[],base=[];
 const push=(x,y,z,r,color,kind=0,phase=0)=>{
  points.push([x,y,z,r,kind,phase]);colors.push(new T.Color(color));base.push([x,y,z]);
 };
 // The globe is white sclera; the iris and pupil are built into its forward surface.
 // Fibonacci distribution avoids latitude clustering and is cheap to animate.
 const N=2700,gr=(1+Math.sqrt(5))/2;
 for(let i=0;i<N;i++){
  const y=1-2*(i+.5)/N,a=2*Math.PI*i/gr,h=Math.sqrt(1-y*y);
  const x=Math.cos(a)*h,z=Math.sin(a)*h;
  const rho=Math.hypot(x,y),front=z>0;
  let color=0xf1e8df,r=.17,kind=0;
  // Projected iris radius must match raised fiber geometry: no white BBs underneath.
  if(front&&rho<.23){color=0x080e1a;r=.15;kind=2}
  else if(front&&rho<.69){
   const theta=Math.atan2(y,x),fiber=Math.sin(theta*73+rho*39)+Math.sin(theta*117-rho*27);
   color=fiber>1?0x95e5df:fiber>0?0x43a6b7:fiber>-.8?0x23667d:0x183c5b;
   r=.155;kind=1;
  }else if(front&&rho<.73){color=0x172b3c;kind=1}
  // Capillary veins are drawn below as coherent branching paths rather than
  // random red speckles selected from the Fibonacci globe.

  push(x*7.25,y*7.25,z*7.25,r,color,kind,i*2.399963);
 }
 // Branching scleral vessels: continuous dotted polylines following the globe.
 // Roots start at the rim, travel inward, and split into finer capillaries.
 // Each bead follows a spherical surface point so the veins remain anatomical.
 const vesselPoint=(rho,a)=>{
  const rr=Math.min(.9999,rho),z=Math.sqrt(1-rr*rr)*7.25+.11;
  return [Math.cos(a)*rr*7.25,Math.sin(a)*rr*7.25,z];
 };
 const vesselBranch=(startR,endR,startA,curve,thickness,seed)=>{
  const steps=Math.ceil((startR-endR)*115);
  for(let j=0;j<=steps;j++){
   const t=j/steps,rho=startR+(endR-startR)*t;
   const angle=startA+curve*t+.035*Math.sin(t*9+seed)+.015*Math.sin(t*21+seed*3);
   const [x,y,z]=vesselPoint(rho,angle);
   push(x,y,z,thickness*(.9-.45*t),t>.7?0xb95562:0xa42f42,3,seed+j);
  }
 };
 for(let k=0;k<21;k++){
  const a=k*Math.PI*2/21+.16*Math.sin(k*4.7);
  const inner=.76+.035*Math.sin(k*3.2);
  const bend=.12*Math.sin(k*2.6);
  vesselBranch(.985,inner,a,bend,.088,k);
  for(let b=0;b<2;b++){
   const fork=.35+b*.27;
   const r=.985+(inner-.985)*fork;
   const branchA=a+bend*fork+.035*Math.sin(fork*9+k);
   vesselBranch(r,Math.min(r-.045,inner+.035),branchA,(b?1:-1)*(.075+.035*Math.sin(k+b)),.055,k*3+b+1);
  }
 }
 // Raised iris radial fibers and dark, deep pupil give a human eye readable depth.
 for(let i=0;i<650;i++){
  const a=i*2.399963,rad=.25+.4*((i*37)%653)/653;
  const x=Math.cos(a)*rad*7.25,y=Math.sin(a)*rad*7.25;
  const z=Math.sqrt(1-rad*rad)*7.25+.17;
  const stripe=Math.sin(a*67+rad*40);
  push(x,y,z,.105,stripe>.25?0x9cdbd2:stripe<-.3?0x174257:0x3d9fb2,1,i);
 }
 // Subtle wet catchlight, assembled from small pale BBs.
 for(let i=0;i<45;i++){
  const a=i*2.399963,rad=Math.sqrt((i+.5)/45)*.11;
  const x=(-.23+Math.cos(a)*rad)*7.25,y=(.31+Math.sin(a)*rad)*7.25;
  const d=Math.hypot(x/7.25,y/7.25);
  push(x,y,Math.sqrt(1-d*d)*7.25+.35,.13,0xf9ffff,4,i);
 }
 const beads=new T.InstancedMesh(geometry,material,points.length);
 beads.name='Moving anatomical BBs';beads.frustumCulled=false;
 beads.instanceMatrix.setUsage(T.DynamicDrawUsage);
 const dummy=new T.Object3D();
 for(let i=0;i<points.length;i++)beads.setColorAt(i,colors[i]);
 if(beads.instanceColor)beads.instanceColor.needsUpdate=true;
 interior.add(beads);
 let time=0,beadContacts=0,arrivals=0,blocked=0,glassVisits=0;
 const EYE_RADIUS=1.30,FREE_RADIUS=10.07-EYE_RADIUS-.13;
 const gaze=new T.Vector3(),velocity=new T.Vector3(),destination=new T.Vector3(0,5.2,5.1);
 const lookPoint=new T.Vector3();
 const cameraPosition=new T.Vector3(),trial=new T.Vector3(),probe=new T.Vector3(),direction=new T.Vector3();
 const targetQuat=new T.Quaternion(),lookMatrix=new T.Matrix4();
 const stationAnchor=new T.Vector3(),stationTarget=new T.Vector3(),stationVelocity=new T.Vector3();
 const meridianMount=new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),Math.PI/2);
 const UP=new T.Vector3(0,1,0);
 let cameraRef=null,mode='observe',pause=0,routeAge=25;
 let wallCorrections=0,frameRebases=0;
 let lastOffset={...offset()};
 const crossingPoint=new T.Vector3();
 let rng=741;
 const random=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296};
 const ease=t=>{const u=Math.max(0,Math.min(1,t));return u*u*(3-2*u)};
 // Terrain.sample is the authoritative signed field: positive is solid.
 // The geometry's local X/Z is shifted by Wanderer's offset, so undo that
 // shift for collision sampling. Above/below +/-3.6 is always clear.
 const solidAt=(x,y,z)=>{
  if(!terrain||y>3.6||y< -3.6)return false;
  const o=offset();return terrain.sample(x+o.x,y,z+o.z)>0;
 };
 const body=createSphericalBody({radius:EYE_RADIUS,innerRadius:10.07,solidAt,margin:.13});
 const clearAt=p=>body.valid(p);
 const clearSegment=(a,b)=>body.sweep(a,b);
 // Crossing the slab is only legal where a whole eye fits through a bore.
 // The waypoint at the slab's midplane forces a real aperture crossing.

 // Betwixt Observer inheritance: sense -> acquire -> track -> investigate.
 // Observations are supplied by Genesis; the eye never knows species internals.
 let focus=null,focusSince=0,attentionChanges=0,lastObservationCount=0,nextSense=0;
 let belowVisits=0,belowSeconds=0,desiredHemisphere=-1;
 const memories=new Map();
 const seen=new Map();
 let observations=[];
 // Optical visibility is a point ray, not the full-body swept-volume
 // collision test. A subject on the ground must remain visible from above.
 const visibleTarget=entry=>{
  const p=entry.position;
  if(!Array.isArray(p)||p.length!==3||!p.every(Number.isFinite))return false;
  const v=new T.Vector3(...p),distance=v.distanceTo(root.position);
  if(distance>14||distance<.01)return false;
  const steps=Math.max(1,Math.ceil(distance/.45));
  for(let i=1;i<steps;i++){
   probe.copy(root.position).lerp(v,i/steps);
   if(solidAt(probe.x,probe.y,probe.z))return false;
  }
  return true;
 };
 const sense=()=>{
  if(time<nextSense)return;
  nextSense=time+.35;
  try{observations=(observe()||[]).filter(visibleTarget)}catch(error){observations=[];console.warn('Eye observation unavailable',error)}
  lastObservationCount=observations.length;
  for(const c of observations)seen.set(c.id,{position:c.position.slice(),time});
  for(const [id,m] of seen)if(time-m.time>18)seen.delete(id);
  if(focus){const fresh=observations.find(c=>c.id===focus.id);
   if(fresh)focus=fresh;
   else if(time-focusSince>1.2)focus=null;
  }
 };
 const chooseDestination=()=>{
  sense();
  const candidates=observations;
  // Retain attention unless its subject disappears or becomes occluded.
  const current=candidates.find(c=>c.id===focus?.id);
  const best=candidates.reduce((a,b)=>{
   const score=c=>(c.salience||1)/(1+.11*root.position.distanceTo(new T.Vector3(...c.position)))+(c.id===focus?.id?0.7:0)-(memories.get(c.id)||0)*.32;
   return !a||score(b)>score(a)?b:a;
  },null);
  const chosen=current&&time-focusSince<6?current:best;
  if(chosen){
   if(focus?.id!==chosen.id){focusSince=time;attentionChanges++}
   focus=chosen;mode='investigate';
   const p=new T.Vector3(...chosen.position);
   // Stop at a vantage point instead of colliding with the subject.
   const away=root.position.clone().sub(p).normalize();
   if(away.lengthSq()<.01)away.set(0,1,0);
   // Viewing from afar is normal; approaching is unusual.
   destination.copy(p).addScaledVector(away,5.0);
   if(!clearAt(destination)||!clearSegment(root.position,destination)){
    destination.copy(root.position);mode='observe';
   }
   return true;
  }
  if(focus)memories.set(focus.id,(memories.get(focus.id)||0)+1);
  focus=null;
  // An occasional expedition through a genuinely sphere-sized opening.
  // At y=0, search for a bore that fits the whole eye, not its center.
  if(random()<.65&&root.position.y>1.5){
   const sign=root.position.y>=0?1:-1;
   const candidates=[];
   for(let x=-6;x<=6;x+=1.2)for(let z=-6;z<=6;z+=1.2){
    const middle=new T.Vector3(x,0,z);
    if(clearAt(middle))candidates.push(middle);
   }
   candidates.sort((a,b)=>a.distanceToSquared(root.position)-b.distanceToSquared(root.position));
   for(const middle of candidates){
    const entry=middle.clone().setY(sign*2.8);
    if(clearAt(entry)&&clearSegment(root.position,entry)&&clearSegment(entry,middle)){
     destination.copy(entry);mode='find-bore';desiredHemisphere=-sign;
     crossingPoint.copy(middle);return true;
    }
   }
  }
  if(cameraRef&&random()<.08){
   cameraRef.getWorldPosition(cameraPosition);
   destination.copy(cameraPosition).normalize().multiplyScalar(FREE_RADIUS-.25);
   mode='inspect-glass';glassVisits++;
   if(clearAt(destination)&&clearSegment(root.position,destination))return true;
  }
  // Below the slab, linger instead of immediately seeking the surface.
  if(root.position.y< -1.5&&random()<.85){mode='observe';destination.copy(root.position);return true}
  // No perceptible subject: idle scanning and short exploratory movement.
  mode='drift';
  if(random()<.75){destination.copy(root.position);mode='observe';return true}
  for(let i=0;i<28;i++){
   const angle=random()*Math.PI*2,r=2+random()*5;
   const candidate=root.position.clone().add(new T.Vector3(Math.cos(angle)*r,(random()-.5)*4,Math.sin(angle)*r));
   if(clearAt(candidate)&&clearSegment(root.position,candidate)){destination.copy(candidate);return true}
  }
  destination.copy(root.position);return false;
 };
 const render=()=>{
  for(let i=0;i<points.length;i++){
   const [x,y,z,r,kind,phase]=points[i];
   const pulse=kind===1?.035*Math.sin(time*2.1+phase*.017):kind===3?.025*Math.sin(time*1.4+phase):.012*Math.sin(time*1.2+phase);
   dummy.position.set(x*(1+pulse/7.25),y*(1+pulse/7.25),z*(1+pulse/7.25));
   dummy.scale.setScalar(r*(1+.09*Math.sin(time*2.3+phase)));
   dummy.updateMatrix();beads.setMatrixAt(i,dummy.matrix);
  }
  beads.instanceMatrix.needsUpdate=true;
 };
 root.position.set(0,5.2,5.1);
 stationAnchor.copy(root.position);
 // Wanderer scrolls the terrain under a fixed Hermeticon boundary.
 // Preserve the eye's terrain/world coordinates across that rebase. Only
 // boundary encroachment may subsequently displace the eye physically.
 const rebase=()=>{
  const next=offset(),dx=next.x-lastOffset.x,dz=next.z-lastOffset.z;
  if(!dx&&!dz)return;
  root.position.x-=dx;root.position.z-=dz;
  destination.x-=dx;destination.z-=dz;
  stationAnchor.x-=dx;stationAnchor.z-=dz;
  stationTarget.x-=dx;stationTarget.z-=dz;
  crossingPoint.x-=dx;crossingPoint.z-=dz;
  if(focus)focus={...focus,position:[focus.position[0]-dx,focus.position[1],focus.position[2]-dz]};
  lastOffset={x:next.x,z:next.z};frameRebases++;
 };
 const enforceWall=()=>{
  if(body.valid(root.position))return;
  const result=body.resolveBoundary(root.position);
  if(!result.ok){blocked++;mode='collision-unresolved';velocity.set(0,0,0);stationVelocity.set(0,0,0);return}
  if(result.corrected){
   destination.copy(root.position);stationAnchor.copy(root.position);
   velocity.set(0,0,0);stationVelocity.set(0,0,0);
   wallCorrections++;mode='wall-clearance';routeAge=0;pause=2;
  }
 };

 const update=(dt,camera)=>{
  const step=Math.max(0,Math.min(dt,.06));time+=step;
  rebase();enforceWall();
  if(camera?.position)cameraRef=camera;
  sense();
  if(root.position.y< -1.4)belowSeconds+=step;
  if(mode==='cross-bore'&&root.position.distanceTo(destination)<.35){
   mode='observe';pause=12+random()*15;routeAge=0;
  }
  if(mode==='find-bore'&&root.position.distanceTo(destination)<.35){
   destination.copy(crossingPoint).setY(desiredHemisphere*2.8);
   if(clearAt(destination)&&clearSegment(root.position,destination)){
    mode='cross-bore';if(desiredHemisphere<0)belowVisits++;
    routeAge=0;
   }else{mode='observe';routeAge=25}
  }
  if(focus&&mode==='investigate'&&time-focusSince>7){
   memories.set(focus.id,(memories.get(focus.id)||0)+1);
   focus=null;routeAge=25;
  }
  if(pause>0){pause-=step;velocity.multiplyScalar(Math.exp(-step*6));}
  else{
   routeAge+=step;
   if((routeAge>24||root.position.distanceTo(destination)<.28)&&mode!=='find-bore'&&mode!=='cross-bore'){
    {arrivals++;pause=3+random()*7;routeAge=0;chooseDestination();}
   }
   direction.copy(destination).sub(root.position);
   const distance=direction.length();
   if(distance>.001){
    direction.divideScalar(distance);
    // Acceleration and braking: slow at start/end, cruise in between.
    const desiredSpeed=Math.min(.65,Math.sqrt(2*.55*distance));
    const blend=Math.min(1,step*.8);
    velocity.lerp(direction.multiplyScalar(desiredSpeed),blend);
    trial.copy(root.position).addScaledVector(velocity,step);
    if(body.tryMove(root.position,trial.clone().sub(root.position))){}
    else{blocked++;velocity.set(0,0,0);mode='observe';routeAge=25;}
   }
  }
  // Constant low-energy station keeping, independent of attention or travel.
  // Anchor follows deliberate travel but not every oscillation, preventing drift.
  stationAnchor.lerp(root.position,Math.min(1,step*.32));
  stationTarget.copy(stationAnchor).add(new T.Vector3(
   .16*Math.sin(time*.73)+.09*Math.sin(time*1.19+1.2),
   .19*Math.sin(time*.91+.5)+.07*Math.sin(time*1.67),
   .14*Math.cos(time*.61+.8)+.08*Math.sin(time*1.31)
  ));
  // While traveling, hover around the moving body; while idle, hover around anchor.
  direction.copy(stationTarget).sub(root.position).multiplyScalar(1.2);
  stationVelocity.addScaledVector(direction,step);
  stationVelocity.multiplyScalar(Math.exp(-step*1.9));
  trial.copy(root.position).addScaledVector(stationVelocity,step);
  if(body.tryMove(root.position,trial.clone().sub(root.position))){}
  else stationVelocity.set(0,0,0);
  // The meridian is the eye's forward-bearing hardware: rotate the entire
  // vessel and iris as one, never the anatomy independently.
  if(focus)lookPoint.fromArray(focus.position);
  else if(mode==='inspect-glass'&&cameraRef)cameraRef.getWorldPosition(lookPoint);
  else if(velocity.lengthSq()>.025)lookPoint.copy(root.position).add(velocity);
  else lookPoint.copy(destination);
  lookMatrix.lookAt(lookPoint,root.position,UP);
  targetQuat.setFromRotationMatrix(lookMatrix);
  vessel.group.quaternion.slerp(targetQuat.clone().multiply(meridianMount),Math.min(1,step*.85));
  render();
 };
 const contactBead=(x,y,z,r,vx,vy,vz)=>{
  const delta=root.position.clone().sub(new T.Vector3(x,y,z));
  const d=delta.length(),limit=1.29+r;
  if(d>=limit)return false;
  delta.normalize();velocity.addScaledVector(delta,Math.min(2,Math.hypot(vx,vy,vz)*.15+.15));
  beadContacts++;return true;
 };
 render();
 const childWorld={id:id+'-world',group:interior,seed:741,inspect:()=>({id:id+'-world',representation:'BB eye',beads:points.length})};
 return {group:root,childWorld,update,contactBead,inspect:()=>({name:'Hermeticon eye',id,position:root.position.toArray(),mode,worldPosition:[root.position.x+lastOffset.x,root.position.y,root.position.z+lastOffset.z],frameRebases,wallCorrections,belowVisits,belowSeconds,focus:focus?.id||null,focusAge:focus?time-focusSince:null,attentionChanges,lastObservationCount,remembered:seen.size,visited:memories.size,velocity:velocity.toArray(),destination:destination.toArray(),arrivals,blocked,glassVisits,routeAge,visible:root.visible,attached:!!root.parent,vesselVisible:vessel.group.visible,beadInstances:beads.count,space:inspectObjectSpace(root,cameraRef),beadContacts,childWorld:childWorld.inspect()})};
}
