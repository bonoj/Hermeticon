# Arcana Populations

Reusable populations extracted from authored worlds. These modules are **available, not automatically mounted**.

## Mists Reeds

- Entry: [mists-reeds.js](mists-reeds.js) — `createMistsReeds(T,{surface,center,offset,characters,radius,parent})`.
- Provenance: original Mists reeds (gallery index 0), `examples/wanderer-separated/world.js`, lines 1497–1596, 2026-10-14 extraction.
- Deterministic sparse bead-lattice stems, original muted four-color palette, sway, growth and character clearance. Single instanced draw, soil-up geometry and spherical aperture clipping.
- `surface(x,z)` supplies geological ground elevation or null for invalid locations. `offset()` supplies geological X/Z translation; `characters()` supplies geological X/Z positions. Optional center defaults to Mists (-2,-1), radius to 9.92.
- Returns `{group,mesh,update(dt),inspect(),dispose()}`. Caller mounts and schedules updates. Does not create buttons or change the host.
- This is **only the original reeds**, not the 49 later gallery alternatives. Original fixture is untouched. No Genesis mount or live visual parity verification is claimed.

## Original behavior contract

The extracted reeds preserve the original Wanderer gallery-index-0 behavior (source `examples/wanderer-separated/world.js`, `mistReedsStep`):

- Actor clearance: any geological actor within 0.55 units of a stem suppresses its target growth; actors are supplied through `characters()` and are not tied to Wanderer specifically.
- Growth approaches target at 3.6/s and retraction at 7.5/s, using frame-bounded interpolation. Growth is a per-stem value, not rebuilt when the geological offset changes.
- The original rim proximity smoothstep also affects growth, while bead positions are clipped to the spherical aperture. This is **legacy visual behavior**, not a claim of persistent biology independent of visibility. Preserve for parity until explicitly asked to change it.
- Sway is sinusoidal and stem-phased; the original five-to-thirteen-bead silhouettes and muted four-color palette are retained.
- `offset()` translates geology into the current view; do not feed screen-relative actor coordinates into `characters()`.
- No runtime parity test has yet been performed. The module remains unmounted in Genesis.

## Alien Garden — five additional populations

The following are composable Arcana modules, mounted as an authored garden near Genesis spawn:

| Species | Entry point | Geometry | Idle |
| --- | --- | --- | --- |
| Amethyst Parasols | `amethyst-parasols.js` | Layered violet radial discs on pale stalks | Asynchronous stalk flex and subtle scaling |
| Amber Gourds | `amber-gourds.js` | Faceted orange fruits, pointed sage sepals | Slow breathing |
| Crown Lanterns | `crown-lanterns.js` | Branching dark stems, golden faceted lantern fruits and crowns | Gentle whole-plant oscillation |
| Chalice Succulents | `chalice-succulents.js` | Sage polygonal cups, radial petals, pale nodules | Slow opening-like scaling |
| Ruby Pendants | `ruby-pendants.js` | Dark branching stalks and hanging faceted magenta fruits | Gentle whole-plant oscillation |

All five use `botanical-population.js` for seeded geological placement, shared primitives, world-offset translation, aperture culling, lifecycle and inspection. Entry points accept `(T,{surface,center,offset,parent,seed,count,radius})` and return `{group,update(dt),inspect(),dispose()}`. Species have deliberately simple first-pass idle motion; wind, fruit articulation, material transactions and actor responses beyond the original reeds are **not implemented**. The authored planting centers and counts live in `codex/genesis/world.js`, not Arcana.

**Verification:** Source committed; no runtime screenshot comparison or mobile performance verification yet. Existing accepted terrain Hybrid and Athanor are unchanged.
