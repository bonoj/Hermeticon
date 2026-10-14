// Genesis is an authored composition, not a reusable Arcana definition.
import {createHermeticon} from '../../arcana/hermeticon.js';
import {createTerrain} from '../../arcana/terrain.js?v=stable-20bd541b-restore';
import {createNodeMaker} from '../../arcana/node-maker.js?v=1';
import {createWanderer} from '../../arcana/wanderer.js';
import {createMistsReeds} from '../../arcana/populations/mists-reeds.js';
import {createBBGarden} from '../../arcana/populations/bb-garden.js';
import {createSecondGarden} from '../../arcana/populations/second-garden.js';
import {createFirstBestiary} from '../../arcana/creatures/first-bestiary.js';
import {createVelvetDrifters} from '../../arcana/creatures/velvet-drifters.js';
import {createThreadwyrms} from '../../arcana/creatures/threadwyrms.js';
import {createGlasswings} from '../../arcana/creatures/glasswings.js';
import {createBellwraiths} from '../../arcana/creatures/bellwraiths.js';
import {createLanternHermits} from '../../arcana/creatures/lantern-hermits.js';
import {createBeadDebris} from '../../arcana/physics/bead-debris.js';
import {createCinderfall} from '../../arcana/spells/cinderfall.js';
import {createEquatorialTreatment} from '../../arcana/equatorial-treatment.js';
import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

export function createGenesis(){
 const world=createHermeticon();
 world.group.name='Genesis';
 world.content.name='Genesis contents';
 world.group.add(world.content);
 const terrain=createTerrain();
 world.content.add(terrain.group);
 world.observationTargets=()=>({terrain:terrain.group});
 const equatorial=createEquatorialTreatment({terrain,parent:world.content});
 world.cycleEdge=equatorial.cycle;
 world.edgeMode=equatorial.getMode;

 // Deliberately empty: future GPU boundary experiment supplies node positions.
 // This maker owns only instances, colors, and honest instrumentation.
 const nodeMaker=createNodeMaker(T,world.content);
 world.setWitnessNodes=nodes=>nodeMaker.set(nodes);
 const wanderer=createWanderer({terrain});
 world.content.add(wanderer.group);
 // Sparse reeds beside spawn, rooted in geological coordinates.
 // Use the same signed-field surface crossing as Wanderer's walkSurface.
 const reedSurface=(x,z)=>{
  let prior=terrain.sample(x,3.58,z);
  for(let y=3.52;y>=-3.58;y-=.07){
   const value=terrain.sample(x,y,z);
   if(prior<=0&&value>0){
    let lo=y,hi=y+.07;
    for(let k=0;k<9;k++){const mid=(lo+hi)/2;if(terrain.sample(x,mid,z)>0)lo=mid;else hi=mid}
    return (lo+hi)/2;
   }
   prior=value;
  }
  return null;
 };
 const reeds=createMistsReeds(T,{
  surface:reedSurface,center:{x:1.4,z:1.5},
  radius:terrain.getAperture(),
  offset:()=>{const [x,z]=wanderer.inspect().offset;return {x,z}},
  characters:()=>{const {x,z}=wanderer.inspect();return [{x,z}]},
  parent:world.content
 });
 // The geometric prototypes remain intact under populations/potential.
 const botanicalOffset=()=>{const [x,z]=wanderer.inspect().offset;return {x,z}};
 const garden=createBBGarden(T,{surface:reedSurface,offset:botanicalOffset,
  characters:()=>{const {x,z}=wanderer.inspect();return [{x,z}]},
  radius:terrain.getAperture(),parent:world.content,seed:741});
 const secondGarden=createSecondGarden(T,{terrain,surface:reedSurface,offset:botanicalOffset,
  characters:()=>{const {x,z}=wanderer.inspect();return [{x,z}]},
  radius:terrain.getAperture(),parent:world.content,seed:741});
 const bestiary=createFirstBestiary(T,{surface:reedSurface,offset:botanicalOffset,
  wanderer:()=>wanderer.inspect(),parent:world.content,radius:terrain.getAperture(),seed:741});
 const velvetDrifters=createVelvetDrifters(T,{surface:reedSurface,offset:botanicalOffset,
  wanderer:()=>wanderer.inspect(),parent:world.content,radius:terrain.getAperture(),seed:741});
 const threadwyrms=createThreadwyrms(T,{surface:reedSurface,offset:botanicalOffset,
  wanderer:()=>wanderer.inspect(),parent:world.content,radius:terrain.getAperture(),seed:741});
 const glasswings=createGlasswings(T,{surface:reedSurface,offset:botanicalOffset,
  wanderer:()=>wanderer.inspect(),parent:world.content,radius:terrain.getAperture(),seed:741});
 const bellwraiths=createBellwraiths(T,{surface:reedSurface,offset:botanicalOffset,
  wanderer:()=>wanderer.inspect(),parent:world.content,radius:terrain.getAperture(),seed:741});
 const lanternHermits=createLanternHermits(T,{surface:reedSurface,offset:botanicalOffset,
  wanderer:()=>wanderer.inspect(),parent:world.content,radius:terrain.getAperture(),seed:741});
 const debris=createBeadDebris(T,{terrain,offset:botanicalOffset,innerRadius:world.inspect().vessel.innerRadius,parent:world.content});
 const creatureSystems=[bestiary,velvetDrifters,threadwyrms,glasswings,bellwraiths,lanternHermits];
 let lastMeteorImpact=null;
 const cinderfall=createCinderfall(T,{surface:reedSurface,offset:botanicalOffset,
  targets:()=>creatureSystems.flatMap(s=>s.inspect().creatures||[]),
  parent:world.content,radius:terrain.getAperture(),seed:741,
  onImpact:({point,magnitude})=>{const t0=performance.now();const force={radius:3.2*magnitude,impulse:18*magnitude};const loose=debris.receiveImpulse(point,force);const t1=performance.now();const creatures=creatureSystems.reduce((n,s)=>n+(s.blast?.(point,force,debris)||0),0);const t2=performance.now();const plants=[reeds,garden,secondGarden].reduce((n,s)=>n+(s.blast?.(point,force,debris)||0),0);const t3=performance.now();const received=loose+creatures+plants;const ground=reedSurface(point.x,point.z);const crater=ground==null?null:terrain.impact({...point,y:ground+.12},{magnitude});const t4=performance.now();lastMeteorImpact={point,magnitude,crater,force:{...force,receivers:received,loose,creatures,plants},timingMs:{loose:t1-t0,creatures:t2-t1,plants:t3-t2,craterAndSurface:t4-t3,total:t4-t0}};}});
 world.castMeteor=()=>cinderfall.cast();
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

 world.update=dt=>{wanderer.update(dt);reeds.update(dt);garden.update(dt);secondGarden.update(dt);bestiary.update(dt);velvetDrifters.update(dt);threadwyrms.update(dt);glasswings.update(dt);bellwraiths.update(dt);lanternHermits.update(dt);cinderfall.update(dt);debris.update(dt)};
 const inspectShell=world.inspect.bind(world);
 // Compact material accounting: authored inventory remains distinct from detached matter.
 const materialSurvey=()=>{
  const populations=[reeds,garden,secondGarden,...creatureSystems].map(s=>s.inspect());
  const loose=debris.inspect();
  const authored=populations.reduce((n,s)=>n+(s.activeBeads??s.beads??s.descriptors??0),0);
  const visibleAuthored=populations.reduce((n,s)=>n+(s.visible??0),0);
  return {authored,detached:loose.count,total:authored+loose.count,visible:visibleAuthored+loose.visible,visibleAuthored,visibleDetached:loose.visible,ownership:loose.ownership,allocated:loose.allocated,populations:populations.map(s=>({name:s.name,inventory:s.activeBeads??s.beads??s.descriptors??0,visible:s.visible??0}))};
 };
 world.materialSurvey=materialSurvey;
 world.inspect=()=>({name:'Genesis',shell:inspectShell(),systems:[{name:'terrain',...terrain.inspect()},{name:'wanderer',...wanderer.inspect()},{name:'mists-reeds',...reeds.inspect()},garden.inspect(),secondGarden.inspect(),bestiary.inspect(),velvetDrifters.inspect(),threadwyrms.inspect(),glasswings.inspect(),bellwraiths.inspect(),lanternHermits.inspect(),cinderfall.inspect(),debris.inspect()],material:materialSurvey(),meteorImpact:lastMeteorImpact,edgeGeometry:equatorial.geometry,edgeTreatment:equatorial.inspect(),nodes:nodeMaker.inspect(),tapOwnership:{...tapReport,recent:[...tapReport.recent]}});
 return world;
}
