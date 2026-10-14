// Athanor hosts; the Codex composes; Arcana supplies reusable parts.
import './athanor.js';
import {createGenesis} from '../codex/genesis/world.js';

const genesis=createGenesis();
globalThis.Athanor.mount('genesis',genesis);
genesis.attachView(globalThis.Athanor.view());

const edgeButton=document.createElement('button');
edgeButton.id='edgeCycle';edgeButton.type='button';
edgeButton.textContent='◉ 1/10';
edgeButton.title='Cycle equatorial treatments';
edgeButton.setAttribute('aria-label','Cycle equatorial treatments');
edgeButton.style.cssText='min-width:76px;height:54px;border:1px solid #927b59;border-radius:14px;background:#192433;color:#e8d4ad;font:600 15px monospace;touch-action:manipulation';
document.querySelector('#buttons').prepend(edgeButton);
edgeButton.onclick=()=>{
 const name=genesis.cycleEdge();
 const report=genesis.inspect().edgeTreatment;
 edgeButton.textContent='◉ '+(report.index+1)+'/10';
 edgeButton.title=name;
 document.querySelector('#edgeName').textContent=name;
};
const edgeName=document.createElement('div');
edgeName.id='edgeName';edgeName.textContent=genesis.edgeMode();
edgeName.style.cssText='position:fixed;left:12px;bottom:108px;z-index:9;color:#e8d4ad;background:#101b29c9;border:1px solid #6f624b;border-radius:8px;padding:5px 9px;font:12px monospace;pointer-events:none';
document.body.append(edgeName);
