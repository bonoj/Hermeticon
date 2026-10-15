import {WANDERER_PHYSICS as P,reflectContact,signedFieldNormal,catchVesselUnderside} from './wanderer-contacts.js';
export function createBeadDebris(T,{terrain,offset,innerRadius,parent,abiogenesis=null}){
 const geo=new T.IcosahedronGeometry(1,1),mat=new T.MeshStandardMaterial({roughness:.8,metalness:.04});
 let mesh=null,allocated=0;const perf={growths:0,lastGrowthMs:0,peakGrowthMs:0,lastEmitMs:0,peakEmitMs:0,lastPhysicsMs:0,peakPhysicsMs:0,lastRenderMs:0,peakRenderMs:0};
 function ensureMesh(required){if(required<=allocated)return;const t=performance.now();const next=Math.max(required,allocated?allocated*2:256);const replacement=new T.InstancedMesh(geo,mat,next);replacement.frustumCulled=false;replacement.count=0;parent.add(replacement);if(mesh)parent.remove(mesh);mesh=replacement;allocated=next;perf.growths++;perf.lastGrowthMs=performance.now()-t;perf.peakGrowthMs=Math.max(perf.peakGrowthMs,perf.lastGrowthMs);}
 ensureMesh(256);
 const beads=[],dummy=new T.Object3D(),ownership={terrain:0,vessel:0,abiogenesis:0};let terrainHits=0,vesselHits=0,emitted=0,abiogenesisCaptures=0,abiogenesisInteriorHits=0,abiogenesisExteriorHits=0,abiogenesisPulses=0,abiogenesisLastAffected=0;
 function canAccept(){return true;}
 function emit(items,point,impulse=18){const t=performance.now();
  const o=offset();
  for(const item of items){
   const x=item.x,y=item.y,z=item.z,dx=x-point.x,dy=y-point.y,dz=z-point.z;
   const dist=Math.hypot(dx,dy,dz)||.001,fall=Math.max(.25,1-Math.min(1,dist/3.2));
   const power=impulse*fall*(.65+.35*Math.sin(emitted*12.9898)**2),inv=1/dist;
   const b={x,y,z,vx:dx*inv*power,vy:dy*inv*power+3,vz:dz*inv*power,r:item.r,color:item.color,ax:Math.sin(emitted*3.7)*14,ay:Math.cos(emitted*2.3)*14,az:Math.sin(emitted*1.9)*14,owner:'terrain',rx:0,ry:0,rz:0};
   beads.push(b);emitted++;
  }
  perf.lastEmitMs=performance.now()-t;perf.peakEmitMs=Math.max(perf.peakEmitMs,perf.lastEmitMs);return items.length;
 }
 function receiveImpulse(point,{radius=3.2,impulse=18}={}){
  let affected=0;const o=offset();
  for(const b of beads){
   if(b.owner==='abiogenesis')continue;
   const x=b.x+(b.owner==='vessel'?o.x:0),z=b.z+(b.owner==='vessel'?o.z:0),dx=x-point.x,dy=b.y-point.y,dz=z-point.z,d=Math.hypot(dx,dy,dz);
   if(d>=radius)continue;
   const force=impulse*(1-d/radius)**2,inv=1/Math.max(.001,d);
   b.vx+=dx*inv*force;b.vy+=dy*inv*force;b.vz+=dz*inv*force;b.ax+=force*1.3;b.ay+=force*.9;affected++;
  }
  return affected;
 }
 function collideSphere(center,radius,receive){
  const o=offset();let hits=0;
  for(const b of beads){
   if(b.owner==='abiogenesis')continue;
   const x=b.x-(b.owner==='terrain'?o.x:0),z=b.z-(b.owner==='terrain'?o.z:0);
   const dx=x-center.x,dy=b.y-center.y,dz=z-center.z,d=Math.hypot(dx,dy,dz);
   if(d>=radius+b.r)continue;
   const nx=d>.0001?dx/d:0,ny=d>.0001?dy/d:1,nz=d>.0001?dz/d:0;
   if(receive(x,b.y,z,b.r,b.vx,b.vy,b.vz)){
    const approach=b.vx*nx+b.vy*ny+b.vz*nz;
    if(approach<0){b.vx-=1.5*approach*nx;b.vy-=1.5*approach*ny;b.vz-=1.5*approach*nz;}
    hits++;
   }
  }
  return hits;
 }
 // One spatial scan per tap; never an inverse-square field in the frame loop.
 function pulseAbiogenesis(){
  if(!abiogenesis)return 0;
  const o=offset(),c=abiogenesis.position,range=abiogenesis.range;
  let affected=0;
  for(const b of beads){
   if(b.owner==='abiogenesis')continue;
   const x=b.x-(b.owner==='terrain'?o.x:0)-c.x;
   const y=b.y-c.y,z=b.z-(b.owner==='terrain'?o.z:0)-c.z;
   const d=Math.hypot(x,y,z);
   if(d>=range||d<1e-6)continue;
   const ux=x/d,uy=y/d,uz=z/d;
   const radial=b.vx*ux+b.vy*uy+b.vz*uz;
   // Cancel outward radial velocity, then deliver a decisive inward kick.
   const kick=abiogenesis.impulse+Math.max(0,radial);
   b.vx-=ux*kick;b.vy-=uy*kick;b.vz-=uz*kick;
   b.vacuumTicket=true;
   affected++;
  }
  abiogenesisPulses++;abiogenesisLastAffected=affected;
  return affected;
 }
 function update(dt){const physicsStart=performance.now();
  const o=offset(),sample=(x,y,z)=>terrain.sample(x,y,z);
  const count=Math.max(1,Math.ceil(Math.min(.05,dt)/.008)),step=Math.min(.05,dt)/count;
  for(const b of beads){
   for(let k=0;k<count;k++){
    // Physics uses the current owner's coordinates; terrain queries always use geology.
    const ox=b.x,oy=b.y,oz=b.z;b.vy-=P.gravity*step;
    if(b.owner==='abiogenesis'){
     const limit=abiogenesis.innerRadius*abiogenesis.scale-b.r-.003;
     b.x+=b.vx*step;b.y+=b.vy*step;b.z+=b.vz*step;
     const rr=Math.hypot(b.x,b.y,b.z);
     if(rr>limit&&rr>1e-7){
      const normal={x:-b.x/rr,y:-b.y/rr,z:-b.z/rr};
      b.x=-normal.x*limit;b.y=-normal.y*limit;b.z=-normal.z*limit;
      if(reflectContact(b,normal,P.vesselRestitution))abiogenesisInteriorHits++;
     }
     b.rx+=b.ax*step;b.ry+=b.ay*step;b.rz+=b.az*step;
     b.ax*=.999;b.ay*=.999;b.az*=.999;
     continue;
    }
    // Idle path: no nested-vessel collision scan for every bead/substep.
    // Only beads struck by a vacuum pulse can enter Abiogenesis.
    if(b.vacuumTicket){
     const c=abiogenesis.position;
     const wx=b.x-(b.owner==='terrain'?o.x:0),wz=b.z-(b.owner==='terrain'?o.z:0);
     const dx=wx-c.x,dy=b.y-c.y,dz=wz-c.z,d=Math.hypot(dx,dy,dz);
     const nx=dx+b.vx*step,ny=dy+b.vy*step,nz=dz+b.vz*step;
     const exterior=abiogenesis.outerRadius*abiogenesis.scale+b.r;
     if(d>=exterior&&Math.hypot(nx,ny,nz)<exterior&&dx*b.vx+dy*b.vy+dz*b.vz<0){
      b.vacuumTicket=false;
      b.x=nx;b.y=ny;b.z=nz;b.owner='abiogenesis';abiogenesisCaptures++;
      continue;
     }
     // A pulse is a finite encounter, not a permanent capture permission.
     if(d>abiogenesis.range+Math.hypot(b.vx,b.vy,b.vz)*step){
      b.vacuumTicket=false;vacuumCandidates.delete(b);
     }
    }
    const nx=ox+b.vx*step,ny=oy+b.vy*step,nz=oz+b.vz*step;
    const gx=x=>x+(b.owner==='vessel'?o.x:0),gz=z=>z+(b.owner==='vessel'?o.z:0);
    const start=sample(gx(ox),oy,gz(oz)),end=sample(gx(nx),ny,gz(nz));
    if(start< -b.r&&end>=-b.r){
     let lo=0,hi=1;
     for(let j=0;j<7;j++){const mid=(lo+hi)/2;if(sample(gx(ox+(nx-ox)*mid),oy+(ny-oy)*mid,gz(oz+(nz-oz)*mid))>=-b.r)hi=mid;else lo=mid;}
     const x=ox+(nx-ox)*lo,y=oy+(ny-oy)*lo,z=oz+(nz-oz)*lo;
     const normal=signedFieldNormal(sample,gx(x),y,gz(z));
     reflectContact(b,normal,P.microRestitution,1-P.microFriction);
     b.x=x+normal.x*.004;b.y=y+normal.y*.004;b.z=z+normal.z*.004;terrainHits++;
     if(b.owner!=='terrain'){b.x+=o.x;b.z+=o.z;b.owner='terrain';}
    }else{b.x=nx;b.y=ny;b.z=nz;}
    // Bowl containment is always evaluated in Hermeticon space.
    const vesselBody=b.owner==='terrain'?{x:b.x-o.x,y:b.y,z:b.z-o.z,vx:b.vx,vy:b.vy,vz:b.vz}:b;
    const wall=catchVesselUnderside(vesselBody,{innerRadius,beadRadius:b.r});
    if(wall.caught){
     if(b.owner!=='vessel'){b.x=vesselBody.x;b.y=vesselBody.y;b.z=vesselBody.z;b.owner='vessel';}
     b.vx=vesselBody.vx;b.vy=vesselBody.vy;b.vz=vesselBody.vz;
     if(wall.bounced)vesselHits++;
    }
    b.rx+=b.ax*step;b.ry+=b.ay*step;b.rz+=b.az*step;
    b.ax*=.999;b.ay*=.999;b.az*=.999;
   }
  }
  perf.lastPhysicsMs=performance.now()-physicsStart;perf.peakPhysicsMs=Math.max(perf.peakPhysicsMs,perf.lastPhysicsMs);const renderStart=performance.now();
  ensureMesh(beads.length);
  let n=0,terrainOwned=0,vesselOwned=0,abiogenesisOwned=0;
  for(const b of beads){
   if(b.owner==='terrain')terrainOwned++;else if(b.owner==='vessel')vesselOwned++;else abiogenesisOwned++;
   const x=b.owner==='abiogenesis'?abiogenesis.position.x+b.x:b.x-(b.owner==='terrain'?o.x:0);
   const y=b.owner==='abiogenesis'?abiogenesis.position.y+b.y:b.y;
   const z=b.owner==='abiogenesis'?abiogenesis.position.z+b.z:b.z-(b.owner==='terrain'?o.z:0);
   if(Math.hypot(x,y,z)+b.r>innerRadius)continue;
   dummy.position.set(x,y,z);dummy.rotation.set(b.rx,b.ry,b.rz);dummy.scale.setScalar(b.r);dummy.updateMatrix();
   mesh.setMatrixAt(n,dummy.matrix);mesh.setColorAt(n,b.color);n++;
  }
  mesh.count=n;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  ownership.terrain=terrainOwned;ownership.vessel=vesselOwned;ownership.abiogenesis=abiogenesisOwned;perf.lastRenderMs=performance.now()-renderStart;perf.peakRenderMs=Math.max(perf.peakRenderMs,perf.lastRenderMs);
 }

 return {emit,canAccept,receiveImpulse,collideSphere,pulseAbiogenesis,update,inspect:()=>({name:'Detached anatomical BBs',count:beads.length,visible:mesh.count,terrainHits,vesselHits,abiogenesisCaptures,abiogenesisInteriorHits,abiogenesisExteriorHits,abiogenesisPulses,abiogenesisLastAffected,emitted,allocated,perf:{...perf},ownership:{...ownership}})};
}
