# Sieve — Handoff

**Cold boot:** Read [Sanctum README](https://github.com/bonoj/Sanctum/blob/main/README.md) → [Sieve README](README.md) → [Conjoiner Frontier](CONJOINER_FRONTIER.md) → [Résumé](RESUME.md) → [Initial Build Spec](INITIAL_BUILD_SPEC.md) → this handoff. Do not search Sanctum for Sieve files; Sieve lives in `bonoj/Hermeticon/codex/sieve/`.

## Mission and contract
ChatGPT is the cockpit. Sieve is the machinery that finds worthwhile work, evaluates fit, prepares verified application documents and a direct employer application link, and remembers outcomes. The user completes the employer form and submits. On returning to ChatGPT, 👁 plus evidence initiates reconciliation. Do not build a second chat cockpit or an automatic submission bot.

**Canonical identity:** Conjoiner · Cybernetic Systems Architect | Executable Worlds · Interactive Simulations · Experimental R&D. The canonical wording, anti-regression boundaries, and demonstrated evidence live in [CONJOINER_FRONTIER.md](CONJOINER_FRONTIER.md). The résumé is a transport artifact, not an identity.

## Current implementation (2026-10-15)
- [Sieve public entrance](https://bonoj.github.io/Hermeticon/sieve/) — independent world cloned from Genesis; it is **not yet the application pipeline**.
- [Hermeticon public entrance](https://bonoj.github.io/Hermeticon/) — 🗑 instrument opens Sieve in a lazy-loaded overlay. Overlay reserves title/build/FPS space above and button-bar space below. The 🐙 repository drawer links here.
- [Sieve entry HTML](../../sieve/index.html), [Sieve composer](../../sieve/compose.js), [Sieve world](world.js).
- [Hermeticon entry HTML](../../index.html), [Sieve overlay controller](../../athanor/sieve-overlay.js), [shared instrument CSS](../../athanor/interface.css).
- [Initial Build Spec](INITIAL_BUILD_SPEC.md) is the approved implementation blueprint; its pipeline is **specified, not implemented**.
- No actual job application, outcome registry, automated discovery service, or verified application-package compiler has yet been delivered. Do not imply otherwise.

## Essential working links
### Identity, scope, evidence
- [Sanctum README](https://github.com/bonoj/Sanctum/blob/main/README.md)
- [Sanctum CONTRACT](https://github.com/bonoj/Sanctum/blob/main/CONTRACT.md)
- [Sieve README](README.md)
- [Conjoiner Frontier](CONJOINER_FRONTIER.md)
- [Résumé](RESUME.md)
- [Initial Build Spec](INITIAL_BUILD_SPEC.md)
- [Hermeticon handoff](../../HANDOFF.md)
- [Hermeticon repository](https://github.com/bonoj/Hermeticon)
- [Crucible](https://github.com/bonoj/Crucible), [SixCities](https://github.com/bonoj/SixCities), [OrbitalConstruction](https://github.com/bonoj/OrbitalConstruction), [VerticalAccretion](https://github.com/bonoj/VerticalAccretion), [Foundry](https://github.com/bonoj/Foundry)

### Runtime and publication
- [Athanor host](../../athanor/athanor.js)
- [Athanor composition](../../athanor/compose.js)
- [Genesis source](../genesis/world.js)
- [Arcana catalog](../../arcana/README.md)
- [Sieve HTML](../../sieve/index.html)
- [Sieve composer](../../sieve/compose.js)
- [Sieve world](world.js)
- [Hermeticon root HTML](../../index.html)
- [Overlay controller](../../athanor/sieve-overlay.js)
- [Shared CSS](../../athanor/interface.css)
- [Pages workflow](../../.github/workflows/pages.yml)
- [GitHub Actions](https://github.com/bonoj/Hermeticon/actions/workflows/pages.yml)
- [Commits](https://github.com/bonoj/Hermeticon/commits/main/)
- [Public build identity](https://bonoj.github.io/Hermeticon/build.json)
- [Gate publication guardrails](https://github.com/bonoj/Gate/blob/main/README.md)

## Build and deployment protocol
Read source and contract before edits. Change only requested surfaces. The Pages workflow publishes on pushes to main, copies into `site/`, validates JS with `node --check`, stamps SHA onto module URLs, publishes, and checks public entries. For a runtime change, inspect Actions result, compare public `build.json` SHA with commit, and verify actual browser execution. HTTP entry checks alone do not prove the UI works. Do not assert live solely from a successful GitHub write. Never use guessed recovery URLs or force the user to clear browser cache.

## Immediate next implementation
Follow [Initial Build Spec](INITIAL_BUILD_SPEC.md): inspect existing machinery; establish verified evidence map, opportunity schema, private persistence plan and fit rubric; discover and verify real openings; generate application package with direct link and required documents; reconcile 👁 evidence; repeat without rebuilding. Keep private application history out of public Pages output.

## Existing UI boundaries
🗑 is a navigation instrument, not the application submission action. The user primarily works from ChatGPT, not the Sieve page. Preserve existing instrument bar, FPS/build, world rendering, and 🐙 grammar. The overlay currently embeds the Sieve world in an iframe; don't silently redesign it.

## State and verification
This handoff records repository source and intended behavior, not proof of a live browser session. At each new thread, fetch the current files and latest commits; this document may lag later changes. A GitHub write is successful only after read-back. A deploy is successful only after build identity and browser behavior are verified.
