# Sieve — Handoff

**Cold boot:** Read [Sanctum README](https://github.com/bonoj/Sanctum/blob/main/README.md) → [Sieve README](README.md) → [Conjoiner Frontier](CONJOINER_FRONTIER.md) → [Résumé](RESUME.md) → [Working Specification](WORKING_SPEC.md) → this handoff. Do not search Sanctum for Sieve files; Sieve lives in `bonoj/Hermeticon/codex/sieve/`.

## Mission and contract
ChatGPT is the cockpit. Sieve is the machinery that finds worthwhile work, evaluates fit, prepares verified application documents and a direct employer application link, and remembers outcomes. The user completes the employer form and submits. On returning to ChatGPT, 👁 plus evidence initiates reconciliation. Do not build a second chat cockpit or an automatic submission bot.

**Canonical identity:** Conjoiner · Cybernetic Systems Architect | Executable Worlds · Interactive Simulations · Experimental R&D. The canonical wording, anti-regression boundaries, and demonstrated evidence live in [CONJOINER_FRONTIER.md](CONJOINER_FRONTIER.md). The résumé is a transport artifact, not an identity.

## Current implementation (2026-10-15)
- [Sieve public entrance](https://bonoj.github.io/Hermeticon/sieve/) — independent world cloned from Genesis; it is **not yet the application pipeline**.
- [Hermeticon public entrance](https://bonoj.github.io/Hermeticon/) — Genesis does not own the 🗑 instrument. 🗑 belongs to the independent Sieve entrance, where it opens a native Sieve workspace drawer. The drawer reserves title/build/FPS space above and button-bar space below. Sieve's 🐙 repository drawer links here.
- [Sieve entry HTML](../../sieve/index.html), [Sieve composer](../../sieve/compose.js), [Sieve world](world.js).
- [Hermeticon entry HTML](../../index.html), [Sieve overlay controller](../../athanor/sieve-overlay.js), [shared instrument CSS](../../athanor/interface.css).
- [Working Specification](WORKING_SPEC.md) is the approved implementation blueprint; its context substrate and application pipeline are **specified, not implemented**.
- Hunt v0 is implemented as an instrumented browser-side public-feed sweep (Remotive). It is not an autonomous server-side sweep, verified official careers crawler, outcome registry, or application-package compiler. Do not imply otherwise.

## Essential working links
### Identity, scope, evidence
- [Sanctum README](https://github.com/bonoj/Sanctum/blob/main/README.md)
- [Sanctum CONTRACT](https://github.com/bonoj/Sanctum/blob/main/CONTRACT.md)
- [Sieve README](README.md)
- [Conjoiner Frontier](CONJOINER_FRONTIER.md)
- [Résumé](RESUME.md)
- [Working Specification](WORKING_SPEC.md)
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

## Hunt v0 observation loop (2026-10-15)\n- [Hunt source](../../sieve/hunt.js) is mounted in the Sieve 🗑 drawer. SWEEP PUBLIC FEED fetches Remotive public remote jobs (up to 200), normalizes and deduplicates by source ID, applies explainable heuristic signals, preserves manual passes, and records sweep failures. This feed is biased toward remote jobs and cannot establish employer-hosted application verification.\n- Candidates and bounded event history persist in the user's browser localStorage (`sieve.hunt.v1`), **not GitHub and not across devices**. EXPORT JSON downloads the state; COPY 👁 REPORT copies a bounded diagnostic report for the user to bring back to ChatGPT. If clipboard is unavailable, report text is selectable in a textarea.\n- Instrumented fields: source URL, retrieval time, source publication, title/company/location, signals, classification, uncertainty, dedup counts, last sweep result and error, last 20 events. Never present source links as verified employer applications.\n- Correction loop: user sends 👁 report; inspect false positives, misses, errors, source behavior; update heuristics or source machinery; preserve observations. A model does not autonomously retrain.\n- First live sweep and browser interaction have **not** been verified by this repository write. Public Pages workflow validates JavaScript syntax and entry availability, not CORS or successful third-party API calls.\n\n## Architectural correction (2026-10-15)
Clara is the hunter; the runtime is Clara's external context, evidence graph, working memory, and instrumentation. The Remotive keyword sweep is a first-light transport prototype, **not** the long-term Hunt architecture. Prioritize a private, model-readable/writable context store and frontier retrieval over expanding browser feeds. The canonical plan is [Working Specification](WORKING_SPEC.md). No model-accessible persistent context API exists yet.

## Immediate next implementation
Follow [Working Specification](WORKING_SPEC.md): first inspect real connector permissions and establish a private model-accessible read/write context path; then schema, frontier retrieval, model-led discovery, judgment, marbles, Forge, and 👁 reconciliation. Do not build a browser-only hunting engine. Keep private application history out of public Pages output.

## Existing UI boundaries
🗑 is a navigation instrument, not the application submission action. The user primarily works from ChatGPT, not the Sieve page. Preserve existing instrument bar, FPS/build, world rendering, and 🐙 grammar. The Sieve entrance owns a native, non-recursive workspace drawer with handoff, spec, Conjoiner, and résumé links. Genesis does not contain a Sieve drawer. Do not silently move controls between entrances.

## State and verification
This handoff records repository source and intended behavior, not proof of a live browser session. At each new thread, fetch the current files and latest commits; this document may lag later changes. A GitHub write is successful only after read-back. A deploy is successful only after build identity and browser behavior are verified.
