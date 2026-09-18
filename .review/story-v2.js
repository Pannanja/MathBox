// Chapters change destinations of lenses, never the current geometry or count.
let stopAt=null,soundOn=false,prediction=null,answered=false,challengeTarget=2;
let storyStamp='',negativeValue=-2;
const journey=[
 {name:'The beat',title:'One clock. Every part stays in time.',text:'Follow the white body around the rim. Each lap is one beat.<br><br>A prime panel begins at the red meeting line and grows for one whole beat. The 2-panel turns once every two beats; the 3-panel once every three.<br><br><strong>Above the clock, the next sum term reaches the equals sign on that same beat.</strong>',sigma:2,tau:0,focus:0},
 {name:'Find primes',title:'Watch the next term arrive.',text:'The 2-panel catches 4, 6, 8… The 3-panel catches 6, 9, 12…<br><br>When a term arrives, an older panel either catches the meeting line or leaves it open. <strong>An open line begins a new prime panel.</strong> Nothing changes clocks between these events.',sigma:2,tau:0,focus:0},
 {name:'The product',title:'The sieve writes its own product.',text:'Keep your eye on the equals sign. When a prime term arrives, its panel begins growing and its factor enters the right-hand side.<br><br><strong>The same prime strikes its later multiples from the tape.</strong> Each new factor removes another family of terms from the series. Follow that continuous exchange.',sigma:2,tau:0,focus:0},
 {name:'Turn',title:'Give the arriving terms a direction.',text:'The tape and the panels keep the same beat. Now give each arriving term a complex weight: an arrow with length n⁻ˢ when s is real, and a direction when s has an imaginary part.<br><br>At an integer beat, the mint chain contains the terms through that integer. <strong>Gold marks the limiting value ζ(s).</strong>',sigma:2,tau:0,sum:1,focus:.55},
 {name:'Continue',title:'Let the tail follow the drifting sum.',text:'Lower the shrink value through 1. The ordinary infinite sum stops converging, but the finite terms still arrive on the beat.<br><br><strong>Coral adds a compensating tail to the mint chain.</strong> At integer beats, its endpoint approaches the continued zeta value as the count grows.',sigma:.5,tau:8,sum:1,cont:1,focus:.65},
 {name:'Zeros',title:'Turn the gold point toward zero.',text:'At a zero, both coordinates of the gold point vanish: it reaches the center. The finite corrected sum can still miss the center.<br><br><strong>The Riemann hypothesis says every nontrivial zero has real part ½.</strong> Moving along that line explores known zeros; it cannot establish that none exist elsewhere.',sigma:.5,tau:13.6,sum:1,cont:1,focus:.7},
 {name:'Prime echoes',title:'Compare a count with its zero frequencies.',text:'The gold ledger is ψ: each prime-power birth contributes log p. Here its deviation from a smooth trend is compared with a chain of zero frequencies.<br><br><strong>The mint projection approximates the gold deviation.</strong> These frequencies are supplied known zeros, not something the panels have derived.',sigma:.5,tau:14.134725141734695,stair:true,focus:.65}
];
const stops=[];
journey.forEach((stop,index)=>{const b=document.createElement('button');b.type='button';b.className=index>2?'beyond':'';b.innerHTML='<span class="seed">'+(index+1)+'</span>'+stop.name;b.onclick=()=>chooseView(index);$('route').appendChild(b);stops.push(b);});
const more=document.createElement('button');more.className='more-route';more.textContent='Toward Riemann →';more.onclick=()=>chooseView(3);$('route').appendChild(more);
function chooseView(index){
 viewIndex=Math.max(0,Math.min(6,index));const stop=journey[viewIndex];
 if(viewIndex>2){document.body.classList.add('beyond');more.hidden=true;}
 prediction=null;answered=false;
 // Keep the continuous state intact. Only targets change, using the same easing
 // as the instrument. No seek, reset, tape rebuild, or scene substitution.
 weightAim=0;sumAim=stop.sum||0;continueAim=stop.cont||0;focusAim=stop.focus;powerPanesOn=false;psiStairAim=stop.stair?1:psiStairAim;
 tune(stop.sigma,stop.tau);syncLenses();
 $('chapterLabel').textContent=(viewIndex<3?'Follow the construction':'Beyond the sieve')+' / '+String(viewIndex+1).padStart(2,'0');
 $('viewline').textContent=stop.title;$('storyText').innerHTML=stop.text;
 $('backView').disabled=viewIndex===0;$('nextView').innerHTML=(viewIndex===6?'Return to the beat':journey[viewIndex+1].name)+'<span aria-hidden="true">→</span>';
 stops.forEach((b,i)=>{if(i===viewIndex)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 $('canvasTag').textContent=viewIndex<3?'THE COUNTING CLOCK':viewIndex===6?'CLOCK + PRIME-POWER LEDGER':'CLOCK + COMPLEX WEIGHTS';
 $('legend').innerHTML=viewIndex<3?'<span><i class="dot"></i>one lap = one beat</span><span><i class="dot red"></i>the meeting line</span>':viewIndex===6?'<span><i class="dot gold"></i>counted deviation</span><span><i class="dot mint"></i>zero approximation</span>':'<span><i class="dot mint"></i>finite sum</span>'+(viewIndex>3?'<span><i class="dot coral"></i>tail corrected</span>':'')+'<span><i class="dot gold"></i>ζ(s)</span>';
 renderInteraction();storyStamp='';updateStory();
}
function guide(label,min,max,step,value,left,right){return '<div class="guide"><label for="storyDial">'+label+'<output id="storyDialRead">'+value.toFixed(2)+'</output></label><input id="storyDial" type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+value+'"><div class="limits"><span>'+left+'</span><span>'+right+'</span></div></div>';}
function renderInteraction(){
 const host=$('interaction');
 if(viewIndex===0){
  host.innerHTML='<p class="prompt">A term, a panel, a beat.</p><p>Watch a panel print while its factor grows beside ζ(s). Replaying first rewinds the same clock continuously.</p><button id="watchBirth">Watch the first panel grow</button><p class="feedback" id="beatCaption"></p>';
  $('watchBirth').onclick=()=>{prediction=null;moveClock(1,()=>{if(viewIndex===0)runUntil(3.35);});bringIntoView(document.querySelector('.instrument'));};
 }else if(viewIndex===1){
  host.innerHTML='<p class="prompt" id="challengePrompt"></p><div class="choice-row"><button id="guessCaught">Caught by a panel</button><button id="guessPrime">New prime</button></div><p class="feedback" id="feedback" role="status">Predict the next arrival. The clock will play through it.</p><button id="another" hidden>Watch another arrival →</button>';
  $('guessCaught').onclick=()=>predict(false);$('guessPrime').onclick=()=>predict(true);$('another').onclick=()=>{prediction=null;answered=false;renderInteraction();};
 }else if(viewIndex===2){
  host.innerHTML='<p class="prompt">Follow six terms through the equals sign.</p><button id="followTerms">Follow the tape</button><div class="product-equality">remaining series<br>= (1 − 2⁻ˢ)(1 − 3⁻ˢ) … ζ(s)</div><p class="guide-hint">After sieving by every prime, only the term 1 remains. Dividing by those factors gives Euler’s product.</p><details><summary>The resulting identity</summary><div class="product-equality">ζ(s) = ∏<sub>p prime</sub> 1 / (1 − p⁻ˢ)</div><p class="guide-hint">Here s moves toward 2. The infinite sum and product converge for Re(s) &gt; 1. The moving tape above remains the same sieve throughout.</p></details>';
  $('followTerms').onclick=()=>runUntil(t+6);
 }else if(viewIndex===3){
  host.innerHTML=guide('Turn τ · real part fixed at 2',0,20,.01,tauAim,'Aligned','Winding')+'<p class="guide-hint">Length n⁻²; angle −τ log n. Up = real, right = imaginary. Changing this dial turns the weights continuously; it does not advance counting time.</p><button id="growChain">Let 12 more terms arrive</button>';
  $('storyDial').oninput=e=>tune(2,+e.target.value);$('growChain').onclick=()=>runUntil(t+12);
 }else if(viewIndex===4){
  host.innerHTML=guide('Shrink σ · imaginary part fixed at 8',.2,2,.01,sigmaAim,'Long arrows','Short arrows')+'<button id="moreTerms">Let 12 more terms arrive</button><p class="guide-hint">The gap to gold is finite-count error. The compensating tail is supported for σ &gt; 0; the imaginary part stays at 8, away from the pole at s = 1.</p>';
  $('storyDial').oninput=e=>tune(+e.target.value,8);$('moreTerms').onclick=()=>runUntil(t+12);
 }else if(viewIndex===5){
  host.innerHTML=guide('Turn τ · real part fixed at ½',12,16.5,.0001,tauAim,'12','16.5')+'<p id="zeroDistance" class="feedback"></p><button id="land">Turn to the first known zero</button><p class="guide-hint" style="margin-top:14px">Known height ≈ 14.134725. The gold value is computed numerically; the hypothesis remains unproved.</p>';
  $('storyDial').oninput=e=>tune(.5,+e.target.value);$('land').onclick=()=>{tune(.5,heights[0]);$('storyDial').value=heights[0];};
 }else{
  host.innerHTML=guide('Known zero pairs',1,30,1,+$('zeroDial').value,'One frequency','Thirty frequencies')+'<p class="guide-hint">New vectors grow in continuously. At prime-power jumps, the infinite reconstruction gives the midpoint; finite sums ring near those jumps.</p><button id="countOn">Count 12 more beats</button>';
  $('storyDial').oninput=e=>{$('zeroDial').value=e.target.value;};$('countOn').onclick=()=>runUntil(t+12);
 }
}
function bringIntoView(element){if(matchMedia('(max-width:650px)').matches)element.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}
function runUntil(target){clockTween=null;stopAt=Math.min(limit,target);window.__run=t<stopAt;$('play').textContent=window.__run?'Pause':'Play';if(soundOn&&window.__run)unlock();bringIntoView(document.querySelector('.instrument'));}
function predict(guess){
 challengeTarget=Math.floor(t)+1;prediction=guess;answered=false;
 $('challengePrompt').textContent='At beat '+challengeTarget+': caught or new prime?';
 $('guessCaught').disabled=true;$('guessPrime').disabled=true;$('feedback').textContent='Follow the term into the equals sign…';runUntil(challengeTarget+.65);
}
function cancelPrediction(){
 if(viewIndex!==1)return;
 prediction=null;answered=false;renderInteraction();
}
function updateGuide(){
 if(document.activeElement!==$('frontier'))$('frontier').value=(clockTween?clockTween.to:t).toFixed(2);
 const extent=clockTween?Math.max(t,clockTween.to):t;
 if(extent>+$('scrub').max){$('scrub').max=String(Math.min(limit,Math.ceil(extent/40)*40));$('reach').value=$('scrub').max;}
 if(document.activeElement!==$('scrub'))$('scrub').value=String(clockTween?clockTween.to:t);
 $('scrubEnd').textContent=$('scrub').max;
 $('motionRead').textContent=clockTween?(clockTween.to<t?'Rewinding':'Moving')+' through '+t.toFixed(2)+' → '+clockTween.to.toFixed(2):'Counting time '+t.toFixed(2);
 if($('storyDialRead'))$('storyDialRead').textContent=viewIndex===6?zeroCount.toFixed(1):(viewIndex===4?SIGMA:TAUV).toFixed(viewIndex===5?4:2);
 if($('zeroDistance'))$('zeroDistance').textContent='Gold’s distance from the center: '+abs(reference).toFixed(5)+(abs(reference)<.0001?' · zero to numerical precision.':'');
 if($('challengePrompt')&&prediction===null){challengeTarget=Math.floor(t)+1;$('challengePrompt').textContent=t>=limit?'End of the count. Rewind to continue.':'At beat '+challengeTarget+': caught or new prime?';$('guessCaught').disabled=t>=limit;$('guessPrime').disabled=t>=limit;}
 negativeValue+=(+$('negativeS').value-negativeValue)*.08;drawTrivial(negativeValue);
}
function updateStory(){
 const n=Math.floor(t),key=viewIndex+':'+n+':'+answered;
 if(viewIndex===1&&prediction!==null&&!answered&&n>=challengeTarget){
  answered=true;const p=isPrime(challengeTarget),f=[...new Set(factorize(challengeTarget))];
  $('feedback').textContent=(prediction===p?'Yes. ':'Watch the meeting line: ')+(p?'No older panel catches '+challengeTarget+'. Its prime panel begins as its term arrives.':challengeTarget+' is caught by '+f.join(' and ')+'. Its term is struck on the tape.');$('another').hidden=false;
 }
 if(storyStamp===key)return;storyStamp=key;
 const message=n<2?'The term 1 begins the sum.':isPrime(n)?'Beat '+n+': a prime term arrives; its panel and factor begin growing.':'Beat '+n+': '+[...new Set(factorize(n))].join(' and ')+' catch the meeting line.';
 $('clockDescription').textContent=message;if($('beatCaption'))$('beatCaption').textContent=message;
 $('reading').hidden=viewIndex<3;
}
function drawBeatLabels(){g2.save();g2.globalAlpha=1;g2.font='22px ui-monospace, monospace';g2.textAlign='center';g2.fillStyle='#a0afa5';g2.fillText('MEETING LINE',C,24);if(viewIndex>=3&&viewIndex<=5){g2.font='21px ui-monospace, monospace';g2.fillStyle='#9bc7b1';g2.fillText('+ real',C-48,C-R+65);g2.fillText('+ imaginary',C+R-100,C+28);g2.fillStyle='#e0bd76';g2.fillText('0',C-15,C+22);}g2.restore();}
$('stepBeat').onclick=()=>{cancelPrediction();runUntil(t+1);};
$('sound').onclick=()=>{soundOn=!soundOn;if(soundOn)unlock();else clearVoices();if(master)master.gain.setTargetAtTime(soundOn?+$('vol').value/100*.9:0,ctx.currentTime,.05);$('sound').textContent=soundOn?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',String(soundOn));};
$('backView').onclick=()=>chooseView(viewIndex-1);$('nextView').onclick=()=>chooseView(viewIndex===6?0:viewIndex+1);
function drawTrivial(s){
 const x=s=>30+(s+7)/6*440,y=s=>65-42*Math.sin(Math.PI*s/2);
 if(!$('sinePath').getAttribute('d')){let d='';for(let i=0;i<=240;i++){const q=-7+i/40;d+=(i?'L':'M')+x(q).toFixed(2)+' '+y(q).toFixed(2);}$('sinePath').setAttribute('d',d);$('sineLabels').innerHTML=[-6,-4,-2].map(q=>'<text x="'+x(q)+'" y="126" text-anchor="middle">'+q+'</text><circle cx="'+x(q)+'" cy="65" r="4" fill="#e0bd76"/>').join('');}
 const v=Math.sin(Math.PI*s/2);$('negativeRead').textContent=s.toFixed(2);$('sinePoint').setAttribute('cx',x(s));$('sinePoint').setAttribute('cy',y(s));for(const [k,vv] of Object.entries({x1:x(s),x2:x(s),y1:65,y2:y(s)}))$('sineProjection').setAttribute(k,vv);
 $('trivialRead').textContent='Sine factor = '+(Math.abs(v)<1e-8?'0 · a trivial zero.':v.toFixed(4)+'. Move to −2, −4 or −6 to make the projection vanish.');
}
drawTrivial(negativeValue);
