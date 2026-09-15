import type { PrimePowerSource } from './contracts';

/** Pure snapshot: playing, seeking and rewinding all produce the same geometry. */
export function paneAt(source: PrimePowerSource, time: number) {
  if (!Number.isFinite(time) || time<1) throw new RangeError('Clock time must be finite and at least 1.');
  const q=source.q, born=time>=q;
  return {
    source, time, born,
    birthAt: q,
    growthCompleteAt: q+1,
    sumTermCompleteAt: q,
    growth: Math.max(0,Math.min(1,time-q)),
    radiusInClockUnits: born?q/time:0,
    leadingAngle: 2*Math.PI*((time/q)%1),
  };
}
