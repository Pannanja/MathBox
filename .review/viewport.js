// A persistent instrument. Destinations change only counting time and the
// explanation; every visual control remains under the observer's control.
const oldShell=document.querySelector('.shell');
const stage=document.createElement('main');stage.id='clockApp';stage.innerHTML=`
 <header class="clock-title">Clock of Primes</header>
 <section id="clockStage" aria-label="Continuous clock of primes"></section>
 <div class="corner north-west"><button popovertarget="observeBubble">Observe</button></div>
 <div class="corner north-east"><button popovertarget="viewBubble">View</button></div>
 <div class="corner south-west" id="transportCorner"></div>
 <div class="corner south-east"><button popovertarget="tuneBubble">Tune s &amp; pace</button></div>
 <nav id="destinations" aria-label="Clock destinations"></nav>
 <section id="observeBubble" class="bubble observe-bubble" popover="manual" aria-label="Observation notes">
  <div class="bubble-head"><b id="observationTitle">Watch before predicting</b><button popovertarget="observeBubble" popovertargetaction="hide" aria-label="Close observation">×</button></div>
  <div id="observationBeats" class="button-row" aria-label="Visit an opening beat"></div>
  <p id="observationText">Watch the first six beats. Each number is a place to observe, with no questions to pass.</p>
  <p id="liveObservation" class="muted" aria-live="off"></p>
 </section>
 <section id="viewBubble" class="bubble view-bubble" popover="manual" aria-label="View controls">
  <div class="bubble-head"><b>Your view</b><button popovertarget="viewBubble" popovertargetaction="hide" aria-label="Close view controls">×</button></div>
  <div id="layerButtons" class="button-row"></div><div id="orientationButtons" class="button-row"></div>
  <label for="radialDial">Clock ruler <output id="rulerLabel">Original</output></label><div id="rulerSlot"></div>
  <label for="separateDial">Separate sum <output id="separationLabel">Together</output></label><div id="splitSlot"></div>
  <p class="muted">One sum unit = one radius. Separation moves the sum into an inset with its own unit circle. Lessons never change these settings.</p>
 </section>
 <section id="tuneBubble" class="bubble tune-bubble" popover="manual" aria-label="Complex weights and clock pace">
  <div class="bubble-head"><b>Weights &amp; pace</b><button popovertarget="tuneBubble" popovertargetaction="hide" aria-label="Close tuning">×</button></div>
  <label for="sigmaDial">Length · σ <output id="liveSigma"></output></label><div id="sigmaSlot"></div>
  <label for="tauDial">Direction · τ <output id="liveTau"></output></label><div id="tauSlot"></div>
  <div id="zeroShortcut" class="button-row"></div>
  <label for="zeroDial">Prime-count zero pairs <output id="liveZeroCount"></output></label><div id="zerosSlot"></div>
  <label for="speed">Beats / second <output id="liveSpeed"></output></label><div id="speedSlot"></div>
  <div class="number-row"><label for="frontier">Go to beat</label><span id="frontierSlot"></span><label for="reach">Timeline end</label><span id="reachSlot"></span></div>
  <p class="muted" id="sumReadout">Length n⁻σ · angle −τ log n. These dials do not move the clock.</p>
 </section>`;
document.body.appendChild(stage);
const relocate=(id,host)=>$(host).appendChild($(id));
relocate('cv','clockStage');relocate('originalProof','clockStage');
const frameEl=$('cv');
const readout=document.createElement('div');readout.className='compact-count';relocate('now','transportCorner');
readout.appendChild($('now'));readout.appendChild($('fac'));$('transportCorner').appendChild(readout);
const transport=document.querySelector('.transport');$('transportCorner').appendChild(transport);
for(const id of ['reset','previousBeat','play','stepBeat'])transport.appendChild($(id));
$('previousBeat').textContent='← 1';$('stepBeat').textContent='1 →';$('reset').textContent='Start';
$('transportCorner').appendChild(document.querySelector('.scrubber'));
for(const [id,host] of [['spec','layerButtons'],['sumLens','layerButtons'],['continueLens','layerButtons'],['stair','layerButtons'],['zeroVisit','zeroShortcut'],['zeroDial','zerosSlot'],['reflect','orientationButtons'],['sound','orientationButtons'],['radialDial','rulerSlot'],['separateDial','splitSlot'],['sigmaDial','sigmaSlot'],['tauDial','tauSlot'],['speed','speedSlot'],['frontier','frontierSlot'],['reach','reachSlot']])relocate(id,host);
$('spec').textContent='Glass';$('sumLens').textContent='Sum';$('continueLens').textContent='Tail';
for(const id of ['sigmaDial','tauDial','zeroDial','speed']){const label=$('tuneBubble').querySelector('label[for="'+id+'"]'),slot=label.nextElementSibling,group=document.createElement('div');group.className='tune-control';label.before(group);group.append(label,slot);}
$('stair').textContent='Prime count';$('zeroVisit').textContent='Tune to first zero';
$('zeroVisit').onclick=()=>{tune(.5,heights[0]);};
$('reflect').textContent='Reflect axes';
$('reflect').onclick=()=>{reflectionAim=1-reflectionAim;$('reflect').setAttribute('aria-pressed',String(!!reflectionAim));};
$('spec').onclick=()=>{specMode=specMode?0:1;$('spec').setAttribute('aria-pressed',String(!!specMode));};
oldShell.hidden=true;
// Disable the old chapter machinery; no handler can reinstall quiz gates or
// silently retune a user's layers when visiting a preset.
gameMode='observe';viewIndex=0;unlocked=6;puzzleAttempt=null;focusAim=0;
bringIntoView=()=>{};cancelPrediction=()=>{prediction=null;};
const observations=[
 'Watch one full lap of the second hand. The next term reaches the equals sign on the same beat.',
 'At 2, a half-speed arc starts growing. Use one beat forward to watch it print a half-circle.',
 'At 3, the arc for 2 finishes printing as 3 begins. Watch the handoff, then replay it backward.',
 'At 4, the extra pane belongs to 2: two copies of the same prime. Glass reveals the repeated factor.',
 'At 5, watch whether an older arc catches the meeting ray. Compare it with 4 before making a rule.',
 'At 6, two different primes meet the ray together. You have now seen a prime, a repeated prime, and a product of different primes.'
];
function visitObservation(n){lesson=n;$('observationTitle').textContent='Observe beat '+n;$('observationText').textContent=observations[n-1];moveClock(n);}
for(let n=1;n<=6;n++){const b=document.createElement('button');b.textContent=n;b.setAttribute('aria-label','Observe beat '+n);b.onclick=()=>visitObservation(n);$('observationBeats').appendChild(b);}
const destinations=[
 ['puzzleMode','First beats',1,'Watch before predicting','Observe beats 1–6 with the one-beat controls. Nothing needs an answer before you can continue.'],
 ['twinMode','Twin primes',10,'11 and 13','Step from 10 through 11, 12 and 13. Compare the two new prime arcs with the panes at 12.'],
 ['eulerMode','Euler',30,'Follow the equals sign','Watch terms enter the product. Active prime factors glow; nearby factors remain visible when there is room.'],
 ['zetaMode','Zeta',64,'Give the sum a direction','Turn on Sum in View, then explore σ and τ in Tune. Tail adds the integral spiral. These choices remain yours.']
];
for(const [id,label,n,title,copy] of destinations){const b=document.createElement('button');b.id=id;b.textContent=label;b.onclick=()=>{for(const el of $('destinations').children)el.removeAttribute('aria-current');b.setAttribute('aria-current','page');$('observationTitle').textContent=title;$('observationText').textContent=copy;moveClock(n);};$('destinations').appendChild(b);}
// The legacy route has the same IDs; remove it now that its handlers are retired.
route.remove();
openLesson=(n,travel=true)=>{if(travel)visitObservation(Math.max(1,Math.min(6,n)));};
openMath=()=>moveClock(64);chooseView=openMath;openTwins=()=>moveClock(10);
updateStory=function(){
 const n=Math.floor(t);$('liveObservation').textContent=n===1?'Beat 1 · the unit term.':isPrime(n)?'Beat '+n+' · a new prime rhythm.':'Beat '+n+' · '+factorize(n).join(' × ')+'.';
};
drawBeatLabels=function(){};
updateGuide=function(){
 const target=clockTween?clockTween.to:t;
 $('previousBeat').disabled=target<=1;$('stepBeat').disabled=target>=limit;
 if(document.activeElement!==$('frontier'))$('frontier').value=target.toFixed(2);
 if(target>+$('scrub').max){$('scrub').max=Math.min(limit,Math.ceil(target/40)*40);$('reach').value=$('scrub').max;}
 if(document.activeElement!==$('scrub'))$('scrub').value=target;
 $('scrubEnd').textContent=$('scrub').max;
 $('liveSigma').textContent=SIGMA.toFixed(2);$('liveTau').textContent=TAUV.toFixed(2);$('liveSpeed').textContent=$('speed').value;
 $('liveZeroCount').textContent=$('zeroDial').value;
 if(sumMix>.01){const z=continuumSum(t,SIGMA,TAUV).z;$('sumReadout').textContent='Sum '+z[0].toFixed(3)+(z[1]<0?' − ':' + ')+Math.abs(z[1]).toFixed(3)+'i'+(abs(z)>1?' · beyond the unit circle.':' · inside the unit circle.');}
 else $('sumReadout').textContent='Length n⁻σ · angle −τ log n. These dials do not move the clock.';
 $('rulerLabel').textContent=radialAim<.01?'Original':radialAim>.99?'Outward log':'Blending';
 $('separationLabel').textContent=separateAim<.01?'Together':separateAim>.99?'Inset':'Separating';
 $('spec').classList.toggle('on',!!specMode);
 dockTape();
};
// Dock the tape outside the rim. In narrow portrait views the reflected clock
// slides slightly left to leave enough room for upright equation ink.
dockTape=function(){
 const u=(1-Math.cos(Math.PI*reflectionMix))/2;
 $('clockStage').style.setProperty('--clock-shift',u*Math.max(0,64-(innerWidth-.8*Math.min(innerWidth,innerHeight))/2)+'px');
 const c=$('cv').getBoundingClientRect();
 const angle=Math.atan2(u,1-u)*180/Math.PI,r=R/W*c.width,cx=c.left+c.width/2,cy=c.top+c.height/2;
 const ex=cx+u*(r+32),ey=cy-(1-u)*(r+14),proof=$('originalProof'),work=proof.querySelector('.work');
 proof.style.left=ex+'px';proof.style.top=ey+'px';
 work.style.transform='rotate('+(-angle)+'deg)';work.style.setProperty('--counter-turn',angle+'deg');
};
// Keep the drawing rectangle square; separation is an inset, never a new page.
updateGeometry=function(dt){const e=1-Math.exp(-dt*5);radialMix+=(radialAim-radialMix)*e;separateMix+=(separateAim-separateMix)*e;};
$('cv').height=W;
// Start is the one intentional snap. Everything else moves through t.
stepClock=function(direction){const from=clockTween&&clockTween.kind==='step'?clockTween.to:t;moveClock(Math.max(1,Math.min(limit,from+direction)));clockTween.kind='step';clockTween.duration=.48;};
moveClock=function(value,after=null){const to=Math.max(1,Math.min(limit,Number(value)));if(!Number.isFinite(to))return;stopAt=null;window.__run=false;clearVoices();clockTween={from:t,to,elapsed:0,duration:.5,after};$('play').textContent='Pause';};
seekFrontier=function(value){moveClock(value);if(clockTween){clockTween.kind='scrub';clockTween.duration=.28;}};
// No layers, layout or tuning is changed by visiting a destination.
weightAim=0;sumAim=0;continueAim=0;focusAim=0;stairOn=false;specMode=1;
syncLenses();updateGuide();updateStory();
