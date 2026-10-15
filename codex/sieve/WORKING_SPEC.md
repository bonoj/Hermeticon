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

**Implemented since the original inventory:** private model-accessible GitHub file transport, a versioned schema and fixtures, a pure in-memory context query/validation library, and a manually maintained private frontier; see §5A. **Not implemented:** automatic context ingestion or sync, a service-backed query API, graph indexing, durable correction engine, real opportunity marbles, official application verification, Forge, private outcome ledger, or end-to-end submission reconciliation. Do not describe these as delivered.

### 5.1 Legacy Hunt v0 construction — retained for diagnosis

\`hunt.js\` initializes \`{version:1,events:[],candidates:{},lastSweep:null}\` from \`localStorage\` and mounts into \`#huntRoot\`. It fetches \`https://remotive.com/api/remote-jobs?limit=200\` with \`cache:'no-store'\` and 14-second \`AbortSignal.timeout\`. Each source job requires \`id\`, title, company, and HTTP(S) URL. Normalization strips tag-like strings, collapses whitespace, truncates descriptions to 4,000 characters, records ISO observation time, sets \`officialVerified:false\`, and uses \`remotive:<id>\` as key. Current classification checks literal terms and target employers, excludes obvious commercial titles, and requires a domain-specific title or target-employer match to investigate; generic description term count alone no longer qualifies. This is not semantic judgment.

Sweeps emit \`sweep-start\`, \`sweep-complete\`, or \`sweep-error\`, record received/accepted/duplicate/rejected counts, preserve manual \`pass\` decisions, and save up to 500 events. Candidate list shows up to 25 investigate records; COPY 👁 REPORT includes up to 20 investigate records and 15 events; instrumentation panel includes 20 events; EXPORT JSON downloads full local state. \`navigator.clipboard.writeText\` has a selectable-text fallback. Records are only in that browser's storage and can be lost; browser access does not make them available to the model automatically.

**Observed defects / constraints:** remote-only feed is a poor fit for hybrid/on-site studios; no cross-source dedup; no employer-hosted verification; generic text matches mislead; no closure detection; source timestamps and browser observation times differ; no durable human decision reasons; partial list truncation; render resets expanded state; clipboard/browser behavior not fully verified; no automated fixtures; no authenticated model↔runtime bridge. The first 👁 established one successful network call, **not** full live deployment verification of later fixes.

**Disposition:** preserve the first-light record and regression fixture; retire the public-feed sweep as the central Hunt operation once a model-context ingestion/read path exists. Do not spend successive turns expanding browser feed adapters or classifier heuristics unless needed to support a specifically requested research source.

## 5A. Implementation journal — private context transport and retrieval (2026-10-15)

This section documents **executed repository work** since the architectural pivot. It supplements §5's inventory of the legacy public runtime. Private source paths are in `bonoj/Home` and require authorized GitHub access; do not copy their contents into the public site.

### 5A.1 Repositories, ownership, and isolation

- **`bonoj/Hermeticon` — public:** Sieve's [working specification](WORKING_SPEC.md), [handoff](HANDOFF.md), [README](README.md), public Sieve entrance, existing `sieve/hunt.js` prototype, and the pre-existing Genesis/Athanor world machinery.
- **`bonoj/Home` — private:** `sieve/README.md`, `sieve/FRONTIER.json`, `sieve/schema/context.v1.json`, `sieve/fixtures/first-light.v1.json`, `sieve/lib/context.v1.js`, and `sieve/lib/context.v1.test.js`.
- GitHub repository metadata was inspected through the connected tool: Home reported `visibility=private` and `push=true`; Hermeticon reported `visibility=public` and `push=true`.
- **Isolation:** Turn 1–3 code changes were private Home context files. Public Hermeticon mutations were Sieve documentation/handoff references, **not** Genesis, Athanor, terrain, rendering, physics, or controls. Public documentation pushes may invoke the ordinary Pages workflow; that is not evidence of executable-world modification.
- **Trust boundary:** ChatGPT's authorized GitHub connector can read and write Home. A browser running public Sieve **cannot** thereby access private Home; there is no credential-bearing browser integration, authenticated context API, live sync, or automatic private-to-public projection.

### 5A.2 Turn 1 — working private GitHub transport

**Files created:** `Home/sieve/README.md` (contract and cold-boot route) and `Home/sieve/FRONTIER.json` (small working-context aperture).

**Frontier v1 initial fields:** `schema`, `updatedAt`, `mission`, `phase`, `status`, `workingSpec`, `currentFocus`, `observations[]`, `knownBoundaries[]`, `nextActions[]`, `recordRefs[]`, `events[]`. The initial observation captures the user-supplied 2026-10-15 Remotive 👁 report and its Shopify false positive; it is not a new independent source verification.

**Transport procedure executed:** connected GitHub `create_file` → `fetch_file` → parse JSON → `update_file` with fetched blob SHA → `fetch_file` → parse/verify updated status. Home commit `a15926c2` established `transport-write-and-readback-verified`. Public Sieve handoff updated at `3d27185d`.

**Concurrency contract:** fetch authoritative file and SHA; validate existing state; update with that SHA; fetch and compare resulting content. On a write conflict, re-fetch and reconcile; never blindly overwrite newer observations. This is a procedure exercised on one frontier file, **not** yet an automatic transactional store or conflict-resolution engine.

### 5A.3 Turn 2 — context schema and first-light regression fixtures

**Schema:** `Home/sieve/schema/context.v1.json`, JSON Schema draft 2020-12, `$id: sieve.context.v1`. Each record requires `schema: sieve.context.v1`, stable `id`, `kind`, `createdAt`, `updatedAt`, `evidenceIds[]`; optional `data` and `supersedes[]`. Kinds: `entity`, `opportunity`, `observation`, `claim`, `relationship`, `decision`, `outcome`. Kind-specific requirements currently constrain observations (source, observedAt, statement, verification), decisions (subjectId, decision, actor, reason), relationships (fromId, toId, relation, verification), and claims (subjectId, statement, certainty). Other kinds still have sparse structural requirements. The schema file is **a contract artifact**, not proof that all JSON Schema keywords are enforced by the current JavaScript validator.

**Fixture:** `Home/sieve/fixtures/first-light.v1.json` holds three linked records:
1. `observation:remotive-20261015` — user-reported first 👁 sweep, explicitly marked `user-reported`.
2. `opportunity:remotive-2091140` — Senior Shopify Developer, Sanctuary Computer Inc; Remotive URL; `officialVerified:false`; not asserted to fit.
3. `decision:shopify-regression` — model `pass` for the false positive, with rationale that generic word overlap is not evidence of an experimental-world mandate.

Five named test intentions were recorded: round-trip, provenance, Shopify false-positive, human authority, contradiction retention. Fixture and schema were fetched back, JSON parsed, and checked for structural requirements, resolvable evidence IDs, and round-trip preservation. Commits: `5bc3b0b3` (schema), `4510489e` (fixture), `cb4d84f0` (frontier advanced). At this stage behavioral tests were specified but not yet executed.

### 5A.4 Turn 3 — pure deterministic context library and executed tests

**Implementation:** `Home/sieve/lib/context.v1.js` (CommonJS, no network, no storage writes, no browser dependency). It exports:

| Operation | Implemented semantics | Limitations |
| --- | --- | --- |
| `validate(records)` | Check record array, IDs, kinds, ISO-like dates, evidence-ID shape, duplicate IDs, kind-specific minimum fields, and cross-record observation/subject/relationship references. Returns error strings. | Manual subset validator; not a full JSON Schema draft 2020-12 implementation. Date check uses `Date.parse` plus ISO-like prefix. |
| `effectiveDecision(records, subjectId)` | Select latest human decision if any, otherwise latest model decision, ordered by `createdAt` then ID. | Simple precedence; no explicit revocation/supersession semantics yet. |
| `query(records, filters)` | Bounded filtering by `kind`, case-insensitive text over ID/data, `relatedTo`, effective opportunity `decision`, and `limit` (capped at 100); stable sort by `updatedAt` descending then ID. | In-memory scan, not graph traversal, indexed search, or persistent query service. |
| `frontier(records, {limit})` | Build `sieve.bundle.v1` containing non-passed opportunities, their directly referenced observations and subject decisions, totals, and unresolved official-verification questions. | One-hop selection; no advanced prioritization, relationship expansion, or source-age scoring. |
| `contradictions(records)` | Group claims by subject and predicate; return groups with differing serialized values/statements without erasing either claim. | Syntactic conflict detection, not semantic entailment or resolution. |

**Test source:** `Home/sieve/lib/context.v1.test.js` uses Node's built-in `assert` and fixture JSON. The test script was fetched with the library and fixture and executed using an isolated JavaScript evaluation harness that supplied `node:assert/strict`-equivalent assertions and a fixture read shim. **Eleven assertions passed**. Checked: fixture validation; JSON round-trip; Shopify retrieval; effective pass; no investigated Shopify result; exclusion from frontier; later model pursue does not displace a human pass; opposing claims retained; validation of opposed claims; duplicate detection; unresolved evidence detection. This is meaningful execution evidence, **not** proof of a native Node CI run or exhaustive production hardening.

**Commits:** `f9382e0b` (library), `e51b72d4` (tests), `254a043d` (private README retrieval instructions), `41ac7493` (private frontier advanced), `4e9cf4e8` (public handoff). The fetched library blob SHA was `1f0090ac6475ed1c9f8102b6563490c2df3641bf`; test blob SHA `55860ad4c4686300a1b89d48b742eaa278f79c63`.

### 5A.5 Current cold boot, exactly as supported

1. Read [Sanctum](https://github.com/bonoj/Sanctum/blob/main/README.md), Sieve identity and this specification only as necessary for authority.
2. Through the authorized GitHub connector, fetch **private** `bonoj/Home/sieve/FRONTIER.json`; inspect `phase`, `currentFocus`, `nextActions`, and `recordRefs`.
3. Fetch only relevant referenced files; currently these point to the schema, fixture, pure JS library, and tests. **No separate live opportunity-record dataset exists yet.**
4. Validate records, query a working set, and inspect evidence and decisions. Because GitHub connector operations are file reads/writes, executing `context.v1.js` requires a separate JavaScript execution environment or equivalent orchestration; the connector does not execute code on the repository.
5. For new evidence, prepare records with explicit source and observation time; persist using GitHub blob-SHA optimistic concurrency; fetch and verify; then update `FRONTIER.json` with compact links and next actions.
6. On failed reads, authorization changes, schema errors, or conflicts, expose the failure. Do not silently synthesize missing memory.

**Latest verified state at documentation time:** private frontier `phase=context-retrieval`, `status=pure-context-engine-tested`, current focus on real model-researched opportunities. No browser-to-private sync or automatic retrieval occurs on its own.

### 5A.6 Outstanding work and acceptance boundaries

- **Next substantive turn:** model-led research with verifiable sources, then persist **live** records separately from fixtures. Current first-light Shopify data is a diagnostic, not a live job lead.
- Introduce a real append-only observation/event store, index/manifest, and bounded working-set projection; establish version-aware merge and claim supersession. Current `FRONTIER.json` is a manually updated aperture, not an automated materialized view.
- Run full JSON Schema validation and native Node tests/CI; add negative cases for malformed dates, unknown record fields, unauthorized state transitions, conflicting writes, stale sources, and private-data leakage.
- Resolve how sanitized public marbles can be projected without exposing Home's private records or GitHub credentials. **Do not** solve this by making Home public or placing private data in Pages.
- No real employer requisition has been independently researched, official application URL verified, package forged, submission recorded, or cross-session end-to-end run proven in this phase.
- Continue to leave Genesis, Athanor, and Hermeticon's world implementation unchanged unless explicitly requested. Sieve documentation changes alone do not constitute runtime changes.

## 6. Working roadmap — next 12 turns, reoriented around model context

Each turn is a bounded implementation milestone with input, work, instrumentation, and exit test. The first user 👁 may reorder these. Do not implement a speculative backend before inspecting available write/read permissions.

### Turn 1 — Context transport and sovereignty (implemented: private GitHub file transport; browser seam remains)
Inspect available ChatGPT↔GitHub/private storage connector operations, repo visibility, Pages exposure, and existing deployment machinery. Select a safe tool-readable, tool-writable store for structured context. Define the explicit transport for model writes and reads and the UI's access (public sanitized mirror or user-controlled import when necessary). **Instrument:** capability matrix, permissions, failed accesses, privacy boundary. **Exit:** successful private test record write, read-back, and retrieval in a separate call; no secret published.

### Turn 2 — Versioned context schema and fixtures (partially implemented; validation hardening remains)
Implement entity, opportunity, observation, claim, relationship, decision, outcome, event, and frontier schemas. Add stable IDs, source metadata, timestamps, schema migrations, validation, and redaction rules. Include the Shopify false positive as a regression fixture for evidence-versus-judgment separation. **Instrument:** schema failures, fixture results, migration outcomes. **Exit:** deterministic tests and round-trip preservation of unknowns and provenance.

### Turn 3 — Model-driven Hunt ingestion
Perform a **real model-led research hunt** using available research tools, investigating both open requisitions and promising people/teams. Write normalized results with citations and observed timestamps into the store. No browser keyword filter is allowed to be the authoritative hunter. **Instrument:** research source trail, fact/inference/unknown distinctions, write IDs and read-back. **Exit:** several meaningful, inspectable marbles with source-backed rationale; unadvertised prospects labeled as such.

### Turn 4 — Retrieval, working sets, and cold boot (pure retrieval prototype implemented; durable live-record retrieval remains)
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

## 8. Definition of done

The Conjoiner can ask Clara to hunt; Clara researches through her tools, writes evidence-backed context to a private model-accessible store, retrieves the relevant frontier in a new conversation, offers inspectable marbles, prepares a verified application package on selection, and reconciles the user's 👁 without losing provenance, decisions, or privacy. Two distinct cycles work without reconstructing the user's identity or redoing previously settled investigations. Until then, Sieve is an instrumented prototype with an explicit roadmap, not a completed hiring pipeline.

## Hunt VI–IX checkpoint — 2026-10-15

The breadth-first landscape survey is **complete as a first pass**, not a future instruction. Private `bonoj/Home/sieve/records/ecosystem-survey-20261015.v1.json` contains **40 organizations**: nine initially source-anchored, 31 explicitly unverified survey targets. Follow-on primary-source validation, roles and negative-fit evidence are in:
- `sieve/records/ecosystem-validation-20261015.v1.json`
- `sieve/records/hunt-viii-20261015.json`
- `sieve/records/hunt-ix-20261015.json`

The live, model-operated GitHub storage path was exercised repeatedly. Hunt VIII initially encountered blocked writes; a later smaller batch succeeded and was read back. **A blocked write is not persisted research; do not claim it was saved until read-back.** The private `sieve/FRONTIER.json` indexes these batches (frontier commit `082e5cfa`). These files are persistent Git-backed documents, not a running transactional database, and the browser has no authenticated private-data bridge.

Current actionable leads: Gardens Interactive Technical Game Designer (Level), thatgamecompany Technical Game Designer (hiring-test caveat), Wizards Digital Ventures Creative Lead (director-level experience hurdle), Hello Games roles. Strong institution/people routes: Maxis, Universal Creative, SideFX, Wētā FX, Disney Research/Imagineering, Embark Creative Play. Riot Central Creative Services Tools is a **negative-fit** infrastructure role; don't mistake its team name for world-building work. Embark's older Narrative & AI Systems vacancy was absent from the live board; don't present it as open. Disney req 10159875 remains officially unresolved.

**Next Hunt:** map real decision-makers, experimental team mandates and credible contact routes at high-fit institutions; verify further primary sources for the remaining 31 survey targets; compare actual authority, location, barriers, and human-working environment. Do not redo the 40-name enumeration or circle one requisition. Preserve existing outreach history, especially Tom Pelini at Larian and Doug Fidaleo at Disney. Do not send contact or applications without approval.

**Integrity contract:** A research claim, a source-backed observation, a job currently listed, and a successful GitHub commit are four different assertions. Mark each separately. Store failures and corrections. No public/private context leakage; no Genesis/Athanor/world modifications.


## 9. Proposed human UI roadmap — the first seven marbles (2026-10-15)

**Status: PROPOSAL ONLY.** This section is a sequenced delivery plan, not authorization to build or deploy. The established model-led Hunt and private Home context substrate remain authoritative. The existing §6 twelve-turn plan describes broader context machinery; this section gives the human-facing slice a concrete, narrow delivery order.

### Purpose and scope
Sieve's human interface is **not** a 40-row research database, job-board clone, second chat, or résumé wizard. It is a small, legible collection of **curated opportunities to exercise human judgment**. Clara hunts and decides what deserves attention; the Conjoiner sees why, inspects evidence, and changes the search with minimal friction. Every public-facing item must be an explicitly generated projection, never a raw private record.

**Proposed initial seven-marble set** (each requires source/status refresh before publication):
1. **Gardens Interactive** — Technical Game Designer (Level); systemic environmental toys; official listing observed; remote and shipped-Unreal-level-design hurdles.
2. **thatgamecompany** — Technical Game Designer; creative systems, creatures and tooling; official listing observed; remote and hiring-test concern.
3. **Wizards of the Coast** — Creative Lead, Digital Ventures; experimental IP direction; director-level shipping requirement and Renton hybrid.
4. **Hello Games** — procedural-world studio; distinguish specific listed engineering roles from a speculative relationship/open approach.
5. **Disney Imagineering R&D** — people/team route, not a confirmed open vacancy.
6. **Maxis** — simulation and unconventional-background institutional route, not a confirmed open vacancy.
7. **Universal Creative** — immersive interactive attractions and R&D team route, not a confirmed open vacancy.

The set is editorial and replaceable, **not** a hardcoded canonical shortlist. Each marble has an explicit type: `verified-opening`, `role-to-reverify`, `person-route`, `team-route`, or `institutional-prospect`. Never style all seven as open jobs. If a vacancy expires, retain its historical evidence and update the current status.

### Phase A — Projection contract, no UI (first)
- Define a versioned `sieve.public-marbles.v1` manifest generated by Clara from private Home evidence. Stable marble ID; title, type, fit rationale, friction, source link(s), evidence timestamps, verification status, next meaningful action, and non-sensitive public display text.
- Explicit allowlist and schema validation: no private Home paths, contact details, unpublished judgments, outreach history, access tokens, or full source dumps in the public artifact. A private record's existence **never** authorizes public display of its contents.
- Generate a fixture with seven sanitized marbles; compare every rendered fact against its source and distinguish `official vacancy observed` from `current availability not rechecked`.
- Prefer existing Hermeticon/Sieve deployment machinery. Keep public projection in a designated published path only after deliberate review. No browser-side authenticated calls to private GitHub.
- **Gate:** automated privacy-negative tests and evidence checks pass; no public deploy yet.

### Phase B — Read-only seven-marble instrument
- A single phone-first Sieve surface, using existing Sieve entrance and visual grammar, displays a curated small set. Distinguish openings, people routes, and institutions without overwhelming status badges.
- Tap a marble to reveal **why Clara surfaced it**, **what stands between John and it**, **what is actually verified**, and **what action could follow**. Show primary-source links and observation date.
- Avoid long-press, tiny/occluded controls, infinite feeds, résumé forms, and duplicate navigation. Preserve FPS/build and existing world controls. Genesis/Athanor/Hermeticon world machinery untouched.
- 👁 exports current visible manifest identity, card state, selection, and errors for model inspection.
- **Gate:** mobile tap targets and focus/back behavior checked; stale/unknown statuses legible; a real device/browser observation confirms the published build.

### Phase C — Human judgment without false persistence
- First implement **copy/export judgment envelope** (`marbleId`, `manifestVersion`, `judgment`, optional note, timestamp): `interesting`, `not-for-me`, `investigate`, `prepare-approach`. Export is deliberately human-mediated until a secure write path exists.
- A tap must not silently claim it has updated private Home. Show pending/exported/acknowledged states separately. No outreach or applications from these actions.
- Clara ingests the envelope through an actually supported tool route, records a private decision/observation with provenance, and updates `sieve/FRONTIER.json`; read back the write.
- **Gate:** demonstrate one positive and one negative judgment surviving a fresh conversation and changing the next Hunt shortlist.

### Phase D — Secure reconciliation and freshness
- Only if justified, build an authenticated write bridge or another explicitly approved transport; enforce narrow scoped writes, idempotency, concurrency checks, rate limits, audit history and replay safety. No GitHub token in browser code, localStorage, static assets, or public network responses.
- Model refreshes source/status before presenting a job as currently open; changed/closed/unknown is visible rather than overwritten. Private corrections supersede claims without erasing evidence.
- 👁 reports manifest build SHA, observation timestamps, stale data, feedback queue, last confirmed persistence, and transport errors.
- **Gate:** rejection, retry, duplicate feedback, stale manifest and offline behavior are tested; public/private boundary verified.

### Phase E — Expand only after the loop closes
- Move from fixed seven to curated rotating working sets and a compact archive, driven by private decisions and newly sourced leads.
- Add person/team marbles with grounded relationship routes; never infer contact availability or send messages without explicit human approval.
- Then build **Forge**: a verified opportunity-specific outreach/application package with résumé/portfolio evidence, barriers, human approval, and outcome reconciliation. Application submission remains human-controlled unless separately authorized.
- Optional monitoring requires an actually configured scheduling service, not a promise that a static site or chat is continuously hunting.

### Proposed implementation order and stop conditions
1. Write projection schema + fixture + leakage tests.
2. Produce the seven-item curated projection from private Home with source freshness labels.
3. Render read-only mobile marbles in Sieve only; inspect with 👁.
4. Add explicit judgment export and model-ingested reconciliation; verify across conversation boundary.
5. Consider a secure automated feedback bridge only if the manual loop proves useful.
6. Extend into Forge only when selection and evidence are reliable.

**Definition of first human-UI success:** John can flick a marble, immediately understand why it matters and its obstacles, reject or select it, and later see that judgment accurately reflected in Clara's private memory. A pretty marble without verified provenance and a real feedback path is **not done**.

