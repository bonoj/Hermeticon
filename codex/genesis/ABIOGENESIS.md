> **Current implementation, 2026-10-15:** Abiogenesis scale 0.12 gives outer radius 1.23. Vertical stationkeeping now has terms 0.72 and 0.28 (maximum combined displacement 1.0) about y=-6.23. A shell tap directs eligible loose BBs below y=0 toward its current center once; passive cavity crossing captures material. Older vacuum sections below are retained as history. Wanderer's separate surface collector is documented in the root HANDOFF.md.

# Abiogenesis — L0 vacuum impulse contract (2026-10-15)

Supersedes the earlier continuous inverse-square vacuum implementation after observed ~30fps and insufficient pull.

- Each tap on Abiogenesis fires **one** vacuum pulse, consumed before terrain navigation. No on/off state.
- On tap, scan Genesis-owned detached BBs within radius 3 Genesis units **once**. Cancel outward radial velocity and add a strong inward impulse (initial tuning: 45 velocity units). Ordinary physics then resumes, with no per-frame attraction.
- Mark only affected BBs as vacuum-eligible. On their subsequent inward crossing of Abiogenesis's exterior, transfer the existing BB once into Abiogenesis ownership and local coordinates. Do not clone or delete.
- BBs without vacuum eligibility bounce from exterior glass. Captured BBs always experience ordinary gravity and collide with inner glass, regardless of subsequent pulses.
- Captured BBs are unaffected by later pulses; L0 stationkeeping remains independent.
- Single authoritative BB inventory. Inspect pulse count, affected count, capture count, interior/exterior hits and ownership. No population caps.
- Preserve accepted terrain, Hybrid, gardens, glass and brass.
- Source commits do not prove deployed runtime or visual behavior.

## Collision broadphase (2026-10-15)

Passive exterior bouncing and vacuum-tagged capture share a swept axis-aligned bounding-box rejection against the moving cradle. Only candidate crossings compute squared spherical distances; square root is reserved for actual exterior contact normals. This avoids unconditional per-BB distance/hypotenuse work across physics substeps. A vacuum ticket expires when its bead exits the local jurisdiction. Captured beads use inner-glass confinement. The author reported ~41fps before taps with 20,207 loose BBs and ~15.9ms physics; the optimization is committed but **not yet benchmarked**.

## Exterior collision removed (2026-10-15)

Exterior Abiogenesis glass is now non-colliding. Genesis-owned BBs pass through unless marked by a vacuum pulse; only pulse-tagged BBs receive a per-substep capture check, transferring ownership on inward entry into the inner cavity. Captured BBs remain subject to inner-glass confinement and ordinary gravity. No passive exterior broadphase or exterior bounce. This supersedes the earlier exterior collision contract. FPS improvement requires observation.

## Current contract (2026-10-15; supersedes vacuum sections above)

Abiogenesis has **no vacuum or specialized gravity**. Tapping it no longer imparts force. Exterior glass is non-colliding; any Genesis-owned loose BB entering the inner cavity is captured and transferred to Abiogenesis ownership. A swept segment/sphere test catches crossings that pass through the cavity in one substep. Captured BBs use ordinary gravity and are confined by the inner glass. Prior vacuum pulse, range, impulse, ticket, and tap telemetry descriptions are historical only.

## Underside direction command (2026-10-15)

Tapping Abiogenesis performs a single O(N) scan of detached BB inventory. Any Genesis-owned BB at world y <= 0 receives velocity of magnitude 22 directed toward the cradle's instantaneous center, using proper owner-to-world coordinate conversion. No persistent steering, vacuum, gravity field, ticket, or collision override. A miss remains a loose BB; passive inward capture remains independently governed by the cavity collision rule. Inspection exposes `directionCommands` and `lastDirected`. This supersedes the earlier description that tapping is inert.

## Physics optimization checkpoint (2026-10-15)

Commit `d86b8a1c` introduces swept-AABB early rejection before the existing sphere capture calculation, squared-radius interior contact rejection, and simpler per-step terrain coordinate conversions. Collision semantics and material ownership are intended to remain unchanged. This is a source-level optimization, **not yet browser/runtime verified**. Compare `perf.lastPhysicsMs`, FPS, `abiogenesisCaptures`, `abiogenesisInteriorHits`, and material totals against build `7c3d62ae` before further changes. Avoid caps, sleeping, or altered capture semantics without separate approval.

## Live verification (2026-10-15)

The earlier unverified statement in the physics optimization checkpoint is now superseded. The author provided live inspection on `d86b8a1c` and `185fa119`, confirming that the broadphase optimization runs in-browser, one-shot direction commands occur, and passive capture continues. Samples: `d86b8a1c` at 73.12 FPS / 15.2 ms last physics / 21,718 detached / 2,870 captured; later same session at 62.33 FPS / 7.7 ms / 21,718 detached / 3,762 captured; `185fa119` at 61.72 FPS / 10.9 ms / 20,179 detached / 1,356 captured. All samples conserved **24,625** total authored + detached BBs; detached ownership sums matched detached inventory. These are observational snapshots, not matched-condition benchmarks; do not claim a measured percentage physics speedup. Wanderer navigation was also exercised and reported visually sound. Current canonical behavior is the **Current contract + Underside direction command** sections, not historical vacuum contracts above.
