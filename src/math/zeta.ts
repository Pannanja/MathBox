export function zeta(sigma: number, tau: number): [number, number] {
  if (Math.hypot(sigma - 1, tau) < 1e-12) return [Infinity, Infinity];
  const N = Math.max(96, Math.ceil(1.25 * Math.abs(tau))),
    ln = Math.log(N);
  let re = 0,
    im = 0,
    cr = 0,
    ci = 0;
  for (let n = 1; n <= N; n++) {
    const l = Math.log(n),
      r = Math.exp(-sigma * l),
      a = -tau * l,
      yr = r * Math.cos(a) - cr,
      yi = r * Math.sin(a) - ci,
      tr = re + yr,
      ti = im + yi;
    cr = tr - re - yr;
    ci = ti - im - yi;
    re = tr;
    im = ti;
  }
  const a = -tau * ln,
    r = Math.exp(-sigma * ln),
    nr = r * Math.cos(a),
    ni = r * Math.sin(a),
    d = (sigma - 1) ** 2 + tau * tau;
  re += (N * (nr * (sigma - 1) + ni * tau)) / d - nr / 2;
  im += (N * (ni * (sigma - 1) - nr * tau)) / d - ni / 2;
  const coeff = [1 / 12, -1 / 720, 1 / 30240, -1 / 1209600, 1 / 47900160, -691 / 1307674368000];
  let rr = 1,
    ri = 0,
    j = 0;
  for (let k = 1; k <= 6; k++) {
    while (j < 2 * k - 1) {
      const next = rr * (sigma + j) - ri * tau;
      ri = rr * tau + ri * (sigma + j);
      rr = next;
      j++;
    }
    const f = coeff[k - 1] * Math.pow(N, 1 - 2 * k);
    re += f * (rr * nr - ri * ni);
    im += f * (rr * ni + ri * nr);
  }
  return [re, im];
}
