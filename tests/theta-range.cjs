const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('.build/clock-math.js','utf8'),context);
const cases=JSON.parse(fs.readFileSync('reference/theta-range.json','utf8'));let maxError=0,maxMs=0;
for(const c of cases){const start=performance.now(),r=context.ClockMath.riemannIntegrate(c);maxMs=Math.max(maxMs,performance.now()-start);assert.ok(r.valid);const error=Math.hypot(r.endpoint[0]-c.target[0],r.endpoint[1]-c.target[1]);maxError=Math.max(maxError,error);assert.ok(error<1e-12,JSON.stringify({c,error}));assert.ok(error<=r.estimatedQuadratureError+r.estimatedRoundoffError+r.omittedBound);assert.ok([...r.rows].every(Number.isFinite));}
assert.equal(context.ClockMath.riemannIntegrate({mode:'theta',sigma:.5,tau:36,n:1}).valid,false);
assert.equal(context.ClockMath.riemannIntegrate({mode:'finite',sigma:.5,tau:16,n:1}).valid,false);
console.log('Extended theta window passed',{cases:cases.length,maxError,maxMs});
