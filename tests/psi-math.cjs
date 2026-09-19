const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('.build/clock-math.js','utf8'),context);
const {psiBirths,countedPsi,passedZeros,psiArm,psiApproximation,psiEpicycles,psiTip,psiTrace}=context.ClockMath;
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

// The epicyclic chain is what the page draws. It wanders in the plane, so its
// tip is NOT the answer -- only the shadow on the real axis is. These pin the
// invariant that makes drawing the drop honest.
for(const x of [2,4,8.5,60.5,500,2000])for(let count=0;count<=heights.length;count++){
 const chain=psiEpicycles(x,heights,count);
 near(chain.endpoint,psiApproximation(x,heights,count));
 near(chain.tip[0],psiApproximation(x,heights,count));
 assert.equal(chain.points.length,count+1,'one anchor plus one leg per zero pair');
 near(chain.points[0][0],x-Math.log(2*Math.PI)-.5*Math.log(1-x**-2));
 assert.equal(chain.points[0][1],0,'the chain is rooted on the axis');
 const tip=psiTip(x,heights,count);near(tip[0],chain.tip[0]);near(tip[1],chain.tip[1]);
}
// It must genuinely leave the axis, otherwise it is the collapsed chain again.
// The tip can drift back near the axis by cancellation, so the invariant is
// about the path, not its end: some leg must stand off the axis.
const spread=c=>Math.max(...psiEpicycles(60.5,heights,c).points.map(q=>Math.abs(q[1])));
assert.ok(spread(4)>.25,'the chain leaves the counting axis');
assert.equal(spread(0),0,'with no zeros there is nothing to lift');
assert.ok(Math.abs(psiArm(60.5,heights,4).points.at(-1)[1])<1e-12,'the paired form still closes, and is not what is drawn');
const span=psiTrace(heights,4,59.8,60.5,40);
assert.equal(span.length,41);
near(span.at(-1)[0],psiTip(60.5,heights,4)[0]);near(span.at(-1)[1],psiTip(60.5,heights,4)[1]);
assert.equal(psiTrace(heights,4,60.5,59.8,40).length,0,'a backwards window draws nothing');
// The ratchet only marks the axis while the reconstruction rises, so the gaps
// in its track have to be real retreats rather than a drawing artefact. They
// are bought with zeros: a coarse sum climbs straight through a birth, and only
// a sum with enough heights rings hard enough to slip backwards.
const known=[14.134725141734694,21.022039638771555,25.010857580145688,30.424876125859513,
 32.93506158773919,37.58617815882567,40.918719012147495,43.32707328091500,48.00515088116716,
 49.77383247767230,52.97032147771446,56.44624769706339,59.34704400260235,60.83177852460981,
 65.11254404808161,67.07981052949417,69.54640171117398,72.06715767448191,75.70469069908393,
 77.14484006887481];
const rise=(list,count,from,to)=>{const w=psiTrace(list,count,from,to,160);let up=0,down=0;
 for(let i=1;i<w.length;i++)(w[i][0]>w[i-1][0]?up++:down++);return {up,down};};
// The ringing wavelength is 2*pi*x/T. Across a 0.8 window at x = 59 even
// twenty heights (T = 77) ring every 4.8 units, far wider than the window, so
// the pawl cannot slip yet. Slipping is bought with hundreds of zeros, and the
// live page's 649 are covered in tests/psi-magnifier.cjs.
assert.equal(rise(heights,4,58.6,59.4).down,0,'four zeros climb straight through a birth');
assert.equal(rise(known,known.length,58.6,59.4).down,0,'twenty zeros still cannot slip');
assert.ok(rise(known,known.length,58.6,59.4).up>0,'but they do advance');
near(psiEpicycles(59.2,known,known.length).endpoint,psiApproximation(59.2,known,known.length));
for(const bad of [1,1.99,NaN,Infinity]){assert.ok(Number.isNaN(psiEpicycles(bad,heights,4).endpoint));assert.ok(Number.isNaN(psiTip(bad,heights,4)[0]));}
console.log('Psi: LCM identity, log-prime jumps, paired closure, epicyclic shadow and trace endpoints passed.');
