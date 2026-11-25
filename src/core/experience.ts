import { births } from '../math/primes';
import { zeroHeights } from '../math/zeros';
import { zeta } from '../math/zeta';
export interface Moment {
  kind: 'prime' | 'power' | 'zero';
  value: number;
  age: number;
  reverse: boolean;
}
export interface TrailPoint {
  re: number;
  im: number;
  age: number;
}
export interface Experience {
  moments: Moment[];
  trail: TrailPoint[];
}
/** Seconds a ζ trail sample remains visible. */
export const TRAIL_SECONDS = 5;
/** Largest τ step between trail samples, and the bound on retained samples. */
const TRAIL_STEP = 0.02,
  TRAIL_POINTS = 1500;
export const freshExperience = (): Experience => ({ moments: [], trail: [] });
const crossed = (a: number, b: number, v: number) => (b > a ? a < v && v <= b : b <= v && v < a);
/** Half-open intervals ensure an event is emitted exactly once, even at signed zero heights. */
export function crossings(
  from: { x: number; tau: number },
  to: { x: number; tau: number },
): Moment[] {
  const events: Moment[] = [];
  for (const b of births)
    if (crossed(from.x, to.x, b.q))
      events.push({
        kind: b.k === 1 ? 'prime' : 'power',
        value: b.q,
        age: 0,
        reverse: to.x < from.x,
      });
  for (const g of zeroHeights)
    for (const t of [-g, g])
      if (crossed(from.tau, to.tau, t))
        events.push({
          kind: 'zero',
          value: t,
          age: 0,
          reverse: t > 0 ? to.tau < from.tau : to.tau > from.tau,
        });
  return events;
}
/** Age follows wall time, including pause; seeking and reversal clear history. */
export function tickExperience(
  previous: Experience,
  from: { x: number; tau: number },
  to: { x: number; tau: number },
  seconds: number,
  trailSeconds: number,
  trailEnabled: boolean,
): Experience {
  const dt = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const moments = [
    ...previous.moments.map((m) => ({ ...m, age: m.age + dt })).filter((m) => m.age < 1.1),
    ...crossings(from, to),
  ].slice(-24);
  let trail = trailEnabled
    ? previous.trail.map((p) => ({ ...p, age: p.age + dt })).filter((p) => p.age < trailSeconds)
    : [];
  if (trailEnabled && to.tau !== from.tau) {
    // Sample by height, not by frame time, so fast winding still draws the curve
    // rather than long chords between widely spaced frames.
    if (!trail.length) {
      const [re, im] = zeta(0.5, from.tau);
      if (Number.isFinite(re)) trail.push({ re, im, age: Math.min(dt, trailSeconds) });
    }
    const steps = Math.min(400, Math.ceil(Math.abs(to.tau - from.tau) / TRAIL_STEP));
    for (let i = 1; i <= steps; i++) {
      const f = i / steps,
        z = zeta(0.5, from.tau + (to.tau - from.tau) * f);
      if (z.every(Number.isFinite)) trail.push({ re: z[0], im: z[1], age: dt * (1 - f) });
    }
    trail = trail.slice(-TRAIL_POINTS);
  }
  return { moments, trail };
}
