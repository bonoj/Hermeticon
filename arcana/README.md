# Arcana

The inventory of reusable composables. Before inventing a mechanism, inspect this directory and existing working specimens. Keep world-specific behavior with its owner; Athanor remains independent.

## Rock materials

`rock-materials.js` exports `createRockMaterials(terrainMaterial, capMaterial)`. It attaches shared, reversible shader-only geological treatments to supplied Three.js MeshStandardMaterials and returns `{rockNames, setRockMode, getRockMode}`. Presets: Original mortar (control), Midnight basalt, Layered slate, Ironstone, Obsidian, Ancient limestone. Does not create geometry, modify signed fields, fill voids, or trigger mesh rebuilding. Both terrain and its signed-field cap use the same palette. Genesis selects basalt initially and 🪨 cycles modes.
