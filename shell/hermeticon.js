// Hermeticon shell v0: no physics, camera, rendering engine, or DOM assumptions.
export function createHermeticon({id='hermeticon'}={}) {
  const worlds=new Map();
  let active=null;
  const listeners=new Set();
  const notify=()=>{for(const fn of listeners)fn(api.snapshot())};
  const api={
    id,
    createWorld({id:worldId,name=worldId,rules=[],contents=[],interface:ui={}}={}) {
      if(!worldId||worlds.has(worldId))throw Error('World requires a unique id');
      const world={id:worldId,name,rules:[...rules],contents:[...contents],interface:{...ui},state:{},capabilities:new Map(),observers:new Map()};
      worlds.set(worldId,world);if(active===null)active=worldId;notify();return world;
    },
    cloneWorld(sourceId,newId) {
      const source=api.getWorld(sourceId);
      if(!source)throw Error('Unknown world: '+sourceId);
      // Explicitly clone configuration; runtime state is intentionally fresh.
      return api.createWorld({id:newId,name:source.name+' copy',rules:source.rules,contents:source.contents,interface:source.interface});
    },
    getWorld(worldId=active){return worlds.get(worldId)||null},
    selectWorld(worldId){if(!worlds.has(worldId))throw Error('Unknown world: '+worldId);active=worldId;notify();return api.getWorld()},
    listWorlds(){return [...worlds.values()].map(({id,name})=>({id,name}))},
    snapshot(){return {id,activeWorldId:active,worlds:api.listWorlds()}},
    subscribe(fn){listeners.add(fn);return ()=>listeners.delete(fn)},
    registerCapability(name,handler,worldId=active){const world=api.getWorld(worldId);if(!world)throw Error('No world');world.capabilities.set(name,handler)},
    invoke(name,...args){const world=api.getWorld();if(!world)throw Error('No world');const handler=world.capabilities.get(name);if(!handler)throw Error('Unavailable capability: '+name);return handler(...args)},
    observe(name,worldId=active){const fn=api.getWorld(worldId)?.observers.get(name);return fn?fn():undefined},
    registerObserver(name,fn,worldId=active){const world=api.getWorld(worldId);if(!world)throw Error('No world');world.observers.set(name,fn)}
  };
  return api;
}
