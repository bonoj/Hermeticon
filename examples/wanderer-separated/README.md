# Wanderer — shared implementation and retained example

This directory began as a mechanical extraction of the original Hermeticon monolith. It is **now the authoritative application source** for both the root Hermeticon entrance and this preserved example. The original monolith is archived at `archive/legacy-monolith/index.html`.

- `index.html`: example entry, using local assets.
- `interface.css`: shared interface styles.
- `errors.js`: shared error capture.
- `world.js`: shared simulation, rendering, camera, controls, and UI logic.

The root `/index.html` references these same assets via `./examples/wanderer-separated/`; **do not fork the implementation into the root**. File separation does not yet imply clean behavioral separation: world, camera, and UI remain coupled in `world.js`. Preserve their behavior during future refactoring.

The Pages workflow stamps the deployed commit SHA into `world.js` and cache-busts asset references for **both** entry points. The build number on the live page is the first eight characters of the deployed Hermeticon commit, not the original JIT source commit. The unstamped repository source is not itself a deployed build.

For publication, failure recovery, and engineering contracts, see the root `README.md` and `HANDOFF.md`. Both URLs must stay functional.

## Simulation notes

The [world-generation experiment](WORLD_GENERATION_EXPERIMENT.md) preserves the original map interpretation and historical atlas research; distinguish author-confirmed geography from provisional generation and unimplemented plans. `world.js` contains the 22 authored terrain nodes and the local Quills, Amaranthine Fields, and Mists systems. Wanderer fire temporarily takes over navigation; each burst releases a persistent 500-BB population (125 blood, 375 solid), stored for now in local particle and instancing batches. These BBs must remain dynamic under gravity and geological contact as the terrain translates; a rest flag must not freeze them. Aperture clipping affects pixels, not material state or ownership. See root `HANDOFF.md` for the current implementation contracts and unresolved validation.

## Landmark activity — 2026-10-13

**Working creative inventory: 4 active / 18 open for authored activity** among 22 named geographic landmarks. This counts participation in a scene, not only independently scripted residents.

- **Quills:** turquoise resident opens/closes a nine-quill fan near Wanderer.
- **Amaranthine Fields:** violet gardener and seven responsive flowers.
- **Mists:** animated reed population and a fleeing/jumping fugitive, with a red-particle splat.
- **Downton:** participates in the Mists fugitive's flight/destination encounter; a cloud is currently overhead in the observed scene. Do not infer a dedicated Downton script or cloud ownership from this classification.

The remaining **18 landmarks are open creative territory**, not places without authored identity. Their map-derived descriptions and author clarifications are in [WORLD_GENERATION_EXPERIMENT.md](WORLD_GENERATION_EXPERIMENT.md). Develop activities consistent with those identities without silently canonizing provisional terrain, materials, or speculative lore. This is a planning/observation inventory, not a runtime-verified census of every ambient system.
