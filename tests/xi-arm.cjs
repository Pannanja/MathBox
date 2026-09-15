const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('.build/clock-math.js','utf8'),context);
const {xiArm,layoutArm,foldArm}=context.ClockMath;
const cases=JSON.parse(fs.readFileSync('.review/riemann-reference.json','utf8')).filter(c=>c.mode==='theta');
let worst=0;
for(const c of cases){
 const result=xiArm(c),error=Math.hypot(result.endpoint[0]-c.target[0],result.endpoint[1]-c.target[1]);
 worst=Math.max(worst,error);assert.ok(error<1e-10,JSON.stringify({c,error,result}));assert.ok(error<=result.errorEstimate,JSON.stringify({c,error,estimate:result.errorEstimate}));
 const mirror=xiArm({sigma:c.sigma,tau:-c.tau});assert.ok(Math.hypot(mirror.endpoint[0]-result.endpoint[0],mirror.endpoint[1]+result.endpoint[1])<1e-14);
 assert.ok(result.terms.every(t=>t.magnitude>=0&&Number.isFinite(t.magnitude)));
 if(c.sigma===.5)for(let i=0;i<result.terms.length;i+=2){assert.equal(result.terms[i].magnitude,result.terms[i+1].magnitude);assert.equal(result.terms[i].value[1]+result.terms[i+1].value[1],0);}
 const chain=layoutArm(result.terms.map(t=>({id:t.id,value:t.value,meta:t}))),folded=foldArm(chain,new Set(result.terms.slice(20,22).map(t=>t.id)));
 assert.equal(folded.at(-1).to[0],result.endpoint[0]);assert.equal(folded.at(-1).to[1],result.endpoint[1]);
}
const a=xiArm({sigma:.3,tau:3}),b=xiArm({sigma:.7,tau:-3});assert.ok(Math.hypot(a.endpoint[0]-b.endpoint[0],a.endpoint[1]-b.endpoint[1])<1e-14);
assert.throws(()=>xiArm({sigma:.5,tau:16}));assert.throws(()=>xiArm({sigma:-2,tau:1}));
console.log('Xi paired-vector fixtures, symmetry, cancellation estimates and folding passed.',{cases:cases.length,maxError:worst});
