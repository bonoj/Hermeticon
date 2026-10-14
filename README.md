# Hermeticon

**Live entrance:** https://bonoj.github.io/Hermeticon/  
**Current world:** Athanor mounts **Genesis** via `athanor/compose.js` → `codex/genesis/world.js`.  
**Read first:** [HANDOFF.md](HANDOFF.md) for implemented systems, diagnostics, publication and next experiment.

Genesis combines `arcana/terrain.js` (signed-field slab with bores, independent top/bottom relief and shader-clipped spherical aperture), `arcana/wanderer.js` (supported tap-to-walk navigation and moving geological frame), and `arcana/node-maker.js` (instrumented four-color node renderer, **empty by design**). The old camera/height-based node selectors were removed in clean commit `b1e4e822` and remain in Git history.

**Next experiment:** extract the visible boundary of GPU-rendered terrain in the current viewport. Begin with a terrain-only occupancy mask and a visual boundary overlay. If a bore opening shows terrain behind it, occupancy alone will not expose the lip; evaluate depth/surface identity only as needed. Prove the outline before placing nodes. No CPU mesh scans or witness raycasts.

## Boundaries

- `athanor/`: runtime, camera, render loop, inspection and current Genesis mount.
- `codex/genesis/`: authored composition.
- `arcana/`: composable terrain, Wanderer, node maker and other parts.
- `examples/wanderer-separated/`: **preserved older full Wanderer fixture**, independent of Genesis. Its fire, BBs, Crucible, geographical nodes and material contracts belong to its [own handoff](examples/wanderer-separated/HANDOFF.md).
- `archive/legacy-monolith/`: historical reference, not the running baseline.

Original JIT Wanderer was cloned, not moved, from `bonoj/Repository/src/jit/hermeticon-wanderer/index.html` at `f8fd252ca4abb91f7ca7c445197944a044df2173`.

## Publication

`.github/workflows/pages.yml` publishes `main` via GitHub Pages, assembling the site and stamping SHA identity. The root and `/athanor/` run Genesis; `/examples/wanderer-separated/` runs the preserved fixture. Read `bonoj/Gate/README.md` before changing deployment. Verify actual public SHA/runtime; **commit ≠ live**. Retry failures through the existing workflow, not an improvised route.
