# Known limitations and next steps

Baseline: the restored Svelte mechanism on `codex/svelte-mechanism`.
The shared sieve, zeta curve and finite sum, psi inscription, linked winding,
three themes, and object inspection work. The exhibit now has a stationary,
viewport-filling surface and corner controls. [AGENTS.md](AGENTS.md) defines its
constitution. Steps 1–2 and the step-3 presentation foundation are implemented; sound/HVS parity remains incomplete. Height/zoom response and the themes remain open to visual refinement.

## Current handoff

The real-axis ψ axle and conjugate vector addition supersede the earlier height envelope. The axle stands at x (on the rim from x = 1), and ψ appears at 1 fully extended (all −1/ρ point up), curling from its finest terms within about 0.01 of x; and the conjugate branch is the zero chain reflected across the real axis, closed at the tip by a dashed parallelogram (B + B̄ = 2 Re B). The magnifier rests at the lower right with faint tangents to its source patch and appears from x = 0.85. The separate Reflection switch, exact-count marker, housing filter, ζ reference toggle, trail-lifetime slider and zero-pair slider were removed at the user's request. The ζ trail is sampled every 0.02 in τ rather than every 0.04 s, so fast winding no longer draws chords. The ζ chain shows all 128 terms from the start. Known limit: at exactly x = 1 the extended chain is about 3 dial radii tall and the constant link reaches past the rim, so most of it starts off screen; between 1 and 2 the full-reference tip sits at the origin, so the auto-fit lens shows the whole axle-to-origin span at below unit magnification.

The latest construction pass completed the shared ψ wheel surface, housing, carriage and suspended magnifier. The three mechanism groups now start folded at the left, with independent disclosures and themed visibility switches. Axis captions belong to the main dial so the optical copy can enlarge the ψ assembly cleanly.

For a teaching release, carry the prime-power ledger and its reference cases forward from main-release, then connect the critical-line zeros to the count a reader came to see. At x = 8 the cube of 2 contributes log 2 to ψ and ⅓ to J, while π stays at 4. A first visit should let a reader see those three outcomes at the same x. The current Primes group shows the sieve and factorization. The predecessor sets its sieve limit to 5,000 and includes a J ledger plus zeta, Riemann-integral, theta-range and log-Euler reference cases. Svelte currently caps x at 128. Use the predecessor cases to validate any range increase and measure its rendering cost. New visits open on a dark Analytic dial. Prime families share colors with their sum arms. A gold ζ trail follows the live marker. The dial and lens show the complete tip-to-tail ψ vector chain immediately, with numerical readings available in the ψ notes. Clockwork and Expanse remain selectable at the same position. Profile on physical phones before raising the shipping budget.

### Earlier vector-only landing measurement

The earlier vector-only Analytic prototype drew prime-power arcs, the finite sum and reached zero vectors as SVG strokes. The current landing draws all selected zero-pair vectors as one continuous SVG path, including pairs above the starting |τ|. The measurements below apply to the earlier prototype. The exact count extends from zero in units of R/x. The reconstruction starts at its smooth trend, uses the same zero-pair budget as the other themes and projects onto that scale. Both the optics and drawing reuse the solved chain. Expanse comet tails now continue from the end of each pane in one fading arc. The ζ playback trail joins successive samples into paths with flat ends and age-based opacity.

Median playback FPS in headless desktop Chrome 158 at 1440 × 900, device scale 1, with the lens open, reference curve visible and 649 zero pairs:

| Starting position | Analytic | Clockwork | Expanse |
| ----------------- | -------: | --------: | ------: |
| x = 24, τ = −24   |     60.0 |      30.8 |    57.8 |
| x = 80, τ = −400  |     44.9 |      21.3 |    16.0 |

After a production build, run `node scripts/benchmark-themes.mjs` to repeat the comparison. It waits for both worker paths, starts linked playback, warms up for one second and times animation callbacks for five seconds. Three runs rotate theme order. Physical phone performance and extreme lens magnification still need visual review.

## Known limitations

| Area                        | Current limitation / intended change                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hue, brightness, saturation | Partial port: current drawing-wide CSS filters are basic adjustments. Original spectrum families, exponent/spread/rotation, optical depth, sigma-linked brightness and light/pigment transmission remain missing.                                                                                                                                                                                                                                                        |
| Sound                       | Partial port: current gesture-gated prime/zero tones and master volume do not reproduce the original prime/beat buses, independent levels, beat pitch or linear prime-frequency multiplier. Audio quality still needs listening feedback.                                                                                                                                                                                                                                |
| Domain and sampling         | x runs 0–5000, matching the predecessor's sieve, and tau ±1000. Linked 1:−1 winding stops at x = 1000 with τ; unlinking winds x alone. 649 critical-line zeros below 1000 (and 649 trivial zeros) drive ψ, so the record blurs features narrower than 2πx/γ (≈31 units at x = 5000). The record samples 8 points per 2πx/γ period (≈10,700 rows, 0.2 s in its worker) and draws only points ≥ 0.4 units apart. Playback frame rate at x > 1000 has not been benchmarked. |
| Themes                      | Clockwork uses opaque filled brass discs with finer, shallower teeth behind a smooth smoked dial. Spokes are removed and the stationary first sum gear is hidden; its mathematical arm remains. Expanse retains white cores, colored halos and comet tails. Built-in presets select relevant mechanisms. Tick marks and background dots are removed; stars remain.                                                                                                       |
| Anchored origin             | Resolved in step 1: centered viewport anchor, no main-scene drag or scrolling; overall zoom pivots around the origin.                                                                                                                                                                                                                                                                                                                                                    |
| Corner controls             | Resolved: content-sized π, ζ and ψ groups stay open together; no dropdowns or pagination. Direct audio/visual/clock controls, question-mark explanations, and local lens zoom/auto-fit/resize. The lens now includes radial refraction and bounded depth parallax.                                                                                                                                                                                                       |
| Grouped view filters        | All three masters stay together in the Primes, Zeta and Psi headings. Per-part visibility and Only actions live in each mechanism panel. Mathematicians’ names appear in notes. Presets and shared positions retain the layer mask.                                                                                                                                                                                                                                      |
| Flexible magnifier          | Implemented in step 2: draggable/keyboard-movable rim, viewport-relative placement, focal target and offsets, radius, orientation, magnification, and lens-only reset.                                                                                                                                                                                                                                                                                                   |
| Winding                     | Implemented in step 2: signed ratios (default 1:−1; preset 1:−2π), reverse play, configurable steps, animated destinations and prime destinations, reversible seeking, and coupled boundary stops.                                                                                                                                                                                                                                                                       |
| Zeta fading                 | Continuous frame-by-frame aging, including pause, with a bounded 240-point trail. The chunk-refreshed reference curve is a separate optional dim guide, off by default. Seek/reverse/reset clears transient history.                                                                                                                                                                                                                                                     |
| Zeta zero crossings         | Implemented: interval-detected signed zero crossings, bounded origin pulses, reduced-motion treatment and optional audio.                                                                                                                                                                                                                                                                                                                                                |
| Prime discoveries           | Implemented: interval-detected prime rings and distinct smaller prime-power marks; reverse crossings are subdued and silent.                                                                                                                                                                                                                                                                                                                                             |
| Critical line               | Resolved in step 1: sigma controls and off-line preset removed; restored URLs, winding, and public state updates enforce sigma = 1/2.                                                                                                                                                                                                                                                                                                                                    |
| Psi stabilization           | The fit looks ±0.75 in x with smooth weights, covering the tips and the full chain, so it widens before prime powers and zero arrivals. Simulated playback at speed 1 through x = 1.2–40 never engaged the containment cap; the worst frame moved the focus ~3 lens px. Physical-device review at higher speeds remains open.                                                                                                                                            |
| Product formula             | The finite Dirichlet sum exists; an Euler-product factor/term mechanism has not been ported. Define how its factors engage with prime families and the sum.                                                                                                                                                                                                                                                                                                              |
| Contributor guidance        | AGENTS.md governs onboarding and constitutional rules. Browser regressions now cover the fixed viewport, corner access, and legacy-position migration.                                                                                                                                                                                                                                                                                                                   |

## Proposed implementation order

### 1. Establish the fixed exhibit surface — implemented

- Replace document layout with one viewport-sized surface and corner overlays.
  Remove the exterior title, links, navigation, footer, and below-canvas essay.
- Choose one viewport anchor, initially the center, and make the clock nearly
  fill the available view. Panel state must never influence anchor placement.
- Remove main-scene dragging. Migrate or ignore saved pan values; any remaining
  overall zoom must keep the origin stationary. Lens placement is separate state.
- Lock public sigma to 1/2, remove its controls and off-line field-note position,
  and normalize legacy URLs so they cannot restore prohibited camera or sigma state.
- Put controls and compact exposition in corners, with disclosure/pagination on
  small screens. Preserve keyboard access and prevent page and panel scrolling.

Verified with browser tests at 1440×900, 390×844, 844×390, 320×568, and 568×320,
including rotation/resizing. The measured origin remains centered through playback,
winding, selection, panel toggles, themes, fit/zoom, lens mount changes, and legacy
position restoration. Control pages remain reachable without scrolling. Wheel,
touch, and keyboard navigation preserve the surface. The existing two lens mounts
remain; arbitrary lens movement and psi stabilization belong to step 2.

### 2. Make the mechanism easier to study — implemented (stabilization prototype)

- Add grouped visibility controls and isolation for each of the three systems.
  Suggested subgroups: prime panes/labels; sum arms/reference curve/trail;
  psi arms/reference/count marker/projections. Keep visibility out of the solver.
- Port the robust winding interactions after auditing the old behavior. Keep one
  scheduler, reversible seeking, coupled boundary stops, and default 1:−1 linkage.
- Add a draggable magnifier. Define lens position, focal point, scale, and optional
  orientation independently of the main scene; preserve the source relationship.
- Prototype psi stabilization within the lens: select a useful focal target,
  smooth scale/orientation changes, and use hysteresis to avoid repeated fitting
  or visible jitter. A lens reset must not reset the main clock.

Implemented: the Layers page isolates each function and toggles component layers;
Coupling provides signed slopes; Winding controls direction and speed; Wind to
supports exact destinations and previous/next primes. The legacy audit covered
`moveClock`, `advanceClock`, `updateClock`, `runUntil`, and the later overrides.
The new port keeps a single scheduler and deterministic record reconstruction,
with immediate paused scrubbing and bounded continuous destination winding.
Old tutorial loops and delayed/eased input remain excluded rather than importing
the predecessor's competing transport state.

The lens follows axle, reference stylus, or exact count plus user offsets.
Auto-fit covers the reference chain and count without moving their geometry.
The original step-2 prototype used a 10% deadband and asymmetric easing; step 3 replaces this with a rolling mean and a contact-anchored height rule.
orientation stays fixed at the selected angle. These parameters need user visual
feedback, especially at low x and abrupt seeks. Lens position, filters and optics
are included in shared positions. Free-position resize clamps the lens to the
viewport. Reset lens does not reset the main view.

Verification: production build and formatting pass; 15 numerical tests cover
signed gearing, both boundaries, reversibility and lens fitting. Twelve browser
tests cover presets, reverse playback, destination stops, layer isolation,
keyboard/pointer/touch lens movement, saved optics and fixed-origin/no-scroll
behavior at five viewport sizes. Desktop visual trials compared 1:−1 and 1:−2π
and exercised auto-fit at x = 8 and x = 100.

### 3. Restore expressiveness without obscuring the math — foundation implemented; ports partial

- Refine themes and port hue, brightness, and saturation controls.
- Add a fading zeta playback trail distinct from the sampled reference locus.
  Specify pause, reverse, seek, and reset behavior; cap both trail age and memory.
- Give zero crossings and prime discoveries brief visual emphasis. Drive events
  from parameter-interval crossings rather than frame equality, so fast playback
  does not miss events and paused frames do not repeatedly trigger them. Define
  reverse/scrub behavior and respect reduced-motion preferences.
- Port sound using those same event definitions, with user-controlled enablement
  and volume. Avoid an independent audio clock that drifts from winding.

Implemented with one playback scheduler. Events use half-open crossing intervals;
trails and moment queues have fixed bounds. Visual age now continues during pause; seeking,
reversal and gearing changes clear transient history. Reduced motion removes
expansion and trails. Sound is gesture-gated, shares the event stream, and has
voice/rate limits. Sound remains off after restoring a position.

Additional user direction in this pass:

- Replace count-dependent annular history transport with continuous flow indexed
  by recording x. Remove the redundant exact ψ trace; retain prime panes and count
  marker/readings. Reference samples include every prime-power contact.
- Calibrate the auxiliary psi height to put the full-reference tip on Re at each
  prime power. Blend neighboring decaying peaks between contacts. Preserve the
  real formula and relative term vectors; record and live geometry use one rule.
- Average log magnification over a configurable time window; keep decay in x so
  the height and inscription are independent of playback direction.
- Develop brass/glass Clockwork and galaxy-like Expanse. White cores, colored
  halos and comet tails preserve the solved trajectories. Black-hole effects wait.
- Replace nested routing dropdowns with direct remembered tabs and a previous-panel
  button. A more comprehensive multi-panel layout is still future work.

Validation: production build and formatting pass. Numerical tests cover prime-axis
contacts at multiple budgets/decays, unchanged real counts, continuous transport,
high-refresh zoom windows, and bounded events/trails. Fifteen browser tests cover
all corner pages at five sizes, real-axis contact, paused/cleared trails, reduced
motion, audio gesture gating, and source-origin invariance. Audio scheduling uses
a test stub; tone quality has not been auditioned.

Visual review includes the prime contact at x=37, Expanse at x=80 / τ=−400, and
compact landscape controls. Further tuning should target low-count truncations,
fast-seek zoom response, halo contrast, and whether two settings panels should remain open.

Current refinement checks: 24 numerical tests and 17 browser tests cover the live
tip guard, both styluses under large seeks/manual zoom/focus offsets, continuously
fading paused trails, persistent metal gears, preset state invariants, and all
three function masters at five viewport sizes. The clock origin remains fixed.

### Sound / HVS parity still to port

Audited against `.worktrees/main-release/orrery-of-eratosthenes.html`, including
its final `hueOf`, `freqOf`, `paneTransmission`, and `setting` overrides:

| Original behavior                                            | Rebuild status                                                       |
| ------------------------------------------------------------ | -------------------------------------------------------------------- |
| Master sound enable and volume                               | Available; opt-in remains mandatory                                  |
| Independent prime and beat buses/levels                      | Missing; only the new event-tone mix exists                          |
| Beat pitch and beat-tick voice                               | Missing                                                              |
| Prime pitch = multiplier × n (Hz per number)                 | Missing; current tones use a compressed pitch mapping                |
| Pitch-cycle vs wavelength spectrum families                  | Missing as selectable mappings                                       |
| Spectrum exponent, spread and rotation                       | Missing; global hue rotation is not equivalent to per-family mapping |
| Display optical depth and optional sigma-weighted brightness | Missing; global brightness is not the same operation                 |
| Additive light vs subtractive pigment transmission           | Missing                                                              |

These are explicit follow-up items. Do not describe the sound or HVS port as
complete until the corresponding behavior has been restored and verified.

### 4. Extend mathematical representations and range

- Port the Euler-product term representation, relating factors to the sieve's
  prime families. Label finite products accurately: the ordinary infinite Euler
  product converges for Re(s) > 1, so a critical-line view must not present a raw
  partial product as a convergent evaluation of zeta.
- Expand datasets and sampling after profiling memory, frame time, and worker
  cost. Validate reference values and inscription resolution at the new limits.
- Revisit the optional xi construction's limited |tau| ≤ 15 range if it remains
  useful in the critical-line exhibit.

Done when new representations have explicit mathematical semantics, independent
numerical checks, and usable performance without disturbing the stable scene.

## Numerical and modeling caveats to retain

- Psi is the Chebyshev prime-power counting function, not pi(x), the number of
  primes. Its finite zero sum oscillates near jumps and is an approximation.
- The current psi inscription is reconstructed deterministically at the chosen
  reference budget. It is not a stored history of the tau-driven active chain.
- A finite Dirichlet sum on the critical line is distinct from the independently
  evaluated zeta curve. The zero table and visualization do not establish RH.
- Cogs illustrate prescribed rotations; tooth counts do not define a physical
  gear train. The Expanse theme is not an n-body simulation.

### Next mechanical design pass

The latest Clockwork refinement replaces spoked wheels with filled discs, softens
brass highlights, and hides the stationary n=1 wheel without changing the sum.
Thin dark contours now separate overlapping discs. Reusable tooth silhouettes rotate while the clipped brass faces keep a fixed
lighting direction in the source view; it no longer spins with each wheel. This is stylized SVG shading, not a
physical reflection simulation.
The exhibit still needs a coherent watch-like structure, beyond metal coloring.

1. Establish fixed housing, support bridges, bearings, and a quieter hierarchy
   between the smooth dial, brass mechanisms, and glass. Keep the shared origin
   exposed and immovable; housing must not obscure the mathematical contacts.
2. Design a guided scotch-yoke housing for psi and a rack/ratchet along the shared
   real axis. Decide which part represents the exact prime-power steps and which
   follows the oscillating approximation; do not imply the approximation only
   moves forward, or prevent reverse winding.
3. Calibrate a stable sum ruler for each view preset, with a lens for excursions.
   The zeta chain can still leave the viewport at some positions. Containment
   must not introduce automatic main-scene panning or distracting scale changes.
4. Restore the remaining sound and HVS mappings above, then add the missing Euler
   product term representation with its critical-line convergence limits explicit.
   Guided exhibit positions can follow once this visual vocabulary is stable.

### Layered housing and ratchet prototype

Clockwork draws muted brass zeta gears behind a smooth smoked face. The vinyl
texture has been removed; a possible phonograph theme remains a separate idea.
A recessed edge, small offset contact shadows, fine gear bevels, fixed case lugs,
and a curved counterbalanced beat hand suggest shallow depth. There is no camera
tilt, displaced mathematical origin, or physical lighting engine.

The complete selected psi budget is now rendered as gears: reached zero pairs
are gold and the remainder silver. The active tip and carriage retain the
τ-limited developing sum. The full-reference tip and inscription retain their
existing meanings. Expanse retains its developing stellar chain.

The real-axis rack has one tooth per reached prime power, spaced by log p; its
pawl follows the exact count and lifts briefly at contacts. A spring links that
stop to the full finite ψ approximation. Extension encodes signed discrepancy,
not a physical tension law. Release is not forced at every prime: finite-sum
oscillation and midpoint behavior remain visible. Reverse and seek are fully
deterministic. The exact-count filter hides the rack, pawl, and spring; the
reference filter additionally controls the spring.

This integrates the visual prototype without solving complementary drive gears,
a physical escapement, or an energy-conserving spring. Small silver gears become
dense at high budgets; use the movable lens or reduce the reference budget to
study them. Further material and housing refinement remains open.

Full-budget rendering note: tooth shapes are reused, and subpixel psi wheels are
batched as gold/silver discs with individual inspection targets. Selection restores
full detail. A local 1440×900 headless Chrome playback sample with 649 terms and
the lens visible improved from about 6 fps to roughly 12–15 fps (median frame intervals
about 67–83 ms); this remains a performance limitation, not a smooth-playback claim.
Reducing the reference budget is available, but a further rendering optimization
pass is warranted before increasing the data domain. Depth is decorative shading,
not ambient-occlusion simulation. No phonograph theme has been implemented.

### Microscope readability and performance correction

The previous 649-term renderer and its tiny-disc fallback are replaced by six
batched SVG paths for gold/silver faces, complementary pinions and axles. Every
term has rectangular teeth at every size; silver draws after gold. Mathematical
hit-testing and keyboard selection replace hundreds of reactive SVG groups.
An initial same-scene playback check at 1440×900 with 649 terms and the lens
visible measured about 30 fps (33 ms median, 50 ms p95), versus the preceding
12–15 fps. This is a local headless-browser sample, not a 60 fps guarantee.
Further profiling should precede any Canvas/WebGL migration.

The lens no longer hides the housing/labels or changes pin sizes, and its source
includes the Expanse starfield. Screw plates and the floating psi label are gone;
the yoke is narrower and lies above the gears. The rack teeth contact Re, and its
spring is centered on Re with a visible rest length and folded links anchored to
the true count/approximation. No artificial prime-triggered relaxation is imposed.
Coaxial complementary pinions use radius r_n − r_(n+1): their radius plus the
next wheel radius equals the axle spacing. Angular speeds remain prescribed by
the mathematics, not solved gear constraints. Earlier layer/prototype notes above
record superseded iterations; this section describes the current implementation.

Final repeat of the playback sample retained a 33 ms median but reached 83 ms
at p95 (about 24 fps across the sample). Expect roughly 24–30 fps locally,
with occasional slower frames; batching improved performance but did not finish
that work. Build, formatting, 26 numerical tests and 18 browser tests pass;
three relevant browser checks were repeated after the final lens changes.

### Mechanical history and everyday controls

The separate discrepancy spring and its renderer data are removed. The original
continuous psi history is now a steel ribbon with a dark edge in Clockwork;
no samples, transport rules, or contacts change. Each prime-power pane becomes
a slim hand at the same radius and phase, while Expanse keeps its arc treatment.
Floating psi labels and lens captions are removed; Clockwork pane labels appear
only on selection. The bottom-right live numerical readouts are gone.

Transport is −1 / Play–Pause / +1 above a single horizontal x scrubber. Releasing
the link shows a vertical tau slider at lower right. Advanced numerical input
remains in Wind; optional readings remain in Notes. The settings panel starts on
the three system filters rather than the frame settings. A broader panel redesign
is still open; this pass does not claim the advanced settings are fully reorganized.

The shared-scene lens now has bounded position-dependent parallax: moving its
rim shifts the sampled focus. A second containment cap keeps both current tips
within the lens after that shift. This is a remote psi viewing optic, not a
physical ray-traced lens or a local magnifier of its corner background. The
source marker follows the actual sampled region. Scene materials/order remain
shared, and the clock origin stays fixed.

### Control presentation polish

The single global tab panel is replaced by three independent mechanism panels:
p · Primes, ζ · Zeta and ψ · Psi. They start open together, retain their own
settings category, and can be collapsed independently. The bell and prism open
sound and visual settings at the upper left. Clock adjustments, precise positions,
coupling, destinations, sharing and reset sit with the lower-left transport.
Both winding shafts now stay in that corner. Zeta trail and sum fitting belong
to ζ; lens fitting, optics and zero pairs belong to ψ. Per-mechanism notes and
values replace the global Notes drawer. Paired ξ rotations are removed from the
public controls at the user's request; numerical code and tests remain.

Compact landscape uses three adjacent cards. Small panels paginate whole controls
with accessible previous/next buttons; invisible controls are inert, and no panel
scrolls. All three mechanism headings and master visibility controls remain
available. Optional utility popovers overlay the cards on narrow viewports and
close with × or Escape. Opening controls never reflows the scene.

Validation includes five viewport sizes, independent panel state, every mechanism
settings page at the smallest portrait/landscape sizes with the clock unlinked,
keyboard reachability, fixed-origin behavior, and the existing mechanism tests.
Sound and HVS parity remain the separate limitations listed above.

### Icon foundation and revised presentation direction

The previous panel design is superseded: the user requested compact controls,
no dropdowns, no arbitrary color differences between p/ζ/ψ, and controls attached
to the objects they affect. These rules now live in AGENTS.md.

`@lucide/svelte` supplies the interface icons through `UiIcon.svelte`. Bell,
appearance pyramid, play/pause, link/unlink, adjustment, close, and disclosure
icons replace hand-drawn SVG or text glyphs. Familiar actions use icon-only
buttons with accessible names and tooltips. Mathematical labels remain text.
This is the icon foundation; removing existing dropdowns and oversized panels
is still pending and is not claimed as completed by this change.

The full lens project will absorb appropriate ψ presentation settings into
controls attached to the lens, and consider parallax refinement, slight fisheye,
and mechanical suspension. These effects are not implemented in the icon pass.
Any optical distortion must stay inside the lens and preserve the main scene.

The Primes control now uses lowercase π in place of Latin p, matching the
conventional prime-counting notation and the lowercase ζ/ψ controls. This is
a symbol change only; the prime-power sieve and its numerical behavior remain.

### Compact control rework — implemented

Replaced the large settings cards with content-sized groups. Removed the native
selects, category routing, pagination action, repeated isolation/show-all buttons,
guided positions, theme view presets and public prototype lens tuning. All three
mechanisms remain independently visible; expanding one never closes another.
Question-mark icons open the explanation and live values without replacing the
mechanism controls. Desktop groups are 224 px wide and 81/177/145 px tall with the
trail enabled; narrow portrait groups shrink to 188 px and 71/159/127 px.

Audio is enable/volume. Appearance uses direct theme and motion buttons with
color and zoom controls. Clock adjustments combine exact coordinates, speed,
direction, unlinked drive and signed gearing. Animated destinations and previous/
next-prime winding are retained at the user's request. Sharing/reset form a small
utility row; no menu is involved.

Lens zoom, Auto-fit and hide are attached to the lens; a rim handle resizes it
by pointer or keyboard. Dragging, containment, saved legacy optics and source
geometry remain intact. Reopening is available through the magnifier icon.
Parallax refinement, fisheye and mechanical suspension are still separate work.

Browser checks cover the direct controls at five viewport sizes, all three groups
open together, no dropdowns/scrolling, focus return, linked/reverse/destination
winding, theme and saved-state invariance, local lens controls, touch movement,
and containment. Earlier panel/pagination descriptions above are historical.

### Lens and ψ construction polish

The lens now rests beside the actual ψ mechanism, with a nearest-clear-space
placement around the controls on compact viewports. Default fitting frames the
whole wheel/carriage assembly instead of anchoring the image to the first axle.
Free rim placement and legacy saved focal targets still work. A restrained,
jointed case-to-rim support replaces the detached inset presentation.

A radial displacement map produces roughly 8% central enlargement and zero
movement at the aperture edge. The rear works and dial have small differential
parallax when the lens moves; the foreground ψ and all original source coordinates
remain unchanged. A pre-refraction 88% tip guard leaves both visible tips within
90%. This is an illustrative relay optic and suspension, not physical ray tracing
or a solved linkage. Lens motion is directly driven by user placement and the
mechanism; no added idle animation or optics controls.

Fixed the SVG copy's missing theme ancestry, which caused source/lens palette,
stroke and tip-size differences. The referenced scene now owns its theme.
Both mechanisms share shallow tooth profiles and metal gradients. ψ paints each
complete wheel before the next, so opaque foreground wheels cover rear edges,
pinions and bearings. An oversampled Canvas surface carries all 649 wheels into
the shared SVG source; mathematical hit-testing and keyboard inspection remain.
The image is bounded at 2048 pixels on the long edge and aims for 2× display
resolution. Its raster limit can soften extreme inspection magnifications.

The rack has a continuous brass body, steel guide and attached pawl carriage.
A rear bearing column and narrow slotted yoke replace dotted Clockwork projections;
the associated toggle now reads Housing. Reference and developing pins use small
steel/brass marks. No formula, tooth-contact coordinate or inscription sample was
changed. The source and magnifier use the same parts and paint order.

Performance remains open: this session's 1440×900 headless playback samples at
649 pairs measured roughly 14–15 fps with the shared surface, versus 10–12 fps
for individually ordered SVG wheels during development. These are current-machine
samples, not directly comparable to the earlier 24–30 fps batched-path result.
Disabling refraction alone did not materially change the measured frame rate.
Do not claim a finished performance port or smooth 60 fps.

Validation covers radial monotonicity and post-refraction containment, full-wheel
fit, depth bounds, free movement and rotation, five viewport sizes, saved positions,
fixed-origin behavior, and pixel comparisons for occlusion and fixed metal lighting.
Earlier six-path batching, detached lens and lens-project notes are historical.
