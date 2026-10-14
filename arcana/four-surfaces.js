import {extractIntervals} from './boundary.js';
// Four geological witness populations; deterministic territories, no frame-loop work.
export function surveyFourSurfaces(sample,radius,offsetX=0,offsetZ=0,territories=96){
 const arrays={surfaceTerrain:[],sdfSurface:[],sdfUndersurface:[],undersurfaceTerrain:[]};
 const stats={territories,missingUpper:0,missingLower:0,peakLift:0,troughDrop:0,intervalMismatch:0};
 const probe=(a,r)=>{
  const c=Math.cos(a),s=Math.sin(a);
  const point=y=>{const rr=Math.sqrt(Math.max(0,r*r-y*y));return [rr*c+offsetX,rr*s+offsetZ]};
  const result=extractIntervals(sample,point,-3.35,3.35,96);
  const upper=result.crossings.filter(v=>v.fromSolid).map(v=>v.y);
  const lower=result.crossings.filter(v=>!v.fromSolid).map(v=>v.y);
  return {a,r,upper:upper.length?Math.max(...upper):null,lower:lower.length?Math.min(...lower):null,result};
 };
 for(let i=0;i<territories;i++){
  const a=(i+.5)*Math.PI*2/territories;
  const edge=probe(a,radius);
  const search=[];
  // Territory-local candidates: angular and radial coverage, never global hill climbing.
  for(const da of [-.35,0,.35])for(const inward of [0,.35,.8,1.4]){
   search.push(probe(a+da*Math.PI*2/territories,radius-inward));
  }
  const bestTop=search.filter(p=>p.upper!==null).sort((a,b)=>b.upper-a.upper)[0];
  const bestBottom=search.filter(p=>p.lower!==null).sort((a,b)=>a.lower-b.lower)[0];
  const pos=(p,y)=>{const rr=Math.sqrt(Math.max(0,p.r*p.r-y*y));return [rr*Math.cos(p.a),y,rr*Math.sin(p.a)]};
  if(bestTop){arrays.surfaceTerrain.push(pos(bestTop,bestTop.upper));if(edge.upper!==null)stats.peakLift=Math.max(stats.peakLift,bestTop.upper-edge.upper)}
  else stats.missingUpper++;
  if(bestBottom){arrays.undersurfaceTerrain.push(pos(bestBottom,bestBottom.lower));if(edge.lower!==null)stats.troughDrop=Math.max(stats.troughDrop,edge.lower-bestBottom.lower)}
  else stats.missingLower++;
  if(edge.upper!==null)arrays.sdfSurface.push(pos(edge,edge.upper));
  if(edge.lower!==null)arrays.sdfUndersurface.push(pos(edge,edge.lower));
  if(edge.result.crossings.length!==2*edge.result.intervals.length-(edge.result.startsSolid?1:0)-(edge.result.endsSolid?1:0))stats.intervalMismatch++;
 }
 return {arrays,stats};
}
