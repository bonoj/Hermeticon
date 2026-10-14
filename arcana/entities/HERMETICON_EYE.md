# Hermeticon Eye — Character and Mechanical Contract
2026-10-14 · Companion to `hermeticon-drone.js`

## Character
A floating, faintly amused naturalist who occasionally finds something worth getting out of his chair for.

He is **an eye, not a puppy**. He is always in gentle physical motion: buoyant bobbing, lateral corrections, and station keeping, even when mentally idle. Stillness is not laziness. Curiosity is not pursuit. He can see things without approaching them, and should spend most of his time watching, not traveling. His disposition is indolent, gently entertained by a world full of things to observe. He is comfortable doing nothing.

## Anatomy and kinematics
- The **glass Hermeticon sphere** is his enclosure/body. Its volume is physical, not merely its center point.
- The **iris defines forward**. His gaze changes more readily than his position.
- The **brass meridian is locked to the iris**. As his gaze rotates, the meridian *orbits around the spherical enclosure*, preserving its relationship to the iris.
- Do **not** implement this by tumbling the whole glass sphere. Use an independently articulated ocular/meridian assembly with a stable glass enclosure.
- Navigation respects the *entire spherical swept volume* against the terrain signed field, larger Hermeticon's inner glass boundary, and relevant obstacles. Six axial probes are not proof of sphere clearance.

## Behavioral contract
1. **Idle observation (default):** watch the world, slow gaze changes, continuous small station-keeping motions.
2. **Casual interest:** visually track a creature or event from the current vantage. No movement required.
3. **Sustained fascination:** hold attention on something unusual, perhaps longer than expected.
4. **Investigation (occasional):** move to a better viewing position only if there is a compelling reason.
5. **Glass visit (rare):** notice the observer beyond the glass and approach for mutual inspection.
6. **Repositioning:** gentle, unhurried drift or movement when the current view is uninteresting or obstructed.

These are relative behavioral priorities, **not arbitrary mandatory percentages, destinations, or timers**. Don't invent goals or force constant motion.

## System separation
- **Perception:** sample the world's existing semantic state and events, with meaningful visibility/occlusion. No duplicate world model invented solely for the eye.
- **Attention:** choose, track, lose, and remember interests. Independent of locomotion. Looking does not imply approaching.
- **Locomotion:** inertia, gentle acceleration and braking, valid whole-sphere clearance, and occasional better-vantage requests. Movement is subordinate to attention.
- **Ocular assembly:** eye and meridian rotate together relative to the glass, with smooth gaze tracking.

## Prior art
Betwixt Observer in `bonoj/Interstice/betwixt/index.html`: sensor range, terrain line-of-sight, acquisition dwell, target retention, smooth ocular tracking, brass carriage quaternion copied from eye. Betwixt Foundry drones also had obstacle-aware pursuit/return routing. Reuse the principles, not the combat mission or relentless target pursuit.

## Implementation warning (as of 2026-10-14)
The 2026-10-14 redesign (commits `31eae924`, `1e2d5c91`) separates glass rotation from iris/meridian articulation, slows travel, adds idle dwell, wider viewing standoff, and attempts traversals through sampled sphere-clear bores. **Still transitional:** whole-sphere clearance uses 26 directional probes rather than an exact signed-distance sweep; bore finding is opportunistic rather than full path planning. Live runtime behavior is not verified.\n\nPlayer/Wanderer movement does not command eye movement. The Hermeticon border and terrain constrain the eye's own motion. The eye should willingly spend substantial time below the terrain if it can fit through a hole.

## Future extensions
Surprise, habituation, curiosity about meteor impacts, terrain changes, populations, other inhabitants, and the external observer can emerge from shared observation events and bounded memory. Favor legible systems over bespoke hardcoded scripts.
