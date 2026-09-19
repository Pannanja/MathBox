const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('.build/clock-math.js','utf8'),context);
const {psiBirths,countedPsi,passedZeros,psiArm,psiApproximation}=context.ClockMath;
const near=(a,b,tol=1e-11)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const births=psiBirths(128),plain=x=>JSON.parse(JSON.stringify(x));
assert.deepEqual(plain(births.slice(0,8).map(e=>[e.q,e.p,e.k])),[[2,2,1],[3,3,1],[4,2,2],[5,5,1],[7,7,1],[8,2,3],[9,3,2],[11,11,1]]);
// Independent identity: psi(n) = log lcm(1,...,n).
const gcd=(a,b)=>b?gcd(b,a%b):a;let lcm=1n;
for(let n=1;n<=128;n++){lcm=lcm/gcd(lcm,BigInt(n))*BigInt(n);near(countedPsi(births,n),Math.log(Number(lcm)));}
for(const e of births){near(countedPsi(births,e.q)-countedPsi(births,e.q-1e-7),Math.log(e.p));near(countedPsi(births,e.q+.99),e.hi);}
const heights=[14.134725141734695,21.022039638771555,25.01085758014569,30.424876125859513];
assert.equal(passedZeros(heights,14),0);assert.equal(passedZeros(heights,heights[0]),1);assert.equal(passedZeros(heights,-heights[2]),3);assert.equal(passedZeros(heights,1000),4);
for(const x of [2,4,8.5,60.5,500,2000])for(let count=0;count<=heights.length;count++){
 // Direct real form of the conjugate pair, independent of the drawing helper.
 let expected=x-Math.log(2*Math.PI)-.5*Math.log(1-x**-2);
 for(const g of heights.slice(0,count))expected-=2*Math.sqrt(x)*(.5*Math.cos(g*Math.log(x))+g*Math.sin(g*Math.log(x)))/(.25+g*g);
 near(psiApproximation(x,heights,count),expected);const arm=psiArm(x,heights,count);near(arm.endpoint,expected);
 assert.equal(arm.points.length,2*count+1);for(let j=0;j<arm.points.length;j+=2)assert.equal(arm.points[j][1],0,'each conjugate pair closes on the real axis');
}
assert.ok(Number.isNaN(psiArm(1,heights,4).endpoint));assert.ok(Number.isNaN(psiApproximation(1,heights)));
assert.ok(Math.abs(psiArm(60.5,heights,4).endpoint-countedPsi(births,60.5))>.1,'retain truncation error');
console.log('Psi: independent LCM identity, log-prime jumps, conjugate pairs and cutoff crossings passed.');
