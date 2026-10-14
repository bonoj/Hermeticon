import {extractIntervals} from './boundary.js';
// Deterministic extremum-first rim survey. Four correlated strata; no renderer dependency.
export function surveyFourSurfaces(sample,radius,offsetX=0,offsetZ=0,budget=96){
 const arrays={surfaceTerrain:[],sdfSurface:[],sdfUndersurface:[],undersurfaceTerrain:[]};
 const N=768,TAU=Math.PI*2,inner=.18;
 const probe=(i,inset=0)=>{
  const a=TAU*i/N,c=Math.cos(a),s=Math.sin(a),r=radius-inset;
  const point=y=>{const d=Math.sqrt(Math.max(0,r*r-y*y));return [d*c+offsetX,d*s+offsetZ]};
  const result=extractIntervals(sample,point,-3.35,3.35,64,7);
  const top=result.crossings.filter(x=>x.fromSolid).map(x=>x.y);
  const bottom=result.crossings.filter(x=>!x.fromSolid).map(x=>x.y);
  return {top:top.length?Math.max(...top):null,bottom:bottom.length?Math.min(...bottom):null,result};
 };
 const rim=Array.from({length:N},(_,i)=>probe(i));
 const valid=(v)=>v!==null&&Number.isFinite(v);
 const extrema=(key,high)=>{
  const out=[];
  for(let i=0;i<N;i++){
   const y=rim[i][key],l=rim[(i+N-1)%N][key],r=rim[(i+1)%N][key];
   if(valid(y)&&valid(l)&&valid(r)&&(high?y>l&&y>=r:y<l&&y<=r))out.push(i);
  }
  return out;
 };
 const peaks=extrema('top',true),troughs=extrema('bottom',false);
 const chosen=new Set([...peaks,...troughs]);
 // Preserve all detected extrema before filling gaps; budget is soft if necessary.
 while(chosen.size<budget){
  let best=-1,score=-1;
  for(let i=0;i<N;i++){
   if(chosen.has(i)||(!valid(rim[i].top)&&!valid(rim[i].bottom)))continue;
   let gap=N;
   for(const j of chosen)gap=Math.min(gap,Math.abs(i-j),N-Math.abs(i-j));
   if(gap>score){score=gap;best=i}
  }
  if(best<0)break;chosen.add(best);
 }
 const selected=[...chosen].sort((a,b)=>a-b);
 const pos=(i,y,inset)=>{const a=TAU*i/N,r=Math.sqrt(Math.max(0,(radius-inset)**2-y*y));return [r*Math.cos(a),y,r*Math.sin(a)]};
 let mismatch=0,missingInnerUpper=0,missingInnerLower=0;
 for(const i of selected){
  const outer=rim[i],inside=probe(i,inner);
  if(valid(outer.top))arrays.surfaceTerrain.push(pos(i,outer.top,0));
  if(valid(outer.bottom))arrays.undersurfaceTerrain.push(pos(i,outer.bottom,0));
  if(valid(inside.top))arrays.sdfSurface.push(pos(i,inside.top,inner));else missingInnerUpper++;
  if(valid(inside.bottom))arrays.sdfUndersurface.push(pos(i,inside.bottom,inner));else missingInnerLower++;
  const v=outer.result;
  if(v.crossings.length!==2*v.intervals.length-(v.startsSolid?1:0)-(v.endsSolid?1:0))mismatch++;
 }
 const captured=(indices,key,arr)=>{
  let missed=0,maxError=0;
  for(const i of indices){
   const y=rim[i][key];
   const nearest=arr.reduce((m,p)=>Math.min(m,Math.abs(p[1]-y)+Math.hypot(p[0]-pos(i,y,0)[0],p[2]-pos(i,y,0)[2])),Infinity);
   maxError=Math.max(maxError,nearest);
   if(nearest>.12)missed++;
  }
  return {detected:indices.length,missed,maxError:+maxError.toFixed(4)};
 };
 const gaps=selected.map((i,k)=>(selected[(k+1)%selected.length]+(k===selected.length-1?N:0)-i)*TAU/N);
 const stats={method:'extremum-first spherical rim contour; paired inset signed-field strata',angularAuditSamples:N,selectedColumns:selected.length,requestedColumns:budget,peakAudit:captured(peaks,'top',arrays.surfaceTerrain),troughAudit:captured(troughs,'bottom',arrays.undersurfaceTerrain),maxAngularGap:+Math.max(...gaps).toFixed(4),intervalMismatch:mismatch,missingInnerUpper,missingInnerLower,innerInset:inner,domain:'spherical aperture intersection, NOT interior mountain silhouette',auditPass:peaks.every(i=>chosen.has(i))&&troughs.every(i=>chosen.has(i))&&mismatch===0};
 return {arrays,stats};
}
