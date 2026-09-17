// tau riding the beat, and the sum's ruler as a scale of its own.
const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');const assert=require('node:assert/strict'),path=require('node:path');
const page_url='file://'+path.resolve(__dirname,'..','orrery-of-eratosthenes.html');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});const page=await b.newPage({viewport:{width:1400,height:900}});
 const errs=[];page.on('pageerror',e=>errs.push(String(e)));
 await page.goto(page_url);await page.waitForTimeout(400);
 // Open Input s and switch the drive on.
 await page.evaluate(()=>document.getElementById('sReadout').click());
 await page.waitForTimeout(150);
 assert.ok(await page.isVisible('#tauDriveOn'),'drive checkbox visible');
 const before=await page.evaluate(()=>({t,tau:tauAim}));
 await page.check('#tauDriveOn');
 await page.waitForTimeout(100);
 // Step the clock forward five beats and read tau.
 for(let i=0;i<5;i++){await page.evaluate(()=>stepClock(1));await page.waitForTimeout(650);}
 const mid=await page.evaluate(()=>({t,tau:tauAim,rate:tauRate,origin:tauOrigin}));
 assert.ok(Math.abs(mid.tau-(before.tau+mid.rate*(mid.t-before.t)))<1e-6,'tau tracks t: '+JSON.stringify(mid));
 assert.ok(mid.tau>0.5,'tau actually moved: '+mid.tau);
 // Step back: tau must wind back with the count.
 for(let i=0;i<3;i++){await page.evaluate(()=>stepClock(-1));await page.waitForTimeout(650);}
 const back=await page.evaluate(()=>({t,tau:tauAim}));
 assert.ok(back.tau<mid.tau-0.5,'tau wound back: '+JSON.stringify([mid,back]));
 assert.ok(Math.abs(back.tau-(before.tau+mid.rate*(back.t-before.t)))<1e-6,'tau still a function of t');
 // Rate change re-anchors rather than rewriting history.
 await page.fill('#tauRate','-1');await page.dispatchEvent('#tauRate','input');
 const anchored=await page.evaluate(()=>({tau:tauAim,rate:tauRate,origin:tauOrigin,t}));
 assert.strictEqual(anchored.rate,-1);
 assert.ok(Math.abs(anchored.origin.tau-anchored.tau)<1e-9&&Math.abs(anchored.origin.t-anchored.t)<1e-9,'re-anchored');
 // Sigma untouched by the drive.
 const sig=await page.evaluate(()=>sigmaAim);assert.strictEqual(sig,2,'sigma untouched');
 // Sum ruler zoom reaches the drawing.
 await page.evaluate(()=>document.getElementById('appearanceButton').click());
 await page.waitForTimeout(150);
 await page.fill('#sumZoom','0.4');await page.dispatchEvent('#sumZoom','input');
 await page.waitForTimeout(80);
 assert.strictEqual(await page.evaluate(()=>sumZoom),0.4,'sumZoom applied');
 assert.strictEqual(await page.evaluate(()=>sumRulerLabel()),'SUM · 1 = 0.40 × radius');
 assert.strictEqual(await page.textContent('#sumZoomOut'),'0.40 radii');
 // Drive stops at the slider bound rather than running off.
 await page.evaluate(()=>{document.getElementById('clockTauExact').value='34.5';document.getElementById('clockTauExact').dispatchEvent(new Event('input',{bubbles:true}));});
 await page.evaluate(()=>{tauRate=2;tauDriveOn=true;anchorTau();});
 await page.evaluate(()=>advanceClock(t+5,performance.now()));
 await page.waitForTimeout(80);
 const capped=await page.evaluate(()=>({tau:tauAim,on:tauDriveOn,note:document.getElementById('driveNote').textContent}));
 assert.strictEqual(capped.tau,35,'clamped to slider max: '+JSON.stringify(capped));
 assert.strictEqual(capped.on,false,'drive switched off at the bound');
 assert.ok(/stopped at 35/.test(capped.note),capped.note);
 assert.deepStrictEqual(errs,[],'page errors');
 console.log('tau-drive + sum ruler: passed');
 await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
