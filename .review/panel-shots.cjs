
const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const url='file:///'+path.resolve('orrery-of-eratosthenes.html').split(path.sep).join('/');
 for(const [name,w,h] of [['desktop',1440,900],['phone',390,844]]){
  const page=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:2}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(()=>typeof ClockMath!=='undefined');
  await page.evaluate(()=>{clockTween=null;advanceClock(30,performance.now());});await page.waitForTimeout(500);
  for(const [id,label] of [['levelsButton','levels'],['appearanceButton','appearance'],['clockGear','gear']]){
   await page.locator('#'+id).click();await page.waitForTimeout(350);
   await page.screenshot({path:'.review/panel-'+name+'-'+label+'.png'});
   const m=await page.evaluate(()=>{const i=document.getElementById('clockInspector').getBoundingClientRect();return {w:Math.round(i.width),h:Math.round(i.height),share:Math.round(100*i.width*i.height/(innerWidth*innerHeight))};});
   console.log(name,label,JSON.stringify(m));
   await page.locator('#'+id).click();await page.waitForTimeout(200);
  }
  console.log(name,'errors',JSON.stringify(errors));
  await page.close();
 }
 await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
