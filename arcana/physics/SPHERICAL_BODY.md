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
