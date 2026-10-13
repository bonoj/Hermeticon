# Hermeticon shell — isolated first cut

This is an **unwired** shell, deliberately added without modifying the deployed Wanderer `index.html`.

- `hermeticon.js`: create/select/clone worlds, register capabilities and observations; no physics, time, terrain, rendering, or DOM.
- `interface.js`: reusable camera and button **grammar**, not camera implementations or rendered controls.
- Each world owns its rules, contents, and interface selection. An empty world is valid.
- `cloneWorld` copies configuration references shallowly and starts fresh runtime state; it is **not** a deep simulation-state snapshot.

## Next integration boundary

Extract tested camera and touch handling into concrete interface adapters; keep Wanderer's existing behavior unchanged. Then wire Wanderer to the shell in a separate, explicitly tested change. Do not confuse this scaffold with completed extraction or claim that it is in use by the live page.

## Smoke-test contract

`createHermeticon().createWorld({id:'empty'})` must succeed without physics or contents. Two worlds must coexist; switching must preserve each world's state. A capability is invoked only for the active world. Interface definitions must be independent of world simulation.
