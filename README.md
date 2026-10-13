# Hermeticon — Wanderer

Hermeticon is a standalone executable world. **Live entrance:** https://bonoj.github.io/Hermeticon/ . **Preserved example:** https://bonoj.github.io/Hermeticon/examples/wanderer-separated/ .

## Source of truth

- `examples/wanderer-separated/world.js`: running world, simulation, camera, controls, and current UI behavior.
- `examples/wanderer-separated/interface.css`: shared interface styling.
- `examples/wanderer-separated/errors.js`: error capture.
- `examples/wanderer-separated/index.html`: example entry.
- `index.html`: **thin root entry**, referencing the same example assets; do not put a second copy of the world here.
- `archive/legacy-monolith/index.html`: original monolithic reference, preserved; never use it as the active source.
- `.github/workflows/pages.yml`: only publication route; stamps the executing commit and verifies both public entries.

## Provenance

Graduated by **cloning**, not moving, the JIT Wanderer from `bonoj/Repository/src/jit/hermeticon-wanderer/index.html` at source commit `f8fd252ca4abb91f7ca7c445197944a044df2173`. The JIT ancestor and its deployment are untouched. The current displayed eight-character BUILD is stamped from the deployed Hermeticon commit, **not** the ancestral JIT SHA.

## Development and publication

Edit the shared example assets; preserve the root entry and example as two entrances to **one** implementation. Push to `main` to trigger `Publish Hermeticon` in GitHub Actions. The workflow assembles a static `site/` artifact, stamps `world.js`, adds SHA cache-busting asset URLs to both HTML entries, and deploys to GitHub Pages. There is no mirror repository, bundler, or application server.

Before changing deployment mechanics, read `bonoj/Gate/README.md`, the existing workflow, and `HANDOFF.md`. **Do not improvise a new publishing path or SHA-specific release URL.** A commit is not proof that the public build is live; verify the actual public HTML/build SHA and runtime.

**Failure is recoverable, not a lock:** a failed build, verification, or deployment does not prohibit another push or manual `workflow_dispatch` retry. Diagnose the failing step; repair and trigger a new run. New pushes supersede in-flight work; never require the user to chase refreshes or manually prove delivery. Do not report success without evidence. See `HANDOFF.md` for retry steps and engineering contracts.

## Current world and material behavior

The authored terrain has **22 named geographical nodes**, derived from an author-supplied hand-drawn map. Their source descriptions, clarifications, and historical atlas experiments are preserved in [WORLD_GENERATION_EXPERIMENT.md](examples/wanderer-separated/WORLD_GENERATION_EXPERIMENT.md); proposed systems in that note are not necessarily implemented. Quills, Amaranthine Fields, and Mists currently have dedicated local animations/systems; the other 19 have authored geography and landmark markers without distinct local behaviors. Names are not a license to invent canonical lore.

Wanderer fire produces **125 red blood BBs and 375 yellow solid BBs per burst**. Released BBs persist across respawns, use geological coordinates, and remain gravity-driven. Wanderer tap navigation is suspended during the fire sequence and resumes on respawn. Fire and Wanderer fragments use shared aperture clipping; visibility is not material ownership. The current material arrays are transitional. For contracts, caveats, and verification, see `HANDOFF.md`.
