<script lang="ts">
  import { ratchetGeometry } from '../render/ratchet';
  import { CLOCK_RADIUS as R } from '../core/layout';
  let { x, unit }: { x: number; unit: number } = $props();
  const model = $derived(ratchetGeometry(x, unit));
  const rack = $derived(
    `M0,1.8 ${model.teeth.map((t) => `L${t.right},0 V1.8`).join(' ')} H${model.stop + 2} V3.8 H0 Z`,
  );
</script>

<g class="count-ratchet" data-testid="count-ratchet" pointer-events="none">
  <title>Prime-power rack: tooth widths are log p; the guided pawl follows the exact count.</title>
  <!-- A continuous rack body, seated in a rail fixed to the dial. -->
  <path d={`M0,4.4 H${R + 8} V6.3 H0 Z`} fill="url(#steel)" stroke="#242b29" stroke-width=".16" />
  <path
    d={rack}
    fill="url(#brass)"
    stroke="#302b23"
    stroke-width=".16"
    data-testid="ratchet-rack"
  />
  <path d={`M0,4.1 H${R + 8}`} stroke="#bec0ad" stroke-width=".12" />
  {#each [4, R + 5] as bolt}
    <circle cx={bolt} cy="5.4" r=".45" fill="#252b29" />
  {/each}
  <g transform={`translate(${model.stop},0)`} data-testid="ratchet-stop">
    <path
      d="M-4,5.8 V-2.5 Q-4,-3.3 -3,-3.3 H-2 V4.5 H2 V5.8 Z"
      fill="url(#steel)"
      stroke="#242b29"
      stroke-width=".14"
    />
    <path
      d={`M-3,-2.6 Q-1,-2.6 0,${-model.lift * 0.3} L1,-1.6`}
      fill="none"
      stroke="#b6a274"
      stroke-width=".3"
      stroke-linecap="round"
    />
    <circle cx="-3" cy="-2.6" r=".4" fill="#b6a274" stroke="#252b29" stroke-width=".12" />
  </g>
</g>
