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

## Withdrawn clock-to-sum experiment — 13 September 2026

The beat-12 travelling-arrow demonstration was rejected as unreadable. Removed
its added overlay, magnifier, three pane labels, transport controls and launcher
from the page; restored the clean committed exploration view. Its numerical
checks did not establish visual clarity. The next attempt must explain one
relationship at a time within the existing clock and graph, without covering
either with another panel or changing the viewing scale during the explanation.
The σ/τ clockwork geometry task remains open.

## Shifted output overlay and clock equations — 13 September 2026

Added `CLOCKWORK-EQUATIONS.md`, transcribing the time, radius, angular growth,
prime-power crossings, RGB transmission, complex weights, finite paths and
optional radial rulers from the implementation. It explicitly distinguishes
mechanical frequency 1/q from the complex phase rate −log(n).

Options now contains “Overlay ζ − 1 on clock”, with a separate switch for the
shifted finite sum/product paths. The overlay is off by default and uses the
existing clock canvas, a fixed scale of R pixels per output unit and the clock's
reflection transform. It does not change the side plot's scale, input, clock time
or layout. Matching streamed ζ samples use an incremental raster; the current
local preview remains live. Output 1 marks the axle and output 0 marks the
negative-real rim. Only those two landmarks are added. Out-of-canvas curves are
clipped without automatic rescaling.

The user's proposed pole alignment needs a distinction: translating output by
−1 centres the sum/product anchor 1, not the pole. ζ(s) is unbounded at the input
s=1; all zeros have output 0 and therefore land at the single point w=−1. Merely
being somewhere on the rim (|ζ−1|=1) does not imply a zero.

Checks in `.review/verify-shifted-clock.cjs` passed: the 1/0 landmarks, imaginary
axis sign, a known zero at the negative-real rim, original/reflected orientation,
pole handling, pane/radius formulas, unchanged user state and narrow viewports.

## Sum/tail investigation — 13 September 2026

The reported σ=0.5, τ=1, N=500 case is mathematical divergence of the ordinary
partial sum, not a numerical discrepancy in the checked implementation.
Browser S_500 = 7.863704681647395 + 17.738814226146562i, while
ζ(0.5+i) = 0.14393642707718965 − 0.7220997435316729i. Independent 50-digit
mpmath sums over 12 cases (σ=.2,.5,1,1.3 and N=100,500,1000, τ=1) agreed within
7.6e-14 absolute error. This does not exclude every possible rendering issue,
but reproduces the outward excursion without the renderer.

The attached integral path is I_N(X)=S_N+(X^(1−s)−N^(1−s))/(1−s). Its eye is
C_N=S_N+N^(1−s)/(s−1), and radius around that eye is X^(1−σ)/|1−s|. At N=500,
σ=.5, τ=1 this radius is exactly 20; the eye is approximately
0.16624134089943432 − 0.7205752035675559i. The eye approaches ζ with endpoint
corrections even while the uncorrected path expands. σ<1 expands, σ=1 and
nonzero τ circles, σ>1 contracts. Winding with log X is controlled by τ.

The .2 lower σ bound is a UI/validated-domain choice, not a singularity.
Read-only probes below it agree well just to the left, but the current
Euler–Maclaurin evaluator suffers cancellation farther into negative σ:
absolute errors near (−4,1000) reached about 6.47, and the trivial zero at −4
had residual about 9.1e-7. A faithful left-half-plane extension should use the
functional equation and explicit handling of removable products/zeros, while
finite Euler products at σ=0 have additional singularities and the glass would
cease to be passive attenuation for σ<0. No input bounds were changed here.

`SUM-TAIL-BEHAVIOUR.png` plots the actual partial sums and the tail-radius law;
`.review/investigate-tail.cjs`, `.review/check-tail.py` and
`.review/plot-tail-behaviour.py` record the investigation.

For Riemann's paper, the existing paths and sliders can support successive
integral contributions, but new numerical machinery is needed: complex gamma,
adaptive quadrature and branch-aware contour integration. The first faithful
scene is Γ(s)n^(−s)=∫exp(−nx)x^(s−1)dx, then the summed Bose kernel
Γ(s)ζ(s)=∫x^(s−1)/(exp(x)−1)dx for Re(s)>1. His continuation proceeds through
a contour, reflection, a theta-kernel transformation and the completed ξ
function before the zero/prime-count work. These are not the current integral
tail construction. A graph can illustrate these identities; it does not by
itself supply the convergence and contour arguments.

## Riemann integral views — 13 September 2026

The existing plot now has a mathematical-view selector: Euler, One term, Finite
sum, Infinite sum, and Symmetry. These are user-selected functions, not lessons
that retune the clock. The clock's completed beat supplies n or N for the first
two integrals. Sigma, tau, clock time, reflection and layout stay unchanged when
selecting a view. Fit curve fits the selected integral; Fit input & outputs also
includes s. The ruler remains fixed until a navigation action changes it.

The blue path accumulates an independently evaluated real-axis integral; the
gold ring is its gamma/zeta target. Trace smoothly rewinds and replays the path.
Options contains its progress scrubber. Playback is parameterized by sampled
path length for visibility, with actual x reported underneath. x is an auxiliary
integration variable, not a newly asserted radius or sector of the clock.

Implemented identities, using modern Gamma and xi notation:

- One term: integral of exp(−nx)x^(s−1) = Gamma(s)n^(−s), Re(s)>0.
- Finite sum: integral of [(1−exp(−Nx))/(exp(x)−1)]x^(s−1)
  = Gamma(s)S_N(s), Re(s)>0. This still works inside the critical strip.
- Infinite sum: integral of x^(s−1)/(exp(x)−1) = Gamma(s)zeta(s), Re(s)>1.
  At or below 1 it is explicitly rejected rather than plotted as a continuation.
- Symmetry: xi(s)=1/2+s(s−1)/2 times the integral from 1 to infinity of
  psi(x)[x^(s/2−1)+x^(−(s+1)/2)], where psi(x)=sum exp(−pi n²x).
  This psi is the Gaussian/theta kernel, not the prime-count psi. Its paired
  powers exchange under s↦1−s. On the critical line the integral is real and
  reduces to Riemann's cosine integral. Guide gives the formula and notation.

Sources: [Wilkins translation, printed pages 1–3](https://www.claymath.org/wp-content/uploads/2023/04/Wilkins-translation.pdf),
[DLMF 25.5](https://dlmf.nist.gov/25.5), and
[DLMF 25.4](https://dlmf.nist.gov/25.4). The finite-N view is an explicit
intermediate step derived by summing the first identity; it is not presented as
a separate displayed equation quoted from the paper.

Numerics use log-x coordinates and composite 8-point Gaussian quadrature, with
4-point comparisons as an error estimate and compensated complex summation.
The term view rescales x by n. Finite exponential sums use expm1 to avoid small-x
cancellation. Positive-domain gamma uses Lanczos plus recurrence. Independent
targets are not used to bend the integration paths or force their endpoints.
Workers are cancelled on changed inputs and eight completed results are cached.

Integral views currently support |tau|≤15 within the existing sigma range. This
does not narrow the Euler/zeta explorer's |tau|≤1000 range. The lower integration
cutoff is capped at log(x)=−300; near sigma=1 from above, a substantial omitted
lower tail is flagged as unresolved. Guide reports the quadrature estimate and
analytic bounds for the omitted integration tails, not a certified total error.
Fit includes large cancellation loops even if the final gamma/xi value is tiny;
explicit zoom supports extents down to 1e−14 for examining those endpoints.

Validation: 322 independent 60-digit mpmath reference cases cover sigma=.2..3,
tau=0,1,5,14,15, n/N=1,2,12,500, symmetry pairs, the first nontrivial zero and an
unresolved near-pole case. Resolved endpoint absolute errors were at most
2.34e−10 and consistent with cutoff bounds; gamma relative error was below
9.4e−14. Browser checks passed for worker targets, invalid-domain feedback,
unchanged inputs/clock, continuous replay, scrubbing, tiny-scale navigation,
returning to Euler, and five viewport sizes. Existing input/streaming checks
also passed (live feedback about 26 ms on this run).

Still open: animating the branch-aware contour argument and theta
transformation, robust negative-sigma/trivial-zero exploration, and identifying
a genuine clock region for the integral. Showing the transformed identity does
not establish those missing steps or prove the Riemann Hypothesis.


## TypeScript foundation — 14 September 2026

Added a pinned TypeScript/Vite development build and a narrow ClockMath adapter.
The current Riemann gamma/quadrature code now lives in src/math/riemann.ts.
Its worker imports that module directly and is bundled inline; the old runtime
function-to-string worker construction and duplicate JS math source are retired.
Most clock and UI code remains in the historical JavaScript assembly.

Added typed contribution/worker contracts, pure pane snapshots with distinct
term-completion/birth/growth-completion times, and the finite prime-power log ζ
module with weights 1/k. It reports the convergence domain and finite cutoff,
rejects nonfinite/overflowing inputs, and has no visible arm yet.

Use npm run build as the canonical build, npm run dev for automatic rebuilds,
and npm test for type checking and numerical tests. Python assembly now accepts
an output path so intermediate stages cannot overwrite the working page. The
completed HTML and dist/index.html remain self-contained and equivalent.

Validation: strict type checking; 322 existing gamma/integral fixtures; 24 new
60-digit log-Euler fixtures (maximum absolute error about 4e-15); pane boundaries
and reverse snapshots; bundled worker execution offline with no HTTP requests;
request replacement; existing integral and control tests across five viewport
sizes. Existing live input feedback was about 30 ms, with high-τ local preview
around 1.7 ms on this run. Development root routing and TypeScript rebuild/reload
were exercised in Chrome. Browser harnesses still use workstation-specific paths.

Next: the reusable arm renderer and a readable log-Euler scene. Clock reveal
integration, ξ paired-vector numerics, and broader-domain continuation remain
separate later tasks; no claims about those are implied by this migration.


## First prime-power arm — 14 September 2026

Added “Euler · prime-power arm” to the existing graph selector. The typed math
module supplies b_q=q^(−s)/k for q=p^k. The arm uses the existing pane-growth
interval: g_q(T)=clamp(T−q,0,1), displaying L(T,s)=Σ g_q(T)b_q(s). A term begins
at pane birth T=q and finishes at T=q+1. This is a disclosed reveal convention;
it is distinct from the original sum tape completing its qth term at T=q.

At fixed s, established vectors stay fixed as the clock advances. Changing tau
rotates them by −tau log q, and changing sigma changes their lengths. The readout
connects the active pane to its J weight 1/k. The single circle shows its full
vector magnitude q^(−sigma)/k; the growth fraction changes the vector length.
This is the logarithmic Euler construction, not yet the xi epicycle construction.

The generic renderer accumulates all contributors before folding consecutive
groups. Dashed aggregate vectors preserve their endpoints; the faint underlying
path retains every intermediate sum. Initially the first three, last two and
active contributions are expanded. Selecting a prime expands its family. Clicking
a dashed aggregate expands four more contributions. Hover previews the family;
click pins the specific q, which receives a thicker clock-arc highlight. No new
overlay, automatic fit, or clock/input retuning was added.

Trace and the renamed Arm progress slider replay the displayed vector chain
without moving the clock. Folded aggregates replay as aggregates and are not
presented as individual prime powers. The default view follows pane growth with
its complete selected approximation displayed. Gold denotes the finite arm tip,
not a continued-zeta target. For sigma<=1, the view explicitly claims only finite
terms. Guide distinguishes exp(L) from a finite Euler product, whose included
primes have further powers beyond the prime-power cutoff.

Tests passed: existing 346 numerical cases; pure growth/rewind and folded endpoint
checks through N=2000; actual browser forward/back buttons with intermediate
growth; hover/pin and exact q selection; Trace preserving inputs and time;
aggregate expansion preserving endpoints; desktop/mobile/landscape layouts;
returning to integral and Euler views; existing integral regression suite;
standalone export offline.

Next: review the side-graph arm for comprehension before moving it onto the clock,
then add the independently validated xi quadrature pairs behind the same renderer.


## Xi paired arm — 14 September 2026

Added “Riemann · ξ paired arm” in the same graph, using the shared TypeScript
arm renderer. It evaluates the positive theta kernel directly, independently of
the gold gamma/zeta target. With δ=σ−1/2:

    K(u) = Σ[n≥1] (8π²n⁴ exp(9u/2) − 12πn² exp(5u/2)) exp(−πn² exp(2u))
    ξ(s) = ∫[0,∞] K(u) cosh((s−1/2)u) du
    A_j = w_j K(u_j)/2
    v_j± = A_j exp(±δu_j) exp(±iτu_j)

The normalization follows the classical Fourier representation in
[Polymath, equations 1–3](https://arxiv.org/html/1904.12438#S1): our K(u)=4Φ(u/2).
This is a rearrangement of the theta representation, not an animated derivation
of the theta transformation. On σ=1/2, each pair has equal radii and opposite
imaginary parts. Off the line, the radius ratio is exp(2δu). The selected node
stays fixed as inputs change. Two coloured circles show its head-to-tail radii.

Only the active pair and its two neighbours are expanded initially. Dashed
segments retain sums of whole folded pairs; the faint path shows all individual
vectors. Click a group to expand two pairs. Hover previews, click pins, Escape
clears. Trace replays displayed vectors, including aggregates. The origin is
marked so that closure near the first zero is visible against the independent
gold target. No input, time or scale is changed by selecting this mode.

Quadrature uses 96 fixed Gauss–Legendre nodes on [0,2.5] and eight Gaussian terms,
compared with 64 nodes. Guide reports an estimated discretization/roundoff error
separately from a bound for the omitted integral/Gaussian tails. The estimate is
not an interval certificate. The implementation rejects inputs outside
0.2≤σ≤3, |τ|≤15. The main Euler explorer retains its existing range. Absolute
rather than relative error is useful near a zero.

These are integral samples, not prime powers or zeros. Clock transport leaves
their coefficients unchanged. A clock-mounted reveal, and any synchronization
of that reveal with pane births, are still pending; no prime-to-node identity is
claimed. The side graph is the current inspection surface.

Validation: strict TypeScript build; existing 346 numerical reference cases;
ξ arm tested against 34 independent theta fixtures, maximum absolute error
6.53e-16, plus conjugation/reflection symmetry, pair cancellation and exact folding.
Chrome checks cover selection/pinning, σ radius ratio, clock independence,
smooth replay, first-zero closure, aggregate expansion, unsupported-input
feedback/recovery, mobile layouts and returning to the existing views.


## Explorer orientation and full vector chains — 14 September 2026

Feedback: automatic folding hid most contributions behind a faint path and a
single dotted aggregate, and the dropdown obscured the difference between the
logarithmic prime-power construction and ξ's paired integral vectors.

Both vector views now show every contribution in colour by default. Folding is
an unchecked option, explicitly named “Fold unselected vectors”; its aggregate
values and click-to-expand behaviour remain available. Trace follows the complete
chain unless folding is deliberately enabled. Hover/pinning still emphasizes the
selected contribution without removing the other vectors.

Replaced the dropdown with visible Build and Integrate button rows. Build has
Sum & product, Prime powers, and ξ rotations; Integrate has One term, Finite sum,
Infinite sum, and ξ symmetry. A persistent title names the output, for example
“Prime powers → log ζ” versus “Paired rotations → ξ”. The active choice is
highlighted; changing views preserves the input, clock time and graph ruler.
On short screens the generic explorer heading and equation move out of the way;
the equation remains in Guide, with all seven view choices and controls present.

All views share one typed coordinate renderer. Strong axes cross at the actual
zero, with numbered grid lines and offscreen-origin directions. A violet band
marks the input critical strip 0<Re(s)<1, with its dashed σ=1/2 line. The label
explicitly says “input s”: plotted paths and endpoints are outputs on the same
ruler, not the image of the critical strip under ζ or ξ. Offscreen input labels
now point in the correct directions and stay inside the canvas.

Validation covers full chains by default, explicit folding and expansion,
hover/pin and replay, every view's coordinate labels, state preservation while
switching, and responsive layouts. The numerical modules are unchanged.


## View explanations and slider domains — 14 September 2026

Each construction now has an Explain view button beside its title. Its readable
popup describes what the path accumulates, what its endpoint means, and an
experiment to try. Equations appear after that explanation at a readable size;
the main equation line is replaced by a short verbal description. The seven
explanations distinguish ζ from log ζ, Gamma-weighted integrals from raw sums,
and the theta integral from its paired-vector representation.

Domain tracks use green for supported inputs, amber for the finite-only parts
of the Euler/log-Euler constructions, and hatching for divergent/unsupported
regions. Captions distinguish true convergence boundaries from numerical limits.
Exact fields receive a border cue when outside a view's numerical domain.
Changing views never changes s, the clock, or the τ window. Explain view offers
an explicit “Use this view’s τ range” action which changes only the slider
window. On short screens captions remain accessible through slider descriptions
and Explain view; the colour tracks remain visible.

Xi symmetry inherited the original common |τ|≤15 numerical restriction. Its
theta quadrature already adjusts the sampling density with τ. The view now
supports |τ|≤35 across the shared σ range 0.2–3; this is an implementation window,
not a restriction of the entire function ξ. The positive-σ bound also belongs
to the shared UI and independent gamma target implementation. The other integral
views and ξ rotations keep |τ|≤15. No extension of the raw Euler domain is implied.
The shared typed view-domain metadata supplies both integral limits and slider
colours. Integral results now include a floating-point roundoff estimate along
with the quadrature estimate and separate omitted-tail bound.

Seventy independent 70-digit mpmath fixtures cover positive/negative heights,
σ=0.2 through 3, and several zero neighbourhoods in the extended window. Maximum
absolute endpoint error was 6.08e-16. These finite checks are not a certified
uniform error bound. The theta computation took under 9 ms per tested job on
this workstation. Numerical regressions passed; browser checks exercise all
explanations, domain colouring, rejection/recovery and state-preserving range
changes. Reference generation: python reference/theta-range.py.
