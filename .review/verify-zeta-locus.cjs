const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('file:///'+path.resolve('orrery-of-eratosthenes.html').replaceAll('\\','/'));const refs=JSON.parse(fs.readFileSync('.review/zeta-reference.json'));const err=await page.evaluate(rows=>rows.map(([s,t,re,im])=>{const z=zeta(s,t);return {s,t,error:Math.hypot(z[0]-re,z[1]-im),scale:1+Math.hypot(re,im)};}),refs);console.log('accuracy',Math.max(...err.map(e=>e.error)),Math.max(...err.map(e=>e.error/e.scale)));assert.ok(err.every(e=>e.error/e.scale<1e-10));
await page.evaluate(()=>{tune(.5,14.134725141734695);advanceClock(50,performance.now());});await page.waitForFunction(()=>locusData?.done&&locusData?.sigma===.5,{},{timeout:30000});
for(const width of ['100','500','1000']){await page.evaluate(value=>{$('locusSpan').value=value;$('locusSpan').onchange();},width);
if(width==='1000'){
 await page.waitForFunction(()=>locusData?.b===1000&&!locusData.done);
 const first=await page.evaluate(()=>({n:locusData.data.length,head:Array.from(locusData.data.slice(0,30)),ms:locusData.ms}));console.log('first streamed data',first.n/3,'points at',first.ms,'ms');assert.ok(first.ms<1000);
 await page.waitForFunction(n=>locusData?.b===1000&&!locusData.done&&locusData.data.length>n,first.n);
 assert.deepEqual(await page.evaluate(n=>Array.from(locusData.data.slice(0,n)),first.head.length),first.head);
 assert.ok(await page.evaluate(()=>!locusCache.has(locusData.key)));
 await page.locator('#fitLocus').click();await page.waitForTimeout(100);assert.ok(await page.evaluate(()=>locusFitPending));
 await page.locator('#productGraph').dispatchEvent('wheel',{deltaY:-10});assert.equal(await page.evaluate(()=>locusFitPending),false);
 await page.waitForFunction(()=>!locusData.done&&locusRasterKey.startsWith(locusWanted+'/')&&locusRasterCount>100&&locusRasterCount<=locusData.data.length);
}
await page.waitForFunction(w=>locusData?.done&&locusData?.b===Number(w)&&locusData?.sigma===.5,width,{timeout:60000});console.log('curve',await page.evaluate(()=>({a:locusData.a,b:locusData.b,points:locusData.data.length/3,ms:locusData.ms})));}
await page.locator('#fitLocus').click();await page.waitForTimeout(700);await page.screenshot({path:'.review/zeta-thousand.png'});
console.log('cached frame intervals',await page.evaluate(()=>new Promise(resolve=>{const times=[];let last=performance.now();function next(now){times.push(now-last);last=now;if(times.length<60)requestAnimationFrame(next);else{times.sort((a,b)=>a-b);resolve({median:times[30],p95:times[57]});}}requestAnimationFrame(next); })));
const key=await page.evaluate(()=>locusData.key);await page.evaluate(()=>tune(.5,900));await page.waitForTimeout(700);assert.equal(await page.evaluate(()=>locusData.key),key);assert.equal(await page.evaluate(()=>tauAim),900);
await page.evaluate(()=>{$('locusSpan').value='100';$('locusSpan').onchange();});await page.waitForFunction(()=>locusData?.b===100);assert.match(await page.locator('#locusStatus').innerText(),/cached/);
await page.evaluate(()=>{tune(.55,14);$('tauHigh').value=1000;$('tauHigh').onchange();});await page.waitForFunction(()=>locusData?.sigma===.55&&!locusData.done);
const cancelled=await page.evaluate(()=>locusData.key);await page.evaluate(()=>{tune(.6,14);$('tauHigh').value=60;$('tauHigh').onchange();});await page.waitForFunction(()=>locusData?.sigma===.6&&locusData.done);assert.equal(await page.evaluate(key=>locusCache.has(key),cancelled),false);
await page.evaluate(()=>{tune(1,0);$('tauLow').value=-1;$('tauHigh').value=1;$('tauHigh').onchange();});await page.waitForFunction(()=>locusData?.done&&locusData?.sigma===1&&locusData?.a===-1);assert.ok(await page.evaluate(()=>Array.from(locusData.data).some(Number.isNaN)||Array.from(locusData.data).some(v=>!Number.isFinite(v))));
for(const [w,h] of [[1440,1000],[390,844],[568,320],[320,568]]){await page.setViewportSize({width:w,height:h});await page.waitForTimeout(150);const b=await page.locator('#productBubble').evaluate(e=>({h:e.clientHeight,s:e.scrollHeight}));console.log('layout',w,h,b);assert.ok(b.s<=b.h+1);}
assert.deepEqual(errors,[]);console.log('zeta passed');}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
