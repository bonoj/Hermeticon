import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

/**
 * Reusable spherical-body collision gate. World queries are injected.
 * solidAt(x,y,z) must conservatively identify occupied terrain; this adapter
 * samples the sphere, so it is NOT a proof against features narrower than its
 * sampling resolution. For a strict guarantee supply intersectsSphere(center,r)
 * backed by actual geometry or a metric distance query.
 * No behavioral/player knowledge belongs here.
 */
export function createSphericalBody({radius,innerRadius=Infinity,solidAt=()=>false,intersectsSphere=null,clearance=null,margin=.04}={}){
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
 const wallClearance=p=>maxCenter-p.length();
 const availableClearance=p=>Math.min(wallClearance(p),clearance?clearance(p,radius+margin):Infinity);
 const valid=p=>{
  if(p.lengthSq()>maxCenter*maxCenter)return false;
  if(clearance)return clearance(p,radius+margin)>=0;
  if(intersectsSphere)return !intersectsSphere(p,radius+margin);
  for(const [x,y,z] of samples)if(solidAt(p.x+x*(radius+margin),p.y+y*(radius+margin),p.z+z*(radius+margin)))return false;
  return true;
 };
 const probe=new T.Vector3();
 let sweepQueries=0,contacts=0,unresolved=0;
 const sweep=(a,b)=>{
  if(!valid(a))return false;
  const length=a.distanceTo(b);
  if(length<1e-10)return true;
  if(clearance){
   // Both distance-to-triangle and spherical wall clearance are 1-Lipschitz
   // with respect to the sphere center. Advancing by <= available clearance
   // cannot cross a static surface, regardless of thin geometry.
   let traveled=0;
   for(let i=0;i<256;i++){
    probe.copy(a).lerp(b,traveled/length);
    sweepQueries++;
    const free=availableClearance(probe);
    if(free<0){contacts++;return false}
    if(length-traveled<=Math.max(0,free)*.8)return valid(b);
    if(free<=1e-6){contacts++;return false}
    traveled+=Math.min(length-traveled,free*.8);
   }
   unresolved++;return false; // never accept an unverified path
  }
  const n=Math.max(1,Math.ceil(length/Math.min(.10,radius*.08)));
  for(let i=1;i<=n;i++)if(!valid(probe.copy(a).lerp(b,i/n))){contacts++;return false}
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
 // Emergency overlap recovery is local and bounded. Never teleport across
 // terrain to an arbitrary distant candidate. This is not continuous wall CCD.
 const resolveBoundary=(position)=>{
  if(valid(position))return {ok:true,corrected:false};
  const radial=position.lengthSq()>1e-12?position.clone().normalize():new T.Vector3(0,1,0);
  const axis=Math.abs(radial.y)<.85?new T.Vector3(0,1,0):new T.Vector3(1,0,0);
  const tangent=new T.Vector3().crossVectors(radial,axis).normalize();
  const bitangent=new T.Vector3().crossVectors(radial,tangent).normalize();
  const excess=Math.max(0,position.length()-maxCenter);
  const candidate=new T.Vector3();
  // If wall is the only violated constraint, its shortest correction is radial.
  if(excess>0){
   candidate.copy(position).addScaledVector(radial,-excess-1e-5);
   if(valid(candidate)){position.copy(candidate);return {ok:true,corrected:true,displacement:excess+1e-5}}
  }
  // Search a tightly bounded contact neighborhood, preferring minimum movement.
  // Invalid starting points cannot use sweep; reject if no nearby free solution.
  const options=[];
  for(const distance of [.025,.05,.1,.2,.35,.5]){
   for(let i=0;i<32;i++){
    const angle=i*Math.PI*2/32;
    for(const inward of [0,.5,1]){
     candidate.copy(position).addScaledVector(radial,-distance*inward)
      .addScaledVector(tangent,distance*Math.sqrt(1-inward*inward)*Math.cos(angle))
      .addScaledVector(bitangent,distance*Math.sqrt(1-inward*inward)*Math.sin(angle));
     if(valid(candidate))options.push({point:candidate.clone(),distance:position.distanceTo(candidate)});
    }
   }
   if(options.length)break;
  }
  options.sort((a,b)=>a.distance-b.distance);
  if(options.length){position.copy(options[0].point);return {ok:true,corrected:true,displacement:options[0].distance}}
  unresolved++;return {ok:false,corrected:false,reason:'No local nonpenetrating correction within 0.5 units'};
 };
 return {radius,valid,sweep,tryMove,resolveBoundary,inspect:()=>({sweepQueries,contacts,unresolved,clearanceBackend:!!clearance})};
}
