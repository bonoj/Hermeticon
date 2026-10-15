// Hunt v0: inspectable client-side discovery. No credentials, applications or private history.
(()=>{
'use strict';
const root=document.getElementById('huntRoot');if(!root)return;
const KEY='sieve.hunt.v1',VERSION=1;
const TERMS=['simulation','procedural','research','world','creative','interactive','game','technical director','r&d','tools','systems'];
const TARGETS=['disney','lucasfilm','industrial light','weta','wētā','larian','epic games','valve','riot','hello games','supergiant','wizards of the coast','sony','nasa','jpl'];
const SOURCE={id:'remotive',label:'Remotive public jobs API',url:'https://remotive.com/api/remote-jobs?limit=200'};
const now=()=>new Date().toISOString();
const clean=s=>String(s??'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const url=u=>{try{const p=new URL(u);return /^https?:$/.test(p.protocol)?p.href:null}catch{return null}};
const idFor=(source,external)=>source+':'+String(external).slice(0,180);
const initial=()=>({version:VERSION,events:[],candidates:{},lastSweep:null});
let state;
try{const saved=JSON.parse(localStorage.getItem(KEY));state=saved?.version===VERSION&&Array.isArray(saved.events)&&saved.candidates&&typeof saved.candidates==='object'?saved:initial()}catch{state=initial()}
let busy=false;
const emit=(type,details={})=>{state.events.push({at:now(),type,...details});if(state.events.length>500)state.events=state.events.slice(-500);persist()};
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){root.dataset.persistence='failed';console.warn('Hunt persistence unavailable',e)}}
function classify(c){
 const hay=(c.title+' '+c.company+' '+c.description).toLowerCase();
 const hits=TERMS.filter(t=>hay.includes(t));
 const employers=TARGETS.filter(t=>c.company.toLowerCase().includes(t));
 const exclusions=/customer support|sales development|account executive|wordpress|full.stack developer|react developer|data entry/i.test(c.title);
 return {decision:exclusions?'pass':employers.length||hits.length>=3?'investigate':'unreviewed',signals:hits,employers,uncertainties:['Employer-hosted requisition and apply link unverified','Creative authority and autonomy unverified','Work arrangement may not fit']};
}
function normalize(item){
 const title=clean(item.title),company=clean(item.company_name),link=url(item.url);
 if(!title||!company||!link||!item.id)return null;
 const c={id:idFor(SOURCE.id,item.id),source:SOURCE.id,sourceLabel:SOURCE.label,title,company,location:clean(item.candidate_required_location),arrangement:'remote (source category)',description:clean(item.description).slice(0,4000),sourceUrl:link,officialApplyUrl:null,officialVerified:false,sourceObservedAt:now(),publication:clean(item.publication_date),status:'discovered'};
 return {...c,...classify(c)};
}
function el(tag,props={},parent=root){const n=document.createElement(tag);for(const [k,v] of Object.entries(props)){if(k==='text')n.textContent=v;else if(k==='className')n.className=v;else n.setAttribute(k,v)}parent.append(n);return n}
function render(){
 root.replaceChildren();
 const head=el('div',{className:'huntHead'});el('strong',{text:'HUNT · INSTRUMENT'},head);
 const run=el('button',{type:'button',text:busy?'SWEEPING…':'SWEEP PUBLIC FEED'},head);run.disabled=busy;run.addEventListener('click',sweep);
 const stats=el('div',{className:'huntStats'});
 const all=Object.values(state.candidates),counts={};for(const c of all)counts[c.decision]=(counts[c.decision]||0)+1;
 el('div',{text:`Observed ${all.length} · Investigate ${counts.investigate||0} · Passed ${counts.pass||0} · Unreviewed ${counts.unreviewed||0}`},stats);
 el('div',{text:state.lastSweep?`Last sweep: ${state.lastSweep.at} · ${state.lastSweep.result}`:'No sweep performed. Public discovery requires network access.'},stats);
 el('div',{text:'Source: Remotive remote-jobs API. Search is a broad candidate sweep, not verified employer vacancies. Official apply links require separate verification.'},stats);
 const controls=el('div',{className:'huntHead'});
 const copy=el('button',{type:'button',text:'COPY 👁 REPORT'},controls);copy.addEventListener('click',copyReport);
 const exportButton=el('button',{type:'button',text:'EXPORT JSON'},controls);exportButton.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='sieve-hunt-observation.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
 const details=el('details',{},root);el('summary',{text:'INSTRUMENTATION · provenance and failure log'},details);
 const log=el('pre',{className:'huntLog',text:JSON.stringify({schema:VERSION,storage:root.dataset.persistence||'localStorage',source:SOURCE,filters:{terms:TERMS,targets:TARGETS},lastSweep:state.lastSweep,events:state.events.slice(-20)},null,2)},details);
 const list=el('div',{className:'huntCandidates'});
 const shown=all.filter(c=>c.decision==='investigate').sort((a,b)=>b.sourceObservedAt.localeCompare(a.sourceObservedAt)).slice(0,25);
 if(!shown.length)el('p',{text:'No candidates to inspect yet. Run a sweep. If the feed fails, open instrumentation and bring 👁.'},list);
 for(const c of shown){
  const card=el('article',{className:'huntCandidate'},list);
  el('strong',{text:c.title},card);el('div',{text:`${c.company} · ${c.location||'location unknown'}`},card);
  el('div',{text:`Signals: ${c.signals.join(', ')||'none'} · ${c.decision.toUpperCase()}`},card);
  el('div',{text:'UNVERIFIED: employer mandate, official application, autonomy, arrangement'},card);
  const link=el('a',{href:c.sourceUrl,target:'_blank',rel:'noopener noreferrer',text:'SOURCE POSTING ↗'},card);
  const mark=el('button',{type:'button',text:'PASS'},card);mark.addEventListener('click',()=>{c.decision='pass';emit('manual-decision',{id:c.id,decision:'pass'});render()});
 }
}
async function sweep(){
 if(busy)return;busy=true;emit('sweep-start',{source:SOURCE.id});render();
 try{
  const response=await fetch(SOURCE.url,{cache:'no-store',signal:AbortSignal.timeout(14000)});
  if(!response.ok)throw Error('HTTP '+response.status);
  const data=await response.json();if(!Array.isArray(data.jobs))throw Error('Unexpected feed schema');
  let accepted=0,duplicates=0,rejected=0;
  for(const item of data.jobs){const c=normalize(item);if(!c){rejected++;continue}const old=state.candidates[c.id];if(old){duplicates++;c.decision=old.decision==='pass'?'pass':c.decision;c.status=old.status}else accepted++;state.candidates[c.id]=c}
  state.lastSweep={at:now(),result:'ok',received:data.jobs.length,accepted,duplicates,rejected};
  emit('sweep-complete',state.lastSweep);
 }catch(e){state.lastSweep={at:now(),result:'failed',error:String(e),source:SOURCE.url};emit('sweep-error',{error:String(e),source:SOURCE.url})}
 finally{busy=false;render()}
}
async function copyReport(){
 const all=Object.values(state.candidates);
 const report={instrument:'Sieve Hunt',schema:VERSION,at:now(),source:SOURCE,lastSweep:state.lastSweep,counts:{total:all.length,investigate:all.filter(c=>c.decision==='investigate').length,passed:all.filter(c=>c.decision==='pass').length},candidates:all.filter(c=>c.decision==='investigate').slice(0,20).map(({id,title,company,location,sourceUrl,signals,uncertainties,officialVerified})=>({id,title,company,location,sourceUrl,signals,uncertainties,officialVerified})),events:state.events.slice(-15)};
 const text=JSON.stringify(report,null,2);
 try{await navigator.clipboard.writeText(text);emit('report-copied',{candidates:report.candidates.length});render()}catch{const field=el('textarea',{rows:'9'},root);field.value=text;field.select();emit('clipboard-unavailable');}
}
render();
})();
