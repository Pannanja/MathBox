const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('.build/clock-math.js','utf8'),context);const scope=context.ClockMath;
const cases=JSON.parse(fs.readFileSync('.review/riemann-reference.json','utf8'));
let maxError=0,maxGammaRelative=0,maxMs=0,maxEstimated=0;
for(const job of cases){
 const begin=performance.now(),r=scope.riemannIntegrate(job),ms=performance.now()-begin;
 assert.ok(r.valid);const err=Math.hypot(...r.endpoint.map((x,i)=>x-job.target[i]));
 const g=scope.riemannGamma(job.sigma,job.tau),gerr=Math.hypot(...g.map((x,i)=>x-job.gamma[i]))/Math.hypot(...job.gamma);
 const tolerance=r.omittedBound+r.estimatedQuadratureError+5e-13*Math.max(1,r.length);
 assert.ok(err<=tolerance,JSON.stringify({job,r:{endpoint:r.endpoint,omitted:r.omittedBound,estimated:r.estimatedQuadratureError},err,tolerance}));
 assert.ok(gerr<2e-12,JSON.stringify({job,g,gerr}));
 if(r.omittedBound<1e-7)maxError=Math.max(maxError,err);
 maxGammaRelative=Math.max(maxGammaRelative,gerr);maxMs=Math.max(maxMs,ms);maxEstimated=Math.max(maxEstimated,r.estimatedQuadratureError);
 assert.ok([...r.rows].every(Number.isFinite));
 for(let i=4;i<r.rows.length;i+=4){assert.ok(r.rows[i]>=r.rows[i-4]);assert.ok(r.rows[i+3]>=r.rows[i-1]);}
 if(job.mode==='theta'&&job.sigma===.5)assert.ok(Math.abs(r.endpoint[1])<1e-14);
}
const a=scope.riemannIntegrate({mode:'theta',sigma:.3,tau:3,n:1}),b=scope.riemannIntegrate({mode:'theta',sigma:.7,tau:-3,n:1});assert.ok(Math.hypot(...a.endpoint.map((x,i)=>x-b.endpoint[i]))<1e-14);
assert.equal(scope.riemannIntegrate({mode:'infinite',sigma:.5,tau:1,n:500}).valid,false);
assert.equal(scope.riemannIntegrate({mode:'infinite',sigma:1,tau:0,n:1}).valid,false);
assert.equal(scope.riemannIntegrate({mode:'finite',sigma:.5,tau:16,n:500}).valid,false);
assert.ok(scope.riemannIntegrate({mode:'infinite',sigma:1.01,tau:1,n:1}).omittedBound>1);
console.log({cases:cases.length,maxResolvedEndpointError:maxError,maxGammaRelative,maxMs,maxEstimated});
