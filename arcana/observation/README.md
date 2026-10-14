# Observation — Composable Lens Treatments

The renderer-independent treatment definitions live beside the reusable lens. `lens.js` owns GPU capture, selection, occlusion, compositing, controls, instrumentation, and lifecycle; treatment modules own their expressions and names.

| Mode | Module | Behavior |
| --- | --- | --- |
| OFF | none | Bypass observation and render normally |
| SOURCE | [`source.js`](source.js) | Unmodified scene reference |
| SOBEL | [`sobel.js`](sobel.js) | Terrain color-gradient edge detection |
| DEPTH | [`depth.js`](depth.js) | Terrain depth-discontinuity detection |
| HYBRID | [`hybrid.js`](hybrid.js) | Sobel + depth edges, accepted Genesis treatment |

## API

`createObservationLens(T,renderer,camera)` returns `observeTerrain(group)`, `setMode(nameOrIndex)`, `render(scene,camera)`, `inspect()`, `dispose()`, and mode accessors. The existing `arcana/edge-detection.js` exports `createEdgeDetection` as a compatibility alias.

Athanor creates and schedules the lens. Genesis declares `observationTargets().terrain`; Athanor calls `observeTerrain(group)` when Genesis mounts. The lens uses a dedicated terrain layer (29), terrain color/depth capture, and full-scene depth for foreground occlusion.

## Accepted rendering contract — 2026-10-14

**HYBRID is visually accepted at commit `7c74e324`.** It draws edge ink over the **normal lit scene**, not a replacement image of the terrain. SOBEL and DEPTH use the same terrain-only compositing boundary.

- Preserve terrain's actual material, lighting, and shading.
- Leave the glass/brass Hermeticon, Wanderer, and Athanor background unchanged.
- Respect scene depth: don't draw terrain edges through nearer objects.
- Preserve the already rendered scene during the fullscreen overlay: disable renderer auto-clear for that pass and restore it afterward.
- The transparent overlay's unselected pixels contribute nothing; edge strength controls opacity.

## Regression history

- `bc169a40`: the fullscreen pass cleared the scene; vessel and background disappeared.
- `e06b2baa`: preserving the scene fixed that clearing regression, but the lens still overpainted terrain with dark offscreen colors.
- `7c74e324`: edge-ink-only alpha overlay preserved the original lit terrain; accepted by visual inspection.

**Do not revert to opaque terrain-color compositing or fullscreen auto-clear.** Keep new treatments reusable and scoped to explicit observation targets rather than hardcoding Genesis.
