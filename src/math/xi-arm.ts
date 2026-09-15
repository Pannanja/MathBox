import type { Complex, ComplexInput } from '../core/contracts';
import { sumComplex } from '../core/complex';

// Classical Fourier representation: https://arxiv.org/html/1904.12438#S1
// With that paper's Φ and H₀, K(u)=4Φ(u/2), so ξ(s)=∫K(u)cosh((s−½)u)du.
const cutoff=2.5, gaussianTerms=8;
/** Gauss-Legendre nodes on [0,cutoff], fixed across the supported input window. */
function quadrature(order: number) {
  const nodes: {u:number;weight:number;amplitude:number}[]=[];
  for(let i=1;i<=order;i++){
    let z=Math.cos(Math.PI*(i-.25)/(order+.5)),derivative=0;
    for(let step=0;step<30;step++){
      let previous=1,current=z;
      for(let k=2;k<=order;k++){const next=((2*k-1)*z*current-(k-1)*previous)/k;previous=current;current=next;}
      derivative=order*(z*current-previous)/(z*z-1);
      const next=z-current/derivative;
      if(Math.abs(next-z)<2e-16){z=next;break;}z=next;
    }
    // Re-evaluate the derivative at the final node before computing its weight.
    let previous=1,current=z;
    for(let k=2;k<=order;k++){const next=((2*k-1)*z*current-(k-1)*previous)/k;previous=current;current=next;}
    derivative=order*(z*current-previous)/(z*z-1);
    const u=cutoff*(1+z)/2,weight=cutoff/((1-z*z)*derivative*derivative),x=Math.exp(2*u);
    let kernel=0;
    for(let n=1;n<=gaussianTerms;n++){
      const a=Math.PI*n*n*x;
      kernel+=(8*a*a-12*a)*Math.exp(u/2-a);
    }
    nodes.push({u,weight,amplitude:weight*kernel/2});
  }
  return nodes.sort((a,b)=>a.u-b.u);
}
const fine=quadrature(96),coarse=quadrature(64);
export interface XiVector {
  id: string;
  value: Complex;
  magnitude: number;
  phase: number;
  source: {kind:'quadrature';index:number;u:number;weight:number;direction:1|-1};
}
function vectors(input: ComplexInput,nodes: typeof fine): XiVector[] {
  return nodes.flatMap((node,index)=>{
    const phase=input.tau*node.u,c=Math.cos(phase),s=Math.sin(phase),delta=(input.sigma-.5)*node.u;
    return ([1,-1] as const).map(direction=>{
      const magnitude=node.amplitude*Math.exp(direction*delta);
      return {id:`xi:${index}:${direction}`,magnitude,phase:direction*phase,
        source:{kind:'quadrature' as const,index,u:node.u,weight:node.weight,direction},
        value:[magnitude*c,direction*magnitude*s] as Complex};
    });
  });
}
export function xiArm(input: ComplexInput) {
  if(!Number.isFinite(input.sigma)||input.sigma<.2||input.sigma>3||!Number.isFinite(input.tau)||Math.abs(input.tau)>15)
    throw new RangeError('The ξ arm is validated for 0.2 ≤ σ ≤ 3 and |τ| ≤ 15.');
  const terms=vectors(input,fine),endpoint=sumComplex(terms.map(t=>t.value)),comparison=sumComplex(vectors(input,coarse).map(t=>t.value));
  const absoluteMass=terms.reduce((sum,t)=>sum+t.magnitude,0),roundoffEstimate=32*Number.EPSILON*absoluteMass;
  const quadratureEstimate=Math.hypot(endpoint[0]-comparison[0],endpoint[1]-comparison[1]);
  // Upper bounds after x=exp(2u), dropping the negative part of each K term.
  const a=1.25+Math.abs(input.sigma-.5)/2,X=Math.exp(2*cutoff),n=gaussianTerms+1;
  const integralTail=4*Math.PI**2*Math.exp(-Math.PI*X)*X**a/((Math.PI-a/X)*(1-16*Math.exp(-3*Math.PI*X)));
  const kernelTail=4*Math.PI**2*n**4*Math.exp(-Math.PI*n*n)/((Math.PI*n*n-a)*(1-((n+1)/n)**4*Math.exp(-Math.PI*(2*n+1))));
  return {input:{...input},terms,endpoint,absoluteMass,quadratureEstimate,roundoffEstimate,
    omittedBound:integralTail+kernelTail,errorEstimate:quadratureEstimate+roundoffEstimate+integralTail+kernelTail,
    cutoff,pairs:fine.length};
}
export type XiArmModel=ReturnType<typeof xiArm>;
