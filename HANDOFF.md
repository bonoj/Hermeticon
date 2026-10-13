# Wanderer handoff

## Where to work

- Authoritative standalone source: `bonoj/Hermeticon/index.html`.
- Pages workflow: `.github/workflows/pages.yml`; public URL: `https://bonoj.github.io/Hermeticon/`.
- Original JIT source: `bonoj/Repository/src/jit/hermeticon-wanderer/index.html`; **do not edit it as part of Hermeticon work**.
- Original JIT public page: `https://bonoj.github.io/jit/hermeticon-wanderer/?terrain=authored-v1`.
- Gate: `bonoj/Gate/README.md`. Read before delivery. This repo's direct Actions publication is a new route, not the old two-repository JIT route.

## Baseline

Cloned from JIT source commit `f8fd252ca4abb91f7ca7c445197944a044df2173`, including individual pumpkin micro ownership on Crucible wall contact. The initial standalone clone deliberately preserves the original monolithic HTML and source-provenance BUILD label. Do not infer that this BUILD label changes on subsequent commits.

## Important contracts

- Physical Crucible contact transfers matter ownership; mere proximity or spawning does not.
- Thump affects vessel-owned material regardless of height. Do not reintroduce spatial eligibility filters.
- Micro material and macro material must not acquire ownership merely through fracture.
- Keep terrain collision/tunneling improvements separate from ownership.
- Preserve conservation, instrumentation, phone-first controls, and deterministic/reproducible behavior where present.

## Delivery and verification

A push to `main` triggers `Publish Hermeticon`. Check the Actions run, Pages deployment, and actual public HTML before claiming live. The clone should match the JIT source byte-for-byte except for replacing `__WANDERER_SOURCE_SHA__` with the originating commit SHA.

## Future work

Gradually apply established standardized tooling without turning graduation into a physics rewrite. When modularizing, prove behavior parity first.
