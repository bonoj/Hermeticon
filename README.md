# Hermeticon

A spherical vessel for building and exploring beautiful, perturbable, composable executable worlds.

**[Enter Hermeticon](https://bonoj.github.io/Hermeticon/)**

**For a fresh Clara:** read [HANDOFF.md](HANDOFF.md) for the current world, established behavior, working rules and next investigation.

**Working contract:** [Sanctum/CONTRACT.md](https://github.com/bonoj/Sanctum/blob/main/CONTRACT.md) governs collaboration, creative agency, tool recovery, and verification.

## Structure

- `athanor/` — running host: renderer, camera, instruments and interface.
- `codex/genesis/` — the current authored world.
- [`arcana/`](arcana/README.md) — **Arcana Catalog** of reusable systems, interfaces, ownership, mounts, and accepted observation treatments.
- `examples/wanderer-separated/` — preserved independent Wanderer fixture ([handoff](examples/wanderer-separated/HANDOFF.md)).
- `archive/` — historical implementations and previous documentation ([handoffs](archive/handoffs/)).

## Current world

Genesis composes signed terrain, the Wanderer, eleven accepted botanical species plus original Mists Reeds, six experimental BB creature species, and manual Cinderfall meteors. Rapid taps create concurrent projectiles. Meteor impacts apply radial forces and release organism BBs into shared detached material, with dynamic rendering allocation rather than an arbitrary population cap.

The terrain-only observation lens **starts in HYBRID**; other modes remain available. The compact material inspector separates active organism BBs from detached BBs. See [HANDOFF.md](HANDOFF.md) for exact behavior, limitations, and verification status.

## Publishing

`main` is published through `.github/workflows/pages.yml`. Follow [Gate](https://github.com/bonoj/Gate) before changing deployment. A commit is not a verified live build; confirm the displayed public SHA.
