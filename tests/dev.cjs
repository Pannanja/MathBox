// Run with npm run dev already listening on localhost:5173.
const {chromium}=require('C:/Users/ZackO/AppData/Local/npm-cache/_npx/27c922a03b377bcf/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
// The construction catalogue is collapsed by default in the redesigned shell;
// open it before choosing so tests exercise the same handler as a visitor.
const pickView=(page,mode)=>page.evaluate(m=>{const c=document.getElementById('constructionChooser');if(c)c.open=true;document.querySelector('[data-view="'+m+'"]').click();},mode);
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173/');await page.waitForFunction(()=>typeof ClockMath!=='undefined');
  // Both workspaces open on demand; browser checks show clock and explorer together.
  await page.evaluate(()=>document.querySelector('#workspaceSwitch [data-layout=both]')?.click());await page.waitForTimeout(150);
  // These checks hold s still while the clock moves, so they switch off the
  // default drive that turns tau with the beat, through its own control.
  await page.evaluate(()=>{const c=document.getElementById('tauDriveOn');c.checked=false;c.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.match(page.url(),/orrery-of-eratosthenes.html/);
  const before=fs.statSync('orrery-of-eratosthenes.html').mtimeMs;
  const reload=page.waitForEvent('load',{timeout:15000});
  const now=new Date();fs.utimesSync('src/core/contracts.ts',now,now);
  await reload;await page.waitForFunction(()=>typeof paperMode!=='undefined');
  assert.ok(fs.statSync('orrery-of-eratosthenes.html').mtimeMs>before);
  await pickView(page,'term');await page.waitForFunction(()=>paperData?.valid);
  assert.deepEqual(errors,[]);console.log('Development root, TypeScript rebuild/reload and worker passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
