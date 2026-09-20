// Search regression and the real-axis replacement for the old radial spiral.
const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const page=await browser.newPage({viewport:{width:1400,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('orrery-of-eratosthenes.html').replaceAll('\\','/'));
 assert.ok(await page.evaluate(()=>zeroHeights.length)>=30);
 await page.waitForFunction(()=>zeroSearchNote.includes('found to'),{timeout:30000});
 assert.equal(await page.evaluate(()=>zeroHeights.length),649,'regression count to height 1000; not a completeness proof');
 const known=[14.134725141734695,21.022039638771555,25.01085758014569,30.424876125859513];
 (await page.evaluate(()=>zeroHeights.slice(0,4))).forEach((g,i)=>assert.ok(Math.abs(g-known[i])<1e-9));
 assert.ok(await page.evaluate(()=>zeroHeights.every((g,i)=>!i||g>zeroHeights[i-1])));
 // Whether the glass starts open is a config choice, so check it agrees with
 // the config rather than assuming shut, then drive it open either way.
 assert.equal(await page.evaluate(()=>psiStairAim===1),
  await page.evaluate(()=>!!(CLOCK_CONFIG.psiLens&&CLOCK_CONFIG.psiLens.openAtStart)),
  'the lens opens itself exactly when psiLens.openAtStart says so');
 await page.locator('#appearanceButton').click();
 await page.evaluate(()=>{if(!psiStairAim)document.getElementById('psiStair').click();});
 for(const x of [1,1.6,2.4,3.5,60.5,120.5]){
  await page.evaluate(x=>jumpClock(x),x);await page.waitForTimeout(250);
  const r=await page.evaluate(()=>({time:t,exact:psiAt(t),predicted:psiPredicted,lens:psiLensReadout}));
  assert.ok(Math.abs(r.time-x)<1e-10);assert.equal(r.exact,r.lens.exact);
  if(x<2){assert.ok(Number.isNaN(r.predicted));assert.ok((await page.textContent('#psiReadout')).includes('starts at x = 2'));}
  else assert.ok(Math.abs(r.predicted-r.lens.full)<1e-10);
  if(x>60)assert.ok(Math.abs(r.exact-r.predicted)<.35,'local reference accuracy at '+x);
 }
 const independent=await page.evaluate(()=>psiPredicted);
 await page.evaluate(()=>tune(2.5,tauAim));await page.waitForTimeout(400);
 assert.equal(await page.evaluate(()=>psiPredicted),independent,'psi is independent of explorer sigma');
 assert.deepEqual(errors,[]);console.log('Psi search and real-axis reference regressions passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
