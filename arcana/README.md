# Arcana — Composable Systems Catalog

Arcana is Hermeticon's inventory of **reusable mechanisms**. Before implementing a system in an authored world, look here. An Arcana module owns its mechanism; the Codex owns world composition; Athanor owns hosting, renderer, camera, scheduling, and UI. No world should have to copy an Arcana implementation.

**Accepted visual baseline:** observation lens terrain-only HYBRID, commit `7c74e324`, confirmed visually accepted on 2026-10-14. This is a behavioral baseline, not a claim that every future deployment is verified. Preserve the original lit terrain and the untouched vessel, Wanderer, and background. Do not replace the terrain's color with an offscreen image.

## Catalog

| Arcana | Entry point | Responsibility | Genesis |
| --- | --- | --- | --- |
| Vessel | [`hermeticon.js`](hermeticon.js) — `createHermeticon()` | Spherical glass/brass vessel and content mounting | **Mounted** |
| Signed terrain | [`terrain.js`](terrain.js) — `createTerrain()` | Signed field, terrain mesh, aperture, offset, terrain-owned tap interpretation | **Mounted** |
| BB botanical populations | [`populations/bb-garden.js`](populations/bb-garden.js) — `createBBGarden(T,opts)` | **Canonical** five-species BB-only garden; deterministic roots, bead arrangements, idle sway, reversible actor-triggered growth | **Mounted and author-accepted** |
| Mists Reeds | [`populations/mists-reeds.js`](populations/mists-reeds.js) — `createMistsReeds(T,opts)` | Original bead-lattice reeds, preserved actor clearance and sway | **Mounted** |
| Geometric botanical prototypes | [`populations/potential/`](populations/potential/) | Preserved pre-BB species and swaying behavior | **Archived, not mounted** |
| Wanderer | [`wanderer.js`](wanderer.js) — `createWanderer({terrain})` | Supported navigation, movement, inspection | **Mounted** |
| Equatorial treatments | [`equatorial-treatment.js`](equatorial-treatment.js) — `createEquatorialTreatment({terrain,parent})` | Ten comparative equatorial signed-field treatments and shader-only transition | **Mounted**, preset 8 |
| Observation lens | [`observation/lens.js`](observation/lens.js) — `createObservationLens(T,renderer,camera)` | SOURCE, SOBEL, DEPTH, HYBRID; isolated terrain observation and edge overlay | **Hosted by Athanor**, targets Genesis terrain |
| Witness nodes | [`node-maker.js`](node-maker.js) — `createNodeMaker(T,parent)` | Instrumented node display; supplied points only | **Mounted, empty** |
| Boundary extraction | [`boundary.js`](boundary.js) — `extractIntervals(...)` | Pure signed-field interval/crossing extraction | **Available**; not directly imported by Genesis |
| Rock materials | [`rock-materials.js`](rock-materials.js) — `createRockMaterials(terrainMaterial,capMaterial)` | Reversible shader-only rock palettes | **Available**, not mounted |
| Cavern smoke | [`cavern-smoke.js`](cavern-smoke.js) — `createCavernSmoke(T,{radius,terrain})` | Lightweight depth-tested cavern haze, not volumetric fog | **Available**, not mounted |
| Occlusion wall | [`occlusion-wall.js`](occlusion-wall.js) — `createOcclusionWall({terrain,radius})` | Optional signed-field-clipped spherical cap | **Not mounted** |
| Edge-detection compatibility | [`edge-detection.js`](edge-detection.js) | Re-exports the observation lens under the former `createEdgeDetection` name | Used by Athanor |

## Observation lens — accepted terrain-only Hybrid

See [observation/README.md](observation/README.md) for the treatment catalog and pipeline.

- **OFF**: normal scene rendering; not a treatment.
- **SOURCE**: unmodified scene reference.
- **SOBEL**: screen-space terrain intensity edges.
- **DEPTH**: terrain depth discontinuities.
- **HYBRID**: combined Sobel and depth edge ink; **accepted visual baseline**.

Genesis exposes `observationTargets().terrain`; Athanor passes that group to the Arcana lens via `observeTerrain(group)`. For SOBEL/DEPTH/HYBRID, the lens captures terrain on a dedicated layer, compares against full-scene depth for occlusion, and overlays **edge ink only** on the normally rendered scene. The underlying lit terrain is never replaced. The vessel, glass, brass, Wanderer, and space outside the vessel are not processed by the lens. The observation lens itself remains independent of Genesis.

The renderer must not clear the already rendered scene while compositing the overlay. This was the source of the black-background/vessel regression; opaque replacement with offscreen terrain color was the source of the black-terrain regression. Both failures are guarded by the accepted overlay design. Do not silently restore either approach.

## Composition and lifecycle

**Genesis** ([`codex/genesis/world.js`](../codex/genesis/world.js)) instantiates vessel, terrain, equatorial treatment, node maker, Wanderer, Mists Reeds and the canonical BB botanical garden. Terrain owns tap hit classification and navigation target selection; Wanderer receives `moveTo(x,z)`. Genesis exposes observation targets rather than owning the renderer or shader pass.

**Athanor** ([`athanor/athanor.js`](../athanor/athanor.js)) owns the renderer and lens scheduling. It discovers observation targets on world mount. The compatibility import `edge-detection.js` intentionally remains stable.

**Optional modules** are not automatically activated by their presence in Arcana. In particular, the occlusion wall stays unmounted. To use it in a different authored world, create it explicitly, add its `group`, forward offsets/radius, and dispose of it when removed.

## Working rules

1. Check the catalog and working specimens before inventing a new mechanism.
2. Keep Arcana APIs composable and world-agnostic; keep authored selections in the Codex.
3. Preserve stable visuals when extracting, moving, or refactoring modules.
4. Inspect actual module interfaces and current mounts before documenting usage. **Available** is not **active**.
5. Verify source commit, build workflow, displayed live SHA, and actual runtime behavior separately; a passing build alone is not visual verification.

For project continuity see [Hermeticon handoff](../HANDOFF.md); for collaboration and release discipline see [Sanctum's working contract](https://github.com/bonoj/Sanctum/blob/main/CONTRACT.md).


## Second Garden candidate

[`populations/second-garden.js`](populations/second-garden.js) is mounted by Genesis alongside the accepted canonical garden. It introduces six additional BB-only topologies (surface networks, inverted chains, radial arms, hollow towers, geode rings, spherical lattices). This is an implementation candidate pending visual and performance inspection; see [population catalog](populations/README.md). Do not confuse source commit with live or author acceptance.
