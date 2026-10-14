# Hermeticon Eye — Behavioral Specification
2026-10-14 · Canonical restart contract

> **Status:** Approved behavioral intent recovered from the user's requests and existing eye design notes. This document is the specification for a future clean restart, **not** a claim that the present implementation satisfies it. Do not treat historical workarounds as requirements.

## Purpose and identity
A floating, faintly amused naturalist inhabits the persistent terrain-world of the Hermeticon. He is an autonomous observer, **not a pet, player follower, camera accessory, scripted performer, or decorative eyeball**. His personality emerges from perception, sustained attention, memory, inclination, and physical circumstances.

He is indolent and gently entertained. He can be comfortable doing nothing. Curiosity is selective, and watching is an action in its own right. He should spend more time observing than traveling, without losing the ability to explore purposefully.

## Behavioral repertoire — relative tendencies, not mandatory timers
1. **Idle observation (default):** quietly watch the world, with gentle gaze changes and physical station-keeping.
2. **Casual interest:** visually track a creature, event, or change without approaching.
3. **Sustained fascination:** maintain attention to something unusual across time, perhaps longer than expected.
4. **Investigation (occasional):** choose a physically reachable vantage point when movement would genuinely improve observation.
5. **Glass visit (rare):** notice and inspect the observer beyond the glass. This is a possible interest, not a compulsory navigation target.
6. **Repositioning:** drift or travel elsewhere when the present view is uninteresting or obstructed.
7. **Underground exploration:** meaningfully explore beneath terrain, navigating through openings large enough for his entire spherical body. This is a real capability, not an occasional scripted dip.

He can make purposeful, sometimes rapid darts. Laziness must not become immobility or an excuse for ineffective exploration. No invented fixed idle percentages, compulsory schedules, arbitrary goals, or hardcoded destination cycles.

## Perception → attention → action
- **Perception:** use the world's existing semantic objects, populations, events, and spatial state; respect meaningful range, line of sight, and occlusion. Do not invent a parallel world model solely for the eye.
- **Attention:** acquire interests, sustain them, reconsider them, lose interest, and remember encounters. New stimuli do not automatically override existing attention.
- **Gaze:** looking is independent of approaching. He can follow an interest from where he is.
- **Movement:** only occasionally request a better vantage, route, or exploration destination. Movement is subordinate to attention, not the other way around.
- **Feedback:** changed vantage changes perception, allowing new interests to emerge. The creature should not be reduced to a fixed state-machine performance.

Prior art: the Betwixt Observer in `bonoj/Interstice/betwixt/index.html` demonstrated sensor range, terrain line of sight, acquisition dwell, target retention, smooth gaze, and coordinated brass carriage. Reuse these principles, **not** combat pursuit or relentless target chasing.

## Physical embodiment and locomotion
- The eye occupies an actual spherical volume, not a point.
- Fly freely in three dimensions, with inertia, acceleration, braking, gentle buoyant bobbing, lateral corrections, and station-keeping even while mentally idle.
- Respect full-body collision with terrain and relevant solid obstacles. Test continuous swept volume rather than relying on a handful of axial probes.
- Explore both above and below terrain; traverse sufficiently large bores using viable routes rather than assuming a clear destination implies a clear path.
- Choose vantage points that are actually reachable.
- The Wanderer's movement is **never** an instruction to follow or relocate.

## Anatomy and articulation
- Miniature spherical glass Hermeticon body/enclosure.
- Eyeball built from BBs, with sclera, iris, and pupil.
- Iris defines forward/gaze direction.
- Brass meridian stays mechanically aligned with the iris, orbiting/articulating around the glass as the eye turns.
- Glass remains spatially steady; do not tumble the entire glass sphere merely to turn the gaze.
- Gaze changes can occur independently of translation.

## Existence, coordinate frames, and visibility
**Existence is independent of visibility.** The eye owns a persistent terrain/world position, identity, attention, memory, and ongoing simulation. The Wanderer scrolls the *view* over the world; scrolling does not displace the eye in terrain/world coordinates, force him to chase the viewport, or reset his intentions.

- When entirely outside the visible Hermeticon, **stop rendering** the eye; **do not despawn, freeze, reset, or teleport** him.
- Continue perception, memory, and autonomous behavior while he is out of view.
- If the Wanderer returns to his location, render him again (unless he has moved elsewhere under his own power).
- The glass viewing boundary is **not a leash** or behavioral goal. Do not reintroduce moving-wall correction, forced containment, or collision-recovery behavior merely to keep him in view.
- Exact geometric clipping at the boundary versus whole-object culling is a rendering implementation question; the current whole-object cull is not exact clipping.
- This specifies continuity **within a running session**. Save/load persistence across browser reloads has not been requested or defined.

## System boundaries
1. **Perception** consumes existing world state and observations; does not own world data.
2. **Attention and memory** select and retain interests, independent of locomotion.
3. **Locomotion and collision** implement physical movement and obstacle constraints without deciding what is interesting.
4. **Ocular assembly** tracks gaze independently of body translation.
5. **Presentation** determines rendering visibility without changing simulation state.
6. **Genesis integration** mounts, updates, observes, and inspects the creature without dictating its behavior.

Shared composables can be reused if they satisfy these boundaries. No previous implementation is automatically authoritative.

## Nonrequirements and rejected implementation baggage
Do **not** inherit arbitrary three-to-ten-second pauses, hardcoded probabilities of idleness, repetitive glass-inspection destinations, viewport-following, wall-enforced relocation, teleports, suspension on scroll collision, or opportunistic bore selection disguised as navigation. These were implementation inventions, not the user's behavioral requirements.

## Open design decisions — do not silently invent answers
- Precise sensory representation and observation sampling.
- Navigation/path-planning method for full-body clearance and underground travel.
- Memory capacity, habituation, and forgetting model.
- Exact visual clipping policy at the spherical viewing boundary.
- Whether and how persistence across page reloads should work.

## Acceptance scenarios for the restart
1. Watch an interesting creature from a distance without automatically approaching.
2. Sustain attention through unrelated stimuli and gentle idle movement.
3. Investigate when a better vantage is useful; demonstrate smooth acceleration and braking.
4. Navigate a real sphere-clear opening into the underworld and spend meaningful time exploring there.
5. Move the Wanderer far away: eye ceases rendering but continues simulating at stable terrain/world coordinates. Return: eye appears again if still nearby.
6. Look around: iris and brass articulate together while the glass remains steady.
7. Verify terrain and obstacle collision without special Hermeticon containment rules.
8. Expose observable evidence of perception, attention, movement, and continuity; do not substitute visual impression for validation.

## Implementation status
This is a **future restart specification**, not a completed implementation. The previous eye code and moving-wall experiments remain historical references. The live behavior, exact visibility handling, and autonomy acceptance scenarios have not been verified.
