import type { Complex } from './contracts';
import { births, countedPsi, factorsOf } from '../math/primes';
import { psiTrend, psiVectors } from '../math/psi';
import { xiArm } from '../math/xi-arm';
import { zeroHeights } from '../math/zeros';
import { paneAngle } from './layout';

/** A kinematic arm has a parent axle and a prescribed phase. Rendering a cog
 * does not assert that these arbitrary real ratios mesh as integer teeth. */
export interface Arm {
  id: string;
  parent: string | null;
  length: number;
  phase: number;
  drive: { coordinate: 'tau' | 'log-x'; rate: number };
  family: number;
  label: string;
}
export interface SolvedArm extends Arm {
  start: Complex;
  end: Complex;
}
export function solveArms(arms: readonly Arm[], origin: Complex = [0, 0]): SolvedArm[] {
  const ends = new Map<string, Complex>();
  return arms.map((arm) => {
    const start = arm.parent === null ? origin : ends.get(arm.parent);
    if (!start || ends.has(arm.id))
      throw new Error('Arms require unique IDs and parents before children.');
    const end: Complex = [
      start[0] + arm.length * Math.cos(arm.phase),
      start[1] + arm.length * Math.sin(arm.phase),
    ];
    ends.set(arm.id, end);
    return { ...arm, start, end };
  });
}
export function sieveAt(x: number) {
  const integer = Math.floor(x);
  return {
    factors: factorsOf(integer),
    panes: births
      .filter((e) => e.q <= x)
      .map((e) => ({
        ...e,
        radius: e.q / x,
        growth: Math.max(0, Math.min(1, x - e.q)),
        angle: paneAngle(e.q, x),
        active: integer % e.q === 0,
      })),
  };
}
export function xiMechanism(sigma: number, tau: number) {
  const model = xiArm({ sigma, tau });
  const arms: Arm[] = model.terms.map((term, i) => ({
    id: term.id,
    parent: i ? model.terms[i - 1].id : null,
    length: term.magnitude,
    phase: term.phase,
    drive: { coordinate: 'tau', rate: term.source.direction * term.source.u },
    family: term.source.direction,
    label: `Integral pair ${term.source.index + 1}, ${term.source.direction > 0 ? 'forward' : 'reverse'}`,
  }));
  return { arms: solveArms(arms), endpoint: model.endpoint, error: model.errorEstimate };
}
/** The ψ axle stands at the leading term x: from the origin at 0 to the dial
 * radius at 1, then fixed on the rim, level with the newest prime pane. The
 * small real corrections −log 2π − ½log(1 − x⁻²) are split in half, one half
 * leading the zero chain and one closing its mirrored conjugate. */
export function psiMechanism(x: number, count: number) {
  const vectors = psiVectors(x, count),
    anchor = x,
    offset = x >= 1 ? (psiTrend(x) - x) / 2 : 0;
  const arms: Arm[] = vectors.map((v, i) => ({
    id: `zero:${i}`,
    parent: i ? `zero:${i - 1}` : null,
    length: Math.hypot(...v),
    phase: Math.atan2(v[1], v[0]),
    drive: { coordinate: 'log-x', rate: zeroHeights[i] },
    family: i,
    label: `Zero pair ${i + 1}, γ = ${zeroHeights[i].toFixed(5)}`,
  }));
  const solved = solveArms(arms, [offset, 0]),
    branchTip: Complex = solved.at(-1)?.end ?? [offset, 0],
    tip: Complex = [2 * branchTip[0], 0];
  return {
    arms: solved,
    branchTip,
    anchor,
    offset,
    exact: countedPsi(x),
    approximation: x > 1 ? anchor + tip[0] : null,
    tip,
  };
}

/** Terms shown in the Dirichlet chain, all at full length from the start. */
export const SUM_TERMS = 128;
/** The finite Dirichlet chain Σ n⁻ˢ for n ≤ terms. Below sigma=1 these are
 * finite vectors, not an infinite evaluation of ζ. */
export function sumMechanism(sigma: number, tau: number, terms = SUM_TERMS) {
  const arms: Arm[] = [];
  for (let n = 1; n <= terms; n++) {
    arms.push({
      id: `term:${n}`,
      parent: n === 1 ? null : `term:${n - 1}`,
      length: Math.pow(n, -sigma),
      phase: -tau * Math.log(n),
      drive: { coordinate: 'tau', rate: -Math.log(n) },
      family: factorsOf(n)[0] ?? 1,
      label: `Term ${n}: ${n}^(−s)`,
    });
  }
  const solved = solveArms(arms);
  return { arms: solved, endpoint: solved.at(-1)?.end ?? ([0, 0] as Complex) };
}
export function fitScale(arms: readonly SolvedArm[], unit: number, available: number): number {
  let reach = 0.01;
  for (const arm of arms) reach = Math.max(reach, Math.hypot(...arm.start) + arm.length);
  return available / (reach * unit);
}
