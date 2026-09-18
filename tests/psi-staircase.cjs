// The zero search, and psi(x) drawn as a radial staircase against it.
const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');const assert=require('node:assert/strict'),path=require('node:path');
const page_url='file://'+path.resolve(__dirname,'..','orrery-of-eratosthenes.html');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});const page=await b.newPage({viewport:{width:1400,height:900}});
 const errs=[];page.on('pageerror',e=>errs.push(String(e)));
 await page.goto(page_url);await page.waitForTimeout(400);
 // This suite holds s still while the clock moves, through the drive's control.
 await page.evaluate(()=>{const c=document.getElementById('tauDriveOn');c.checked=false;c.dispatchEvent(new Event('input',{bubbles:true}));});

 // The tabulated thirty are there before the search returns.
 assert.ok(await page.evaluate(()=>zeroHeights.length)>=30,'seeded from the table');
 await page.waitForFunction(()=>zeroSearchNote.includes('found to'),{timeout:60000});
 const found=await page.evaluate(()=>zeroHeights.length);
 assert.strictEqual(found,649,'every zero below the evaluator\u2019s trusted height');
 // theta(T)/pi + 1 counts the zeros below T. Agreement is the search's own proof
 // that it stepped over none of them.
 const expected=await page.evaluate(()=>{const h=ZERO_LIMIT/2,w=1/ZERO_LIMIT;
  return (h*Math.log(h/Math.PI)-h-Math.PI/8+w/48+7*w**3/5760)/Math.PI+1;});
 assert.ok(Math.abs(found-expected)<1,'count agrees with \u03b8(T)/\u03c0 + 1, got '+found+' against '+expected.toFixed(2));
 // Located, not looked up: the found heights match the known ones exactly.
 const known=[14.134725141734695,21.022039638771555,25.01085758014569,30.424876125859513];
 const top=await page.evaluate(()=>zeroHeights.slice(0,4));
 top.forEach((g,i)=>assert.ok(Math.abs(g-known[i])<1e-9,'zero '+i+' is '+g+', wanted '+known[i]));
 assert.ok(await page.evaluate(()=>zeroHeights.every((g,i)=>i===0||g>zeroHeights[i-1])),'heights increase');
 // One table, so reconstruction() and the epicycles cannot drift apart.
 assert.deepStrictEqual(await page.evaluate(()=>[heights.length,heights[0],heights[648]]),
                        await page.evaluate(()=>[zeroHeights.length,zeroHeights[0],zeroHeights[648]]),'heights is the same list');
 assert.strictEqual(await page.evaluate(()=>+document.getElementById('zeroDial').max),649,'the dial reaches every zero');
 assert.strictEqual(await page.evaluate(()=>+document.getElementById('zeroDial').value),649,'and opens on all of them');

 // The ledger the staircase draws: a jump of log p at each prime power.
 assert.strictEqual(await page.evaluate(()=>psiAt(1.5)),0,'nothing counted below two');
 for(const [x,want] of [[2,Math.log(2)],[3.5,Math.log(2)+Math.log(3)],[4,Math.log(2)*2+Math.log(3)]])
  assert.ok(Math.abs(await page.evaluate(v=>psiAt(v),x)-want)<1e-12,'\u03c8('+x+')');
 assert.strictEqual(await page.evaluate(()=>psiAt(6)-psiAt(5.5)),0,'six is not a prime power');

 // The staircase is a lens of its own, off until it is asked for.
 assert.strictEqual(await page.evaluate(()=>psiStairAim),0,'off at the start');
 await page.evaluate(()=>{sumAim=0;syncLenses();document.getElementById('psiStair').click();jumpClock(60.5);});
 await page.waitForTimeout(1200);
 assert.strictEqual(await page.getAttribute('#psiStair','aria-pressed'),'true','the button reports itself lit');
 assert.ok(await page.evaluate(()=>psiStairMix)>.9,'the lens has faded in');

 // The formula, summed over every zero found, against what the clock counted.
 const [counted,predicted]=await page.evaluate(()=>[psiAt(t),psiPredicted]);
 assert.ok(Math.abs(counted-predicted)<.35,'649 zeros reproduce \u03c8(60.5): counted '+counted+', predicted '+predicted);
 // Thirty cannot: the truncation blurs features of order 2*pi*x/T.
 await page.evaluate(()=>{const d=document.getElementById('zeroDial');d.value='30';d.dispatchEvent(new Event('input',{bubbles:true}));});
 await page.waitForTimeout(900);
 const coarse=await page.evaluate(()=>psiPredicted);
 assert.ok(Math.abs(counted-coarse)>Math.abs(counted-predicted),'thirty zeros land further off than 649');
 assert.strictEqual(await page.evaluate(()=>zeroAuto),false,'touching the dial ends the automatic count');

 // The stair climbs from near the middle to the arm at the outside, and the
 // lift on its departure from the trend names itself in the reading.
 for(const [scale,name] of [[1,'departure lifted to .45 radius'],[0,'departure true, on the clock radius'],[.5,'departure lifted 0.50']]){
  await page.evaluate(v=>{const s=document.getElementById('stairScale');s.value=String(v);s.dispatchEvent(new Event('input',{bubbles:true}));},scale);
  await page.waitForTimeout(120);
  assert.strictEqual(await page.evaluate(()=>stairScale),scale,'ruler set to '+scale);
  assert.ok((await page.textContent('#reading')).includes(name),'the reading names the '+name+' ruler');
 }

 // The trend climbs: a value at the head of the stair sits far outside the same
 // value at its foot, whatever the lift.
 for(const scale of [0,1]){
  await page.evaluate(v=>{stairScale=v;},scale);
  const [inner,outer]=await page.evaluate(()=>{const R0=408,f=v=>R0*(STAIR_IN+(STAIR_OUT-STAIR_IN)*v/t);return [f(smooth(3)),f(smooth(t))];});
  assert.ok(outer>inner*4,'the stair climbs at lift '+scale+': '+inner.toFixed(1)+' to '+outer.toFixed(1));
  assert.ok(outer<408,'and stays inside the rim');
 }
 // The lifted departure is bounded by the radius it rides, so it never reaches
 // back through the origin however small the count.
 assert.ok(await page.evaluate(()=>{for(let x=2.01;x<t;x+=.01){const d=psiResidual(psiAt(x),x);if(1+STAIR_GAIN*d<=.15)return false;}return true;}),'the departure never folds through the centre');
 assert.deepStrictEqual(errs,[],'no page errors');
 console.log('psi staircase: '+found+' zeros, \u03c8(60.5) counted '+counted.toFixed(3)+' against '+predicted.toFixed(3)+' predicted');
 await b.close();
})();
