# Clock of Primes — story integration

## Current checkpoint — 13 September 2026

The clock now sits beside a shared complex input/output plane. Prime-family
hover/pin highlights link clock panes, tape factors and matching sum terms;
selected complementary sectors report their actual geometric fraction. The J
ledger starts closed. The sum and finite Euler product share a movable ruler,
with optional conjugate ghosts and a gold ζ trajectory for fixed σ and varying τ.

The ζ trajectory supports |τ| ≤ 1000 and streams from a background worker.
Completed curves are cached; a directly evaluated local preview responds while
σ changes, and a labelled faint previous curve provides context during rebuilding.
The input remains continuous. Real σ and Height τ each have a slider and precise
field; σ is unlocked by default. Fit, zoom and Options replace the scattered
controls. The offscreen input badge is draggable.

Validation at this checkpoint: current browser checks for direct input, preview
latency, streaming, cancellation, cache reuse, pole breaks and responsive layouts
passed. The evaluator was checked against 66 high-precision reference inputs.
Build sources, current checks and fixtures accompany the standalone HTML; local
screenshots and superseded untracked experiments are excluded from the commit.
The dated entries below preserve earlier decisions and measured limitations.

## Next priority — σ and τ in the clockwork

**TODO: Find and visually establish a geometric representation of σ and τ on
the clockwork itself.** This remains unimplemented at this checkpoint.

The next experiment should connect an identifiable clock region or motion to
both weight magnitude n^(-σ) and phase −τ log(n), with the same objects responding
in the clock, tape and complex plane. Establish what follows from the existing
clock geometry and what requires an additional weighted measure or reference
frame. Preserve continuous transformations, repeated prime factors and the
integer-beat handoff; matching colours alone is not the geometric explanation.


## Euler workspace — 13 September 2026

Complex input, graph scale and the overlaid sum/product paths now occupy one
persistent workspace beside the clock (stacked on narrow portrait screens).
Pace/count controls remain separate. The J ledger starts closed. Hover previews
a prime family; clicking pins it, leaving the hover target restores the pinned
family, and Clear/Escape clears it. Selected ink and arcs use saturated prime
colour rather than whitening. Graph picking accounts for letterboxing so the
same complex scale is retained on both axes at every viewport size.

The selected prime's complementary sector is filled within its own disk.
After its first growth beat, its fraction is exactly 1 − 1/p; during growth the
readout reports the actual changing fraction. A separate readout evaluates
1 − p^(-s). These agree at s = 1 after growth, not generally at other inputs.
This angular-area construction is independent of the radial ruler. The original
product spiral encoded accumulated sieve survival via its radius; it did not
measure instantaneous uncovered clock area. Riemann integral work is deferred.

The underlying glass DOES encode the scalar weights in a precise way. For a
prime, the linear channel transmissions are
T_i = exp(−3 sigma log(p) a_i / sum(a)), where a_i comes from the prime hue.
Their geometric mean is p^(−sigma). Multiplying panes channel by channel gives
geometric mean n^(−sigma) whenever the crossed panes represent n's factorization.
For example, at 12 the 2, 4 and 3 panes contribute 2, 2 and 3, so at sigma = 2
the transmission geometric mean is 1/144. Screen RGB includes display correction;
the tape additionally boosts dark colours for legibility. Neither average screen
brightness nor uniqueness of RGB mixtures is asserted. Prime identities and
exponents remain exact arithmetic data, independent of possible colour collisions.

The moving spatial intersections are a phase display. FTA is read at integer
beats on the meeting ray; an arbitrary moving overlap is not an unchanging
equation term. Scalar attenuation alone does not encode the complex phase
−tau log(n), which remains explicit in the vector views.

## Checkpoint — 12 September 2026

The standalone page now centres the experience on reversible, continuous beats.
The second hand, growing prime arcs, factor-coloured incoming terms and absorbing
product factors share their timing. Prime-power glass preserves repeated factors.
Start returns to beat one without repeating puzzles or resetting view preferences.
Observations replace the initial prediction gates; destinations only ease to
preset beats. The clock occupies 80% of the viewport diameter, with corner
controls, persistent explanation bubbles, bottom tabs and no page scrolling.

The mathematical views include the J ledger and its fraction/area/log-ladder
bridge, a sum and attached integral tail, a selectable finite Euler-product path,
and a numbered prime-count residual axis. Standard complex orientation is the
default, with perpendicular sigma/tau controls. The sections below record the
construction and its limitations.

## Next work — progress after the checkpoint

1. **Finer complex input — first pass implemented.** Numeric sigma/tau fields
   accept precise values within the existing numerical domain (sigma 0.2–3,
   tau −35–35). Arrow keys change 0.0001, Shift changes 0.01, and Alt changes
   0.000001. Inputs set easing targets; they never move the beat. The perpendicular
   sliders and pad remain available.
2. **A zeta range strategy — first pass implemented.** Fit frames both current
   paths and the finite zeta reference once. The ζ button centres on the current
   reference without changing scale; zoom reaches a half-height of 0.00001.
   The 0 button restores origin and half-height 2. Centres and logarithmic zoom
   ease continuously, with equal real/imaginary units and numbered coordinates.
   The view remains fixed as the beat or weights change. Clipping is reported;
   Fit can expand beyond the usual slider maximum. ζ-centering is disabled at
   the pole. The numerical evaluation domain has not been extended.
3. **Overlay product and sum graphs — implemented.** View → Sum × Product draws
   the complete blue partial-sum path and prime-coloured product path on one
   ruler. The sum starts at 0; the empty product starts at 1. Fractional arrivals
   retain their existing interpolation and convergence-domain labels. Product
   factors remain individually selectable. This is a shared complex plot, not
   yet a geometric identification with regions of the contracting clock.
4. **Linked clock regions and equation terms — prime-family pass implemented.**
   Select an arc band, a tape product factor, or a product graph point (also
   accessible through its previous/next buttons). The selection outlines every
   arrived p-power arc, underlines incoming sum terms divisible by p, keeps the
   tape's p-factor outside the ellipsis, and highlights matching sum links and
   the p-product segment in the complex graph. The clock sum also highlights
   matching links when enabled. Clear or Escape removes the selection. Selecting
   a family changes neither the beat nor the weights. Exact term selections,
   repeated-factor multiplicities within a selected composite, and links to J's
   receipts remain future extensions. Arc highlighting identifies the existing
   geometric carrier; it does not assign an integral value to an enclosed area.
5. **Riemann's first integral after Euler's product.** Revisit the opening of
   [Riemann's paper, translated by Wilkins](https://www.claymath.org/wp-content/uploads/2023/04/Wilkins-translation.pdf)
   and investigate whether the integral has a faithful region interpretation in
   this clock. Candidate: sectors extending up to each prime ring. Establish the
   integrand, measure, limits and any coordinate change before presenting an area
   as the integral; this geometric correspondence is an open question.

Keep the distinction between discrete sums, continuous integral approximations,
and analytic continuation visible. Never silently relocate the tail centre to
the zeta reference or snap counting time during an explanation.

## From Euler factors to J

“Why these fractions?” opens a bridge from the existing ledger. It compares
the first arrived coefficients (up to 12) of the infinite zeta and log-zeta
expansions. The latter has coefficient 1/k at p^k, zero elsewhere. This is
not a numerical logarithm of a finite sum; intermediate blends are labelled
as a visual morph. The identity is used in its convergent domain Re(s)>1.

For one selected prime, z=p^-s. The identity
`-log(1-z) = integral_0^z (1+v+v^2+...) dv` gives `z^k/k`.
Substituting v=z*u leaves the unit area `integral_0^1 u^(k-1) du = 1/k`
as the coefficient of the unchanged complex weight z^k. The swept rectangle,
triangle, and curved region display u, u²/2, and u³/3 continuously; at u=1
they give the three ledger fractions. They are explanatory unit areas,
not physical glass transmission or a new clock phase.

The explicit Log ladder control eases to the original inward log radius law,
with log(1)=0 at the axle. Equal radial steps mark p, p², p³. The first step
is emphasized: its fraction of the journey to p^k is 1/k. This overlay stays
on when returning to J. Toggling it off restores the prior ruler unless the
user changed rulers in the meantime. Merely visiting a beat changes only t.

`.review/verify-bridge.cjs` checks coefficients, normalized areas, equal ladder
gaps, eased controls, and no-scroll mobile/landscape bubble layouts.

## J ledger

The J bubble shows credits at prime-power births: 1/k for q=p^k. Bar heights
share a unit scale, colours follow the prime, and a phase-driven halo identifies
the newborn arc. Credits are booked at the integer birth, while the arc still
prints over the following beat. Rewinding removes those same credits. The
buttons visit only count destinations and leave all view settings alone.

Totals use exact integer units of 1/27720 (divisible by all exponents possible
below the current frontier 5000), avoiding floating-point fraction labels.
The last seven receipts are shown; earlier credits are explicitly subtotalled.
Here J includes births at x. Riemann's inversion formula takes the midpoint at
jumps instead; between jumps these conventions agree. J(10)=5⅓ in either case.
The existing Chebyshev psi ledger still uses log p and is a separate layer.

`.review/verify-j.cjs` checks opening credits, reverse steps, reset, small-screen
bubble fit, and totals against independent prime/power enumeration through 5000.

## Current viewport revision

The instrument now occupies one fixed viewport. The clock's diameter is 80%
of the shorter viewport dimension. Corner controls open persistent, independently closable explanation
and tuning bubbles; count destinations sit along the bottom. No opening quiz
gates remain. Beat observations and tabs change only the count destination and
explanation text, leaving every control, layer, layout and tuning target alone.

The sum's unit is now **one radius**, replacing the earlier arbitrary half-radius
scale. It renders after the beam with a contrasting outline so the real-axis
sum remains visible at tau=0. Values beyond the unit circle are clipped, with
their actual coordinates and an explicit outside-circle notice in Tune.
Separation now moves into an inset on the same canvas rather than growing the
page. The inset has its own unit circle; the main clock stays full size.

Scrubbing takes 280 ms regardless of distance, using quadratic ease-out with
no counting-speed cap. Each frame processes intervening integer events. One
beat takes 480 ms and retains fractional-phase round trips. Start is the sole
intentional snap. Product slots reserve room for all absorbing primes, fill
spare space with recent factors, and keep the ellipsis adjacent to the visible
factors. The unused initial product window has zero width.

`.review/verify-viewport.cjs` supersedes the previous layout and puzzle-gate
assertions. It checks the fixed desktop/mobile/landscape viewport, bubble
fit, unchanged controls across all destinations, distant scrubbing with
intermediate frames, reversible steps, and active/product filler factors.

The following sections document the earlier integration; the viewport and
scale changes above supersede its below-the-clock separation and half-radius
unit bar.

Adapted selected constructions from `orrery-story.html` and its notes, 2026-09-12.
The original story files remain untouched in the main checkout. This version is
in the `codex/orrery-visual-path` worktree.

## Geometry controls

“Panels” still means the moving prime/prime-power arc segments. The story's
layout slider is called **Separate the sum** here. It moves the existing sum
continuously onto a second circle below the clock, with the same orientation,
same term colours, same beat, and an explicit unit bar. Neither picture is
rescaled to make a divergent sum fit. A caption identifies clipped portions.
The original overlay is the zero-separation endpoint. Geometry preferences
survive Start and chapter changes; the extra circle folds away continuously
when no sum is displayed, retaining its requested separation.

The **Clock ruler** slider interpolates from the existing radius law to
`R log(t/q)/log(t/2)`. At the outward endpoint, q=2 sits on the rim, the newest
q sits at the axle, and prime-power ladders have equal radial gaps. The range
is degenerate at t=2, so it opens continuously over beats 2–3. There is no
artificial inner floor. Panel periods and angular widths do not change;
equal physical arc lengths belong only to the original linear ruler.
The beam processes panes in physical radial order during the transformation.

For nonzero sigma the outward ratio can be written as a ratio of differences
of log weights: sigma cancels. At sigma=0 this means the limiting ruler, not
division of actual zero log weights. This is a reference frame, not a claim
that clock positions equal complex sum magnitudes.

## Integral tail

The old straight correction is now the path

`T(X) = (t^(1-s) - X^(1-s))/(s-1)`, starting at the partial-sum endpoint.

Its derivative is `X^-s`, and its distance from the eye is
`X^(1-sigma)/|s-1|`. The three regimes are inward, constant-radius, outward
as sigma moves above, onto, or below 1 (away from the pole). The display shows
at most 2.2 turns; it does not claim to render an infinite path. At tau=0
the path is straight rather than spiralling.

The eye is the *leading integral correction*, not zeta itself. The gold
reference still uses Euler–Maclaurin. The discrete chain and continuous
integral agree in their local weight law, but are not identical paths; at
fractional beats the growing last link is also a visual interpolation.
See [NIST DLMF 25.2](https://dlmf.nist.gov/25.2), especially the
Euler–Maclaurin representations, for the correction framework.

## Deliberately not imported

The notes' claim that RGB average brightness equals n^-sigma is not used.
The scalar product of pane weights gives n^-sigma; display hues encode the
factor mixture separately. No derivation of zero heights from clock rotation
is asserted. The trivial-zero sweep, family-of-lines sweep, and additional
zero-wave views need their own interaction design before being folded in.

## Verification

`.review/verify-geometry.cjs` checks outward drift and equal ladder gaps,
the tail derivative and eye radius at positive/negative tau in all three
sigma regimes, continuous slider transitions, fixed counting time, reflected
tape alignment, mobile width, and retained preferences after Start/chapters.
Existing game and tape harnesses cover six puzzles, reversible stepping,
factor colours, finite factor folding, and synchronized arrivals.

Build: `python .review/game-build.py`. The final HTML is standalone.

## Complex input and Euler-product comparison

The initial orientation is now real-right, imaginary-up. Tune has perpendicular
sigma and tau sliders plus a draggable input pad; tau includes negative values.
These controls change weights continuously, without changing counting time.

View → Product opens a fixed-scale complex plot of P₀ = 1 and
Pⱼ = Pⱼ₋₁ / (1 − pⱼ⁻ˢ), through primes at or below the current beat.
Segments carry prime colours; arrows below the plot select an individual factor.
The finite sum is blue, the Euler–Maclaurin zeta reference gold. A dashed segment
interpolates multiplication by an arriving prime factor using exp(f log factor).
It is an animation between completed finite products, not an additional identity.
The plot explicitly limits the convergence claim to sigma > 1. It has its own
numbered ruler, independent of the contracting clock, and an adjustable extent.

The prime-count overlay formerly labelled its normalized residual with the raw
psi value. It now labels (psi − smooth)/sqrt(x), adds fixed numeric ticks, and
removes the unlabelled auxiliary circle. The View explanation identifies the
moving trend and the midpoint convention at jumps. This motion has no added
inertia: actual ledger jumps and the changing baseline determine its position.
J's cumulative total still lives in its corner ledger; the ladder identifies
contributions rather than plotting that total.

The tail has deliberately not been moved onto the zeta reference. At integer N
its centre is S_N + N^(1-s)/(s-1), whereas Euler–Maclaurin next subtracts
N^(-s)/2 and adds s N^(-s-1)/12. Translating the integral spiral to exact zeta
would detach its start from S_N. At sigma = 1 and nonzero tau the integral
spiral is exactly circular, while the discrete partial sums approach a circle.

Current checks: verify-viewport.cjs, verify-j.cjs, verify-bridge.cjs and
verify-analytic.cjs. Earlier geometry/game harnesses predate the persistent
viewport and removal of puzzle gates. Product checks include exact first
factors, convergence at s=2, conjugate symmetry, domain messaging, perpendicular
controls, and unscrolled layouts at 320px portrait and 568px landscape.

## Shared complex plane — 13 September 2026

The Euler workspace is now an open plotting surface beside the clock. Its input s and finite sum/product outputs share the same complex coordinate ruler. Drag s (or enable Place s) to tune; Hold σ constrains this to vertical motion. Empty-space dragging pans, wheel zoom is anchored at the pointer, and two-touch pinch changes scale. Exact σ/τ fields remain available, including their fine keyboard increments. Input bounds remain 0.2 ≤ σ ≤ 3 and |τ| ≤ 35; changing the viewport does not change those numerical limits.

The τ window controls a scrubber and optional dotted endpoint loci, sampled at 41 equally spaced τ values with fixed current σ and beat. These are finite-sum and finite-product endpoints, not extra summation segments or an analytic continuation. Samples refresh at most every 220 ms while tuning; sharp features may require narrowing the τ window. The optional dim −τ paths are exact conjugate reflections of the currently drawn finite paths, including the fractional arriving product segment. Fit s + paths includes the input, conjugates and enabled sampled endpoint loci; ordinary Fit retains its current-path meaning. The critical strip is a faint vertical band, with lines at 0, 1/2 and 1.

Guide opens the mathematical interpretation and factor/sector details without consuming permanent graph space. The previous compact status override was removed so the numerical pole, convergence and clipping messages remain accessible. A growing panel no longer claims its incomplete complementary sector equals the completed factor at s=1.

Validation: `.review/verify-exploration.cjs` exercises real mouse input with σ lock, panning, wheel zoom, numerical conjugacy, and no panel/body overflow at 1440×1000, 1024×768, 390×844, 568×320 and 320×568. Pinch is implemented but has not been tested on physical touch hardware.

## ζ itself as a vertical-line image — 13 September 2026

Added the gold locus τ ↦ ζ(σ+iτ), independent of beat. It defaults to τ=0…60, with span presets 60/100/500/1000, arbitrary window endpoints within −1000…1000, and a dedicated Fit ζ curve action. The existing finite endpoint trails are now off by default and remain optional in Guide. A brighter ±0.7 interval follows the current τ; the optional −τ ghost reflects the entire locus. Input σ still ranges from 0.2 to 3. All τ input routes now share the extended bounds.

A Blob-backed Web Worker precomputes each fixed σ/window curve, with six results cached in memory for the session. The evaluator uses compensated summation and six Euler–Maclaurin corrections with N=max(96,ceil(1.25|τ|)), shared verbatim between page and worker. This replaces the previous fixed-N evaluator everywhere, including the gold marker. Sampling begins with Δτ≤0.04 and recursively refines midpoint chord error above 0.0002(1+|ζ|), up to depth 7 and a refinement budget of approximately 120,000 points. This is a plotting heuristic, not a rigorous uniform error bound. Hitting that budget asks the user to narrow the window. The pole creates a curve break. A cached raster handles the quiet full curve; only the short highlighted neighborhood redraws on each scrub frame. Changing σ cancels obsolete background work and hides mismatched cached curves; input values continue to ease.

Measured in local headless Chrome on the critical line: 0…100 produced 4,652 points in 0.056–0.070 s; 0…500 produced 42,736 in 1.7–1.9 s; 0…1000 produced 97,658 in 7.5–8.3 s. After fitting the large curve, 60 sampled frame intervals had median 16.7 ms and 95th percentile 33.4 ms. These are machine-specific observations, not a universal performance promise. Precomputing makes repeated τ exploration cheap; changing σ or the window may require another job. Larger heights would warrant a more efficient evaluator, particularly Riemann–Siegel on σ=1/2, or an offline dataset.

Validation: `.review/zeta-reference.py` generates 66 mpmath reference values at 40 decimal digits, spanning σ=0.2…3, τ up to ±1000, a known zero and near-pole points. `.review/verify-zeta-locus.cjs` compares the browser evaluator (maximum error/(1+|reference|) 4.6e-13), benchmarks the worker, checks cache reuse while τ changes, pole breaks and responsive layouts. This validates sampled values, not all points of the continuous domain. Rebuild remains `python .review/game-build.py`.

Mathematical references: NIST DLMF https://dlmf.nist.gov/25.2 (continuation and Euler–Maclaurin) and https://dlmf.nist.gov/25.18 (computation methods). The critical strip is regular away from the sole pole s=1; the looping curve should not be interpreted as a singularity or a finite sum/product converging inside the strip.

## Streaming ζ curve — 13 September 2026

Worker output now arrives as ordered transferable Float64Array chunks: the first completed sampling interval is sent immediately, followed by batches about every 32 ms and an explicit completion message. The renderer appends into an amortized-growth buffer and extends the cached raster from the previous endpoint, preserving segment continuity and pole breaks. It rebuilds the raster when the view changes. Only completed curves enter the six-entry cache; obsolete workers and late messages cannot replace the current curve. Computation starts after the existing 180 ms input debounce, without waiting for σ's visual easing to finish; a curve is shown only when its σ agrees with the displayed input.

Fit ζ curve during calculation follows incoming bounds using the existing eased view transform. Panning, wheel zoom and other view controls release that fit. The progress readout includes the growing point count. This changes delivery and rendering, not sampling or the evaluator.

Streaming checks confirm partial data and a rendered partial curve before completion, preservation of the previously received prefix, completion-only caching, cancellation during a σ/window change, fit release on navigation, pole breaks, reference accuracy and responsive layouts. In the 0…1000 critical-line test, the first 5 points were emitted 0.5 ms after worker computation began (startup/debounce/display time is additional), and the completed curve retained 97,658 points. Full preparation remained about 8.3 s in that run.

## Responsive real-part exploration and simpler controls — 13 September 2026

The latency had two avoidable sources: a 180 ms request debounce and a renderer gate requiring the eased σ to agree with the target to 0.0001 before showing anything. Requests now debounce for 40 ms, and σ/τ ease at 14/s instead of 5/s. Values remain continuous.

The curve renderer now evaluates a local 25-point ζ preview directly at the displayed σ and τ on each changing frame (τ ±0.6 in 0.05 increments, clamped to the supported domain). It uses a dashed stroke during rebuilding. A completed previous curve remains faint, explicitly labelled with its previous σ, while new samples stream in. A mismatched target curve is also dimmed during easing. These layers are not interpolated function values; the live preview is freshly evaluated. Once the matching full curve is complete, the local highlight becomes solid. Both full and previous curves use raster caches; streamed segments still append incrementally. Narrow local sampling is visual feedback, not a high-resolution substitute for the full adaptive curve.

The everyday controls are now Real σ and Height τ, each with a slider and precise number field, followed by Fit curve, zoom out/in, Options and Guide. The σ lock is OFF by default. Options holds the τ window/span, mirror, curve toggle, optional placement mode, secondary fits and factor controls. Direct dragging of the purple input now works even when it is represented by the offscreen badge; this adjusts from the existing input using pointer displacement instead of jumping to the badge's clipped coordinate.

Authoring: `.review/friendly-explorer.js/css`, plus the revised `.review/zeta-locus.js` and continuous input easing replacements in the full build pipeline. `.review/verify-friendly.cjs` checks default unlocked dragging with a real mouse, immediate preview feedback, options access, high-height preview cost, and five viewport sizes. Observed live feedback was ~32 ms over two animation frames, with 25-point preview costs ~0.1 ms near τ=14 and 1.6–2.3 ms near τ=1000. Machine-specific observations, not universal frame-rate guarantees. Existing zeta numerical/stream tests now access the span selector through its moved control rather than assuming it is always visible.
