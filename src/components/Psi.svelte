<script lang="ts">
  import ArmTrain from './ArmTrain.svelte';
  import PsiGearTrain from './PsiGearTrain.svelte';
  import PsiVectors from './PsiVectors.svelte';
  import Ratchet from './Ratchet.svelte';
  import type { psiMechanism } from '../core/mechanism';
  import { countScale, CLOCK_RADIUS } from '../core/layout';
  import { passedZeros } from '../math/psi';
  import { pointPath } from '../render/geometry';
  import type { ExhibitState } from '../core/state';
  import type { Pick } from '../core/selection';
  let {
    exhibit,
    full,
    detailScale,
    selection,
    onhover,
    onpick,
  }: {
    exhibit: ExhibitState;
    full: ReturnType<typeof psiMechanism>;
    detailScale: number;
    selection: Pick | null;
    onhover: (p: Pick | null) => void;
    onpick: (p: Pick) => void;
  } = $props();
  const count = $derived(passedZeros(exhibit.tau, exhibit.zeros));
  const reachedArms = $derived(full.arms.slice(0, count));
  const activeTip = $derived(full.arms[count - 1]?.end ?? [full.offset, 0]);
  const unit = $derived(countScale(exhibit.x));
  const axleX = $derived(full.anchor * unit);
  const sliderX = $derived(axleX + 2 * activeTip[0] * unit);
  // The conjugate chain is the zero chain reflected across the real axis.
  // B + B̄ = 2 Re B: the parallelogram's far corner is the tip, and its other
  // diagonal, from B to B̄, crosses the axis at Re B, halfway there.
  const bx = $derived(full.branchTip[0] * unit),
    by = $derived(-full.branchTip[1] * unit);
  const pathId = $props.id();
  const fullPath = $derived(
    pointPath([[0, 0], [full.offset, 0], ...full.arms.map((a) => a.end)], unit),
  );
</script>

<g data-testid="psi-mechanism">
  {#if exhibit.x < 1}
    <!-- Over 0 ≤ x ≤ 1 one dot runs the radius while the other runs the rim:
         speeds in the ratio 2π, meeting where the ψ axle appears. -->
    {@const t = Math.min(exhibit.x, 1)}
    <g class="radius-dots" pointer-events="none">
      <circle cx={t * CLOCK_RADIUS} cy="0" r="3.2" class="radius-dot" data-testid="radius-dot" />
      <circle
        cx={CLOCK_RADIUS * Math.cos(2 * Math.PI * t)}
        cy={-CLOCK_RADIUS * Math.sin(2 * Math.PI * t)}
        r="3.2"
        class="radius-dot"
        data-testid="perimeter-dot"
      />
    </g>
  {/if}
  {#if exhibit.x >= 1}<g>
      {#if exhibit.theme === 'clockwork'}
        <g class="psi-frame" pointer-events="none" aria-hidden="true">
          <!-- Rear column joins the main bearing to the real-axis guide rail. -->
          <rect
            x={axleX - 1.1}
            y="-2"
            width="2.2"
            height="7"
            rx=".8"
            fill="url(#steel)"
            stroke="#252b29"
            stroke-width=".16"
          />
          <path
            d={`M${axleX - 3},4.5 h6 v1.8 h-6 Z`}
            fill="url(#steel)"
            stroke="#252b29"
            stroke-width=".16"
          />
        </g>
      {/if}
      <g transform={`translate(${axleX},0)`} data-testid="psi-axle">
        {#if exhibit.theme === 'clockwork'}
          <path d={fullPath} class="psi-carrier" fill="none" stroke="#697876" stroke-width=".35" />
        {:else if exhibit.theme === 'expanse'}
          <path d={fullPath} class="reference-chain hairline" />
        {/if}
        <defs><path id={pathId} d={fullPath} class="hairline" /></defs>
        <g class="psi-arms">
          <use
            href={'#' + pathId}
            transform="scale(1,-1)"
            class="psi-conjugate hairline"
            pointer-events="none"
            data-testid="psi-conjugate-sum"
          />
          <path
            d={`M0,0 L${bx},${by} L${2 * bx},0 L${bx},${-by} Z`}
            class="psi-balance hairline"
            pointer-events="none"
            data-testid="psi-balance"
          />
          <path
            d={`M${bx},${by} V${-by}`}
            class="psi-balance psi-diagonal hairline"
            pointer-events="none"
          />
          {#if exhibit.theme === 'clockwork' && exhibit.x > 0}
            <PsiGearTrain
              arms={full.arms}
              reached={count}
              scale={unit}
              {detailScale}
              {selection}
              {onhover}
              {onpick}
            />
          {:else if exhibit.theme === 'analytic'}
            <PsiVectors
              arms={full.arms}
              offset={full.offset}
              scale={unit}
              {selection}
              {onhover}
              {onpick}
            />
          {:else}
            <ArmTrain
              arms={reachedArms}
              scale={unit}
              theme={exhibit.theme}
              kind="psi"
              {selection}
              {onhover}
              {onpick}
            />
          {/if}
        </g>
        <circle r="2" class="origin psi-pivot" />
        <circle cx={full.tip[0] * unit} cy={-full.tip[1] * unit} r="2" class="reference-stylus" />
        <circle cx={2 * activeTip[0] * unit} cy="0" r="2" class="developing-stylus" />
      </g>
      {#if exhibit.theme === 'clockwork' && exhibit.x > 1}
        <g class="psi-supports" pointer-events="none" aria-hidden="true">
          <!-- A slotted yoke carries the developing pin to its guided Re shoe. -->
          <rect
            x={sliderX - 0.65}
            y="-.8"
            width="1.3"
            height="1.6"
            rx=".65"
            fill="none"
            stroke="#252b29"
            stroke-width=".55"
          />
          <rect
            x={sliderX - 0.65}
            y="-.8"
            width="1.3"
            height="1.6"
            rx=".65"
            fill="none"
            stroke="#9aa49b"
            stroke-width=".25"
          />
          <circle cx={sliderX} cy="0" r=".22" fill="#c2a56b" />
          <path
            d={`M${sliderX - 1.4},-.45 h2.8 v1.3 h-2.8 Z`}
            fill="url(#steel)"
            stroke="#252b29"
            stroke-width=".12"
          />
        </g>
      {/if}
    </g>{/if}
  {#if exhibit.theme === 'clockwork'}
    <Ratchet x={exhibit.x} {unit} />
  {/if}
</g>
