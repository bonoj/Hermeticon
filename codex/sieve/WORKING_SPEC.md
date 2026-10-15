# Sieve — Working Specification

**Status:** living contract and implementation plan · **Revised:** 2026-10-15  
**Owner:** Conjoiner partnership; ChatGPT is the cockpit, Sieve is the external context machinery.  
**Canonical identity:** **Conjoiner · Cybernetic Systems Architect | Executable Worlds · Interactive Simulations · Experimental R&D**. See [CONJOINER_FRONTIER.md](CONJOINER_FRONTIER.md) and [RESUME.md](RESUME.md).

## 1. Mission and architectural correction

**Clara hunts. Sieve remembers, organizes, instruments, and exposes her work.** The model uses its research capabilities to discover real openings, investigate people and organizations, evaluate mandates, verify sources, and prepare outreach and applications. The runtime is **not** a substitute recruiter, browser-side search engine, keyword classifier, or independent conversational agent. Its purpose is to externalize context so that the model can read, query, update, reconcile, and reuse its own working knowledge across turns and sessions.

**Correction from first-light 👁:** A Remotive browser sweep returned 14 jobs and surfaced a Senior Shopify Developer based on generic keywords. Transport worked; discovery and qualification architecture did not fit the mission. The keyword filter and its subsequent patch are **historical prototypes**, not the design center. Do not extend them into an elaborate autonomous browser job-hunter. Retain the observation as evidence and a regression fixture.

**Working division of labor:**
- **Model / research tools:** Hunt, investigate, qualify, synthesize, verify, compose, reconsider. Use the best available live research and connector tools; report when tools cannot access a source. Do not pretend the runtime can invoke ChatGPT reasoning by itself.
- **Sieve context runtime:** Store and serve structured opportunities, people, institutions, source observations, working hypotheses, links, evidence, decisions, questions, events, and next actions. Provide deterministic indexing, diffing, deduplication, integrity checks, retrieval, and visible instruments.
- **Human:** Sets direction, chooses marbles, approves outreach and applications, submits applications, and returns 👁 evidence. Human corrections are authoritative observations, not data to be overridden by heuristics.
- **👁:** Readable diagnostic/evidence channel that allows the model to inspect what the runtime actually knows and did, including failures, not just pretty results.

### Non-goals
No second chat cockpit; no ATS imitation; no unsolicited automated applications; no fabricated official requisitions; no model pretending to be an autonomous background agent; no inference that localStorage is shared model memory; no requirement to use a narrow feed when the model can research more effectively.

## 2. The context substrate — first-class product

The runtime's **primary output is structured, retrievable context**, not a list of search results. Every marble is a view of a persistent graph of evidence and work.

### 2.1 Core records

**Entity:** \`entity_id\`, \`kind\` (person | organization | team | project | opportunity), canonical name, aliases, links, relationship IDs, creation/update times. Avoid conflating people, organizations, and requisitions.

**Opportunity:** stable ID, organization/team/role, official requisition ID when verified, canonical posting and apply URLs separately, arrangement/location/compensation only when sourced, mandate, relevance, uncertainties, status, related people/projects, evidence IDs, next action, last checked, closure status. Open requisitions and speculative relationship-building targets are different opportunity kinds; do not imply an unadvertised position is open.

**Source observation:** immutable ID, observed UTC time, source URL/provider, retrieval method, exact cited excerpt or factual paraphrase, content hash when feasible, source publication timestamp if available, what was directly observed, and access/verification status. Model conclusions refer to observations; they do not replace them.

**Claim / inference:** subject, predicate, value, evidence IDs, model interpretation, confidence expressed qualitatively with reason, open questions, supersession links, last-reviewed timestamp. Mark unknowns explicitly. Do not manufacture numerical fit scores.

**Relationship:** typed edge connecting entities and claims (works-at, leads, collaborated-with, builds, relevant-to, requisition-for, introduced-by), with provenance and verification status. An inferred relationship is not a confirmed personal connection.

**Decision:** pursue | investigate | defer | pass, actor, timestamp, rationale, cited evidence, supersedes previous decision. Keep human judgments distinct from model recommendations.

**Action / outcome:** action ID, target, owner, state, evidence, time, next check, and result. Submission states must distinguish prepared, link-opened, user-reported submitted, independently confirmed submitted, rejected, expired, and skipped. Never treat an opened URL as submission.

**Context bundle / frontier:** compact task-focused retrieval result containing the current goal, relevant records, high-signal evidence, conflicts, recent decisions, unknowns, and next actions. This is what the model consumes at the start of a new turn; it is not a wholesale dump of every record.

### 2.2 Identity, merge, and history rules

Prefer official requisition ID + employer, then verified canonical employer URL, then a provisional source-scoped ID. Preserve multiple source sightings and redirect histories. Do not silently merge ambiguous people or jobs. Use append-only observation/decision events and materialized current views. Distinguish \`first_seen\`, \`last_seen\`, \`last_verified_active\`, \`published_at\`, and \`closed_at\`; absence from one feed is not proof of closure.

Corrections supersede earlier interpretations while retaining their evidence and the reason for revision. Never let a new scrape overwrite a human pass, a confirmed application, or a newer authoritative observation. Deduplication must be explainable and reversible.

### 2.3 Retrieval and context management

Implement deterministic queries by entity, organization, relationship, source, decision, status, age, next action, and text; retrieve small, ranked **working sets** relevant to the model's current task. Support "what changed since last hunt?", "why did we pass?", "who might understand Hermeticon?", "which claims are unverified?", and "what can I safely do next?" Provide provenance with every answer. The runtime may compact repetitive material into derived summaries **only** when raw observations and links remain accessible. Never silently discard contradictions or unresolved tasks.

**Critical capability requirement:** the model must be able to **read and write** the context through tools accessible from ChatGPT, not merely through a browser's localStorage. A public static site cannot, by itself, offer a private authenticated writable store. Before implementing persistence, inspect actual available GitHub/Drive/private-repo/connector interfaces and authorization. Choose the smallest workable private backend; document access and failure modes. If tool-accessible private persistence is unavailable, use explicit import/export as a labeled interim bridge, not as a claimed seamless memory system.

### 2.4 Public versus private

Public, publishable: non-sensitive organizations, job links, public source citations, general architecture, sanitized example marbles. Private: personal outreach, application state, notes, contact details, private documents, outcomes, user preferences, and any sensitive observations. No secrets or private records in Hermeticon Pages, publicly readable repo paths, URL query parameters, or diagnostics. Do not assume a private repo is safe for browser-side unauthenticated writes. No credentials embedded in client JavaScript.

## 3. Operating loop

1. **Orient:** Read Sanctum → Sieve README → Conjoiner → résumé → this specification → handoff; then fetch the **current frontier bundle**, not all history.
2. **Hunt with model tools:** Search broadly by mandate and work, not just titles. Include creative technology, experimental R&D, systemic world-building, simulation, interactive systems, tools architecture, studios, research teams, and relevant people. Prefer real employer evidence and inspect whether a requisition is current.
3. **Record evidence:** Persist normalized entities, opportunities, sources, and uncertainties via the runtime's model-accessible write path. Every write returns an ID, version, and read-back proof.
4. **Reason:** Compare actual mandate, authorship, autonomy, creative scope, resources, location, and compensation if published. Preserve evidence/inference/unknown distinctions. Reject conventional coding-only work without diminishing the user's willingness to implement meaningful systems.
5. **Present marbles:** Compact, inspectable opportunities with clear why, source provenance, uncertainty, and next action. User flicks/selects; runtime records choices and model sees them.
6. **Forge on selection:** Verify official employer application route; generate factual résumé PDF/optional DOCX/evidence sheet/cover note when useful; inspect files. User submits personally.
7. **Reconcile 👁:** Compare runtime state with new observation; append correction/outcome; update working frontier; show changed conclusions and next actions.
8. **Resume:** In a later conversation, query the frontier and continue without making the user reconstruct prior context.

**No background execution by implication.** Scheduling or monitoring requires an actual enabled automation or supported service and user approval.

## 4. Runtime instrument contract

The runtime should show **what the model knows and why**, not claim to replace its research.

**👁 report, versioned:** build SHA, schema, storage backend and access state, current frontier, selected marble, record counts, last successful model write/read, event IDs, failed operations, conflicts, source ages, pending verifications, decisions revised since previous report, and minimal redacted provenance. Report must distinguish runtime-observed facts from model-provided assertions. User can copy/export safely; report should avoid private fields by default.

**Core operations, with honest capability boundaries:** \`upsertObservation\`, \`upsertEntity\`, \`linkEntities\`, \`proposeClaim\`, \`recordDecision\`, \`recordOutcome\`, \`queryContext\`, \`getFrontier\`, \`diffSince\`, \`inspectIntegrity\`, \`exportRedactedEye\`. These are **target interfaces**, not currently implemented APIs. Every mutation is idempotent, version-aware, validated, auditable, and followed by read-back. Expose errors, storage conflicts, unauthorized writes, schema mismatches, and stale state.

**Marble view:** visual navigation of context, not its sole storage. Large tap targets; no long press, occluded controls, or accidental world tap-through. Preserve Sieve 🗑/🐙/👁, title/build/FPS, world, and existing bottom bar. The runtime can use its world to make context delightful, but presentation must never hide missing evidence.

## 5. Current implementation — honest inventory

**Implemented in repository as of 2026-10-15:**
- [Sieve entrance](../../sieve/index.html), [composer](../../sieve/compose.js), [world](world.js), and [shared styles](../../athanor/interface.css).
- 🗑 opens a native workspace drawer with \`#huntRoot\`; 🐙 links to GitHub; world and existing instruments remain.
- [sieve/hunt.js](../../sieve/hunt.js) is a **legacy Hunt v0 prototype**: IIFE, Remotive browser fetch, simple keyword/title filtering, localStorage key \`sieve.hunt.v1\`, source-local ID dedup, sweep events, candidate cards, PASS, EXPORT JSON, and COPY 👁 REPORT. It does **not** provide model-accessible durable context, official employer verification, real relationship research, or application compilation.
- First real user 👁 at \`2026-10-15T19:15:25.004Z\`: successful Remotive sweep, 14 received/accepted, 0 malformed/duplicate, 1 investigated, 2 passed. Only investigated result was **Senior Shopify Developer** at Sanctuary Computer Inc, triggered by generic \`world\`, \`creative\`, \`systems\` in the description. This was a false positive and architecture signal.
- Interim corrective commits \`d15e011f\` (title gating/exclusions) and \`1a3f86d2\` (reclassify saved candidates, preserve passes). These improve the prototype but **do not validate it as Hunt's discovery strategy**.
- Hunt source and style commits \`bda14079\`, \`032fa138\`, \`ed80146c\`; observation/spec record \`bd423f64\`. Read latest source before changing code.

**Not implemented:** tool-accessible shared private context store; model-driven ingestion pipeline; graph/index/query APIs; provenance-preserving claims; durable correction engine; real opportunity marbles; official application verification; Forge; private outcome ledger; end-to-end submission reconciliation. Do not describe these as delivered.

### 5.1 Legacy Hunt v0 construction — retained for diagnosis

\`hunt.js\` initializes \`{version:1,events:[],candidates:{},lastSweep:null}\` from \`localStorage\` and mounts into \`#huntRoot\`. It fetches \`https://remotive.com/api/remote-jobs?limit=200\` with \`cache:'no-store'\` and 14-second \`AbortSignal.timeout\`. Each source job requires \`id\`, title, company, and HTTP(S) URL. Normalization strips tag-like strings, collapses whitespace, truncates descriptions to 4,000 characters, records ISO observation time, sets \`officialVerified:false\`, and uses \`remotive:<id>\` as key. Current classification checks literal terms and target employers, excludes obvious commercial titles, and requires a domain-specific title or target-employer match to investigate; generic description term count alone no longer qualifies. This is not semantic judgment.

Sweeps emit \`sweep-start\`, \`sweep-complete\`, or \`sweep-error\`, record received/accepted/duplicate/rejected counts, preserve manual \`pass\` decisions, and save up to 500 events. Candidate list shows up to 25 investigate records; COPY 👁 REPORT includes up to 20 investigate records and 15 events; instrumentation panel includes 20 events; EXPORT JSON downloads full local state. \`navigator.clipboard.writeText\` has a selectable-text fallback. Records are only in that browser's storage and can be lost; browser access does not make them available to the model automatically.

**Observed defects / constraints:** remote-only feed is a poor fit for hybrid/on-site studios; no cross-source dedup; no employer-hosted verification; generic text matches mislead; no closure detection; source timestamps and browser observation times differ; no durable human decision reasons; partial list truncation; render resets expanded state; clipboard/browser behavior not fully verified; no automated fixtures; no authenticated model↔runtime bridge. The first 👁 established one successful network call, **not** full live deployment verification of later fixes.

**Disposition:** preserve the first-light record and regression fixture; retire the public-feed sweep as the central Hunt operation once a model-context ingestion/read path exists. Do not spend successive turns expanding browser feed adapters or classifier heuristics unless needed to support a specifically requested research source.

## 6. Working roadmap — next 12 turns, reoriented around model context

Each turn is a bounded implementation milestone with input, work, instrumentation, and exit test. The first user 👁 may reorder these. Do not implement a speculative backend before inspecting available write/read permissions.

### Turn 1 — Context transport and sovereignty
Inspect available ChatGPT↔GitHub/private storage connector operations, repo visibility, Pages exposure, and existing deployment machinery. Select a safe tool-readable, tool-writable store for structured context. Define the explicit transport for model writes and reads and the UI's access (public sanitized mirror or user-controlled import when necessary). **Instrument:** capability matrix, permissions, failed accesses, privacy boundary. **Exit:** successful private test record write, read-back, and retrieval in a separate call; no secret published.

### Turn 2 — Versioned context schema and fixtures
Implement entity, opportunity, observation, claim, relationship, decision, outcome, event, and frontier schemas. Add stable IDs, source metadata, timestamps, schema migrations, validation, and redaction rules. Include the Shopify false positive as a regression fixture for evidence-versus-judgment separation. **Instrument:** schema failures, fixture results, migration outcomes. **Exit:** deterministic tests and round-trip preservation of unknowns and provenance.

### Turn 3 — Model-driven Hunt ingestion
Perform a **real model-led research hunt** using available research tools, investigating both open requisitions and promising people/teams. Write normalized results with citations and observed timestamps into the store. No browser keyword filter is allowed to be the authoritative hunter. **Instrument:** research source trail, fact/inference/unknown distinctions, write IDs and read-back. **Exit:** several meaningful, inspectable marbles with source-backed rationale; unadvertised prospects labeled as such.

### Turn 4 — Retrieval, working sets, and cold boot
Implement \`queryContext\` and \`getFrontier\` with compact relevance-aware context bundles, stable ordering, source references, unresolved questions, and recent decisions. Make handoff route directly to frontier retrieval. **Instrument:** retrieval IDs, omitted/expired sources, bundle size, stale flags. **Exit:** new conversation can resume a selected investigation without user restating it.

### Turn 5 — Provenance and contradiction engine
Implement immutable source observations, claim supersession, relationship evidence, conflicts, and explicit verification levels. Separate the employer's own claim from a model inference. **Instrument:** conflicting facts, stale source flags, unresolved questions, correction chain. **Exit:** a deliberately contradictory observation is surfaced rather than silently overwriting prior evidence.

### Turn 6 — Deduplication and temporal change
Canonicalize employer requisitions and people across multiple sources; preserve all sightings, redirects, status history, and merge reasons. Differentiate absence from closure. **Instrument:** merge collisions, duplicate candidates, last-seen/last-verified timestamps, changes since prior hunt. **Exit:** repeated hunt does not generate duplicate marbles or erase a user's decision.

### Turn 7 — Judgment with the Conjoiner contract
Model evaluates real mandates for experimental systems authorship, autonomy, creative direction, resource depth, collaborators, and practical constraints. Record \`pursue/investigate/defer/pass\` with evidence and explicit unknowns; never substitute title or generic keyword density. **Instrument:** rationale, counterevidence, human overrides, changed judgments. **Exit:** user can inspect exactly why a prospect was surfaced or passed.

### Turn 8 — Marble grammar and world-facing instrumentation
Render context records as responsive, selectable marbles inside the existing Sieve instrument/world. Provide provenance, next actions, uncertainty, and status on demand; maintain accessible controls, build/FPS and no tap-through. **Instrument:** selected record, source age, context completeness, interaction failures. **Exit:** a user can flick through the same structured records the model can retrieve.

### Turn 9 — People and institutions as first-class hunting ground
Expand relationships among leads, teams, studio heads, R&D leaders, projects, introductions, and public contact routes. Differentiate a connection from a hypothetical outreach prospect. **Instrument:** relationship source, recency, confidence, follow-up action. **Exit:** useful relationship marble can be pursued without inventing an open job or private contact information.

### Turn 10 — Verified application handoff and Forge
For a selected **real** requisition, verify employer posting, apply URL, requirements, and closure status; generate truthful tailored PDF résumé, optional DOCX/evidence sheet, and cover note only as needed. **Instrument:** verified link, requirement provenance, package manifest, render validation, source claim map. **Exit:** user receives usable files and a direct application path, with manual submission clearly assigned to user.

### Turn 11 — Private outcome reconciliation and 👁 learning
Append private events from user-reported outcomes, follow-ups, rejections, and corrections. Recompute frontier and future Hunt guidance from observations; preserve human choices and conflicting evidence. This is external-memory-guided adaptation, **not** model weight retraining. **Instrument:** event diff, correction trace, updated next actions, missing evidence. **Exit:** user 👁 changes the next research turn without repeating earlier mistakes.

### Turn 12 — Repeat, harden, and optional monitoring
Complete a second independent research→marble→verification→Forge→outcome cycle; test cold boot, privacy, conflicts, deployment, stale asset recovery, mobile UX, and tool outages. Discuss scheduled searches only if user wants them and actual scheduling machinery exists. **Instrument:** end-to-end trace, SHA and deployed build, regression suite, unresolved defects. **Exit:** reproducible cross-session workflow and documented limitations.

## 7. Universal acceptance gates

1. **Model is the hunter.** Browser/runtime is context and instrumentation, not a replacement for model research.
2. **Durable context is actually model-accessible.** A browser localStorage entry alone does not meet this requirement.
3. **Evidence is inspectable.** Every consequential claim, relationship, and decision traces to observations; facts and inference remain distinct.
4. **No invented verification.** Discovery ≠ employer validation; opened form ≠ submission; absence ≠ closure.
5. **No public personal history.** Private application/outreach information stays behind an appropriate authorization boundary.
6. **Human retains authority.** The user chooses prospects and submits applications.
7. **Existing Hermeticon survives.** Preserve world, controls, mobile interaction grammar, title, build and FPS.
8. **Read-back before success.** Verify repository writes; separately verify deployed SHA and actual browser interaction before declaring live.
9. **Failures are evidence.** Record and expose transport, storage, classification, contradiction, and authorization failures.
10. **Each turn reduces context friction.** The model should need fewer repeated explanations as the context machinery matures.

## 8. Definition of done

The Conjoiner can ask Clara to hunt; Clara researches through her tools, writes evidence-backed context to a private model-accessible store, retrieves the relevant frontier in a new conversation, offers inspectable marbles, prepares a verified application package on selection, and reconciles the user's 👁 without losing provenance, decisions, or privacy. Two distinct cycles work without reconstructing the user's identity or redoing previously settled investigations. Until then, Sieve is an instrumented prototype with an explicit roadmap, not a completed hiring pipeline.
