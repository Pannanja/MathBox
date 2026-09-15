const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('.build/clock-math.js','utf8'),context);
const {logEuler,primePowersThrough,paneAt,riemannIntegrate}=context.ClockMath;
const {logArmAt,layoutArm,foldArm}=context.ClockMath;
const plain=x=>JSON.parse(JSON.stringify(x)),near=(a,b,e=1e-12)=>assert.ok(Math.hypot(a[0]-b[0],a[1]-b[1])<e,`${a} != ${b}`);
const sources=primePowersThrough(12);
assert.deepEqual(plain(sources.map(s=>s.q)),[2,3,4,5,7,8,9,11]);
for(const [q,p,k] of [[4,2,2],[8,2,3],[9,3,2]])assert.deepEqual(plain(sources.find(s=>s.q===q)),{kind:'prime-power',q,p,k});
assert.deepEqual(plain(sources.filter(s=>12%s.q===0).map(s=>s.p)),[2,3,2]);
const pane=sources.find(s=>s.q===4),times=[3.999,4,4.5,5,6,12,4.5,4,3.999];
const snapshots=times.map(time=>paneAt(pane,time));
assert.equal(snapshots[0].born,false);assert.equal(snapshots[1].born,true);
assert.equal(snapshots[1].growth,0);assert.equal(snapshots[2].growth,.5);assert.equal(snapshots[3].growth,1);
assert.equal(snapshots[1].sumTermCompleteAt,4);assert.equal(snapshots[1].growthCompleteAt,5);
assert.deepEqual(plain(snapshots[2]),plain(snapshots[6]));assert.deepEqual(plain(snapshots[0]),plain(snapshots[8]));
near([snapshots[4].radiusInClockUnits,snapshots[4].leadingAngle],[2/3,Math.PI]);
const fixtures=JSON.parse(fs.readFileSync('reference/log-euler.json','utf8'));
let maximum=0;
for(const f of fixtures){
 const result=logEuler(f,f.limit);near(result.endpoint,f.endpoint);
 maximum=Math.max(maximum,Math.hypot(result.endpoint[0]-f.endpoint[0],result.endpoint[1]-f.endpoint[1]));
 assert.equal(result.convergentDomain,f.sigma>1);
 const mirror=logEuler({sigma:f.sigma,tau:-f.tau},f.limit);near(mirror.endpoint,[result.endpoint[0],-result.endpoint[1]]);
 for(const c of result.contributions){assert.equal(c.ledgerWeight,1/c.source.k);assert.equal(c.id,`prime-power:${c.source.q}`);}
}
assert.ok(Math.abs(logEuler({sigma:2,tau:0},12).contributions.reduce((a,c)=>a+c.ledgerWeight,0)-19/3)<1e-14);
const f=fixtures.find(f=>f.limit===12&&f.sigma===2&&f.tau===0);
assert.ok(f.logProduct[0]>f.endpoint[0], 'Finite prime-power cutoff must not be called the finite Euler product');
assert.throws(()=>logEuler({sigma:NaN,tau:0},12));assert.throws(()=>logEuler({sigma:-1000,tau:0},12));
assert.throws(()=>primePowersThrough(4.5));assert.throws(()=>paneAt(pane,0));
for(const job of [{mode:'term',sigma:.5,tau:NaN,n:1},{mode:'term',sigma:.5,tau:1,n:0},{mode:'bad',sigma:2,tau:0,n:1}])assert.equal(riemannIntegrate(job).valid,false);
console.log('Core snapshots, prime-power identities and independent log-Euler fixtures passed.',{cases:fixtures.length,maxError:maximum});

const input={sigma:2,tau:1},before=logEuler(input,3).endpoint,term=logEuler(input,4).contributions.find(c=>c.source.q===4).value;
near(logArmAt(input,4).endpoint,before);
near(logArmAt(input,4.5).endpoint,[before[0]+term[0]/2,before[1]+term[1]/2]);
near(logArmAt(input,5).endpoint,[before[0]+term[0],before[1]+term[1]]);
near(logArmAt(input,6).endpoint,logArmAt(input,6.9).endpoint);
const reverse=[4,4.5,5,12,4.5,4].map(t=>logArmAt(input,t));
assert.deepEqual(plain(reverse[1]),plain(reverse[4]));assert.deepEqual(plain(reverse[0]),plain(reverse[5]));
for(const count of [1,12,500,2000]){
 const model=logArmAt({sigma:.5,tau:14},count+.5),items=model.terms.map(t=>({id:t.id,value:t.value,meta:t})),segments=layoutArm(items);
 const folded=foldArm(segments,new Set(items.filter(t=>t.meta.source.p===2).map(t=>t.id)));
 near(segments.at(-1)?.to||[0,0],model.endpoint);near(folded.at(-1)?.to||[0,0],model.endpoint);
 assert.equal(folded.reduce((n,s)=>n+s.items.length,0),items.length);
 for(let i=1;i<folded.length;i++)near(folded[i-1].to,folded[i].from);
}
console.log('Pane-grown arm, rewind and folded endpoint checks passed.');
