import { zeta } from './zeta';
/** Local ζ locus; finite samples are broken at the pole, never joined through infinity. */
export function sampleLocus(sigma: number, centre: number, samples = 480): Float64Array {
  const low = Math.max(-1000, centre - 8),
    high = Math.min(1000, centre + 8);
  const rows = new Float64Array((samples + 1) * 3);
  for (let i = 0; i <= samples; i++) {
    const tau = low + ((high - low) * i) / samples,
      value = zeta(sigma, tau);
    rows.set([tau, value[0], value[1]], i * 3);
  }
  return rows;
}
