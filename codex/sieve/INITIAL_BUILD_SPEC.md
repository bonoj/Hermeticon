# Sieve — Initial Build Specification

## Mission
ChatGPT is the cockpit; Sieve is the machinery. Find high-fit jobs, evaluate actual autonomy and creative systems scope, prepare truthful application documents, hand off verified application links, and reconcile outcomes when the user returns with 👁.

## Canonical workflow
1. Discover current openings and deduplicate by employer requisition or canonical URL.
2. Qualify by systems authorship, experimental world-building, simulation/R&D relevance, autonomy, resources, and actual mandate. Record unknowns and reject conventional maintenance-only roles.
3. Verify official posting, direct apply link, document requirements, and supported prepopulation method. Never claim a form is prefilled without verification.
4. Assemble posting-specific résumé PDF, optional DOCX, cover letter only when useful or required, and a short evidence sheet when relevant. Preserve the canonical headline and factual chronology from CONJOINER_FRONTIER.md and RESUME.md.
5. In ChatGPT provide one concise opportunity assessment, direct application URL, generated file links, and known manual steps.
6. User opens the employer form, completes it, uploads supplied documents, and submits personally.
7. User returns in ChatGPT with 👁 and evidence; assistant records observed status and follow-up. 👁 is a convention, not a new interface.

## Architecture
- Evidence registry: verified claims, links, and selected executable systems mapped to relevant domains.
- Opportunity registry: stable ID, employer, role, location, arrangement, salary if published, sources, retrieval time, official apply URL, requirements, assessment, uncertainty, and status.
- Qualification template: pursue/investigate/pass with concise decisive evidence; no fabricated fit score.
- Package compiler: reusable résumé and evidence material; per-posting manifest and versioned generated documents.
- Outcome ledger: append-only dated events and evidence references, with statuses discovered, qualified, prepared, opened, user-reported submitted, confirmed submitted, rejected, expired, skipped.
- Recovery: re-read before writes, reconcile GitHub conflicts, verify commits and generated files, deduplicate submissions, never overwrite later status with older observations.

## Privacy and boundaries
Preserve existing Sieve UI and runtime. Do not create another chat interface, dashboard, application bot, or automatic submission process. Store personal application history privately; inspect repository and deployment visibility before writing records. No credentials, cookies, private form responses, or personal screenshots in public site assets. User approves and performs every submission. Do not invent answers to eligibility, legal, or compensation questions.

## Build sequence
1. Inspect existing Sieve source, repo visibility, and current GitHub workflows.
2. Create evidence index, opportunity schema, qualification template, and private persistence plan.
3. Run one real discovery and validate official posting details.
4. On selection, generate and visually inspect required documents and verify links.
5. Receive 👁 outcome, reconcile evidence, and verify durable record.
6. Repeat for a second role without re-collecting canonical identity or duplicating records.

## Acceptance criteria
- Cold boot follows Sanctum README to Sieve README, Conjoiner contract, and résumé.
- All opportunity facts and apply links are grounded and current, with unknowns explicit.
- Documents are factual, readable, and accessible from ChatGPT.
- The entire interaction requires only ChatGPT and the employer's external application form.
- User submits; assistant never claims submission based solely on link opening.
- 👁 evidence updates durable state without duplicate or contradictory events.
- Personal data is not published through Hermeticon Pages.
- Existing Sieve runtime, UI, and deployment machinery remain unchanged.

## Definition of done
One real opportunity completes discovery, qualification, package preparation, user submission, and 👁 reconciliation; a second repeats reliably. This file is a specification only, not implementation authorization.


---

# Hunt — Construction Record and Executable Roadmap
**Recorded 2026-10-15.** This section describes the implemented Hunt v0, its observed-by-source limitations, and an ordered roadmap. It does not claim that browser execution or remote API access has been validated. "Turn" means a discrete engineering iteration with explicit acceptance criteria, not an automatic promise to complete without review.

## A. Source of truth and ownership
- Runtime entrance: [sieve/index.html](../../sieve/index.html), specifically the native \`#sieveOverlay\` drawer opened by \`#sieveToggle\` (🗑), containing \`#sieveWorkspace\` and \`#huntRoot\`. The script \`./hunt.js\` loads after the inline drawer controller and before \`./compose.js\`.
- Implementation: [sieve/hunt.js](../../sieve/hunt.js), an immediately invoked strict-mode script. It operates on DOM, fetch, localStorage, Clipboard, and Blob APIs; it does **not** depend on Three.js, mutate the cloned world, or install a separate chat UI.
- Presentation: [athanor/interface.css](../../athanor/interface.css), selectors under \`#huntRoot\` with the established dark-blue/brass grammar. Native drawer geometry protects the title/build/FPS and bottom instruments.
- World composition: [sieve/compose.js](../../sieve/compose.js) mounts [codex/sieve/world.js](world.js) into shared Athanor. Hunt is a UI instrument alongside the existing world, not a replacement for its simulation.
- Publishing: [.github/workflows/pages.yml](../../.github/workflows/pages.yml). Pushes to main trigger GitHub Pages publication; workflow assembles \`site/\`, checks JS syntax, stamps relative JS dependencies, and polls public entry URLs. **A successful entry HTTP response does not validate Hunt's third-party fetch, clipboard, DOM behavior, or localStorage.**
- Contract: [CONJOINER_FRONTIER.md](CONJOINER_FRONTIER.md), [RESUME.md](RESUME.md), [HANDOFF.md](HANDOFF.md), [Sanctum contract](https://github.com/bonoj/Sanctum/blob/main/CONTRACT.md). Preserve identity and scope; never invent a second cockpit or turn Sieve into an ATS.
- Initial commits: Hunt engine \`bda14079\`; entrance wiring \`032fa138\`; mobile styles \`ed80146c\`; handoff update \`dbaf8594\`. Consult latest commits before relying on these as current.

## B. Runtime construction, precisely as implemented

### B1. Bootstrap and state
On script evaluation, \`document.getElementById('huntRoot')\` is queried. Missing root causes an immediate, silent return. The persistent key is \`sieve.hunt.v1\`; schema version is integer \`1\`. Initial state is \`{version:1,events:[],candidates:{},lastSweep:null}\`. The script attempts \`JSON.parse(localStorage.getItem(KEY))\`; it accepts a saved state only when the version matches, events is an array, and candidates is an object. Invalid/missing/unreadable storage falls back to initial state. It does not migrate versions. An in-memory \`busy\` flag prevents overlapping sweeps within a page instance. A single initial \`render()\` draws the UI.

### B2. Feed and transport
\`SOURCE\` is \`{id:'remotive',label:'Remotive public jobs API',url:'https://remotive.com/api/remote-jobs?limit=200'}\`. The only v0 source is a public **remote-jobs** feed, which is structurally biased against the user's preferred on-site/hybrid opportunities. The URL is fetched **only when SWEEP PUBLIC FEED is pressed**, with \`{cache:'no-store',signal:AbortSignal.timeout(14000)}\`. A non-2xx response throws \`HTTP <status>\`; an absent/non-array \`data.jobs\` throws \`Unexpected feed schema\`. Browser CORS, rate limits, schema drift, connectivity, and browser support for AbortSignal.timeout remain unverified. This is not a scheduled sweep, server-side crawler, or employer-careers index.

### B3. Normalization and provenance
\`clean(value)\` stringifies, removes HTML-looking tags with a regex, collapses whitespace, and trims. This is a crude plain-text transform, **not** a general-purpose HTML sanitizer/parser. \`url(value)\` accepts parseable HTTP(S) URLs and otherwise returns null. Each feed job must have truthy \`id\`, nonempty normalized \`title\` and \`company_name\`, and a valid \`url\`. Rejected jobs increment the rejected counter. \`idFor(source,external)\` builds \`source + ':' + String(external).slice(0,180)\`; it is **source-local**, not cross-source or requisition-level deduplication. A candidate contains:
- \`id\`, \`source\`, \`sourceLabel\`, \`title\`, \`company\`, \`location\`;
- \`arrangement:'remote (source category)'\` (a category label, **not** verified job arrangement);
- \`description\` (normalized, truncated to 4,000 characters);
- \`sourceUrl\`, \`officialApplyUrl:null\`, \`officialVerified:false\`;
- \`sourceObservedAt\` (ISO timestamp), \`publication\` (raw normalized source publication date), \`status:'discovered'\`;
- \`decision\`, \`signals\`, \`employers\`, \`uncertainties\` from classification.

Source URLs are displayed as **SOURCE POSTING ↗**, never as verified official application links. No employer-hosted verification is performed.

### B4. Classification rules
\`classify(c)\` lowercases \`title + company + description\` and tests 11 literal substrings: \`simulation\`, \`procedural\`, \`research\`, \`world\`, \`creative\`, \`interactive\`, \`game\`, \`technical director\`, \`r&d\`, \`tools\`, \`systems\`. It also checks company names against 15 target substrings: Disney, Lucasfilm, Industrial Light, Weta, Wētā, Larian, Epic Games, Valve, Riot, Hello Games, Supergiant, Wizards of the Coast, Sony, NASA, JPL. The hard-exclusion title regex matches \`customer support|sales development|account executive|wordpress|full.stack developer|react developer|data entry\`. Priority: excluded title → \`pass\`; target employer **or** at least 3 term hits → \`investigate\`; otherwise → \`unreviewed\`. All candidates receive the same three uncertainty strings: official employer requisition/link unverified; creative authority/autonomy unverified; work arrangement may not fit. No probabilistic model, semantic search, calibrated fit score, location filter, or explicit job-authority judgment is implemented. Substring hits may be irrelevant (e.g., text boilerplate), and a target employer does not prove the role fits.

### B5. Deduplication and mutable state
The sweep iterates \`data.jobs\`, normalizes each job, then looks up \`state.candidates[c.id]\`. New IDs increment \`accepted\`; existing IDs increment \`duplicates\`. Existing manual \`pass\` decisions are retained; otherwise classification is recomputed from the latest description. Existing \`status\` is retained. Candidates are replaced at the same ID, updating observation timestamp and other source fields. Missing-from-feed candidates are **not** marked expired. There is no cross-source matching, tombstone, job-change diff, application-event reconciliation, or protection against an outdated feed overwriting newer evidence beyond preserving \`pass\` and \`status\`.

### B6. Event and persistence instrumentation
\`emit(type,details)\` appends \`{at:ISO,type,...details}\`, trims to the last **500 events**, and calls \`persist()\`. \`persist()\` writes the entire state as JSON to \`localStorage\`. A failed write sets \`root.dataset.persistence='failed'\` and logs a console warning; no external backup or cross-device sync exists. Sweep emits \`sweep-start\`, then \`sweep-complete\` with the last-sweep counters or \`sweep-error\` with the error and source URL. The sweep records \`lastSweep={at,result:'ok',received,accepted,duplicates,rejected}\` or \`{at,result:'failed',error,source}\`. Clicking PASS changes that candidate's \`decision\` and emits \`manual-decision\`. Copy success emits \`report-copied\`; clipboard failure emits \`clipboard-unavailable\`. Note that a successful sweep updates the candidates in memory, but only the event emission writes them to storage.

### B7. UI and evidence affordances
\`render()\` replaces all \`#huntRoot\` children and rebuilds the instrument:
1. Header \`HUNT · INSTRUMENT\` and \`SWEEP PUBLIC FEED\` button (disabled while busy).
2. Summary: total observed candidates, investigate/pass/unreviewed counts, last sweep timestamp/result, and explicit feed caveat.
3. \`COPY 👁 REPORT\` and \`EXPORT JSON\`.
4. Collapsible \`INSTRUMENTATION · provenance and failure log\` containing schema, storage state, source descriptor, literal filter lists, last sweep, and **last 20 events**.
5. Candidate cards for at most **25** \`investigate\` records, sorted descending by \`sourceObservedAt\`; title, company, location, term signals, unverified caveat, source posting link, and PASS control.

\`EXPORT JSON\` creates a downloadable \`sieve-hunt-observation.json\` containing the **entire local state**, using Blob/object URL and a synthetic anchor click, revoking the URL after one second. It is a manual user export, not a repository write.

\`COPY 👁 REPORT\` serializes a smaller diagnostic object with instrument/schema/time/source, last sweep, counts, **first 20 investigate candidates in insertion order** (not the 25-card sort), and **last 15 events**. Each reported candidate includes id, title, company, location, source URL, signals, uncertainties, and officialVerified. It calls \`navigator.clipboard.writeText\`; if unavailable/rejected, appends a selectable textarea with the report and emits an error event. No automatic transmission to ChatGPT occurs. The user carries 👁 manually. Browser clipboard permissions and fallback ergonomics are unverified.

### B8. Security, privacy, and truth constraints
The script sets text via \`textContent\`, not interpolated \`innerHTML\`; external anchors require normalized HTTP(S) URLs and use \`target='_blank'\` and \`rel='noopener noreferrer'\`. It fetches a public feed without credentials. The local state contains public posting details and user-created pass decisions, **not** application responses, credentials, private screenshots, or submitted forms. Nevertheless, browser localStorage is not a secure vault and may be deleted; avoid placing sensitive personal application records in it. The deployed repository and Pages output are public. An exported JSON file is user-controlled; do not silently upload it to public GitHub. The runtime does not apply to jobs or attest submission.

## C. Known limitations and failure modes — not hidden
| ID | Failure / limitation | How it manifests | Instrumented now? | Next remedy |
|---|---|---|---|---|
| H-01 | Remote-only feed poorly represents creative studio R&D | Very few relevant opportunities despite valid sweep | Counts and source label, yes | Multiple official sources and explicit hybrid/on-site discovery |
| H-02 | CORS, network failure, timeout, rate limit | \`lastSweep.result='failed'\` with error | Yes | Test actual browser, then lawful alternate source/transport |
| H-03 | No employer-hosted application verification | Source link could redirect or be stale | Explicit \`officialVerified:false\` | Verification state machine with evidence |
| H-04 | Substring classification produces false positives/negatives | Generic jobs flagged; specialized titles missed | Term signals, yes | Auditable rules, manual correction, negative examples |
| H-05 | Source-local IDs only | Same requisition from multiple feeds duplicates | Duplicate counts only for same ID | Canonical requisition identity and merge provenance |
| H-06 | Candidates never expire | Closed jobs remain displayed | No | Revisit timestamps, closure checks, tombstones |
| H-07 | State only in localStorage | Lost on browser reset/device change | Storage failure flag only | Explicit export/import and approved private persistence |
| H-08 | No durable rejection rationale | PASS remembers only decision | Manual event includes ID, not reason | Reasoned decisions and append-only revisions |
| H-09 | Candidate list capped at 25; report at 20 | Good leads hidden by ordering | Summary count only | Search/filter/pagination with full export |
| H-10 | No active cross-session model observation | Model cannot see localStorage until user sends 👁 | Copy/export provided | Deterministic report handoff and evidence reconciliation |
| H-11 | Cached scripts and asset versioning | Old Hunt logic despite new page | No runtime hash in Hunt | Stamp entry asset URLs; verify deployed SHA and browser build |
| H-12 | Render replaces entire subtree | Open instrumentation collapses after state changes | No | Preserve focus, expanded state and scroll |
| H-13 | Raw HTML stripping and 4k description truncation | Context loss or misleading token hits | No | Structured parsing and source-text provenance |
| H-14 | No source-level freshness guarantee | Stale or incomplete feed accepted | Observed timestamp only | Distinguish publication, retrieval, last-confirmed-active |
| H-15 | No automated test fixtures for Hunt | Syntax passes but behavior breaks | Pipeline syntax only | Unit/DOM/contract and failure-path tests |
| H-16 | No user-owned preference adaptation | Repeated irrelevant results beyond manual PASS | PASS only | Feedback categories and explainable rule revisions |

## D. Roadmap — next 12 engineering turns
**Roadmap is a stub with detailed construction targets, not a claim of implemented functionality.** Reorder in response to 👁 evidence. Do not proceed blindly after a failed turn. Every turn must include source read-back, a reproducible observation, and a handoff update when behavior changes.

### Turn 1 — 👁 First-light verification and transport repair
**Input:** User's first SWEEP PUBLIC FEED result, copied report or screenshot, actual Sieve build SHA, and browser symptom if any. **Build:** Confirm 🗑 opens, sweep button responds, remote feed is reachable under Android Chrome CORS rules, success and failure paths render, copy/export work, and layout does not cover title/FPS or bottom instruments. Reproduce failures with minimal deterministic fixtures; fix only observed faults. If Remotive cannot be fetched directly, inspect its access terms and use an authorized alternative; do not invent a proxy or claim access. **Instrument:** transport phase timings, HTTP status when available, response schema version/shape, timeout vs CORS/network distinction where possible, render state and build SHA. **Exit:** one successful real feed sweep or a clearly diagnosed transport failure with a viable replacement, plus reproducible negative-path tests.

### Turn 2 — Durable observation contract and deterministic fixtures
**Build:** Define versioned Hunt observation schema, stable candidate/event IDs, clock normalization, fixture feeds covering empty result, duplicate IDs, malformed job, HTML description, network failure, timeout, and state migration. Create a test runner suitable for the existing repo rather than a heavyweight new framework. Separate pure normalization/classification from DOM/fetch where practical. **Instrument:** invariant failures, fixture outcomes, source-specific acceptance/rejection counters, current build identity. **Exit:** tests fail on known regressions and pass on supported behavior; no false "success" from an empty response.

### Turn 3 — Discovery beyond a remote-only feed
**Build:** Source adapter interface with explicit source identity, provenance, access method, refresh cadence, schema mapping, and limitations. Add verified official employer-careers discovery for relevant studios/labs, or a lawful browser-assisted/manual research intake if programmatic feeds are unavailable. Include on-site/hybrid and nonstandard role titles. **Instrument:** per-source latency, yield, overlap, freshness, failures, and unknown coverage. **Exit:** at least two independently evidenced discovery paths; no fabricated source coverage or automated scraping claims.

### Turn 4 — Identity and deduplication across sources
**Build:** Stable opportunity key preferring employer requisition ID, then canonical employer-hosted URL, then a documented provisional fingerprint. Retain all source sightings rather than overwriting provenance. Detect canonical redirects and likely duplicates without silently merging ambiguous roles. **Instrument:** merge decisions, collision evidence, conflict flags, source history. **Exit:** same requisition from two sources becomes one marble with two citations; distinct requisitions remain distinct.

### Turn 5 — Judgment v1: actual mandate, not keyword density
**Build:** Qualification evidence fields for creative authorship, experimental systems ownership, autonomy, team mandate, resources, compensation (only if published), geography/arrangement, and relevance to executable worlds. Classify \`pursue / investigate / pass\` with explicit evidence and unknowns; preserve a user's overrides. Incorporate anti-patterns for ordinary implementation/maintenance jobs without rejecting genuinely creative engineering. **Instrument:** why each judgment was made, false-positive/false-negative examples, changed decisions. **Exit:** a reviewer can reconstruct every judgment from cited source evidence.

### Turn 6 — Marble presentation and interaction
**Build:** Replace raw candidate cards with compact inspectable opportunity marbles inside the existing Sieve drawer/world grammar. Reveal title, employer, meaningful hook, provenance, unknowns, current decision, and next action on tap; avoid occlusion, tiny controls, long-press, or an ATS-like dashboard. Provide keyboard/touch accessibility. **Instrument:** selection state, card identity, empty/error states, no accidental tap-through to the world. **Exit:** user can flick through meaningful prospects without losing build/FPS or button access.

### Turn 7 — Employer verification and direct application links
**Build:** Separate discovered source link from employer-hosted requisition and actual application endpoint. Record redirect chain, verification timestamp, posting state, document requirements, and manual steps. Handle external ATS providers as official only when linked by employer evidence. Do not claim a form is prefilled without actual confirmation. **Instrument:** verification attempts, uncertainty, stale/closed status, source discrepancies. **Exit:** at least one real opportunity has a verified direct application route; unsupported cases remain clearly marked.

### Turn 8 — Evidence registry and relevance mapping
**Build:** Index canonical Conjoiner achievements and live executable artifacts (Hermeticon, Crucible, SixCities, OrbitalConstruction, Foundry, VerticalAccretion), with factual claims, exact links, proof artifacts, and appropriate audience framing. Map opportunity requirements to evidence without changing the professional identity or manufacturing accomplishments. **Instrument:** claim provenance, broken links, unsubstantiated mappings. **Exit:** every claim selected for an application has an inspectable source.

### Turn 9 — Forge: application package compiler
**Build:** Posting-specific résumé PDF and optional DOCX, concise supporting evidence sheet, and cover letter only when useful/required. Preserve canonical chronology and headline. Use the available document/PDF tooling; verify rendered pages and link targets. Keep personal data outside public Pages assets. **Instrument:** package manifest, version, source requisition, claim-to-evidence map, render/validation status. **Exit:** one real opportunity has an accurate, usable package and direct application link.

### Turn 10 — Private outcome ledger and 👁 reconciliation
**Build:** Append-only observation events for discovered, qualified, prepared, opened, user-reported submitted, confirmed submitted, rejected, expired, skipped. Distinguish reported submission from independently confirmed submission. Plan a private storage destination and explicit access before persisting sensitive application history. Resolve conflicts without overwriting newer evidence. **Instrument:** actor, timestamp, evidence source, transition rationale, contradictory observations. **Exit:** a user-supplied 👁 updates the correct opportunity without duplicate submission claims.

### Turn 11 — Feedback-directed hunting
**Build:** Use observed passes, pursued roles, missing authority, broken links, and actual application outcomes to revise source priorities and explainable classification rules. Maintain a regression set so a correction does not erase earlier learning. Do not claim autonomous model retraining; this is external evidence-guided adaptation. **Instrument:** before/after decisions, precision-oriented review samples, changed-source yield, false positive examples. **Exit:** a concrete 👁 observation demonstrably changes the next sweep's behavior.

### Turn 12 — Repeatability, scheduling option, and cold boot
**Build:** Run a second complete opportunity cycle without re-entering identity or duplicating records; validate cold boot through Sanctum → Sieve README → Conjoiner → Résumé → spec → handoff. Evaluate whether scheduled monitoring would genuinely help and only enable it on user instruction. Audit private/public boundaries, deployment, stale caches, failure recovery, and mobile performance. **Instrument:** end-to-end trace, regression results, SHA/deployment identity, unresolved limitations. **Exit:** two independently reproducible opportunity cycles, one verified application handoff, and documented remaining gaps.

## E. Non-negotiable acceptance gates across turns
1. **Truth:** A discovered posting is not a verified employer requisition. A clicked apply link is not a submitted application. Unknown compensation, mandate, or location stays unknown.
2. **Provenance:** Preserve where/when evidence was observed and distinguish raw source claims from model inference and user decision.
3. **Correction:** Never hide errors as zero results; show failures and retain enough instrumentation for 👁 to diagnose them.
4. **Privacy:** No personal applications, credentials, private form data, or sensitive outcome history in public GitHub Pages.
5. **Continuity:** Existing Sieve entrance, world, 🗑/🐙/👁 controls, mobile button bar, and build/FPS must remain usable.
6. **Reliability:** Read before writing; verify GitHub write by read-back; verify Pages build SHA and browser behavior before declaring live.
7. **Human authority:** ChatGPT is the cockpit; the user selects, approves, and submits applications. No second chat UI and no autonomous application submission.
8. **Iteration:** The next engineering turn starts from the most recent actual 👁 observation, not an assumption that earlier behavior succeeded.
