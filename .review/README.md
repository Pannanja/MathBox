# Clock of Primes authoring sources

The distributable is `../orrery-of-eratosthenes.html`, a standalone page.
From this worktree's root, rebuild it with:

```sh
npm ci
npm run build
```

The build first compiles TypeScript and the inline worker from `../src` using
Vite, then runs `game-build.py`. The legacy assembly starts from `first-pass.html`, applies `revise.py`, incorporates the
clock/tape/glass sources, then runs `integrate-story.py` and `viewport-build.py`.
Use the full build; running an intermediate stage alone discards later changes.
Consolidating the remaining historical transformation layers is future work.
The Python stages use `CLOCK_HTML_OUTPUT` for staging; the new build publishes
the completed file atomically. Direct Python builds do not compile TypeScript.

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

`shifted-clock.js` adds the optional fixed-scale z−1 output overlay on the existing clock canvas. `verify-shifted-clock.cjs` checks its coordinate mapping and state preservation. `../CLOCKWORK-EQUATIONS.md` transcribes the implemented mathematical rules and distinguishes input shifts from output shifts.

`../src/math/riemann.ts` supplies positive-domain complex gamma and independent
real-axis quadrature. `riemann-views.js/css` adds selectable one-term, finite-sum,
infinite-sum and theta/xi integral views inside the existing graph. Build them
through the same full build command above. The integral views use a separate
worker (`../src/workers/integral.worker.ts`) and currently support |τ| ≤ 15;
the Euler explorer keeps its wider range. The old `riemann-math.js` source has
been retired; browser and numerical tests use the compiled TypeScript code.

```sh
python .review/riemann-reference.py
node .review/verify-riemann-math.cjs
node .review/verify-riemann.cjs
```

The first command regenerates independent mpmath reference fixtures. The math
check compares quadrature and gamma against those fixtures, checks theta symmetry
and rejects divergent integrals. The browser check covers worker results, state
preservation, invalid-domain feedback, integration scrubbing, tiny-scale zoom,
responsive layouts and returning to the Euler view.

The proposed next-stage architecture, mathematical arm constructions, delivery
order and independently assignable tasks are in
[`RIEMANN-VISUALIZATION-PLAN.md`](../RIEMANN-VISUALIZATION-PLAN.md).

The prime-power arm is implemented in `../src/math/log-arm.ts`,
`../src/render/arm.ts` and `../src/scenes/log-arm.ts`. `riemann-views.js` contains
the selector, shared controls and legacy event connections. The existing
`linked-regions.js` emphasizes the active prime-power pane within its family.
`node tests/log-arm.cjs` exercises real hover/pin and transport controls,
continuous growth/reversal, folding/expansion, replay, layouts and mode changes.


The ξ paired arm uses `../src/math/xi-arm.ts` and `../src/scenes/xi-arm.ts`,
sharing the same renderer and legacy selector. Its quadrature nodes do not map
to prime panes. `node tests/xi-arm.cjs` checks its numerical reconstruction,
conjugacy, reflection, cancellation estimates and folded endpoints against
independent fixtures. `node tests/xi-scene.cjs` checks real graph interaction,
first-zero closure, replay, clock independence, range feedback and layouts.


`riemann-views.js/css` now provides visible Build/Integrate navigation instead of
a dropdown. Both arm views show all vectors by default; folding is optional.
`../src/render/complex-plane.ts` draws the axes and labelled input critical strip
in every mathematical view. `node tests/explorer-orientation.cjs` verifies those
shared guides, current-view naming, state preservation and responsive navigation.


Explain view now provides a readable description and experiment for each mode.
`src/core/view-domains.ts` supplies the numerical limits and slider-domain tracks.
Xi symmetry supports |τ|≤35; the other integral views and ξ rotations remain at
|τ|≤15. `node tests/theta-range.cjs` checks 70 additional independent fixtures;
`node tests/view-domains.cjs` exercises explanations, range fitting, domain cues
and rejection/recovery. Regenerate fixtures with `python reference/theta-range.py`.
