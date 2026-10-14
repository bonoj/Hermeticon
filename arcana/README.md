# Arcana

The inventory of reusable composables. Before inventing a mechanism, inspect this directory and existing working specimens. Keep world-specific behavior with its owner; Athanor remains independent.

## Rock materials

`rock-materials.js` exports `createRockMaterials(terrainMaterial, capMaterial)`. It attaches shared, reversible shader-only geological treatments to supplied Three.js MeshStandardMaterials and returns `{rockNames, setRockMode, getRockMode}`. Presets: Original mortar (control), Midnight basalt, Layered slate, Ironstone, Obsidian, Ancient limestone. Does not create geometry, modify signed fields, fill voids, or trigger mesh rebuilding. Both terrain and its signed-field cap use the same palette. Genesis selects basalt initially and 🪨 cycles modes.

## Cavern smoke

`cavern-smoke.js` exports `createCavernSmoke(THREE,{radius})`: three animated, depth-tested horizontal smoke layers with radial edge feathering. Layers remain below Genesis's nominal upper terrain surface, and opaque terrain occludes them. No geometry or signed-field edits; not a true volumetric solver. `update(dt)` advances smoke and `inspect()` reports parameters.

## Optional occlusion wall (not mounted)

`occlusion-wall.js` preserves the former signed-field-clipped spherical cap. It is deliberately **not** instantiated in Genesis. To restore in an authored world: `const wall=createOcclusionWall({terrain,radius:terrain.getAperture()}); world.content.add(wall.group)`. Forward terrain offset changes with `wall.setOffset(x,z)` and radius changes with `wall.setRadius(r)`; `dispose()` releases its geometry/material. Genuine signed-field voids remain open.

## Equatorial edge treatments

`equatorial-treatment.js` exports `createEquatorialTreatment({terrain,parent})`. It owns the ten existing equatorial comparison presets, their signed-field sampling, geometry, materials, offsets, and inspection. Genesis instantiates it and exposes its cycle and mode controls. Its default remains shader-only transition (preset 8); the optional spherical occlusion wall is separate and remains unmounted.

## Observation instruments

`observation/lens.js` owns the renderer and SOURCE/SOBEL/DEPTH/HYBRID modules. Athanor hosts the lens because it owns the renderer; Genesis does **not** duplicate this pipeline. Current capture is full-scene, not yet terrain-masked.
