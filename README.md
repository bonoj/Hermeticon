# Hermeticon

**Live entrance:** https://bonoj.github.io/Hermeticon/  
**Current world:** Athanor mounts **Genesis** via `athanor/compose.js` → `codex/genesis/world.js`.  
**Read first:** [HANDOFF.md](HANDOFF.md) for implemented systems, diagnostics, publication and next experiment.

Genesis combines `arcana/terrain.js` (signed-field slab with bores, independent top/bottom relief and shader-clipped spherical aperture), `arcana/wanderer.js` (supported tap-to-walk navigation and moving geological frame), and `arcana/node-maker.js` (instrumented four-color node renderer, **empty by design**). The old camera/height-based node selectors were removed in clean commit `b1e4e822` and remain in Git history.

**Known-good terrain:** `40928287` (signed-field spherical aperture cap preserving bore openings, accepted visually and performant while wandering). Later experiments were rolled back; current branch contains targeted UI/deployment repairs. See [HANDOFF.md](HANDOFF.md) for precise operational state.

**Current toolbar contract:** exactly three existing controls, left-to-right 🌐 👁 ↻, with original thin brass borders and dark backgrounds. Their order is rooted in the shared CSS, not the creation timing of the dynamically appended globe. The Pages workflow versions CSS as well as JS to avoid mixed-cache builds. Confirm the actual public SHA and rendered controls; a commit alone is not a visual verification.

**Next visual exploration (not implemented):** compare genuine cavernous obscuration strategies against the opaque cap baseline—localized fog, darkness, dissolution, and faint distant glow—without exposing ugly mesh innards. Do not merely recolor the wall or add unrelated controls. The GPU terrain DRAW-boundary/occupancy-mask research is documented in the handoff as **deferred**, not the current task.

## Boundaries

- `athanor/`: runtime, camera, render loop, inspection and current Genesis mount.
- `codex/genesis/`: authored composition.
- `arcana/`: composable terrain, Wanderer, node maker and other parts.
- `examples/wanderer-separated/`: **preserved older full Wanderer fixture**, independent of Genesis. Its fire, BBs, Crucible, geographical nodes and material contracts belong to its [own handoff](examples/wanderer-separated/HANDOFF.md).
- `archive/legacy-monolith/`: historical reference, not the running baseline.

Original JIT Wanderer was cloned, not moved, from `bonoj/Repository/src/jit/hermeticon-wanderer/index.html` at `f8fd252ca4abb91f7ca7c445197944a044df2173`.

## Publication

`.github/workflows/pages.yml` publishes `main` via GitHub Pages, assembling the site and stamping SHA identity. The root and `/athanor/` run Genesis; `/examples/wanderer-separated/` runs the preserved fixture. Read `bonoj/Gate/README.md` before changing deployment. Verify actual public SHA/runtime; **commit ≠ live**. Retry failures through the existing workflow, not an improvised route.
