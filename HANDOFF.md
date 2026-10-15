# Hermeticon — cold Clara handoff (updated 2026-10-15)

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


## Current Genesis — populations, creatures, meteors, material (2026-10-14)

The botanical composition includes original Mists Reeds, the accepted five-species BB Garden, and accepted six-species Second Garden. All six trial bestiary species are mounted: Pebblebacks, Velvet Drifters, Threadwyrms, Glasswings, Bellwraiths, Lantern Hermits. They are implementation trials, not automatically author-accepted visuals. See [population catalog](arcana/populations/README.md) and [creature catalog](arcana/creatures/README.md).

**Cinderfall** (`arcana/spells/cinderfall.js`) is a **manual** meteor spell invoked by the Athanor meteor control / `world.castMeteor()`. Automatic casting was removed. Meteors can overlap in flight; each completes its own trajectory and impact, and a later tap does not cancel an earlier meteor. Creature targets include flying species' altitude. Each impact applies a three-dimensional radial blast to loose BBs and mounted organisms and can deform terrain separately at ground level. The original creature structures become inactive and release their BBs into `arcana/physics/bead-debris.js`. Loose BBs simulate terrain and vessel contacts; independent BB–BB collisions are not implemented.

**Material accounting:** each authored population reports `activeBeads` (excluding destroyed anatomy); debris reports `count`. `world.materialSurvey()`, `HermeticonSurvey()`, and `Athanor.inspect()` expose inspection without extra HUD clutter. The physical total is active authored BBs + detached BBs, **not** historical descriptor count + debris. Blast transfers now include clipped/retracted BBs; the current fallback for unrendered anatomy uses approximate authored positions rather than exact current animation poses. Treat conservation as an implementation intention until checked against a live before/after survey. No arbitrary population cap: debris rendering expands allocation as needed. This is not a promise of unlimited memory or performance.

**Observation default:** Athanor calls `edgeDetection.setMode('HYBRID')` at startup (commit `d134f50e`). This preserves the accepted terrain-only treatment; OFF/SOURCE/SOBEL/DEPTH remain selectable. The accepted rendering checkpoint is `7c74e324`, not a claim that the latest build was visually verified.

**Current verification boundary:** source changes are committed; confirm Pages build, displayed SHA, browser startup, rapid meteor taps, flying creature impacts, and before/after BB totals before claiming the current build is live and sound. No new rules, population caps, or observation HUD should be introduced merely to test it.

## Abiogenesis vacuum capture (2026-10-15)

[Canonical Abiogenesis specification](codex/genesis/ABIOGENESIS.md). Genesis mounts nested Abiogenesis at L0 and toggles its vacuum through a ray-tested, consumed vessel tap before terrain navigation. `arcana/physics/bead-debris.js` implements finite-range softened inverse-square pull, vacuum-only capture, exterior bounce otherwise, persistent interior ownership, ordinary gravity, and inner-wall collisions. Captured beads remain in the **same** debris array; the material survey's detached total does not change on ownership transfer. Inspect `systems[].vacuum`, debris `ownership.abiogenesis`, `abiogenesisCaptures`, and collision counters. **Code committed; runtime, deployment, tap hit testing, physics behavior, and live conservation remain unverified.**

**2026-10-15 performance revision:** The continuous Abiogenesis vacuum was observed near 30fps and too weak. It has been replaced by **one impulse per vessel tap**, with a one-time scan of nearby loose BBs, outward radial velocity cancellation and an inward kick. No persistent vacuum state or per-substep attraction. Captures require a vacuum-tagged inward shell crossing. See [updated contract](codex/genesis/ABIOGENESIS.md). New behavior is committed but not yet live-verified; author will observe.

## Verified Abiogenesis and wandering checkpoint (2026-10-15)

**This section supersedes the stale vacuum description immediately above.** There is no vacuum, inverse-square attraction, pulse eligibility, or exterior glass bounce. A tap on the nested cradle makes a one-time O(N) scan of loose BBs at Genesis world y <= 0 and **replaces** their velocity with a speed-22 vector toward the cradle's instantaneous position. No homing afterward. Any loose BB swept into the inner cavity transfers ownership once to `abiogenesis` and is confined by inner glass with ordinary gravity. All BBs remain in one debris inventory; no caps, culling-as-deletion, or BB–BB collision claims.

**Performance checkpoint:** physics source commit `d86b8a1c` adds conservative swept-AABB rejection before the existing sphere capture test, squared-radius interior rejection, and simpler terrain coordinate transforms; documentation commit `185fa119` follows. The author supplied live inspection for **both SHAs**, confirming browser execution. Build `d86b8a1c`: 73.12 FPS with 21,718 detached, 2,870 captured, 15.2 ms last physics; later **same session**: 62.33 FPS, 21,718 detached, 3,762 captured, 7.7 ms last physics, Wanderer offset [-3.08,-14]. Build `185fa119`: 61.72 FPS, 20,179 detached, 1,356 captured, 10.9 ms last physics, Wanderer offset [11.50,-12.82]. Different sessions and instantaneous counters are **not** controlled speedup benchmarks. In every supplied survey, material total was **24,625** (authored + detached), and ownership summed to detached count. User reports wandering looks fine; this validates observed navigation behavior, not an exhaustive regression suite. Hybrid remains visually accepted and untouched.

**Next performance work, only if requested:** profile cradle, terrain, vessel and interior costs separately with lightweight counters; compare matched simulation states before claiming a specific bottleneck or speedup. Preserve the physics and conservation contract.

## Floating Wanderer trial (2026-10-15)

Commit `64723d8b` replaces the original visual cube with a **composed Hermeticon shell** at scale `.06`, half Abiogenesis's `.12`, outer radius `.615` Genesis units. The existing terrain-space route planner and terrain-owned taps remain. `arcana/wanderer.js` now checks signed-field terrain samples under the lower spherical hemisphere (center and radial samples), with center height = support height + sphere radius + `.12` hover clearance. It checks full-sphere containment against the parent vessel and applies bounded nonnegative vertical idle motion, avoiding downward visual penetration. Inspection exposes `centerY`, `radius`, `hoverClearance`, and `stationkeeping` while retaining `y` as terrain support height for existing consumers. This is **source committed only**; runtime and navigation regression have NOT been checked. Sampling is conservative but not a continuous swept-volume proof; complex overhangs and tunnel traversal need further collision work. Local BB sensing/collection/processing is a **next phase**, not implemented by this visual/navigation change. Preserve conservation and no arbitrary caps.


## 2026-10-15 — Wanderer surface collection and expanded stationkeeping (current)

This section supersedes the earlier "Floating Wanderer trial" next-phase statement and the historical Abiogenesis vacuum text. The latest implementation is in `arcana/wanderer.js`, `arcana/physics/bead-debris.js`, and `codex/genesis/world.js`.

- **Sizes versus scale:** Abiogenesis scale **0.12** means outer radius **1.23** Genesis units, not radius 0.12; Wanderer scale **0.06**, outer radius **0.615**. Do not confuse scale and physical radius again.
- **Wanderer navigation:** terrain-owned taps; A* route, maximum speed **3.6** with approach braking; hover clearance **1.0** above support plus its shell radius. Bounded vertical idle is now `max(0, .52 sin(.71t) + .28 sin(.31t+1.2))`, so 0–0.8 additional center height; previous 0–0.07 motion is obsolete. Terrain clearance remains protected by nonnegative idle displacement.
- **Wanderer collection:** one pulse **every second**, footprint **1.23-radius horizontal disk** centered on Wanderer regardless of its altitude. Scans only detached BBs with owner `terrain`; first rejects by squared XZ distance, then tests signed terrain field for a narrow surface band (reject buried and high-flying). Eligible BBs receive a **single gravity-aware ballistic velocity assignment** toward the Wanderer cavity; no continuous homing or suction, no cylinder geometry, no new raycasts. Passive swept entry transfers existing BB ownership to `wanderer` in local coordinates, with gravity and interior shell reflection. No BB duplication/deletion.
- **Abiogenesis:** L0 center `[0,-6.23,0]`, horizontal bounded stationkeeping unchanged; vertical motion is now `.72 sin(.27t+.4)+.28 sin(.113t)` around center, combined maximum **±1.0** (previous ±0.54). The separate **tap-triggered direction command** targets detached BBs at y <= 0 with speed 22, skips both nested-vessel owners, and uses terrain-visible occlusion for tap ownership. Passive cavity capture and interior gravity remain; the old continuous-vacuum documentation is historical.
- **Material evidence supplied by author:** live build `7e8d4537` reported **58.34 FPS**, **6.1 ms last physics**, **21,718 detached**, **6,041 Wanderer-owned**, **5,129 Abiogenesis-owned**, **24,625 total** (2,907 authored + 21,718 detached); detached ownership summed correctly. This is a live snapshot, not a matched-condition benchmark or proof of zero dropped frames. Interior collision counters are cumulative. The expanded-hover commits `f48e7fa7` and `ae4f3ba5` are **committed but not yet visually verified**; verify parent-vessel/terrain clearance and motion in browser.
- **Performance contract:** avoid arbitrary BB population limits, continuous force fields, or speculative optimization. If requested, measure costs by owner and collision type before optimizing settled interior BBs. No FPS guarantee from the pulse change alone.

## GitHub instrument and next material experiment (2026-10-15)

The author is **very happy with the present Hermeticon**. Preserve its appearance and behavior. The bottom 🐙 control opens a small native overlay titled `🐙 Hermeticon · GitHub`; its three external links, in order, are **HANDOFF**, **COMMITS**, **PIPELINE**. The links target this document, `commits/main/`, and GitHub Actions. The top build SHA remains a readout, **not a tappable control**. The commits and pipeline links let the author inspect changes and build/deploy runs without asking Clara; a successful workflow is not proof that a browser is running the newest SHA. Both entrypoints (`index.html` and `athanor/index.html`) carry the drawer markup; Athanor owns its interaction and styling.

**Future creative direction — not implemented or authorized to deploy yet:** treat GitHub status as a **material BB interface inside Hermeticon**, not a DOM miniature of GitHub. A small BB organism/beacon could express deployment success (green, calm motion), queued/running (yellow, circulating), failure (red, agitated), and unavailable/unknown (dim, quiet). Data/provenance should remain inspectable through existing observation affordances. Consider public GitHub API access, caching and unauthenticated rate limits when implementing; keep source-of-truth data separate from destructible material representation. Do not claim this organism currently exists. The current three-link drawer remains the accepted implementation until explicitly replaced.
