import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {createHermeticon} from '../hermeticon.js';
import {inspectObjectSpace} from '../observation/world-space.js';

/**
 * COMPOSABLE CONTRACT — nested Hermeticon eye.
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
 vessel.group.rotation.x=Math.PI/2; // meridian vertical in eye-local coordinates
 root.add(vessel.group);
 if(parent)parent.add(root);
 vessel.group.add(vessel.content);
 const interior=new T.Group();interior.name='BB eye interior '+id;
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
 const cameraPosition=new T.Vector3(),trial=new T.Vector3(),direction=new T.Vector3();
 const targetQuat=new T.Quaternion(),lookMatrix=new T.Matrix4();
 const UP=new T.Vector3(0,1,0);
 let cameraRef=null,mode='wander',pause=0,routeAge=25;
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
 const clearAt=p=>{
  if(p.length()>FREE_RADIUS)return false;
  // Sphere probes against the signed field, including underside and walls.
  if(solidAt(p.x,p.y,p.z))return false;
  for(const [x,y,z] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
   if(solidAt(p.x+x*EYE_RADIUS,p.y+y*EYE_RADIUS,p.z+z*EYE_RADIUS))return false;
  }
  return true;
 };
 const clearSegment=(a,b)=>{
  const length=a.distanceTo(b),steps=Math.max(1,Math.ceil(length/.38));
  for(let i=1;i<=steps;i++)if(!clearAt(trial.copy(a).lerp(b,i/steps)))return false;
  return true;
 };
 // Crossing the slab is only legal where a whole eye fits through a bore.
 // The waypoint at the slab's midplane forces a real aperture crossing.

 // Betwixt Observer inheritance: sense -> acquire -> track -> investigate.
 // Observations are supplied by Genesis; the eye never knows species internals.
 let focus=null,focusSince=0,attentionChanges=0,lastObservationCount=0;
 const visibleTarget=entry=>{
  const p=entry.position;
  if(!p||!p.every(Number.isFinite))return false;
  const v=new T.Vector3(...p);
  return v.distanceTo(root.position)<14&&clearSegment(root.position,v);
 };
 const chooseDestination=()=>{
  let observations=[];
  try{observations=observe()||[]}catch(error){console.warn('Eye observation unavailable',error)}
  lastObservationCount=observations.length;
  const candidates=observations.filter(visibleTarget);
  // Retain attention unless its subject disappears or becomes occluded.
  const current=candidates.find(c=>c.id===focus?.id);
  const best=candidates.reduce((a,b)=>{
   const score=c=>(c.salience||1)/(1+.11*root.position.distanceTo(new T.Vector3(...c.position)))+(c.id===focus?.id?.7:0);
   return !a||score(b)>score(a)?b:a;
  },null);
  const chosen=current&&(!best||best.id===current.id||random()<.78)?current:best;
  if(chosen){
   if(focus?.id!==chosen.id){focusSince=time;attentionChanges++}
   focus=chosen;mode='investigate';
   const p=new T.Vector3(...chosen.position);
   // Stop at a vantage point instead of colliding with the subject.
   const away=root.position.clone().sub(p).normalize();
   if(away.lengthSq()<.01)away.set(0,1,0);
   destination.copy(p).addScaledVector(away,2.0);
   if(!clearAt(destination)||!clearSegment(root.position,destination)){
    destination.copy(root.position);mode='observe';
   }
   return true;
  }
  focus=null;
  if(cameraRef&&random()<.32){
   cameraRef.getWorldPosition(cameraPosition);
   destination.copy(cameraPosition).normalize().multiplyScalar(FREE_RADIUS-.25);
   mode='inspect-glass';glassVisits++;
   if(clearAt(destination)&&clearSegment(root.position,destination))return true;
  }
  // No perceptible subject: idle scanning and short exploratory movement.
  mode='search';
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
 const update=(dt,camera)=>{
  const step=Math.max(0,Math.min(dt,.06));time+=step;
  if(camera?.position)cameraRef=camera;
  if(pause>0){pause-=step;velocity.multiplyScalar(Math.exp(-step*6));}
  else{
   routeAge+=step;
   if(routeAge>20||root.position.distanceTo(destination)<.28){
    {arrivals++;pause=.5+random()*1.1;routeAge=0;chooseDestination();}
   }
   direction.copy(destination).sub(root.position);
   const distance=direction.length();
   if(distance>.001){
    direction.divideScalar(distance);
    // Acceleration and braking: slow at start/end, cruise in between.
    const desiredSpeed=Math.min(2.1,Math.sqrt(2*2.2*distance));
    const blend=Math.min(1,step*1.9);
    velocity.lerp(direction.multiplyScalar(desiredSpeed),blend);
    trial.copy(root.position).addScaledVector(velocity,step);
    if(clearSegment(root.position,trial))root.position.copy(trial);
    else{blocked++;velocity.set(0,0,0);routeAge=25;}
   }
  }
  // The meridian is the eye's forward-bearing hardware: rotate the entire
  // vessel and iris as one, never the anatomy independently.
  if(focus)lookPoint.fromArray(focus.position);
  else if(mode==='inspect-glass'&&cameraRef)cameraRef.getWorldPosition(lookPoint);
  else if(velocity.lengthSq()>.025)lookPoint.copy(root.position).add(velocity);
  else lookPoint.copy(destination);
  lookMatrix.lookAt(lookPoint,root.position,UP);
  targetQuat.setFromRotationMatrix(lookMatrix);
  root.quaternion.slerp(targetQuat,Math.min(1,step*2.1));
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
 return {group:root,childWorld,update,contactBead,inspect:()=>({name:'Hermeticon eye',id,position:root.position.toArray(),mode,focus:focus?.id||null,focusAge:focus?time-focusSince:null,attentionChanges,lastObservationCount,velocity:velocity.toArray(),destination:destination.toArray(),arrivals,blocked,glassVisits,routeAge,visible:root.visible,attached:!!root.parent,vesselVisible:vessel.group.visible,beadInstances:beads.count,space:inspectObjectSpace(root,cameraRef),beadContacts,childWorld:childWorld.inspect()})};
}
