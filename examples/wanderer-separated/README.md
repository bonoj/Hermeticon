# Wanderer mechanical separation — parity fixture

This fixture is a mechanical extraction of the current root `index.html`, without rewriting its logic.

- `index.html`: original DOM and element order; references external files
- `interface.css`: original CSS, byte-for-byte extracted
- `errors.js`: original global error capture, byte-for-byte extracted
- `world.js`: original module script, byte-for-byte extracted (still mixes world, camera, and UI logic)

**Important:** This is *file separation*, not yet a clean behavioral boundary. Camera and controls remain coupled inside `world.js`; do not claim otherwise. It exists to compare against the unchanged root Wanderer before any further extraction. No new camera, physics, or interface implementations were invented.

Build display in this fixture remains inherited from the original module; it is **not** the live Hermeticon commit SHA. Root Wanderer is untouched. The next task is parity testing and identifying safe, small seams for camera and controls.
