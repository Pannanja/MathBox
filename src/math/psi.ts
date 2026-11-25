import { zeroHeights } from './zeros';
import type { Complex } from '../core/contracts';
/** Trivial zeros included: as many as the tabulated nontrivial zeros. */
export const TRIVIAL_ZEROS = 649;
/** Σ x⁻²ⁿ/2n over the trivial zeros −2n, n ≤ TRIVIAL_ZEROS. Infinitely many
 * give −½log(1 − x⁻²), which diverges at x = 1; the finite set stays finite
 * there. Once x⁻²ᴺ < 1e-50 the omitted tail is negligible and the closed form is used. */
export function trivialZeros(x: number): number {
  const q = x ** -2;
  if (q ** TRIVIAL_ZEROS < 1e-50) return -0.5 * Math.log(-Math.expm1(-2 * Math.log(x)));
  let sum = 0,
    power = 1;
  for (let n = 1; n <= TRIVIAL_ZEROS; n++) {
    power *= q;
    sum += power / (2 * n);
  }
  return sum;
}
export function psiTrend(x: number): number {
  return x - Math.log(2 * Math.PI) + trivialZeros(x);
}
/** One upper-half-plane term, -x^ρ/ρ. Its partner is the complex conjugate. */
export function psiVectors(x: number, count: number): Complex[] {
  return zeroHeights.slice(0, count).map((gamma) => {
    if (x === 0) return [0, 0]; // Each term has magnitude proportional to √x.
    const a = gamma * Math.log(x),
      den = 0.25 + gamma * gamma,
      k = -Math.sqrt(x) / den;
    return [
      k * (0.5 * Math.cos(a) + gamma * Math.sin(a)),
      k * (0.5 * Math.sin(a) - gamma * Math.cos(a)),
    ];
  });
}

export function passedZeros(tau: number, maximum = zeroHeights.length): number {
  let lo = 0,
    hi = Math.min(maximum, zeroHeights.length);
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (zeroHeights[mid] <= Math.abs(tau)) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
/** Finite explicit formula for x > 1. Each pair sums to twice its real part. */
export function psiTip(x: number, count: number): Complex {
  let re = psiTrend(x),
    correction = 0;
  const lx = Math.log(x),
    root = -2 * Math.sqrt(x);
  for (let i = 0; i < Math.min(count, zeroHeights.length); i++) {
    const g = zeroHeights[i],
      a = g * lx;
    const term = (root * (0.5 * Math.cos(a) + g * Math.sin(a))) / (0.25 + g * g);
    const delta = term - correction;
    const next = re + delta;
    correction = next - re - delta;
    re = next;
  }
  return [re, 0];
}
