# Wanderer — shared implementation and retained example

This directory began as a mechanical extraction of the original Hermeticon monolith. It is **now the authoritative application source** for both the root Hermeticon entrance and this preserved example. The original monolith is archived at `archive/legacy-monolith/index.html`.

- `index.html`: example entry, using local assets.
- `interface.css`: shared interface styles.
- `errors.js`: shared error capture.
- `world.js`: shared simulation, rendering, camera, controls, and UI logic.

The root `/index.html` references these same assets via `./examples/wanderer-separated/`; **do not fork the implementation into the root**. File separation does not yet imply clean behavioral separation: world, camera, and UI remain coupled in `world.js`. Preserve their behavior during future refactoring.

The Pages workflow stamps the deployed commit SHA into `world.js` and cache-busts asset references for **both** entry points. The build number on the live page is the first eight characters of the deployed Hermeticon commit, not the original JIT source commit. The unstamped repository source is not itself a deployed build.

For publication, failure recovery, and engineering contracts, see the root `README.md` and `HANDOFF.md`. Both URLs must stay functional.

## Simulation notes

The [world-generation experiment](WORLD_GENERATION_EXPERIMENT.md) preserves the original map interpretation and historical atlas research; distinguish author-confirmed geography from provisional generation and unimplemented plans. `world.js` contains the 22 authored terrain nodes and the local Quills, Amaranthine Fields, and Mists systems. Wanderer fire temporarily takes over navigation; each burst releases a persistent 500-BB population (125 blood, 375 solid), stored for now in local particle and instancing batches. These BBs must remain dynamic under gravity and geological contact as the terrain translates; a rest flag must not freeze them. Aperture clipping affects pixels, not material state or ownership. See root `HANDOFF.md` for the current implementation contracts and unresolved validation.

## Landmark activity — 2026-10-13

**Working creative inventory: 4 active / 18 open for authored activity** among 22 named geographic landmarks. This counts participation in a scene, not only independently scripted residents.

- **Quills:** turquoise resident opens/closes a nine-quill fan near Wanderer.
- **Amaranthine Fields:** violet gardener and seven responsive flowers.
- **Mists:** animated reed population and a fleeing/jumping fugitive, with a red-particle splat.
- **Downton:** participates in the Mists fugitive's flight/destination encounter; a cloud is currently overhead in the observed scene. Do not infer a dedicated Downton script or cloud ownership from this classification.

The remaining **18 landmarks are open creative territory**, not places without authored identity. Their map-derived descriptions and author clarifications are in [WORLD_GENERATION_EXPERIMENT.md](WORLD_GENERATION_EXPERIMENT.md). Develop activities consistent with those identities without silently canonizing provisional terrain, materials, or speculative lore. This is a planning/observation inventory, not a runtime-verified census of every ambient system.

## Eighteen encounters awaiting incarnation — creative proposals (2026-10-13)

These are **proposed experiences, not implemented behaviors or canonical lore**. The source-map observations in [WORLD_GENERATION_EXPERIMENT.md](WORLD_GENERATION_EXPERIMENT.md) take precedence over any invention below. Each is a small, inspectable *cause → response → consequence* rather than a decorative animation. **[Grim]** or **[Subversion]** marks an intentional dark turn or inversion of expectation (12 of 18). The atlas's 2D jurisdiction, elevation, hydrology, strata, provenance, population, and feature fields can seed these; macro entities can be assembled from reusable grammars (hinges, rings, branches, chains, shells, articulated towers), and microstructure from bounded BB lattices. These are design ingredients, **not claims of existing general-purpose runtime systems**.

1. **Summerlands — The Sun That Borrows [Subversion].** In the yellow jurisdiction, tiny sunflowers turn to follow Wanderer; their collective shadows converge instead of diverging. At dusk the shadow silhouettes rise as delicate jointed creatures and politely return the light they borrowed, leaving one flower temporarily colorless. *Grammar:* petal fans + shadow-branch skeletons. *Maps:* region mask, light/exposure, local cover. *Test:* moving Wanderer changes orientation, not regional identity; the borrowed-light patch persists briefly after departure.

2. **Winter King's Realm — Coronation of Frost [Grim].** Snowflakes accrete on a bare, empty throne. A procession of minute crystalline figures builds a crown, crowns one of their own, and the newly crowned figure freezes motionless as the procession immediately begins preparing its successor. Nothing attacks Wanderer. *Grammar:* crystal lattice → articulated procession → crown. *Maps:* cold jurisdiction, ridge relief, population. *Test:* one complete succession without duplicating the crown's BB inventory.

3. **Ice Vale — The Unsent Caravan [Grim].** The off-map arrow becomes a direction of longing, not an invented local basin: on a high pass, tiny sled lights march toward Ice Vale, disappear at the edge of known geography, and later one light returns alone carrying an extra shadow. *Grammar:* linked sleds and light-bearing agents. *Maps:* feature/route vectors and confidence. *Test:* the route ends at an explicit unknown boundary; do not fabricate an Ice Vale destination.

4. **Gradient — The Border That Refuses to Choose [Subversion].** A traveling band of little weather vanes changes from golden petals to blue icicles as it crosses the liminal strip. In the center, the vanes split into two synchronized halves and briefly disagree about which way the wind blows. *Grammar:* morphable hinge lattice. *Maps:* continuous transition weight, not a hard region split or forced height step. *Test:* reversible, continuous behavior when traversed both directions.

5. **Heart of Darkness — A Very Small Lighthouse [Subversion, Grim].** The central dark landmark holds a lighthouse the size of a thumb, casting a rotating cone that illuminates everything except its keeper. On each sweep, previously unseen tiny footprints appear approaching the lamp; the keeper remains absent. *Grammar:* stacked rings, rotating optic, footprint BB stamps. *Maps:* landmark footprint and authored dark-zone jurisdiction. *Test:* footprints accumulate under a bounded budget and remain distinct from physical matter unless explicitly promoted.

6. **Bood Lakes — The Choir Below [Grim].** Separate red liquid basins ring with different pitches as droplets strike them. A submerged lattice of bell-like organisms answers in harmony; disturb one basin and the other lakes fall silent before answering a beat late. The liquid's composition stays **unknown** despite its color. *Grammar:* hanging bell lattices. *Maps:* independent hydrology basin IDs, connectivity explicitly unknown. *Test:* sound/response coupling is a designed signal, not a false claim of proven underground water connection.

7. **Jade Peak — The Mountain That Sheds [Subversion].** A green-tipped peak slowly grows a paper-thin articulated skin; the skin peels away as a magnificent origami dragon, flies one loop, and settles as a tiny ridge of folds. The peak remains rock, not confirmed jade ore. *Grammar:* hinged triangular mesh with fold constraints. *Maps:* peak elevation, slope, feature origin. *Test:* shed material has explicit origin and bounded quantity if treated as matter.

8. **Silverpass and Gemgates — Customs for Impossible Cargo [Subversion].** Three colored gates inspect passing BB caravans. One permits only spheres, one only shadows, and one only objects that have been somewhere else. A caravan must rearrange itself to pass, then remembers its previous configuration. *Grammar:* gate arches + reconfigurable bead cargo. *Maps:* pass corridor, feature gates, material provenance. *Test:* origin history, not rendered color, determines the third gate's decision.

9. **Cinderglade and Fell Crater — The Fire Brigade [Grim, Subversion].** A regiment of tiny conifer firefighters marches toward the glowing crater, carrying buckets. Instead of extinguishing the fire, they carefully feed it embers; each sacrificed tree becomes a dark seed that later sprouts on cooled ground. *Grammar:* walking branch-figures + bucket chain. *Maps:* forest cover, crater feature, thermal candidate field. *Test:* any burn/seed conversion must reconcile material units; lava and heat remain hypotheses until implemented.

10. **Whisperwood — The Trees Are Listening [Grim].** Branches bend toward Wanderer's footsteps, not toward the camera. When Wanderer stops, the trees hold perfectly still; a delayed wave of branch movement reveals that something unseen is following the same route several paces behind. *Grammar:* branching IK skeletons with shared delay buffers. *Maps:* sparse woodland density and local path history. *Test:* orbiting the camera cannot alter listening or pursuit clocks.

11. **Brambles — The Courteous Maze [Subversion].** Thorn hedges part to offer Wanderer a path. Each accepted shortcut quietly closes a different route behind, until the brambles form an elegant topiary portrait of Wanderer viewed from above. The portrait dissolves when Wanderer refuses the next invitation. *Grammar:* branching growth lattice and pruning. *Maps:* vegetation density, navigability, local path occupancy. *Test:* never seal every escape route; topology and navigation remain inspectable.

12. **Rift — The Seamstress [Grim].** A spindly creature stitches the fractured surface with bright threads, pulling opposite lips together. Its repairs hold until a deep pulse passes through, then snap into a shower of BBs; the seamstress calmly gathers every thread to begin again. *Grammar:* multi-arm walker + tensioned thread lattice. *Maps:* fracture feature and relief, without presuming an actual deep chasm. *Test:* visible repair and break are either real terrain mutations or clearly labeled visual proxies.

13. **Spill — The Waterfall That Climbs [Subversion].** At the coastal inlet, a ribbon of droplets climbs upward in orderly single file, pauses to salute a descending drop, then collapses into ordinary falling water when Wanderer interrupts the line. *Grammar:* bead-chain procession with a reversible flow controller. *Maps:* coastal water boundary, local height gradient. *Test:* reversal is a deliberately exceptional local behavior, not a global hydrology rule.

14. **Redwall — The Night Watch [Grim].** Little sentries patrol the segmented fortification carrying lanterns. When the final lantern reaches a gate, every sentry is revealed to be an empty suit of armor, and the lanterns continue the patrol on their own. *Grammar:* modular armor shells + autonomous light carriers. *Maps:* linear wall feature and gate locations. *Test:* patrol follows wall geometry rather than treating Redwall as a mountain ridge.

15. **Upton — The Clockwork Evacuation [Grim].** A settlement of miniature houses sprouts legs and flees an approaching bell toll; the inhabitants stay behind, waving from doorways that no longer have buildings. At the last toll the houses return and politely reassemble around the wrong families. *Grammar:* fold-out house walkers, socketed settlement footprints. *Maps:* built cover, feature footprint, route graph. *Test:* buildings return to persistent positions with a detectable deliberate permutation, not random teleportation.

16. **Kindle Tower — The Keeper of the Last Match [Grim].** The flame atop the island tower is tended by a tiny keeper who lights one match per approaching storm. Each match births a miniature constellation overhead, but costs the tower a single glowing brick. When the keeper runs out, the constellations briefly become a roof. *Grammar:* stackable tower masonry + orbiting light lattice. *Maps:* island footprint, coastal exposure, tower feature. *Test:* brick-to-light exchange is accounted for if promoted from visual metaphor to conserved material.

17. **Violet Coast — The Tide's Tailor [Subversion].** The shore hems incoming waves with a line of violet BB stitches. Each finished hem transforms a breaking wave into a fluttering fabric creature that crawls ashore, shakes itself dry, and unravels back into the tide. *Grammar:* sheet lattice, stitched edge constraints, reversible assembly. *Maps:* coastline distance field and wet/dry band. *Test:* no silent BB creation or deletion when a sheet changes representation.

18. **Ocean of Tears — The Shipwreck That Remembers [Grim].** An empty skeletal ship assembles itself from drifting fragments, sails a short circuit, then disassembles precisely where it first sank. On subsequent visits it remembers one more missing piece, eventually revealing the silhouette of a passenger who never boards. *Grammar:* modular hull ribs, joints, floating fragments. *Maps:* open-water domain, local depth as unresolved parameter, feature memory. *Test:* vessel history survives aperture departure; no invented ocean-floor depth is required.

### Execution discipline

- **First prove one local seam:** a recognizable arrival, one response to Wanderer or world state, one persistent or reversible consequence. No global agent framework required.
- **World coordinates own history; aperture owns presentation.** Out-of-view must not mean erased. Camera movement alone must not trigger events.
- **Use source versus invention explicitly.** The 2D map is geographic evidence; these encounters are speculative authored proposals. Keep unknown geology, hydrology, biology and lore unknown until decided.
- **Keep budgets bounded.** Small macro grammars and BB lattices should be CPU/phone-first, instrumentable, and composable; avoid 18 always-running heavy simulations.
- **Instrument the surprise.** Each experiment should expose state, transition, counts, ownership and build identity so an observer can distinguish intended magic from a bug.
