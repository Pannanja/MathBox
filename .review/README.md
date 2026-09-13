# Clock of Primes authoring sources

The distributable is `../orrery-of-eratosthenes.html`, a standalone page.
From this worktree's root, rebuild it with:

```sh
python .review/game-build.py
```

The build starts from `first-pass.html`, applies `revise.py`, incorporates the
clock/tape/glass sources, then runs `integrate-story.py` and `viewport-build.py`.
Use the full build; running an intermediate stage alone discards later changes.
Consolidating these historical transformation layers is future maintenance work.

The later authoring modules, in order, are:

- `analytic-views.js/css`: exact complex inputs, sum/product plot and view scale.
- `linked-regions.js/css`: hover/pin prime-family selection and sector shading.
- `euler-workspace.js/css`: shared workspace and complementary-sector readout.
- `complex-exploration.js/css`: shared-plane gestures, conjugate paths and Guide.
- `zeta-locus.js/css`: extended evaluator, worker streaming, caches and live preview.
- `friendly-explorer.js/css`: simplified input dock, Options and unlocked dragging.

Current browser checks:

```sh
node .review/verify-friendly.cjs
node .review/verify-zeta-locus.cjs
```

The first checks real pointer input, preview latency, options and five viewport
sizes. The second checks high-precision reference agreement, streaming before
completion, immutable received prefixes, cancellation, cache reuse, pole breaks
and layout. It includes longer worker benchmarks through τ=1000.

These development harnesses use this workstation's Playwright package and Chrome
executable paths; update those paths for another machine. They generate local
screenshots. Reference fixtures are included in `zeta-reference.json`; regenerate
them with `python .review/zeta-reference.py` (requires mpmath).

Older tracked `verify-viewport`, `verify-j`, `verify-bridge` and `verify-analytic`
checks retain historical UI assumptions. They are not the current acceptance
suite. Local screenshots and untracked superseded experiments are excluded from
this checkpoint. See `../CLOCK-OF-PRIMES.NOTES.md` for mathematical scope,
measurements, design history and the next σ/τ clockwork geometry task.
