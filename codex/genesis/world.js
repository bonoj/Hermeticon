// Genesis is an authored composition, not a reusable Arcana definition.
import {createHermeticon} from '../../arcana/hermeticon.js';
import {createTerrain} from '../../arcana/terrain.js?v=mountains-20261014';
import {surveyFourSurfaces,buildHeightIndex} from '../../arcana/four-surfaces.js?v=5';
import {createDrawSurface} from '../../arcana/draw-surface.js?v=1';
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

 const latticeGroup=new T.Group();latticeGroup.name='four-geological-populations';world.content.add(latticeGroup);
 const witnessGeo=new T.SphereGeometry(.085,12,9);
 const palette={surfaceTerrain:0x18df83,sdfSurface:0x37c9ff,sdfUndersurface:0xc15bff,undersurfaceTerrain:0xff465e};
 const meshes={},dummy=new T.Object3D();
 for(const [kind,color] of Object.entries(palette)){
  const mesh=new T.InstancedMesh(witnessGeo,new T.MeshStandardMaterial({color,metalness:.72,roughness:.18,emissive:color,emissiveIntensity:.24,depthTest:true}),256);
  mesh.frustumCulled=false;mesh.renderOrder=8;latticeGroup.add(mesh);meshes[kind]=mesh;
 }
 let offsetX=0,offsetZ=0,lastX=Infinity,lastZ=Infinity,scans=0,buildMs=0,report=null;
 const indexStart=performance.now(),heightIndex=buildHeightIndex(terrain.group,terrain.sample),indexBuildMs=+(performance.now()-indexStart).toFixed(2);
 function rebuildRim(){
  const start=performance.now();report=surveyFourSurfaces(terrain.sample,terrain.getAperture(),offsetX,offsetZ,96,heightIndex);
  for(const [kind,points] of Object.entries(report.arrays)){
   const mesh=meshes[kind];mesh.count=Math.min(points.length,256);
   for(let i=0;i<mesh.count;i++){const p=points[i];dummy.position.set(p[0],p[1],p[2]);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)}
   mesh.instanceMatrix.needsUpdate=true;
  }
  scans++;buildMs=+(performance.now()-start).toFixed(2);lastX=offsetX;lastZ=offsetZ;
 }
 const previousSetOffset=terrain.setOffset;
 terrain.setOffset=(x,z)=>{previousSetOffset(x,z);offsetX=x;offsetZ=z;if(Math.hypot(x-lastX,z-lastZ)>.24)rebuildRim()};
 rebuildRim();
 latticeGroup.visible=false; // Legacy comparison only.
 const inspectLattice=()=>({kind:'four-geological-populations',colors:palette,counts:Object.fromEntries(Object.entries(report.arrays).map(([k,v])=>[k,v.length])),...report.stats,rebuilds:scans,buildMs,indexBuildMs,drawCalls:4,offset:[offsetX,offsetZ],method:report.stats.method,note:'Height-ranked mesh vertices; SDF vertical bisection'});
 const inspectEdge=()=>({index:edgeIndex,name:edgeModes[edgeIndex],candidates:edgeModes,apertureRadius:terrain.getAperture(),triangles:edgeTriangles,solidCells:edgeSolid,voidCells:edgeVoid,buildMs:edgeBuildMs,rebuilds:edgeRebuilds,drawCalls:edgeMesh?1:0,trimDrawCalls:edgeTrim?1:0,staticBetweenChanges:true,geologicalAuthority:'terrain.sample',note:'Prototype: skin sampled at initial offset; evaluate seams and bores visually'});

 // Independent camera-conditioned contour experiment. Candidate status is explicit:
 // GPU depth visibility and exact sphere/triangle arcs are NOT yet audited.
 const drawSurface=createDrawSurface(terrain.group);
 const drawLines=new T.LineSegments(new T.BufferGeometry(),
   new T.LineBasicMaterial({color:0xf6d67a,depthTest:true,depthWrite:false,transparent:true,opacity:.75}));
 drawLines.name='draw-witness:camera-contour-candidates';
 drawLines.frustumCulled=false;
 drawLines.visible=false; // Diagnostics only until depth and aperture verification.
 world.content.add(drawLines);
 let drawReport={...drawSurface.stats,visibilityAudited:false,apertureCurveAudited:false,
   cameraCandidateSegments:null,boreWallCandidates:null,projectionMs:null,edgeCoverageP95Px:null};
 let drawCameraSignature='',drawLastAt=-Infinity,drawUpdates=0;
 const cameraNodes=new T.Group();cameraNodes.name='camera-contour-witnesses';world.content.add(cameraNodes);
 const nodeMeshes={};
 for(const [kind,color] of Object.entries(palette)){
   const mesh=new T.InstancedMesh(witnessGeo,new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.24,metalness:.72,roughness:.18,depthWrite:false}),128);
   mesh.count=0;mesh.frustumCulled=false;cameraNodes.add(mesh);nodeMeshes[kind]=mesh;
 }
 const visibilityRay=new T.Raycaster(),rayDirection=new T.Vector3(),rayTarget=new T.Vector3();

 function updateDrawWitness(){
   if(!view)return;
   const camera=view.camera;
   camera.updateMatrixWorld();
   const signature=[camera.position.x,camera.position.y,camera.position.z,
     camera.quaternion.x,camera.quaternion.y,camera.quaternion.z,camera.quaternion.w,
     camera.projectionMatrix.elements.join(','),offsetX,offsetZ,terrain.getAperture()].join(',');
   if(signature===drawCameraSignature)return;
   const now=performance.now();if(now-drawLastAt<300)return;
   drawLastAt=now;drawCameraSignature=signature;
   const result=drawSurface.project(camera,offsetX,offsetZ,terrain.getAperture(),
     view.renderer.domElement.width,view.renderer.domElement.height,T);
   const width=view.renderer.domElement.width,height=view.renderer.domElement.height;
   const bins=new Map(),cell=Math.max(18,Math.min(width,height)/19);
   for(const edge of result.segments){
     const [sx,sy,ex,ey]=edge.screen,x=(sx+ex)/2,y=(sy+ey)/2;
     if(!Number.isFinite(x)||!Number.isFinite(y)||x<0||y<0||x>width||y>height)continue;
     const key=Math.floor(x/cell)+','+Math.floor(y/cell);
     const score=(edge.wall?3:0)+Math.hypot(ex-sx,ey-sy)*.02;
     const prior=bins.get(key);
     if(!prior||score>prior.score)bins.set(key,{edge,score});
   }
   const selected=Object.fromEntries(Object.keys(palette).map(k=>[k,[]]));
   const v=drawSurface.vertices,aperture2=terrain.getAperture()**2;
   let rayTests=0,rejectedOcclusion=0,rejectedAperture=0;
   for(const {edge} of [...bins.values()].sort((a,b)=>b.score-a.score).slice(0,256)){
     const a=edge.a*3,b=edge.b*3;
     const x=(v[a]+v[b])/2-offsetX,y=(v[a+1]+v[b+1])/2,z=(v[a+2]+v[b+2])/2-offsetZ;
     if(x*x+y*y+z*z>aperture2){rejectedAperture++;continue}
     rayTarget.set(x,y,z);rayDirection.copy(rayTarget).sub(camera.position);
     const distance=rayDirection.length();if(distance<.001)continue;
     rayDirection.multiplyScalar(1/distance);
     visibilityRay.set(camera.position,rayDirection);visibilityRay.near=.01;visibilityRay.far=distance+.08;
     rayTests++;
     const blocked=visibilityRay.intersectObjects(terrain.group.children,false).some(hit=>{
       const p=hit.point;
       return p.x*p.x+p.y*p.y+p.z*p.z<=aperture2&&hit.distance<distance-.11;
     });
     if(blocked){rejectedOcclusion++;continue}
     const face=drawSurface.faces[edge.faces[0]];
     const kind=edge.wall?'sdfUndersurface':face.normal[1]<-.4?'undersurfaceTerrain':
       face.normal[1]>.4?'surfaceTerrain':'sdfSurface';
     selected[kind].push([x,y,z]);
   }
   for(const [kind,mesh] of Object.entries(nodeMeshes)){
     mesh.count=Math.min(128,selected[kind].length);
     for(let i=0;i<mesh.count;i++){
       dummy.position.set(...selected[kind][i]);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
     }
     mesh.instanceMatrix.needsUpdate=true;
   }
   drawReport={...drawSurface.stats,...result.stats,cameraUpdates:++drawUpdates,
     mode:'camera-contour midpoint witnesses with raycast visibility',
     counts:Object.fromEntries(Object.entries(nodeMeshes).map(([k,m])=>[k,m.count])),
     screenBins:bins.size,rayTests,rejectedOcclusion,rejectedAperture,
     visibilityMethod:'CPU terrain raycast with spherical aperture filtering',
     visibilityAudited:false,contourCoverageAudited:false,
     candidateDisplayEnabled:drawLines.visible};
   // Keep a bounded diagnostic sample. Never call these occlusion-confirmed edges.
   const points=[],max=1200,stride=Math.max(1,Math.ceil(result.segments.length/max));
   for(let i=0;i<result.segments.length;i+=stride){
     const e=result.segments[i],a=e.a*3,b=e.b*3,v=drawSurface.vertices;
     points.push(v[a]-offsetX,v[a+1],v[a+2]-offsetZ,v[b]-offsetX,v[b+1],v[b+2]-offsetZ);
   }
   drawLines.geometry.dispose();
   drawLines.geometry=new T.BufferGeometry();
   drawLines.geometry.setAttribute('position',new T.Float32BufferAttribute(points,3));
 }
 world.cycleDrawWitness=()=>{drawLines.visible=!drawLines.visible;return drawLines.visible};

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
 world.update=dt=>{wanderer.update(dt);updateDrawWitness()};
 const inspectShell=world.inspect.bind(world);
 world.inspect=()=>({name:'Genesis',shell:inspectShell(),systems:[{name:'terrain',...terrain.inspect()},{name:'wanderer',...wanderer.inspect()}],edgeGeometry,edgeTreatment:inspectEdge(),lattice:{...inspectLattice(),visible:false,legacy:true},drawWitness:drawReport,tapOwnership:{...tapReport,recent:[...tapReport.recent]}});
 return world;
}
