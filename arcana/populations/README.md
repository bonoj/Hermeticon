# Arcana Populations

Reusable populations and authored botanical systems. **The original Mists Reeds, BB Garden, and Second Garden are mounted in Genesis.** The older geometric prototypes are preserved under `potential/` but not mounted.

## Mists Reeds

- Entry: [mists-reeds.js](mists-reeds.js) — `createMistsReeds(T,{surface,center,offset,characters,radius,parent})`.
- Provenance: original Mists reeds (gallery index 0), `examples/wanderer-separated/world.js`, lines 1497–1596, 2026-10-14 extraction.
- Deterministic sparse bead-lattice stems, original muted four-color palette, sway, growth and character clearance. Single instanced draw, soil-up geometry and spherical aperture clipping.
- `surface(x,z)` supplies geological ground elevation or null for invalid locations. `offset()` supplies geological X/Z translation; `characters()` supplies geological X/Z positions. Optional center defaults to Mists (-2,-1), radius to 9.92.
- Returns `{group,mesh,update(dt),inspect(),dispose()}`. Caller mounts and schedules updates. Does not create buttons or change the host.
- This is **only the original reeds**, not the 49 later gallery alternatives. Original fixture is untouched. Mounted in Genesis; the author has visually inspected the reeds.

## Original behavior contract

The extracted reeds preserve the original Wanderer gallery-index-0 behavior (source `examples/wanderer-separated/world.js`, `mistReedsStep`):

- Actor clearance: any geological actor within 0.55 units of a stem suppresses its target growth; actors are supplied through `characters()` and are not tied to Wanderer specifically.
- Growth approaches target at 3.6/s and retraction at 7.5/s, using frame-bounded interpolation. Growth is a per-stem value, not rebuilt when the geological offset changes.
- The original rim proximity smoothstep also affects growth, while bead positions are clipped to the spherical aperture. This is **legacy visual behavior**, not a claim of persistent biology independent of visibility. Preserve for parity until explicitly asked to change it.
- Sway is sinusoidal and stem-phased; the original five-to-thirteen-bead silhouettes and muted four-color palette are retained.
- `offset()` translates geology into the current view; do not feed screen-relative actor coordinates into `characters()`.
- No runtime parity test has yet been performed. The module is mounted in Genesis.

## BB botanical garden — CANON (current Genesis)

- Entry: [bb-garden.js](bb-garden.js), `createBBGarden(T,{surface,offset,characters,parent,radius,seed})`.
- Five authored species: Amethyst Parasols, Amber Gourds, Crown Lanterns, Chalice Succulents, Ruby Pendants. All geometry is BB spheres; stalks are bead chains, bulbs are dense bead clumps, canopies/cups are bead rings. A single instanced sphere mesh renders the garden.
- Deterministic geological roots, per-plant phased sway, actor-triggered retract (7.5/s) and regrow (3.6/s), ordered BB emergence, aperture clipping, and inspection counts. Growth is independent of camera offset. Wind and material transactions are not implemented.
- Genesis mounts this BB garden and the original Mists Reeds. The previous five geometric populations, including their pleasant idle sway, remain untouched in [potential/](potential/).
- **Status:** author explicitly promoted the BB garden to canon on 2026-10-14. Preserve the all-BB construction language, idle sway and reversible growth. Automated performance testing remains unclaimed. Accepted terrain Hybrid and Athanor were not modified. **Hermeticoneer** is the emerging nickname for this worldbuilding direction.


## Second Garden — six additional BB species (ACCEPTED CANON)

- [second-garden.js](second-garden.js) exports `createSecondGarden(T,{terrain,surface,offset,characters,parent,radius,seed})` and returns `{group,update,blast,inspect,dispose}`.
- **Mycelial Lace:** surface-sampled branching bead chains.
- **Glassfall:** underside-seeking inverted bead chains; candidate placement requires actual signed-field underside crossings and may yield no roots at unsuitable coordinates.
- **Star Anemones:** radial bead arms and central BB clusters.
- **Cinder Chimneys:** hollow walls built from stacked BB rings.
- **Geode Hearts:** mineral BB rings and clusters on existing terrain, **no excavation**.
- **Tumble Orbs:** spherical bead-loop lattices; rocking/sway only, **no locomotion**.
- All use deterministic roots, instanced BBs, per-plant growth and actor clearance, aperture culling, and inspection. No material exchange, condensation, terrain modification, or wind simulation is implemented.
- **Status: AUTHOR-ACCEPTED CANON, 2026-10-14.** All six species approved. Both gardens are accepted and mounted in Genesis. Independent live runtime/performance verification is not claimed. Preserve both accepted compositions.

## Meteor transfer and accounting — 2026-10-14

All three botanical systems implement radial `blast(point,options,debris)` and transfer destroyed stems/plants into the shared detached BB system. The transfer includes clipped or currently retracted anatomy; BBs not in the rendered instance list use approximate authored coordinates rather than exact animation poses. Inspectors expose `activeBeads` separately from original `beads`/`descriptors` and currently `visible` instances. Sum active authored BBs and detached BBs for material inventory; never sum historical descriptors after disassembly. The material renderer has no arbitrary fixed BB capacity. This behavior is committed, not independently verified on the live site.
