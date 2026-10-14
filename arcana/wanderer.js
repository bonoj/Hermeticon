import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
// Movement, supported-path A*, and stable-plane tap picking retained from Wanderer Separated.
export function createWanderer({terrain}){
 const R=9.65,MAXY=3.6,MINY=-3.6,WANDER_SIZE=.38,WALK_SPEED=1.8,HANGOUT_R=9.72*.5;
 const fieldSample=terrain.sample;
 const group=new T.Group();group.name='wanderer';
 const wanderCube=new T.Mesh(new T.BoxGeometry(WANDER_SIZE,WANDER_SIZE,WANDER_SIZE),new T.MeshStandardMaterial({color:0xf0bf68,roughness:.75,depthTest:true,depthWrite:true}));group.add(wanderCube);
 let wanderX=0,wanderZ=0;
 let walker={matterTag:'macro',x:0,y:1.15,z:0,target:null,route:[],accepted:0,rejected:0};
 function walkSurface(x,z){
 let prior=fieldSample(x,MAXY-.02,z);
 for(let y=MAXY-.08;y>=MINY+.02;y-=.07){
  const v=fieldSample(x,y,z);
  if(prior<=0&&v>0){
   let lo=y,hi=y+.07;
   for(let k=0;k<9;k++){const mid=(lo+hi)/2;if(fieldSample(x,mid,z)>0)lo=mid;else hi=mid}
   return (lo+hi)/2;
  }
  prior=v;
 }
 return null;
}
function walkSupport(x,z){
 const half=WANDER_SIZE*.5,foot=half*.8;
 const h=walkSurface(x,z);
 if(h===null)return null;
 // Every bottom corner needs support: holes stop the cube at their rim.
 for(const dx of [-foot,foot])for(const dz of [-foot,foot]){
  const corner=walkSurface(x+dx,z+dz);
  if(corner===null||Math.abs(corner-h)>.43)return null;
 }
 // Inner sphere must contain all eight cube corners, including the upper corners.
 for(const dx of [-half,half])for(const dz of [-half,half])
  for(const dy of [0,WANDER_SIZE])
   if((x-wanderX+dx)**2+(z-wanderZ+dz)**2+(h+dy)**2>(R-.015)**2)return null;
 return h;
}
// Bounded A* on the same support predicate used for movement. Diagonal cuts
// require both orthogonal neighbors; line-of-sight smoothing removes grid zigzags.
const PATH_GRID=.34,PATH_LIMIT=17000;
function walkClear(ax,az,bx,bz){
 const d=Math.hypot(bx-ax,bz-az),n=Math.max(1,Math.ceil(d/.11));
 for(let i=1;i<=n;i++){const t=i/n;if(walkSupport(ax+(bx-ax)*t,az+(bz-az)*t)===null)return false}
 return true;
}
function walkRoute(tx,tz){
 const sx=walker.x,sz=walker.z;
 if(walkClear(sx,sz,tx,tz))return [{x:tx,z:tz}];
 const radius=Math.min(26,Math.max(8,Math.hypot(tx-sx,tz-sz)+5));
 const minX=Math.floor((Math.min(sx,tx)-radius*.5)/PATH_GRID)*PATH_GRID;
 const minZ=Math.floor((Math.min(sz,tz)-radius*.5)/PATH_GRID)*PATH_GRID;
 const w=Math.ceil((Math.max(sx,tx)+radius*.5-minX)/PATH_GRID)+1;
 const h=Math.ceil((Math.max(sz,tz)+radius*.5-minZ)/PATH_GRID)+1;
 const key=(x,z)=>x+w*z,px=x=>minX+x*PATH_GRID,pz=z=>minZ+z*PATH_GRID;
 const startX=Math.round((sx-minX)/PATH_GRID),startZ=Math.round((sz-minZ)/PATH_GRID);
 const goalX=Math.round((tx-minX)/PATH_GRID),goalZ=Math.round((tz-minZ)/PATH_GRID);
 const pass=new Map(),valid=(x,z)=>{if(x<0||z<0||x>=w||z>=h)return false;const k=key(x,z);if(!pass.has(k))pass.set(k,walkSupport(px(x),pz(z))!==null);return pass.get(k)};
 const start=key(startX,startZ),open=[start],g=new Map([[start,0]]),parents=new Map(),closed=new Set();
 const heuristic=(x,z)=>Math.hypot(x-goalX,z-goalZ);
 let best=start,bestDist=heuristic(startX,startZ),iterations=0;
 while(open.length&&iterations++<PATH_LIMIT){
  let pick=0,score=Infinity;
  for(let i=0;i<open.length;i++){const k=open[i],x=k%w,z=Math.floor(k/w),f=g.get(k)+heuristic(x,z);if(f<score){score=f;pick=i}}
  const current=open.splice(pick,1)[0];if(closed.has(current))continue;closed.add(current);
  const x=current%w,z=Math.floor(current/w),distance=heuristic(x,z);
  if(distance<bestDist){best=current;bestDist=distance}
  if(distance<=1&&walkClear(px(x),pz(z),tx,tz)){best=current;break}
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){
   if(!dx&&!dz)continue;const nx=x+dx,nz=z+dz,nk=key(nx,nz);
   if(closed.has(nk)||!valid(nx,nz))continue;
   if(dx&&dz&&(!valid(x+dx,z)||!valid(x,z+dz)))continue;
   if(!walkClear(px(x),pz(z),px(nx),pz(nz)))continue;
   const ng=g.get(current)+Math.hypot(dx,dz);
   if(ng<(g.get(nk)??Infinity)){g.set(nk,ng);parents.set(nk,current);if(!open.includes(nk))open.push(nk)}
  }
 }
 if(best===start)return [];
 const raw=[];let k=best;
 while(k!==start&&parents.has(k)){raw.push({x:px(k%w),z:pz(Math.floor(k/w))});k=parents.get(k)}
 raw.reverse();if(walkClear(raw[raw.length-1].x,raw[raw.length-1].z,tx,tz))raw.push({x:tx,z:tz});
 const smooth=[],points=[{x:sx,z:sz},...raw];let i=0;
 while(i<points.length-1){let j=points.length-1;while(j>i+1&&!walkClear(points[i].x,points[i].z,points[j].x,points[j].z))j--;smooth.push(points[j]);i=j}
 return smooth;
}
// Movement consumes terrain-space destinations, never pointer events.
function moveTo(tx,tz){
 if(!Number.isFinite(tx)||!Number.isFinite(tz)||walkSupport(tx,tz)===null){walker.rejected++;return false}
 walker.route=walkRoute(tx,tz);walker.target=walker.route.shift()??null;
 if(walker.target){walker.accepted++;return true}walker.rejected++;return false;
}


 function update(dt){
 if(walker.accepted===0&&!walker.target){const h=walkSupport(walker.x,walker.z);if(h!==null)walker.y=h}
 if(walker.target){const dx=walker.target.x-walker.x,dz=walker.target.z-walker.z,d=Math.hypot(dx,dz);if(d<=.07)walker.target=walker.route.shift()??null;else{const step=Math.min(d,WALK_SPEED*dt),ux=dx/d,uz=dz/d;let blocked=false;for(let travelled=0;travelled<step;){const stride=Math.min(.065,step-travelled),nx=walker.x+ux*stride,nz=walker.z+uz*stride,h=walkSupport(nx,nz);if(h===null){blocked=true;break}walker.x=nx;walker.z=nz;walker.y=h;travelled+=stride}if(blocked){walker.route=[];walker.target=null}}}
 const screenX=walker.x-wanderX,screenZ=walker.z-wanderZ,rad=Math.hypot(screenX,screenZ);
 if(rad>HANGOUT_R){const factor=(rad-HANGOUT_R)/rad;wanderX=T.MathUtils.clamp(wanderX+screenX*factor,-14,14);wanderZ=T.MathUtils.clamp(wanderZ+screenZ*factor,-14,14);terrain.setOffset(wanderX,wanderZ)}
 wanderCube.position.set(walker.x-wanderX,walker.y+WANDER_SIZE*.5,walker.z-wanderZ);
 }
 return {group,update,moveTo,getWalkingHeight:()=>walker.y,inspect:()=>({x:walker.x,y:walker.y,z:walker.z,offset:[wanderX,wanderZ],accepted:walker.accepted,rejected:walker.rejected,target:walker.target,route:walker.route.length,support:walkSupport(walker.x,walker.z)})};
}
