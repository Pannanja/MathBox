<script lang="ts">
  import { createGearSurface } from '../render/gear-surface';
  import type { SolvedArm } from '../core/mechanism';
  import type { Pick } from '../core/selection';
  import { psiGearWheels } from '../render/psi-gears';
  let {
    arms,
    scale,
    reached,
    detailScale,
    simplifyDetail = false,
    selection,
    onhover,
    onpick,
  }: {
    arms: SolvedArm[];
    scale: number;
    reached: number;
    detailScale: number;
    simplifyDetail?: boolean;
    selection: Pick | null;
    onhover: (p: Pick | null) => void;
    onpick: (p: Pick) => void;
  } = $props();
  const paint = createGearSurface();
  let group: SVGGElement;
  let index = $state(0);
  const layers = $derived(psiGearWheels(arms, scale, reached));
  const surface = $derived(paint(layers, detailScale, simplifyDetail));
  const chosen = $derived(selection?.kind === 'zero' ? arms[selection.id] : null);
  function pick(i: number): Pick {
    const arm = arms[i];
    return {
      kind: 'zero',
      id: i,
      label: arm.label,
      detail: `${i < reached ? 'Reached · gold' : 'Unreached · silver'} · Radius ${arm.length.toPrecision(5)}`,
    };
  }
  function hit(e: PointerEvent | MouseEvent) {
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(group.getScreenCTM()!.inverse());
    // Frontmost containing wheel wins. Tiny targets still follow their exact axles.
    for (let i = arms.length - 1; i >= 0; i--) {
      const a = arms[i],
        r = a.length * scale;
      if (Math.hypot(p.x - a.start[0] * scale, p.y + a.start[1] * scale) <= Math.max(r, 0.3))
        return i;
    }
    return -1;
  }
</script>

<g
  bind:this={group}
  data-testid="psi-gears"
  data-count={arms.length}
  data-reached={reached}
  role="button"
  tabindex="0"
  aria-label="Inspect psi gears; use arrow keys to choose a zero pair"
  onpointermove={(e) => {
    const i = hit(e);
    onhover(i < 0 ? null : pick(i));
  }}
  onpointerleave={() => onhover(null)}
  onclick={(e) => {
    const i = hit(e);
    if (i >= 0) {
      e.stopPropagation();
      onpick(pick(i));
    }
  }}
  onfocus={() => {
    index = Math.min(index, arms.length - 1);
    if (index >= 0) onhover(pick(index));
  }}
  onblur={() => onhover(null)}
  onkeydown={(e) => {
    if (!arms.length) return;
    if (
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', ' '].includes(
        e.key,
      )
    ) {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'Enter' || e.key === ' ') onpick(pick(index));
      else {
        index =
          e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? arms.length - 1
              : Math.max(
                  0,
                  Math.min(
                    arms.length - 1,
                    index + (['ArrowRight', 'ArrowDown'].includes(e.key) ? 1 : -1),
                  ),
                );
        onhover(pick(index));
      }
    }
  }}
>
  <image
    x={surface.x}
    y={surface.y}
    width={surface.width}
    height={surface.height}
    href={surface.href}
    data-testid="psi-gear-surface"
    data-pixels={surface.pixels}
  />
  {#if chosen}
    <circle
      cx={chosen.start[0] * scale}
      cy={-chosen.start[1] * scale}
      r={chosen.length * scale}
      fill="none"
      stroke="#f4e0a2"
      stroke-width=".12"
      pointer-events="none"
    />
  {/if}
</g>
