# Clock of Primes — implementation and delegation plan

14 September 2026. This is a proposed implementation sequence, not a migration
already performed. The current standalone page remains the working prototype.

Implementation update: the first TypeScript/Vite bridge is now in use. The
existing Riemann math and integral worker have been extracted; standalone export
and development reload are working. Core contribution contracts, pure pane
snapshots and the finite log-Euler module have numerical coverage. Most legacy
state/UI remains in JavaScript. The reusable renderer and first log-Euler scene
are now connected to pane growth, hover/pin selection and forward/back playback
in the existing side graph. The ξ kernel and paired-vector scene are also now
implemented for 0.2≤σ≤3, |τ|≤15, with independent reference checks, pair selection,
folding and replay. A visual comprehension review and the clock-mounted arm remain
pending. See README.md for the current build.

**First deliverable**

Add one readable mathematical arm to the existing clock. Its first mode shows
prime-power contributions to log ζ, with exact links to pane identities and J.
Its second mode reconstructs ξ from paired vectors derived from its theta
integral. Each mode names the quantity at its endpoint. Keep the existing graph,
controls, continuous clock motion, and independent reference values.

The first milestone is small: forward/back through 2, 3, 4, 8, 9 and 12, then
scrub τ through the first ξ zero. A user should be able to select one contributor
and understand its source, weight, phase and effect on the endpoint.

**The mathematical connection to use**

For σ>1, expanding the Euler logarithm gives

    log ζ(s) = Σ_p Σ_{k≥1} p^(−ks)/k.

Thus a pane q=p^k has an exact associated contribution

    b_q(s) = q^(−σ)/k · exp(−iτ log q).

Its J-ledger jump is 1/k. This gives an explicit correspondence:

    pane p^k  ↔  J jump 1/k  ↔  log ζ vector (1/k)(p^k)^(−s).

The additional 1/k is a ledger weight; it is not already supplied by the glass
transmission. Colour identifies p; magnitude is separately specified.

At finite clock time, L_Q=Σ_{p^k≤Q} b_{p^k} is a truncated logarithmic sum.
exp(L_Q) is NOT the existing finite Euler product over p≤Q: that product includes
all powers of its included primes. Show their difference and any omitted-power
remainder. Inside σ≤1, show finite contributions without claiming convergence
to an analytically continued logarithm. The series selects log ζ→0 as σ→+∞;
comparisons need that branch, not an indiscriminate principal log of ζ.

For the ξ arm, use u=(log x)/2 in the derivative form of the theta integral.
Writing Ξ(τ)=ξ(1/2+iτ), a useful normalization is

    K(u) = Σ_{n≥1} [8π²n⁴ e^(9u/2) − 12πn² e^(5u/2)] exp(−πn²e^(2u)),
    ξ(s) = ∫₀∞ K(u) cosh((s−1/2)u) du.

With δ=σ−1/2 and positive quadrature weights w_j, each sample contributes two
vectors:

    A_j = w_j K(u_j)/2,
    v_j⁺ = A_j exp(δu_j) exp(+iτu_j),
    v_j⁻ = A_j exp(−δu_j) exp(−iτu_j),
    ξ(σ+iτ) ≈ Σ_j (v_j⁺ + v_j⁻).

At σ=1/2, each pair has equal radii and opposite rotations; imaginary parts
cancel. Changing σ unbalances the two radii. Changing τ changes their angles.
This directly gives the desired geometric roles for both inputs. Quadrature
nodes are integration samples, not primes or zeta zeros.

These formulas are derived from the theta/derivative identities on printed
page 3 of the [Wilkins translation](https://www.claymath.org/wp-content/uploads/2023/04/Wilkins-translation.pdf).
A planning-time 35-digit mpmath check at five inputs, including the first zero
and an off-line symmetry pair, agreed with the gamma/zeta definition to below
1e−34 for that finite integration experiment. This checks normalization only;
production sampling, tail bounds and cancellation still need task C below.

The modern ξ normalization and reflection identity are also specified in
[DLMF 25.4](https://dlmf.nist.gov/25.4).

**Timing and geometric honesty**

- Keep clock time T, complex input (σ,τ), integral progress, and graph scale as
  separate state. At fixed s, the completed vectors do not rotate merely because
  the clock runs. An explicit τ sweep may connect τ to playback time.
- Prime-power identities provide a natural reveal schedule for the log ζ arm.
  Existing mechanics start pane q at T=q and finish its growth at T=q+1. The
  existing sum finishes term q at T=q. Name these distinct events in the API;
  do not silently shift one by a beat to force apparent agreement.
- For ξ, synchronizing quadrature-group reveals to pane births is an explanatory
  schedule. It does not turn integration nodes into prime powers. Start with an
  explicit “clock-linked reveal” option; ordinary input exploration shows the
  complete selected approximation. No automatic τ changes on pane births.
- At fixed σ the epicycle rates are ±u_j per unit τ; log ζ rates are −log q.
  Neither equals the mechanical pane rate 2π/q. Require their actual numerical
  phases to agree with the displayed equations rather than forcing beat closure.
- Define arm displacement in output units. Placing the hinge on the clock does
  not make quadrature weights geometric sector areas. Reuse the selected
  orientation, and disclose any magnification instead of changing it silently.
- ξ's complex output is real on the critical line. A graph of (τ,Ξ(τ)) has a
  different horizontal axis from the complex output plane. Label that optional
  graph explicitly; the epicycle endpoint remains the actual complex value.
- Rewind and seek reconstruct state from T and stable contributor IDs. Birth
  effects must not depend on having played every earlier frame. Start may snap;
  the clock's other navigation continues to interpolate.

**Stack recommendation**

Stay in the browser. Move new work toward TypeScript modules, Canvas 2D, Web
Workers, and a small Vite build. Keep Python/mpmath as a development reference
and precomputation tool; add FLINT when certified error bounds are needed.

The immediate structural problem is the chain of HTML text replacements and
global function wrappers, not JavaScript itself. `.review/game-build.py` currently
assembles the prototype through historical stages; `.review/viewport-build.py`
injects the newer math and UI modules. Multiple agents must not edit those shared
assembly points independently.

| Option | Assessment for this project | Decision trigger |
|---|---|---|
| JavaScript ES modules | Lowest-risk initial extraction; preserves current behavior | Use during migration; add JSDoc/types at boundaries |
| TypeScript + Vite + Canvas 2D | Clear contribution/event types and build ownership; keeps current rendering skills | Recommended destination for new modules |
| React/Svelte | Could organize a much larger control interface; neither supplies numerical correctness | Consider if DOM/state management becomes a measured maintenance problem |
| WebGL/WebGPU rendering | Potentially useful for very large path datasets | First profile representative views; retain numerical accumulation outside low-precision graphics buffers |
| Rust/C/C++ via WebAssembly | Useful if a specific numerical kernel or library warrants it | Port a measured bottleneck behind the same worker API |
| Python server | Convenient arbitrary-precision computation; adds network and deployment dependencies | Optional research service, not required for the normal page |
| Pyodide in a worker | Allows Python in-browser; adds runtime/package loading and memory | Prototype only if arbitrary precision must be available offline inside the browser |

TypeScript supports incremental adoption from JavaScript. Vite supports
TypeScript transformation and worker bundles; run a separate type-check command
because transformation alone does not type-check. See the
[TypeScript migration guide](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
and [Vite features](https://vite.dev/guide/features).
[Pyodide documents worker execution](https://pyodide.org/en/stable/usage/webworker.html).
[FLINT provides ball arithmetic and rigorous bounds](https://flintlib.org/).

Preserve a self-contained HTML export as an acceptance requirement. The regular
development build may use modules and a local server; offline export must bundle
worker code and required data without external fetches. Vite's normal static
bundle is not automatically a single file. Prove this export path before retiring
the current standalone build. Avoid a simultaneous UI rewrite.

Begin with an adapter around the legacy clock rather than extracting every
global at once. New math/render modules can use the agreed contracts immediately;
move old internals when they are touched. Keep the packaged legacy view available
until the modular view passes the same behavioral checks.

**Module boundaries to agree before delegation**

Proposed paths; these directories do not yet exist:

    src/core/          complex values, state, clock events, contribution contracts
    src/math/          log-Euler, xi kernel, reflection, zero sums, contour integrands
    src/workers/       request scheduling, sampling, cache and streamed results
    src/render/        arm geometry, paths, highlights, coordinate transforms
    src/scenes/        one scene controller per mathematical construction
    src/ui/            existing controls and explanations
    reference/         Python fixtures, source provenance and precision settings
    tests/             numerical, state/replay, browser and layout checks

Every contribution declares quantity, stable ID, source kind, parameters and
complex value. A prime-power source records p,k,q; a quadrature source records
node, weight, interval and approximation level; a zero source records the zero
and its provenance. A renderer never infers arithmetic identity from an array
index or assigns prime colours to unrelated quadrature nodes.

Every result declares the exact requested input, valid domain, truncation rule,
quadrature estimate, omitted-tail bound when available, and rounding limitations.
Unknown error stays unknown. Worker messages carry a request ID, sequence number,
parameter snapshot and refinement level; stale messages cannot update the current
curve. Stream only labelled coherent prefixes or approximations. Use Float64
typed arrays for CPU values and transferable buffers for paths.

Do not fit a path to its reference endpoint. In ξ, severe cancellation may make
a tiny endpoint unresolved even when all individual vectors are accurate. Compare
absolute error near zeros and report cancellation relative to total arm length.
Precomputed references can guide validation without pulling the live endpoint
toward a desired answer.

**Delegation board**

Difficulty: 1 routine, 2 modest, 3 substantial, 4 difficult, 5 specialist numerical
and explanatory work. Parallelism rates development independence, not how many
agents should modify the live page. Each task owns its listed modules; one
integrator owns the entry point, shared layout, manifests and generated HTML.

| ID | Deliverable and ownership | Difficulty | Parallelism | Depends on | Acceptance |
|---|---|---:|---|---|---|
| A | Extract stable core/state and agree contracts; `core`, build and entry point | 3 | Low: one owner | Existing baseline | Current page behavior, streaming latency and offline export preserved |
| B | Independent reference corpus; `reference` and numerical fixture tests | 3 | High: start now | None | Values, derivatives/symmetries, zero/pole cases, provenance and precision recorded |
| C | Xi quadrature and paired-vector generator; `math/xi`, its worker/tests | 4 | High: derive now, use A contracts | B for validation | Endpoint agrees within a stated error budget; stable nodes over declared τ window; conjugacy and σ↔1−σ checks |
| D | Reusable arm renderer with synthetic fixtures; `render/arm` | 3 | High: start with mocks | A's minimal geometry interface | Tip-to-tail endpoint preserved under zoom/reflection; pair grouping and hover/pin; readable at normal size |
| E | Prime-power log ζ contributions; `math/log-euler` | 3 | High | A, B | q=4,8,9 carry weights 1/2,1/3,1/2; finite-log/finite-product difference accounted for |
| F | Clock/event integration and reversible reveals; `scenes/arms` | 4 | Low: integration owner | C,D,E plus A | Birth versus completion convention verified; seek/back/replay identical; no input snap or forced rotation |
| G | Functional equation and trivial zeros; `math/reflection`, isolated scene fixture | 4 | High for math | B, A contracts | Cross-check near 0,1,−2,−4 and nearby complex values; handle removable singularities as limits |
| H | Jacobi transformation explainer; isolated theta scene | 3 | High | B,C | x↔1/x identity and correction terms exposed with labelled coordinate mapping |
| I | Zero contributions to ψ then J; `math/explicit-formula` | 5 | High for math; shared UI later | B, A contracts | Correct conjugate pairing, cutoff order, jump midpoint convention and prime-power weights |
| J | Contour continuation; `math/contour`, isolated scene fixture | 5 | High as research prototype | B,G | Branch values, orientation, small arc and tails checked independently; singularities respected |
| K | Product over zeros; `math/xi-product` | 4 | High, later | B and zero data from I | Correct grouping/normalization; finite error exposed; distinguish multiplicative factors from additive arms |
| L | Visual comprehension review; review report only | 3 | High once prototypes exist | D/F/G prototypes | Reviewer can identify endpoint quantity, changing input, correspondence and approximation without reading code |

Suggested first assignments if four agents are available: A (integration/core),
B (references plus E's formula tests), C (xi math), D (arm renderer). C and D can
work from a minimal frozen contract while A extracts the existing app. E follows
as a small first integration scene; F stays with the integrator. This plan starts
no additional agents; task boundaries are ready for the user's assignments.

Use one worktree/branch per assignment. Shared files change through the integrator.
Each handoff includes source, a small fixture/demo, validation output, known domain
limits and an exact list of owned files. Do not cherry-pick another worker's
generated HTML over the integration build. Freeze a shared checkpoint containing
the current uncommitted Riemann modules before creating task branches.

**Delivery order**

1. Establish the checkpoint, contracts and behavioral baseline (A+B). Start C+D
   alongside this. Document worker and standalone-export decisions before moving
   code; no visual redesign in this step.
2. Ship the pane/log ζ arm (E+D+F): one selected family, birth-linked growth,
   reciprocal ledger weights and an explicitly finite endpoint. Start at σ=2.
3. Ship the ξ pair arm (C+D+F) for the currently validated |τ|≤15 window. At
   σ=1/2, opposite imaginary contributions cancel; off that line the paired
   radii differ. Show a small number of expanded pairs, with the remaining
   contribution retained as a labelled aggregate. Stable ordering is required.
4. Add reflection/trivial zeros (G) and the theta transformation (H). Extend input
   ranges per mathematical view only after their evaluators pass validation;
   don't force negative-σ behavior on the glass or divergent Euler construction.
5. Add zero waves and ledger reconstruction (I), then contour continuation (J)
   and the zero product (K). Release each independently after L's visual review.

For I, ψ is a useful first target because a zero ρ=β+iγ contributes
−x^ρ/ρ. On the coordinate y=log x, it has phase γy−arg ρ and amplitude
exp(βy)/|ρ|. After dividing by sqrt(x), zeros on the critical line give
constant-radius rotating contributions. Off-line zeros would have changing
radii. This is a different arm from the one reconstructing ξ. Integrating the
prime-count measure via dJ=dψ/log x recovers the ledger weights; at q=p^k,
log(p)/log(q)=1/k. Show smoothing/truncation and midpoint values at jumps.
The relationship between zero terms and prime counting is documented in
[DLMF 25.16](https://dlmf.nist.gov/25.16); the
[published Sage explicit-formula example](https://math.gordon.edu/ntic/ntic2020/section-riemann-formula.html)
is a starting point to audit, not an already validated drop-in for this page.

**Release criteria and limits**

- One active explanatory construction in the existing space. Equations/details
  belong in the current Guide; hover intensifies family colour, click pins.
  No new forest of floating labels, automatic layout changes or hidden controls.
- Clock navigation and τ scrubbing remain responsive while a worker calculates.
  On the baseline workstation, target visible input feedback within 50 ms and
  ordinary drawing within a 16.7 ms frame budget. Measure named workloads; these
  are targets, not portability guarantees. Reduce drawn detail before delaying
  interaction, while retaining all grouped terms in the numerical endpoint.
- Validate integer boundaries from both directions, fractional time, skipped
  beats, stale worker messages, conjugation, reflection, small values and poles.
- For |τ|≤15, initial numerical target: absolute error ≤1e−10 in ξ at the declared
  inputs, supported by the reported error estimate/bounds and independent
  references. Extend the range only with measured cancellation and sampling
  evidence. A finite collection of zero checks makes no claim about all zeros.
- Keep exact mathematical state separate from a fading or growing reveal. A
  partially revealed construction is labelled partial. An aggregate must equal
  its hidden contributions; hiding rings must not change the endpoint.
- Before calling the ξ scene successful, ask a reviewer to explain why the
  circles counter-rotate, why σ changes their radii, and why a prime-pane birth
  does not itself prove a ξ identity. The geometric bridge is the release goal,
  not just a correct plot.
