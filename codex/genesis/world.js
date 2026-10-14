// Genesis is an authored composition, not a reusable Arcana definition.
import {createHermeticon} from '../../arcana/hermeticon.js';
import {createTerrain} from '../../arcana/terrain.js?v=aperture-cap-20261014';
import {createNodeMaker} from '../../arcana/node-maker.js?v=1';
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

 // Equatorial comparison fixture: one batched signed-field skin, rebuilt only on mode change.
 const edgeModes=['Geological curtain','Pin toy','Twin waterfalls','Equifog','Brass occlusion','Curtain + equifog','Curtain + brass','Surface stitching','Shader-only transition','Full intersection'];
 const edgeGroup=new T.Group();edgeGroup.name='equatorial-treatment';world.content.add(edgeGroup);
 let edgeIndex=0,edgeMesh=null,edgeBuildMs=0,edgeTriangles=0,edgeSolid=0,edgeVoid=0,edgeRebuilds=0;
 const edgeMaterial=new T.MeshStandardMaterial({color:0xb3b3aa,roughness:.88,metalness:0,side:T.DoubleSide,vertexColors:true});
 const edgeBrass=new T.MeshStandardMaterial({color:0xc99b50,metalness:.8,roughness:.3,side:T.DoubleSide});
 let edgeTrim=null;
 function setEdgeMode(index){
  edgeIndex=(index+edgeModes.length)%edgeModes.length;
  const t0=performance.now();
  if(edgeMesh){edgeGroup.remove(edgeMesh);edgeMesh.geometry.dispose();edgeMesh=null}
  if(edgeTrim){edgeGroup.remove(edgeTrim);edgeTrim.geometry.dispose();edgeTrim=null}
  const mode=edgeIndex,full=mode===9,shaderOnly=mode===8;
  terrain.setAperture(full?10.04:mode===7?9.83:mode===8?9.92:9.72);
  const segments=mode===1?160:mode===2?192:128,levels=mode===1?10:mode===2?18:12;
  const pos=[],colors=[];edgeSolid=0;edgeVoid=0;
  const color=new T.Color();
  const radius=mode===7?9.82:9.68;
  const emit=(a,b,c,shade)=>{for(const p of [a,b,c]){pos.push(...p);color.setRGB(shade[0],shade[1],shade[2]);colors.push(color.r,color.g,color.b)}};
  if(!full&&!shaderOnly){
   for(let i=0;i<segments;i++){
    const a0=i*2*Math.PI/segments,a1=(i+1)*2*Math.PI/segments;
    for(let j=0;j<levels;j++){
     const y0=-1.15+j*2.3/levels,y1=-1.15+(j+1)*2.3/levels;
     const ym=(y0+y1)/2,am=(a0+a1)/2;
     const geologicalX=radius*Math.cos(am)+wandererOffsetX(),geologicalZ=radius*Math.sin(am)+wandererOffsetZ();
     if(terrain.sample(geologicalX,ym,geologicalZ)<=0){edgeVoid++;continue}
     edgeSolid++;
     const warp=mode===1?0.035*Math.sin(i*2.4):mode===2?0.07*Math.sin(j*.9+i*.21):0;
     const vertex=(a,y)=>[(radius+warp)*Math.cos(a),y,(radius+warp)*Math.sin(a)];
     const p0=vertex(a0,y0),p1=vertex(a1,y0),p2=vertex(a0,y1),p3=vertex(a1,y1);
     const fog=mode===3||mode===5;
     const brass=mode===4;
     const shade=brass?[.48,.30,.12]:fog?[.14,.25,.28]:mode===2?[.39,.44,.45]:mode===1?[.48,.49,.46]:[.52,.51,.48];
     emit(p0,p1,p2,shade);emit(p2,p1,p3,shade);
    }
   }
   const geometry=new T.BufferGeometry();
   geometry.setAttribute('position',new T.Float32BufferAttribute(pos,3));
   geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));
   geometry.computeVertexNormals();geometry.computeBoundingSphere();
   const mat=edgeMaterial.clone();mat.transparent=mode===3||mode===5;mat.opacity=mode===3?.24:mode===5?.58:1;mat.depthWrite=!(mode===3||mode===5);mat.metalness=mode===4?.7:0;
   edgeMesh=new T.Mesh(geometry,mat);edgeMesh.frustumCulled=false;edgeGroup.add(edgeMesh);
   if(mode===6||mode===4){edgeTrim=new T.Mesh(new T.TorusGeometry(9.69,.035,6,128),edgeBrass);edgeTrim.rotation.x=Math.PI/2;edgeGroup.add(edgeTrim)}
  }
  edgeTriangles=pos.length/9;edgeRebuilds++;edgeBuildMs=+(performance.now()-t0).toFixed(2);
 }
 let edgeWanderX=0,edgeWanderZ=0;
 function wandererOffsetX(){return edgeWanderX}
 function wandererOffsetZ(){return edgeWanderZ}
 const originalSetOffset=terrain.setOffset;
 terrain.setOffset=(x,z)=>{originalSetOffset(x,z);edgeWanderX=x;edgeWanderZ=z;ghost.position.set(-x,0,-z)};
 // Static fixture for comparison; edge skin is resampled when the treatment changes.
 setEdgeMode(0);
 world.cycleEdge=()=>{setEdgeMode(edgeIndex+1);return edgeModes[edgeIndex]};
 world.edgeMode=()=>edgeModes[edgeIndex];

 setEdgeMode(8);

 // Ghost Cavern: reversible visual-only witnesses. No collision or terrain mutation.
 const ghost=new T.Group();ghost.name='ghost-cavern-atmosphere';world.content.add(ghost);
 const ghostMat=new T.MeshBasicMaterial({color:0x102b39,transparent:true,opacity:.72,depthWrite:false,side:T.DoubleSide,fog:true});
 const glowMat=new T.MeshBasicMaterial({color:0x64b9bf,transparent:true,opacity:.5,depthWrite:false,blending:T.AdditiveBlending});
 const ghostPositions=[],motePositions=[];
 // Fixed, deterministic candidates, accepted only in genuine SDF void.
 for(let i=0;i<120;i++){
  const a=i*2.399963229728653,rad=3.1+6.0*Math.sqrt((i+.5)/120);
  const x=Math.cos(a)*rad,z=Math.sin(a)*rad,y=1.7+1.9*Math.sin(i*1.73);
  if(terrain.sample(x,y,z)>0)continue;
  if(i%5===0){
   const height=.7+(i%7)*.27,base=.25+(i%4)*.12;
   const mesh=new T.Mesh(new T.ConeGeometry(base,height,5),ghostMat);
   mesh.position.set(x,y,z);mesh.rotation.z=Math.PI;ghost.add(mesh);ghostPositions.push([x,y,z]);
  }else motePositions.push(x,y,z);
 }
 const motesGeometry=new T.BufferGeometry();
 motesGeometry.setAttribute('position',new T.Float32BufferAttribute(motePositions,3));
 const motes=new T.Points(motesGeometry,new T.PointsMaterial({color:0x4ca4ad,size:.075,transparent:true,opacity:.46,depthWrite:false,sizeAttenuation:true}));
 ghost.add(motes);
 // Low-cost layered translucent veils; no volumetric raymarching.
 const veilMat=new T.MeshBasicMaterial({color:0x0b2937,transparent:true,opacity:.18,depthWrite:false,side:T.DoubleSide});
 for(const z of [-7,-3,2,6]){
  const veil=new T.Mesh(new T.PlaneGeometry(17,5),veilMat);
  veil.position.set(0,.8,z);ghost.add(veil);
 }
 const glows=[];
 for(const [x,y,z] of [[-5,2.5,-6],[6,2.9,-5],[1,2.7,7]]){
  if(terrain.sample(x,y,z)>0)continue;
  const light=new T.Mesh(new T.SphereGeometry(.11,8,6),glowMat);
  light.position.set(x,y,z);ghost.add(light);glows.push(light);
 }
 let ghostEnabled=false;
 ghost.visible=false;
 const ghostButton=document.createElement('button');
 ghostButton.id='ghostCavern';ghostButton.type='button';ghostButton.textContent='☁';
 ghostButton.title='Ghost Cavern: OFF (solid cap)';ghostButton.setAttribute('aria-label',ghostButton.title);
 document.querySelector('#buttons').append(ghostButton);
 function setGhost(enabled){
  ghostEnabled=!!enabled;ghost.visible=ghostEnabled;
  terrain.setCapEnabled(!ghostEnabled);
  ghostButton.style.borderColor=ghostEnabled?'#6ec9cf':'#66543a';
  ghostButton.title='Ghost Cavern: '+(ghostEnabled?'ON':'OFF (solid cap)');
  ghostButton.setAttribute('aria-label',ghostButton.title);
  return ghostEnabled;
 }
 ghostButton.onclick=()=>setGhost(!ghostEnabled);

 // Deliberately empty: future GPU boundary experiment supplies node positions.
 // This maker owns only instances, colors, and honest instrumentation.
 const nodeMaker=createNodeMaker(T,world.content);
 world.setWitnessNodes=nodes=>nodeMaker.set(nodes);
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
 world.update=dt=>{wanderer.update(dt)};
 const inspectShell=world.inspect.bind(world);
 world.inspect=()=>({name:'Genesis',shell:inspectShell(),systems:[{name:'terrain',...terrain.inspect()},{name:'wanderer',...wanderer.inspect()}],edgeGeometry,edgeTreatment:{mode:edgeModes[edgeIndex],index:edgeIndex,triangles:edgeTriangles,rebuilds:edgeRebuilds,buildMs:edgeBuildMs,solid:edgeSolid,void:edgeVoid},ghostCavern:{enabled:ghostEnabled,silhouettes:ghostPositions.length,motes:motePositions.length/3,glows:glows.length,veils:4,capEnabled:!ghostEnabled},nodes:nodeMaker.inspect(),tapOwnership:{...tapReport,recent:[...tapReport.recent]}});
 return world;
}
