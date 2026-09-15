const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('orrery-of-eratosthenes.html').replaceAll('\\','/'));
 await page.evaluate(()=>{tune(.5,30);advanceClock(12,performance.now());});
 const state=await page.evaluate(()=>[sigmaAim,tauAim,t]);
 for(const mode of ['euler','log','xiarm','term','finite','infinite','theta']){
  await page.locator('[data-view="'+mode+'"]').click();await page.waitForTimeout(100);
  assert.deepEqual(await page.evaluate(()=>[sigmaAim,tauAim,t]),state);
  await page.locator('#explainView').click();assert.ok((await page.locator('#viewHelp').textContent()).length>400);
  assert.match(await page.locator('#viewHelp').textContent(),/Try it/);
  assert.ok(await page.locator('#viewHelp .view-equation').isVisible());
  await page.locator('#viewHelp button[aria-label="Close view explanation"]').click();
 }
 await page.waitForFunction(()=>paperData?.mode==='theta'&&paperData.valid&&paperData.tau===30);
 assert.match(await page.locator('#tauDomain').textContent(),/35/);
 assert.equal(await page.locator('#tauExact').evaluate(e=>e.classList.contains('outside-domain')),false);
 await page.locator('#explainView').click();await page.locator('#useViewRange').click();
 assert.deepEqual(await page.evaluate(()=>tauWindow()),[-35,35]);assert.deepEqual(await page.evaluate(()=>[sigmaAim,tauAim,t]),state);
 await page.screenshot({path:'.review/view-help-theta.png'});
 await page.locator('#viewHelp button[aria-label="Close view explanation"]').click();
 await page.locator('[data-view="xiarm"]').click();await page.waitForTimeout(100);
 assert.match(await page.locator('#tauDomain').textContent(),/15.*outside/);
 assert.equal(await page.locator('#tauExact').evaluate(e=>e.classList.contains('outside-domain')),true);
 assert.match(await page.locator('#tauScrub').evaluate(e=>e.style.background),/repeating-linear-gradient/);
 await page.locator('[data-view="infinite"]').click();await page.waitForTimeout(100);
 assert.match(await page.locator('#sigmaDomain').textContent(),/diverges/);
 assert.equal(await page.locator('#sigmaExact').evaluate(e=>e.classList.contains('outside-domain')),true);
 await page.screenshot({path:'.review/view-domain-invalid.png'});
 await page.locator('[data-view="log"]').click();await page.waitForTimeout(100);
 assert.match(await page.locator('#sigmaDomain').textContent(),/finite only/);
 assert.equal(await page.locator('#sigmaExact').evaluate(e=>e.classList.contains('outside-domain')),false);
 await page.locator('[data-view="theta"]').click();await page.evaluate(()=>tune(.5,36));await page.waitForFunction(()=>paperData?.key===paperKey&&!paperData.valid);
 assert.match(await page.locator('#productDetails').textContent(),/35/);
 await page.evaluate(()=>tune(.5,30));await page.waitForFunction(()=>paperData?.key===paperKey&&paperData.valid);
 for(const [width,height] of [[390,844],[568,320],[320,568]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(150);
  assert.ok(await page.locator('#productBubble').evaluate(e=>e.scrollHeight<=e.clientHeight+1));
  await page.locator('#explainView').click();assert.ok(await page.locator('#viewHelp').isVisible());
  assert.ok(await page.locator('#viewHelp').evaluate(e=>{const b=e.getBoundingClientRect();return b.left>=0&&b.right<=innerWidth&&b.top>=0&&b.bottom<=innerHeight;}));
  await page.locator('#viewHelp button[aria-label="Close view explanation"]').click();
  await page.screenshot({path:'.review/view-domains-'+width+'.png'});
 }
 assert.deepEqual(errors,[]);console.log('View explanations, honest domain tracks, range fitting without retuning, theta extension/recovery and responsive layouts passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
