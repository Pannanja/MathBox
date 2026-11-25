import type { Complex } from './contracts';
/** Compensated addition: small arms must survive cancellation of larger arms. */
export function sumComplex(values: Iterable<Complex>): Complex {
  let re = 0,
    im = 0,
    cr = 0,
    ci = 0;
  for (const z of values) {
    const yr = z[0] - cr,
      yi = z[1] - ci,
      tr = re + yr,
      ti = im + yi;
    cr = tr - re - yr;
    ci = ti - im - yi;
    re = tr;
    im = ti;
  }
  return [re, im];
}
