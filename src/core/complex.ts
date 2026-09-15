import type { Complex } from './contracts';

export function multiply(a: Complex, b: Complex): Complex {
  return [a[0]*b[0]-a[1]*b[1], a[0]*b[1]+a[1]*b[0]];
}
export function polar(radius: number, phase: number): Complex {
  return [radius*Math.cos(phase), radius*Math.sin(phase)];
}
/** Compensated accumulation preserves small contributions to large partial sums. */
export function sumComplex(values: Iterable<Complex>): Complex {
  let re=0, im=0, cr=0, ci=0;
  for (const z of values) {
    const yr=z[0]-cr, yi=z[1]-ci, tr=re+yr, ti=im+yi;
    cr=(tr-re)-yr; ci=(ti-im)-yi; re=tr; im=ti;
  }
  return [re,im];
}
