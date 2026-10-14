# Arcana

The inventory of reusable composables. Before inventing a mechanism, inspect this directory and existing working specimens. Keep world-specific behavior with its owner; Athanor remains independent.

## Rock materials

`rock-materials.js` exports `createRockMaterials(terrainMaterial, capMaterial)`. It attaches shared, reversible shader-only geological treatments to supplied Three.js MeshStandardMaterials and returns `{rockNames, setRockMode, getRockMode}`. Presets: Original mortar (control), Midnight basalt, Layered slate, Ironstone, Obsidian, Ancient limestone. Does not create geometry, modify signed fields, fill voids, or trigger mesh rebuilding. Both terrain and its signed-field cap use the same palette. Genesis selects basalt initially and 🪨 cycles modes.

## Cavern smoke

`cavern-smoke.js` exports `createCavernSmoke(THREE,{radius})`: three animated, depth-tested horizontal smoke layers with radial edge feathering. Layers remain below Genesis's nominal upper terrain surface, and opaque terrain occludes them. No geometry or signed-field edits; not a true volumetric solver. `update(dt)` advances smoke and `inspect()` reports parameters.
