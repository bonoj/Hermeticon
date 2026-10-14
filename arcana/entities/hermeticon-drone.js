import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import {createHermeticon} from '../hermeticon.js';
export function createHermeticonDrone({parent,id='drone-1'}={}){
 const root=new T.Group();
 const vessel=createHermeticon();
 vessel.group.scale.setScalar(.075);
 vessel.group.rotation.x=Math.PI/2;
 root.add(vessel.group);
 const interior=new T.Group();interior.name='Interior '+id;
 const terrain=new T.Mesh(new T.IcosahedronGeometry(5,2),new T.MeshStandardMaterial({color:0x65a99b,flatShading:true}));
 terrain.scale.y=.22;terrain.position.y=-2;interior.add(terrain);
 const light=new T.Mesh(new T.IcosahedronGeometry(1.1,1),new T.MeshBasicMaterial({color:0xffcf85}));light.position.y=1;interior.add(light);
 vessel.content.add(interior);
 if(parent)parent.add(root);
 let time=0;
 const childWorld={id:id+'-world',group:interior,seed:741,inspect:()=>({id:id+'-world',representation:'miniature',seed:741})};
 const update=dt=>{time+=Math.min(.1,Math.max(0,dt));root.position.set(3.5+Math.sin(time*.3)*1.3,3.5+Math.sin(time*.8)*.5,-2+Math.cos(time*.3)*1.3);root.rotation.y=time*.2};
 update(0);
 return {group:root,childWorld,update,inspect:()=>({name:'Hermeticon drone',id,position:root.position.toArray(),childWorld:childWorld.inspect()})};
}
