<script lang="ts">
  import { metals } from '../render/materials';
  import { onMount } from 'svelte';
  import { lensDisplacementMap, lensRestingPlace } from '../render/lens';
  import Experience from './Experience.svelte';
  import UiIcon from './UiIcon.svelte';
  import Starfield from './Starfield.svelte';
  import type { Experience as ExperienceState } from '../core/experience';
  import Sieve from './Sieve.svelte';
  import ClockHousing from './ClockHousing.svelte';
  import Zeta from './Zeta.svelte';
  import type { psiMechanism } from '../core/mechanism';
  import Psi from './Psi.svelte';
  import { clamp } from '../core/state';
  import { psiOptics, lensParallax } from '../core/optics';
  import type { ExhibitState } from '../core/state';
  import type { Pick } from '../core/selection';
  import { samePick } from '../core/selection';
  import { WORLD, CLOCK_RADIUS as R } from '../core/layout';
  import { recordPaths } from '../math/record';
  import { cogPath } from '../render/geometry';
  import GeometryWorker from '../workers/geometry.worker?worker';
  let {
    exhibit,
    railHeight,
    reference,
    psi,
    experience,
    reduced,
    optics,
    lensScale = exhibit.psiScale,
    onchange,
  }: {
    exhibit: ExhibitState;
    railHeight: number;
    reference: import('../core/contracts').Complex;
    psi: ReturnType<typeof psiMechanism>;
    experience: ExperienceState;
    reduced: boolean;
    lensScale?: number;
    optics: ReturnType<typeof psiOptics>;
    onchange: (patch: Partial<ExhibitState>) => void;
  } = $props();
  let svg: SVGSVGElement;
  let drag: { id: number; x: number; y: number } | null = null;
  let width = $state(920),
    height = $state(850);
  // Panels never participate in this measurement. The origin is always viewport center.
  const unit = $derived((Math.min(width, height) * 0.94) / (2 * R));
  const view = $derived({
    w: width / unit,
    h: height / unit,
    x: WORLD.centre[0] - width / unit / 2,
    y: WORLD.centre[1] - height / unit / 2,
  });
  let pinned = $state<Pick | null>(null),
    hover = $state<Pick | null>(null);
  let record = $state(new Float64Array()),
    locus = $state(new Float64Array());
  let recordCount = $state(0),
    computing = $state(false);
  const selection = $derived(hover ?? pinned);
  const paths = $derived(recordPaths(record, exhibit.x, recordCount));
  let displacementMap = $state('');
  onMount(() => {
    displacementMap = lensDisplacementMap();
  });
  // The magnifier rests at the lower right, clear of the corner controls.
  const resting = $derived(
    lensRestingPlace(
      {
        x: width - exhibit.lensRadius * unit - 24,
        y: height - exhibit.lensRadius * unit - 56,
      },
      exhibit.lensRadius * unit,
      width,
      height,
      railHeight,
    ),
  );
  const lensHome = $derived({ x: view.x + resting.x / unit, y: view.y + resting.y / unit });
  const lens = $derived({
    x: clamp(
      exhibit.lensX < 0 ? lensHome.x : view.x + exhibit.lensX * view.w,
      view.x + exhibit.lensRadius + 16,
      view.x + view.w - exhibit.lensRadius - 16,
    ),
    y: clamp(
      exhibit.lensY < 0 ? lensHome.y : view.y + exhibit.lensY * view.h,
      view.y + exhibit.lensRadius + 35,
      view.y + view.h - exhibit.lensRadius - 35,
    ),
    r: exhibit.lensRadius,
  });
  const suspension = $derived.by(() => {
    const base = {
      x: WORLD.centre[0] + R + 12,
      y: WORLD.centre[1] + 38,
    };
    const dx = base.x - lens.x,
      dy = base.y - lens.y,
      distance = Math.max(1, Math.hypot(dx, dy));
    const end = {
      x: lens.x + (dx / distance) * (lens.r + 5),
      y: lens.y + (dy / distance) * (lens.r + 5),
    };
    const elbow = { x: (base.x + end.x) / 2 + 12, y: (base.y + end.y) / 2 + 16 };
    return {
      base,
      end,
      elbow,
      path: `M${base.x},${base.y} L${elbow.x},${elbow.y} L${end.x},${end.y}`,
    };
  });
  /** Shown from just before ψ appears at x = 1. */
  const lensOpacity = $derived(Math.max(0, Math.min(1, (exhibit.x - 0.85) / 0.15)));
  // Outer common tangents from the sampled patch to the magnified view.
  const tangents = $derived.by(() => {
    const a = {
        x: focus.x,
        y: focus.y,
        r: lens.r / glass.scale,
      },
      b = lens;
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    if (d <= Math.abs(b.r - a.r) + 1e-6) return '';
    const base = Math.atan2(b.y - a.y, b.x - a.x),
      spread = Math.acos((a.r - b.r) / d);
    return [1, -1]
      .map((side) => {
        const angle = base + side * spread,
          c = Math.cos(angle),
          n = Math.sin(angle);
        return `M${a.x + a.r * c},${a.y + a.r * n}L${b.x + b.r * c},${b.y + b.r * n}`;
      })
      .join('');
  });
  let toolbarWidth = $state(110);
  const compactLensTools = $derived(width <= 600 && height > 500);
  const glass = $derived(lensParallax(optics, lens, lensHome, lensScale, exhibit.lensAngle));
  const focus = $derived(glass.focus);
  function moveLens(x: number, y: number) {
    onchange({
      lensX: clamp((x - view.x) / view.w, 0, 1),
      lensY: clamp((y - view.y) / view.h, 0, 1),
    });
  }
  function pointer(e: PointerEvent) {
    return new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM()!.inverse());
  }
  function dragStart(e: PointerEvent) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const p = pointer(e);
    drag = { id: e.pointerId, x: p.x - lens.x, y: p.y - lens.y };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }
  function dragMove(e: PointerEvent) {
    if (!drag || drag.id !== e.pointerId) return;
    const p = pointer(e);
    moveLens(p.x - drag.x, p.y - drag.y);
  }
  function resizeLens(e: PointerEvent) {
    if (!(e.currentTarget as Element).hasPointerCapture(e.pointerId)) return;
    const p = pointer(e);
    onchange({ lensRadius: clamp(Math.hypot(p.x - lens.x, p.y - lens.y), 70, 160) });
  }
  function resizeKey(e: KeyboardEvent) {
    if (['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      const value =
        e.key === 'Home'
          ? 70
          : e.key === 'End'
            ? 160
            : exhibit.lensRadius + (['ArrowRight', 'ArrowUp'].includes(e.key) ? 5 : -5);
      onchange({ lensRadius: clamp(value, 70, 160) });
    }
  }
  function lensKey(e: KeyboardEvent) {
    const delta: Record<string, number[]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    if (delta[e.key]) {
      e.preventDefault();
      e.stopPropagation();
      const [dx, dy] = delta[e.key],
        step = (e.shiftKey ? 30 : 10) / unit;
      moveLens(lens.x + dx * step, lens.y + dy * step);
    }
  }
  const budget = $derived(exhibit.zeros);

  // Independent workers: a dense record never blocks the current ζ locus or input.
  $effect(() => {
    const count = budget,
      worker = new GeometryWorker();
    computing = true;
    record = new Float64Array();
    worker.onmessage = ({ data }) => {
      record = data.rows;
      recordCount = count;
      computing = false;
    };
    worker.postMessage({ kind: 'record', count });
    return () => worker.terminate();
  });
  const sigma = $derived(exhibit.sigma),
    locusCentre = $derived(Math.round(exhibit.tau / 4) * 4);
  // The sampled curve is an optional guide: only sample it while it is shown.
  const showLocus = $derived(exhibit.referenceCurve);
  $effect(() => {
    if (!showLocus) return;
    const input = { sigma, centre: locusCentre },
      worker = new GeometryWorker();
    worker.onmessage = ({ data }) => {
      locus = data.rows;
    };
    worker.postMessage({ kind: 'locus', ...input });
    return () => worker.terminate();
  });
  function pick(value: Pick) {
    pinned = samePick(pinned, value) ? null : value;
  }
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === 'Escape') {
      pinned = null;
      hover = null;
    }
  }}
/>
<div class="exhibit shared-exhibit" bind:clientWidth={width} bind:clientHeight={height}>
  <svg
    bind:this={svg}
    style={exhibit.hue === 0 && exhibit.saturation === 1 && exhibit.brightness === 1
      ? undefined
      : `filter:hue-rotate(${exhibit.hue}deg) saturate(${exhibit.saturation}) brightness(${exhibit.brightness})`}
    viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
    role="img"
    aria-label="A shared complex plane: counterclockwise prime arcs, the zeta curve and sum, and psi inscribing the same dial. Hover or click individual parts."
  >
    <defs>
      {#each [12, 24, 48] as teeth}
        <path id={`cog-${teeth}`} d={cogPath(1, teeth)} />
      {/each}
      <filter
        id="contact-shadow"
        x="-30%"
        y="-60%"
        width="170%"
        height="240%"
        color-interpolation-filters="sRGB"
      >
        <feDropShadow dx=".8" dy="1.5" stdDeviation="1" flood-color="#000" flood-opacity=".6" />
      </filter>
      <radialGradient id="dial-depth">
        <stop offset=".65" stop-color="#000" stop-opacity="0" />
        <stop offset=".96" stop-color="#000" stop-opacity=".15" />
        <stop offset="1" stop-color="#000" stop-opacity=".6" />
      </radialGradient>
      <linearGradient id="hand-metal" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="#758385" /><stop offset=".48" stop-color="#3d535e" />
        <stop offset=".55" stop-color="#1f303c" /><stop offset="1" stop-color="#4b6069" />
      </linearGradient>
      {#each ['brass', 'steel'] as material}
        <linearGradient id={material} x1="0" y1="0" x2="1" y2="1">
          {#each metals[material as keyof typeof metals] as [offset, color]}
            <stop {offset} stop-color={color} />
          {/each}
        </linearGradient>
      {/each}
      <linearGradient id="glass" x1="0" y1="0" x2=".7" y2="1"
        ><stop stop-color="#eafaff" stop-opacity=".12" /><stop
          offset=".35"
          stop-color="#c8e4ea"
          stop-opacity=".015"
        /><stop offset=".7" stop-color="#e4fbff" stop-opacity=".065" /><stop
          offset="1"
          stop-color="#b9d9df"
          stop-opacity=".01"
        /></linearGradient
      >

      {#if displacementMap && exhibit.theme !== 'analytic'}
        <filter
          id="lens-distortion"
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
          x={lens.x - lens.r}
          y={lens.y - lens.r}
          width={lens.r * 2}
          height={lens.r * 2}
          color-interpolation-filters="sRGB"
        >
          <feImage
            href={displacementMap}
            x={lens.x - lens.r}
            y={lens.y - lens.r}
            width={lens.r * 2}
            height={lens.r * 2}
            result="refraction"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="refraction"
            scale={lens.r * 0.16}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      {/if}
      <clipPath id="dial-window"><circle r={R + 7} /></clipPath>
      <clipPath id="lens-window"><circle cx={lens.x} cy={lens.y} r={lens.r} /></clipPath>
    </defs>
    <g data-testid="camera">
      <g
        id="clock-scene"
        data-theme={exhibit.theme}
        class:no-panes={!(exhibit.layers & 1)}
        class:no-labels={!(exhibit.layers & 2)}
        class:no-sum={!(exhibit.layers & 4)}
        class:no-zeta={!(exhibit.layers & 8)}
        class:no-psi-arms={!(exhibit.layers & 16)}
        class:no-reference={!(exhibit.layers & 32)}
        class:no-powers={!(exhibit.layers & 64)}
        transform={`translate(${WORLD.centre.join(',')})`}
        data-testid="shared-scene"
      >
        {#if exhibit.theme === 'expanse'}
          <g transform={`translate(${-WORLD.centre[0]},${-WORLD.centre[1]})`}
            ><Starfield {view} /></g
          >
        {/if}
        <g class="rear-plane">
          <ClockHousing theme={exhibit.theme} />
          {#if exhibit.theme === 'clockwork'}
            <Zeta
              {reference}
              {exhibit}
              {locus}
              {selection}
              onhover={(p) => (hover = p)}
              onpick={pick}
            />
          {/if}
        </g>
        <g class="dial-plane">
          <Sieve
            x={exhibit.x}
            theme={exhibit.theme}
            {selection}
            onhover={(p) => (hover = p)}
            onpick={pick}
          />
          <g clip-path="url(#dial-window)" class="inscription" data-testid="psi-record">
            {#if exhibit.theme === 'clockwork'}
              <path d={paths.reference} class="record-reference record-shadow" />
            {/if}
            <path
              d={paths.reference}
              class="record-reference hairline"
              data-testid="reference-record"
            />
          </g>
          {#if exhibit.theme !== 'clockwork'}
            <Zeta
              {reference}
              {exhibit}
              {locus}
              {selection}
              onhover={(p) => (hover = p)}
              onpick={pick}
            />
          {/if}
        </g>
        <Psi
          full={psi}
          {exhibit}
          detailScale={Math.max(1, exhibit.psiLens ? glass.scale : 1) * unit}
          {selection}
          onhover={(p) => (hover = p)}
          onpick={pick}
        />
        <Experience {reference} {exhibit} {experience} {reduced} />
        <g class="fixed-axle" pointer-events="none"
          ><circle r="7" class="axle" /><circle r="2.5" class="axle-core" /></g
        >
      </g>
    </g>
    {#if exhibit.psiLens && lensOpacity > 0}
      <g class="psi-lens" data-testid="psi-lens" pointer-events="none" opacity={lensOpacity}>
        {#if exhibit.theme === 'clockwork'}
          <g class="lens-suspension" aria-hidden="true">
            <path
              d={suspension.path}
              fill="none"
              stroke="#171c1b"
              stroke-width="5"
              stroke-linejoin="round"
            />
            <path
              d={suspension.path}
              fill="none"
              stroke="url(#steel)"
              stroke-width="2.6"
              stroke-linejoin="round"
            />
            {#each [suspension.base, suspension.elbow, suspension.end] as joint}
              <circle
                cx={joint.x}
                cy={joint.y}
                r="2.6"
                fill="url(#brass)"
                stroke="#252b29"
                stroke-width=".6"
              />
              <circle cx={joint.x} cy={joint.y} r=".65" fill="#252b29" />
            {/each}
          </g>
        {/if}
        <circle cx={focus.x} cy={focus.y} r={lens.r / glass.scale} class="lens-source" />
        <path d={tangents} class="lens-tangent" data-testid="lens-tangents" />
        <circle cx={lens.x} cy={lens.y} r={lens.r + 5} class="lens-housing" />
        <g clip-path="url(#lens-window)">
          <g
            filter={displacementMap && exhibit.theme !== 'analytic'
              ? 'url(#lens-distortion)'
              : undefined}
          >
            <use
              href="#clock-scene"
              style={`--lens-back-x:${glass.depth.x}px;--lens-back-y:${glass.depth.y}px;--lens-face-x:${glass.depth.x * 0.35}px;--lens-face-y:${glass.depth.y * 0.35}px`}
              transform={`translate(${lens.x},${lens.y}) rotate(${exhibit.lensAngle}) scale(${glass.scale}) translate(${-focus.x},${-focus.y})`}
            /></g
          >
          {#if exhibit.theme !== 'analytic'}<circle
              cx={lens.x}
              cy={lens.y}
              r={lens.r}
              fill="url(#glass)"
              opacity=".5"
            />{/if}
        </g>
        <circle cx={lens.x} cy={lens.y} r={lens.r} class="lens-rim" />
        <circle
          cx={lens.x}
          cy={lens.y}
          r={lens.r + 5}
          class="lens-grip"
          role="button"
          tabindex="0"
          aria-label="Move magnifier"
          pointer-events="stroke"
          onpointerdown={dragStart}
          onpointermove={dragMove}
          onpointerup={() => (drag = null)}
          onpointercancel={() => (drag = null)}
          onlostpointercapture={() => (drag = null)}
          onkeydown={lensKey}
        >
          <title>Drag the rim or use arrow keys to move the lens. Shift moves faster.</title>
        </circle>
        <circle
          class="lens-resize"
          cx={lens.x + lens.r * 0.707}
          cy={lens.y + lens.r * 0.707}
          r={7 / unit}
          role="slider"
          tabindex="0"
          aria-label="Lens size"
          aria-valuemin="70"
          aria-valuemax="160"
          aria-valuenow={exhibit.lensRadius}
          pointer-events="all"
          onkeydown={resizeKey}
          onpointerdown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            (e.currentTarget as Element).setPointerCapture(e.pointerId);
          }}
          onpointermove={resizeLens}
          onpointerup={(e) => (e.currentTarget as Element).releasePointerCapture(e.pointerId)}
          ><title>Drag to resize the lens; arrow keys also resize.</title></circle
        >
      </g>
    {/if}
  </svg>
  {#if exhibit.psiLens && lensOpacity > 0}
    <div
      class="lens-toolbar"
      style:opacity={lensOpacity}
      role="group"
      aria-label="Lens controls"
      bind:offsetWidth={toolbarWidth}
      style:left={`${clamp((lens.x - view.x) * unit - toolbarWidth / 2, 8, width - toolbarWidth - 8)}px`}
      style:top={`${clamp((lens.y - view.y + lens.r) * unit + 10, 8, height - (compactLensTools ? 72 : 32))}px`}
    >
      <button
        class="quiet-icon"
        aria-label="Lens zoom out"
        title="Lens zoom out"
        onclick={() => onchange({ psiScale: clamp(lensScale / 1.2, 2, 30), stabilize: false })}
        ><UiIcon name="collapse" size={12} /></button
      >
      <button
        aria-label="Auto-fit lens"
        title="Continuously fit both psi tips"
        aria-pressed={exhibit.stabilize}
        onclick={() => onchange({ stabilize: !exhibit.stabilize })}>Auto</button
      >
      <button
        class="quiet-icon"
        aria-label="Lens zoom in"
        title="Lens zoom in"
        onclick={() => onchange({ psiScale: clamp(lensScale * 1.2, 2, 30), stabilize: false })}
        ><UiIcon name="expand" size={12} /></button
      >
      <button
        class="quiet-icon"
        aria-label="Hide magnifier"
        title="Hide magnifier"
        onclick={() => onchange({ psiLens: false })}><UiIcon name="close" size={12} /></button
      >
    </div>
  {/if}
  <div
    class="object-readout"
    class:has-selection={!!selection}
    aria-live="polite"
    data-testid="object-readout"
  >
    {#if selection}<strong>{selection.label}</strong><span>{selection.detail}</span><button
        onclick={() => {
          pinned = null;
          hover = null;
        }}>Clear selection</button
      >
    {:else if computing}<span>Preparing the record…</span>{/if}
  </div>
</div>
