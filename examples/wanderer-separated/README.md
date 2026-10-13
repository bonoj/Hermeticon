# Wanderer — shared implementation and retained example

This directory began as a mechanical extraction of the original Hermeticon monolith. It is **now the authoritative application source** for both the root Hermeticon entrance and this preserved example. The original monolith is archived at `archive/legacy-monolith/index.html`.

- `index.html`: example entry, using local assets.
- `interface.css`: shared interface styles.
- `errors.js`: shared error capture.
- `world.js`: shared simulation, rendering, camera, controls, and UI logic.

The root `/index.html` references these same assets via `./examples/wanderer-separated/`; **do not fork the implementation into the root**. File separation does not yet imply clean behavioral separation: world, camera, and UI remain coupled in `world.js`. Preserve their behavior during future refactoring.

The Pages workflow stamps the deployed commit SHA into `world.js` and cache-busts asset references for **both** entry points. The build number on the live page is the first eight characters of the deployed Hermeticon commit, not the original JIT source commit. The unstamped repository source is not itself a deployed build.

For publication, failure recovery, and engineering contracts, see the root `README.md` and `HANDOFF.md`. Both URLs must stay functional.
