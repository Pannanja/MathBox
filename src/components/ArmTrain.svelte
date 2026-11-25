<script lang="ts">
  import type { SolvedArm } from '../core/mechanism';
  import type { Theme } from '../core/state';
  import type { Pick } from '../core/selection';
  import { samePick } from '../core/selection';
  import { gearTeeth, gearEdge } from '../render/geometry';
  import { themes } from '../render/themes';
  const instance = $props.id();
  let {
    arms,
    scale,
    theme,
    kind,
    reached = Infinity,
    selection = null,
    onhover = () => {},
    onpick = () => {},
  }: {
    arms: SolvedArm[];
    scale: number;
    theme: Theme;
    kind: 'xi' | 'psi' | 'sum';
    reached?: number;
    selection?: Pick | null;
    onhover?: (pick: Pick | null) => void;
    onpick?: (pick: Pick) => void;
  } = $props();
</script>

{#each arms as arm (arm.id)}
  {@const radius = arm.length * scale}
  {@const id = +arm.id.split(':')[1]}
  {@const pick: Pick = { kind: kind === 'sum' ? 'term' : kind === 'psi' ? 'zero' : 'xi', id, prime: kind === 'sum' && arm.family > 1 ? arm.family : undefined, label: arm.label, detail: `Radius ${arm.length.toPrecision(5)} · phase ${arm.phase.toFixed(3)} radians` }}
  {@const selected =
    samePick(selection, pick) ||
    (kind === 'sum' && selection?.prime !== undefined && id % selection.prime === 0)}
  {@const ink =
    kind === 'xi'
      ? arm.family > 0
        ? themes[theme].forward
        : themes[theme].reverse
      : kind === 'sum'
        ? themes[theme].family(arm.family)
        : theme === 'clockwork'
          ? id < reached
            ? '#b39a60'
            : '#8d999c'
          : themes[theme].family(arm.family + 2)}
  {@const pinRadius =
    kind === 'psi' && theme === 'expanse'
      ? Math.min(selected ? 0.35 : 0.22, radius * 0.1)
      : selected
        ? 3.5
        : theme === 'expanse'
          ? Math.min(3, 1 + radius / 18)
          : 1.4}
  {@const haloRadius = kind === 'psi' ? Math.min(1, radius * 0.35) : selected ? 8 : 5}
  {#if radius > 0.01}
    <g
      transform={`translate(${arm.start[0] * scale},${-arm.start[1] * scale})`}
      class="arm"
      class:selected
      data-arm={arm.id}
      data-reached={kind === 'psi' ? id < reached : undefined}
      role="button"
      tabindex="0"
      aria-label={`Inspect ${kind === 'sum' ? 'term' : kind === 'psi' ? 'zero pair' : 'xi arm'} ${id}`}
      onpointerenter={() => onhover(pick)}
      onpointerleave={() => onhover(null)}
      onfocus={() => onhover(pick)}
      onblur={() => onhover(null)}
      onclick={(e) => {
        e.stopPropagation();
        onpick(pick);
      }}
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onpick(pick);
        }
      }}
    >
      <title>{pick.label}; {pick.detail}</title>

      {#if theme !== 'analytic' && (radius > 1.5 || (kind === 'psi' && theme === 'clockwork')) && (theme === 'clockwork' || kind !== 'sum' || selected || arm === arms.at(-1))}
        {#if theme === 'clockwork'}
          {#if !(kind === 'sum' && arm.drive.rate === 0)}
            {@const shape = `#cog-${gearTeeth(radius)}`}
            {@const rotation = `scale(${radius}) rotate(${(-arm.phase * 180) / Math.PI})`}
            {@const clip = `${instance}-${arm.id.replace(':', '-')}`}
            <defs
              ><clipPath id={clip} clipPathUnits="userSpaceOnUse">
                <use href={shape} transform={rotation} />
              </clipPath></defs
            >
            <use
              href={shape}
              transform={`translate(${Math.min(0.7, radius * 0.04)},${Math.min(1.2, radius * 0.07)}) ${rotation}`}
              fill="#000"
              fill-opacity=".55"
              pointer-events="none"
            />
            <!-- Only the clipping contour turns; the metal face and its lighting stay fixed. -->
            <circle
              r={radius}
              clip-path={`url(#${clip})`}
              fill={kind === 'psi' && id >= reached ? 'url(#steel)' : 'url(#brass)'}
              fill-opacity="1"
              pointer-events="none"
              class="metal-gear"
            />
            <use
              href={shape}
              transform={rotation}
              fill="none"
              stroke="#30271b"
              stroke-width={(selected ? 0.4 : gearEdge(radius)) / radius}
              stroke-linejoin="round"
              pointer-events="none"
              class="hairline"
            />
            {#if radius > 3}
              <circle
                r={radius * 0.89}
                fill="none"
                stroke="#ddc99b"
                stroke-opacity=".15"
                stroke-width={gearEdge(radius) * 0.5}
                class="hairline"
                pointer-events="none"
              />
            {/if}
          {/if}
        {:else}<circle
            r={radius}
            fill="none"
            stroke={ink}
            stroke-opacity={selected ? 0.7 : 0.3}
            stroke-width=".7"
            class="hairline"
          />{/if}
      {/if}
      {#if theme !== 'analytic'}<line
          x2={(arm.end[0] - arm.start[0]) * scale}
          y2={-(arm.end[1] - arm.start[1]) * scale}
          stroke="var(--panel)"
          stroke-width={selected ? 6 : 3.5}
          class="hairline"
        />{/if}
      <line
        x2={(arm.end[0] - arm.start[0]) * scale}
        y2={-(arm.end[1] - arm.start[1]) * scale}
        stroke={ink}
        stroke-width={selected ? 2.8 : kind === 'sum' ? 1.3 : 1.5}
        stroke-opacity={selected ? 1 : 0.85}
        class="hairline"
      />
      <line
        x2={(arm.end[0] - arm.start[0]) * scale}
        y2={-(arm.end[1] - arm.start[1]) * scale}
        stroke="transparent"
        stroke-width="9"
        class="hit-path"
      />
      {#if (radius > 2 || kind === 'psi') && theme === 'expanse'}
        <circle
          cx={(arm.end[0] - arm.start[0]) * scale}
          cy={-(arm.end[1] - arm.start[1]) * scale}
          r={haloRadius}
          style={`--halo-radius:${haloRadius}px`}
          fill={ink}
          opacity=".1"
          class="star-halo"
        />
        <circle
          cx={(arm.end[0] - arm.start[0]) * scale}
          cy={-(arm.end[1] - arm.start[1]) * scale}
          r={haloRadius * 0.6}
          style={`--halo-radius:${haloRadius * 0.6}px`}
          fill={ink}
          opacity=".3"
          class="star-halo"
        />
      {/if}
      {#if theme !== 'analytic' && (radius > 2 || (kind === 'psi' && theme === 'expanse'))}<circle
          cx={(arm.end[0] - arm.start[0]) * scale}
          cy={-(arm.end[1] - arm.start[1]) * scale}
          r={pinRadius}
          style={`--pin-radius:${pinRadius}px`}
          class="arm-pin"
          fill={theme === 'expanse' ? '#fff' : ink}
        />{/if}
      {#if theme === 'clockwork'}
        <circle
          r={Math.min(1.6, radius * 0.13)}
          fill="#19211e"
          stroke="#a38f61"
          stroke-width=".3"
          pointer-events="none"
        />
      {/if}
    </g>
  {/if}
{/each}
