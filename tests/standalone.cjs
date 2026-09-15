const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
(async()=>{
 assert.equal(fs.readFileSync('dist/index.html','utf8'),fs.readFileSync('orrery-of-eratosthenes.html','utf8'));
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const context=await browser.newContext({offline:true}),page=await context.newPage(),errors=[],network=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url());});
  await page.goto('file:///'+path.resolve('dist/index.html').replaceAll('\\','/'));
  await page.evaluate(()=>tune(.5,1));await page.locator('[data-view="finite"]').click();
  await page.waitForFunction(()=>paperData?.valid&&paperData.mode==='finite'&&paperData.sigma===.5);
  assert.ok(await page.evaluate(()=>abs(sub(paperData.endpoint,paperTarget('finite',.5,1,paperData.n)))<1e-9));
  // Terminate an old request and confirm that only the requested replacement wins.
  await page.evaluate(()=>tune(.2,15));await page.locator('[data-view="theta"]').click();await page.evaluate(()=>tune(.7,3));
  await page.waitForFunction(()=>paperData?.valid&&paperData.mode==='theta'&&paperData.sigma===.7&&paperData.tau===3);
  await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>paperData.sigma),.7);
  assert.deepEqual(network,[]);assert.deepEqual(errors,[]);
  console.log('Standalone export runs offline with bundled integral worker and replacement requests.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
