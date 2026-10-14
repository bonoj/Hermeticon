// Genesis is an authored composition, not a reusable Arcana definition.
import {createHermeticon} from '../../arcana/hermeticon.js';
import {createTerrain} from '../../arcana/terrain.js';
import {createWanderer} from '../../arcana/wanderer.js';
import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

export function createGenesis(){
 const world=createHermeticon();
 world.group.name='Genesis';
 world.content.name='Genesis contents';
 world.group.add(world.content);
 const terrain=createTerrain();
 world.content.add(terrain.group);
 const edgeGeometry=(()=>{
  const innerRadius=10.07, apertureRadius=9.72;
  const heights=[-1.15,-0.575,0,0.575,1.15], angles=32, radialSamples=24;
  return {kind:'signed-field-cross-section',innerRadius,apertureRadius,
   rows:heights.map(y=>{
    const inner=Math.sqrt(innerRadius**2-y**2), aperture=Math.sqrt(apertureRadius**2-y**2);
    let solid=0,voidSamples=0;
    for(let i=0;i<angles;i++)for(let j=0;j<radialSamples;j++){
     const a=i*Math.PI*2/angles, radius=aperture+(inner-aperture)*(j+0.5)/radialSamples;
     const value=terrain.sample(radius*Math.cos(a),y,radius*Math.sin(a));
     if(value>0)solid++;else voidSamples++;
    }
    return {y,inner,aperture,radialGap:inner-aperture,solid,void:voidSamples};
   })
  };
 })();
 const wanderer=createWanderer({terrain});
 world.content.add(wanderer.group);
 const raycaster=new T.Raycaster(),pointer=new T.Vector2();
 let view=null;
 const tapReport={total:0,underside:0,navigation:0,rayMiss:0,last:null,recent:[]};
 world.attachView=next=>{view=next;wanderer.attachView(next)};
 world.tap=(x,y)=>{
  if(!view)return;
  tapReport.total++;
  const rect=view.renderer.domElement.getBoundingClientRect();
  pointer.set((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1);
  view.camera.updateMatrixWorld();
  world.group.updateMatrixWorld(true);
  raycaster.setFromCamera(pointer,view.camera);
  // Rendered terrain owns its underside; navigation retains its original stable-plane picker.
  const hits=raycaster.intersectObjects(terrain.group.children,false);
  const first=hits[0];
  let owner='wanderer',normalY=null,point=null;
  if(first){
   const normal=first.face.normal.clone().transformDirection(first.object.matrixWorld);
   // Mesh winding is not guaranteed across marching tetrahedra: orient the
   // geometric normal toward the camera for visible front-facing classification.
   if(normal.dot(raycaster.ray.direction)>0)normal.negate();
   normalY=normal.y;point=first.point.toArray();
   if(normalY<-.25)owner='terrain-underside';
  }else tapReport.rayMiss++;
  if(owner==='terrain-underside')tapReport.underside++;
  else {tapReport.navigation++;wanderer.tap(x,y)}
  const record={owner,normalY,point,hit:!!first,screen:[Math.round(x),Math.round(y)]};
  tapReport.last=record;tapReport.recent.push(record);
  if(tapReport.recent.length>16)tapReport.recent.shift();
 };
 world.update=dt=>wanderer.update(dt);
 const inspectShell=world.inspect.bind(world);
 world.inspect=()=>({name:'Genesis',shell:inspectShell(),systems:[{name:'terrain',...terrain.inspect()},{name:'wanderer',...wanderer.inspect()}],edgeGeometry,tapOwnership:{...tapReport,recent:[...tapReport.recent]}});
 return world;
}
