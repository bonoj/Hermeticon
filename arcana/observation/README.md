# Observation treatments

Reusable screen-space observation lens treatments. `lens.js` owns the existing offscreen color/depth capture, fullscreen shader, renderer lifecycle, and toolbar control. Individual treatment modules describe SOURCE, SOBEL, DEPTH, and HYBRID; OFF bypasses rendering and is not a treatment.

`createObservationLens(T, renderer, camera)` is the composition entry point. Its `render(scene,camera)`, `setMode()`, `inspect()`, and `dispose()` contract matches the former `createEdgeDetection`. The original full-scene shader formulas, modes, controls, and capture behavior are deliberately preserved. **Terrain-only masking/compositing is not implemented in this extraction.**

`arcana/edge-detection.js` is retained as a compatibility re-export. To add a treatment, define a module and register it in `lens.js`; this extraction does not change the GPU pipeline.
