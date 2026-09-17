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
 // The drive is on out of the box, at one per beat.
 assert.strictEqual(await page.isChecked('#tauDriveOn'),true,'drive on by default');
 assert.strictEqual(await page.evaluate(()=>tauRate),-1,'minus one per beat by default');
 assert.strictEqual(await page.evaluate(()=>+sigmaAim.toFixed(3)),.5,'opens on the critical line real part');
 assert.strictEqual(await page.evaluate(()=>sumAim),1,'sum lens lit by default');
 // The explorer is never opened for the visitor.
 await page.evaluate(()=>{const f=document.getElementById('clockTauExact');f.value='7';f.dispatchEvent(new Event('input',{bubbles:true}));});
 await page.waitForTimeout(250);
 assert.strictEqual(await page.evaluate(()=>document.getElementById('workspaceShell').dataset.layout),'clock','layout left alone');
 // The rate field and its slider are one control.
 await page.evaluate(()=>{const f=document.getElementById('tauRateExact');f.value='-2.5';f.dispatchEvent(new Event('input',{bubbles:true}));});
 await page.waitForTimeout(80);
 assert.strictEqual(await page.evaluate(()=>tauRate),-2.5,'numeric rate applied');
 assert.strictEqual(await page.inputValue('#tauRate'),'-2.5','slider followed the field');
 await page.evaluate(()=>{const f=document.getElementById('tauRate');f.value='1';f.dispatchEvent(new Event('input',{bubbles:true}));});
 await page.waitForTimeout(80);
 assert.strictEqual(await page.inputValue('#tauRateExact'),'1','field followed the slider');
 // A term prints across the same lap as its pane, so neither leads the other.
 await page.evaluate(()=>{tauDriveOn=false;tune(2,0);jumpClock(2.5);});
 await page.waitForTimeout(250);
 const lap=await page.evaluate(()=>({links:continuumSum(t,SIGMA,TAUV).points.length-1,pane:+Math.min(1,Math.max(0,t-2)).toFixed(2),factors:eulerPath(t,SIGMA,TAUV).points.length-1,arriving:!!eulerPath(t,SIGMA,TAUV).arriving}));
 assert.deepStrictEqual(lap,{links:2,pane:.5,factors:0,arriving:true},'half a term and half a pane: '+JSON.stringify(lap));
 await page.evaluate(()=>jumpClock(3));await page.waitForTimeout(250);
 const done=await page.evaluate(()=>({links:continuumSum(t,SIGMA,TAUV).points.length-1,pane:+Math.min(1,Math.max(0,t-2)).toFixed(2),factors:eulerPath(t,SIGMA,TAUV).points.length-1}));
 assert.deepStrictEqual(done,{links:2,pane:1,factors:1},'term 2, pane 2 and factor 2 all land together: '+JSON.stringify(done));
 // Back to a driven clock, through the control, at a positive rate.
 await page.evaluate(()=>{tune(2,0);const c=document.getElementById('tauDriveOn');c.checked=true;c.dispatchEvent(new Event('input',{bubbles:true}));
  const r=document.getElementById('tauRateExact');r.value='1';r.dispatchEvent(new Event('input',{bubbles:true}));});
 await page.waitForTimeout(200);
 const before=await page.evaluate(()=>({t,tau:tauAim}));
 // Step the clock forward five beats and read tau.
 for(let i=0;i<5;i++){await page.evaluate(()=>stepClock(1));await page.waitForTimeout(650);}
 const mid=await page.evaluate(()=>({t,tau:tauAim,rate:tauRate,origin:tauOrigin}));
 assert.ok(Math.abs(mid.tau-(before.tau+mid.rate*(mid.t-before.t)))<1e-6,'tau tracks t: '+JSON.stringify(mid));
 assert.ok(mid.tau>4,'tau actually moved: '+mid.tau);
 // Step back: tau must wind back with the count.
 for(let i=0;i<3;i++){await page.evaluate(()=>stepClock(-1));await page.waitForTimeout(650);}
 const back=await page.evaluate(()=>({t,tau:tauAim}));
 assert.ok(back.tau<mid.tau-2,'tau wound back: '+JSON.stringify([mid,back]));
 assert.ok(Math.abs(back.tau-(before.tau+mid.rate*(back.t-before.t)))<1e-6,'tau still a function of t');
 // Rate change re-anchors rather than rewriting history.
 await page.fill('#tauRate','-3');await page.dispatchEvent('#tauRate','input');
 const anchored=await page.evaluate(()=>({tau:tauAim,rate:tauRate,origin:tauOrigin,t}));
 assert.strictEqual(anchored.rate,-3);
 assert.ok(Math.abs(anchored.origin.tau-anchored.tau)<1e-9&&Math.abs(anchored.origin.t-anchored.t)<1e-9,'re-anchored');
 // Sigma untouched by the drive.
 const sig=await page.evaluate(()=>sigmaAim);assert.strictEqual(sig,2,'sigma untouched by the drive');
 // Sum ruler zoom reaches the drawing.
 await page.evaluate(()=>document.getElementById('appearanceButton').click());
 await page.waitForTimeout(150);
 await page.fill('#sumZoom','0.4');await page.dispatchEvent('#sumZoom','input');
 await page.waitForTimeout(80);
 assert.strictEqual(await page.evaluate(()=>sumZoom),0.4,'sumZoom applied');
 // One unit is sigma radii times the observer's factor; sigma is still 2 here.
 assert.strictEqual(await page.evaluate(()=>+sumUnitRadii().toFixed(4)),0.8,'sigma feeds the ruler');
 assert.strictEqual(await page.evaluate(()=>sumRulerLabel()),'SUM · 1 = 0.80 × radius');
 await page.evaluate(()=>{const s=document.getElementById('clockSigmaExact');s.value='0.5';s.dispatchEvent(new Event('input',{bubbles:true}));});
 await page.waitForTimeout(500);
 await page.evaluate(()=>{const z=document.getElementById('sumZoom');z.value='1';z.dispatchEvent(new Event('input',{bubbles:true}));});
 await page.waitForTimeout(400);
 const half=await page.evaluate(()=>+sumUnitRadii().toFixed(3));
 assert.ok(Math.abs(half-0.5)<0.02,'Re(s)=1/2 draws one unit at half the radius: '+half);
 // Drive stops at the slider bound rather than running off.
 // 35 was a slider's edge, not the machinery's. The drive runs past it.
 await page.evaluate(()=>{tauDriveOn=true;tauRate=4;tauOrigin={t:t,tau:0};tauAim=0;});
 await page.evaluate(()=>advanceClock(t+60,performance.now()));
 await page.waitForTimeout(400);
 const far=await page.evaluate(()=>({tau:tauAim,on:tauDriveOn,zeta:zeta(2,tauAim)}));
 assert.ok(far.tau>200,'tau ran well past 35: '+far.tau);
 assert.strictEqual(far.on,true,'still driving');
 assert.ok(far.zeta.every(Number.isFinite),'zeta still evaluates up there: '+JSON.stringify(far.zeta));
 // It does stop where the evaluator's clamp does.
 await page.evaluate(()=>{tauOrigin={t:t,tau:990};tauAim=990;});
 await page.evaluate(()=>advanceClock(t+20,performance.now()));
 await page.waitForTimeout(150);
 const capped=await page.evaluate(()=>({tau:tauAim,on:tauDriveOn,note:document.getElementById('driveNote').textContent}));
 assert.strictEqual(capped.tau,1000,'clamped at the evaluator bound: '+JSON.stringify(capped));
 assert.strictEqual(capped.on,false,'drive switched off at the bound');
 assert.ok(/stopped at 1000/.test(capped.note),capped.note);
 assert.deepStrictEqual(errs,[],'page errors');
 console.log('tau-drive + sum ruler: passed');
 await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
