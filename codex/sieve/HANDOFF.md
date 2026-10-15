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

## Turn 1 — Private context transport established (2026-10-15)
- **Private repository confirmed:** `bonoj/Home` has GitHub visibility `private` and connected push permission; Hermeticon is public. The model can use connected GitHub tools to read/write Home without user copy/paste.
- **Private context entrance:** [Home Sieve README](https://github.com/bonoj/Home/blob/main/sieve/README.md) and [FRONTIER.json](https://github.com/bonoj/Home/blob/main/sieve/FRONTIER.json). GitHub links require authorized access; **do not mirror these files to public Pages**.
- **Write/read-back tested:** created both files, fetched and parsed frontier, updated its status using current blob SHA, and fetched/parsed it again. Private frontier is `transport-write-and-readback-verified`. Last private commit `a15926c2`.
- **Scope:** model↔private GitHub transport works. Browser↔private store does **not** exist; no authenticated client, automatic query API, cross-device UI sync, or model-led opportunity ingestion is implemented yet. Local Hunt browser feed remains legacy instrumentation.
- **Next:** versioned context records, fixtures, compact frontier queries, then model-led Hunt. Avoid expanding Remotive keyword filtering as core architecture.

## Turn 2/3 — Context schema and retrieval (2026-10-15)
Private Home now contains `sieve/schema/context.v1.json`, `sieve/fixtures/first-light.v1.json`, `sieve/lib/context.v1.js`, `sieve/lib/context.v1.test.js`, and updated `sieve/FRONTIER.json`. The pure context library validates records/evidence references, queries records, resolves human-over-model decisions, builds compact opportunity frontiers, and surfaces contradictory claims. Eleven assertions passed against read-back source and fixture in the model's execution environment. Home `sieve/README.md` now specifies the cold-boot route. This is **not** a browser-accessible service, authenticated sync, or complete JSON Schema validator. Next: model-researched evidence-backed live records, private indexing, and sanitized marble projection. Last private frontier commit `41ac7493`.

## Existing UI boundaries
🗑 is a navigation instrument, not the application submission action. The user primarily works from ChatGPT, not the Sieve page. Preserve existing instrument bar, FPS/build, world rendering, and 🐙 grammar. The Sieve entrance owns a native, non-recursive workspace drawer with handoff, spec, Conjoiner, and résumé links. Genesis does not contain a Sieve drawer. Do not silently move controls between entrances.

## State and verification
This handoff records repository source and intended behavior, not proof of a live browser session. At each new thread, fetch the current files and latest commits; this document may lag later changes. A GitHub write is successful only after read-back. A deploy is successful only after build identity and browser behavior are verified.

## Hunt operating correction — breadth before depth (2026-10-15)

**User correction, binding for subsequent Hunts:** The first five Hunts over-investigated Disney, Epic, and Larian, repeatedly revisited Disney requisition 10159875, and treated each ➡️ as a tiny research/write cycle. This was inefficient. **➡️ authorizes a substantial expedition**, not a single finding, commit, or incremental verification step.

### Operating order
1. **Landscape first:** survey roughly 30–50 relevant organizations per broad Hunt where research access and evidence allow. Include studios, Imagineering/research labs, simulation and procedural-world teams, experimental game studios, creative technology groups, and relevant leaders. These are discovery targets, not 30–50 verified vacancies.
2. **Find mandates and people:** map teams, principal investigators, technical/creative directors, experimental programs, and evidence of the actual work. Open jobs are one entry route, not the sole unit of discovery.
3. **Triage at shallow depth:** distinguish (a) currently confirmed official vacancies, (b) plausible roles requiring verification, (c) people/team relationship routes, and (d) interesting institutions with no established opening. Clearly label uncertainty. Reject conventional implementation-only roles even if titles sound appealing.
4. **Rank by the user's desired work:** experimental executable worlds, systemic magic, simulation, expressive agents, creative R&D, prototyping, technical invention, autonomy, and influence across design and engineering. Coding is welcome; coding **alone** is not the objective. Don't confuse conventional tool-maintenance jobs with creative systems mandates.
5. **Persist in batches:** preserve a compact source-backed shortlist, candidate graph, key reasons, uncertainty, and next actions privately. GitHub transport/read-back is necessary infrastructure, not the narrative or success criterion of a Hunt.
6. **Deepen only selectively:** investigate official requisition status, compensation, hiring chain, skills gaps, and outreach strategy for the strongest few leads or when preparing an actual application. Do not spend repeated turns resolving a single ambiguous posting while the broader landscape remains unmapped.
7. **Deliver meaningful work per ➡️:** a substantial new survey, ranked field, or several completed investigations. Stop only for material tool limits, a user decision, or a natural substantial milestone. Avoid one-commit-per-turn pacing.

### Reporting and measurement
- Report breadth (`organizations scanned`, `teams/people found`, `distinct leads`), quality (`high-fit`, `plausible`, `rejected`), source/verification status, and genuinely new discoveries. Never inflate counts with duplicates or unsupported claims.
- A Hunt is successful when it meaningfully expands the user's choices, **not** merely when a GitHub write succeeds.
- Carry forward previous outreach so we don't duplicate messages. Human controls contact and applications.
- Keep Genesis/Athanor/world implementation isolated; the Hunt changes private context and Sieve documentation only unless expressly instructed.

### Existing first-Hunt baseline and next action
Private `bonoj/Home/sieve/records/` now contains `hunt-20261015.v1.json` (9 records), `hunt-deepening-20261015.v1.json` (10), `disney-research-20261015.v1.json` (7), `disney-productization-20261015.v1.json` (4), and `disney-status-20261015.v1.json` (4). These are **records**, not 34 unique opportunities. The frontier indexed these files. Disney req 10159875 is high-fit but official active status remains unknown; do not let that unresolved question dominate the next Hunt.

**Next ➡️:** perform a broad, multi-organization ecosystem survey and produce a ranked field with people and mandates. Deepen a few standouts only after breadth. Preserve source provenance and uncertainty; don't pretend research coverage or live vacancy verification beyond what was actually checked.


## Hunt VI–IX checkpoint — 2026-10-15

The breadth-first landscape survey is **complete as a first pass**, not a future instruction. Private `bonoj/Home/sieve/records/ecosystem-survey-20261015.v1.json` contains **40 organizations**: nine initially source-anchored, 31 explicitly unverified survey targets. Follow-on primary-source validation, roles and negative-fit evidence are in:
- `sieve/records/ecosystem-validation-20261015.v1.json`
- `sieve/records/hunt-viii-20261015.json`
- `sieve/records/hunt-ix-20261015.json`

The live, model-operated GitHub storage path was exercised repeatedly. Hunt VIII initially encountered blocked writes; a later smaller batch succeeded and was read back. **A blocked write is not persisted research; do not claim it was saved until read-back.** The private `sieve/FRONTIER.json` indexes these batches (frontier commit `082e5cfa`). These files are persistent Git-backed documents, not a running transactional database, and the browser has no authenticated private-data bridge.

Current actionable leads: Gardens Interactive Technical Game Designer (Level), thatgamecompany Technical Game Designer (hiring-test caveat), Wizards Digital Ventures Creative Lead (director-level experience hurdle), Hello Games roles. Strong institution/people routes: Maxis, Universal Creative, SideFX, Wētā FX, Disney Research/Imagineering, Embark Creative Play. Riot Central Creative Services Tools is a **negative-fit** infrastructure role; don't mistake its team name for world-building work. Embark's older Narrative & AI Systems vacancy was absent from the live board; don't present it as open. Disney req 10159875 remains officially unresolved.

**Next Hunt:** map real decision-makers, experimental team mandates and credible contact routes at high-fit institutions; verify further primary sources for the remaining 31 survey targets; compare actual authority, location, barriers, and human-working environment. Do not redo the 40-name enumeration or circle one requisition. Preserve existing outreach history, especially Tom Pelini at Larian and Doug Fidaleo at Disney. Do not send contact or applications without approval.

**Integrity contract:** A research claim, a source-backed observation, a job currently listed, and a successful GitHub commit are four different assertions. Mark each separately. Store failures and corrections. No public/private context leakage; no Genesis/Athanor/world modifications.

