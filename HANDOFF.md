# Hermeticon — cold Clara handoff (2026-10-14)

**Mission:** Build a beautiful, perturbable, composable executable world inside a spherical vessel. Preserve established systems; investigate the next visual problem without inventing adjacent features.

**Live:** https://bonoj.github.io/Hermeticon/  
**Repo:** `bonoj/Hermeticon` (`main`)  
**Full previous handoff:** [archive/handoffs/2026-10-14-handoff.md](archive/handoffs/2026-10-14-handoff.md). Consult for engineering detail/history, not as a competing set of instructions.

## Orient in the running system

- **Athanor** (`athanor/compose.js`, `athanor/athanor.js`, `athanor/interface.css`): host, camera, render loop, toolbar, 👁 inspection and build/FPS.
- **Genesis** (`codex/genesis/world.js`): authored world mounted by Athanor at root and `/athanor/`.
- **Arcana**: `terrain.js` is signed-field terrain (top/bottom relief, true through-bores, spherical aperture clipping and an opaque signed-field aperture sidewall); `wanderer.js` is supported tap-to-walk navigation with terrain-relative motion; `edge-detection.js` is the existing 🌐 full-scene observation lens; `node-maker.js` is an **empty, instrumented** node renderer, not an active witness selector.
- `examples/wanderer-separated/` is an **older independent fixture**, not the current Genesis. Do not assume its BBs, fire or geographical nodes exist in Genesis.

**Known-good terrain checkpoint:** `40928287` — the accepted signed-field opaque cap with bore exemptions. Subsequent atmosphere experiments were rolled back; `main` also contains later UI and deployment fixes. **Do not reset `main` to the checkpoint** or disturb working terrain/Wanderer just to change presentation.

**Toolbar contract:** exactly **🌐 👁 ↻**, left-to-right; dark buttons, **thin brass rims**, reliable tap targets. Globe is appended by `edge-detection.js`; eye and refresh are in the HTML. The shared CSS defines fixed ordering slots so append timing cannot shuffle them. No fourth/map button. The previous mismatch came from competing CSS rules **and unversioned cached CSS**; the Pages workflow now stamps stylesheet URLs as well as JS. The fix was committed, but **visual confirmation on the actual deployed build is still required**.

## Next investigation: cavernous depth without visible innards

The current **opaque cap** hides undesirable terrain internals reliably and cheaply, but makes the aperture feel sealed rather than cavernous. Preserve it as the control condition.

Explore **genuinely different occlusion treatments** that imply depth while still concealing unfinished geometry: e.g., **localized volumetric-looking fog**, **darkness/penumbral falloff**, **depth-based dissolution**, and **subtle distant illumination**. These are **ideas to evaluate, not implemented systems or prescribed solutions**. Do not merely recolor or make the opaque cap translucent, or apply generic global fog and call the problem solved. When testing an alternative, ensure the opaque cap is actually disabled for that mode; compare legibility, bore openings, mobile performance and unwanted visibility. Keep experiments reversible and isolated.

**Deferred, not current work:** GPU DRAW-boundary detection (terrain-only occupancy/depth overlay, eventual sparse 3D witnesses). Do not revive CPU camera-wide raycast selectors or automatically populate nodes. Details are in the archived handoff.

## Working contract

1. Inspect **current** files and public SHA before modifying anything. 👁 reports build/FPS and system state; screenshot observations are not benchmarks.
2. Make small, focused changes. Reuse solved code; preserve tap navigation, signed-field terrain, the three controls and mobile responsiveness. No speculative UI or new subsystems.
3. Publish only via existing `.github/workflows/pages.yml`; consult `bonoj/Gate/README.md` for deployment rules. **Commit ≠ live**. Confirm the displayed public SHA and visible behavior before claiming success; diagnose/retry the existing workflow if necessary.
4. For historical engineering details, use the archived handoff, source and Git history. Keep this file short and authoritative.
