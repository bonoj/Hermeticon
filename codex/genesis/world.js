// Genesis is an authored composition, not a reusable Arcana definition.
import {createHermeticon} from '../../arcana/hermeticon.js';
import {createTerrain} from '../../arcana/terrain.js?v=stable-20bd541b-restore';
import {createNodeMaker} from '../../arcana/node-maker.js?v=1';
import {createWanderer} from '../../arcana/wanderer.js';
import {createEquatorialTreatment} from '../../arcana/equatorial-treatment.js';
import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

export function createGenesis(){
 const world=createHermeticon();
 world.group.name='Genesis';
 world.content.name='Genesis contents';
 world.group.add(world.content);
 const terrain=createTerrain();
 world.content.add(terrain.group);
 const equatorial=createEquatorialTreatment({terrain,parent:world.content});
 world.cycleEdge=equatorial.cycle;
 world.edgeMode=equatorial.getMode;

 // Deliberately empty: future GPU boundary experiment supplies node positions.
 // This maker owns only instances, colors, and honest instrumentation.
 const nodeMaker=createNodeMaker(T,world.content);
 world.setWitnessNodes=nodes=>nodeMaker.set(nodes);
 const wanderer=createWanderer({terrain});
 world.content.add(wanderer.group);
 let view=null;
 const tapReport={total:0,underside:0,navigation:0,rayMiss:0,last:null,recent:[]};
 world.attachView=next=>{view=next};
 world.tap=(x,y)=>{
  if(!view)return;
  tapReport.total++;
  const result=terrain.interact(x,y,view,wanderer.getWalkingHeight());
  if(!result.hit)tapReport.rayMiss++;
  if(result.owner==='terrain-underside')tapReport.underside++;
  else if(result.target){tapReport.navigation++;wanderer.moveTo(result.target.x,result.target.z)}
  const record={owner:result.owner,normalY:result.normalY,point:result.point,hit:result.hit,screen:[Math.round(x),Math.round(y)]};
  tapReport.last=record;tapReport.recent.push(record);
  if(tapReport.recent.length>16)tapReport.recent.shift();
 };

 world.update=dt=>{wanderer.update(dt)};
 const inspectShell=world.inspect.bind(world);
 world.inspect=()=>({name:'Genesis',shell:inspectShell(),systems:[{name:'terrain',...terrain.inspect()},{name:'wanderer',...wanderer.inspect()}],edgeGeometry:equatorial.geometry,edgeTreatment:equatorial.inspect(),nodes:nodeMaker.inspect(),tapOwnership:{...tapReport,recent:[...tapReport.recent]}});
 return world;
}
