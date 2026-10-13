# Hermeticon — repository and hosting handoff

Hermeticon is a home for executable worlds; **Wanderer is one world, not Hermeticon itself**. The current root entrance temporarily opens Wanderer. No general-purpose shell is wired into the live application; the unused `shell/` scaffold was removed. Evolve shared hosting contracts from working worlds, inside out.

## Boundaries

- **Wanderer source and operational handoff:** `examples/wanderer-separated/`, especially [Wanderer HANDOFF](examples/wanderer-separated/HANDOFF.md). Its geology, Crucible, BBs, inhabitants, encounters and material contracts are not Hermeticon-wide requirements.
- **Public root:** https://bonoj.github.io/Hermeticon/ ; root `index.html` is currently a thin entrance to Wanderer's shared assets, not a second implementation.
- **Wanderer fixture:** https://bonoj.github.io/Hermeticon/examples/wanderer-separated/ ; preserve both entrances until an explicitly tested hosting change.
- **Historical source:** `archive/legacy-monolith/index.html` is not the live baseline.
- **Publishing:** `.github/workflows/pages.yml` runs GitHub Pages Actions on `main`; consult `bonoj/Gate/README.md` before altering delivery.

## Build identity and deployment

`Publish Hermeticon` assembles `site/`, stamps the current full `github.sha` into `examples/wanderer-separated/world.js`, displays its first eight characters, and adds `?v=<full SHA>` to both entries' references to `world.js`, `interface.css`, and `errors.js`. It also writes `build.json` and `examples/wanderer-separated/release.json`. The static source version of `world.js` is intentionally unverified before stamping. Do not display an ancestral SHA as the live build.

Expected public URLs (never use a `/releases/<sha>/index.html` link):
- https://bonoj.github.io/Hermeticon/
- https://bonoj.github.io/Hermeticon/examples/wanderer-separated/

A successful source commit alone does not establish publication. Inspect the latest **push** run of `Publish Hermeticon` and its steps, then verify both public HTML entries reference the expected SHA-stamped assets; where possible, verify the executing build and behavior. A missing PR-filtered workflow result is **not** proof of success or failure. Be precise about what was and wasn't verified.

## Failure and retry: never dead-end

1. Identify the failed step in the latest Actions run; obtain job logs when available. Do not infer a cause from a stale browser view.
2. If assembly fails, fix its actual source/asset/assertion issue. If deploy fails, inspect Pages permissions/environment and job error. If public verification fails, compare the deployed HTML/build SHA with the expected SHA; distinguish CDN delay from a failed deployment.
3. Fix the smallest responsible seam; keep both entry points and existing publication path intact. Push the repair to `main` (automatically triggers a fresh run), or rerun the workflow with `workflow_dispatch` when appropriate. **A previous failed run is not a prerequisite and must never block a new attempt.**
4. New commits should supersede older queued/in-progress builds. Do not stack speculative workflow rewrites, invent release URLs, or ask the user to repeatedly refresh.
5. If verification remains unavailable, say so; do not claim `live` until actual public evidence exists. Continue retrying by diagnosing the next concrete failure, not by waiting indefinitely.

