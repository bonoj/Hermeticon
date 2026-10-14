// Athanor hosts; the Codex composes; Arcana supplies reusable parts.
import './athanor.js';
import {createGenesis} from '../codex/genesis/world.js';

const genesis=createGenesis();
globalThis.Athanor.mount('genesis',genesis);
genesis.attachView(globalThis.Athanor.view());


const latticeLabel=document.createElement('div');
latticeLabel.textContent='RIM PUNCH · crossings / solid intervals';
latticeLabel.style.cssText='position:fixed;left:12px;bottom:108px;z-index:9;color:#e8d4ad;background:#101b29c9;border:1px solid #6f624b;border-radius:8px;padding:5px 9px;font:12px monospace;pointer-events:none';
document.body.append(latticeLabel);

const rockButton=document.createElement('button');
rockButton.id='rockCycle';
rockButton.type='button';
rockButton.textContent='🪨';
rockButton.title='Cycle geological material treatments';
rockButton.setAttribute('aria-label','Cycle rock treatments');
document.querySelector('#buttons').append(rockButton);
const rockLabel=document.createElement('span');
rockLabel.style.cssText='position:fixed;left:12px;bottom:150px;z-index:9;color:#e8d4ad;background:#101b29d9;border:1px solid #6f624b;border-radius:8px;padding:5px 9px;font:12px monospace;pointer-events:none';
rockLabel.textContent='🪨 '+genesis.rockMode();
document.body.append(rockLabel);
rockButton.onclick=()=>{rockLabel.textContent='🪨 '+genesis.cycleRock()};
