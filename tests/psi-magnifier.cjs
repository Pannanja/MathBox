const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('orrery-of-eratosthenes.html').replaceAll('\\','/'));
 await page.waitForFunction(()=>zeroSearchNote.includes('found to'),{timeout:30000});
 await page.locator('#appearanceButton').click();await page.locator('#psiStair').click();
 await page.evaluate(()=>jumpClock(60.5));await page.waitForTimeout(1200);
 assert.ok(await page.locator('#psiMagnifier').isVisible());
 console.log('DETAIL',await page.evaluate(()=>({r:psiLensReadout,reference:psiPredicted,passed:psiPassedPredicted})));await page.screenshot({path:'.review/psi-magnifier-desktop.png'});
 const independent=await page.evaluate(()=>reconstruction(t,zeroHeights.length));const endpoint=await page.evaluate(()=>psiPredicted);assert.ok(Math.abs(independent-endpoint)<1e-10,'paired chain matches the previous formula');
 assert.equal(await page.evaluate(()=>ClockMath.psiArm(t,zeroHeights,zeroHeights.length).points.at(-1)[1]),0,'conjugate pairs land on the count axis');
 for(const at of [3.9,4,4.5,6,8,8.5]){await page.evaluate(x=>jumpClock(x),at);await page.waitForTimeout(150);assert.ok(await page.evaluate(()=>Math.abs(ClockMath.countedPsi(psiEvents,t)-psiAt(t))<1e-12));}
 await page.screenshot({path:'.review/psi-magnifier-power.png'});
 await page.locator('#psiHold').click();const held=await page.evaluate(()=>psiHeld);await page.evaluate(()=>jumpClock(100));await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>psiLensReadout.x),held);assert.ok(await page.evaluate(()=>psiLensReadout.count>10));
 await page.evaluate(()=>jumpClock(10));await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>psiLensReadout.count),0,'rewind removes passed zeros');assert.equal(await page.evaluate(()=>psiLensReadout.x),held);
 await page.locator('#psiHold').click();await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>psiLensReadout.x),10);
 for(const [width,height] of [[390,844],[844,390],[1100,720]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(400);await page.screenshot({path:'.review/psi-magnifier-'+width+'.png'});
  const box=await page.locator('#psiMagnifier').boundingBox();assert.ok(box.x>=0&&box.y>=0&&box.x+box.width<=width&&box.y+box.height<=height);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight));
  for(const id of ['psiHold','psiClose','psiZoom','psiExplain']){const b=await page.locator('#'+id).boundingBox();assert.ok(b.x>=box.x&&b.y>=box.y&&b.x+b.width<=box.x+box.width&&b.y+b.height<=box.y+box.height,id+' fits inside lens');}
  await page.locator('#psiExplain').click();assert.ok(await page.locator('#psiExplanation').isVisible());await page.locator('#psiExplain').click();
 }
 await page.setViewportSize({width:1440,height:900});
 const before=await page.evaluate(()=>[t,SIGMA,TAUV]);
 for(const layout of ['both','explorer','clock']){await page.locator('#workspaceSwitch [data-layout='+layout+']').click();await page.waitForTimeout(120);}
 (await page.evaluate(()=>[t,SIGMA,TAUV])).forEach((v,i)=>assert.ok(Math.abs(v-before[i])<1e-10,'workspace changes preserve mathematical state'));
 await page.evaluate(()=>jumpClock(2000.5));await page.waitForFunction(()=>psiLensReadout.x===2000.5&&Number.isFinite(psiLensReadout.full)&&psiLensReadout.count===649);
 await page.locator('#psiZoom').fill('6');await page.locator('#psiZoom').dispatchEvent('input');await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>psiZoom),6);
 // The glass starts in its configured corner and can be dragged off it.
 const lens=page.locator('#psiMagnifier'),box=await lens.boundingBox();
 await page.mouse.move(box.x+box.width/2,box.y+box.height*.25);
 await page.mouse.down();await page.mouse.move(box.x+240,box.y+180,{steps:8});await page.mouse.up();
 const moved=await lens.boundingBox();
 assert.ok(Math.abs(moved.x-box.x)>40||Math.abs(moved.y-box.y)>40,'the glass can be dragged');
 assert.ok(moved.x>=0&&moved.y>=0,'and stays on the surface');
 await page.locator('#psiClose').click();assert.equal(await page.evaluate(()=>psiStairAim),0);assert.ok(await page.locator('#psiMagnifier').isHidden());
 // The ratchet's gaps must be real retreats. With all 649 searched heights the
 // sum rings every 2*pi*x/T, narrower than the window, so a birth window both
 // advances and slips. tests/psi-math.cjs pins that a coarse sum cannot.
 await page.evaluate(()=>jumpClock(59.2));await page.waitForTimeout(400);
 const pawl=await page.evaluate(()=>{const w=ClockMath.psiTrace(zeroHeights,zeroHeights.length,58.6,59.4,160);
  let up=0,down=0;for(let i=1;i<w.length;i++)(w[i][0]>w[i-1][0]?up++:down++);return {up,down,zeros:zeroHeights.length};});
 console.log('PAWL',pawl);
 assert.equal(pawl.zeros,649);assert.ok(pawl.up>0&&pawl.down>0,'the full sum both advances and slips across a birth');
 // The trail on the dial: an empty one draws nothing, a walked one draws both
 // pens, and the history persists rather than scrolling away.
 assert.equal(await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=64;
  return ClockMath.drawPsiTrail(c.getContext('2d'),{trail:null,origin:32,radius:30,top:-Math.PI/2,scale:10});}),0,
  'no trail, nothing drawn');
 const pens=await page.evaluate(()=>{
  const tr=new ClockMath.PsiTrail(4096);tr.advance(20,zeroHeights,8);
  for(let x=20.2;x<=40;x+=.2)tr.advance(x,zeroHeights,8);
  const c=document.createElement('canvas');c.width=c.height=920;
  return {segs:ClockMath.drawPsiTrail(c.getContext('2d'),{trail:tr,origin:460,radius:408,top:-Math.PI/2,scale:40}),
   held:tr.length,from:tr.from,upto:tr.upto};});
 console.log('PENS',pens);
 assert.ok(pens.held>100&&pens.segs>50,'a walked trail writes both pens');
 assert.ok(pens.from===20&&pens.upto>39,'and spans what it watched');
 assert.deepEqual(errors,[]);console.log('Psi magnifier: axis closure, independent endpoint, birth weights, hold, zero crossings, rewind and responsive layouts passed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
