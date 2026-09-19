import type { Complex } from '../core/contracts';

export interface PsiBirth { q:number; p:number; k:number; rise:number; lo:number; hi:number }
export function psiBirths(limit:number):PsiBirth[]{
 const composite=new Uint8Array(limit+1),events:PsiBirth[]=[];
 for(let p=2;p<=limit;p++)if(!composite[p]){
  for(let n=p*p;n<=limit;n+=p)composite[n]=1;
  for(let q=p,k=1;q<=limit;q*=p,k++)events.push({q,p,k,rise:Math.log(p),lo:0,hi:0});
 }
 events.sort((a,b)=>a.q-b.q);let total=0;
 for(const e of events){e.lo=total;total+=e.rise;e.hi=total;}return events;
}
export function psiIndexAt(events:readonly PsiBirth[],x:number){let lo=0,hi=events.length;while(lo<hi){const mid=(lo+hi)>>>1;if(events[mid].q<=x)lo=mid+1;else hi=mid;}return lo-1;}
export function countedPsi(events:readonly PsiBirth[],x:number){const i=psiIndexAt(events,x);return i<0?0:events[i].hi;}
export function psiTrend(x:number){return x-Math.log(2*Math.PI)-.5*Math.log1p(-1/(x*x));}
/** One rho = 1/2+i gamma contribution, normalized by sqrt(x).
 * Its conjugate is a second vector; drawing 2*v would leave a false transverse endpoint. */
export function psiZeroVector(x:number,gamma:number):Complex{
 const a=gamma*Math.log(x),c=Math.cos(a),s=Math.sin(a),den=.25+gamma*gamma;
 return [-(.5*c+gamma*s)/den,-(.5*s-gamma*c)/den];
}
export function passedZeros(heights:readonly number[],tau:number){let lo=0,hi=heights.length;const height=Math.abs(tau);while(lo<hi){const mid=(lo+hi)>>>1;if(heights[mid]<=height)lo=mid+1;else hi=mid;}return lo;}
export function psiApproximation(x:number,heights:readonly number[],count=heights.length){
 if(x<2||!Number.isFinite(x))return NaN;
 let sum=0,correction=0;
 for(let i=0;i<Math.min(count,heights.length);i++){const term=2*psiZeroVector(x,heights[i])[0],y=term-correction,next=sum+y;correction=(next-sum)-y;sum=next;}
 return psiTrend(x)+Math.sqrt(x)*sum;
}
export function psiArm(x:number,heights:readonly number[],count:number){
 if(x<2)return {start:NaN,endpoint:NaN,points:[] as Complex[]};
 const start=psiTrend(x),points:Complex[]=[[start,0]],root=Math.sqrt(x);let re=start;
 for(let i=0;i<Math.min(Math.ceil(count),heights.length);i++){
  const weight=Math.max(0,Math.min(1,count-i)),v=psiZeroVector(x,heights[i]),dx=root*v[0]*weight,dy=root*v[1]*weight;
  points.push([re+dx,dy]);re+=2*dx;points.push([re,0]);
 }
 return {start,endpoint:re,points};
}

/** The chain drawn as genuine epicycles rather than conjugate tents.
 * Each leg is 2*sqrt(x) * (x^rho/rho), so the chain wanders in the plane and
 * its REAL coordinate is exactly the pair's contribution: the endpoint's real
 * part equals psiApproximation for the same count. The transverse coordinate
 * is the part the conjugate cancels. It is drawn, never claimed -- the drop to
 * the axis is what reads as psi, which is why the caller must draw that drop. */
export interface PsiChain { start:number; points:Complex[]; endpoint:number; tip:Complex }
export function psiEpicycles(x:number,heights:readonly number[],count:number):PsiChain{
 if(!(x>=2)||!Number.isFinite(x))return {start:NaN,points:[],endpoint:NaN,tip:[NaN,NaN]};
 const start=psiTrend(x),root=Math.sqrt(x),points:Complex[]=[[start,0]];
 let re=start,im=0;
 const n=Math.min(Math.ceil(count),heights.length);
 for(let i=0;i<n;i++){
  const weight=Math.max(0,Math.min(1,count-i)),v=psiZeroVector(x,heights[i]);
  re+=2*root*v[0]*weight;im+=2*root*v[1]*weight;points.push([re,im]);
 }
 return {start,points,endpoint:re,tip:[re,im]};
}
/** Where the tip sits for one x, without building the chain. Hot path: the
 * trace calls it once per sample, so it allocates nothing per zero. */
export function psiTip(x:number,heights:readonly number[],count:number):Complex{
 if(!(x>=2)||!Number.isFinite(x))return [NaN,NaN];
 const root=Math.sqrt(x),n=Math.min(Math.ceil(count),heights.length),lx=Math.log(x);
 let re=psiTrend(x),im=0;
 for(let i=0;i<n;i++){
  const g=heights[i],weight=Math.max(0,Math.min(1,count-i));
  const a=g*lx,cs=Math.cos(a),sn=Math.sin(a),den=.25+g*g,k=2*root*weight;
  re-=k*(.5*cs+g*sn)/den;im-=k*(.5*sn-g*cs)/den;
 }
 return [re,im];
}
/** The locus the tip sweeps as x runs across a window: the high-precision path
 * of psi. Its shadow on the real axis is the reconstruction itself, so the
 * steps emerge from the zeros instead of being counted out by hand. */
export function psiTrace(heights:readonly number[],count:number,from:number,to:number,steps:number):Complex[]{
 const out:Complex[]=[];
 if(!(to>from)||steps<1)return out;
 for(let k=0;k<=steps;k++){
  const x=from+(to-from)*k/steps;
  if(x<2)continue;
  out.push(psiTip(x,heights,count));
 }
 return out;
}
