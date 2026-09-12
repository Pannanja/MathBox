# Clock of Primes authoring sources

The distributable is `../orrery-of-eratosthenes.html`, a standalone page.
From the repository root, rebuild it with:

```sh
python .review/game-build.py
```

The build starts from `first-pass.html`, applies `revise.py`, incorporates the
clock/tape/glass sources, then runs `integrate-story.py` and `viewport-build.py`.
The final viewport and analytic modules override earlier exploratory behaviour.
Use the full build, not an intermediate script alone. Consolidating these
historical transformation layers is future maintenance work.

Current browser checks:

```sh
node .review/verify-viewport.cjs
node .review/verify-j.cjs
node .review/verify-bridge.cjs
node .review/verify-analytic.cjs
```

These development harnesses currently use this workstation's Playwright package
and Chrome executable paths; update the paths for another machine. They generate
local screenshots. Historical snapshots, screenshots and superseded checks are
not part of this checkpoint. See `../CLOCK-OF-PRIMES.NOTES.md` for mathematical
scope, validation and the requested next-work list.
