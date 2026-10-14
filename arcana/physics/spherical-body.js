import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

/**
 * Reusable spherical-body collision gate. World queries are injected.
 * solidAt(x,y,z) must conservatively identify occupied terrain; this adapter
 * samples the sphere, so it is NOT a proof against features narrower than its
 * sampling resolution. For a strict guarantee supply intersectsSphere(center,r)
 * backed by actual geometry or a metric distance query.
 * No behavioral/player knowledge belongs here.
 */
export function createSphericalBody({radius,innerRadius=Infinity,solidAt=()=>false,intersectsSphere=null,margin=.04}={}){
 if(!(radius>0))throw new Error('Spherical body requires positive radius');
 const maxCenter=innerRadius-radius-margin;
 const samples=[[0,0,0]];
 // Multiple concentric shells detect internal occupancy as well as contacts.
 for(const scale of [.4,.7,1]){
  const n=scale===1?162:scale===.7?74:32;
  for(let i=0;i<n;i++){
   const y=1-2*(i+.5)/n,a=i*2.399963229728653,h=Math.sqrt(1-y*y);
   samples.push([scale*h*Math.cos(a),scale*y,scale*h*Math.sin(a)]);
  }
 }
 const valid=p=>{
  if(p.lengthSq()>maxCenter*maxCenter)return false;
  if(intersectsSphere)return !intersectsSphere(p,radius+margin);
  for(const [x,y,z] of samples)if(solidAt(p.x+x*(radius+margin),p.y+y*(radius+margin),p.z+z*(radius+margin)))return false;
  return true;
 };
 const probe=new T.Vector3();
 const sweep=(a,b)=>{
  if(!valid(a))return false;
  const n=Math.max(1,Math.ceil(a.distanceTo(b)/Math.min(.10,radius*.08)));
  for(let i=1;i<=n;i++)if(!valid(probe.copy(a).lerp(b,i/n)))return false;
  return true;
 };
 const tryMove=(position,displacement)=>{
  const end=position.clone().add(displacement);
  if(sweep(position,end)){position.copy(end);return true}
  // Axis and tangential sliding, never accepting an invalid end point.
  const candidates=[
   new T.Vector3(displacement.x,0,displacement.z),
   new T.Vector3(displacement.x,displacement.y,0),
   new T.Vector3(0,displacement.y,displacement.z),
   new T.Vector3(displacement.x,0,0),
   new T.Vector3(0,displacement.y,0),
   new T.Vector3(0,0,displacement.z)
  ];
  for(const d of candidates)if(d.lengthSq()>1e-12&&sweep(position,position.clone().add(d))){position.add(d);return true}
  return false;
 };
 const resolveBoundary=(position)=>{
  if(valid(position))return {ok:true,corrected:false};
  // Search on the allowed wall's spherical cap and inward, including
  // tangential options. Never force a radial correction through terrain.
  const radial=position.clone().normalize();
  const axis=Math.abs(radial.y)<.85?new T.Vector3(0,1,0):new T.Vector3(1,0,0);
  const tangent=new T.Vector3().crossVectors(radial,axis).normalize();
  const bitangent=new T.Vector3().crossVectors(radial,tangent).normalize();
  const candidate=new T.Vector3();
  const projected=position.clone().multiplyScalar(Math.min(1,maxCenter/position.length()));
  for(const inset of [0,.12,.3,.6,1,1.7,2.6,4,6,9]){
   for(const lateral of [0,.25,.5,1,1.6,2.5,4,6]){
    for(let i=0;i<(lateral===0?1:16);i++){
     const a=i*Math.PI*2/16;
     candidate.copy(projected).addScaledVector(radial,-inset)
      .addScaledVector(tangent,lateral*Math.cos(a))
      .addScaledVector(bitangent,lateral*Math.sin(a));
     if(candidate.lengthSq()>maxCenter*maxCenter)continue;
     if(valid(candidate)){position.copy(candidate);return {ok:true,corrected:true}}
    }
   }
  }
  return {ok:false,corrected:false,reason:'No nonpenetrating candidate found'};
 };
 return {radius,valid,sweep,tryMove,resolveBoundary};
}
