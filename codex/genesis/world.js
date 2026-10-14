// Genesis is an authored composition, not a reusable Arcana definition.
import {createHermeticon} from '../../arcana/hermeticon.js';
import {createTerrain} from '../../arcana/terrain.js';

export function createGenesis(){
 const world=createHermeticon();
 world.group.name='Genesis';
 world.content.name='Genesis contents';
 world.group.add(world.content);
 const terrain=createTerrain();
 world.content.add(terrain.group);
 const inspectShell=world.inspect.bind(world);
 world.inspect=()=>({name:'Genesis',shell:inspectShell(),systems:[{name:'terrain',...terrain.inspect()}]});
 return world;
}
