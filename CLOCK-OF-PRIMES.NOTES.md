# Clock of Primes — story integration

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

## Next work — requested, not implemented

1. **Finer complex input.** Add precise numeric entry and small increments for
   sigma and tau while preserving continuous transitions and the planar controls.
2. **A zeta range strategy.** Make large excursions, near-pole behaviour and small
   zero neighbourhoods inspectable with an explicit, understandable scale.
   Avoid invisible off-screen values or rescaling that disguises convergence.
3. **Overlay product and sum graphs.** The product inset already marks the sum's
   endpoint; next show both complete paths on a common complex ruler, preserving
   their distinct operations, arrival timing and convergence-domain labels.
4. **Linked clock regions and equation terms.** Identify geometric regions that
   correspond to individual terms or factors. Make them highlightable in both
   directions so the region, tape and graph respond together.
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
