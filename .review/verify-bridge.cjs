const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('orrery-of-eratosthenes.html').replaceAll('\\','/'));await page.waitForTimeout(200);await page.locator('#whyJ').click();assert.ok(await page.locator('#bridgeBubble').isVisible());
 await page.locator('#bridgeVisit').click();await page.waitForFunction(()=>!clockTween);assert.equal(await page.evaluate(()=>t),10);
 await page.locator('#bridgeExpansion').evaluate(e=>{e.value=1;e.dispatchEvent(new Event('input'));});assert.ok(await page.evaluate(()=>bridgeMix<.99));await page.waitForTimeout(1300);
 const coeff=await page.evaluate(()=>[1,2,4,6,8,9,10].map(n=>[n,logCoefficient(n)]));assert.deepEqual(coeff,[[1,0],[2,1],[4,.5],[6,0],[8,1/3],[9,.5],[10,0]]);
 await page.locator('#bridgeTrace').click();assert.ok(await page.evaluate(()=>areaMix<.99));await page.waitForTimeout(1300);assert.equal(await page.evaluate(()=>t),10);
 const areas=await page.evaluate(()=>[1,2,3].map(k=>normalizedArea(k,1)));assert.deepEqual(areas,[1,.5,1/3]);assert.match(await page.locator('#bridgeAreas').textContent(),/area ⅓/);
 await page.locator('#bridgeLadder').click();await page.waitForTimeout(1600);
 const radii=await page.evaluate(()=>[1,2,4,8].map(q=>q===1?0:clockRadius(q)));assert.ok(Math.abs(radii[1]-(radii[2]-radii[1]))<.1);assert.ok(Math.abs(radii[1]-(radii[3]-radii[2]))<.1);
 await page.screenshot({path:'.review/bridge-desktop.png'});
 for(const [width,height] of [[390,844],[568,320]]){await page.setViewportSize({width,height});await page.waitForTimeout(300);const box=await page.locator('#bridgeBubble').evaluate(e=>({height:e.clientHeight,scroll:e.scrollHeight,bottom:e.getBoundingClientRect().bottom}));assert.ok(box.scroll<=box.height+1,JSON.stringify(box));assert.ok(box.bottom<=height);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth&&document.documentElement.scrollHeight===innerHeight));await page.screenshot({path:'.review/bridge-'+width+'.png'});}
 await page.setViewportSize({width:1440,height:1000});await page.locator('#bridgeLedger').click();assert.ok(await page.locator('#jBubble').isVisible());assert.equal(await page.locator('#jTotal').innerText(),'5 ⅓');
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,coeff,areas,radii,errors}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
