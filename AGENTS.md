# The Riemann Mechanism: constitution and onboarding

These instructions govern this worktree and its descendants. Read this file,
[README.md](README.md), and [ROADMAP.md](ROADMAP.md) before making changes.
The user's explicit instructions take precedence. These requirements guide
implementation; they do not add a separate permission or approval workflow.

## Product constitution

1. **The clock origin is the immovable anchor.** For a given viewport, its
   screen coordinates must remain constant through playback, winding, selection,
   theme changes, panel changes, magnification, fitting, and position restoration.
   Never pan, translate, recenter, or gimbal the main scene in response to content.
   Resizing may recompute the viewport anchor from one consistent layout rule;
   opening controls must never change that rule or shrink the scene's layout box.
2. **One viewport, no scrolling.** The exhibit fills the available viewport and
   the clock nearly fills it. No horizontal or vertical page scrolling, nested
   scrolling panels, or offscreen content reached by scrolling. This applies to
   wheel, touch, and keyboard navigation. Keep controls usable with keyboard focus
   and at small sizes; use independent compact disclosures rather than hidden overflow
   that makes required controls unreachable.
3. **Nothing outside the exhibit canvas.** No surrounding site shell, page
   title, navigation, links, footer, or essay below the drawing. Controls and
   optional exposition occupy the available corner spaces inside the viewport.
   Corner overlays must not reflow or displace the clock. "Canvas" means the
   visible exhibit surface: SVG drawing plus accessible HTML overlays is allowed;
   this does not mandate the HTML Canvas API or SVG-only controls.
4. **Explore through movable lenses.** Magnifiers may move and change scale or
   focal point. A psi stabilization/gimbal algorithm belongs inside a lens, never
   in the main clock camera. Keep the source origin unchanged. The ψ axle lies on the real axis at the leading term x: from the origin at 0 to the dial radius at 1, then fixed there, level with the newest prime pane. ψ is hidden below x = 1 and appears whole at 1, where every −1/ρ points the same way. Sum each conjugate pair at its actual weight: the conjugate branch is the zero chain reflected across the real axis, and a dashed parallelogram closes B + B̄ = 2 Re B at the tip (its other diagonal crosses the axis at Re B). The constant terms, half of −log 2π plus the trivial-zero sum, form a shared real link from the axle. The trivial zeros are truncated to the same 649 as the nontrivial ones, so the link is finite at x = 1. The parallelogram draws all four straight sides O, B, B + B̄, B̄. Before x = 1 a dot runs the radius while another runs the rim (speeds in ratio 2π); the magnifier appears from x = 0.85. Lens engagement ramps over 1 ≤ x ≤ 1.25: current points and tips are drawn toward the axle by that weight (containment applies to the weighted tips), and the look-ahead window runs before 1 so the lens widens ahead of the reveal. The ζ chain always shows 128 full-length terms. Source and inscription use the same paired sum; the record starts at the origin at x = 1.
   Any retained overall magnification must pivot exactly around the fixed origin.
5. **Stay on the critical line.** The public exhibit uses sigma = 1/2. Remove
   sigma controls and off-line guided positions; decoded positions and animation
   inputs must not silently override this policy. General numerical routines may
   retain sigma parameters and off-line tests for validation.
6. **Preserve the engaged mechanism.** Sieve, zeta, and psi share the coordinated
   scene, with positive real right, positive imaginary up, and a counterclockwise
   clock. Default winding drives x with x and tau linked 1:−1 (dτ/dx = −1). Filters change
   visibility, not mathematical state or relationships. Themes and celebratory
   effects must preserve the geometry and the meaning of discoveries and zeros.

The fixed exhibit surface is implemented. Do not reintroduce a surrounding page
shell, main-scene drag, sigma controls, or saved pan offsets. Lens, study controls, themes and playback effects are implemented; remaining refinements are tracked in ROADMAP.md.

## Architecture and onboarding

### Control presentation

- **No dropdown menus.** Do not introduce native selects, custom dropdowns, or
  menus that merely hide a list of settings. Use direct buttons, toggles, and
  inline numeric controls. The public controls are dropdown-free; preserve this.
- **Minimalism is the design standard.** Every control must earn its place through
  a clear user task. Size groups to their contents; avoid stretched cards, empty
  filler, nested navigation, and settings pagination. Explanations belong behind
  question-mark buttons, separate from the simultaneous mechanism controls.
- Keep π, ζ, and ψ groups independent and able to remain visible together. Use
  lowercase π (the conventional prime-counting symbol) for the Primes control.
  This is a control label, not a change to the prime-power sieve calculation. Give
  their symbols the same neutral styling; do not assign arbitrary accent colors.
- Put controls beside the object they affect. Sound/appearance belong at the
  upper left and clock adjustments with the lower-left transport. Lens controls
  belong on the lens, not in the ψ group.
- Use `@lucide/svelte` through `src/components/UiIcon.svelte` for interface icons.
  Import individual icons, keep a consistent outline weight, and avoid emoji or
  hand-drawn replacements for standard actions. Mathematical symbols and scene
  geometry are not interface icons.
- Use icon-only buttons for familiar actions, with an accessible name, tooltip,
  visible keyboard focus, and an adequate interaction target. Retain text for
  mathematical meanings or actions an icon alone cannot communicate clearly.
- Agree on a changed control scheme with the user before implementing another
  broad presentation redesign. The compact control rework is implemented.
  The lens now has restrained radial refraction, depth parallax and a jointed
  support. Lens controls remain local; avoid adding an optics settings drawer.

### Implementation

- Svelte **5**, TypeScript, Vite, SVG. Use runes for component reactivity:
  `$state` for mutable reactive state, `$derived` for computed values, `$props`
  for component inputs, and `$effect` for external synchronization and cleanup.
  Ordinary functions and pure math remain ordinary TypeScript. Avoid duplicated
  derived state and effects that write values which can be derived directly.
- Appearance is Analytic (dark default dial and full tip-to-tail ψ vectors), Clockwork (brass/glass) or Expanse (black, white stellar cores,
  colored halos, prime comet tails). Old celestial positions migrate to Expanse.
  The origin-collapse/black-hole effect is deferred.
- Prime panes (slender prime-power hands in Clockwork) represent the exact steps; do not add back the redundant exact ψ
  trace. History follows the continuous recording coordinate, not a step value.
- `src/core/experience.ts` owns bounded playback trails and crossing events;
  `src/core/sound.ts` consumes those events only after explicit sound enablement.
  Respect reduced motion. Visual trail/event age continues during pause; seeking
  and reversal clear it. The optional sampled reference curve is distinct from
  the fading trail and starts hidden.
- The magnifier must copy the source scene, including background, housing and
  material order. Do not introduce lens-only hiding, restyling, or pin-size rules.
  Keep gear inspection accessible when batching shapes for performance. ψ uses
  one oversampled Canvas surface embedded in the shared SVG: paint complete
  wheels in depth order, using the common tooth profiles and metal palette.
  Never batch all edges above all faces. Put the theme attribute on the referenced
  scene itself so theme selectors also work inside SVG use shadow trees.
  Bounded lens-position parallax may shift the sampled focus; reapply tip containment
  before radial refraction and verify the visible tips remain within 90% of the rim.
  Do not restore floating lens/psi captions or the separate discrepancy spring;
  the continuous history itself receives the mechanical ribbon treatment.
- Lens smoothing must never let the full-reference or developing psi tip leave
  the lens: apply the current-frame containment cap after smoothing/manual zoom.
  The auto-fit target looks ±0.75 in x, weighting neighbouring constructions by
  a smooth bump, so prime-power steps and zero arrivals are framed beforehand.
  Zoom-out follows that continuous target directly; only zoom-in eases.
- Keep Eratosthenes, Euler, and Riemann visibility masters together. Theme/view
  presets affect presentation only and never seek or move the origin.
- Do not restore decorative perimeter tick marks or background dot grids.
  Clockwork gears persist with opaque metal faces; Expanse keeps its stars.
- Sound and HVS remain partial ports. See ROADMAP.md for the original features
  still missing; do not equate global CSS filters/event tones with full parity.
- `src/App.svelte` owns playback and user actions; `src/core/state.ts` owns
  winding and saved positions. There is one animation scheduler.
- `src/math/` owns pure calculations. `src/core/mechanism.ts` constructs and
  solves arms. `src/core/layout.ts` projects coordinates and carries inscription.
- `src/components/Exhibit.svelte` composes the scene and lenses. Sieve, Zeta,
  Psi, and ArmTrain components render it; `src/render/` and `src/styles.css`
  own visual choices. Keep interaction targets accessible to pointer and keyboard.
- `src/workers/geometry.worker.ts` samples reference geometry. Do not restart
  dense reference computation on every frame or move it into event handlers.
- Port only necessary behavior from the predecessor; do not copy its layered
  DOM patches, renderer overrides, or abandoned UI. Source references are in
  README.md. Keep current behavior, numerical limits, and planned work distinct.

## Verification and handoff

Run checks appropriate to the change: `npm run build`, `npm test`, and
`npm run test:browser` cover types/build, numerical behavior, and interactions.
Use `npm run format:check` for formatting. Documentation-only changes do not
require a new build or browser run.

Maintain browser coverage that measures the origin in
screen coordinates across the interactions in rule 1, verifies no scrolling on
desktop and mobile, and checks access to corner controls. Test restored legacy
positions with nonzero pan and off-line sigma. Do not restore superseded behavior to satisfy obsolete assertions. Tests cover lens mounts and free pointer, keyboard, and touch movement independently of origin stability. Preserve this coverage when changing optics.

Update ROADMAP.md when a limitation is resolved. Describe what was actually
verified and keep any remaining gaps explicit.
