# Arcana Creatures — First Bestiary

## Implemented trial: Pebbleback

`first-bestiary.js` exports `createFirstBestiary(T,{surface,offset,wanderer,parent,seed,radius})` with `{group,update,inspect,dispose}`.

Six seeded creatures are generated near spawn (subject to valid signed-field support). Anatomy is entirely BB spheres rendered with a single shared `InstancedMesh`: seven armored body sections, six bead-chain legs, two antennae and eyes. Behavior is bounded deterministic wandering, conservative center and lateral terrain-support checks, articulated gait oscillation, and Wanderer-proximity defensive curling. Coordinates remain geological and receive camera offset only for presentation.

**Limitations:** This is a first playable anatomy/motion trial, not the complete six-species bestiary. The other five species (Velvet Drifter, Glasswing, Lantern Hermit, Bellwraith, Threadwyrm) are not yet implemented. Legs animate but are not individually IK-grounded. Curl is a pose contraction, not a full spherical shell fold. No feeding, material transactions, advanced pathfinding, or live FPS verification is claimed. Preserve the twelve accepted botanical populations.


## Velvet Drifters — implemented trial

`velvet-drifters.js` exports `createVelvetDrifters(T,{surface,offset,wanderer,parent,seed,radius})`. Up to four deterministic BB-only creatures, each with 17 tapering body sections, bead-chain lateral tendrils, and eye kernels. Traveling peristaltic pose waves, autonomous foraging, Wanderer avoidance and conservative geological support checks. One shared instanced sphere mesh. No actual material collection, IK, or live performance validation claimed.


## Threadwyrms — implemented trial

`threadwyrms.js` exports `createThreadwyrms(T,{surface,offset,wanderer,parent,seed,radius})`. Up to three deterministic BB-only segmented creatures with 24 body segments, lateral bead appendages, trailing geological position history, animated undulation, conservative support checks, bounded wandering and Wanderer avoidance. Single shared instanced BB mesh. **Limitations:** Existing-hole entry/emergence and true burrowing are not implemented. Trailing history is sampled per frame, not by arc length, and may need refinement to maintain consistent segment spacing across frame rates. No live visual or FPS verification yet.
