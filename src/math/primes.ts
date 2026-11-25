export interface PrimePower {
  q: number;
  p: number;
  k: number;
  rise: number;
  total: number;
}
/** The sieve and dial run as far as the predecessor exhibit: x ≤ 5000. */
export const MAX_X = 5000;
/** The shared sieve produces both the panes and the exact Chebyshev ledger. */
export function primePowers(limit: number): PrimePower[] {
  const composite = new Uint8Array(limit + 1),
    events: PrimePower[] = [];
  for (let p = 2; p <= limit; p++)
    if (!composite[p]) {
      for (let n = p * p; n <= limit; n += p) composite[n] = 1;
      for (let q = p, k = 1; q <= limit; q *= p, k++)
        events.push({ q, p, k, rise: Math.log(p), total: 0 });
    }
  events.sort((a, b) => a.q - b.q);
  let total = 0;
  for (const event of events) event.total = total += event.rise;
  return events;
}
export const births = primePowers(MAX_X);
export function countedPsi(x: number): number {
  let total = 0;
  for (const event of births) {
    if (event.q > x) break;
    total = event.total;
  }
  return total;
}
export function factorsOf(n: number): number[] {
  const factors: number[] = [];
  for (let p = 2; p * p <= n; p++)
    while (n % p === 0) {
      factors.push(p);
      n /= p;
    }
  if (n > 1) factors.push(n);
  return factors;
}
