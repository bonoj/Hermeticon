import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {createHermeticon} from '../hermeticon.js';

// The drone is a world-bearing Hermeticon; its small interior is a visual proxy.
export function createHermeticonDrone({parent,terrain,offset=()=>({x:0,z:0}),id='drone-1'}={}){
 const root=new T.Group();root.name='Hermeticon drone '+id;
 const vessel=createHermeticon();
 vessel.group.scale.setScalar(.075);
 vessel.group.rotation.x=Math.PI/2;
 root.add(vessel.group);
 const interior=new T.Group();interior.name='Interior '+id;
 // Interior landmarks are deliberately bold enough to survive miniature scale.
 const rock=new T.Mesh(new T.IcosahedronGeometry(4.5,1),new T.MeshStandardMaterial({color:0x39b7a6,flatShading:true,emissive:0x14584e,emissiveIntensity:.55}));
 rock.scale.set(1,.45,.85);rock.position.y=-2.3;interior.add(rock);
 const star=new T.Mesh(new T.IcosahedronGeometry(2.1,1),new T.MeshBasicMaterial({color:0xffcb67}));
 star.position.set(0,1.9,0);interior.add(star);
 const halo=new T.Mesh(new T.TorusGeometry(3.1,.38,6,28),new T.MeshBasicMaterial({color:0x78e7ec}));
 halo.position.y=1.9;halo.rotation.x=Math.PI/3;interior.add(halo);
 const gems=new T.Group();gems.name='Interior luminous inhabitants';
 const gemGeo=new T.IcosahedronGeometry(.9,1);
 for(let i=0;i<7;i++){
  const a=i*2.39996323;
  const gem=new T.Mesh(gemGeo,new T.MeshBasicMaterial({color:[0xff6b9c,0x7ef0d8,0xf5d16d][i%3]}));
  gem.position.set(Math.cos(a)*4,Math.sin(i*1.7)*2.2,Math.sin(a)*4);gems.add(gem);
 }
 interior.add(gems);
 vessel.content.add(interior);
 // createHermeticon returns content detached; mount it explicitly, as Genesis does.
 vessel.group.add(vessel.content);
 if(parent)parent.add(root);
 let time=0,phase=-1,look=false;
 const target=new T.Vector3(),start=new T.Vector3();
 const cameraPoint=new T.Vector3();
 const velocity=new T.Vector3(),desired=new T.Vector3(),candidate=new T.Vector3();
 let terrainContacts=0,beadContacts=0;
 const droneRadius=.77,innerRadius=9.9;
 const clear=p=>{
  const o=offset();
  for(const [x,y,z] of [[0,0,0],[droneRadius,0,0],[-droneRadius,0,0],[0,droneRadius,0],[0,-droneRadius,0],[0,0,droneRadius],[0,0,-droneRadius]])
   if(terrain.sample(p.x+x+o.x,p.y+y,p.z+z+o.z)>0)return false;
  return true;
 };
 const contactBead=(x,y,z,r,vx,vy,vz)=>{
  const delta=new T.Vector3(root.position.x-x,root.position.y-y,root.position.z-z);
  const d=delta.length(),limit=droneRadius+r;
  if(d>=limit)return false;
  if(d<.0001)delta.set(0,1,0);else delta.divideScalar(d);
  const relative=new T.Vector3(vx,vy,vz).sub(velocity);
  const closing=Math.max(0,relative.dot(delta));
  velocity.addScaledVector(delta,Math.min(3.5,.3+closing*.22));
  root.position.addScaledVector(delta,Math.min(.15,limit-d));
  beadContacts++;return true;
 };
 const choose=()=>{
  phase=Math.floor(time/1.7);
  start.copy(root.position);
  // Mostly underside, with occasional visits to the outer glass.
  look=phase%5===4;
  const a=phase*2.399963229728653;
  const radius=look?8.5:3.5+((phase*7)%5)*.75;
  target.set(Math.cos(a)*radius,look?-1.6:-3.7-(phase%3)*1.35,Math.sin(a)*radius);
 };
 const update=(dt,camera)=>{
  const step=Math.max(0,Math.min(dt,.1));
  time+=step;
  const nextPhase=Math.floor(time/1.7);
  if(nextPhase!==phase)choose();
  const u=(time%1.7)/1.7;
  // Fast departure, deliberate pause at the destination.
  const t=1-Math.pow(1-Math.min(1,u/.58),3);
  desired.lerpVectors(start,target,t);
  // Swept, substepped motion against the authoritative positive-solid field.
  const travel=desired.clone().sub(root.position);
  const count=Math.max(1,Math.ceil(travel.length()/.24));
  for(let i=0;i<count;i++){
   candidate.copy(root.position).addScaledVector(travel,1/count);
   if(candidate.length()>innerRadius-droneRadius)candidate.setLength(innerRadius-droneRadius);
   if(clear(candidate))root.position.copy(candidate);
   else{terrainContacts++;break}
  }
  root.position.addScaledVector(velocity,step);
  if(!clear(root.position))root.position.addScaledVector(velocity,-step);
  velocity.multiplyScalar(Math.exp(-step*3));
  if(look&&camera?.position){
   cameraPoint.copy(camera.position);
   root.lookAt(cameraPoint);
  }else{
   root.rotation.y+=step*1.6;
  }
  star.rotation.y+=step*.7;
  halo.rotation.z+=step*.6;
 };
 // Initial location is below the surface, not above the gardens.
 root.position.set(0,-5.4,4);
 choose();
 const childWorld={id:id+'-world',group:interior,seed:741,inspect:()=>({id:id+'-world',representation:'miniature',seed:741,landmarks:10})};
 return {group:root,childWorld,update,contactBead,inspect:()=>({name:'Hermeticon drone',id,position:root.position.toArray(),mode:look?'glass-lookout':'underdark-dart',terrainContacts,beadContacts,childWorld:childWorld.inspect()})};
}
