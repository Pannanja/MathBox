import { births, countedPsi } from '../math/primes';

/** Decorative rack teeth are spaced by the exact log(p) count increments.
 * The rack follows the exact count; it does not drive the approximate formula. */
export function ratchetGeometry(x: number, unit: number) {
  const events = births.filter((event) => event.q <= x);
  const exact = countedPsi(x);
  const stop = exact * unit;
  const teeth = events.map((event) => ({
    q: event.q,
    left: (event.total - event.rise) * unit,
    right: event.total * unit,
  }));
  const last = events.at(-1)?.q ?? x;
  // A brief geometric pawl lift at a contact; reversible and independent of fps.
  const lift = Math.max(0, 1 - (x - last) / 0.35) * 3;
  return { stop, teeth, lift };
}
