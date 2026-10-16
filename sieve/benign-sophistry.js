(()=>{'use strict';
const root=document.getElementById('sophistryRoot');if(!root)return;
const N=[
['institute','Institution','Hermeticon','An independent experimental research practice investigating executable worlds and human–model collaboration.','position'],
['worlds','Program','Executable worlds','Worlds with state, material consequence, organisms, terrain and inspectable behavior.','observed'],
['conjoiner','Program','The Conjoiner','Longitudinal human–model collaboration: direction, implementation, correction and continuity.','observed'],
['spatial','Question','Semantic → spatial → primitive','Does explicit ownership, attachment and support improve model-authored scenes?','hypothesis'],
['continuity','Question','Continuity across model instances','Can durable external records sustain a coherent collaborative engineering practice?','observed'],
['observability','Method','Inspectable construction','Build identities, probes, deterministic seeds, readback and regression evidence.','observed'],
['crucible','Instrument','Crucible','Deformable terrain, BB populations, transport and meteor experiments.','demonstrated'],
['hermeticon','Instrument','Hermeticon','Executable world and experimental substrate.','demonstrated'],
['ledger','Instrument','Ledger','Research notes and reflective accounts of crossings, successes and failures.','documented'],
['sieve','Instrument','Sieve','An interface and evidence-handling instrument; now also an institutional research navigator.','demonstrated'],
['mushrooms','Episode','Mushroom forest','Function-organized BBs produced recognizable, compelling procedural flora.','observed'],
['assembly','Episode','Floating assemblies','Microscope and cathedral failures exposed missing spatial constraints.','observed'],
['handoffs','Episode','Cold boots and recovery','Persistent instructions and repositories supported cross-thread recovery; failures exposed fragility.','observed'],
['transport','Episode','Material transport','BB streams, water and terrain deformation provided executable tests of consequence.','demonstrated'],
['paper','Publication candidate','The Conjoiner','A longitudinal case study; evidence selection, methods and limitations still required.','proposed'],
['atlas','Publication candidate','Compositional grammars','Compare semantic topology, geometric realization and visual quality across media.','proposed']
];
const E=[
['institute','worlds','research program'],['institute','conjoiner','research program'],['institute','paper','publication route'],['institute','atlas','publication route'],
['worlds','hermeticon','apparatus'],['worlds','crucible','apparatus'],['worlds','transport','experiment'],['worlds','spatial','open question'],
['conjoiner','continuity','research question'],['conjoiner','observability','method'],['conjoiner','handoffs','case study'],['conjoiner','paper','candidate report'],
['spatial','assembly','negative evidence'],['spatial','mushrooms','positive evidence'],['spatial','atlas','candidate report'],
['continuity','handoffs','observed through'],['continuity','ledger','external record'],
['observability','ledger','research record'],['observability','crucible','instrumentation'],['observability','sieve','evidence interface'],
['crucible','transport','supports'],['hermeticon','mushrooms','procedural exploration'],['hermeticon','assembly','composition exploration'],
['paper','ledger','potential source'],['paper','handoffs','potential case'],['atlas','assembly','failure case'],['atlas','mushrooms','success case']
];
const refs={hermeticon:'https://bonoj.github.io/Hermeticon/',crucible:'https://github.com/bonoj/Crucible',ledger:'https://github.com/bonoj/Ledger',sieve:'https://bonoj.github.io/Hermeticon/sieve/',paper:'https://github.com/bonoj/Hermeticon',worlds:'https://bonoj.github.io/'};
const el=(tag,cls,txt,parent)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(txt!=null)x.textContent=txt;parent.append(x);return x};
const style=el('style',null,null,root);style.textContent=`
#sophistryRoot{color:#e8dbc0;font:13px/1.5 system-ui;display:grid;gap:12px}#sophistryRoot .bs-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}#sophistryRoot .bs-top strong{font:18px Georgia,serif;letter-spacing:.06em;margin-right:auto}#sophistryRoot button,#sophistryRoot select{min-height:42px;padding:9px 12px;border:1px solid #8e774e;background:#172333;color:#f1d6a5;border-radius:8px}#sophistryRoot .bs-card{padding:14px;background:#172333;border:1px solid #66543a;border-radius:10px}#sophistryRoot .bs-muted{color:#b2bfc0;font-size:11px}#sophistryRoot h3{font:20px Georgia,serif;margin:5px 0 9px}#sophistryRoot .bs-tags{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}#sophistryRoot .bs-tags span{border:1px solid #786645;border-radius:20px;padding:3px 8px;font:10px monospace;color:#e5c98f}#sophistryRoot .bs-links{display:grid;gap:7px}#sophistryRoot .bs-links button{text-align:left;width:100%;display:flex;justify-content:space-between;gap:12px;align-items:center}#sophistryRoot .bs-links small{color:#b2bfc0;font:10px monospace}#sophistryRoot a{color:#f1d6a5}#sophistryRoot .bs-path{font:11px monospace;color:#c2ae85;overflow-wrap:anywhere}#sophistryRoot .bs-map{width:100%;height:160px;border:1px solid #66543a;border-radius:8px;background:#0b1924}#sophistryRoot .bs-search{width:100%;min-height:43px;background:#0b1924;border:1px solid #786645;border-radius:8px;color:#fff;padding:10px}#sophistryRoot .bs-note{border-left:2px solid #a68a56;padding-left:10px;color:#bdc6c4}`;
let current='institute',history=[],filter='';
const ui=el('div',null,null,root);
function render(){
ui.replaceChildren();const top=el('div','bs-top',null,ui);el('strong',null,'BENIGN SOPHISTRY',top);
const back=el('button',null,'←',top);back.disabled=!history.length;back.onclick=()=>{current=history.pop();render()};
const home=el('button',null,'⌂',top);home.onclick=()=>go('institute');
el('div','bs-muted','Institutional research skeleton · connected claims, apparatus, episodes and evidence',ui);
const n=N.find(x=>x[0]===current);const card=el('section','bs-card',null,ui);el('div','bs-muted',n[1],card);el('h3',null,n[2],card);el('p',null,n[3],card);
const tags=el('div','bs-tags',null,card);el('span',null,n[4].toUpperCase(),tags);el('span',null,'NODE '+N.findIndex(x=>x[0]===current).toString().padStart(2,'0'),tags);
if(refs[current]){const a=el('a',null,'OPEN SOURCE ↗',card);a.href=refs[current];a.target='_blank';a.rel='noopener noreferrer'}
const neighbors=E.filter(e=>e[0]===current||e[1]===current).map(e=>({id:e[0]===current?e[1]:e[0],relation:e[2],direction:e[0]===current?'→':'←'}));
el('div','bs-muted',neighbors.length+' DIRECT RELATIONSHIPS · '+E.length+' TOTAL EDGES',ui);
const list=el('div','bs-links',null,ui);
for(const edge of neighbors){const target=N.find(x=>x[0]===edge.id);const b=el('button',null,null,list);const left=el('span',null,target[2],b);const right=el('small',null,edge.direction+' '+edge.relation,b);b.onclick=()=>go(edge.id)}
const input=el('input','bs-search',null,ui);input.placeholder='Find any claim, question, instrument or episode';input.value=filter;input.setAttribute('aria-label','Search research nodes');
const results=el('div','bs-links',null,ui);
function search(){results.replaceChildren();const q=filter.toLowerCase().trim();if(!q)return;for(const hit of N.filter(x=>x.slice(1).join(' ').toLowerCase().includes(q))){const b=el('button',null,hit[1]+' · '+hit[2],results);b.onclick=()=>{filter='';go(hit[0])}}}
input.oninput=()=>{filter=input.value;search()};search();
el('div','bs-note','Evidence discipline: observed is not independently replicated; proposed publications are not published; institutional positioning is not legal accreditation. Links point to projects, not automatically to proof of each individual claim.',ui);
const exportButton=el('button',null,'COPY RESEARCH GRAPH 👁',ui);exportButton.onclick=async()=>{const payload=JSON.stringify({schema:'hermeticon-research-graph-v1',nodes:N.map(([id,kind,title,description,status])=>({id,kind,title,description,status,source:refs[id]||null})),edges:E.map(([from,to,relation])=>({from,to,relation}))},null,2);try{await navigator.clipboard.writeText(payload);exportButton.textContent='COPIED · RESEARCH GRAPH'}catch{const t=el('textarea',null,null,ui);t.value=payload;t.rows=7;t.style.width='100%';t.select()}};
}
function go(id){if(id===current)return;history.push(current);current=id;render()}
render();
})();