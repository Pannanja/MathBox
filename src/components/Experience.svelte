<script lang="ts">
  import type { ExhibitState } from '../core/state';
  import { TRAIL_SECONDS, type Experience } from '../core/experience';
  import { CLOCK_RADIUS as R, countScale, paneAngle } from '../core/layout';
  let {
    exhibit,
    experience,
    reference,
    reduced,
  }: {
    exhibit: ExhibitState;
    experience: Experience;
    reference: import('../core/contracts').Complex;
    reduced: boolean;
  } = $props();
  // Join consecutive samples in each fade band. A shared vertex and flat end
  // caps keep a continuous trajectory without double-painting every sample.
  const trailPaths = $derived.by(() => {
    const paths: { d: string; opacity: number; band: number }[] = [];
    const scale = R * exhibit.zetaScale;
    const point = (p: Experience['trail'][number]) =>
      `${(p.re * scale).toFixed(3)},${(-p.im * scale).toFixed(3)}`;
    for (let i = 1; i < experience.trail.length; i++) {
      const p = experience.trail[i];
      const fraction = Math.max(0, 1 - p.age / TRAIL_SECONDS);
      const band = Math.floor(fraction * 32);
      let path = paths.at(-1);
      if (!path || path.band !== band) {
        path = { d: 'M' + point(experience.trail[i - 1]), opacity: fraction ** 2, band };
        paths.push(path);
      }
      path.d += 'L' + point(p);
    }
    // Complete the stroke to the very same point used by the live ζ marker.
    const last = experience.trail.at(-1);
    if (last && (last.re !== reference[0] || last.im !== reference[1])) {
      paths.push({
        d: 'M' + point(last) + 'L' + point({ re: reference[0], im: reference[1], age: 0 }),
        opacity: 1,
        band: 32,
      });
    }
    return paths;
  });
</script>

<g pointer-events="none" aria-hidden="true" data-testid="experience">
  {#if exhibit.trail && !reduced && exhibit.mode === 'zeta' && exhibit.layers & 8}
    <g class="playback-trail" clip-path="url(#dial-window)" data-testid="zeta-trail">
      {#each trailPaths as path}
        <path d={path.d} opacity={path.opacity} fill="none" class="trail-segment hairline" />
      {/each}
    </g>
  {/if}
  {#if exhibit.effects !== 'off'}
    {#each experience.moments as event}
      {@const age = event.age / 1.1}
      {#if event.kind === 'zero' && exhibit.mode === 'zeta' && exhibit.layers & 8}
        <circle
          r={reduced ? 10 : 7 + age * 22}
          opacity={(1 - age) * (event.reverse ? 0.4 : 0.8)}
          class="zero-moment hairline"
          data-testid="zero-moment"
        />
      {:else if event.kind !== 'zero' && exhibit.layers & 1 && (event.kind === 'prime' || exhibit.layers & 64)}
        {@const radius = countScale(exhibit.x) * event.value}
        <circle
          cx={radius * Math.cos(paneAngle(event.value, exhibit.x))}
          cy={-radius * Math.sin(paneAngle(event.value, exhibit.x))}
          r={reduced ? 6 : 4 + age * (event.kind === 'prime' ? 18 : 8)}
          opacity={(1 - age) * (event.reverse ? 0.25 : 0.8)}
          class="prime-moment hairline"
          class:power-moment={event.kind === 'power'}
          data-testid="prime-moment"
        />
      {/if}
    {/each}
  {/if}
</g>
