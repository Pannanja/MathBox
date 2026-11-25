import type { Complex } from './contracts';
export const CLOCK_RADIUS = 320;
/** A fixed one-unit dial below 1 keeps the count scale finite at the origin. */
export const countScale = (x: number) => CLOCK_RADIUS / Math.max(1, x);
export const WORLD = { w: 920, h: 850, centre: [460, 430] as Complex };
/** All three systems use this handedness: Re right, Im up, positive angles
 * counterclockwise. The only sign change is the screen's downward y axis. */
export function project(z: readonly number[], unit: number): Complex {
  return [unit * z[0], -unit * z[1]];
}
export function paneAngle(q: number, x: number): number {
  return 2 * Math.PI * ((x / q) % 1);
}
/** Continuous material flow, indexed by recording x rather than the jumping count.
 * Each prime q still contacts the q ring; intermediate marks have continuous periods. */
export function carriedPoint(value: Complex, at: number, now: number): Complex {
  const angle = (2 * Math.PI * (now - at)) / Math.max(0.5, at);
  const c = Math.cos(angle),
    s = Math.sin(angle);
  return project([value[0] * c - value[1] * s, value[0] * s + value[1] * c], countScale(now));
}
