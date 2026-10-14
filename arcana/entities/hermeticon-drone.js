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
 * Eye anatomy faces local +Z; cancel vessel's X rotation for the interior.
 * World coordinates: stationary upper dome, scaled shell radius 1.28125;
 * full parent vessel inner radius 10.07. Gaze follows camera; BBs pulse.
 * Exposes {group,childWorld,update,contactBead,inspect}. This factory
 * does not own Genesis updates; caller must isolate experimental failures.
 * If invisible: inspect attachment and world-space diagnostics FIRST,
 * then deployed runtime; do not randomly move the eye or alter terrain.
 */
export function createHermeticonDrone({parent,id='drone-1'}={}){
 const root=new T.Group();root.name='Hermeticon eye '+id;
 const vessel=createHermeticon();
 vessel.group.scale.setScalar(.125);
 vessel.group.rotation.x=Math.PI/2; // upright brass meridian, unchanged hardware
 root.add(vessel.group);
 if(parent)parent.add(root);
 vessel.group.add(vessel.content);
 const interior=new T.Group();interior.name='BB eye interior '+id;
 vessel.content.add(interior);
 // Cancel the vessel's upright-band rotation for the eye anatomy alone.
 // Its pupil is authored on local +Z and must face the camera, not the floor.
 interior.rotation.x=-Math.PI/2;
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
  if(front&&rho<.23){color=0x080e1a;r=.15;kind=2}
  else if(front&&rho<.66){
   const theta=Math.atan2(y,x),fiber=Math.sin(theta*73+rho*39)+Math.sin(theta*117-rho*27);
   color=fiber>1?0x95e5df:fiber>0?0x43a6b7:fiber>-.8?0x23667d:0x183c5b;
   r=.155;kind=1;
  }else if(front&&rho<.71){color=0x172b3c;kind=1}
  // Fine branching capillaries on the visible sclera, strongest toward the sides.
  else if(front&&rho>.75){
   const theta=Math.atan2(y,x);
   const branch=Math.sin(theta*13+rho*14+Math.sin(theta*7)*.65);
   const twig=Math.sin(theta*29-rho*33);
   if(Math.abs(branch)<.105||Math.abs(twig)<.06&&rho>.86){color=0xb8404b;r=.105;kind=3}
  }
  push(x*7.25,y*7.25,z*7.25,r,color,kind,i*2.399963);
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
 let time=0,beadContacts=0;
 const gaze=new T.Vector3(),velocity=new T.Vector3();
 let cameraRef=null;
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
  const step=Math.max(0,Math.min(dt,.1));time+=step;
  if(camera?.position){
   cameraRef=camera;
   camera.getWorldPosition(gaze);
   // Orient the eye's own +Z axis toward the viewer; brass remains upright.
   root.lookAt(gaze);
  }
  // BB impacts may jostle the vessel, but it returns gently to its perch.
  root.position.addScaledVector(velocity,step);
  root.position.lerp(new T.Vector3(0,5.2,5.1),Math.min(1,step*2));
  velocity.multiplyScalar(Math.exp(-step*4));
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
 return {group:root,childWorld,update,contactBead,inspect:()=>({name:'Hermeticon eye',id,position:root.position.toArray(),mode:'high-dome-observer',visible:root.visible,attached:!!root.parent,vesselVisible:vessel.group.visible,beadInstances:beads.count,space:inspectObjectSpace(root,cameraRef),beadContacts,childWorld:childWorld.inspect()})};
}
