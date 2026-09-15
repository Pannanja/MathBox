
const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const path=require('node:path');
const file=process.argv[2];
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve(file).split(path.sep).join('/'));
 await page.waitForFunction(()=>typeof ClockMath!=='undefined');await page.waitForTimeout(700);
 await page.evaluate(()=>{clockTween=null;advanceClock(12,performance.now());});await page.waitForTimeout(700);
 await page.screenshot({path:'.review/original-beat12.png'});
 console.log(await page.evaluate(()=>{
  const p=document.getElementById('originalProof'),c=document.getElementById('cv');
  const pr=p.getBoundingClientRect(),cr=c.getBoundingClientRect(),s=getComputedStyle(p);
  const eq=document.getElementById('equals').getBoundingClientRect();
  const tape=document.getElementById('tape').getBoundingClientRect();
  const u=(1-Math.cos(Math.PI*reflectionMix))/2,r=R/W*cr.width;
  return JSON.stringify({pos:s.position,left:s.left,top:s.top,transform:s.transform,
   proof:[pr.left,pr.top,pr.width,pr.height].map(Math.round),
   clock:[cr.left,cr.top,cr.width,cr.height].map(Math.round),
   rimExit:[Math.round(cr.left+cr.width/2+u*r),Math.round(cr.top+cr.height/2-(1-u)*r)],
   eq:[Math.round(eq.left+eq.width/2),Math.round(eq.top+eq.height/2)],
   tapeRight:[Math.round(tape.right),Math.round(tape.top+tape.height/2)],
   reflect:reflectionMix},null,0);}));
 console.log('errors',JSON.stringify(errors));
 await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
