<script lang="ts">
  import { layers, systems, groupMask } from './core/layers';
  import { psiOptics, containedLensScale, followLens } from './core/optics';
  import ControlPanel from './components/ControlPanel.svelte';
  import UiIcon from './components/UiIcon.svelte';
  import { freshExperience, tickExperience, TRAIL_SECONDS } from './core/experience';
  import { ExhibitSound } from './core/sound';
  import { onMount } from 'svelte';
  import Exhibit from './components/Exhibit.svelte';
  import {
    advance,
    criticalState,
    canAdvance,
    wind,
    clamp,
    decodePosition,
    encodePosition,
    initialState,
    MAX_TAU,
  } from './core/state';
  import type { ExhibitState, Focus } from './core/state';
  import { fitScale, psiMechanism, sumMechanism, xiMechanism } from './core/mechanism';
  import { CLOCK_RADIUS as R, countScale } from './core/layout';
  import { births, countedPsi, factorsOf, MAX_X } from './math/primes';
  import { zeta } from './math/zeta';
  import { zeroHeights } from './math/zeros';
  import { passedZeros } from './math/psi';
  let exhibit = $state<ExhibitState>({ ...initialState });
  let experience = $state(freshExperience());
  let systemReduced = $state(false);
  let soundEnabled = $state(false),
    soundMessage = $state('');
  const sound = new ExhibitSound();
  let soundRequest = 0;
  const reduced = $derived(systemReduced || exhibit.effects !== 'full');
  function clearExperience() {
    experience = freshExperience();
    sound.silence();
  }
  async function toggleSound(enabled: boolean) {
    const request = ++soundRequest;
    if (!enabled) {
      soundEnabled = false;
      sound.silence();
      return;
    }
    try {
      const enabled = await sound.enable(exhibit.volume);
      if (request !== soundRequest) return;
      soundEnabled = enabled;
      soundMessage = soundEnabled ? '' : 'Sound is unavailable in this browser.';
    } catch {
      if (request !== soundRequest) return;
      soundEnabled = false;
      soundMessage = 'Sound is unavailable in this browser.';
    }
  }
  let lensScale = $state(initialState.psiScale);
  let destination = $state<number | null>(null);
  let windingTarget = $state(30);
  let playing = $state(false),
    shareMessage = $state('');
  let utility = $state<'audio' | 'visual' | 'clock' | null>(null);
  let about = $state<Focus | null>(null);
  let railHeight = $state(0);
  let mechanismOpen = $state({ sieve: false, zeta: false, psi: false });
  const mechanismTitles = { sieve: 'Primes', zeta: 'Zeta', psi: 'Psi' };
  const symbols = { sieve: 'π', zeta: 'ζ', psi: 'ψ' };
  function toggleUtility(next: 'audio' | 'visual' | 'clock') {
    if (utility === next) closeUtility();
    else utility = next;
  }
  function closeUtility() {
    if (utility)
      document.querySelector<HTMLButtonElement>(`[aria-controls="${utility}-controls"]`)?.focus();
    utility = null;
  }
  function closeAbout() {
    if (about)
      document.querySelector<HTMLButtonElement>(`[aria-controls="about-${about}"]`)?.focus();
    about = null;
  }
  const reference = $derived(zeta(exhibit.sigma, exhibit.tau));
  const psi = $derived(psiMechanism(exhibit.x, exhibit.zeros));
  const reached = $derived(passedZeros(exhibit.tau, exhibit.zeros));
  const lensTarget = $derived(psiOptics(exhibit, psi));
  const displayedLensScale = $derived(
    containedLensScale(exhibit.stabilize ? lensScale : exhibit.psiScale, lensTarget),
  );
  const tauLow = $derived(
    exhibit.linked
      ? Math.max(
          -MAX_TAU,
          exhibit.tau + Math.min(-exhibit.x * exhibit.ratio, (MAX_X - exhibit.x) * exhibit.ratio),
        )
      : -MAX_TAU,
  );
  const tauHigh = $derived(
    exhibit.linked
      ? Math.min(
          MAX_TAU,
          exhibit.tau + Math.max(-exhibit.x * exhibit.ratio, (MAX_X - exhibit.x) * exhibit.ratio),
        )
      : MAX_TAU,
  );
  const stories = {
    sieve: {
      equation: 'q = pᵏ · radius q/x · period q',
      body: 'Prime-power arcs turn counterclockwise. Each new pane meets the rim; older annuli contract. Hover or focus a part to inspect its prime family.',
    },
    zeta: {
      equation: 'n⁻ˢ = n⁻σ exp(−iτ log n)',
      body: 'The reference curve plots ζ(½ + iτ). Colored arms form a finite Dirichlet sum, which is not a convergent evaluation on the critical line. This exhibit illustrates RH; it does not prove it.',
    },
    psi: {
      equation: 'ψ(x) = Σₚᵏ≤ₓ log p',
      body: 'The count is 0 before 2 and jumps by log p at each prime power. One dial radius represents x count units, so the axle stands on the rim at x, level with the newest prime pane. Before x = 1, one dot runs the radius while another runs the rim, 2π times as fast; they meet where ψ appears. At x = 1 every zero vector −1/ρ points straight up, so the chain arrives fully extended and curls from its finest terms. From the axle, the zero-pair vectors form a chain above the axis and its conjugate reflection below. A pair sums to twice its real part: the dashed parallelogram closes at the tip, and its other diagonal crosses the axis halfway there. The short still link on the axis is the constant part of the formula, −log 2π − ½ log(1 − x⁻²); the second term is the sum over the trivial zeros, truncated like the nontrivial ones so it stays finite at x = 1. The tip draws the record, which begins at the origin when ψ appears at x = 1.',
    },
  };
  const complexText = (z: number[]) =>
    z.every(Number.isFinite)
      ? `${z[0].toPrecision(5)} ${z[1] < 0 ? '−' : '+'} ${Math.abs(z[1]).toPrecision(4)}i`
      : 'pole at s = 1';
  function change(patch: Partial<ExhibitState>) {
    if (
      patch.mode !== undefined ||
      patch.direction !== undefined ||
      patch.linked !== undefined ||
      patch.ratio !== undefined
    )
      clearExperience();
    if (patch.trail === false || patch.effects !== undefined) experience = freshExperience();
    if (patch.volume !== undefined) sound.volume(patch.volume);
    exhibit = criticalState({ ...exhibit, ...patch });
  }
  function seek(patch: Partial<ExhibitState>) {
    playing = false;
    clearExperience();
    destination = null;
    const { x, tau, ...other } = patch;
    if (x !== undefined && tau !== undefined)
      change({ ...patch, x: clamp(x, 0, MAX_X), tau: clamp(tau, -MAX_TAU, MAX_TAU) });
    else if (x !== undefined) exhibit = criticalState({ ...wind(exhibit, 'x', x), ...other });
    else if (tau !== undefined) exhibit = criticalState({ ...wind(exhibit, 'tau', tau), ...other });
    else change(other);
  }
  function windTo(target: number) {
    const reachable = wind(exhibit, 'x', target).x;
    if (!Number.isFinite(target) || Math.abs(reachable - exhibit.x) < 1e-10) return;
    change({ drive: 'x', direction: reachable > exhibit.x ? 1 : -1 });
    destination = reachable;
    playing = true;
  }
  function primeDestination(direction: number) {
    const primes = births.filter((b) => b.k === 1).map((b) => b.q);
    windTo(
      direction > 0
        ? (primes.find((p) => p > exhibit.x + 1e-9) ?? MAX_X)
        : (primes.reverse().find((p) => p < exhibit.x - 1e-9) ?? 0),
    );
  }
  function step(direction: number) {
    const coordinate = exhibit.linked ? 'x' : exhibit.drive;
    seek({ [coordinate]: exhibit[coordinate] + direction });
  }
  function load(position: ExhibitState) {
    playing = false;
    clearExperience();
    destination = null;
    exhibit = criticalState(position);
    shareMessage = '';
    history.replaceState(null, '', encodePosition(exhibit));
  }
  function home() {
    change({ zoom: 1 });
  }
  function zoom(by: number) {
    change({ zoom: clamp(exhibit.zoom * by, 0.65, 2.5) });
  }
  function fit(focus: Focus) {
    if (focus === 'zeta') {
      if (exhibit.mode === 'xi' && Math.abs(exhibit.tau) <= 15)
        change({
          xiScale: clamp(
            fitScale(xiMechanism(exhibit.sigma, exhibit.tau).arms, 500, R * 0.9),
            0.3,
            4,
          ),
        });
      else
        change({
          zetaScale: clamp(
            fitScale(sumMechanism(exhibit.sigma, exhibit.tau).arms, R, R * 0.9),
            0.15,
            2,
          ),
        });
    } else if (focus === 'psi') {
      const full = psiMechanism(exhibit.x, exhibit.zeros),
        unit = countScale(exhibit.x);
      const scale = Math.min(
        fitScale(full.arms, unit, 95),
        95 / (unit * Math.max(0.1, Math.abs(full.tip[0]))),
      );
      change({ psiScale: clamp(scale, 2, 30), psiLens: true });
    } else home();
  }
  async function share() {
    history.replaceState(null, '', encodePosition(exhibit));
    try {
      await navigator.clipboard.writeText(location.href);
      shareMessage = 'Position link copied';
    } catch {
      shareMessage = 'Position saved in the address bar';
    }
  }
  function togglePlayback() {
    if (playing) {
      destination = null;
      sound.silence();
    }
    if (playing || canAdvance(exhibit)) playing = !playing;
  }
  function keydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      closeUtility();
      closeAbout();
    }
    if ((e.target as HTMLElement).closest('input,select,button,a,textarea,[role="button"]')) return;
    if (['PageDown', 'PageUp', 'Home', 'End', 'ArrowUp', 'ArrowDown'].includes(e.key))
      e.preventDefault();
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlayback();
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      step(e.key === 'ArrowRight' ? 1 : -1);
    }
  }
  onMount(() => {
    exhibit = decodePosition(location.hash);
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => {
      systemReduced = media.matches;
      if (media.matches) experience = freshExperience();
    };
    motion();
    media.addEventListener('change', motion);
    const restore = () => {
      playing = false;
      clearExperience();
      destination = null;
      exhibit = decodePosition(location.hash);
    };
    const hide = () => {
      if (document.hidden) {
        playing = false;
        sound.silence();
      }
    };
    addEventListener('hashchange', restore);
    document.addEventListener('visibilitychange', hide);
    let id = 0,
      previous = performance.now();
    const frame = (now: number) => {
      const before = exhibit,
        wasPlaying = playing;
      if (playing) {
        const next = advance(exhibit, (now - previous) / 1000);
        if (destination !== null && (next.x - destination) * exhibit.direction >= -1e-10) {
          exhibit = wind(exhibit, 'x', destination);
          destination = null;
          playing = false;
        } else exhibit = next;
        if (!canAdvance(exhibit)) {
          playing = false;
          destination = null;
        }
      }
      experience = tickExperience(
        experience,
        before,
        exhibit,
        (now - previous) / 1000,
        TRAIL_SECONDS,
        exhibit.trail && !reduced && exhibit.mode === 'zeta',
      );
      if (soundEnabled && wasPlaying) sound.play(experience.moments.filter((m) => m.age === 0));
      lensScale = exhibit.stabilize
        ? containedLensScale(
            followLens(lensScale, lensTarget.scale, (now - previous) / 1000),
            lensTarget,
          )
        : exhibit.psiScale;
      previous = now;
      id = requestAnimationFrame(frame);
    };
    id = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(id);
      sound.close();
      media.removeEventListener('change', motion);
      removeEventListener('hashchange', restore);
      document.removeEventListener('visibilitychange', hide);
    };
  });
</script>

<svelte:window onkeydown={keydown} />

{#snippet layerToggle(bit: number, label: string, name: string)}
  <label class="layer-toggle"
    ><input
      type="checkbox"
      aria-label={name}
      checked={!!(exhibit.layers & bit)}
      onchange={(e) =>
        change({ layers: e.currentTarget.checked ? exhibit.layers | bit : exhibit.layers & ~bit })}
    /><span>{label}</span></label
  >
{/snippet}
{#snippet utilityHeading(title: string)}
  <div class="utility-heading">
    <h2>{title}</h2>
    <button
      class="quiet-icon"
      aria-label={`Close ${title} controls`}
      title="Close"
      onclick={closeUtility}><UiIcon name="close" size={16} /></button
    >
  </div>
{/snippet}
{#snippet appearance()}
  <div class="segments" role="group" aria-label="Appearance">
    {#each ['analytic', 'clockwork', 'expanse'] as theme}<button
        aria-pressed={exhibit.theme === theme}
        onclick={() => change({ theme: theme as ExhibitState['theme'] })}
        >{theme === 'analytic'
          ? 'Analytic'
          : theme === 'clockwork'
            ? 'Clockwork'
            : 'Expanse'}</button
      >{/each}
  </div>
  {#each [{ key: 'hue', label: 'Hue', min: -180, max: 180, step: 1 }, { key: 'saturation', label: 'Saturation', min: 0, max: 2, step: 0.05 }, { key: 'brightness', label: 'Brightness', min: 0.5, max: 1.5, step: 0.05 }] as setting}
    <label class="inline-range"
      ><span>{setting.label}</span><input
        aria-label={setting.label}
        type="range"
        min={setting.min}
        max={setting.max}
        step={setting.step}
        value={exhibit[setting.key as 'hue' | 'saturation' | 'brightness']}
        oninput={(e) => change({ [setting.key]: +e.currentTarget.value })}
      /></label
    >{/each}
  <div class="setting-row">
    <span>Motion</span>
    <div class="segments" role="group" aria-label="Visual effects">
      {#each ['full', 'reduced', 'off'] as effects}<button
          aria-pressed={exhibit.effects === effects}
          onclick={() => change({ effects: effects as ExhibitState['effects'] })}
          >{effects === 'full' ? 'Full' : effects === 'reduced' ? 'Less' : 'Off'}</button
        >{/each}
    </div>
  </div>
  <div class="setting-row">
    <span>Zoom</span>
    <div class="segments">
      <button
        class="quiet-icon"
        aria-label="Zoom out"
        title="Zoom out"
        onclick={() => zoom(1 / 1.2)}><UiIcon name="collapse" size={16} /></button
      ><button aria-label="Home view" title="Reset magnification" onclick={home}
        ><output aria-label="Exhibit magnification">{Math.round(exhibit.zoom * 100)}%</output
        ></button
      ><button class="quiet-icon" aria-label="Zoom in" title="Zoom in" onclick={() => zoom(1.2)}
        ><UiIcon name="expand" size={16} /></button
      >
    </div>
  </div>
{/snippet}
{#snippet clockSettings()}
  <div class="exact-position">
    {#each ['x', 'tau'] as key}<label
        >{key === 'x' ? 'x' : 'τ'}<input
          aria-label={key === 'x' ? 'Exact x' : 'Exact tau'}
          type="number"
          min={key === 'x' ? 0 : -MAX_TAU}
          max={key === 'x' ? MAX_X : MAX_TAU}
          step="any"
          value={exhibit[key as 'x' | 'tau']}
          onchange={(e) => {
            if (Number.isFinite(e.currentTarget.valueAsNumber))
              seek({ [key]: e.currentTarget.valueAsNumber });
          }}
        /></label
      >{/each}
  </div>
  <label class="inline-range"
    ><span>Speed</span><input
      aria-label="Winding speed"
      type="range"
      min=".1"
      max="4"
      step=".1"
      value={exhibit.speed}
      oninput={(e) => change({ speed: +e.currentTarget.value })}
    /><output>{exhibit.speed.toFixed(1)}/s</output></label
  >
  <div class="setting-row">
    <span>Direction</span>
    <div class="segments" role="group" aria-label="Playback direction">
      <button
        aria-label="Reverse playback"
        aria-pressed={exhibit.direction === -1}
        onclick={() => seek({ direction: -1 })}><UiIcon name="previous" size={16} />Reverse</button
      ><button
        aria-label="Forward playback"
        aria-pressed={exhibit.direction === 1}
        onclick={() => seek({ direction: 1 })}>Forward<UiIcon name="next" size={16} /></button
      >
    </div>
  </div>
  {#if !exhibit.linked}<div class="setting-row">
      <span>Drive</span>
      <div class="segments" role="group" aria-label="Animation drive">
        <button aria-pressed={exhibit.drive === 'x'} onclick={() => seek({ drive: 'x' })}>x</button
        ><button aria-pressed={exhibit.drive === 'tau'} onclick={() => seek({ drive: 'tau' })}
          >τ</button
        >
      </div>
    </div>{/if}
  <div class="setting-row">
    <label class="ratio-label"
      >τ / x<input
        aria-label="Link ratio"
        title="τ per unit x"
        type="number"
        min="-10"
        max="10"
        step="any"
        value={exhibit.ratio}
        onchange={(e) => {
          const n = e.currentTarget.valueAsNumber;
          if (Number.isFinite(n) && Math.abs(n) >= 0.1) seek({ ratio: clamp(n, -10, 10) });
        }}
      /></label
    >
    <div class="segments" role="group" aria-label="Winding ratio presets">
      <button aria-pressed={exhibit.ratio === -1} onclick={() => seek({ ratio: -1 })}>−1</button
      ><button
        aria-pressed={exhibit.ratio === -2 * Math.PI}
        onclick={() => seek({ ratio: -2 * Math.PI })}>−2π</button
      >
    </div>
  </div>
  <div class="journey-controls">
    <label
      >Wind to x<input
        aria-label="Winding destination"
        type="number"
        min="0"
        max={MAX_X}
        step="any"
        bind:value={windingTarget}
      /></label
    ><button
      aria-label="Wind to x"
      title="Wind to destination"
      class="quiet-icon"
      onclick={() => windTo(windingTarget)}><UiIcon name="play" size={16} /></button
    ><button
      aria-label="Previous prime"
      title="Wind to previous prime"
      class="quiet-icon"
      onclick={() => primeDestination(-1)}><UiIcon name="previousPrime" size={16} /></button
    ><button
      aria-label="Next prime"
      title="Wind to next prime"
      class="quiet-icon"
      onclick={() => primeDestination(1)}><UiIcon name="nextPrime" size={16} /></button
    >
  </div>
  <div class="utility-footer">
    <button onclick={share}><UiIcon name="share" size={15} />Share position</button><button
      aria-label="Reset exhibit"
      title="Reset exhibit"
      class="quiet-icon"
      onclick={() => load(initialState)}><UiIcon name="reset" size={16} /></button
    >
  </div>
  {#if shareMessage}<span class="control-note" role="status">{shareMessage}</span>{/if}
{/snippet}

<main class="app" data-theme={exhibit.theme} aria-label="Mechanical exhibit">
  <Exhibit
    {reference}
    {railHeight}
    {psi}
    {exhibit}
    lensScale={displayedLensScale}
    optics={lensTarget}
    {experience}
    {reduced}
    onchange={change}
  />
  <div class="utility-tools" aria-label="Audio and visual controls">
    <button
      class="icon-button bell-button"
      aria-label="Audio controls"
      title="Sound"
      aria-expanded={utility === 'audio'}
      aria-controls="audio-controls"
      onclick={() => toggleUtility('audio')}
    >
      <UiIcon name="sound" size={24} />
      <i class:enabled={soundEnabled} aria-hidden="true"></i>
    </button>
    <button
      class="icon-button prism-button"
      aria-label="Visual controls"
      title="Appearance"
      aria-expanded={utility === 'visual'}
      aria-controls="visual-controls"
      onclick={() => toggleUtility('visual')}
    >
      <UiIcon name="visual" size={24} />
    </button>
  </div>
  <button
    class="lens-recall quiet-icon"
    aria-label="Show magnifier"
    title="Show magnifier"
    hidden={exhibit.psiLens || exhibit.x < 0.85}
    onclick={() => change({ psiLens: true })}><UiIcon name="lens" size={22} /></button
  >
  {#if utility === 'audio' || utility === 'visual'}
    <section
      class="utility-popover compact-surface"
      id={`${utility}-controls`}
      aria-label={utility === 'audio' ? 'Sound controls' : 'Visual controls'}
    >
      {@render utilityHeading(utility === 'audio' ? 'Sound' : 'Visual')}
      <div class="utility-body">
        {#if utility === 'audio'}<label class="layer-toggle"
            ><input
              aria-label="Enable sound"
              type="checkbox"
              checked={soundEnabled}
              onchange={(e) => void toggleSound(e.currentTarget.checked)}
            /><span>Sound</span></label
          ><label class="inline-range"
            ><span>Volume</span><input
              aria-label="Sound volume"
              type="range"
              min="0"
              max="1"
              step=".05"
              value={exhibit.volume}
              oninput={(e) => change({ volume: +e.currentTarget.value })}
            /></label
          >{#if soundMessage}<span class="control-note" role="status">{soundMessage}</span>{/if}
        {:else}{@render appearance()}{/if}
      </div>
    </section>{/if}
  <aside bind:clientHeight={railHeight} class="mechanism-controls" aria-label="Mechanism controls">
    {#each systems as system}{@const mask = groupMask(system.id)}
      <ControlPanel
        id={system.id}
        title={mechanismTitles[system.id]}
        symbol={symbols[system.id]}
        bind:open={mechanismOpen[system.id]}
      >
        {#snippet heading()}<button
            class="quiet-icon about-button"
            aria-label={`About ${mechanismTitles[system.id]}`}
            title={`About ${mechanismTitles[system.id]}`}
            aria-expanded={about === system.id}
            aria-controls={`about-${system.id}`}
            onclick={() => {
              if (about === system.id) closeAbout();
              else about = system.id;
            }}><UiIcon name="help" size={16} /></button
          ><label class="system-visibility" title={`Show ${mechanismTitles[system.id]}`}
            ><input
              type="checkbox"
              aria-label={`Show ${mechanismTitles[system.id]}`}
              checked={(exhibit.layers & mask) === mask}
              indeterminate={!!(exhibit.layers & mask) && (exhibit.layers & mask) !== mask}
              onchange={(e) =>
                change({
                  layers: e.currentTarget.checked ? exhibit.layers | mask : exhibit.layers & ~mask,
                })}
            /></label
          >{/snippet}
        <div class="layer-grid">
          {#each layers.filter((l) => l.group === system.id && 'short' in l) as layer}{@render layerToggle(
              layer.bit,
              'short' in layer ? layer.short : layer.label,
              layer.label,
            )}{/each}
          {#if system.id === 'zeta'}<label class="layer-toggle"
              ><input
                type="checkbox"
                aria-label="Zeta playback trail"
                checked={exhibit.trail}
                onchange={(e) => change({ trail: e.currentTarget.checked })}
              /><span>Trail</span></label
            >{/if}
        </div>
        {#if system.id === 'zeta'}<div class="inline-range">
            <label for="zeta-scale">Scale</label><input
              id="zeta-scale"
              aria-label="Zeta scale"
              type="range"
              min=".15"
              max="2"
              step=".01"
              value={exhibit.zetaScale}
              oninput={(e) => change({ zetaScale: +e.currentTarget.value })}
            /><button
              class="quiet-icon"
              aria-label="Fit sum"
              title="Fit sum"
              onclick={() => fit('zeta')}><UiIcon name="fit" size={16} /></button
            >
          </div>
        {/if}
      </ControlPanel>{/each}
  </aside>
  {#if about}<section
      class="about-popover compact-surface"
      id={`about-${about}`}
      aria-label={`About ${mechanismTitles[about]}`}
    >
      <div class="utility-heading">
        <h2>{symbols[about]} · {mechanismTitles[about]}</h2>
        <button
          class="quiet-icon"
          aria-label="Close explanation"
          title="Close explanation"
          onclick={closeAbout}><UiIcon name="close" size={16} /></button
        >
      </div>
      <div class="about-body">
        <span class="control-note">{systems.find((s) => s.id === about)?.name}</span>
        <p>{stories[about].body}</p>
        <p class="equation">{stories[about].equation}</p>
        <p class="live-value">
          {#if about === 'sieve' && exhibit.x < 2}No prime powers yet.{:else if about === 'sieve'}{Math.floor(
              exhibit.x,
            )} = {factorsOf(Math.floor(exhibit.x)).join(' × ')}{:else if about === 'zeta'}ζ = {complexText(
              reference,
            )}{:else}Exact {countedPsi(exhibit.x).toFixed(3)}{#if psi.approximation !== null}
              · Reference {psi.approximation.toFixed(3)}{:else}
              · Zero-pair vectors only; the reconstruction begins above 1.{/if}<br />{reached} zero pairs
            reached{/if}
        </p>
      </div>
    </section>{/if}
  <section class="corner winding" class:unlinked={!exhibit.linked} aria-label="Winding controls">
    {#if utility === 'clock'}<section
        class="clock-popover compact-surface"
        id="clock-controls"
        aria-label="Clock controls"
      >
        {@render utilityHeading('Clock')}
        <div class="utility-body">{@render clockSettings()}</div>
      </section>{/if}
    <div id="winding">
      <div class="transport">
        <div class="playback">
          <button aria-label="Step backward" onclick={() => step(-1)}>−1</button>
          <button
            class="play"
            aria-label={playing ? 'Pause' : 'Play'}
            title={playing ? 'Pause' : 'Play'}
            disabled={!playing && !canAdvance(exhibit)}
            onclick={togglePlayback}><UiIcon name={playing ? 'pause' : 'play'} size={20} /></button
          >
          <button aria-label="Step forward" onclick={() => step(1)}>+1</button>
        </div>
        <button
          class="clock-settings"
          aria-label="Clock adjustments"
          title="Clock adjustments"
          aria-expanded={utility === 'clock'}
          aria-controls="clock-controls"
          onclick={() => toggleUtility('clock')}><UiIcon name="adjust" /></button
        >
        <label class="dial count-dial"
          ><span>x <output>{exhibit.x.toFixed(1)}</output></span><input
            aria-label="Count x"
            type="range"
            min="0"
            max={MAX_X}
            step="any"
            value={exhibit.x}
            oninput={(e) => seek({ x: +e.currentTarget.value })}
          /></label
        >
        <button
          class="clutch"
          class:engaged={exhibit.linked}
          aria-label="Link x and tau"
          aria-pressed={exhibit.linked}
          title={exhibit.linked ? 'Unlink x and τ' : 'Link x and τ'}
          onclick={() => change({ linked: !exhibit.linked })}
          ><UiIcon name={exhibit.linked ? 'link' : 'unlink'} size={20} /><span
            >{exhibit.linked
              ? `1:${exhibit.ratio === -2 * Math.PI ? '−2π' : exhibit.ratio}`
              : 'free'}</span
          ></button
        >
        <label class="dial tau-dial" hidden={exhibit.linked}
          ><span>τ <output>{exhibit.tau.toFixed(1)}</output></span><input
            aria-label="Height tau"
            aria-orientation="horizontal"
            type="range"
            min={tauLow}
            max={tauHigh}
            step="any"
            value={exhibit.tau}
            oninput={(e) => seek({ tau: +e.currentTarget.value })}
          /></label
        >
      </div>
    </div>
  </section>
</main>
