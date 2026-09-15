# Clock of Primes

An interactive prime clock and complex-function explorer. Open
`orrery-of-eratosthenes.html` directly, including offline.

**Development**

Requires Node 20.18+ compatible with Vite 6, npm, and Python 3. Vite 6.4.3 is
pinned for the workstation's Node 20.18 runtime; TypeScript is pinned to 5.9.3.

```sh
npm ci
npm run dev
```

Open the printed localhost address. Editing TypeScript under `src/` or authoring
files under `.review/` rebuilds and reloads the page. Reloading resets the current
exploration. Development transformation does not check types; use
`npm run typecheck` separately. Changes to the build scripts require a restart.

```sh
npm run build
npm test
```

`build` checks types, bundles the math and integral worker, runs the legacy page
assembly, and publishes `orrery-of-eratosthenes.html` plus `dist/index.html`.
Both are self-contained. Intermediate files live in `.build/`; the published
page is replaced only after assembly succeeds. Set `PYTHON` to a Python
executable path if it is not available as `python`.

`test` builds first, then checks clock snapshots, prime-power identities and
346 independent numerical reference cases, 70 additional theta-window cases,
and the ξ arm against 34 of the
theta references. Python/mpmath is needed only to
regenerate the committed reference fixtures:

```sh
python reference/log-euler.py
python .review/riemann-reference.py
```

**Current module boundary**

- `src/core`: typed complex values, prime-power sources, integral results and
  stateless pane snapshots. A sum term completes at q; pane growth completes at
  q+1. These events are intentionally distinct.
- `src/math/riemann.ts`: the existing gamma and integral calculations, extracted
  into TypeScript. The current integral domain is 0<σ≤3, |τ|≤15 (|τ|≤35 for ξ symmetry); its infinite
  kernel additionally requires σ>1.
- `src/math/log-euler.ts`: finite prime-power contributions q^(−s)/k, with source
  identities and ledger weights. Its finite cutoff differs from a finite Euler
  product. `log-arm.ts` applies the pane's continuous birth/growth schedule.
- `src/render/complex-plane.ts`: the shared zero axes, labelled input critical
  strip, critical line and offscreen orientation used by all seven views.
- `src/render/arm.ts`: generic tip-to-tail layout, exact folding of consecutive
  contributors, hit geometry and prefix replay.
- `src/scenes/log-arm.ts`: the **Build → Prime powers** view. Select it above
  the graph, use Fit curve, and step through a pane birth. Hover a vector to link
  its prime family; click to pin its pane. Click a dashed group to expand terms.
  All arrows are visible by default. Options can fold unselected terms while
  retaining the full chain as context.
- `src/math/xi-arm.ts` and `src/scenes/xi-arm.ts`: **Build → ξ rotations**.
  At σ=½, vary τ and watch equal-radius, opposite-angle pairs cancel vertically.
  Change σ to unbalance the radii. Fit curve shows the full chain; hover/click
  inspects/pins a pair. Supported window: 0.2≤σ≤3, |τ|≤15. Quadrature nodes are
  independent of clock time; these are integral samples, not prime powers.
- `src/workers/integral.worker.ts`: a real module worker bundled inline for
  offline use. It imports the same math module as the main-thread evaluator.
- `src/legacy-adapter.ts`: the single `ClockMath` bridge consumed by the existing
  page. Most UI/clock code is still JavaScript; this is an incremental migration.
- `.review`: historical visual sources and assembly stages. See its README.

Use `npm run build` rather than invoking an intermediate Python stage. The
Python assembly still supports direct execution after a bundle exists, but it
does not compile changed TypeScript. No duplicate JavaScript source of the
Riemann mathematics is maintained.

**Browser verification**

The existing browser harnesses use this workstation's Playwright and Chrome
paths; adjust their imports/executable paths on another machine.

```sh
node tests/standalone.cjs
node .review/verify-riemann.cjs
node .review/verify-friendly.cjs
node tests/log-arm.cjs
node tests/xi-scene.cjs
node tests/explorer-orientation.cjs
node tests/view-domains.cjs
```

With the development server running, `node tests/dev.cjs` checks its root route,
automatic TypeScript rebuild/reload and worker execution. It updates a source
file's modification time without changing its contents.

The mathematical and visual roadmap is in
[RIEMANN-VISUALIZATION-PLAN.md](RIEMANN-VISUALIZATION-PLAN.md). Changes and
validation history are in [CLOCK-OF-PRIMES.NOTES.md](CLOCK-OF-PRIMES.NOTES.md).
The current interface audit, visual guidelines, and implementation checklist are
in [PRESENTATION-REDESIGN.md](PRESENTATION-REDESIGN.md).


**Published site**

[Clock of Primes](https://pannanja.github.io/MathBox/) is served by GitHub Pages
from `gh-pages` at its root. `main` contains the source and standalone HTML.
To release, run `npm ci` and `npm test` on main, then copy `dist/index.html` into
`index.html` in a separate gh-pages worktree. Commit that build and push gh-pages.
The deployment branch contains `.nojekyll` and `build.json` recording its source
commit. Keep development sources and historical experiments on source branches.

The first main release incorporates the visual worktree's continuous clock,
TypeScript numerical modules, prime-power and xi arms, shared coordinates,
view explanations and domain-aware sliders. The earlier `orrery-story` branch
and its separate local edits are preserved.
