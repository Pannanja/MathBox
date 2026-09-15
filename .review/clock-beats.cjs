
const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const url='file:///'+path.resolve('orrery-of-eratosthenes.html').split(path.sep).join('/');
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForFunction(()=>typeof ClockMath!=='undefined');await page.waitForTimeout(600);
 for(const beat of [1,1.5,2,6,12,30,500]){
  await page.evaluate(b=>{clockTween=null;advanceClock(b,performance.now());},beat);
  await page.waitForTimeout(500);
  await page.screenshot({path:'.review/beat-'+beat+'.png'});
 }
 console.log('errors',JSON.stringify(errors));
 await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
