# Arcana Populations

Reusable populations extracted from authored worlds. These modules are **available, not automatically mounted**.

## Mists Reeds

- Entry: [mists-reeds.js](mists-reeds.js) — `createMistsReeds(T,{surface,center,offset,characters,radius,parent})`.
- Provenance: original Mists reeds (gallery index 0), `examples/wanderer-separated/world.js`, lines 1497–1596, 2026-10-14 extraction.
- Deterministic sparse bead-lattice stems, original muted four-color palette, sway, growth and character clearance. Single instanced draw, soil-up geometry and spherical aperture clipping.
- `surface(x,z)` supplies geological ground elevation or null for invalid locations. `offset()` supplies geological X/Z translation; `characters()` supplies geological X/Z positions. Optional center defaults to Mists (-2,-1), radius to 9.92.
- Returns `{group,mesh,update(dt),inspect(),dispose()}`. Caller mounts and schedules updates. Does not create buttons or change the host.
- This is **only the original reeds**, not the 49 later gallery alternatives. Original fixture is untouched. No Genesis mount or live visual parity verification is claimed.
