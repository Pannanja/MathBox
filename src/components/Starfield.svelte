<script lang="ts">
  let { view }: { view: { x: number; y: number; w: number; h: number } } = $props();
  // Fixed seed: themes and resize never shuffle stars or introduce another clock.
  const stars = Array.from({ length: 220 }, (_, i) => {
    const random = (n: number) => {
      const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
      return v - Math.floor(v);
    };
    return {
      x: random(i * 3),
      y: random(i * 3 + 1),
      r: 0.3 + random(i * 3 + 2) * 0.8,
      alpha: 0.2 + random(i + 900) * 0.6,
    };
  });
</script>

<g class="starfield" pointer-events="none" aria-hidden="true">
  {#each stars as star}<circle
      cx={view.x + star.x * view.w}
      cy={view.y + star.y * view.h}
      r={star.r}
      fill="white"
      opacity={star.alpha}
    />{/each}
</g>
