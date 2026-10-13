// Reusable browser instrumentation; independent of world physics.
export async function mountInstruments({host=document.body,hermeticon,buildUrl='../../build.json'}={}) {
  const style=document.createElement('style');
  style.textContent=`#hermeticon-tools{position:fixed;z-index:100;top:calc(10px + env(safe-area-inset-top));right:10px;display:flex;align-items:center;gap:8px;font:12px ui-monospace,monospace;color:#d9eced}#hermeticon-tools button,#hermeticon-panel button{min-width:44px;min-height:44px;border:1px solid #6f999e;border-radius:8px;background:#152633;color:#d9eced;padding:8px}#hermeticon-panel{position:fixed;z-index:101;inset:70px 10px 80px;background:#07121df5;color:#d9eced;border:1px solid #6f999e;border-radius:10px;padding:12px;display:none}#hermeticon-panel.open{display:flex;flex-direction:column;gap:8px}#hermeticon-panel textarea{flex:1;width:100%;resize:none;background:#091923;color:#e8eeee;font:12px/1.5 monospace}`;
  host.append(style);
  const bar=document.createElement('div');bar.id='hermeticon-tools';
  const build=document.createElement('span');build.textContent='--------';
  const fps=document.createElement('span');fps.textContent='◌ fps';
  const inspect=document.createElement('button');inspect.textContent='INSPECT';
  const refresh=document.createElement('button');refresh.textContent='↻';refresh.title='Refresh';
  bar.append(build,fps,inspect,refresh);host.append(bar);
  const panel=document.createElement('div');panel.id='hermeticon-panel';
  const copy=document.createElement('button');copy.textContent='COPY REPORT';
  const close=document.createElement('button');close.textContent='CLOSE';
  const report=document.createElement('textarea');report.readOnly=true;
  const actions=document.createElement('div');actions.append(copy,close);
  panel.append(actions,report);host.append(panel);
  let buildInfo={sha:null,status:'unverified'};
  try {
    const response=await fetch(buildUrl,{cache:'no-store'});
    if(!response.ok)throw Error('Build metadata HTTP '+response.status);
    const data=await response.json();
    if(!/^[a-f0-9]{40}$/.test(data.sha))throw Error('Invalid build SHA');
    buildInfo={sha:data.sha,status:'verified-metadata'};
    build.textContent=data.sha.slice(0,8);
  }catch(error){buildInfo.error=String(error);build.title='Build metadata unavailable'}
  let frames=0,last=performance.now(),lastFps=null,raf=0,disposed=false;
  function frame(now){if(disposed)return;frames++;if(now-last>=1000){lastFps=Math.round(frames*1000/(now-last));fps.textContent=lastFps+' fps';frames=0;last=now}raf=requestAnimationFrame(frame)}
  raf=requestAnimationFrame(frame);
  const diagnostics=()=>JSON.stringify({build:buildInfo,fps:lastFps,hermeticon:hermeticon?.snapshot?.()??null,location:location.href,time:new Date().toISOString()},null,2);
  inspect.onclick=()=>{report.value=diagnostics();panel.classList.add('open')};
  close.onclick=()=>panel.classList.remove('open');
  copy.onclick=async()=>{try{await navigator.clipboard.writeText(report.value);copy.textContent='COPIED'}catch{report.focus();report.select();copy.textContent='SELECT TEXT'}};
  refresh.onclick=()=>location.reload();
  return {dispose(){disposed=true;cancelAnimationFrame(raf);bar.remove();panel.remove();style.remove()},diagnostics};
}
