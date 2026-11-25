<script lang="ts">
  import type { SolvedArm } from '../core/mechanism';
  import type { Pick } from '../core/selection';
  import { pointPath } from '../render/geometry';

  let {
    arms,
    offset,
    scale,
    selection,
    onhover,
    onpick,
  }: {
    arms: SolvedArm[];
    offset: number;
    scale: number;
    selection: Pick | null;
    onhover: (p: Pick | null) => void;
    onpick: (p: Pick) => void;
  } = $props();
  const path = $derived(pointPath([[0, 0], [offset, 0], ...arms.map((arm) => arm.end)], scale));
  const chosen = $derived(selection?.kind === 'zero' ? arms[selection.id] : undefined);
  let index = $state(0);
  let group: SVGGElement;

  function pick(i: number): Pick {
    const arm = arms[i];
    return {
      kind: 'zero',
      id: i,
      label: arm.label,
      detail: `Length ${arm.length.toPrecision(4)} · phase ${arm.phase.toFixed(3)} radians`,
    };
  }
  function nearest(event: MouseEvent) {
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      group.getScreenCTM()!.inverse(),
    );
    const x = point.x / scale,
      y = -point.y / scale;
    let nearestIndex = 0,
      best = Infinity;
    arms.forEach((arm, i) => {
      if (arm.length === 0) return;
      const [ax, ay] = arm.start;
      const dx = arm.end[0] - ax,
        dy = arm.end[1] - ay;
      const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / arm.length ** 2));
      const distance = (x - ax - t * dx) ** 2 + (y - ay - t * dy) ** 2;
      if (distance < best) {
        best = distance;
        nearestIndex = i;
      }
    });
    return nearestIndex;
  }
  function key(event: KeyboardEvent) {
    const last = arms.length - 1;
    index = Math.min(index, last);
    switch (event.key) {
      case 'Home':
        index = 0;
        break;
      case 'End':
        index = last;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        index = Math.max(0, index - 1);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        index = Math.min(last, index + 1);
        break;
      case 'Enter':
      case ' ':
        onpick(pick(index));
        break;
      default:
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    onhover(pick(index));
  }
</script>

<g
  bind:this={group}
  data-testid="psi-vectors"
  role="button"
  tabindex="0"
  aria-label="Inspect psi vectors; use arrow keys to choose a zero pair"
  onfocus={() => onhover(pick(Math.min(index, arms.length - 1)))}
  onblur={() => onhover(null)}
  onkeydown={key}
  onpointermove={(event) => {
    index = nearest(event);
    onhover(pick(index));
  }}
  onpointerleave={() => onhover(null)}
  onclick={(event) => {
    event.stopPropagation();
    index = nearest(event);
    onpick(pick(index));
  }}
>
  <path d={path} fill="none" stroke-linejoin="round" class="psi-chain hairline" />
  <path d={path} fill="none" stroke="transparent" stroke-width="9" class="hit-path" />
  {#if chosen}
    <path
      d={pointPath([chosen.start, chosen.end], scale)}
      fill="none"
      stroke="#ffe0a0"
      stroke-width="2.2"
      pointer-events="none"
      class="hairline"
    />
  {/if}
</g>
