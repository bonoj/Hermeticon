# Eighteen Encounters — implementation and witness specification
Date: 2026-10-13
Status: **proposed / not implemented**. Companion to [README.md](README.md), which holds all eighteen encounter scripts and their geological second pass. Geographic evidence and author clarifications live in [WORLD_GENERATION_EXPERIMENT.md](WORLD_GENERATION_EXPERIMENT.md). Do not conflate proposal, code, deployment, and observed acceptance.

## Purpose and delivery
Implement eighteen distinct, locally activated, deterministic experiences in a coordinated pass, then let the human visit each and return eighteen inspect reports. Preserve Quills, Amaranthine Fields, Mists, Downton, Wanderer burn/respawn and 500-BB persistence, signed geology, existing matter ownership, controls, and both Pages entrances. The authoritative source is `world.js` in this directory; root `index.html` imports it. Do not duplicate the world.

## Absolute boundaries
1. **Nothing renders outside the Hermeticon inner dome.** Apply the existing aperture clipping path to every new mesh, instanced BB, line, sprite, effect, shadow-producing surface and temporary construction. Render-only clipping must not delete world state. Explicitly inspect edge cases during camera orbit and world translation; shadow maps and postprocessing may need independent guards. Don't infer coverage from a material merely being nearby.
2. **Visibility is not physics.** World coordinates own terrain and persistent entities. The moving aperture determines local presentation and eligible high-detail updates, not the existence of matter. Lower Crucible contact is physical; a deliberate inner-surface rebound is a separate opt-in rule. An entity may leave the aperture, be clipped, and continue its world trajectory. Do not invent universal dome containment.
3. **Real terrain edits use authoritative geology.** Excavation changes signed geology; raising/deposition changes that same field. Terrain-derived material carries origin and current owner separately. If an encounter cannot reconcile a terrain edit with material units, stage it as a visibly labeled *nonconserving prototype* or defer that edit; do not silently substitute decorative BBs.
4. **No camera-driven simulation.** Encounter activation is derived from world/aperture position and Wanderer proximity, never screen pixels or camera frustum. Orbit and pinch must not reset phases or population.
5. **Phone-first budget.** Avoid eighteen continuously running solvers. Use deterministic phase clocks, near-aperture activation, coarse far-state, bounded allocations and instancing; expose actual costs. No per-frame full-scene witness.

## Data and composition
Use a small declarative encounter registry keyed by the exact eighteen authored landmark IDs. Preserve source `authored-v1` positions; no fabricated map coordinates. Each record: `id, seed, anchor, jurisdictionQuery, activationRadius, phase, phaseStartedAt, worldState, localRenderHandles, materialAccounts, transitions, errorFlags`. A separate state for each encounter; common lifecycle helpers are permitted, a global god-object that owns all simulation is not. Render handles can be discarded/reconstructed without losing world state.

**Reusable grammars, only where earned:** hinge/fold chains (Jade Peak, Gradient), articulated branches (Whisperwood, Cinderglade, Brambles), ring/stack masonry (Heart, Kindle, Redwall), BB lattices/sheets (Winter, Bood, Violet Coast), socketed modular assemblies (Upton, Ocean), paths/route followers (Ice Vale, Silverpass), and deformable terrain operators. Reuse the existing atlas layers as *queries*, not proof of simulated ecosystems or water. Avoid writing a speculative universal entity language before an encounter demands it.

## Lifecycle contract
`dormant → primed → performing → consequence → settled`, with optional authored `revisit` and `reset` transitions. Record reason and simulation time for every transition. `primed` occurs when the encounter anchor enters a bounded world-space vicinity of the aperture; `performing` requires a local event (Wanderer approaches, time since arrival, or explicit interaction). `settled` persists meaningful state across aperture departure. Revisit semantics are per encounter, not a global automatic reset. Keep activity discoverable without tiny taps or long presses. All durations and radii are tunable and must be reported, not hardcoded as universal magic numbers.

## Matter transaction contract
For each physical operation record `transactionId, encounterId, sourceWorldRegion, materialIdentity, provenanceId, originOwner, currentOwner, quantityUnit, quantityBefore, excavated, loose, deposited, bowlReceived, emittedBeyondAperture, quantityAfter`. Use existing signed-field sample counts only where that is the current authoritative unit; never imply cubic-meter conservation from sample counts. Require `before + sourced - consumed = after + exported` in a *declared common unit*. If the representation changes (terrain samples → BBs → terrain), define and test an explicit conversion before enabling the transaction. Geometry is not its own material ledger. Cross-aperture clipping does not count as exported or consumed; physical bowl transfer is a separate event.

## Instrumentation: one report per visit
Add a compact, on-demand `encounters` section to the existing INSPECT/COPY REPORT path; preserve existing report keys. Summary: `buildSha, activeEncounterId, 18-state summary, errors, frameFps, clippedOutsideCount`. Detail for active or selected encounter: `id, seed, phase, timeInPhase, activationReason, worldAnchor, jurisdictionSample, transitionHistory (bounded), terrainMutations, materialTransactions, visibleCount, clippedCount, boundaryCrossings, bowlContacts, collisions, invariants, errors`. Make all 18 discoverable/inspectable without triggering them. Reports must distinguish *not activated*, *running*, *settled*, and *failed*.

For a report to count as a useful acceptance witness: capture build identity, visit location, trigger, at least one meaningful state transition, visible outcome, material reconciliation where relevant, no outside-dome rendering, and whether the outcome survived a leave-and-return test. A screenshot/video is optional visual evidence; INSPECT alone does not prove artistic readability. Never claim all 18 accepted based on one successful build.

## Per-place implementation targets
Read the full second-pass scene in README before coding; these are implementation seams, not replacement stories.

| Landmark | Minimal first executable seam | Persistent or measurable consequence |
| --- | --- | --- |
| Summerlands | Responsive sunflowers trace a shadow dial; bounded dial cut | Cut samples accounted into obelisk |
| Winter King's Realm | Crown lattice assembles, one king freezes | Succession counter; throne excavation/deposition |
| Ice Vale | Sled route follows known pass toward map edge | Runner grooves; no invented off-map basin |
| Gradient | Fold grammar samples continuous gradient weight | Reversible ridges and bowl-bound BBs |
| Heart of Darkness | Spiral excavation with rotating lighthouse | Shaft plus source-derived staircase |
| Bood Lakes | Distinct basin bells respond to local disturbance | Basin-scoped cracked bell and spray |
| Jade Peak | Shallow peel, folded dragon silhouette | Scales/new outcrop share origin |
| Silverpass and Gemgates | Three gate decisions on cargo | Provenance-based sorting and arch rebuilding |
| Cinderglade and Fell Crater | Firefighters dig and ferry spoil | Trench and crater-fed inventory |
| Whisperwood | Branches react to world-space footsteps | Two delayed terrain trails |
| Brambles | Hedges rearrange around Wanderer | Navigable maze, recoverable portrait fragments |
| Rift | Stitcher erects temporary bridge | Support/collapse and counted spill |
| Spill | Bead chain climbs a cut channel | Sediment sent to bowl |
| Redwall | Wall patrol migrates bricks forward | Wall footprint physically shifts |
| Upton | Walking houses leave socketed foundations | Wrong-place rebuild with identity retained |
| Kindle Tower | Keeper extracts and launches bricks | Tower hollowing and bowl receipts |
| Violet Coast | BB-stitched wave uses bank sediment | Tide pools and recovered weights |
| Ocean of Tears | Ship reassembles from local fragments | Persistent hull void and visit history |

## Verification and release
1. Baseline source and reports before edits; record existing four active scenes and burn/material behavior.
2. Implement the common encounter registry and bounded on-demand report, then prove one simple encounter and one terrain/material encounter before extending to all eighteen. This is a **single coordinated release plan**, not a requirement to make one untestable giant patch.
3. Validate each encounter with deterministic state-machine tests and synthetic boundary/leave-return checks. For physical terrain edits verify authoritative field mutation, material balance and physical collision consistency. Where a visual assertion requires a human, mark unverified.
4. Confirm the dome clipping contract with off-axis camera, translated world, fast moving BBs, and instanced/line/shadow cases. Zero visible primitives outside is the acceptance target; `clippedCount` itself may be positive.
5. Read `HANDOFF.md` and `bonoj/Gate/README.md` before publishing. Commit, run checks, let existing Pages Actions deploy, verify both canonical URLs and deployed SHA; do not call it live from source commit alone.
6. The human visits eighteen sites and returns eighteen reports. Fix discovered defects by common seam where possible; retain authored surprises rather than rewriting the world to satisfy brittle tests.

## Explicit non-goals
No universal ecology, generalized dynamic LOD, global hydrology rewrite, invented mineral canon, speculative atlas importer, automatic conversion between incompatible material units, or retroactive changes to original JIT provenance. The eighteen scripts are creative proposals until implemented and observed.
