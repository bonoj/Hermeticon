import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {createHermeticon} from '../hermeticon.js';

// The drone is a world-bearing Hermeticon; its small interior is a visual proxy.
export function createHermeticonDrone({parent,id='drone-1'}={}){
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
 vessel.content.add(interior);
 if(parent)parent.add(root);
 let time=0,phase=-1,look=false;
 const target=new T.Vector3(),start=new T.Vector3();
 const cameraPoint=new T.Vector3();
 const choose=()=>{
  phase=Math.floor(time/1.7);
  start.copy(root.position);
  // Mostly underside, with occasional visits to the outer glass.
  look=phase%5===4;
  const a=phase*2.399963229728653;
  const radius=look?8.5:3.5+((phase*7)%5)*.75;
  target.set(Math.cos(a)*radius,look?-.8:-2.3-(phase%3)*.7,Math.sin(a)*radius);
 };
 const update=(dt,camera)=>{
  const step=Math.max(0,Math.min(dt,.1));
  time+=step;
  const nextPhase=Math.floor(time/1.7);
  if(nextPhase!==phase)choose();
  const u=(time%1.7)/1.7;
  // Fast departure, deliberate pause at the destination.
  const t=1-Math.pow(1-Math.min(1,u/.58),3);
  root.position.lerpVectors(start,target,t);
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
 root.position.set(0,-2.6,4);
 choose();
 const childWorld={id:id+'-world',group:interior,seed:741,inspect:()=>({id:id+'-world',representation:'miniature',seed:741,landmarks:3})};
 return {group:root,childWorld,update,inspect:()=>({name:'Hermeticon drone',id,position:root.position.toArray(),mode:look?'glass-lookout':'underdark-dart',childWorld:childWorld.inspect()})};
}
