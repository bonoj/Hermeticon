// Height-ranked mesh witnesses. Sorting is disposable and independent of camera movement.
export function buildHeightIndex(group){
 const points=[],seen=new Set();
 for(const mesh of group.children){
  const a=mesh.geometry.getAttribute('position');if(!a)continue;
  for(let i=0;i<a.count;i++){
   const x=a.getX(i),y=a.getY(i),z=a.getZ(i);
   const key=Math.round(x*10000)+','+Math.round(y*10000)+','+Math.round(z*10000);
   if(seen.has(key))continue;seen.add(key);
   points.push([x,y,z]);
  }
 }
 const order=points.map((_,i)=>i).sort((a,b)=>points[b][1]-points[a][1]);
 return {points,order,vertices:points.length};
}
export function surveyFourSurfaces(sample,radius,offsetX=0,offsetZ=0,budget=96,index){
 const t0=performance.now();
 const arrays={surfaceTerrain:[],sdfSurface:[],sdfUndersurface:[],undersurfaceTerrain:[]};
 const points=index.points,order=index.order,r2=radius*radius,spacing=0.88,spacing2=spacing*spacing;
 let considered=0,excluded=0;
 const select=(descending)=>{
  const chosen=[];
  const iter=descending?order:order.slice().reverse();
  for(const i of iter){
   const p=points[i],x=p[0]-offsetX,z=p[2]-offsetZ;
   considered++;
   if(x*x+p[1]*p[1]+z*z>r2){excluded++;continue}
   if(chosen.some(q=>(q[0]-x)**2+(q[2]-z)**2<spacing2))continue;
   chosen.push([x,p[1],z,i]);
   if(chosen.length===budget)break;
  }
  return chosen;
 };
 const upper=select(true),lower=select(false);
 const scan=(x,z,high)=>{
  // Find a signed transition along the seed's vertical column; retain
  // separate upper and lower crossings even when a bore splits the column.
  const crossings=[];let y0=-3.55,v0=sample(x+offsetX,y0,z+offsetZ);
  for(let j=1;j<=80;j++){
   const y1=-3.55+j*7.1/80,v1=sample(x+offsetX,y1,z+offsetZ);
   if((v0>0)!==(v1>0)){
    let lo=y0,hi=y1,insideLo=v0>0;
    for(let k=0;k<11;k++){const mid=(lo+hi)/2;if((sample(x+offsetX,mid,z+offsetZ)>0)===insideLo)lo=mid;else hi=mid}
    crossings.push({y:(lo+hi)/2,upper:insideLo});
   }
   y0=y1;v0=v1;
  }
  const candidates=crossings.filter(c=>c.upper===high);
  return candidates.length?(high?Math.max(...candidates.map(c=>c.y)):Math.min(...candidates.map(c=>c.y))):null;
 };
 let missingUpper=0,missingLower=0;
 for(const [x,y,z] of upper){
  arrays.surfaceTerrain.push([x,y,z]);
  const sy=scan(x,z,true);
  if(sy===null)missingUpper++;else arrays.sdfSurface.push([x,sy,z]);
 }
 for(const [x,y,z] of lower){
  arrays.undersurfaceTerrain.push([x,y,z]);
  const sy=scan(x,z,false);
  if(sy===null)missingLower++;else arrays.sdfUndersurface.push([x,sy,z]);
 }
 const highest=upper[0],lowest=lower[0];
 const stats={method:'disposable height-sorted mesh indices; vertical SDF bisection',domain:'rendered terrain mesh vertices inside spherical aperture',indexedVertices:index.vertices,requestedColumns:budget,selectedUpper:upper.length,selectedLower:lower.length,candidatesExamined:considered,apertureExcluded:excluded,spacing,missingUpper,missingLower,highestSeed:highest?highest.slice(0,3):null,lowestSeed:lowest?lowest.slice(0,3):null,selectionAndSearchMs:+(performance.now()-t0).toFixed(2),auditPass:missingUpper===0&&missingLower===0};
 return {arrays,stats};
}
