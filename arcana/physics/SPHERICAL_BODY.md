# Spherical body — Arcana physics contract

`arcana/physics/spherical-body.js` exports `createSphericalBody({radius,innerRadius,solidAt,intersectsSphere,margin})`.

The body owns geometric admissibility, not intentions. `valid(center)`, `sweep(start,end)`, `tryMove(position,displacement)` (mutates position only on accepted motion), and `resolveBoundary(position)` (mutates only when a valid candidate is found). An enclosing spherical wall and terrain are checked **together**. An unresolved correction returns `{ok:false}`; never push radially into solid ground. The eye is a consumer, not a special-case solver.

## Geometric fidelity and outstanding work

With `intersectsSphere`, callers may supply an authoritative sphere-vs-geometry overlap test. Without it, the fallback samples 3 shells and the center, and sweeps in steps no larger than 0.10 world units. This is **not** a mathematically continuous sphere-vs-terrain collision guarantee: thin or sub-sample features can escape detection. Terrain's `sample` is occupancy, **not** a metric SDF. Do not claim otherwise.

The current boundary resolver searches free candidate positions, but it is not a continuous collision-based depenetration solver; when a boundary sweeps into a body, the body may already be outside admissible space before the correction. Unresolved contact is reported rather than silently resolved. The next prerequisite for a strict no-clipping guarantee is an authoritative sphere/terrain intersection (triangle BVH or conservative distance field), plus continuous time-of-impact handling for moving boundaries and dynamic obstacles.

## Integration

Eye: `arcana/entities/hermeticon-drone.js`. Player scrolling changes the terrain-to-render coordinate transform; the eye's terrain/world position remains invariant until its actual physical constraints force movement. Station keeping and voluntary travel use the same body motion gate. Diagnostics include `blocked`, `wallCorrections`, and `frameRebases`.

## Acceptance tests required before claiming strict collision safety

1. Sphere touching terrain above, below, and on vertical tunnel walls.
2. Narrow holes smaller than diameter rejected; wider holes traversed.
3. Tangential motion slides without penetration.
4. Moving enclosure approaches a body resting on terrain: choose a jointly valid position or report unresolved, never tunnel into ground.
5. World scroll with no wall contact preserves terrain/world coordinates.
6. World scroll causing wall contact displaces only as needed, never follows the player.
7. Large delta frames and thin features do not tunnel (requires exact geometric backend).

## 2026-10-14 triangle query implementation

Terrain now supplies `terrain.intersectsSphere(center,radius)`, testing the actual extracted marching-tetrahedra triangle geometry using triangle closest-point distance. Broadphase checks each chunk's bounding box and each triangle's bounding box; a positive terrain field sample at the sphere center detects fully embedded bodies. This removes the finite sphere-surface probe approximation for the eye. The test is a **static overlap test**, not a continuous swept collision test. `sweep` still samples intermediate positions at <=0.10 world units, so high-speed tunneling remains possible; dynamic moving boundaries are not yet continuous. Also note the rendered aperture shader discards some geometry beyond the visual aperture, while the extracted triangles remain in the collision mesh; near that aperture, render/collision parity needs review. Benchmark per-frame query costs before scaling to many creatures.

No browser-based regression run has been completed for this change. Do not claim no-clipping certification.

## 2026-10-14 conservative swept motion

`terrain.sphereClearance(center,radius)` computes distance to the extracted triangles (negative when the center lies in the positive-solid field). `createSphericalBody` now accepts this optional `clearance` callback. With it, `sweep` advances by 80% of the minimum of terrain and wall clearances. These distance functions are 1-Lipschitz for static geometry; an accepted step cannot jump through a static surface. The solver fails closed after 256 iterations. Diagnostics: `physics.sweepQueries`, `physics.contacts`, `physics.unresolved`, `physics.clearanceBackend`.

**Still outstanding:** (1) Moving-boundary resolution currently searches discrete valid candidates, not a time-of-impact trajectory; it may teleport between valid configurations and must be replaced before claiming continuous collision safety under world scroll. (2) Sphere clearance scans extracted triangles; no BVH or benchmark yet, so performance may regress badly. (3) No automated tests or live visual validation have been run. (4) Sphere-vs-sphere dynamics are not included. (5) The visual aperture shader discards geometry not removed from the collision triangles. Do not claim the milestone fully complete until these are addressed.

## 2026-10-14 collision-query acceleration

Each rebuilt terrain chunk now caches packed triangle positions and per-triangle AABBs; clearance queries reject chunks and triangle bounds before the closest-point calculation, without rebuilding triangle vertex objects for every rejected triangle. `terrain.inspect().collisionStats` exposes cumulative `queries`, `triangleTests`, and `chunkRejects`. This is an AABB broadphase, **not** a BVH, and no FPS benchmark has yet been run. Dynamic terrain rebuilds refresh the cache with their corresponding chunk geometry.

Moving-wall continuous displacement, actual regression execution, and browser verification remain outstanding. Do not confuse collision-query optimization with completion of those milestones.

## 2026-10-14 local emergency recovery

`resolveBoundary` no longer searches up to nine units inward and six units laterally. It first attempts the shortest radial correction for a wall-only violation, then searches a <=0.5-unit neighborhood in increasing displacement order, returning an unresolved failure otherwise. This prevents arbitrarily large teleports, but it is still a **discrete penetration recovery**, not continuous moving-wall CCD; local corrections can cross intervening thin geometry, and unresolved states may remain overlapping. The proper next step is to model the wall motion as a continuous constraint and validate simultaneous terrain/wall contacts with executable regression tests.

## 2026-10-14 wall recovery: terrain-certified radial path

Removed the discrete neighborhood candidate search entirely. `resolveBoundary` now refuses to correct any existing terrain overlap; for wall-only encroachment it tests the minimum radial inward segment against terrain clearance with conservative advancement and rejects blocked or uncertifiable corrections. This avoids silently teleporting across terrain. It is still a post-rebase correction, not continuous collision response to the changing boundary. When no safe radial path exists the body remains unresolved; a future time-dependent constrained solver must handle tangential escape **before** the wall penetrates. No automated or browser runtime tests have been executed for this commit.

## Executable regression fixture

Open [spherical-body-regression.html](./spherical-body-regression.html) in the deployed Arcana directory to run the deterministic browser regression suite. It exercises static terrain-plane collision, sphere contact, swept crossings, wall exit, wall-only correction, conflicting terrain/wall constraints, and embedded-body fail-closed behavior. It is a harness, **not a recorded passing test run**; the tests use an analytic half-space rather than the actual terrain extraction. Additional moving-wall trajectories and terrain mesh fixtures remain mandatory before certification.

## 2026-10-14 scroll solver review

Genesis eye scroll handling now uses explicit-frame terrain clearance and increments `scrollConstraintContacts` and `scrollUnresolved`. On unresolved collision, normal eye locomotion is suppressed while the body remains invalid. **Important:** the current scroll handler still applies the final viewport rebase after an unresolved contact, so it does not guarantee nonpenetration. The solver also has no executed integration tests for moving wall plus ground, and the candidate path evaluation needs review for contact continuity across scroll substeps. Do not mark the moving-wall milestone complete or claim a verified no-clipping guarantee.

## 2026-10-14 unresolved scroll position preservation

Eye scroll handling now retains `lastSafeWorld` during intermediate offset steps. On an unresolved contact, the final render-frame position is reconstructed from that last terrain-clear world point instead of blindly using the full-scroll target. This prevents the rebase itself from introducing an unverified terrain displacement. **Not a full solution:** the final glass wall can still overlap the eye when a collision is geometrically impossible to resolve; candidate corrections and moving-wall sweeps need stronger certification. Browser and integrated moving-wall regression results remain unverified.
