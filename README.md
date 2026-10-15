# Hermeticon

A spherical vessel for building and exploring beautiful, perturbable, composable executable worlds.

**[Enter Hermeticon](https://bonoj.github.io/Hermeticon/)** · **[Enter Sieve](https://bonoj.github.io/Hermeticon/sieve/)**

**Sieve working entry:** [codex/sieve/README.md](codex/sieve/README.md) — start with the Conjoiner contract and résumé chronology.

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

## Current nested vessels (2026-10-15)

Genesis includes Abiogenesis (scale 0.12, outer radius 1.23) and Wanderer (scale 0.06, outer radius 0.615). Abiogenesis passively captures BBs entering its cavity; tapping its visible shell directs eligible loose BBs below Genesis y=0 toward it once. Wanderer navigates terrain and pulses once per second, selecting terrain-owned, near-surface detached BBs inside a horizontal 1.23-radius footprint and launching them toward its cavity. Captures transfer ownership without creating or deleting BBs. Both have expanded vertical stationkeeping; see [current handoff](HANDOFF.md) and [Abiogenesis contract](codex/genesis/ABIOGENESIS.md). Live material accounting has been observed; expanded hover clearance is not yet visually verified.

## GitHub access and material instrument direction

The bottom 🐙 drawer links, in order, to **Handoff**, **Commits**, and **Pipeline**. The existing SHA is a noninteractive build readout. The author accepts the present state; avoid unnecessary UI changes. A possible future experiment is a BB-based GitHub deployment-status organism (green/yellow/red/unknown, with motion) whose provenance is inspectable; **not implemented**. See [handoff](HANDOFF.md).
