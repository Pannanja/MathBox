const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path');
// The construction catalogue is collapsed by default in the redesigned shell;
// open it before choosing so tests exercise the same handler as a visitor.
const pickView=(page,mode)=>page.evaluate(m=>{const c=document.getElementById('constructionChooser');if(c)c.open=true;document.querySelector('[data-view="'+m+'"]').click();},mode);
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('orrery-of-eratosthenes.html').replaceAll('\\','/'));
  // Both workspaces open on demand; browser checks show clock and explorer together.
  await page.evaluate(()=>document.querySelector('#workspaceSwitch [data-layout=both]')?.click());await page.waitForTimeout(150);
 await page.evaluate(()=>{tune(2,1);advanceClock(4.5,performance.now());});
 const state=await page.evaluate(()=>[t,sigmaAim,tauAim]);await pickView(page,'log');
 assert.deepEqual(await page.evaluate(()=>[t,sigmaAim,tauAim]),state);
 await page.waitForFunction(()=>Math.abs(SIGMA-2)<1e-12&&Math.abs(TAUV-1)<1e-12);await page.locator('#fitLocus').click();await page.waitForTimeout(600);
 assert.equal(await page.evaluate(()=>logArmReadout.active.source.q),4);
 assert.equal(await page.evaluate(()=>logArmReadout.active.growth),.5);
 assert.equal(await page.evaluate(()=>paperWorker),null);
 await page.screenshot({path:'.review/log-arm-four.png'});
 // Hover/click the actual q=4 vector, with the shared input/pan controls intact.
 const point=await page.evaluate(()=>{const r=logArmReadout,terms=r.model.terms,index=terms.findIndex(c=>c.source.q===4),from=terms.slice(0,index).reduce((a,c)=>[a[0]+c.value[0],a[1]+c.value[1]],[0,0]),v=terms[index].value,b=graphPlotRect(plane),u=125/10**graphLogExtent;return {x:b.left+(300+u*(from[0]+v[0]*.65-graphCentre[0]))*b.width/600,y:b.top+(150-u*(from[1]+v[1]*.65-graphCentre[1]))*b.height/300};});
 await page.mouse.move(point.x,point.y);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>selectedPrime),2);
 await page.mouse.click(point.x,point.y);await page.mouse.move(20,20);await page.waitForTimeout(100);
 assert.equal(await page.evaluate(()=>pinnedPrime),2);assert.equal(await page.evaluate(()=>logArmScene.activeQ),4);
 const before=await page.evaluate(()=>logArmReadout.model.endpoint);
 await page.evaluate(()=>advanceClock(5,performance.now()));await page.waitForTimeout(60);
 await page.evaluate(()=>advanceClock(4.5,performance.now()));await page.waitForTimeout(60);
 const back=await page.evaluate(()=>logArmReadout.model.endpoint);assert.ok(Math.hypot(back[0]-before[0],back[1]-before[1])<1e-9,JSON.stringify({before,back,state:await page.evaluate(()=>({t,SIGMA,TAUV}))}));
 // Exercise the real transport: the new vector must grow at intermediate times.
 await page.evaluate(()=>advanceClock(4,performance.now()));await page.locator('#stepBeat').click();
 await page.waitForFunction(()=>t>4.1&&t<4.9);
 assert.ok(await page.evaluate(()=>Math.abs(logArmReadout.model.terms.find(c=>c.source.q===4).growth-(t-4))<.03));
 await page.waitForFunction(()=>t===5);await page.locator('#previousBeat').click();
 await page.waitForFunction(()=>t>4.1&&t<4.9);await page.waitForFunction(()=>t===4);
 await page.evaluate(()=>advanceClock(4.5,performance.now()));await page.waitForTimeout(60);
 await page.locator('#paperTrace').click();await page.waitForTimeout(180);assert.ok(await page.evaluate(()=>paperProgress)<.5);assert.deepEqual(await page.evaluate(()=>[t,sigmaAim,tauAim]),state);
 await page.evaluate(()=>{paperPlaying=false;paperRewinding=false;paperProgress=paperProgressAim=1;linkPrime(0);logArmScene.clear();advanceClock(500,performance.now());tune(.5,14);});
 await page.waitForFunction(()=>Math.abs(SIGMA-.5)<1e-8&&Math.abs(TAUV-14)<1e-8);await page.locator('#fitLocus').click();await page.waitForTimeout(600);
 assert.equal(await page.evaluate(()=>logArmReadout.folded),0);await page.locator('#exploreMore').click();await page.locator('#foldArmTerms').check();await page.evaluate(()=>$('exploreOptions').hidePopover());await page.waitForTimeout(100);assert.ok(await page.evaluate(()=>logArmReadout.folded)>50);assert.match(await page.locator('#locusStatus').textContent(),/finite only/);
 assert.ok(await page.evaluate(()=>Math.hypot(logArmReadout.tip[0]-logArmReadout.model.endpoint[0],logArmReadout.tip[1]-logArmReadout.model.endpoint[1])<1e-12));
 await page.screenshot({path:'.review/log-arm-many.png'});
 const foldedBefore=await page.evaluate(()=>logArmReadout.folded);
 const groupPoint=await page.evaluate(()=>{const hit=logArmScene.hits.find(h=>h.segment.items.length>4),b=graphPlotRect(plane);return {x:b.left+(hit.from[0]+hit.to[0])/2*b.width/600,y:b.top+(hit.from[1]+hit.to[1])/2*b.height/300};});
 await page.mouse.click(groupPoint.x,groupPoint.y);await page.waitForTimeout(150);
 assert.ok(await page.evaluate(()=>logArmReadout.folded)<foldedBefore);
 assert.ok(await page.evaluate(()=>Math.hypot(logArmReadout.tip[0]-logArmReadout.model.endpoint[0],logArmReadout.tip[1]-logArmReadout.model.endpoint[1])<1e-12));
 for(const [w,h] of [[1440,1000],[390,844],[568,320],[320,568]]){
  await page.setViewportSize({width:w,height:h});await page.waitForTimeout(130);await page.screenshot({path:'.review/log-arm-'+w+'.png'});
  const b=await page.locator('#productBubble').evaluate(e=>({h:e.clientHeight,s:e.scrollHeight}));assert.ok(b.s<=b.h+1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));
 }
 await page.setViewportSize({width:1440,height:1000});await pickView(page,'theta');await page.waitForFunction(()=>paperData?.valid&&paperData.mode==='theta');
 await pickView(page,'euler');await page.waitForFunction(()=>locusData?.done&&locusData.sigma===.5);assert.doesNotMatch(await page.locator('#liveCurveState').textContent(),/finite L/);
 assert.deepEqual(errors,[]);console.log('Log arm: birth, hover/pin, rewind, replay, folding, layouts and return views passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
