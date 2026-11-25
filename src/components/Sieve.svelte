<script lang="ts">
  import { sieveAt } from '../core/mechanism';
  import { CLOCK_RADIUS as R } from '../core/layout';
  import type { Theme } from '../core/state';
  import type { Pick } from '../core/selection';
  import { themes } from '../render/themes';
  import { panePath } from '../render/geometry';
  let {
    x,
    theme,
    selection,
    onhover,
    onpick,
  }: {
    x: number;
    theme: Theme;
    selection: Pick | null;
    onhover: (pick: Pick | null) => void;
    onpick: (pick: Pick) => void;
  } = $props();
  const model = $derived(sieveAt(x));
</script>

<g class="sieve-dial" data-testid="sieve">
  {#if theme === 'clockwork'}
    <g class="dial-face" pointer-events="none">
      <circle r={R} class="record-surface" fill-opacity=".48" />
      <circle r={R} fill="url(#glass)" />
      <circle r={R} fill="url(#dial-depth)" />
    </g>
  {/if}
  <line x1={-R} x2={R + 17} class="axis" /><line y1={-R - 17} y2={R} class="axis" />
  <g class="prime-panes">
    {#each model.panes as pane (pane.q)}
      {@const r = pane.radius * R}
      {@const ink = themes[theme].family(pane.p)}
      {@const pick: Pick = { kind: 'pane', id: pane.q, prime: pane.p, label: `Pane ${pane.q} = ${pane.p}^${pane.k}`, detail: `Period ${pane.q} · radius ${pane.q}/x · ψ birth +log ${pane.p}` }}
      {@const selected = selection?.prime === pane.p}
      {#if theme === 'expanse' || selected}<circle
          class:prime-power={pane.k > 1}
          {r}
          stroke={ink}
          stroke-opacity={selected ? 0.35 : 0.12}
          fill="none"
          stroke-width=".7"
          class="hairline"
        />
      {/if}
      {#if pane.growth > 0}
        <g
          role="button"
          tabindex="0"
          aria-label={`Inspect pane ${pane.q}`}
          data-pane={pane.q}
          data-prime={pane.p}
          class:selected
          class:prime-power={pane.k > 1}
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
          {#if theme === 'clockwork'}
            <g transform={`rotate(${(-pane.angle * 180) / Math.PI})`} class="prime-hand">
              <path
                d={`M6,-.6 Q${r * 0.45},-1.8 ${r},0 Q${r * 0.45},1.8 6,.6 Z`}
                fill={selected ? ink : pane.k === 1 ? '#a5a48c' : '#6c8384'}
                fill-opacity={0.35 + 0.65 * pane.growth}
                stroke="#252b26"
                stroke-width=".3"
              />
              <circle cx={r} r={pane.k === 1 ? 1 : 0.7} fill={selected ? ink : '#b6aa7f'} />
              <path
                d={`M6,0 H${r}`}
                fill="none"
                stroke="transparent"
                stroke-width="7"
                class="hit-path"
              />
            </g>
          {:else}
            <path
              d={panePath(r, pane.angle, ((2 * Math.PI) / pane.q) * pane.growth)}
              fill="none"
              stroke={ink}
              stroke-opacity={selected ? 1 : pane.active ? 0.9 : 0.57}
              stroke-width={selected ? 4 : pane.k === 1 ? 2.5 : 1.5}
              class="hairline"
            />
            <path
              d={panePath(r, pane.angle, ((2 * Math.PI) / pane.q) * pane.growth)}
              fill="none"
              stroke="transparent"
              stroke-width="11"
              class="hit-path"
            />
          {/if}
          {#if theme === 'expanse'}
            {@const tailStart = pane.angle - (2 * Math.PI * pane.growth) / pane.q}
            <g
              transform={`rotate(${(-tailStart * 180) / Math.PI}) scale(${r})`}
              style={`color:${ink}`}
            >
              <defs
                ><linearGradient
                  id={`tail-${pane.q}`}
                  gradientUnits="userSpaceOnUse"
                  x1="1"
                  y1="0"
                  x2={Math.cos(0.36)}
                  y2={Math.sin(0.36)}
                >
                  <stop stop-color="currentColor" stop-opacity=".6" /><stop
                    offset="1"
                    stop-color="currentColor"
                    stop-opacity="0"
                  />
                </linearGradient></defs
              >
              <path
                d={panePath(1, 0, 0.36)}
                stroke={`url(#tail-${pane.q})`}
                stroke-width="2"
                fill="none"
                class="hairline comet-tail"
              />
            </g>
            <circle
              cx={r * Math.cos(pane.angle)}
              cy={-r * Math.sin(pane.angle)}
              r="8"
              style="--halo-radius:8px"
              class="star-halo"
              fill={ink}
              opacity=".1"
            />
            <circle
              cx={r * Math.cos(pane.angle)}
              cy={-r * Math.sin(pane.angle)}
              r="5"
              style="--halo-radius:5px"
              class="star-halo"
              fill={ink}
              opacity=".3"
            />
            <circle
              cx={r * Math.cos(pane.angle)}
              cy={-r * Math.sin(pane.angle)}
              r={pane.k === 1 ? 3.5 : 2}
              fill={ink}
            />{/if}
          {#if r > 55 && (selected || pane.q <= 13 || pane.active)}<text
              x={(r + 9) * Math.cos(pane.angle)}
              y={-(r + 9) * Math.sin(pane.angle)}
              class="pane-label"
              fill={ink}>{pane.q}</text
            >{/if}
        </g>
      {/if}
    {/each}
  </g>
  <line x1="10" x2={R + 3} class="meeting-ray" />
  <g transform={`rotate(${-360 * (x % 1)})`} data-testid="clock-hand" pointer-events="none">
    {#if theme === 'clockwork'}
      <path
        d={`M-29,0 C-29,-6 -18,-7 -11,-3 C28,-5 95,-1 ${R - 14},0 C95,1 28,5 -11,3 C-18,7 -29,6 -29,0 Z`}
        fill="url(#hand-metal)"
        stroke="#161c20"
        stroke-width=".7"
        class="hairline"
        filter="url(#contact-shadow)"
      />
      <path
        d={`M9,-.6 Q110,-2 ${R - 16},0`}
        fill="none"
        stroke="#c4b384"
        stroke-width=".45"
        class="hairline"
      />
      <ellipse cx="-21" rx="4" ry="2.4" fill="#14191c" stroke="#7e7357" stroke-width=".5" />
    {:else}<line x2={R} class="hand" />{/if}
  </g>
  <circle r="7" class="axle" /><circle r="2.5" class="axle-core" />
</g>
