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
