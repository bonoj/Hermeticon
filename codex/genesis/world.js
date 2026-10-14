// Genesis is an authored composition, not a reusable Arcana definition.
import {createHermeticon} from '../../arcana/hermeticon.js';
import {createTerrain} from '../../arcana/terrain.js?v=mountains-20261014';
import {extractIntervals} from '../../arcana/boundary.js';
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
 terrain.setOffset=(x,z)=>{originalSetOffset(x,z);edgeWanderX=x;edgeWanderZ=z};
 // Static fixture for comparison; edge skin is resampled when the treatment changes.
 setEdgeMode(0);
 world.cycleEdge=()=>{setEdgeMode(edgeIndex+1);return edgeModes[edgeIndex]};
 world.edgeMode=()=>edgeModes[edgeIndex];

 setEdgeMode(8);
 // Brass beads mark signed-field zero crossings on the actual spherical draw rim.
 // No links, no cylindrical cage, no interior beads.
 const latticeGroup=new T.Group();latticeGroup.name='rim-zero-crossings';world.content.add(latticeGroup);
 const rimAngles=192,rimSteps=96,rimMinY=-3.35,rimMaxY=3.35;
 const maxBeads=rimAngles*16;
 const beadGeo=new T.SphereGeometry(.055,6,5);
 const beadMat=new T.MeshStandardMaterial({color:0xe2b65c,metalness:.82,roughness:.28,depthTest:true});
 const beads=new T.InstancedMesh(beadGeo,beadMat,maxBeads);
 beads.frustumCulled=false;latticeGroup.add(beads);
 const dummy=new T.Object3D(),nodeColor=new T.Color();
 let beadCount=0,upper=0,lower=0,bore=0,other=0,scans=0,buildMs=0,offsetX=0,offsetZ=0,lastX=Infinity,lastZ=Infinity;
 const crossingSamples=[];let intervalCount=0,entireSolid=0,entireVoid=0,multipleIntervals=0,unmatched=0,maxIntervals=0;
 function rebuildRim(){
  const t0=performance.now();beadCount=upper=lower=bore=other=0;intervalCount=entireSolid=entireVoid=multipleIntervals=unmatched=maxIntervals=0;crossingSamples.length=0;
  const radius=terrain.getAperture();
  for(let i=0;i<rimAngles;i++){
   const angle=2*Math.PI*i/rimAngles,c=Math.cos(angle),sn=Math.sin(angle);
   const point=y=>{const r=Math.sqrt(Math.max(0,radius*radius-y*y));return [r*c,r*sn]};
   const result=extractIntervals(terrain.sample,point,rimMinY,rimMaxY,rimSteps);
   intervalCount+=result.intervals.length;
   if(result.intervals.length>1)multipleIntervals++;
   maxIntervals=Math.max(maxIntervals,result.intervals.length);
   if(!result.crossings.length){if(result.startsSolid)entireSolid++;else entireVoid++}
   const expected=result.crossings.length+(result.startsSolid?1:0)-(result.endsSolid?1:0);
   if(expected%2!==0)unmatched++;
   for(const crossing of result.crossings){
    const hitY=crossing.y,h=point(hitY),eps=.09;
    const inX=h[0]+offsetX,inZ=h[1]+offsetZ;
    const horizontalVoid=terrain.sample(inX+eps,hitY,inZ)<0||terrain.sample(inX-eps,hitY,inZ)<0||terrain.sample(inX,hitY,inZ+eps)<0||terrain.sample(inX,hitY,inZ-eps)<0;
    const kind=horizontalVoid?'bore':(crossing.fromSolid?'upper':'lower');
    if(kind==='bore')bore++;else if(kind==='upper')upper++;else lower++;
    if(beadCount<maxBeads){
     dummy.position.set(h[0]*1.003,hitY,h[1]*1.003);dummy.scale.setScalar(1);dummy.updateMatrix();
     beads.setMatrixAt(beadCount,dummy.matrix);
     nodeColor.setHex(kind==='bore'?0x69d2de:kind==='upper'?0xffd37c:0xc18a41);
     beads.setColorAt(beadCount,nodeColor);
     if(crossingSamples.length<24)crossingSamples.push({angle:+angle.toFixed(3),y:+hitY.toFixed(3),kind,fromSolid:crossing.fromSolid});
     beadCount++;
    }
   }
  }
  beads.count=beadCount;beads.instanceMatrix.needsUpdate=true;
  if(beads.instanceColor)beads.instanceColor.needsUpdate=true;
  scans++;buildMs=+(performance.now()-t0).toFixed(2);lastX=offsetX;lastZ=offsetZ;
 }
 const previousSetOffset=terrain.setOffset;
 terrain.setOffset=(x,z)=>{previousSetOffset(x,z);offsetX=x;offsetZ=z;if(Math.hypot(x-lastX,z-lastZ)>.24)rebuildRim()};
 rebuildRim();
 const inspectLattice=()=>({kind:'visible-rim-zero-crossings',beads:beadCount,upper,lower,bore,other,intervalCount,entireSolid,entireVoid,multipleIntervals,unmatched,maxIntervals,angularSamples:rimAngles,verticalSamples:rimSteps,rimRadius:terrain.getAperture(),offset:[offsetX,offsetZ],resampleDistance:.24,rebuilds:scans,buildMs,drawCalls:1,links:0,examples:crossingSamples,method:'renderer-independent signed-field interval extraction along spherical rim',fixture:'three rim-adjacent through bores plus upper and lower relief; no Wanderer movement required'});
 const inspectEdge=()=>({index:edgeIndex,name:edgeModes[edgeIndex],candidates:edgeModes,apertureRadius:terrain.getAperture(),triangles:edgeTriangles,solidCells:edgeSolid,voidCells:edgeVoid,buildMs:edgeBuildMs,rebuilds:edgeRebuilds,drawCalls:edgeMesh?1:0,trimDrawCalls:edgeTrim?1:0,staticBetweenChanges:true,geologicalAuthority:'terrain.sample',note:'Prototype: skin sampled at initial offset; evaluate seams and bores visually'});

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
 world.inspect=()=>({name:'Genesis',shell:inspectShell(),systems:[{name:'terrain',...terrain.inspect()},{name:'wanderer',...wanderer.inspect()}],edgeGeometry,edgeTreatment:inspectEdge(),lattice:inspectLattice(),tapOwnership:{...tapReport,recent:[...tapReport.recent]}});
 return world;
}
