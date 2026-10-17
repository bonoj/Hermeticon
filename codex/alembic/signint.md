# SIGINT — Alembic working note

> Status: exploratory concept, not an implementation authorization.  
> First geography: Strait of Hormuz; later extend to Persian Gulf, Gulf of Oman, Gulf of Aden, and Red Sea.  
> Home: `Hermeticon/codex/alembic/signint.md`.

## Idea

**Alembic** is an incubator for ideas that distill heterogeneous observations into meaningful, inspectable signals. The name may also inform a future canopy icon or visual identity; no icon design has been approved or built.

Build a **maritime observation Hermeticon** beginning with the Strait of Hormuz. Use recognizable geography and a shared clock/coordinate system to synthesize weather, marine conditions, public shipping patterns, published reports, historical records, and synthetic projections into an explorable world.

**Zip** means *compose or reduce data streams into meaningful metrics*, **not** ZIP file compression. A zipped metric should retain traceability to its constituent streams, transformations, timestamps, spatial resolution, missingness, and uncertainty. Different metrics may disagree; avoid a single unexplained regional score.

## Layer distinctions

- **Observed:** public, time-stamped environmental and maritime observations with source and freshness.
- **Historical:** recorded datasets and reports for replay and comparison.
- **Synthetic:** explicitly labeled modeled flows, forecasts, and what-if scenarios; never represented as observations.
- **Derived:** composite signals formed from the above, with drill-down to contributing evidence.

Examples: vessel-flow deviation relative to baseline; wind/wave/traffic conditions; port throughput proxy; temporal correlation of reported events with commercial traffic changes. These are hypotheses for useful metrics, not established findings.

## Initial experience

A small, legible Strait of Hormuz world: Iranian coast to the north, Musandam/Oman to the south, islands, maritime corridors, and an expressive sea surface. Weather and sea state can be live/near-real-time where sources allow; shipping data may be delayed, licensed, sparse, or historical. Show data age and provenance prominently. A synthetic vessel stream can demonstrate motion before real feeds are available.

Allow tap-to-focus on places, phenomena, and compact anchored report cards. Support a clock with live conditions, historical replay, and hypothetical scenario modes. Phone-first, coarse where useful, and grounded in existing Hermeticon/Abyss runtime and material BB grammar.

## Collection and reporting contract

**World geography → source observations → transforms / zip → derived metrics → visual consequence → inspectable report.**

Preserve source URLs, observation and ingestion timestamps, spatial/temporal resolution, assumptions, transformations, and uncertainty. Do not let synthetic world truth leak into observational inference. Historical reporting should remain distinguishable from inference.

Use publicly available civilian and environmental sources. Do not reconstruct sensitive collection capabilities or operational surveillance coverage, or provide precise live tracking of military assets. This is an open-source maritime synthesis and educational/research experience, not a classified collection replica.

## Potential data families (verify before implementation)

- Marine forecasts, wind, waves, currents, temperature, and environmental conditions.
- Public commercial shipping activity, aggregated or historical AIS-derived traffic, and port statistics where terms permit.
- Public maritime notices and incident reporting with citations and time provenance.
- Synthetic scenarios and model projections, explicitly labeled and bounded.

Source availability, update cadence, license, accuracy, and API constraints need inspection before choosing integrations. No realtime feed is claimed connected.

## Open questions

- Which two or three zipped metrics convey the most useful first insights?
- What resolution and update cadence actually improve understanding?
- How should material BB streams depict data age, flow, uncertainty, and transformations?
- Should Alembic become a general reusable stream-synthesis instrument and perhaps a canopy icon?
- What existing Athanor/Arcana/Codex machinery can be reused without new infrastructure?

## Next step when authorized

Inspect existing repository contracts and observation/deployment machinery; verify candidate public data sources; write a minimal working specification for a single Strait of Hormuz scene. Do not build or deploy until explicitly requested.
