const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('orrery-of-eratosthenes.html').replaceAll('\\','/'));
 await page.evaluate(()=>{
  tune(.5,1);advanceClock(9.5,performance.now());setGraphView([0,0],2);
  const ctx=plane.getContext('2d'),clear=ctx.clearRect.bind(ctx),fill=ctx.fillText.bind(ctx);
  window.planeLabels=[];ctx.clearRect=(...args)=>{window.planeLabels=[];clear(...args);};
  ctx.fillText=(...args)=>{window.planeLabels.push(args[0]);fill(...args);};
 });
 await page.waitForFunction(()=>Math.abs(SIGMA-.5)<1e-10&&Math.abs(TAUV-1)<1e-10);
 assert.equal(await page.locator('#paperViews button').count(),7);
 assert.equal(await page.locator('#paperMode').count(),0);
 const original=await page.evaluate(()=>[t,sigmaAim,tauAim,...graphCentreAim,+$('productRange').value]);
 for(const mode of ['euler','log','xiarm','term','finite','infinite','theta']){
  await page.locator('[data-view="'+mode+'"]').click();await page.waitForTimeout(150);
  assert.deepEqual(await page.evaluate(()=>[t,sigmaAim,tauAim,...graphCentreAim,+$('productRange').value]),original);
  assert.equal(await page.locator('#paperViews button[aria-pressed=true]').getAttribute('data-view'),mode);
  const labels=await page.evaluate(()=>window.planeLabels);
  for(const expected of ['Re(z) →','Im(z) ↑','critical strip · input s','σ=½','σ=1','0'])assert.ok(labels.includes(expected),mode+': '+JSON.stringify(labels));
  if(mode==='log'){assert.match(await page.locator('#paperViewTitle').textContent(),/log ζ/);assert.equal(await page.evaluate(()=>logArmReadout.folded),0);}
  if(mode==='xiarm'){assert.match(await page.locator('#paperViewTitle').textContent(),/rotations.*ξ/);assert.equal(await page.evaluate(()=>xiArmReadout.foldedPairs),0);}
 }
 await page.locator('[data-view="log"]').click();await page.waitForTimeout(100);await page.screenshot({path:'.review/explorer-orientation.png'});
 // Offscreen guides must describe panning rather than pretending axes moved.
 await page.evaluate(()=>setGraphView([-4,4],.1));await page.waitForTimeout(700);
 const labels=await page.evaluate(()=>window.planeLabels);
 assert.ok(labels.includes('input critical strip off view →'));
 assert.ok(labels.includes('0 →↓ off view'));
 assert.ok(labels.includes('s →↓ off view'));
 await page.evaluate(()=>setGraphView([0,0],2));
 for(const [width,height] of [[390,844],[568,320],[320,568]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(300);
  const box=await page.locator('#productBubble').evaluate(e=>({height:e.clientHeight,scroll:e.scrollHeight}));
  assert.ok(box.scroll<=box.height+1,JSON.stringify({width,...box}));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
  for(const button of await page.locator('#paperViews button').all()){
   assert.ok(await button.isVisible());assert.ok(await button.evaluate(e=>e.scrollWidth<=e.clientWidth+1));
  }
  if(width>height){assert.ok(await page.evaluate(()=>{const a=document.querySelector('#clockApp>.south-east').getBoundingClientRect(),b=$('exploreToolbar').getBoundingClientRect();return a.bottom<=b.top||a.top>=b.bottom||a.right<=b.left||a.left>=b.right;}));}
  await page.screenshot({path:'.review/explorer-orientation-'+width+'.png'});
 }
 await page.locator('#exploreToolbar button[popovertarget="planeNotes"]').click();assert.ok(await page.locator('#planeNotes').evaluate(e=>e.querySelector('.bubble-head').getBoundingClientRect().top<e.querySelector('.coordinate-note').getBoundingClientRect().top));assert.deepEqual(errors,[]);console.log('All seven views: shared axes/strip, visible names, unchanged clock/input/ruler, full vectors, offscreen directions and responsive navigation passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
