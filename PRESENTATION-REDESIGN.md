# Clock of Primes / Riemann explorer — presentation redesign

Design audit and implementation plan, 2026-09-15. Status: proposed; no application
behavior changed by this document. Based on the current main build at 3165e48,
desktop and phone browser inspection, and review of the active UI assembly.

## Design objective

Make an inviting mathematical instrument: observe a cycle, notice a relationship,
then inspect it. The clock is the opening experience. The Riemann explorer is a
second workspace that the visitor deliberately brings into view. Mathematical
detail remains available without becoming the price of admission.

The immediate goal is a coherent interface, not another lesson system. Retain
continuous transformations, reversible beat stepping, factor identities, and
honest distinctions between finite constructions and analytic continuations.

## What the audit found

- At 1440 × 900, the explorer canvas element has only 297 CSS pixels of height.
  Navigation, explanatory text, input controls, and toolbars surround it. On
  phones the actual plot becomes especially small inside its allocated space.
- The explorer renders into a fixed 600 × 300 bitmap, including on a device
  with pixel ratio 2. Resizing it alone will not give crisp axes or curves.
- The explorer is a permanently open popover; unrelated View controls cover
  it. This is a structural problem, not just a misplaced menu.
- The clock title describes the whole screen, while its own clock is offset.
- Destinations, graph constructions, layers, explanations, and playback appear
  as similar buttons despite having different meanings.
- Trace changes from Sum & product to One term. This is an unexpected mode
  change masquerading as playback.
- Some controls survive only as hidden DOM state. Several rounds of relocation
  and CSS overrides make visible ownership hard to reason about.
- At beat 500, labels overlap extensively. Prime powers appear as ordinary
  integers; the axis-dependent label offset changes sign abruptly.
- Large pale glow and dense glass colours compete with the unit marker and
  beam. High-prime strokes are large relative to their short angular spans.
- The tape remains vertically arranged in the reflected orientation and has
  little usable width. Its strike-through and moving factor membership make
  the arithmetic harder to track.
- Existing spectrum mappings and proportional pitch already provide useful
  foundations; the presentation hides them.

## Proposed visual guidelines

| Element | Guideline |
|---|---|
| Background | Deep green-black, initially #0B1511; secondary surfaces #13221B. Keep large surfaces quiet. |
| Text | Warm ivory #EEE9DA; secondary text #B4C3B8. Verify contrast at actual sizes. |
| Accent | Restrained gold #E0BD76 for the second hand and primary interaction. Prime colours carry arithmetic identity, not button hierarchy. |
| Typography | One sans-serif stack for controls, explanations, and numbers; tabular numerals for changing values. One serif for workspace titles. Use proper mathematical typesetting for expanded equations. |
| Sizes | Aim for 14–16px controls, 14px graph labels, and 16–18px explanatory math. Avoid essential text below 12px. Change layout instead of shrinking it to 7–9px. |
| Icons | A consistent outline family. Icons alone only for familiar actions: sound, settings, close, zoom. Accessible labels, focus states, and tooltips are required. |
| Spacing | Shared 4/8/12/16/24px rhythm; shallow surfaces, few borders, consistent corner radii. |
| Motion | Time-derived geometric motion; brief, restrained UI easing. No decorative wobble of endpoints or mathematical lengths. |
| Selection | Intensify the existing factor colour. Hover previews, click pins, Escape clears. Never whiten away the factor identity. |

Use system fonts initially so the page stays standalone and offline. If their
math coverage is inadequate, evaluate a single bundled math font during the
typography pass. Palette values are starting tokens, subject to visual and
contrast checks rather than treated as finished branding.

## Workspace and control ownership

Three explicit compositions: Clock, Both, Riemann explorer. A labelled explorer
handle on the right edge opens Both; dragging it farther opens the explorer
fully. Also provide click and keyboard controls for all three states. The
handle must be discoverable without requiring a drag gesture.

- **Clock:** centered title above its clock, diameter near 80% of the usable
  stage's smaller dimension, with dedicated clearance for tape and transport.
- **Both:** roughly equal panels, each with its own title and local controls.
  The divider can be adjusted. Resizing must not retune s, reset time, refit
  the graph, or regenerate numerical samples unnecessarily.
- **Explorer:** graph takes center; a labelled Clock handle returns to Both.
  Keep a compact shared beat readout/transport for clock-dependent constructions.
- **Phone:** one primary workspace at a time by default. Offer comparison only
  when useful space remains; never produce two illegible miniatures.
- No document scrolling. Longer optional reference material may scroll within
  an intentionally opened reading panel. Panels belong to their workspace;
  clock settings must not cover the explorer.
- First load is Clock. Within a visit, closing/reopening retains explorer state.
  A future shared link may explicitly open a saved composition.

| Existing entry | Proposed home |
|---|---|
| Start / back / play / forward | One persistent clock transport, in that order |
| Pace & count; timeline end | Gear beside clock transport; adaptive timeline replaces manual end management |
| View | Clock appearance/layers control inside the clock workspace |
| Sound | Visible speaker icon with an adjacent sound settings disclosure |
| Observe; First beats | Optional observations in the shared inspector; no required tutorial |
| Twin primes | Transport gear → seek targets |
| Euler / Zeta destination tabs | Replace primary tabs with explorer entry and optional saved observations |
| Build / Integrate button rows | A compact, labelled construction chooser inside the explorer |
| Guide / Explain view / explanatory Options text | One inspector with progressively expanded explanation |
| J ledger | Optional prime-power inspection / counting detail, linked to the selected pane |
| Fit curve / Fit paths / Fit together | One Frame control with explicit choices: curve, construction, input + outputs |
| Previous / next / clear factor | Selection inspector, beside the selected factor identity |
| Prime-count zero pairs | Only in the prime-count construction's settings |

Keep the current construction name visible. Open a small catalogue with two
groups, Constructions and Integrals, each choice having a short description.
This replaces seven permanently visible buttons without returning to an opaque
dropdown of unexplained names. Do not remove a capability just because its old
control has no sensible current home: inventory it, assign it, then retire the
duplicate control and handler.

## Actionable implementation sequence

### 1. Establish the shell and visual system — medium effort

- [x] Introduce shared typography, spacing, colour, icon, focus, and surface tokens.
- [x] Implement Clock / Both / Explorer compositions and the accessible divider.
- [x] Scope Clock of Primes to the clock; rename the second workspace Riemann explorer.
- [x] Start with the explorer closed and the clock centered.
- [x] Give the graph the majority of its workspace: target at least 65% of the
  available height in the normal desktop explorer, controls closed.
- [x] Move menus to their owning workspace and remove global corner collisions.
- [x] Preserve clock, s, selection, and graph camera through every layout transition.

Review this shell at desktop, laptop, phone, and short landscape sizes before
reintroducing all secondary controls. This is the first implementation milestone.

### 2. Rebuild controls around intent — medium effort

- [x] ~~Keep Start~~, back one, play/pause, forward one together. Gear is adjacent.
  Superseded: Start was removed as redundant beside the scrubber.
- [x] Gear contains seek snapping: off, integers, primes, twin-prime centers;
  play speed; fine adjustment; and direct Go to number.
- [x] Treat snapping as selecting a destination. Move continuously to it with
  uncapped seek speed and a short ease-out. Start retains its authorized instant reset.
- [x] Keep back/forward one as exactly one beat, regardless of snap setting.
  In the gear, previous/next matching target can visit primes or twin centers.
- [x] For twins, use centers m with m−1 and m+1 prime. Centers after (3,5) are
  multiples of six; retain the exceptional pair (3,5), centered at 4, explicitly.
- [~] Replace repeated timeline-end dragging with a window that follows travel,
  a broad-range overview, and direct entry. Show the supported maximum and reject
  invalid entries clearly. Do not claim an unbounded clock.
- [x] Expose pitch multiplier f(n)=a·n Hz, default a=20 and minimum a=1, beside
  volume in the sound disclosure. Speaker toggles mute; sound starts muted.
  Keep proportional tuning exact; label any retained pitch compression separately.
- [x] Expose the existing hue mappings with preview swatches and readable names;
  add a perceptually balanced option if it improves family discrimination.
- [~] Consolidate graph framing, camera reset, ghost −τ, curve domain, and layers.
- [x] Fix Trace: replay the current construction only, or clearly mark it
  unavailable. Never silently switch constructions.

Sound acceptance includes low multipliers, upper-frequency filtering, and
rapid travel without a burst of queued notes. Hue changes update panes, tape,
vectors, and selection together. Keep a non-colour identity in labels because
neither a finite display palette nor blended intersections uniquely encodes
every factorization to a human observer.

### 3. Make the graph a usable instrument — medium/high effort

- [x] Make canvas backing stores follow CSS size and device pixel ratio.
  Update cached curve rasters as well as the main canvas.
- [x] Separate screen coordinates from complex coordinates, removing the
  fixed 600×300 layout assumptions and matching pointer hit tests to rendering.
- [x] Preserve equal real/imaginary units for any graph aspect ratio.
- [x] Use the plot surface as the main input interaction. Keep sigma horizontal
  and tau vertical at its edges, with compact, readable exact-value fields.
- [x] Distinguish three quantities: current s, the tau interval sampled for the
  zeta curve, and the output camera range. They must not share an ambiguous Range control.
- [x] Make the current tau interval readily editable, with optional fine steps.
  Keep sigma unlocked by default and retain direct input placement/pan affordances.
- [x] Keep one concise legend: construction, reference function, input marker,
  and ghost. Essential convergence/numerical-window status stays visible.
- [x] Preserve streaming and cached numerical values through resizing; label
  stale previews with their source sigma and maintain breaks at singularities.

Pixel density and numerical sampling are separate problems. A crisp canvas
does not resolve an undersampled loop. Adaptive refinement should use screen
error and cancellation of superseded jobs, without making input wait for a full curve.

### 4. Refine clock geometry and animation — high effort

- [x] Give the beam a fine luminous core and controlled glow. Replace broad,
  square visual edges and harsh colour changes with restrained transitions.
- [x] Keep the unit marker unmistakable: a small bright body, restrained trail,
  and a beat pulse derived from clock phase so replay and rewind agree.
- [x] Reveal the beam from origin to R during the first observed cycle, proposed
  t=1→2. This is a drawing reveal, not a change to R or the unit term's value.
  If a quantitative sum layer is enabled, the full unit length remains identifiable.
- [x] Keep geometric event times exact while easing decorative light around
  them. Do not delay absorption or blur which factors divide the current number.
- [x] Reduce screen-space pane thickness, improve edge rendering, and restrain
  glass opacity. Do not enlarge a high-prime arc's true angular span merely to
  accommodate rounded caps; separate visual strokes from measured boundaries.
- [x] Replace axis-sign label offsets with continuous angular placement.
- [x] Format powers as p^k, with numeric value in inspection; compress the beat
  factorization similarly, e.g. 500 = 2² × 5³.
- [x] Manage label density: prioritize active, selected, and newborn panes;
  optional All labels. Fade competing labels smoothly instead of making them jump.
- [ ] Distinguish the panel arc from any filled sector used for measurement.
  Styling must not imply that stroke thickness measures an arithmetic weight.

First-cycle replay must be deterministic, and Start must not reset settings or
restart a compulsory lesson. Reduced-motion preferences suppress decorative
glow/trails while preserving the mathematical continuity of stepping.

### 5. Rebuild the tape around continuity — high effort

- [x] ~~Use a wider horizontal rail~~ that responds to the clock workspace width.
  Superseded: the rail was flattened below the clock and that broke the dock.
  The tape is rotated onto the meeting ray, as before the shell.
  Prototype its connection to the reflected clock before committing the layout.
- [x] Keep the equals sign's relationship to the meeting ray explicit. If the
  rail cannot dock directly without collision, use a short visible connector;
  never detach the timing into a decorative unrelated ticker.
- [x] Preserve each term's continuous journey into absorption at the beat.
- [x] Keep low-prime product factors in stable slots, an ellipsis in the middle,
  and a changing window of recent/relevant factors after it. Fill spare room
  with additional factors. Reserve selected/active slots before optional neighbors.
- [x] Animate factors entering/leaving the ellipsis without crossing or shuffling
  the persistent low-prime anchors. Active factors glow in their own colours.
- [x] Remove strike-through. Use colour emphasis/attenuation for factor state,
  with accessible inspection text distinguishing processed terms.
- [x] Show more sum terms when space permits; constrain text by legibility,
  not by a fixed tiny term count.

Notation decision: the unweighted clock view can show arithmetic identities
and factorization, e.g. 12 = 2²×3. It must not quietly drop s from a weighted
zeta equation and retain an equals sign claiming the same value. When displaying
weights, n^(−s) and 1/n^s are equivalent; 1/n^(−s) would be wrong. Use one form
consistently with the current s visible. Opening the explorer may reveal the
weighted notation, but cannot silently change its mathematical parameters.

Also distinguish a finite sum and a finite Euler product: matching visible
cutoffs generally do not give equal values. The absorption story represents
the series rearrangement/sieving; its symbolic equality must show the remaining
series or a properly qualified infinite identity.

### 6. Unify inspection and discovery — medium effort

- [ ] One inspector for a hovered/pinned pane, term, vector, or current construction.
- [ ] First layer: identity and one observation. Second: relationship/equation.
  Third: full explanation, domain, numerical limits, and sources.
- [ ] Keep short hover labels near their objects. Longer explanations use a
  bounded reading area that reserves room rather than covering the graph under study.
- [ ] Move J into prime-power inspection: highlight q=p^k, its pane, ledger
  credit 1/k, and corresponding logarithmic contribution when that view is active.
- [ ] Keep J optional and off initially. Its discrete jump at birth must remain
  distinct from the pane's one-beat printing and the continuously grown vector.
- [ ] Keep J and prime-count psi clearly named and separate. Neither should
  appear as an unexplained floating overlay in the main opening experience.
- [ ] Retain first-beat observations as optional invitations, with presets
  moving only to their intended values continuously. No tests or unlock gates.
- [ ] Put twin-prime seeking in navigation options for curious exploration.

Do not invent a pane-area interpretation of J's 1/k to make the connection
look closer. Shared source identity and synchronized highlighting are already
useful and honest connections.

### 7. Read the equation, and open the door off the real axis — medium/high effort

Added after the first review rounds. Phase 6 is deferred until these land.

**Opening state**

- [x] Default one second per beat, sound on, prime pitch 1n Hz. The slow build
  is the intended first impression; keep it.

**The tape's product side**

- [x] Order factors with small p nearest the equals sign, so a new prime arrives
  by building up from the terms beneath it into a new maximum height.
- [x] Stack, reading down to the equals sign: at least two newest terms, the
  ellipsis, the present factors of n, three most recently touched primes
  (usually 2, 3, 5), then zeta(s) immediately above the equals sign.
- [x] Hold the recently touched primes in a queue so the p=2 term stops being
  swapped out every beat.
- [x] Move zeta(s) off the top of the column to its place beside the product.

**Reading the equation**

- [x] Write the actual sum and product formulas on either side of the equals
  sign, with live n and s rather than a bare list of terms.
- [x] Place the sigma and the pi as the operators that sort arriving terms into
  their prime factors and pile them into the product.
- [ ] TODO: animate that sorting. The symbols should be seen doing the work,
  not captioning it.
- [x] Remove the "Euler's sieve, infinite sum/product" caption; the formulas
  carry this once they are written out.

**Panels**

- [x] Split Sound & light into a sound panel and a light panel.
- [x] Spectrum belongs in the light panel, with far more control over it: the
  point is to observe different contrasts, not to pick from three presets.
- [x] The options panels still rearrange the space too much. In Both the clock
  column gets narrow enough to trip the phone rules, which turns the drawer
  into a bottom half-screen sheet.
- [ ] Clock appearance reads like it belongs to the Riemann explorer. Revisit
  which workspace owns it.

**Separate sum as a first-class transition**

- [ ] The separate-sum geometry is a genuine transition between the clock's
  unit circle and the complex plane, and it is currently buried in a menu.
  Make it a fundamental move in the Riemann explorer's graph rather than an
  appearance toggle.

**s off the real axis**

- [x] Vary s without opening the Riemann explorer, or let varying s be the
  thing that opens it. Exploring off the real axis is where the rabbit hole
  starts, and it should be presented as a door, not a setting.
- [x] Let the imaginary part of s ride the clock. On by default at one tau per
  beat, anchored where it is switched on. Because tau is a function of t
  rather than an accumulator, stepping the clock back winds tau back with it,
  and the pace follows the play speed for free.
- [x] The drive runs as far as the machinery does. 35 was the fine slider's
  edge, not a limit: locusZeta grows its truncation with |tau| and tune()
  clamps at 1000, so the drive stops there and nowhere earlier. The tau
  slider now follows the value as a local fine control instead of fencing it.
- [x] With the drive on by default, the door off the real axis answers
  deliberate input rather than the first beat; an ambient default should not
  spend a one-shot layout change for the visitor.

**The sum's own ruler**

- [x] One unit of the sum was pinned at exactly one clock radius whatever s
  was. One unit is now sigma radii: sigma = 1 reaches the rim, sigma = 1/2
  half way in, so the real part of s is a length you can read against the
  dial. An observer's factor of 0.1 to 2 rides on top. Neither changes the
  terms, which stay n^-sigma long, and the separated inset labels the scale
  it is using.
- [ ] At the opening sigma = 2 a unit is two radii, so the sum's very first
  link leaves the dial and the lens reads as empty until the ruler factor is
  brought down. Either the window grows past R, the opening sigma changes, or
  the lens frames itself the first time it is switched on.
- [ ] The sum's window is still the dial. The ruler factor is the only way to
  fit a wandering chain; the window itself could grow into the margin.

**Known defect**

- [ ] The tail spiral is drawn in one frame and then rotated as the term
  evolves. It should develop as the term evolves.

## Technical approach and checkpoints

Continue in TypeScript with the existing numerical modules and workers. No
framework or rendering-engine migration is needed to accomplish this redesign.
Introduce a small typed UI shell and control registry, then retire the relevant
legacy DOM relocation stages as each part is replaced. Avoid appending another
override layer to the current sequence of scripts.

Suggested ownership: `src/ui/workspace.ts` for layout state;
`src/ui/transport.ts` for clock destinations; `src/ui/inspector.ts` for shared
selection; `src/ui/theme.css` for tokens/components; and shared viewport
conversion utilities under `src/render`. These paths are proposed, not existing APIs.

Keep mathematical state separate from layout, preferences, and camera state.
Numerical modules should not depend on hidden inputs. Add the shell bridge
incrementally rather than rewriting all math and presentation in one change.

Implementation order: 1 → 2 → 3 → 4 → 5 → 7 → 6. Phase 6 is deferred. The inspector's container belongs
in phase 1; its explanatory content migration comes in phase 6. Inventory
legacy control ownership before removing anything in phase 2. No delegation is
required for this plan.

Acceptance across milestones:

- Desktop 1440×900 and 1280×720; phone 390×844; short landscape 844×390;
  device pixel ratios 1 and 2; keyboard and touch as well as mouse.
- The plot occupies more space than persistent explorer controls. All primary
  controls are readable and operable without document scrolling.
- Opening/closing/resizing preserves t, s, graph camera, and pinned selection.
- Start, both beat directions, rapid seeks, and direct high-number entry work
  without snapping intermediate time or creating sound backlogs.
- Review motion around 1→2, births 2/3/4/6/8, twin pairs, and n=500/2000
  (within the supported limit); inspect both directions and axis crossings.
- Validate finite sum/product, log arm, xi rotations, and integral views;
  preserve numerical fixtures and explicitly reported domain limits.
- Pixel-sharp graph labels, stable selection hit regions, no clamped or
  falsely joined singularity paths, and useful performance during sigma changes.
- Remove obsolete control IDs/handlers only after all their state dependencies
  are migrated. Keep standalone/offline build coverage.

## Decisions still open

1. Opening interaction: recommend paused at beat 1 with Forward one emphasized;
   automatic first-cycle playback is an alternative. Sound stays off until enabled.
2. Horizontal tape routing needs a motion prototype in both clock-only and split
   layouts. Preserving absorption and the meeting-axis connection outranks symmetry.
3. Durable saved/shareable explorations would help visitors share discoveries.
   Add after the interface settles, rather than introduce more launch controls now.

The next deliverable is the phase-1 shell with a readable, large explorer and
a quiet clock opening, followed by a visual review before deeper motion changes.
