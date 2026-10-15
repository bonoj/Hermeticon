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
