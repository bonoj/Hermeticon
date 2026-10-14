import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
// Signed field, tetrahedral chunk extraction and aperture shader migrated from Wanderer Separated.
export function createTerrain(){
 const NX=85,NY=21,NZ=85,MINY=-3.6,MAXY=3.6,WORLD_HALF=25.2,CHUNK=10,CX=Math.ceil((NX-1)/CHUNK),CZ=Math.ceil((NZ-1)/CHUNK);
 const depositedMaterial=new Map();
 const MATERIALS=[
 {id:0,name:'neutral bedrock',color:0x747b7d},
 {id:1,name:'warm soil',color:0xb29b75},
 {id:2,name:'basin sediment',color:0x8b7869},
 {id:3,name:'cold regolith',color:0xa9bdc2},
 {id:4,name:'weathered subsoil',color:0x766958},
 {id:5,name:'deep bedrock',color:0x505965}
];

 const atlas=(()=>{const width=85,height=85,halfExtent=25.2,size=width*height;
 const fields={jurisdiction:new Uint8Array(size),gradientWeight:new Uint8Array(size),elevation:new Float32Array(size),substrate:new Uint8Array(size),hydrology:new Uint8Array(size),provenance:new Uint8Array(size),strata:new Uint8Array(size),population:new Uint8Array(size),features:new Uint8Array(size)};
 return {version:2,origin:[0,0],halfExtent,resolution:[width,height],seed:741,fields,regions:{0:'unassigned',1:'summerlands',2:'winter-kings-realm',3:'gradient',4:'other'},compiled:true};})();
 atlas.fields.elevation.fill(1.15);atlas.fields.strata.fill(1);
 const contactProperties={standard:{restitution:.38},dissipative:{restitution:.24,friction:.86}};
 const field=new Float32Array(NX*NY*NZ),id=(x,y,z)=>x+NX*(y+NY*z);
 const xp=x=>(x/(NX-1)*2-1)*WORLD_HALF,yp=y=>MINY+y/(NY-1)*(MAXY-MINY),zp=z=>(z/(NZ-1)*2-1)*WORLD_HALF;
 const corners=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
 const tets=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
 const APERTURE_RADIUS=9.72,sharedApertureOffset=new T.Vector3();let activeAperture=APERTURE_RADIUS,apertureUniform=null;
 const apertureEyes={compileCount:0,vertexHook:false,fragmentHook:false,compileFailures:[],lastCompiledAt:null};
 const terrainMaterial=new T.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.92,metalness:.02,side:T.DoubleSide,flatShading:true,onBeforeCompile:shader=>{shader.uniforms.apertureRadius={value:activeAperture};apertureUniform=shader.uniforms.apertureRadius;shader.uniforms.apertureOffset={value:sharedApertureOffset};apertureEyes.compileCount++;apertureEyes.lastCompiledAt=performance.now();apertureEyes.vertexHook=shader.vertexShader.includes('#include <begin_vertex>');apertureEyes.fragmentHook=shader.fragmentShader.includes('#include <clipping_planes_fragment>');if(!apertureEyes.vertexHook||!apertureEyes.fragmentHook)apertureEyes.compileFailures.push('Missing shader injection anchor');shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vAperturePosition;\nuniform vec3 apertureOffset;');shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvAperturePosition=position-apertureOffset;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vAperturePosition;\nuniform float apertureRadius;\nuniform vec3 apertureOffset;');shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif(dot(vAperturePosition,vAperturePosition)>apertureRadius*apertureRadius) discard;');shader.fragmentShader=shader.fragmentShader.replace('#include <dithering_fragment>','#include <dithering_fragment>\nfloat apertureFog=smoothstep(7.1,9.70,length(vAperturePosition));\ngl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(0.045,0.115,0.16),apertureFog);')}});
 const solid=new T.Group();solid.name='terrain:signed-volume';
 const terrainChunks=[];const terrainPerf={totalChunks:CX*CZ,fullRebuilds:0,localRebuilds:0,lastDirtyChunks:0,lastRebuiltCells:0,lastRebuildMs:0,lastChangedChunks:[]};
 for(let cz=0;cz<CZ;cz++)for(let cx=0;cx<CX;cx++){const geometry=new T.BufferGeometry(),m=new T.Mesh(geometry,terrainMaterial);m.receiveShadow=true;m.frustumCulled=false;solid.add(m);terrainChunks.push({cx,cz,geometry,triangles:0})}
 let wanderX=0,wanderZ=0,cycle=0,seed=741,triangles=0,fieldMin=0,fieldMax=0,solidCount=0,voidCount=0,buildMs=0,terrainBuildCount=0;
 let operations=[],events=[];const rand=n=>{let v=Math.sin(n*127.1+seed*311.7)*43758.5453;return v-Math.floor(v)};
 function regenerate(){
 
 
 terrainBuildCount++;
 const start=performance.now();
 operations=[];
 // Vertical bores pierce the complete slab; raised and lowered regions act
 // independently on upper and lower surfaces.
 // Temporary visible-topology fixture for the equatorial edge study.
 for(const [x,z,r] of [[-3.6,1.8,1.25],[4.4,-2.5,1.45],[7.9,3.0,1.15]])operations.push({kind:'through-hole',x,z,r});
 for(const [face,x,z,r,delta] of [['top',-5.0,-3.5,2.8,1.35],['top',2.2,4.4,2.5,1.55],['top',6.8,-1.0,2.1,-0.9],['bottom',-2.0,-5.3,2.7,1.2],['bottom',4.2,4.0,2.5,-0.85]])operations.push({kind:delta>=0?'raise':'lower',face,x,z,r,delta});

 fieldMin=Infinity;fieldMax=-Infinity;solidCount=0;voidCount=0;
 for(let z=0;z<NZ;z++)for(let y=0;y<NY;y++)for(let x=0;x<NX;x++){
  const X=xp(x),Y=yp(y),Z=zp(z);
  let top=1.15,bottom=-1.15;
  for(const op of operations){if(op.kind==='through-hole')continue;const d=Math.hypot(X-op.x,Z-op.z)/op.r;if(d<1){const w=(1-d*d)**2;if(op.face==='top')top+=op.delta*w;else bottom-=op.delta*w}}
  let v=Math.min(top-Y,Y-bottom);
  for(const op of operations){if(op.kind!=='through-hole')continue;const d=Math.hypot(X-op.x,Z-op.z);v=Math.min(v,d-op.r)}
  field[id(x,y,z)]=v;fieldMin=Math.min(fieldMin,v);fieldMax=Math.max(fieldMax,v);if(v>0)solidCount++;else voidCount++;
 }
 extractTerrainMesh();
 events.push({cycle,seed,triangles,buildMs:+buildMs.toFixed(1),operations:operations.map(o=>({...o}))});if(events.length>5)events.shift();
}

 function extractTerrainMesh(bounds=null){
 const start=performance.now(),selected=[];
 if(!bounds)selected.push(...terrainChunks);
 else{const x0=Math.max(0,Math.floor(Math.max(0,bounds.x0-1)/CHUNK)),x1=Math.min(CX-1,Math.floor(Math.min(NX-2,bounds.x1)/CHUNK)),z0=Math.max(0,Math.floor(Math.max(0,bounds.z0-1)/CHUNK)),z1=Math.min(CZ-1,Math.floor(Math.min(NZ-2,bounds.z1)/CHUNK));for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++)selected.push(terrainChunks[x+CX*z])}
 const lerp=(p,q,a,b)=>{const t=Math.max(0,Math.min(1,a/(a-b)));return[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,p[2]+(q[2]-p[2])*t]};
 let rebuiltCells=0;
 for(const c of selected){
  const pos=[],tri=(a,b,c)=>{if(Math.min(Math.hypot(...a.map((v,i)=>v-b[i])),Math.hypot(...b.map((v,i)=>v-c[i])),Math.hypot(...c.map((v,i)=>v-a[i])))<.00001)return;pos.push(...a,...b,...c)};
  const x0=c.cx*CHUNK,x1=Math.min(NX-1,x0+CHUNK),z0=c.cz*CHUNK,z1=Math.min(NZ-1,z0+CHUNK);rebuiltCells+=(x1-x0)*(z1-z0)*(NY-1);
  for(let z=z0;z<z1;z++)for(let y=0;y<NY-1;y++)for(let x=x0;x<x1;x++){
   const p=corners.map(q=>[xp(x+q[0]),yp(y+q[1]),zp(z+q[2])]),v=corners.map(q=>field[id(x+q[0],y+q[1],z+q[2])]);
   for(const tet of tets){const inside=tet.filter(i=>v[i]>0),outside=tet.filter(i=>v[i]<=0);if(!inside.length||!outside.length)continue;
    if(inside.length===1||outside.length===1){const inv=outside.length===1,A=(inv?outside:inside)[0],others=inv?inside:outside,q=others.map(i=>lerp(p[A],p[i],v[A],v[i]));if(inv)tri(q[0],q[2],q[1]);else tri(q[0],q[1],q[2])}
    else{const [a,b]=inside,[c,d]=outside,q0=lerp(p[a],p[c],v[a],v[c]),q1=lerp(p[a],p[d],v[a],v[d]),q2=lerp(p[b],p[c],v[b],v[c]),q3=lerp(p[b],p[d],v[b],v[d]);tri(q0,q1,q2);tri(q2,q1,q3)}
   }
  }
  c.geometry.setAttribute('position',new T.Float32BufferAttribute(pos,3));c.geometry.setAttribute('color',new T.Float32BufferAttribute(new Float32Array(pos.length).fill(.52),3));c.geometry.computeVertexNormals();c.geometry.computeBoundingSphere();c.triangles=pos.length/9;
 }
 triangles=terrainChunks.reduce((n,c)=>n+c.triangles,0);buildMs=performance.now()-start;
 terrainPerf.lastDirtyChunks=selected.length;terrainPerf.lastRebuiltCells=rebuiltCells;terrainPerf.lastRebuildMs=+buildMs.toFixed(3);terrainPerf.lastChangedChunks=selected;if(bounds)terrainPerf.localRebuilds++;else terrainPerf.fullRebuilds++;
 solid.position.set(-wanderX,0,-wanderZ);sharedApertureOffset.set(wanderX,0,wanderZ);

}

 function fieldSample(X,Y,Z){const gx=(X/WORLD_HALF+1)*(NX-1)/2,gy=(Y-MINY)/(MAXY-MINY)*(NY-1),gz=(Z/WORLD_HALF+1)*(NZ-1)/2;if(gx<0||gy<0||gz<0||gx>=NX-1||gy>=NY-1||gz>=NZ-1)return -1;const x=Math.floor(gx),y=Math.floor(gy),z=Math.floor(gz),a=gx-x,b=gy-y,c=gz-z,lerp=(p,q,t)=>p+(q-p)*t;const layer=k=>lerp(lerp(field[id(x,y,k)],field[id(x+1,y,k)],a),lerp(field[id(x,y+1,k)],field[id(x+1,y+1,k)],a),b);return lerp(layer(z),layer(z+1),c)}
 function materialAt(X,Y,Z){
 if(!atlas)return null;
 const gx=Math.round((X/WORLD_HALF+1)*(NX-1)/2),gy=Math.round((Y-MINY)/(MAXY-MINY)*(NY-1)),gz=Math.round((Z/WORLD_HALF+1)*(NZ-1)/2);
 const deposited=depositedMaterial.get(id(gx,gy,gz));
 if(deposited&&field[id(gx,gy,gz)]>0)return {id:deposited.materialId,depth:0,sourceSubstrate:null,material:MATERIALS[deposited.materialId],lineage:deposited.lineage};
 const {fields:f,resolution:[w,h],halfExtent:half}=atlas;
 const ix=Math.max(0,Math.min(w-1,Math.round((X/half+1)*(w-1)/2)));
 const iz=Math.max(0,Math.min(h-1,Math.round((Z/half+1)*(h-1)/2)));
 const i=ix+w*iz,depth=f.elevation[i]-Y;
 const surface=f.substrate[i]===3?3:f.substrate[i]===2?2:f.substrate[i]===1?1:0;
 const materialId=depth<0.28?surface:depth<0.8?4:5;
 return {id:materialId,depth,sourceSubstrate:f.substrate[i],material:MATERIALS[materialId]};
}

 regenerate();
 return {group:solid,setAperture:r=>{activeAperture=r;if(apertureUniform)apertureUniform.value=r},getAperture:()=>activeAperture,setOffset:(x,z)=>{wanderX=x;wanderZ=z;solid.position.set(-x,0,-z);sharedApertureOffset.set(x,0,z)},sample:fieldSample,materialAt,atlas,materials:MATERIALS,contactProperties,deposits:depositedMaterial,inspect:()=>({dimensions:[NX,NY,NZ],atlasVersion:atlas.version,materialCount:MATERIALS.length,depositCount:depositedMaterial.size,contactProperties,top:1.15,bottom:-1.15,triangles,solidCount,voidCount,buildMs,terrainPerf:{...terrainPerf,lastChangedChunks:terrainPerf.lastChangedChunks.length},operations:operations.map(o=>({...o})),apertureRadius:activeAperture})};
}
