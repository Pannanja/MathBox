import type { ComplexInput, PrimePowerSource, PrimePowerContribution } from '../core/contracts';
import { polar, sumComplex } from '../core/complex';

export function primePowersThrough(limit: number): PrimePowerSource[] {
  if (!Number.isSafeInteger(limit) || limit<1 || limit>1_000_000)
    throw new RangeError('Prime-power enumeration supports integer limits from 1 to 1,000,000.');
  const composite=new Uint8Array(limit+1), sources: PrimePowerSource[]=[];
  for (let p=2;p<=limit;p++) {
    if (composite[p]) continue;
    for (let m=p*p;m<=limit;m+=p) composite[m]=1;
    for (let q=p,k=1;q<=limit;q*=p,k++) sources.push({kind:'prime-power',p,k,q});
  }
  return sources.sort((a,b)=>a.q-b.q);
}

/** A finite sum exists outside σ>1, but no convergent log ζ is claimed there. */
export function logEuler(input: ComplexInput, limit: number) {
  const {sigma,tau}=input;
  if (!Number.isFinite(sigma) || !Number.isFinite(tau)) throw new RangeError('Complex input must be finite.');
  const contributions: PrimePowerContribution[]=primePowersThrough(limit).map(source=>{
    const {q,k}=source, ledgerWeight=1/k;
    const magnitude=Math.exp(-sigma*Math.log(q))*ledgerWeight, phase=-tau*Math.log(q);
    if (!Number.isFinite(magnitude) || !Number.isFinite(phase)) throw new RangeError('Contribution exceeds floating-point range.');
    return {id:`prime-power:${q}`,quantity:'log-zeta',source,ledgerWeight,magnitude,phase,value:polar(magnitude,phase)};
  });
  const endpoint=sumComplex(contributions.map(c=>c.value));
  if (!endpoint.every(Number.isFinite)) throw new RangeError('Sum exceeds floating-point range.');
  return {input:{...input},limit,contributions,endpoint,convergentDomain:sigma>1,
    truncation:'prime-powers-through-limit' as const};
}
