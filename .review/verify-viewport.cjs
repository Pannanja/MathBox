const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('orrery-of-eratosthenes.html').replaceAll('\\','/'));await page.waitForTimeout(300);assert.deepEqual(errors,[]);
 await page.getByRole('button',{name:'Close J ledger',exact:true}).click();
 const geometry=await page.evaluate(()=>{const c=$('cv').getBoundingClientRect();return {diameter:c.width*2*R/W,target:.8*Math.min(innerWidth,innerHeight),scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],viewport:[innerWidth,innerHeight]};});assert.ok(Math.abs(geometry.diameter-geometry.target)<.2);assert.deepEqual(geometry.scroll,geometry.viewport);
 assert.deepEqual(await page.locator('.transport button').evaluateAll(es=>es.map(e=>e.id)),['reset','previousBeat','play','stepBeat']);
 await page.getByRole('button',{name:'Observe',exact:true}).click();await page.getByRole('button',{name:'View',exact:true}).click();await page.mouse.click(720,500);assert.equal(await page.locator('.bubble:popover-open').count(),2);await page.getByRole('button',{name:'Close observation'}).click();await page.getByRole('button',{name:'Close view controls'}).click();
 await page.screenshot({path:'.review/viewport-start.png'});
 await page.getByRole('button',{name:'View',exact:true}).click();await page.locator('#sumLens').click();await page.waitForTimeout(1400);
 assert.equal(await page.evaluate(()=>t),1);assert.ok(await page.evaluate(()=>sumMix>.99));
 const unit=await page.evaluate(async()=>{
  const calls=[],order=[],arrow=lensArrow,glass=drawPrimeGlass,sum=drawContinuum;
  lensArrow=(...a)=>{calls.push(a);arrow(...a);};drawPrimeGlass=(...a)=>{order.push('glass');glass(...a);};drawContinuum=(...a)=>{order.push('sum');sum(...a);};
  await new Promise(requestAnimationFrame);lensArrow=arrow;drawPrimeGlass=glass;drawContinuum=sum;
  return {length:Math.hypot(calls[0][2]-calls[0][0],calls[0][3]-calls[0][1]),radius:R,order};
 });assert.equal(unit.length,unit.radius);assert.ok(unit.order.indexOf('sum')>unit.order.indexOf('glass'));
 await page.getByRole('button',{name:'Close view controls'}).click();await page.screenshot({path:'.review/viewport-unit.png'});
 await page.getByRole('button',{name:'Observe',exact:true}).click();
 for(let n=1;n<=6;n++)assert.ok(await page.getByRole('button',{name:'Observe beat '+n,exact:true}).isEnabled());
 await page.getByRole('button',{name:'Observe beat 4',exact:true}).click();await page.waitForFunction(()=>!clockTween);assert.equal(await page.evaluate(()=>t),4);
 await page.getByRole('button',{name:'Close observation'}).click();
 const before=await page.evaluate(()=>({sumAim,sigmaAim,tauAim,reflectionAim,radialAim,separateAim,specMode,buttons:[...document.querySelectorAll('#clockApp button')].map(b=>b.id||b.textContent)}));
 for(const id of ['twinMode','eulerMode','zetaMode','puzzleMode']){await page.locator('#'+id).click();await page.waitForFunction(()=>!clockTween);assert.deepEqual(await page.evaluate(()=>({sumAim,sigmaAim,tauAim,reflectionAim,radialAim,separateAim,specMode,buttons:[...document.querySelectorAll('#clockApp button')].map(b=>b.id||b.textContent)})),before);}
 const scrub=await page.evaluate(()=>{seekFrontier(2000);return {from:t,to:clockTween.to,duration:clockTween.duration};});assert.ok(scrub.duration<.4);assert.equal(scrub.from,1);
 await page.waitForTimeout(100);const during=await page.evaluate(()=>t);assert.ok(during>1&&during<2000);
 await page.waitForFunction(()=>!clockTween,null,{timeout:2500});assert.equal(await page.evaluate(()=>t),2000);
 await page.evaluate(()=>seekFrontier(30));await page.waitForFunction(()=>!clockTween);await page.waitForTimeout(500);
 const factors=await page.locator('#pf .fx').evaluateAll(es=>es.filter(e=>+e.style.opacity>.9).map(e=>({p:+e.dataset.p,active:e.dataset.absorbing==='true'})));assert.ok([2,3,5].every(p=>factors.some(f=>f.p===p&&f.active)));
 await page.evaluate(()=>seekFrontier(31.5));await page.waitForFunction(()=>!clockTween);await page.waitForTimeout(500);assert.ok(await page.locator('#pf .fx').evaluateAll(es=>es.filter(e=>+e.style.opacity>.4).length>1));
 await page.getByRole('button',{name:'View',exact:true}).click();await page.locator('#reflect').click();await page.waitForTimeout(1500);await page.getByRole('button',{name:'Close view controls'}).click();await page.screenshot({path:'.review/viewport-reflected.png'});
 await page.evaluate(()=>seekFrontier(12.35));await page.waitForFunction(()=>!clockTween);await page.locator('#stepBeat').click();await page.waitForFunction(()=>!clockTween);await page.locator('#previousBeat').click();await page.waitForFunction(()=>!clockTween);assert.ok(Math.abs(await page.evaluate(()=>t)-12.35)<1e-9);
 for(const [width,height] of [[390,844],[844,390],[320,568],[568,320],[1440,1000]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(200);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight===innerHeight&&document.documentElement.scrollWidth===innerWidth));
  for(const name of ['View','Observe','Tune s & pace']){
   await page.getByRole('button',{name,exact:true}).click();
   const extent=await page.locator('.bubble:popover-open').evaluate(e=>({client:e.clientHeight,scroll:e.scrollHeight,rect:e.getBoundingClientRect().toJSON()}));assert.ok(extent.scroll<=extent.client+1,JSON.stringify({width,height,name,extent}));assert.ok(extent.rect.y>=0&&extent.rect.bottom<=height);
   await page.locator('.bubble:popover-open [popovertargetaction="hide"]').click();
  }
  await page.screenshot({path:'.review/viewport-'+width+'.png'});
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,geometry,unit,scrub,during,factors,errors},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
