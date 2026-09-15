const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error(e.message)});
 await page.goto('file:///'+path.resolve('orrery-of-eratosthenes.html').replaceAll('\\','/'));
 await page.waitForFunction(()=>typeof paperMode!=='undefined');
 await page.evaluate(()=>{tune(2,1);advanceClock(12,performance.now());});
 const state=await page.evaluate(()=>[sigmaAim,tauAim,t]);
 for(const mode of ['term','finite','infinite','theta']){
  await page.locator('[data-view="'+mode+'"]').click();
  assert.deepEqual(await page.evaluate(()=>[sigmaAim,tauAim,t]),state);
  await page.waitForFunction(m=>paperData?.mode===m&&paperData.key===paperKey&&paperData.valid,mode);
  await page.waitForFunction(()=>Math.abs(SIGMA-paperData.sigma)<1e-4);
  await page.locator('#fitLocus').click();await page.waitForTimeout(600);
  const result=await page.evaluate(()=>({mode:paperMode,gap:abs(sub(paperData.endpoint,paperTarget(paperMode,paperData.sigma,paperData.tau,paperData.n))),progress:paperProgress,extent:10**graphLogExtent,centre:graphCentre}));
  assert.ok(result.gap<1e-8);assert.ok(result.progress>0);console.log(result);
 }
 // Rejected infinite integral must not leave a finite path or target behind.
 await page.evaluate(()=>tune(.5,1));await page.locator('[data-view="infinite"]').click();
 await page.waitForFunction(()=>paperData?.key===paperKey&&!paperData.valid);
 assert.match(await page.locator('#liveCurveState').textContent(),/diverges/);
 await page.locator('[data-view="finite"]').click();await page.waitForFunction(()=>paperData?.mode==='finite'&&paperData.valid);
 await page.locator('#fitLocus').click();await page.waitForTimeout(500);
 await page.screenshot({path:'.review/riemann-finite.png'});
 // The target can be tiny while the integral path has large cancelling loops.
 // Explicit zooming to the endpoint must not hit the old 1e-5 floor.
 await page.evaluate(()=>tune(2,15));await page.locator('[data-view="term"]').click();await page.waitForFunction(()=>paperData?.mode==='term'&&paperData.tau===15);
 await page.locator('#fitLocus').click();await page.waitForTimeout(500);
 await page.evaluate(()=>setGraphView(paperData.endpoint,1e-9));assert.ok(await page.evaluate(()=>10**+$('productRange').value<1e-5));
 // Independently accumulated xi is real on the critical line, including near its first zero.
 await page.evaluate(()=>tune(.5,14.134725141734695));await page.locator('[data-view="theta"]').click();
 await page.waitForFunction(()=>paperData?.mode==='theta'&&paperData.sigma===.5&&paperData.tau===tauAim);
 assert.ok(await page.evaluate(()=>abs(paperData.endpoint)<1e-12));
 await page.locator('#fitLocus').click();await page.waitForTimeout(500);
 await page.locator('#exploreMore').click();await page.locator('#paperScrub').fill('0.5');
 await page.locator('#exploreOptions button[aria-label="Close exploration options"]').click();await page.waitForTimeout(700);
 assert.ok(await page.evaluate(()=>Math.abs(paperProgress-.5)<.002));
 const beforeTrace=await page.evaluate(()=>paperProgress);await page.locator('#paperTrace').click();
 assert.ok(await page.evaluate(()=>paperProgress) > beforeTrace*.5); // eased rewind, no snap
 await page.waitForTimeout(700);assert.ok(await page.evaluate(()=>paperProgress)<.1);
 await page.evaluate(()=>{paperPlaying=false;paperRewinding=false;paperProgressAim=.5;});await page.waitForTimeout(600);
 await page.screenshot({path:'.review/riemann-theta.png'});
 for(const [w,h] of [[1440,1000],[1024,768],[390,844],[568,320],[320,568]]){
  await page.setViewportSize({width:w,height:h});await page.waitForTimeout(160);await page.screenshot({path:'.review/riemann-'+w+'.png'});
  const box=await page.locator('#productBubble').evaluate(e=>({h:e.clientHeight,s:e.scrollHeight}));console.log('layout',w,h,box);assert.ok(box.s<=box.h+1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.evaluate(()=>tune(.5,36));await page.waitForFunction(()=>paperData?.key===paperKey&&!paperData.valid);assert.match(await page.locator('#liveCurveState').textContent(),/35/);
 await page.locator('[data-view="euler"]').click();await page.waitForFunction(()=>locusData?.done&&locusData.sigma===.5);await page.waitForTimeout(100);
 assert.doesNotMatch(await page.locator('#liveCurveState').textContent(),/integral/i);assert.doesNotMatch(await page.locator('#locusStatus').textContent(),/x =/);
 assert.deepEqual(errors,[]);console.log('Riemann views passed');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
