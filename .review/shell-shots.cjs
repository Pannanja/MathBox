
const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const path=require('node:path');
const sizes={desktop:[1440,900],laptop:[1280,720],phone:[390,844],landscape:[844,390]};
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const url='file:///'+path.resolve('orrery-of-eratosthenes.html').split(path.sep).join('/');
 for(const [name,[width,height]] of Object.entries(sizes)){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:2}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text());});
  await page.goto(url);await page.waitForFunction(()=>typeof ClockMath!=='undefined');await page.waitForTimeout(900);
  await page.screenshot({path:'.review/shell-'+name+'-clock.png'});
  const box=await page.evaluate(()=>{const s=document.getElementById('clockSurface').getBoundingClientRect();return [s.width,s.height];});
  await page.evaluate(()=>document.querySelector('#workspaceSwitch [data-layout=both]').click());await page.waitForTimeout(700);
  await page.screenshot({path:'.review/shell-'+name+'-both.png'});
  await page.evaluate(()=>document.querySelector('#workspaceSwitch [data-layout=explorer]').click());await page.waitForTimeout(900);
  await page.screenshot({path:'.review/shell-'+name+'-explorer.png'});
  const graph=await page.evaluate(()=>{const g=document.getElementById('productGraph').getBoundingClientRect(),w=document.getElementById('riemannWorkspace').getBoundingClientRect();
   return {gw:Math.round(g.width),gh:Math.round(g.height),share:Math.round(100*g.height/w.height),bw:document.getElementById('productGraph').width,bh:document.getElementById('productGraph').height};});
  console.log(name,'clockSurface',box.map(Math.round).join('x'),'graph',JSON.stringify(graph),'errors',JSON.stringify(errors));
  await page.close();
 }
 await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
