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
