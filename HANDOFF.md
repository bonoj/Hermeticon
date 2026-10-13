# Hermeticon — operational handoff

## Where to work

- **Authoritative implementation:** `bonoj/Hermeticon/examples/wanderer-separated/`. `world.js` owns world behavior and still includes some camera/UI coupling; `interface.css` owns styling; `errors.js` owns error capture; `index.html` is the example entry.
- **Primary public entrance:** https://bonoj.github.io/Hermeticon/ . Root `index.html` is an entry pointing to those shared assets, **not** a second world implementation.
- **Secondary fixture:** https://bonoj.github.io/Hermeticon/examples/wanderer-separated/ . Keep operational.
- **Archived original:** `archive/legacy-monolith/index.html`. Historical reference only; do not overwrite, resurrect, or publish it as the root.
- **Publisher:** `.github/workflows/pages.yml`, GitHub Pages via Actions on `main`.
- **Original JIT ancestor:** `bonoj/Repository/src/jit/hermeticon-wanderer/index.html`, source commit `f8fd252ca4abb91f7ca7c445197944a044df2173`. Do not change its code or deployment during Hermeticon work.
- **Delivery guardrails:** read `bonoj/Gate/README.md` before publication changes. This repo uses direct Pages Actions, not the older two-repository JIT path.

## World contracts

- Physical Crucible contact transfers matter ownership; proximity or spawning alone does not.
- Thump affects vessel-owned material regardless of height; do not restore spatial eligibility filters.
- Micro and macro material must not gain ownership merely through fracture.
- Keep terrain collision/tunneling improvements distinct from ownership changes.
- Preserve conservation, instrumentation, deterministic/reproducible behavior where present, phone-first controls, and large reliable tap targets.
- Do not casually rewrite physics, camera, controls, or UI while fixing deployment. Prove parity for changes that cross boundaries.
- The original monolith is historical evidence, **not** the current runtime baseline. The separated example and root must execute the same world assets.

## Build identity and deployment

`Publish Hermeticon` assembles `site/`, stamps the current full `github.sha` into `examples/wanderer-separated/world.js`, displays its first eight characters, and adds `?v=<full SHA>` to both entries' references to `world.js`, `interface.css`, and `errors.js`. It also writes `build.json` and `examples/wanderer-separated/release.json`. The static source version of `world.js` is intentionally unverified before stamping. Do not display an ancestral SHA as the live build.

Expected public URLs (never use a `/releases/<sha>/index.html` link):
- https://bonoj.github.io/Hermeticon/
- https://bonoj.github.io/Hermeticon/examples/wanderer-separated/

A successful source commit alone does not establish publication. Inspect the latest **push** run of `Publish Hermeticon` and its steps, then verify both public HTML entries reference the expected SHA-stamped assets; where possible, verify the executing build and behavior. A missing PR-filtered workflow result is **not** proof of success or failure. Be precise about what was and wasn't verified.

## Failure and retry: never dead-end

1. Identify the failed step in the latest Actions run; obtain job logs when available. Do not infer a cause from a stale browser view.
2. If assembly fails, fix its actual source/asset/assertion issue. If deploy fails, inspect Pages permissions/environment and job error. If public verification fails, compare the deployed HTML/build SHA with the expected SHA; distinguish CDN delay from a failed deployment.
3. Fix the smallest responsible seam; keep both entry points and existing publication path intact. Push the repair to `main` (automatically triggers a fresh run), or rerun the workflow with `workflow_dispatch` when appropriate. **A previous failed run is not a prerequisite and must never block a new attempt.**
4. New commits should supersede older queued/in-progress builds. Do not stack speculative workflow rewrites, invent release URLs, or ask the user to repeatedly refresh.
5. If verification remains unavailable, say so; do not claim `live` until actual public evidence exists. Continue retrying by diagnosing the next concrete failure, not by waiting indefinitely.

## Next development

Favor small composable changes in the shared example. Avoid duplicated code and document any change to the deployment contract here and in the root README.

## Current living-world state (2026-10-13)

- **22 authored geographic nodes** are defined by the `authored-v1` terrain operations and `landmarkSpecs` in `examples/wanderer-separated/world.js`. Names, positions, terrain operation, and marker icon are authoritative there. Quills has a feather-fan resident; Amaranthine Fields has a gardener/flowers; Mists has mist reeds. The other 19 currently have terrain and animated landmark markers but no dedicated local behavior. Do not infer canon/lore from names.
- **Wanderer fire sequence:** fire contact takes control away from user navigation (recoil → hopping panic → flight → burst → respawn). Tap-to-move and automated hearth navigation are ignored while the burn phase is not `ready`; taps resume on respawn. Fire-mode button remains functional.
- **Released Wanderer matter:** each burst creates 500 BBs: 125 red blood and 375 yellow solids. Every burst adds a new persistent 500-instance batch and particle population; respawning the Wanderer must not despawn previous matter. This is currently tracked in Wanderer-local `burnParticles`/`burnMeshes` arrays, a temporary implementation rather than the intended long-term material accounting location.
- **Frame versus ownership:** geological matter coordinates must track the moving geological world (`wanderX`/`wanderZ`) while continuing to integrate gravity and respond to terrain contact. Ownership/provenance and coordinate frame are distinct. Resting contact is physical equilibrium, **not** a fixed transform or permanent `rest` flag. If terrain support vanishes, matter must fall.
- **Contact:** Wanderer BBs have stronger normal and tangential dissipation on geological contact. Other populations' restitution was not intentionally changed. Validate slopes, repeated impacts, terrain deformation, and whether particles truly settle without sliding or tunneling.
- **Aperture:** shared `apertureClip(material)` provides per-fragment spherical visibility for fire and Wanderer BB instances; terrain retains its own shader/fog path using the shared `APERTURE_RADIUS`. Rendering outside the aperture is not a despawn or ownership event. Do not create another ad hoc radius/discard rule when adding a population; converge remaining render paths deliberately.
- **Crucible:** existing lower-hemisphere bowl contact/ownership behavior remains in place for rain, Pumpkin, and Wanderer; do not conflate a render cut with transfer. Existing ownership rules were not redesigned during this pass.
- **Outstanding:** inspect actual live execution before asserting physics/visual correctness. In particular test geological BBs when the world translates, support removal, accumulation across multiple bursts, and the aperture edge. Do not assume that source commits prove runtime behavior.
- **Initialization caution:** declare `APERTURE_RADIUS` before constructing diagnostics or materials that read it. An earlier build failed to wake due to temporal-dead-zone initialization order; fixed in `442ef3c5`.
