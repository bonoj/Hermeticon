# Hermeticon

A spherical vessel for building and exploring beautiful, perturbable, composable executable worlds.

**[Enter Hermeticon](https://bonoj.github.io/Hermeticon/)**

**For a fresh Clara:** read [HANDOFF.md](HANDOFF.md) for the current world, established behavior, working rules and next investigation.

**Working contract:** [Sanctum/CONTRACT.md](https://github.com/bonoj/Sanctum/blob/main/CONTRACT.md) governs collaboration, creative agency, tool recovery, and verification.

## Structure

- `athanor/` — running host: renderer, camera, instruments and interface.
- `codex/genesis/` — the current authored world.
- `arcana/` — reusable world systems and instruments.
- `examples/wanderer-separated/` — preserved independent Wanderer fixture ([handoff](examples/wanderer-separated/HANDOFF.md)).
- `archive/` — historical implementations and previous documentation ([handoffs](archive/handoffs/)).

## Publishing

`main` is published through `.github/workflows/pages.yml`. Follow [Gate](https://github.com/bonoj/Gate) before changing deployment. A commit is not a verified live build; confirm the displayed public SHA.
