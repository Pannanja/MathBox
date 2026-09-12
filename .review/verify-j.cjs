const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('orrery-of-eratosthenes.html').replaceAll('\\','/'));await page.waitForTimeout(200);assert.deepEqual(errors,[]);assert.ok(await page.locator('#jBubble').isVisible());
 const expected=[0,1,2,2.5,3.5,3.5,4.5,4.5+1/3,5+1/3,5+1/3];
 for(let n=1;n<=10;n++){
  if(n>1){await page.locator('#stepBeat').click();await page.waitForFunction(()=>!clockTween);}
  assert.equal(await page.evaluate(()=>t),n);assert.ok(Math.abs(await page.evaluate(()=>jValue(t))-expected[n-1])<1e-12);
 }
 assert.equal(await page.locator('#jTotal').innerText(),'5 ⅓');assert.match(await page.locator('#jEvent').innerText(),/total stays still/);
 await page.screenshot({path:'.review/j-ten.png'});
 await page.locator('#previousBeat').click();await page.waitForFunction(()=>!clockTween);assert.equal(await page.locator('.j-current').getAttribute('data-q'),'9');
 await page.locator('#previousBeat').click();await page.waitForFunction(()=>!clockTween);assert.equal(await page.locator('#jTotal').innerText(),'4 ⅚');assert.equal(await page.locator('.j-current').getAttribute('data-q'),'8');
 await page.screenshot({path:'.review/j-eight.png'});
 const numeric=await page.evaluate(()=>{let worst=0;for(const x of [10,64,120,500,2000,5000]){let sum=0;for(let p=2;p<=x;p++){if(!isPrime(p))continue;for(let q=p,k=1;q<=x;q*=p,k++)sum+=1/k;}worst=Math.max(worst,Math.abs(jValue(x)-sum));}return worst;});assert.ok(numeric<1e-9);
 for(const [width,height] of [[390,844],[568,320]]){await page.setViewportSize({width,height});await page.waitForTimeout(200);const size=await page.locator('#jBubble').evaluate(e=>[e.scrollHeight,e.clientHeight,e.getBoundingClientRect().bottom]);assert.ok(size[0]<=size[1]+1);assert.ok(size[2]<=height);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth&&document.documentElement.scrollHeight===innerHeight));await page.screenshot({path:'.review/j-'+width+'.png'});}
 await page.locator('#reset').click();assert.equal(await page.locator('#jTotal').innerText(),'0');assert.ok(await page.locator('#jBubble').isVisible());assert.equal(await page.locator('.j-receipt').count(),0);
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,checkedThrough:5000,numericError:numeric,errors}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
