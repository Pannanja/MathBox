import type { Complex, ComplexInput } from '../core/contracts';
import { logEuler } from './log-euler';
import { sumComplex } from '../core/complex';

/** Reveals follow pane growth [q,q+1], independently of the phases fixed by s. */
export function logArmAt(input: ComplexInput, time: number) {
  if (!Number.isFinite(time) || time<1) throw new RangeError('Clock time must be at least 1.');
  const full=logEuler(input,Math.floor(time));
  const terms=full.contributions.map(term=>{
    const growth=Math.max(0,Math.min(1,time-term.source.q));
    const value: Complex=[term.value[0]*growth,term.value[1]*growth];
    return {...term,fullValue:term.value,value,growth};
  });
  return {...full,time,terms,completedCutoffEndpoint:full.endpoint,endpoint:sumComplex(terms.map(t=>t.value))};
}
export type LogArmModel = ReturnType<typeof logArmAt>;
export type LogArmTerm = LogArmModel['terms'][number];
