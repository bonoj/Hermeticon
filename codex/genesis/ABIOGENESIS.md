# Abiogenesis — L0 vacuum impulse contract (2026-10-15)

Supersedes the earlier continuous inverse-square vacuum implementation after observed ~30fps and insufficient pull.

- Each tap on Abiogenesis fires **one** vacuum pulse, consumed before terrain navigation. No on/off state.
- On tap, scan Genesis-owned detached BBs within radius 3 Genesis units **once**. Cancel outward radial velocity and add a strong inward impulse (initial tuning: 45 velocity units). Ordinary physics then resumes, with no per-frame attraction.
- Mark only affected BBs as vacuum-eligible. On their subsequent inward crossing of Abiogenesis's exterior, transfer the existing BB once into Abiogenesis ownership and local coordinates. Do not clone or delete.
- BBs without vacuum eligibility bounce from exterior glass. Captured BBs always experience ordinary gravity and collide with inner glass, regardless of subsequent pulses.
- Captured BBs are unaffected by later pulses; L0 stationkeeping remains independent.
- Single authoritative BB inventory. Inspect pulse count, affected count, capture count, interior/exterior hits and ownership. No population caps.
- Preserve accepted terrain, Hybrid, gardens, glass and brass.
- Source commits do not prove deployed runtime or visual behavior.

## Collision broadphase (2026-10-15)

Passive exterior bouncing and vacuum-tagged capture share a swept axis-aligned bounding-box rejection against the moving cradle. Only candidate crossings compute squared spherical distances; square root is reserved for actual exterior contact normals. This avoids unconditional per-BB distance/hypotenuse work across physics substeps. A vacuum ticket expires when its bead exits the local jurisdiction. Captured beads use inner-glass confinement. The author reported ~41fps before taps with 20,207 loose BBs and ~15.9ms physics; the optimization is committed but **not yet benchmarked**.
