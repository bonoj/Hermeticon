# Hermeticon — operational handoff (2026-10-14)

## Current authority and entrances

**Genesis is the current authored world**, mounted by `athanor/compose.js` from `codex/genesis/world.js`. Root https://bonoj.github.io/Hermeticon/ and `/athanor/` use Athanor; `examples/wanderer-separated/` is a **separate preserved older Wanderer fixture**, not the root runtime. Its fire, BBs, Crucible, 22 named geographical nodes and material behavior are not present in Genesis merely by association. See its own handoff. `arcana/` supplies composables; Athanor owns camera, renderer, animation loop, UI and 👁 inspection.

Clean source checkpoint: `b1e4e82265d2e91ea70dbb343236e1c103b28bd3`. Prior witness commits `4c193168` (mesh inventory) and `292c646a` (camera-conditioned CPU raycast node selection) are preserved in Git history **but deliberately removed from active code**.

## Current operational state — 2026-10-14 (read before editing)

**Terrain checkpoint:** `4092828780773eeac9870d79ef44a1af898494ac` is the user-approved visual/performance baseline for the signed-field aperture cap (including bore exemptions). The user reported ~60–88 FPS in screenshots; these are observations, not guaranteed performance. Following unsuccessful atmosphere and toolbar experiments, `main` was force-restored to that checkpoint, then received **UI/CSS/deployment-only** corrections. Do not revert `main` wholesale to `40928287` again: that discards independently established interface fixes. Current UI correction commit: `c82691ef`; confirm the latest branch head and live SHA before editing.

**Signed-field cap:** `arcana/terrain.js` constructs a spherical aperture sidewall from the terrain signed field, exempting actual voids/bores. This is a solved, cheap opaque control condition; preserve its geometry, sampling, Wanderer behavior and performance. It solves visual exposure of mesh innards but can reduce the sense of hidden cavernous machinery. The desired **next artistic experiment** is not recoloring or translucency of this wall. Compare genuinely different ways to obscure ugly interior geometry while implying cavernous depth: local dense fog, penumbral termination, depth dissolution, restrained distant glow. The opaque cap must remain a clean baseline. In each experimental mode actually disable its rendering; don't merely lower opacity. The experiments must independently conceal innards rather than tint the cap or adjust unrelated global scene fog. **None of these alternative atmosphere treatments is implemented in the current restored baseline.** Do not claim otherwise.

**Three-button contract:** Only 🌐 (existing edge observation), 👁 (copy inspection), and ↻ (refresh) belong to the current toolbar. Visual **left-to-right: 🌐 👁 ↻**; equivalently right-to-left: ↻ 👁 🌐. Keep their existing dark square/rounded grammar, restrained thin brass border, and large tap targets. No invented map/grid instrument. The earlier `cycleEdge()` terrain treatment API is not a request for a new button. `athanor/index.html` supplies eye and refresh; `arcana/edge-detection.js` appends the globe. `athanor/interface.css` now has a consolidated authoritative bottom-bar block with `row-reverse`, unique order 0/1/2 for refresh/eye/globe, and order 10 for any future appended button. Do not accumulate more competing CSS overrides. If adding controls later, explicitly design their slots without moving these three. Keep focus-visible outlines for accessibility, but do not show a permanent pale thick border.

**Important deployment failure mode:** Both root `index.html` and `athanor/index.html` previously referenced an unversioned stylesheet even while scripts were SHA-stamped. That allowed the **same displayed build SHA** to coexist with different cached toolbar CSS; user provided screenshots proving the discrepancy. `.github/workflows/pages.yml` was updated in `2cd6ed57` to SHA-bust both public CSS links alongside the JS. UI cleanup landed in `c82691ef`. **Code committed does not mean public browser verified.** Check the displayed build SHA, then visually confirm button order and thin brass grammar on Android. Do not attribute stale CSS to terrain or add a fourth button.

**Change discipline:** Inspect active source and actual deployed SHA first; distinguish geometry, occlusion, atmosphere, UI, and delivery. Do not solve an artistic visibility request with a nearby shader tint or generic scene fog. No speculative feature expansion. User specifically requested that existing solved systems be reused rather than reinvented.

## Implemented terrain — `arcana/terrain.js`

- Signed field with **positive = solid**, trilinear `terrain.sample(X,Y,Z)`. Grid `85 × 21 × 85`, X/Z half-extent 25.2, Y range -3.6..3.6. Marching-tetrahedra extraction into **81 chunk meshes**, nonindexed triangles. Reference inspection: 119,090 triangles; observed initial rebuild ~181–244 ms, not a guaranteed benchmark.
- Slab base top +1.15 / bottom -1.15; **six vertical through-hole bores** and **eleven top/bottom-localized raise/lower operations**. The bores genuinely create vertical walls; underside relief is independent. These are authored fixture operations, not a user editing tool.
- Atlas v2 initializes 2D fields `jurisdiction, gradientWeight, elevation, substrate, hydrology, provenance, strata, population, features`; seed 741; six named materials and `materialAt` lookup. Metadata is **not** implemented biome/population/material transport. Deposit map exists, with zero deposits in reported baseline.
- Chunk-local re-extraction exists internally and is instrumented, but no general external mutation interface is exposed; don't assume live terrain deformation or invalidation is implemented.
- `MeshStandardMaterial.onBeforeCompile` adds per-fragment spherical aperture discard and peripheral fog. Terrain group is translated `(-wanderX,0,-wanderZ)`; the shader aperture offset follows geological `(wanderX,0,wanderZ)`. The live shader-only treatment is edge index 8, aperture radius **9.92**. `edgeGeometry` inspection still reports an old **9.72 diagnostic fixture**; that is **not** the live clipping radius. Other edge treatment modes remain experimental and are not a solved edge system.
- Fragment clipping creates curves **inside triangles**, not necessarily along mesh edges. Terrain knows possible geometry; the renderer determines what survives clipping, occlusion and depth.

## Implemented Wanderer — `arcana/wanderer.js`

- Gold cube of side 0.38. Upper-surface support found via signed-field vertical stepping and bisection. Center and four foot corners require support, with maximum allowed height variation and inner-sphere corner containment. Boreholes are obstacles.
- Tap destination uses a stable horizontal plane at the walker's height, rejects unsupported points, tries a direct clear path, then bounded A* (0.34 grid, 17,000 iteration cap) with diagonal corner-cut checks and line-of-sight smoothing. Walk speed 1.8, with repeated support checks while moving. Unreachable taps may be rejected.
- Walker retains geological coordinates; once outside a ~4.86 local hangout radius, the geological terrain shifts beneath the centered view. X/Z offsets clamp to ±14 and drive `terrain.setOffset` and the shader aperture.
- Genesis also uses a **tap-only** terrain mesh raycast to classify visible underside hits vs navigation. This is distinct from and must not be confused with the **removed camera-wide node visibility raycasts**. `tapOwnership`, accepted/rejected navigation, route length, position, offset and support are inspectable.
- Genesis is **not** the old full Wanderer: no fire sequence, BBs, NPCs, legacy Crucible physics or named atlas world are implied here.

## Clean node-maker — `arcana/node-maker.js`

The only active node code is `createNodeMaker(THREE,parent)`, wired as `world.setWitnessNodes([{x,y,z,kind},...])`. Positions are **Hermeticon-local**. Four inherited colored slots: `surfaceTerrain` green, `sdfSurface` cyan, `sdfUndersurface` purple, `undersurfaceTerrain` red. Each is an instanced sphere mesh with capacity 256, **initially count zero**. These names are historical color labels, **not validated surface classifications**. Instrumentation reports per-kind counts, update count/time, rejected invalid/overflow positions, and `visibilityAudited:false` / `edgeCoverageAudited:false`.

There is **no automatic node selection**. The old `arcana/four-surfaces.js` height-rank algorithm and `arcana/draw-surface.js` edge inventory were removed from the active tree in `b1e4e822`. Do not restore them by default.


## 🌐 First-class edge observation instrument (2026-10-14)

`arcana/edge-detection.js` exports `createEdgeDetection(THREE,renderer,camera)`. Athanor instantiates it once, delegates rendering via `.render(scene,camera)` and 👁 via `.inspect()`. It exposes `.mode`, `.modes`, `.setMode(nameOrIndex)` and `.dispose()`. The tool owns its offscreen color/depth target, fullscreen Sobel/depth/hybrid shaders, SOURCE control path, mobile mode button and shader compilation diagnostics. OFF renders normally. Modes are OFF, SOURCE, SOBEL, DEPTH, HYBRID; they are preserved observational lenses, not throwaway experiments. They read the **whole scene**, not terrain-only occupancy, and do not provide world-space nodes or verified edge coverage. `renderer.debug.onShaderError` is restored on disposal if still owned. The established Pages workflow stamps the new module import with its SHA to prevent stale cache mixing. Live visual equivalence after extraction requires a fresh public build check; the pre-extraction verified shader build was `2e4c3ed2`.

## Deferred research: minimal GPU DRAW-boundary experiment

The critical correction: **the camera defines the viewpoint, not the authority. The visible rendered DRAW is the evidence.** We want the boundary of **terrain actually drawn in the current viewport**: the circular aperture edge and visible borehole openings. Avoid searching every geological mesh edge or running hundreds of CPU visibility rays.

1. Render a small **terrain-only occupancy mask** from the **same camera and aperture-discard semantics**, and overlay its boundary pixels on the normal image. Preserve existing terrain and Wanderer behavior.
2. Rotate camera and inspect the outer circular edge and bore openings. **Binary occupancy misses a bore lip if another terrain surface appears behind the hole**; if needed, add a minimal depth or surface-identity discontinuity pass. Do not claim the binary mask solves internal boundaries.
3. Instrument mask dimensions, boundary coverage, render cost, any GPU→CPU readback stall, mobile FPS and visible alignment. GPU already knows visibility but JavaScript does not get its fragments without an explicit pass/readback. Prefer GPU-side boundary extraction if readback is costly.
4. **Only after the overlay proves correct**, recover actual 3D positions (depth/unprojection or equivalent), select sparse witnesses, and feed `setWitnessNodes`. Screen pixels alone are not world positions. No premature contour graph, no CPU mesh scans, no height extrema or raycast witness selector.

The retired `292c646a` experiment saw ~9,900 candidate edges, ~140 ray tests/update, ~93–101 nodes, cyan zero, and unaudited contour coverage. It proved camera dependence but felt expensive and did **not** prove the DRAW boundary. Git history preserves the experiment without burdening the new baseline.

## Inspection, publishing and scope

👁 contains build SHA, FPS snapshot, mounted Genesis `systems` (terrain and Wanderer), `edgeTreatment`, historical `edgeGeometry`, empty `nodes` and `tapOwnership`. An FPS snapshot is not a benchmark. Check the actual running build before claiming live success.

`.github/workflows/pages.yml` is the sole publishing route. It assembles the static site, stamps build identity and SHA-busts Athanor direct imports; the older Wanderer fixture is stamped separately. Consult `bonoj/Gate/README.md` before touching delivery. A commit or queued Action is not proof of live execution. Diagnose and retry actual failures; don't improvise alternative release paths.

For a fresh Clara: **first read the current operational state above** and confirm deployed SHA. The immediate next work is to verify the three-button contract and, only when requested, plan an actual cavernous obscuration comparison. The GPU boundary experiment below is deferred, not the next instruction. Start at `codex/genesis/world.js`, `arcana/terrain.js`, `arcana/wanderer.js`, `arcana/node-maker.js`, `athanor/compose.js`. Preserve existing host, tap, navigation and aperture behavior. Make one small observable GPU boundary experiment. The historical narrative is `bonoj/Ledger/notes/2026-10-14-filavandrel-at-the-edge-of-the-world.md`; **leave Ledger unchanged for now**.
