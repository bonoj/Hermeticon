# The AI Adventuring Party — Hermeticon example

A **human DM** presides over four **scripted model-player stand-ins** in a three-dimensional Drowned Mill scene. The example is intentionally a prototype of the table interaction, **not** a claim of live LLM participation.

## Isolation

All authored example code is under `examples/ai-adventuring-party/`. The example **imports** the existing Athanor host (`../../athanor/athanor.js`) and Three.js. It does not modify Athanor, Genesis, Arcana, the root entry, or any existing example.

## Entry

`/Hermeticon/examples/ai-adventuring-party/`

## Controls

- Drag to orbit; pinch to zoom (provided by Athanor).
- Describe a scene in the DM text field; the party responds with authored sample dialogue.
- **Party reacts** advances to the next sample beat.
- Tap the 3D world to move one adventurer.
- The ✦ button advances the encounter; 👁 copies Athanor inspection.
- New Session resets the sample dialogue.

## Next integration seam

Replace `beats` and `react()` with independently prompted agent calls. Give each character private state and bounded knowledge; return structured intent/actions to the DM, never silently mutate the world from generated prose. Keep DM authoritative over rules, dice, world state, and consequences. Add genuine turn scheduling and human approval for consequential agent actions.

## Validation

Static source can be inspected in GitHub. Browser rendering and Pages deployment require separate runtime verification; a successful commit is not proof of either.
