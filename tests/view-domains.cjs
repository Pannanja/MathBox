const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path');
// The construction catalogue is collapsed by default in the redesigned shell;
// open it before choosing so tests exercise the same handler as a visitor.
const pickView=(page,mode)=>page.evaluate(m=>{const c=document.getElementById('constructionChooser');if(c)c.open=true;document.querySelector('[data-view="'+m+'"]').click();},mode);
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('orrery-of-eratosthenes.html').replaceAll('\\','/'));
  // Both workspaces open on demand; browser checks show clock and explorer together.
  await page.evaluate(()=>document.querySelector('#workspaceSwitch [data-layout=both]')?.click());await page.waitForTimeout(150);
  // These checks hold s still while the clock moves, so they switch off the
  // default drive that turns tau with the beat, through its own control.
  await page.evaluate(()=>{const c=document.getElementById('tauDriveOn');c.checked=false;c.dispatchEvent(new Event('input',{bubbles:true}));});
 await page.evaluate(()=>{tune(.5,30);advanceClock(12,performance.now());});
 const state=await page.evaluate(()=>[sigmaAim,tauAim,t]);
 for(const mode of ['euler','log','xiarm','term','finite','infinite','theta']){
  await pickView(page,mode);await page.waitForTimeout(100);
  assert.deepEqual(await page.evaluate(()=>[sigmaAim,tauAim,t]),state);
  await page.locator('#riemannHelp').click();assert.ok((await page.locator('#viewHelp').textContent()).length>400);
  assert.match(await page.locator('#viewHelp').textContent(),/Try it/);
  assert.ok(await page.locator('#viewHelp .view-equation').isVisible());
  await page.locator('#viewHelp button[aria-label="Close view explanation"]').click();
 }
 await page.waitForFunction(()=>paperData?.mode==='theta'&&paperData.valid&&paperData.tau===30);
 assert.match(await page.locator('#tauDomain').textContent(),/35/);
 assert.equal(await page.locator('#tauExact').evaluate(e=>e.classList.contains('outside-domain')),false);
 await page.locator('#riemannHelp').click();await page.locator('#useViewRange').click();
 assert.deepEqual(await page.evaluate(()=>tauWindow()),[-35,35]);assert.deepEqual(await page.evaluate(()=>[sigmaAim,tauAim,t]),state);
 await page.screenshot({path:'.review/view-help-theta.png'});
 await page.locator('#viewHelp button[aria-label="Close view explanation"]').click();
 await pickView(page,'xiarm');await page.waitForTimeout(100);
 assert.match(await page.locator('#tauDomain').textContent(),/15.*outside/);
 assert.equal(await page.locator('#tauExact').evaluate(e=>e.classList.contains('outside-domain')),true);
 assert.match(await page.locator('#tauScrub').evaluate(e=>e.style.background),/repeating-linear-gradient/);
 await pickView(page,'infinite');await page.waitForTimeout(100);
 assert.match(await page.locator('#sigmaDomain').textContent(),/diverges/);
 assert.equal(await page.locator('#sigmaExact').evaluate(e=>e.classList.contains('outside-domain')),true);
 await page.screenshot({path:'.review/view-domain-invalid.png'});
 await pickView(page,'log');await page.waitForTimeout(100);
 assert.match(await page.locator('#sigmaDomain').textContent(),/finite only/);
 assert.equal(await page.locator('#sigmaExact').evaluate(e=>e.classList.contains('outside-domain')),false);
 await pickView(page,'theta');await page.evaluate(()=>tune(.5,36));await page.waitForFunction(()=>paperData?.key===paperKey&&!paperData.valid);
 assert.match(await page.locator('#productDetails').textContent(),/35/);
 await page.evaluate(()=>tune(.5,30));await page.waitForFunction(()=>paperData?.key===paperKey&&paperData.valid);
 for(const [width,height] of [[390,844],[568,320],[320,568]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(150);
  assert.ok(await page.locator('#productBubble').evaluate(e=>e.scrollHeight<=e.clientHeight+1));
  await page.locator('#riemannHelp').click();assert.ok(await page.locator('#viewHelp').isVisible());
  assert.ok(await page.locator('#riemannInspector').evaluate(e=>{const b=e.getBoundingClientRect();return b.left>=0&&b.right<=innerWidth&&b.top>=0&&b.bottom<=innerHeight;}));
  await page.locator('#viewHelp button[aria-label="Close view explanation"]').click();
  await page.screenshot({path:'.review/view-domains-'+width+'.png'});
 }
 assert.deepEqual(errors,[]);console.log('View explanations, honest domain tracks, range fitting without retuning, theta extension/recovery and responsive layouts passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
