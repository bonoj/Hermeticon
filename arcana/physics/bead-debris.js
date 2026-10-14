import {WANDERER_PHYSICS as P,reflectContact,signedFieldNormal,catchVesselUnderside} from './wanderer-contacts.js';
export function createBeadDebris(T,{terrain,offset,innerRadius,parent,capacity=9000}){
 const geo=new T.IcosahedronGeometry(1,1),mat=new T.MeshStandardMaterial({roughness:.8,metalness:.04});
 const mesh=new T.InstancedMesh(geo,mat,capacity);mesh.frustumCulled=false;mesh.count=0;parent.add(mesh);
 const beads=[],dummy=new T.Object3D(),ownership={terrain:0,vessel:0};let terrainHits=0,vesselHits=0,emitted=0;
 function emit(items,point,impulse=18){
  const o=offset();
  for(const item of items){
   if(beads.length>=capacity)break;
   const x=item.x,y=item.y,z=item.z,dx=x-point.x,dy=y-point.y,dz=z-point.z;
   const dist=Math.hypot(dx,dy,dz)||.001,fall=Math.max(.25,1-Math.min(1,dist/3.2));
   const power=impulse*fall*(.65+.35*Math.sin(emitted*12.9898)**2),inv=1/dist;
   const b={x,y,z,vx:dx*inv*power,vy:dy*inv*power+3,vz:dz*inv*power,r:item.r,color:item.color,ax:Math.sin(emitted*3.7)*14,ay:Math.cos(emitted*2.3)*14,az:Math.sin(emitted*1.9)*14,rx:0,ry:0,rz:0};
   beads.push(b);emitted++;
  }
  return items.length;
 }
 function update(dt){
  const o=offset(),sample=(x,y,z)=>terrain.sample(x,y,z);
  const count=Math.max(1,Math.ceil(Math.min(.05,dt)/.008)),step=Math.min(.05,dt)/count;
  for(const b of beads){
   for(let k=0;k<count;k++){
    // Physics uses the current owner's coordinates; terrain queries always use geology.
    const ox=b.x,oy=b.y,oz=b.z;b.vy-=P.gravity*step;
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
  let n=0,terrainOwned=0,vesselOwned=0;
  for(const b of beads){
   if(b.owner==='terrain')terrainOwned++;else vesselOwned++;
   const x=b.x-(b.owner==='terrain'?o.x:0),z=b.z-(b.owner==='terrain'?o.z:0);
   if(Math.hypot(x,b.y,z)+b.r>innerRadius)continue;
   dummy.position.set(x,b.y,z);dummy.rotation.set(b.rx,b.ry,b.rz);dummy.scale.setScalar(b.r);dummy.updateMatrix();
   mesh.setMatrixAt(n,dummy.matrix);mesh.setColorAt(n,b.color);n++;
  }
  mesh.count=n;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  ownership.terrain=terrainOwned;ownership.vessel=vesselOwned;
 }

 return {emit,update,inspect:()=>({name:'Detached anatomical BBs',count:beads.length,visible:mesh.count,terrainHits,vesselHits,emitted,ownership:{...ownership}})};
}
