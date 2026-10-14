# Wanderer — operational handoff

Wanderer is one executable world within Hermeticon, not Hermeticon's architecture. This document owns Wanderer-specific simulation contracts and live-world caveats. For repository hosting, build identity, publication, and retries, see [Hermeticon README](../../README.md) and `bonoj/Gate/README.md`.

## Wanderer implementation

- Authoritative code: `world.js`; UI styles: `interface.css`; errors: `errors.js`; local entry: `index.html`.
- **Current correction (2026-10-14):** Hermeticon root runs Athanor + Genesis, not these legacy fixture assets. This preserved Wanderer runs at `examples/wanderer-separated/`; consult the root `HANDOFF.md` for Genesis.
- Archived ancestor: `../../archive/legacy-monolith/index.html` (historical only). Original JIT ancestor: `bonoj/Repository/src/jit/hermeticon-wanderer/index.html` at `f8fd252ca4abb91f7ca7c445197944a044df2173`; leave untouched.

## World contracts

- **Target material contract (not yet implemented):** matter has persistent world identity and geological position; the Crucible is a moving contact vessel, not the owner of a separate material universe. Track support/contact, motion, phase, provenance and rendering frame independently. Do not change ownership merely to handle a coordinate transform.
- **Current legacy behavior:** rain uses `rainOwner` and `rainWorld`; lower bowl contact transfers to Hermeticon-local coordinates, while geological contact can set `rainRest` without transferring back. Settled spilled BBs may consequently travel with the Crucible. Wanderer fire-burst BBs already integrate in geological coordinates and provide a reference implementation. Treat this as an observed defect and a migration seam, not a solved contract.
- Thump affects vessel-owned material regardless of height; do not restore spatial eligibility filters.
- Micro and macro material must not gain ownership merely through fracture.
- Keep terrain collision/tunneling improvements distinct from ownership changes.
- Preserve conservation, instrumentation, deterministic/reproducible behavior where present, phone-first controls, and large reliable tap targets.
- Do not casually rewrite physics, camera, controls, or UI while fixing deployment. Prove parity for changes that cross boundaries.
- The original monolith is historical evidence, **not** the current runtime baseline. The separated example and root must execute the same world assets.

## Material-world migration (design direction, 2026-10-13)

The old rain, Pumpkin and Wanderer populations have different frame and contact rules. Our understanding has outgrown the vessel-centric ownership system. Do not patch by simply untagging slow particles: speed alone is not evidence of terrain support. Establish a single geological/world coordinate convention for persistent BBs, keep source identity and material accounting independent of where matter rests, and model the Crucible as geometry/contact constraints. Preserve existing gravity, restitution, damping, thump and terrain collision behavior while migrating population by population. The aperture is presentation, not an ownership boundary. A resting BB must remain with terrain when the vessel/aperture moves, and resume motion if its support is removed. Verify in a live build before claiming success. No implementation change is implied by this documentation.

## Next development

Favor small composable changes within Wanderer. Do not promote Wanderer-specific physics into a universal Hermeticon contract without a second demonstrated use. Changes to hosting/publication belong in the root README.

## Current living-world state (2026-10-13)

- **22 authored geographic nodes** are defined by the `authored-v1` terrain operations and `landmarkSpecs` in `examples/wanderer-separated/world.js`. Names, positions, terrain operation, and marker icon are authoritative there. Quills has a feather-fan resident; Amaranthine Fields has a gardener/flowers; Mists has mist reeds. The other 19 currently have terrain and animated landmark markers but no dedicated local behavior. Do not infer canon/lore from names.
- **Wanderer fire sequence:** fire contact takes control away from user navigation (recoil → hopping panic → flight → burst → respawn). Tap-to-move and automated hearth navigation are ignored while the burn phase is not `ready`; taps resume on respawn. Fire-mode button remains functional.
- **Released Wanderer matter:** each burst creates 500 BBs: 125 red blood and 375 yellow solids. Every burst adds a new persistent 500-instance batch and particle population; respawning the Wanderer must not despawn previous matter. This is currently tracked in Wanderer-local `burnParticles`/`burnMeshes` arrays, a temporary implementation rather than the intended long-term material accounting location.
- **Frame versus ownership:** geological matter coordinates must track the moving geological world (`wanderX`/`wanderZ`) while continuing to integrate gravity and respond to terrain contact. Ownership/provenance and coordinate frame are distinct. Resting contact is physical equilibrium, **not** a fixed transform or permanent `rest` flag. If terrain support vanishes, matter must fall.
- **Contact:** Wanderer BBs have stronger normal and tangential dissipation on geological contact. Other populations' restitution was not intentionally changed. Validate slopes, repeated impacts, terrain deformation, and whether particles truly settle without sliding or tunneling.
- **Aperture:** shared `apertureClip(material)` provides per-fragment spherical visibility for fire and Wanderer BB instances; terrain retains its own shader/fog path using the shared `APERTURE_RADIUS`. Rendering outside the aperture is not a despawn or ownership event. Do not create another ad hoc radius/discard rule when adding a population; converge remaining render paths deliberately.
- **Crucible (legacy runtime):** lower-hemisphere bowl contact still drives population-specific ownership/frame behavior. This is the migration target above; it has **not** been redesigned in code. Do not conflate a render cut with physical contact.
- **Outstanding:** inspect actual live execution before asserting physics/visual correctness. In particular test geological BBs when the world translates, support removal, accumulation across multiple bursts, and the aperture edge. Do not assume that source commits prove runtime behavior.
- **Initialization caution:** declare `APERTURE_RADIUS` before constructing diagnostics or materials that read it. An earlier build failed to wake due to temporal-dead-zone initialization order; fixed in `442ef3c5`.
