# Hermeticon — Wanderer

A standalone executable world. Open the GitHub Pages site at https://bonoj.github.io/Hermeticon/.

## Provenance

Graduated by **cloning**, not moving, the JIT Wanderer from `bonoj/Repository/src/jit/hermeticon-wanderer/index.html` at source commit `f8fd252ca4abb91f7ca7c445197944a044df2173`. The original JIT source and its public deployment remain untouched. The clone's embedded BUILD string records this source provenance, **not** its own subsequent Hermeticon commits.

## Publication

This repository is both source and deployment. GitHub Pages is configured to use GitHub Actions. On push to `main`, `.github/workflows/pages.yml` uploads and deploys the repository as a static Pages artifact. `index.html` is the standalone entrypoint. No mirror repository, bundler, or server.

Before changing publication mechanics, read `bonoj/Gate/README.md` and inspect current workflow and public bytes. Do not claim a build is live merely because a commit or workflow exists.

## Development

Keep the JIT ancestor intact. Treat this copy as an independent world. Preserve physics and interaction behavior during graduation; make future architecture changes separately. See `HANDOFF.md` for the operating surface.
