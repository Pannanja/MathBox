// Run with npm run dev already listening on localhost:5173.
const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173/');await page.waitForFunction(()=>typeof ClockMath!=='undefined');
  assert.match(page.url(),/orrery-of-eratosthenes.html/);
  const before=fs.statSync('orrery-of-eratosthenes.html').mtimeMs;
  const reload=page.waitForEvent('load',{timeout:15000});
  const now=new Date();fs.utimesSync('src/core/contracts.ts',now,now);
  await reload;await page.waitForFunction(()=>typeof paperMode!=='undefined');
  assert.ok(fs.statSync('orrery-of-eratosthenes.html').mtimeMs>before);
  await page.locator('[data-view="term"]').click();await page.waitForFunction(()=>paperData?.valid);
  assert.deepEqual(errors,[]);console.log('Development root, TypeScript rebuild/reload and worker passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
