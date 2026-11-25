<script lang="ts">
  import ArmTrain from './ArmTrain.svelte';
  import { sumMechanism, xiMechanism } from '../core/mechanism';
  import type { ExhibitState } from '../core/state';
  import type { Pick } from '../core/selection';
  import { CLOCK_RADIUS as R } from '../core/layout';
  import { pointPath } from '../render/geometry';
  import type { Complex } from '../core/contracts';
  let {
    exhibit,
    locus,
    reference,
    selection,
    onhover,
    onpick,
  }: {
    exhibit: ExhibitState;
    locus: Float64Array;
    reference: Complex;
    selection: Pick | null;
    onhover: (p: Pick | null) => void;
    onpick: (p: Pick) => void;
  } = $props();
  const sum = $derived(sumMechanism(exhibit.sigma, exhibit.tau));
  const xi = $derived(
    exhibit.mode === 'xi' && Math.abs(exhibit.tau) <= 15
      ? xiMechanism(exhibit.sigma, exhibit.tau)
      : null,
  );
  const unit = $derived(R * exhibit.zetaScale);
  const curve = $derived.by(() => {
    const points: number[][] = [];
    for (let i = 0; i < locus.length; i += 3) {
      if (i > 0 && Math.abs(exhibit.sigma - 1) < 1e-10 && locus[i - 3] <= 0 && locus[i] >= 0)
        points.push([NaN, NaN]);
      points.push([locus[i + 1], locus[i + 2]]);
    }
    return pointPath(points, unit);
  });
</script>

<g data-testid="zeta-mechanism" clip-path="url(#dial-window)">
  {#if exhibit.mode === 'zeta'}
    <path
      d={curve}
      visibility={exhibit.referenceCurve ? 'visible' : 'hidden'}
      class="zeta-locus hairline"
      data-testid="zeta-locus"
    />
    <g data-testid="sum-chain"
      ><ArmTrain
        arms={sum.arms}
        scale={unit}
        theme={exhibit.theme}
        kind="sum"
        {selection}
        {onhover}
        {onpick}
      /></g
    >
    <circle cx={sum.endpoint[0] * unit} cy={-sum.endpoint[1] * unit} r="4" class="sum-endpoint" />
    {#if reference.every(Number.isFinite)}
      <circle
        cx={reference[0] * unit}
        cy={-reference[1] * unit}
        r="7"
        class="endpoint"
        data-testid="zeta-point"
      />
      <circle cx={reference[0] * unit} cy={-reference[1] * unit} r="2" class="origin" />
    {/if}
  {:else if xi}
    <g data-testid="xi-mechanism"
      ><ArmTrain
        arms={xi.arms}
        scale={500 * exhibit.xiScale}
        theme={exhibit.theme}
        kind="xi"
        {selection}
        {onhover}
        {onpick}
      />
      <circle
        cx={xi.endpoint[0] * 500 * exhibit.xiScale}
        cy={-xi.endpoint[1] * 500 * exhibit.xiScale}
        r="6"
        class="endpoint"
      />
    </g>
  {:else}<text y="-190" text-anchor="middle" class="svg-caption"
      >ξ paired view: |τ| ≤ 15 · ζ remains available</text
    >{/if}
</g>
