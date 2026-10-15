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

**Card content:** person's name, organization, role/identity clue, concise relevance, direct LinkedIn link, optional provenance/caveat where affiliation is not current-confirmed, and opaque canonical campaign record ID. Superseded on Oct 15: show the 12 URL-less prospects with LinkedIn people-search links and an unresolved-profile caveat.

**State semantics:** **Connected = user reports invitation sent**, NOT LinkedIn invitation accepted. **Not connected = skipped/deferred, not deleted or falsely sent**. The UI must visibly distinguish pending, reported-sent, and skipped/deferred; show progress as invitations reported sent versus prospects remaining. Never increment the private campaign's sent counter merely because a link was opened. Allow reversible local corrections before reconciliation.

**Persistence and privacy:** the authoritative campaign remains private in Home. The public runtime may embed only public professional facts, canonical opaque IDs, and no private outreach history, credentials, or private repository data. Use local browser storage for current card, outcomes, and unsynced changes, with an explicit reset/clear and resilience across refresh. Local browser state is not a server-confirmed submission and must not be represented as synchronized. No automatic write to private GitHub from an unauthenticated static site.

**👁 copy protocol:** one large **Copy 👁** control exports a compact, versioned, machine-readable session payload with record IDs, per-record outcomes, timestamps, session identifier, and counts. The user pastes that payload into chat. Clara validates IDs against the private campaign, checks for duplicates/conflicts, reconciles user-reported invitation-sent status **separately from tool-confirmed sends**, updates the campaign with optimistic SHA writes and read-back verification, then reports accepted/rejected/conflicting changes. Repeated pastes must be idempotent. Copy success must not be presented as campaign synchronization; distinguish **copied / awaiting reconciliation / reconciled**.

**Build and acceptance:** inspect existing Sieve source, deployment path, mobile layout, and build conventions before editing. Implement the real deck, not a conversational preview; preserve existing UI and avoid unrelated changes. Test card navigation, URL-less exclusions, large mobile tap targets, skip/undo, refresh persistence, copy payload correctness, repeated reconciliation, and private/public data separation. Deploy only through established machinery; verify build SHA and actual live behavior before declaring it shipped. Report exact changes, canonical live link, and remaining limitations. Do not claim to have sent LinkedIn invitations or synchronized private campaign from the static page.

**Sequence:** (1) build and deploy cold-connect deck; (2) user performs no-note connections and exports 👁; (3) Clara reconciles reported outcomes into private campaign; (4) prepare/approve email and application outbound packages and use supported routes. The 100/100/100 targets continue to measure actual outbound actions, not inventories.

## 12. Timestamped cold-connect execution — October 15, 2026 (EDT)

The timeline begins at the cold-connect build-contract commit, **not** at the beginning of Sieve or the earlier 100/100/100 research. GitHub timestamps document source commits; the user's 👁 export documents manual card outcomes. Live deployment timing was not independently measured.

| Time (EDT) | Milestone | Evidence |
| --- | --- | --- |
| 17:27:18 | Build contract committed | c41aae06 |
| 17:29:50 | First 88-profile deck published | 789a1398 |
| 17:30:24 | Mobile card flow and 👁 export implemented | dbb5996a |
| 17:30:36 | Deck mounted in Sieve | 1de6a7cf |
| 17:30:47 | Duplicate rendering corrected | 9290394c |
| 17:31:56 | 12 unresolved prospects added | fa882eec |
| 17:32:04 | LinkedIn search links added; 100-card source complete | 9359abaf |
| 17:34:43.900 | First invitation reported | 👁 connect-xvii-1 |
| 17:56:37.412 | Last card outcome recorded | 👁 connect-anna-huerta |
| 17:56:39.121 | 100-outcome 👁 exported | sc-mva23hkr-2u110m |
| Later Oct 15; exact time unavailable | Private campaign reconciled: 97 sent reports, 3 skips | Home 818d0c75 |
| Later Oct 15; exact time unavailable | Private frontier updated | Home 52e84aa0 |
| Later Oct 15; exact time unavailable | Two acceptances persisted | Home d604dec6 |

**Elapsed:** 4m46s from build contract to 100-card source completion; 21m53.512s between first and last manual outcome; 29m21.121s from build-contract commit to 👁 export. These are distinct measurements, not total project time.

### State at this checkpoint

- **Connect:** 100 processed, 97 invitations **user-reported sent**, 3 **not connected** (Jeff Mills, Chris Bell, Greg Hermanovic), 0 unprocessed. Two of the 97 subsequently **user-reported accepted**: Zachary Saale (Acronym; connect-xvii-19) and Kaylie Stuteville (Disney Imagineering; connect-xviii-8). Acceptance records persisted in private Home campaign at d604dec6. Do not conflate reported activity with LinkedIn-platform verification.
- **Apply:** 100 discovered destinations, 0 submissions reported. **Email:** 102 discovered published channels, 0 emails reported sent. These inventories are not fully live-verified.
- **Runtime:** public Sieve contains the 100-card deck with 88 direct profile URLs and 12 LinkedIn people-search routes, local persistence, navigation and 👁 export. LinkedIn iframe embedding is blocked; direct links remain the path. No in-deck field yet saves newly found direct URLs. Source writes were verified, but actual live-browser deployment was not independently confirmed.
- **Authority:** Home private campaign is the outreach source of truth. Home frontier commit 52e84aa0 predates the two accepted-connection updates. No follow-up tasks or messaging requested yet; defer them.

### Next steps

1. Find three additional distinct relevant people with direct profiles, preserving all original outcomes, to finish **100 invitations reported sent**; user handles manual connection and exports another 👁.
2. Prepare and validate legitimate outbound email routes, draft relevant outreach, obtain explicit approval, then send through supported tools and reconcile delivery evidence.
3. Validate current application destinations, prepare submissions, obtain explicit approval, and record actual submissions; replace stale routes without arbitrary delays.
4. Preserve the two accepted connections for later follow-up, **without** creating tasks or sending messages now.
5. Reconcile every future 👁 idempotently into private Home with SHA-safe writes and read-back; keep the public/private boundary and action-state distinctions intact.

## 13. Cross-disciplinary opportunity principle — 2026-10-15

**The target is not a software position. It is a team doing something worth making possible.** Software is an instrument in John's practice, not the boundary of his profession. He is comfortable joining a team with **zero existing software engineers**, introducing computational capabilities wherever useful, and working across unfamiliar tool suites and disciplines. Do not require a software-forward organization, engineering department, conventional coding title, or established development stack as a fit gate.

Sieve should seek **creative-world people** across world-building, experiential and themed entertainment, games, art, sculpture, fabrication, physical and digital installations, architecture, interactive environments, simulation, mechanical systems, technical art, narrative, and R&D. Relevant counterparts may be creative directors, artists, designers, fabricators, researchers, architects, producers, and studio founders as readily as software engineers. The common denominator is consequential work and room for John's systems thinking, invention, collaboration, and implementation.

This is **not** a refusal to write code: John can architect and implement software, integrate with tool suites, and construct end-to-end systems. The objection is being reduced to code production alone. Lead with the possibility of new capabilities and executable worlds, not a résumé keyword match. Do not narrow the 100/100/100 campaign to software engineering or demand that a team already know how to employ this practice.

**Network implication:** direct relationships with people making compelling worlds can be more valuable than job listings. Preserve accepted contacts for later, without unsolicited follow-up tasks or messages. Keep outbound counts evidence-based and retain non-software prospects in the discovery and outreach funnel.

## 14. LinkedIn pass collected; email expedition active — 2026-10-15

User concluded the first LinkedIn pass at **98 user-reported invitations sent**; the remaining two were not found and **must not trigger replacement prospect hunting**. Preserve all 101 private prospect records, three skips, and five user-reported acceptances. This is a deliberate phase transition, not an assertion that the numerical 100 target was met. Do not create follow-up tasks or send connection messages until asked.

The completed cold-connect deck was **collected from the active Sieve workspace** in Hermeticon commit `0365ffc5`: removed its mount and script from `sieve/index.html`, while retaining `sieve/connects.js` and `sieve/connect-deck.json` for cheap future reconstruction. Existing Hunt and Compose modules were preserved. Source changes and read-back were verified; live-browser deployment was not independently checked.

**Current priority:** turn the existing **102 discovered email channels** into a high-throughput professional email expedition, with appropriate destination verification and cross-disciplinary creative relevance. Then advance the **100 application destinations**. A discovered email is not a delivered email; obtain explicit outbound authorization and reconcile actual sends. Do not restart LinkedIn work or rebuild a dashboard merely because the deck is gone. Private Home `sieve/FRONTIER.json` records the current email phase.

## 15. Email baseline and mutation rule — 2026-10-15

Approved baseline email copy (preserve verbatim as the reference for each mutation; approval of copy is **not** authorization to send):

**Subject:** Experimental worlds & interactive systems

Hey [First name],

I'm interested in finding the right team at [Organization], and figured you might have some insight.

I've been building experimental worlds and interactive systems through human-model collaboration.

Here's what I've been working on recently:

https://bonoj.github.io/

Cheers,
John

The first sentence is the **baseline/placeholder** for recipient-specific mutation. It must always be present in the preparation context to inform a suitable, concise opening tailored to the recipient and channel. Do not indiscriminately substitute the placeholder literally into every email; preserve the rest of the short, human skeleton unless there is a specific reason to adapt. Use the exact approved link, not an invented or alternate URL. Do not send absent separate batch authorization.
