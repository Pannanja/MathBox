<script lang="ts">
  import { CLOCK_RADIUS as R } from '../core/layout';
  import type { Theme } from '../core/state';
  let { theme }: { theme: Theme } = $props();
</script>

<g class="clock-housing" pointer-events="none" aria-hidden="true">
  <circle r={R + 17} class="housing" />
  {#if theme === 'clockwork'}
    <circle r={R} class="record-surface" />
    <circle r={R + 12} fill="none" stroke="url(#brass)" stroke-width="7" />
  {/if}
  {#if theme !== 'analytic'}<circle r={R + 9} class="fine-ring" />{/if}
  <circle r={R} class="fine-ring" />
</g>
