const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('orrery-of-eratosthenes.html').replaceAll('\\','/'));
 await page.evaluate(()=>{tune(.5,8);advanceClock(30,performance.now());});
 const state=await page.evaluate(()=>[t,sigmaAim,tauAim]);await page.locator('[data-view="xiarm"]').click();
 assert.deepEqual(await page.evaluate(()=>[t,sigmaAim,tauAim]),state);
 await page.waitForFunction(()=>Math.abs(SIGMA-.5)<1e-12&&Math.abs(TAUV-8)<1e-12);await page.locator('#fitLocus').click();await page.waitForTimeout(700);
 assert.equal(await page.evaluate(()=>paperWorker),null);
 assert.ok(await page.evaluate(()=>Math.abs(xiArmReadout.model.endpoint[1])<1e-12));
 assert.ok(await page.evaluate(()=>Math.hypot(...sub(xiArmReadout.tip,xiArmReadout.model.endpoint))<1e-12));
 await page.screenshot({path:'.review/xi-arm-critical.png'});
 // Use an actual visible vector, away from shared graph controls/input marker.
 const point=await page.evaluate(()=>{const h=xiArmScene.hits.find(h=>h.segment.items.length===1&&h.segment.items[0].meta.source.index===xiArmScene.activeIndex),b=graphPlotRect(plane);return {x:b.left+(h.from[0]+.65*(h.to[0]-h.from[0]))*b.width/600,y:b.top+(h.from[1]+.65*(h.to[1]-h.from[1]))*b.height/300,index:h.segment.items[0].meta.source.index};});
 await page.mouse.move(point.x,point.y);await page.waitForTimeout(100);
 assert.equal(await page.evaluate(()=>xiArmScene.activeIndex),point.index);
 await page.mouse.click(point.x,point.y);await page.mouse.move(20,20);await page.waitForTimeout(100);
 assert.equal(await page.evaluate(()=>xiArmScene.pinned),point.index);
 // Input changes update geometry; clock navigation leaves the integral intact.
 await page.evaluate(()=>tune(1.2,8));await page.waitForFunction(()=>Math.abs(SIGMA-1.2)<1e-12);
 assert.ok(await page.evaluate(()=>{const [a,b]=xiArmReadout.active;return Math.abs(a.magnitude/b.magnitude-Math.exp(2*(SIGMA-.5)*a.source.u))<1e-12;}));
 const before=await page.evaluate(()=>xiArmReadout.model.endpoint);
 await page.locator('#stepBeat').click();await page.waitForFunction(()=>t===31);
 assert.ok(await page.evaluate(before=>Math.hypot(...sub(xiArmReadout.model.endpoint,before))<1e-12,before));
 await page.locator('#fitLocus').click();await page.waitForTimeout(600);await page.screenshot({path:'.review/xi-arm-offline.png'});
 await page.locator('#paperTrace').click();await page.waitForTimeout(180);assert.ok(await page.evaluate(()=>paperProgress)<.5);
 assert.equal(await page.evaluate(()=>t),31);
 await page.evaluate(()=>{paperPlaying=false;paperRewinding=false;paperProgress=paperProgressAim=1;tune(.5,14.134725141734693);});
 await page.waitForFunction(()=>Math.abs(SIGMA-.5)<1e-12&&Math.abs(TAUV-14.134725141734693)<1e-12);
 assert.ok(await page.evaluate(()=>Math.hypot(...xiArmReadout.model.endpoint)<1e-12));
 await page.locator('#fitLocus').click();await page.waitForTimeout(600);await page.screenshot({path:'.review/xi-arm-zero.png'});
 // All folded groups contain complete pairs, including after expansion.
 assert.ok(await page.evaluate(()=>xiArmScene.hits.every(h=>h.segment.items.length===1||h.segment.items.length%2===0)));
 assert.equal(await page.evaluate(()=>xiArmReadout.foldedPairs),0);await page.locator('#exploreMore').click();await page.locator('#foldArmTerms').check();await page.evaluate(()=>$('exploreOptions').hidePopover());await page.waitForTimeout(100);const folded=await page.evaluate(()=>xiArmReadout.foldedPairs);
 const group=await page.evaluate(()=>{const h=xiArmScene.hits.find(h=>h.segment.items.length>4&&Math.hypot(h.to[0]-h.from[0],h.to[1]-h.from[1])>20),b=graphPlotRect(plane);return {x:b.left+(h.from[0]+h.to[0])/2*b.width/600,y:b.top+(h.from[1]+h.to[1])/2*b.height/300};});
 await page.mouse.click(group.x,group.y);await page.waitForTimeout(100);
 assert.ok(await page.evaluate(()=>xiArmReadout.foldedPairs)<folded);
 assert.ok(await page.evaluate(()=>Math.hypot(...sub(xiArmReadout.tip,xiArmReadout.model.endpoint))<1e-12));
 for(const [width,height] of [[390,844],[568,320],[320,568]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(150);await page.screenshot({path:'.review/xi-arm-'+width+'.png'});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
  assert.ok(await page.locator('#productBubble').evaluate(e=>e.scrollHeight<=e.clientHeight+1));
 }
 await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>tune(.5,16));await page.waitForFunction(()=>TAUV>15.01);
 assert.equal(await page.evaluate(()=>xiArmReadout),null);assert.match(await page.locator('#locusStatus').textContent(),/Outside/);
 await page.locator('#fitLocus').click();
 await page.evaluate(()=>tune(.5,8));await page.waitForFunction(()=>TAUV<15&&xiArmReadout!==null);
 await page.locator('[data-view="theta"]').click();await page.waitForFunction(()=>paperData?.valid&&paperData.mode==='theta');
 await page.locator('[data-view="euler"]').click();assert.doesNotMatch(await page.locator('#liveCurveState').textContent(),/pairs folded/);
 assert.deepEqual(errors,[]);console.log('Xi scene: symmetry, pinning, input response, clock independence, first zero, folding, replay, range and responsive layouts passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
