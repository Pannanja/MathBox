import { MAX_X } from '../math/primes';
import { zeroHeights } from '../math/zeros';
export type Theme = 'analytic' | 'clockwork' | 'expanse';
export type Focus = 'sieve' | 'zeta' | 'psi';
export const MAX_TAU = 1000;
export interface ExhibitState {
  hue: number;
  saturation: number;
  brightness: number;
  effects: 'full' | 'reduced' | 'off';
  trail: boolean;
  referenceCurve: boolean;
  volume: number;
  x: number;
  sigma: number;
  tau: number;
  zeros: number;
  theme: Theme;
  focus: Focus;
  mode: 'zeta' | 'xi';
  drive: 'x' | 'tau';
  linked: boolean;
  ratio: number;
  speed: number;
  direction: number;
  stepSize: number;
  layers: number;
  lensX: number;
  lensY: number;
  lensRadius: number;
  lensFocus: 'mechanism' | 'axle' | 'tip';
  lensDx: number;
  lensDy: number;
  lensAngle: number;
  stabilize: boolean;
  zoom: number;
  psiScale: number;
  xiScale: number;
  zetaScale: number;
  psiLens: boolean;
  psiMount: 'upper-left' | 'lower-left';
}
export const initialState: ExhibitState = {
  hue: 0,
  saturation: 1,
  brightness: 1,
  effects: 'full',
  trail: true,
  referenceCurve: false,
  volume: 0.25,
  x: 0,
  sigma: 0.5,
  tau: 0,
  zeros: zeroHeights.length,
  theme: 'analytic',
  focus: 'zeta',
  mode: 'zeta',
  drive: 'x',
  linked: true,
  ratio: -1,
  speed: 1,
  direction: 1,
  stepSize: 1,
  layers: 255,
  lensX: -1,
  lensY: -1,
  lensRadius: 112,
  lensFocus: 'mechanism',
  lensDx: 0,
  lensDy: 0,
  lensAngle: 0,
  stabilize: true,
  zoom: 1,
  psiScale: 7,
  xiScale: 2,
  zetaScale: 0.6,
  psiLens: true,
  psiMount: 'upper-left',
};
export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const numeric = {
  hue: [-180, 180],
  saturation: [0, 2],
  brightness: [0.5, 1.5],
  volume: [0, 1],
  x: [0, MAX_X],
  tau: [-MAX_TAU, MAX_TAU],
  zeros: [1, zeroHeights.length],
  zoom: [0.65, 2.5],
  psiScale: [2, 30],
  xiScale: [0.3, 4],
  zetaScale: [0.15, 2],
  ratio: [-10, 10],
  direction: [-1, 1],
  stepSize: [0.001, 10],
  layers: [0, 255],
  lensX: [-1, 1],
  lensY: [-1, 1],
  lensRadius: [70, 160],
  lensDx: [-500, 500],
  lensDy: [-500, 500],
  lensAngle: [-180, 180],
  speed: [0.1, 4],
} as const;
/** Restore winding and optics. Legacy camera offsets and off-line sigma are ignored.
 * Version 1 also migrates the old separate instrument mounts. */
export function decodePosition(hash: string): ExhibitState {
  const params = new URLSearchParams(hash.replace(/^#/, '')),
    result = { ...initialState };
  const version = params.get('v');
  if (version !== '1' && version !== '2') return result;
  for (const key of Object.keys(numeric) as (keyof typeof numeric)[]) {
    const raw = params.get(key);
    if (raw === null || raw.trim() === '') continue;
    if (version === '1' && key === 'psiScale') continue;
    const n = Number(raw);
    if (Number.isFinite(n)) result[key] = clamp(n, numeric[key][0], numeric[key][1]);
  }
  result.ratio = validRatio(result.ratio);
  result.direction = result.direction < 0 ? -1 : 1;
  result.layers = Math.round(result.layers);
  // The exact-count focus was retired with its marker; the tip is its nearest view.
  const focus = params.get('lensFocus') === 'count' ? 'tip' : params.get('lensFocus');
  if (focus === 'axle' || focus === 'tip') result.lensFocus = focus;
  result.stabilize = params.get('stabilize') !== 'false';
  result.zeros = Math.round(result.zeros);
  // Earlier versioned links without a theme opened in Clockwork.
  result.theme = params.get('theme') === 'analytic' ? 'analytic' : 'clockwork';
  if (['celestial', 'expanse'].includes(params.get('theme') ?? '')) result.theme = 'expanse';
  if (['reduced', 'off'].includes(params.get('effects') ?? ''))
    result.effects = params.get('effects') as ExhibitState['effects'];
  if (params.get('trail') === 'false') result.trail = false;
  result.referenceCurve = params.get('referenceCurve') === 'true';
  if (['sieve', 'psi'].includes(params.get('focus') ?? ''))
    result.focus = params.get('focus') as Focus;
  if (version === '2') {
    if (params.get('drive') === 'tau') result.drive = 'tau';
    if (params.get('mode') === 'xi') result.mode = 'xi';
    if (params.get('linked') === 'false') result.linked = false;
    if (params.get('psiLens') === 'false') result.psiLens = false;
    if (params.get('psiMount') === 'lower-left') result.psiMount = 'lower-left';
  }
  return result;
}
export function validRatio(value: number): number {
  return Number.isFinite(value) && Math.abs(value) >= 0.1 ? clamp(value, -10, 10) : -1;
}
export function criticalState(state: ExhibitState): ExhibitState {
  return { ...state, sigma: 0.5, ratio: validRatio(state.ratio) };
}
export function encodePosition(state: ExhibitState): string {
  const params = new URLSearchParams({ v: '2' });
  for (const [key, value] of Object.entries(criticalState(state))) {
    if (key !== 'panX' && key !== 'panY') params.set(key, String(value));
  }
  return '#' + params.toString();
}
/** Linked winding preserves the offset and slope dτ/dx in BOTH directions.
 * At a range boundary the whole linkage stops; one shaft never slips silently. */
export function wind(state: ExhibitState, coordinate: 'x' | 'tau', target: number): ExhibitState {
  state = criticalState(state);
  if (!Number.isFinite(target)) return state;
  if (!state.linked)
    return {
      ...state,
      [coordinate]: coordinate === 'x' ? clamp(target, 0, MAX_X) : clamp(target, -MAX_TAU, MAX_TAU),
    };
  const wanted = coordinate === 'x' ? target - state.x : (target - state.tau) / state.ratio;
  const a = (-MAX_TAU - state.tau) / state.ratio;
  const b = (MAX_TAU - state.tau) / state.ratio;
  const delta = clamp(
    wanted,
    Math.max(-state.x, Math.min(a, b)),
    Math.min(MAX_X - state.x, Math.max(a, b)),
  );
  return { ...state, x: state.x + delta, tau: state.tau + state.ratio * delta };
}
export function advance(state: ExhibitState, seconds: number): ExhibitState {
  return wind(
    state,
    state.linked ? 'x' : state.drive,
    state[state.linked ? 'x' : state.drive] +
      clamp(seconds, 0, 0.05) * state.speed * state.direction,
  );
}
export function canAdvance(state: ExhibitState): boolean {
  const coordinate = state.linked ? 'x' : state.drive;
  return Math.abs(advance(state, 0.01)[coordinate] - state[coordinate]) > 1e-10;
}
export const positions = [
  {
    title: 'A prime-power birth',
    description: 'The pane at 8 and the ψ stylus share the same dial.',
    state: { ...initialState, x: 8.5, tau: -8.5, focus: 'sieve' } as ExhibitState,
  },
  {
    title: 'The first zero',
    description: 'Follow the gold ζ curve through the complex origin.',
    state: { ...initialState, x: zeroHeights[0], tau: -zeroHeights[0] },
  },
  {
    title: 'Count with harmonics',
    description: 'Watch the record contract and turn with the prime annuli.',
    state: { ...initialState, x: 60.5, tau: -60.5, focus: 'psi' } as ExhibitState,
  },
];
