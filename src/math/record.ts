import { births, MAX_X } from './primes';
import { psiTip } from './psi';
import { zeroHeights } from './zeros';
import { carriedPoint } from '../core/layout';
import type { Complex } from '../core/contracts';
/** Rows are [x, reference real, paired imaginary sum (zero)].
 * This is a reconstructed record at the chosen reference precision, so seeking
 * and rewinding reproduce the same inscription, not invented playback history. */
export const RECORD_STRIDE = 3;
/** Below 2 the count is zero; the finite reconstruction only differs from it in
 * a narrow logarithmic spike just past 1. The record starts at the origin there. */
export const RECORD_START = 1,
  RECORD_SETTLED = 1.5;
export function recordValue(x: number, count: number): Complex {
  return x < RECORD_SETTLED ? [0, 0] : psiTip(x, count);
}
export function sampleRecord(count: number, end = MAX_X): Float64Array {
  if (end < RECORD_START) return new Float64Array();
  const rows: number[] = [RECORD_START, 0, 0],
    highest = zeroHeights[Math.max(0, count - 1)];
  if (end < RECORD_SETTLED) {
    rows.push(end, 0, 0);
    return new Float64Array(rows);
  }
  let x = RECORD_SETTLED;
  const contacts = births.map((b) => b.q).filter((q) => q > RECORD_SETTLED && q <= end);
  let contact = 0;
  for (;;) {
    const tip = psiTip(x, count);
    rows.push(x, tip[0], tip[1]);
    if (x >= end) break;
    while (contact < contacts.length && contacts[contact] <= x) contact++;
    x = Math.min(
      end,
      contacts[contact] ?? end,
      // The finite sum has no feature narrower than one period 2πx/γ of its
      // highest zero; eight samples per period resolve it at every x.
      x + (2 * Math.PI * x) / highest / 8,
    );
  }
  return new Float64Array(rows);
}
/** Carried screen points closer than this to the last drawn point are skipped:
 * deep in the spiral, thousands of samples share a pixel. */
const RECORD_MIN_STEP = 0.4;
export function recordPaths(rows: Float64Array, now: number, count: number) {
  let reference = '',
    lastX = NaN,
    lastY = NaN,
    pendingX = NaN,
    pendingY = NaN;
  for (let i = 0; i < rows.length; i += RECORD_STRIDE) {
    const x = rows[i];
    if (x > now) break;
    const p = carriedPoint([rows[i + 1], rows[i + 2]], x, now);
    if (reference && Math.hypot(p[0] - lastX, p[1] - lastY) < RECORD_MIN_STEP) {
      pendingX = p[0];
      pendingY = p[1];
      continue;
    }
    reference += `${reference ? 'L' : 'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`;
    lastX = p[0];
    lastY = p[1];
    pendingX = NaN;
  }
  if (reference) {
    if (Number.isFinite(pendingX)) reference += `L${pendingX.toFixed(2)},${pendingY.toFixed(2)}`;
    const p = carriedPoint(recordValue(now, count), now, now);
    reference += `L${p[0]},${p[1]}`;
  }
  return { reference };
}
