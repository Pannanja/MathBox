import type { Complex, IntegralJob, IntegralResult } from '../core/contracts';
import { viewDomain } from '../core/view-domains';

// Lanczos gamma for the positive real-part domain used by the interface.
export function riemannGamma(real: number,imag: number): Complex {
 if (!(real>0) || !Number.isFinite(real) || !Number.isFinite(imag)) return [NaN,NaN];
 const cmul=(a: Complex,b: Complex): Complex=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
 const cdiv=(a: Complex,b: Complex): Complex=>{const d=b[0]*b[0]+b[1]*b[1];return [(a[0]*b[0]+a[1]*b[1])/d,(a[1]*b[0]-a[0]*b[1])/d];};
 if(real<1)return cdiv(riemannGamma(real+1,imag),[real,imag]);
 const coefficients=[676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
 const z: Complex=[real-1,imag];let a: Complex=[.99999999999980993,0];
 coefficients.forEach((c,i)=>{const q=cdiv([c,0],[z[0]+i+1,z[1]]);a=[a[0]+q[0],a[1]+q[1]];});
 const w: Complex=[z[0]+7.5,z[1]],logw: Complex=[Math.log(Math.hypot(...w)),Math.atan2(w[1],w[0])],exponent=cmul([z[0]+.5,z[1]],logw);
 const magnitude=Math.sqrt(2*Math.PI)*Math.exp(exponent[0]-w[0]),angle=exponent[1]-w[1];return cmul(a,[magnitude*Math.cos(angle),magnitude*Math.sin(angle)]);
}
// Independent quadrature: targets Γ(s)n^-s, Γ(s)S_N, Γ(s)ζ and ξ are NOT used
// to construct the paths. The bundled worker imports this same pure module.
export function riemannIntegrate(job: IntegralJob): IntegralResult {
 const {mode,sigma,tau,n}=job;
 if (!['term','finite','infinite','theta'].includes(mode) || !Number.isSafeInteger(n) || n<1) return {valid:false,reason:'A valid integral mode and positive integer term count are required.'};
 const tauLimit=viewDomain(mode).tauLimit;
 if(!(sigma>0)||sigma>3||!Number.isFinite(tau)||Math.abs(tau)>tauLimit)return {valid:false,reason:`This integral view currently resolves 0 < σ ≤ 3 and |τ| ≤ ${tauLimit}. This is a numerical window, not the domain of ξ or ζ.`};
 if(mode==='infinite'&&sigma<=1)return {valid:false,reason:'This real-axis integral diverges at x = 0 when σ ≤ 1. Choose Finite sum or Symmetry to continue exploring.'};
 const cmul=(a: Complex,b: Complex): Complex=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]],polar=(r: number,a: number): Complex=>[r*Math.cos(a),r*Math.sin(a)];
 const theta=mode==='theta',upperX=theta?16:40+sigma+Math.abs(tau),rate=mode==='infinite'?sigma-1:sigma;
 const low=theta?0:-Math.min(300,Math.max(26,30/rate)),high=Math.log(upperX),logn=Math.log(n);
 const coeff: Complex=theta?[.5*(sigma*(sigma-1)-tau*tau),.5*tau*(2*sigma-1)]:[1,0];
 function integrand(u: number): Complex {
  const x=Math.exp(u);
  if(theta){let psi=0;for(let k=1;k<12;k++){const term=Math.exp(-Math.PI*k*k*x);psi+=term;if(term<1e-22)break;}const a=polar(Math.exp(sigma*u/2),tau*u/2),b=polar(Math.exp((1-sigma)*u/2),-tau*u/2);return cmul(coeff,[(a[0]+b[0])*psi,(a[1]+b[1])*psi]);}
  let r,phase=tau*u;
  if(mode==='term'){r=Math.exp(sigma*(u-logn)-x);phase=tau*(u-logn);}
  else if(mode==='finite'){
   // Σ exp(-k x) = (1-exp(-N x))/(exp(x)-1), stable at small x.
   const kernel=(-Math.expm1(-n*x))/Math.expm1(x);
   r=Math.exp(sigma*u)*kernel;
  }else r=x<1e-8?Math.exp((sigma-1)*u)*(1-x/2):Math.exp(sigma*u)/Math.expm1(x);
  return polar(r,phase);
 }
 const g8x=[.1834346424956498,.525532409916329,.7966664774136267,.9602898564975363],g8w=[.362683783378362,.3137066458778873,.2223810344533745,.1012285362903763];
 const g4x=[.3399810435848563,.8611363115940526],g4w=[.6521451548625461,.3478548451374538];
 function gauss(a: number,b: number,x: number[],w: number[]): Complex {const mid=(a+b)/2,h=(b-a)/2;let re=0,im=0;for(let j=0;j<x.length;j++){const l=integrand(mid-h*x[j]),r=integrand(mid+h*x[j]);re+=w[j]*(l[0]+r[0]);im+=w[j]*(l[1]+r[1]);}return [h*re,h*im];}
 const steps=Math.ceil((high-low)/Math.min(.10,.5/(1+Math.abs(tau)))),rows: number[]=[];
 let re=theta?.5:0,im=0,cr=0,ci=0,length=0,error=0;
 function point(u: number){rows.push(theta?Math.exp(u):mode==='term'?Math.exp(u)/n:Math.exp(u),re,im,length);}
 point(low);
 for(let j=0;j<steps;j++){const a=low+(high-low)*j/steps,b=low+(high-low)*(j+1)/steps,dz=gauss(a,b,g8x,g8w),coarse=gauss(a,b,g4x,g4w);error+=Math.hypot(dz[0]-coarse[0],dz[1]-coarse[1]);const yr=dz[0]-cr,yi=dz[1]-ci,tr=re+yr,ti=im+yi;cr=(tr-re)-yr;ci=(ti-im)-yi;re=tr;im=ti;length+=Math.hypot(...dz);point(b);}
 const tailBound=(B: number,a: number,decay=1)=>Math.exp(-decay*B)*B**a/(decay-Math.max(a,0)/B);
 let omitted;
 if(theta){omitted=Math.hypot(...coeff)*(tailBound(upperX,sigma/2-1,Math.PI)+tailBound(upperX,-(sigma+1)/2,Math.PI))/(1-Math.exp(-3*Math.PI*upperX));}
 else {const small=Math.exp(rate*low)/rate*(mode==='term'?n**(-sigma):mode==='finite'?n:1),large=tailBound(upperX,sigma-1)*(mode==='term'?n**(-sigma):1)/(mode==='term'?1:1-Math.exp(-upperX));omitted=small+large;}
 return {valid:true,mode,sigma,tau,n,rows:new Float64Array(rows),endpoint:[re,im],estimatedQuadratureError:error,estimatedRoundoffError:32*Number.EPSILON*(length+(theta?.5:0)),omittedBound:omitted,low,high,length,steps};
}
