# Hermeticon — cold Clara handoff (2026-10-14)

**Mission:** Build beautiful, perturbable, composable executable worlds inside a spherical vessel. Protect accepted work; let the machinery serve the play.

**Live:** https://bonoj.github.io/Hermeticon/  
**Repository:** `bonoj/Hermeticon` (`main`)  
**Canonical reusable systems:** [Arcana Catalog](arcana/README.md)  
**Observation treatments and regression guard:** [Observation README](arcana/observation/README.md)  
**Historical engineering detail:** [archived 2026-10-14 handoff](archive/handoffs/2026-10-14-handoff.md), not current instructions.  
**Working contract:** [Sanctum/CONTRACT.md](https://github.com/bonoj/Sanctum/blob/main/CONTRACT.md).

## Accepted current state

**2026-10-14: BB Botanical Garden promoted to canon by the author.** The five-species, all-spherical-BB alien garden in `arcana/populations/bb-garden.js` is mounted in Genesis alongside the original Mists Reeds. Small BBs make up stalks, textured clusters, canopies and fruit; species have asynchronous idle sway and actor-triggered retraction/regrowth. This is an **accepted creative direction and composition**, not a claim of independent automated FPS verification. The prior geometric species and their pleasant sway are preserved intact under `arcana/populations/potential/`. Do not replace the canonical BB garden with those prototypes or reintroduce non-BB plant geometry without instruction. Working nickname: **Hermeticoneer**.



**2026-10-14: Terrain-only HYBRID observation visually accepted by the author.** Accepted code checkpoint `7c74e324`. The terrain is readable, lit and beautiful in Hybrid. The lens changes **only terrain edges**; glass/brass vessel, Wanderer, and outside world remain unaffected. **This investigation is done. Do not reopen or retune it without an explicit request.**

Two regressions were resolved:
- `bc169a40`: overlay auto-clear erased the rendered vessel/background.
- `e06b2baa`: opaque compositing of offscreen terrain made the terrain nearly black.
- `7c74e324`: transparent edge-ink overlay on the normal lit scene, accepted.

The Arcana catalog and observation README were updated afterward. Always distinguish committed, deployed, and user-verified behavior; the accepted screenshot is the evidence for Hybrid.

## Where things live

- **Athanor:** `athanor/athanor.js`, `athanor/compose.js`, `athanor/interface.css`. Owns camera, renderer, mount lifecycle, UI, inspection, FPS, and the observation lens schedule. `arcana/edge-detection.js` remains the compatibility import.
- **Genesis:** `codex/genesis/world.js`. Authored composition: `createHermeticon()`, `createTerrain()`, `createEquatorialTreatment()`, `createNodeMaker()`, `createWanderer()`. It exposes `observationTargets().terrain`; Athanor passes this to the lens. Genesis does not own the postprocess.
- **Arcana:** [catalog](arcana/README.md). Contains reusable vessel, terrain, Wanderer, boundary intervals, equatorial treatments, observation, node maker, rock materials, cavern smoke, and optional occlusion wall.
- **Old fixture:** `examples/wanderer-separated/` is preserved history, **not** the current Genesis. Its BBs, fire, landmarks, and encounters are not automatically in Genesis.

## Ownership and interaction

**Terrain owns tap interpretation.** Genesis delegates `world.tap` to `terrain.interact(x,y,view,wanderer.getWalkingHeight())`; only a returned navigable target is passed to `wanderer.moveTo(x,z)`. The node maker is instrumented but empty; no active GPU boundary witness or camera-wide CPU selector is mounted.

The equatorial comparison system is extracted to `arcana/equatorial-treatment.js`, with ten presets and default shader-only transition (preset 8). The former spherical occlusion wall was extracted to `arcana/occlusion-wall.js` and is **not mounted**. Do not put it back into Genesis without instruction.

`arcana/rock-materials.js` and `arcana/cavern-smoke.js` are **available but not mounted in the current Genesis composition**. Historical rock-button, cap-toggle, and smoke-trial descriptions are superseded; do not infer current controls from them.

## User-visible contract

Current Genesis mounts the vessel, signed terrain, equatorial treatment, empty witness nodes, Wanderer, original Mists Reeds near spawn (geological center 1.4, 1.5), and the **canonical BB Botanical Garden**. Both populations root on the signed terrain and use Wanderer's geological offset; Genesis updates them after Wanderer. The UI includes observation, inspection, refresh, build SHA and FPS. The unsolicited `RIM PUNCH · crossings / solid intervals` label was **removed** in commit `1ed147b7`; do not restore it. Do not invent controls from old screenshots or historical handoffs. Preserve large, reliable mobile tap targets and the visual hierarchy.

The observation modes are OFF, SOURCE, SOBEL, DEPTH, HYBRID. HYBRID is accepted. The lens captures the terrain on layer 29 and checks full-scene depth before overlaying edge ink. It must never overwrite normally shaded terrain or clear the already rendered scene during the overlay. See the [observation contract](arcana/observation/README.md).

## Next work

**No current mandate to revisit Hybrid.** Return to authored worldbuilding and the user's next explicit direction. Deferred possibilities such as GPU DRAW-boundary witnesses, cavern treatments, sparse nodes, and material systems are *not* automatically authorized projects.

## Working and publishing discipline

1. Read this handoff, the [Arcana Catalog](arcana/README.md), and the **current source** before changing code. Do not revive superseded experiments.
2. Prefer small composable changes; preserve signed-field voids, terrain-owned taps, Wanderer, accepted Hybrid, and the untouched vessel.
3. Deploy through `.github/workflows/pages.yml`; consult [Gate](https://github.com/bonoj/Gate/blob/main/README.md). A commit is not live. Read the public build SHA and verify behavior before declaring a deploy successful.
4. Avoid speculative deployments, extra features, repeated user tests, and unnecessary UI. The machinery protects the play.


## Second Garden — ACCEPTED CANON (2026-10-14)

Six new BB-only species are mounted in Genesis via `arcana/populations/second-garden.js`: Mycelial Lace, Glassfall, Star Anemones, Cinder Chimneys, Geode Hearts and Tumble Orbs. **Author explicitly accepted all six species on 2026-10-14.** Source committed; independent live runtime verification is not claimed. All six share one instanced BB mesh, deterministic geological roots, idle sway, reversible growth, and actor clearance. Glassfall searches for signed-field underside roots and may have zero valid roots in a given placement; inspect before claiming it is visible. No functional material ports, locomotion, excavation, or condensation yet. Preserve the canonical original garden and accepted Hybrid terrain treatment.


## First Bestiary — Pebbleback trial (2026-10-14)

`arcana/creatures/first-bestiary.js` now mounts in Genesis: up to six seeded BB-only Pebblebacks, shared instanced rendering, segmented armor, six animated bead-chain legs, deterministic support-checked wandering and actor-triggered curl. **Candidate, not yet visually accepted.** Remaining five proposed creature species are not built. See `arcana/creatures/README.md`. No changes to canonical botanical systems or Hybrid terrain.
