import { writeFileSync } from 'node:fs';
import { zeta } from '../src/math/zeta';
/** Offline port of the previous page's zeroSearchJob. This table contains the
 * detected critical-line roots, not a proof that there are no off-line zeros. */
function theta(t: number) {
  const h = t / 2,
    w = 1 / t;
  return (
    h * Math.log(h / Math.PI) -
    h -
    Math.PI / 8 +
    w / 48 +
    (7 * w ** 3) / 5760 +
    (31 * w ** 5) / 80640 +
    (127 * w ** 7) / 430080
  );
}
function hardy(t: number) {
  const z = zeta(0.5, t),
    a = theta(t);
  return Math.cos(a) * z[0] - Math.sin(a) * z[1];
}
const heights: number[] = [],
  step = 0.05,
  base = 10,
  limit = 1000;
let previous = hardy(base);
for (let i = 1; base + i * step <= limit; i++) {
  const t = base + i * step,
    value = hardy(t);
  if (previous < 0 !== value < 0) {
    let lo = t - step,
      hi = t,
      flo = previous;
    for (let k = 0; k < 70; k++) {
      const mid = (lo + hi) / 2;
      if (mid <= lo || mid >= hi) break;
      const fm = hardy(mid);
      if (flo < 0 !== fm < 0) hi = mid;
      else {
        lo = mid;
        flo = fm;
      }
    }
    heights.push((lo + hi) / 2);
  }
  previous = value;
}
if (heights.length !== 649) throw new Error(`Expected 649 roots, got ${heights.length}`);
writeFileSync(
  new URL('../src/math/zero-heights.json', import.meta.url),
  JSON.stringify(heights, null, 2) + '\n',
);
console.log(`Wrote ${heights.length} reference zero heights.`);
