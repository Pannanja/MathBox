
const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const url='file:///'+path.resolve('orrery-of-eratosthenes.html').split(path.sep).join('/');
 for(const [name,w,h,layout] of [['both',1440,900,'both'],['phone',390,844,'clock'],['land',844,390,'clock']]){
  const page=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:2}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(()=>typeof ClockMath!=='undefined');
  await page.evaluate(l=>document.querySelector('#workspaceSwitch [data-layout='+l+']').click(),layout);
  await page.evaluate(()=>{clockTween=null;advanceClock(12,performance.now());});await page.waitForTimeout(600);
  await page.screenshot({path:'.review/dock-'+name+'.png'});
  console.log(name,await page.evaluate(()=>{const eq=document.getElementById('equals').getBoundingClientRect();
   const f=document.getElementById('cv').getBoundingClientRect(),u=(1-Math.cos(Math.PI*reflectionMix))/2,r=R/W*f.width;
   return JSON.stringify({eqX:Math.round(eq.left+eq.width/2),rayX:Math.round(f.left+f.width/2+u*r),drift:Math.round(eq.left+eq.width/2-(f.left+f.width/2+u*r))});}),'errors',JSON.stringify(errors));
  await page.close();
 }
 await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
