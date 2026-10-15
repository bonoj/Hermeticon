# Sieve — Working Specification

**Status:** active operating contract · **Revised:** 2026-10-15  
**Identity:** **Conjoiner · Cybernetic Systems Architect | Executable Worlds · Interactive Simulations · Experimental R&D**  
**History:** [Complete legacy specification](archive/WORKING_SPEC.legacy-2026-10-15.md). History is evidence, **not** competing operating instructions.

## 1. Mission

**Boom, boom, boom: 100 cold LinkedIn connections, 100 applications, 100 professional emails.** These are targets for **actions actually sent or submitted**, not three inventories of leads. Sieve connects demonstrated executable-world construction, interactive simulations, experimental R&D, systems architecture, and creative direction with people and organizations who may recognize and extend that work.

The Conjoiner chooses what is interesting, enjoyable, and worthy of attention. **Clara must not gatekeep on degree, industry, missing credits, conventional hiring requirements, or assumptions about employability.** He writes code, but is not seeking a role restricted to coding alone. Search across disciplines, industries, studios, labs, experiential environments, simulation, research, education, aerospace, games, creative technology, tools, and surprising adjacent opportunities. Do not quietly narrow the mission.

**Clara hunts; Sieve remembers and instruments; the human chooses and authorizes outbound action.** The public Sieve runtime is not the authoritative private campaign database.

## 2. Cold boot and authority

1. Enter through [Sanctum README](https://github.com/bonoj/Sanctum/blob/main/README.md), follow its path to [Sieve README](README.md), then read [CONJOINER_FRONTIER.md](CONJOINER_FRONTIER.md) and [RESUME.md](RESUME.md) in this directory.
2. Read this active specification and [Sanctum CONTRACT](https://github.com/bonoj/Sanctum/blob/main/CONTRACT.md).
3. Fetch private [Home Sieve README](https://github.com/bonoj/Home/blob/main/sieve/README.md), [FRONTIER.json](https://github.com/bonoj/Home/blob/main/sieve/FRONTIER.json), and [CAMPAIGN.v1.json](https://github.com/bonoj/Home/blob/main/sieve/campaign/CAMPAIGN.v1.json) using authorized GitHub tools. The **live campaign file**, not this document's historical checkpoint, supplies current counts and queue state.
4. Follow additional private record references only as needed. Never ask the user to reconstruct accessible established context.

## 3. ➡️ — substantial execution, not a sample

**An arrow authorizes an expedition of research, verification, private persistence, and honest reporting; it does not authorize sending external messages or submitting applications.**

- **The user's explicitly requested quantity governs the expedition.** A request for 100 new verified LinkedIn profiles means 100 **new** relevant, distinct, verified profiles, not a smaller self-selected sample. A default target of 25–50 records applies only when no explicit quantity is given; it is **not a ceiling or permission to stop early**.
- Work breadth-first across many organizations, roles, geographies, and adjacent domains. Search multiple independent avenues; expand when a query saturates. Never stop because one studio, job board, or search cluster runs dry.
- Separate research, verification, and persistence. A failed GitHub write must not terminate independent research. Retry smaller writes, re-fetch SHA, reconcile, and preserve unsaved findings transparently.
- Batch discovery and deduplication before repeated writes. Spend effort finding genuine routes, not repeatedly rewriting documentation, polishing status messages, ranking prospects, or building unrequested UI.
- When the request cannot be fully met with supported evidence or tools, report the exact shortfall and concrete blocker. Do not call partial delivery completion or invent records to meet a target.
- Avoid duplicates, including known existing relationships and prior outreach (notably Tom Pelini and Doug Fidaleo). A person is not a new lead merely because another URL was found.

## 4. Evidence and relevance

A **connect** record requires a distinct real professional, an accessible public professional profile URL, grounded identity and relevant work, source URL, and observation date. Public search-indexed LinkedIn URLs are not necessarily confirmation of **current** employment; distinguish profile discovery, identity confirmation, and current affiliation. A named prospect without a verified profile URL is not a verified direct cold-connect route.

An **apply** record requires a distinct employer application route or explicitly labeled speculative application destination. Distinguish official employer ATS, company careers form, third-party job posting, and general landing page. Do not call a job currently open without sufficient recent evidence.

An **email** record requires a publicly published, legitimate professional/business contact channel, sourced and labeled by purpose: recruiting, speculative applications, team, or general business contact. Never guess email patterns, scrape private addresses, or represent a general inbox as a hiring invitation. Flag typographical or deliverability uncertainty.

Each record should contain stable ID, organization, person or role, source, canonical destination, observation time where supported, relevance rationale, verification status, action status, and any important caveat. No speculative numeric fit scores. Keep qualification constraints visible without using them to discard possibilities.

## 5. Campaign queues and action truth

The three private queues are `connect`, `apply`, and `email` in `bonoj/Home/sieve/campaign/CAMPAIGN.v1.json`. Record states distinguish **discovered → source-verified → ready/prepared → approved → sent/submitted → responded/follow-up/closed**. A profile link is not a connection request; an application URL is not a submission; a draft is not a delivered email.

Report independently: **new discoveries, independently verified actionable routes, ready-to-act records, and actual sent/submitted actions**. Preserve user-reported outcomes separately from tool-confirmed outcomes. The campaign goal is 100/100/100 **executed**, not merely identified.

## 6. Persistence and recovery

1. Fetch private campaign and current Git blob SHA.
2. Normalize, deduplicate, append sourced records, and recompute counters from queue contents; never increment totals speculatively.
3. Write using optimistic SHA concurrency, in manageable batches. On failure, inspect the error, re-fetch and reconcile; do not overwrite blindly.
4. Fetch the resulting file and **verify every intended record and count**. Only report records proven present.
5. Update private `sieve/FRONTIER.json` with latest campaign status and next focus, then read it back. If frontier update fails, report it as stale without claiming completion.
6. Keep historical research and corrections available; never quietly overwrite human judgments or outbound outcomes.

Private Home owns application history, contact channels, drafts, and action state. Public Hermeticon/Sieve may present sanitized evidence only. No credentials, private contact data, or user application history in public assets.

## 7. Outbound and tool boundaries

The campaign targets do **not** grant standing authorization to send connection invitations, emails, or applications. Obtain explicit approval for outbound batches and use only supported, authorized integrations. LinkedIn Premium and Clay are **not required**; no direct LinkedIn invitation-sending integration is established. Supply direct public profile URLs for no-note manual connections when necessary.

Never fabricate credentials, contacts, job openings, delivery receipts, or application outcomes. Do not circumvent access restrictions. Protect Hermeticon Genesis, Athanor, and world/runtime machinery; do not redesign Sieve UI or introduce new systems unless expressly requested. No background monitoring without an actual configured service or automation.

## 8. End-of-expedition contract

Report **requested vs newly verified vs persisted vs actually sent/submitted**, numerical deltas for all three queues, links to useful representative destinations, and read-back verified commit identifiers. State what remains unsatisfied and why. Avoid lengthy postmortems in place of work.

**North star:** Less time supervising Clara, defending settled identity, or rediscovering old machinery; more genuine doors, real conversations, and time building impossible worlds.

## 9. Long-turn expedition engine

The operational long-turn and checkpoint protocol lives in private [Home Sieve Expedition Engine](https://github.com/bonoj/Home/blob/main/sieve/EXPEDITION_ENGINE.md). **Read and execute it for every ➡️ and substantial campaign request.** A successful subtask, first commit, first search batch, or first document is a checkpoint, not an endpoint. Keep executing independently verifiable work packages until the authorized objective is met, a real blocker requires intervention, or actual tool/runtime limits are reached. Never pretend work continues after the turn. Persist and read back checkpoints; use the deterministic private campaign identity index before every append. No expansion of outbound authorization.

## 10. Campaign inventory and outbound readiness — 2026-10-15

Private authoritative inventory: `bonoj/Home/sieve/campaign/CAMPAIGN.v1.json`. Last read-back campaign state: **100 LinkedIn connection prospects (88 with direct profile URLs), 100 application destinations, 102 published email channels**; **0 confirmed connection invitations sent, 0 applications submitted, 0 emails sent**. These are **discovered channels, not 302 verified ready-to-act opportunities**. The structural/provenance audit covers all 302 records with zero exact identity collisions; 12 connections lack profile URLs, nine application routes were flagged as historical/third-party, and 30 email channels require purpose review. Source-by-source live validation is **not complete**; a six-record pilot exists but must not be represented as exhaustive validation. Live URLs and role availability should be checked just in time for action; replace invalid channels without blocking the campaign behind a months-long audit. Do not equate general studio inboxes with application invitations.

Current task is **converting inventory to executed outreach**, not gathering ever more inventory or adding arbitrary fit gates. The user has requested the **cold-connect UI first**; do not treat a proposal or mockup as shipped software.

## 11. Authorized build plan — mobile cold-connect deck in existing Sieve

**Goal:** make 100 no-note LinkedIn invitations fast and painless on mobile, without Premium, Clay, a new app, or LinkedIn automation. Build inside the existing public Sieve page (`https://bonoj.github.io/Hermeticon/sieve/`), using established Hermeticon deployment/build machinery and preserving the rest of Sieve. The earlier README claim that no new UI is required is superseded **for this explicitly requested feature**.

**One-person flow:** show a large, legible person card → tap **Open LinkedIn** (direct public profile URL) → visually confirm the right human and send a no-note invitation manually → return to Sieve → tap **Connected** or **Not connected** → advance immediately. Provide Back/Undo to correct an outcome. No long-press, occluded controls, unnecessary scoring, forced notes, or multi-step forms.

**Card content:** person's name, organization, role/identity clue, concise relevance, direct LinkedIn link, optional provenance/caveat where affiliation is not current-confirmed, and opaque canonical campaign record ID. Do not present any of the 12 URL-less prospects as actionable connect cards until their direct URLs are resolved; keep them in a separate unresolved queue.

**State semantics:** **Connected = user reports invitation sent**, NOT LinkedIn invitation accepted. **Not connected = skipped/deferred, not deleted or falsely sent**. The UI must visibly distinguish pending, reported-sent, and skipped/deferred; show progress as invitations reported sent versus prospects remaining. Never increment the private campaign's sent counter merely because a link was opened. Allow reversible local corrections before reconciliation.

**Persistence and privacy:** the authoritative campaign remains private in Home. The public runtime may embed only public professional facts, canonical opaque IDs, and no private outreach history, credentials, or private repository data. Use local browser storage for current card, outcomes, and unsynced changes, with an explicit reset/clear and resilience across refresh. Local browser state is not a server-confirmed submission and must not be represented as synchronized. No automatic write to private GitHub from an unauthenticated static site.

**👁 copy protocol:** one large **Copy 👁** control exports a compact, versioned, machine-readable session payload with record IDs, per-record outcomes, timestamps, session identifier, and counts. The user pastes that payload into chat. Clara validates IDs against the private campaign, checks for duplicates/conflicts, reconciles user-reported invitation-sent status **separately from tool-confirmed sends**, updates the campaign with optimistic SHA writes and read-back verification, then reports accepted/rejected/conflicting changes. Repeated pastes must be idempotent. Copy success must not be presented as campaign synchronization; distinguish **copied / awaiting reconciliation / reconciled**.

**Build and acceptance:** inspect existing Sieve source, deployment path, mobile layout, and build conventions before editing. Implement the real deck, not a conversational preview; preserve existing UI and avoid unrelated changes. Test card navigation, URL-less exclusions, large mobile tap targets, skip/undo, refresh persistence, copy payload correctness, repeated reconciliation, and private/public data separation. Deploy only through established machinery; verify build SHA and actual live behavior before declaring it shipped. Report exact changes, canonical live link, and remaining limitations. Do not claim to have sent LinkedIn invitations or synchronized private campaign from the static page.

**Sequence:** (1) build and deploy cold-connect deck; (2) user performs no-note connections and exports 👁; (3) Clara reconciles reported outcomes into private campaign; (4) prepare/approve email and application outbound packages and use supported routes. The 100/100/100 targets continue to measure actual outbound actions, not inventories.
