import type { ExhibitState } from './state';
import { clamp } from './state';
import { countScale, WORLD } from './layout';
import { psiMechanism } from './mechanism';
import { births } from '../math/primes';
import { passedZeros } from '../math/psi';
import { recordValue } from '../math/record';

/** The lens looks ahead and behind along x. A prime-power step is therefore
 * framed before the tip reaches it, instead of forcing a zoom-out on arrival. */
export const LENS_WINDOW = 0.75;
const GRID = LENS_WINDOW / 12;
interface Extent {
  /** Tip offset from the axle, ψ₀(x) − x, in count units. */
  tip: number;
  /** Bounds of both branches and their wheels about the axle, in count units. */
  box: [number, number, number, number];
}
const extents = new Map<string, Extent>();
function remember(key: string, make: () => Extent) {
  let value = extents.get(key);
  if (!value) {
    if (extents.size > 4000) extents.clear();
    extents.set(key, (value = make()));
  }
  return value;
}
/** The complete construction at a sampled x, as seen from its axle. */
function extentAt(x: number, count: number): Extent {
  return remember(`${count}:${x}`, () => {
    const model = psiMechanism(x, count),
      tip = recordValue(x, count)[0] - x;
    let left = Math.min(0, tip),
      right = Math.max(0, tip),
      reach = 0;
    // The conjugate is the reflection across the real axis: symmetric height.
    for (const a of model.arms) {
      const r = a.length;
      left = Math.min(left, a.start[0] - r);
      right = Math.max(right, a.start[0] + r);
      reach = Math.max(reach, Math.abs(a.start[1]) + r);
    }
    return { tip, box: [left, -reach, right, reach] };
  });
}
function tipAt(x: number, count: number) {
  return remember(`tip:${count}:${x}`, () => ({
    tip: recordValue(x, count)[0] - x,
    box: [0, 0, 0, 0],
  })).tip;
}
/** Smooth weight: 1 at the current x, 0 at the window's edge. */
function bump(d: number) {
  const t = Math.abs(d) / LENS_WINDOW;
  return t >= 1 ? 0 : (1 - t * t) ** 2;
}
/** Fixed x samples (a grid plus the narrow overshoots around each prime power),
 * so the weighted envelope varies continuously as x moves through the window. */
function windowSamples(x: number) {
  const samples: number[] = [];
  for (let j = Math.ceil((x - LENS_WINDOW) / GRID); j * GRID < x + LENS_WINDOW; j++)
    samples.push(j * GRID);
  for (const { q } of births) {
    if (q > x + LENS_WINDOW * 1.01) break;
    if (q < x - LENS_WINDOW * 1.01) continue;
    for (const f of [0.996, 0.998, 1.002, 1.004]) samples.push(q * f);
  }
  return samples.filter((s) => s > 1 && Math.abs(s - x) < LENS_WINDOW);
}

/** How strongly the construction steers the lens. ψ appears fully extended at
 * x = 1, far larger than its later scale, and its tip runs through the
 * logarithmic singularity there. Until the terms have curled, hold the lens on
 * the axle at a moderate scale and let the construction take over smoothly. */
export function lensEngagement(x: number) {
  const t = Math.max(0, Math.min(1, (x - 1) / 0.25));
  return t * t * (3 - 2 * t);
}
/** All targets remain in the original scene's coordinates. No camera feedback. */
export function psiOptics(state: ExhibitState, model = psiMechanism(state.x, state.zeros)) {
  const unit = countScale(state.x),
    engaged = lensEngagement(state.x);
  const axle = [WORLD.centre[0] + model.anchor * unit, WORLD.centre[1]];
  const tip = [axle[0] + model.tip[0] * unit, axle[1]];
  const reached = passedZeros(state.tau, state.zeros);
  const developing = model.arms[reached - 1]?.end ?? [model.offset, 0];
  const activeTip = [axle[0] + 2 * developing[0] * unit, axle[1]];
  const points = [
    axle,
    activeTip,
    tip,
    ...model.arms.flatMap((a) => {
      const x = axle[0] + a.start[0] * unit,
        y = axle[1] - a.start[1] * unit,
        r = a.length * unit;
      return [
        [x - r, y],
        [x + r, y],
        [x, y - r],
        [x, y + r],
        // The conjugate branch, reflected across the real axis.
        [x, 2 * axle[1] - y - r],
        [x, 2 * axle[1] - y + r],
      ];
    }),
  ];
  // Draw every current-frame point toward the axle while the lens engages.
  const axleX = axle[0],
    axleY = axle[1],
    pull = (p: number[]) => [axleX + engaged * (p[0] - axleX), axleY + engaged * (p[1] - axleY)];
  for (let i = 0; i < points.length; i++) points[i] = pull(points[i]);
  // Near a prime power the partial sums swing far from the real axis as well as
  // the tip jumping along it. Weighted neighbours frame both before arrival,
  // including ψ's appearance at x = 1.
  for (const s of windowSamples(state.x)) {
    const k = bump(s - state.x) * lensEngagement(s) * unit,
      { tip: t, box } = extentAt(s, state.zeros);
    points.push(
      [axle[0] + k * t, axle[1]],
      [axle[0] + k * box[0], axle[1] - k * box[1]],
      [axle[0] + k * box[2], axle[1] - k * box[3]],
    );
    // The developing tip advances with τ when the shafts are linked.
    if (state.linked) {
      const count = passedZeros(state.tau + state.ratio * (s - state.x), state.zeros);
      points.push([axle[0] + k * tipAt(s, count), axle[1]]);
    }
  }
  const centre = [
    (Math.min(...points.map((p) => p[0])) + Math.max(...points.map((p) => p[0]))) / 2,
    (Math.min(...points.map((p) => p[1])) + Math.max(...points.map((p) => p[1]))) / 2,
  ];
  const target = state.lensFocus === 'tip' ? pull(tip) : state.lensFocus === 'axle' ? axle : centre;
  const focus = { x: target[0] + state.lensDx, y: target[1] - state.lensDy };
  const extent = Math.max(
    // Before ψ engages, frame a modest patch around the axle rather than a point.
    1 + 11 * (1 - engaged),
    ...points.map((p) => Math.hypot(p[0] - focus.x, p[1] - focus.y)),
    ...model.arms.map((a) => {
      const [x, y] = pull([axle[0] + a.start[0] * unit, axle[1] - a.start[1] * unit]);
      return Math.hypot(x - focus.x, y - focus.y) + engaged * a.length * unit;
    }),
  );
  // Containment applies to the tips as the lens sees them while it engages.
  const tips = [pull(tip), pull(activeTip)];
  const tipDistance = Math.max(
    1e-9,
    ...tips.map((p) => Math.hypot(p[0] - focus.x, p[1] - focus.y)),
  );
  return {
    focus,
    tips,
    scale: clamp((state.lensRadius * 0.82) / extent, 0.01, 30),
    tipLimit: (state.lensRadius * 0.9) / tipDistance,
  };
}
/** Smoothing shapes motion, never containment. Apply this to the current
 * frame, including seeks, focus changes, manual zoom and resizing. */
export function containedLensScale(requested: number, optics: ReturnType<typeof psiOptics>) {
  return Math.min(requested, optics.tipLimit);
}
/** The look-ahead target is already continuous in x, so zooming out follows it
 * at once (no lag for the containment cap to snap); zooming in eases. */
export function followLens(current: number, target: number, seconds: number): number {
  return target <= current ? target : smoothLens(current, target, seconds);
}
export function smoothLens(current: number, target: number, seconds: number): number {
  return (
    current + (target - current) * (1 - Math.exp(-Math.max(0, Math.min(seconds, 0.05)) / 0.25))
  );
}

/** Bounded off-axis viewing of the same relay image. Moving the rim shifts the
 * sampled source, instead of translating a rigid inset. Reapply tip containment. */
export function lensParallax(
  optics: { focus: { x: number; y: number }; tips: number[][] },
  lens: { x: number; y: number; r: number },
  home: { x: number; y: number },
  requested: number,
  angle: number,
) {
  const dx = lens.x - home.x,
    dy = lens.y - home.y;
  const amount = Math.min(0.3, (lens.r * 0.16) / Math.max(1e-9, Math.hypot(dx, dy)));
  const a = (angle * Math.PI) / 180,
    c = Math.cos(a),
    s = Math.sin(a);
  const scale = Math.max(0.0001, requested);
  const focus = {
    x: optics.focus.x + ((c * dx + s * dy) * amount) / scale,
    y: optics.focus.y + ((-s * dx + c * dy) * amount) / scale,
  };
  const distance = Math.max(
    1e-9,
    ...optics.tips.map((p) => Math.hypot(p[0] - focus.x, p[1] - focus.y)),
  );
  const fitted = Math.min(scale, (lens.r * 0.88) / distance);
  // Differential movement between the rear works and foreground carriage.
  // Express it in source units, so the depth cue stays bounded after magnifying.
  const depthGain = Math.min(0.06, (lens.r * 0.035) / Math.max(1e-9, Math.hypot(dx, dy)));
  return {
    focus,
    scale: fitted,
    depth: {
      x: (-(c * dx + s * dy) * depthGain) / fitted,
      y: (-(-s * dx + c * dy) * depthGain) / fitted,
    },
  };
}
