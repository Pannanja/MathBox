let gameMode='puzzles',lesson=1,unlocked=1,reflectionAim=0,reflectionMix=0;
const solved=new Set(),observed=new Set(),answers=new Map();let puzzleAttempt=null;
const levels=[
 {title:'Meet the second hand.',clue:'One trip around the rim. One term into the equals sign.',question:'Your first move: watch one whole cycle.',choices:[],answer:0,reveal:'One lap, one beat. Everything else will keep time with this hand.'},
 {title:'A slower companion.',clue:'The 2-panel has just started printing. Predict where its leading edge will go in one beat.',question:'How far will 2 turn?',choices:['Half a circle','A whole circle'],answer:0,reveal:'The second hand makes a full lap; 2 makes half a lap. Its half-circle panel takes this whole beat to print.'},
 {title:'Catch the handoff.',clue:'The 2-panel has finished printing. Something new begins at the meeting line.',question:'Which panel prints during this beat?',choices:['Another 2-panel','A new 3-panel'],answer:1,reveal:'2 finishes as 3 begins. The handoff happens on the same beat, without a second clock.'},
 {title:'Same prime. Another pane.',clue:'4 is not prime. Watch the new panel: its glass belongs to 2.',question:'What does the second red pane mean?',choices:['A new prime, 4','A second factor of 2'],answer:1,reveal:'The panels at 2 and 4 each carry one pane of 2. Together they read 2 × 2. A power gets a real panel.'},
 {title:'Test your rule.',clue:'The older panels have had their chance to catch 5 at the meeting line.',question:'Does 5 get its own prime panel?',choices:['Yes — nothing older catches it','No — 2 catches it'],answer:0,reveal:'The meeting line is open at 5. A new prime panel prints while its factor enters the product.'},
 {title:'Two different primes.',clue:'This time the meeting line crosses two different colours.',question:'Which panes make 6?',choices:['Two panes of 2','One pane of 2 and one of 3'],answer:1,reveal:'2 × 3 = 6. Repeated colours count powers; different colours combine different primes.'}
];
const mathView=chooseView;
const levelTray=document.createElement('div');levelTray.className='level-tray';levelTray.id='levelTray';document.querySelector('.story').prepend(levelTray);
const route=$('route');route.innerHTML='';
for(const [id,label,action] of [['puzzleMode','Six beats',()=>openLesson(lesson)],['twinMode','Twin primes',()=>openTwins()],['eulerMode','Euler’s product',()=>openMath(2)],['zetaMode','Toward zeta',()=>openMath(3)]]){const b=document.createElement('button');b.id=id;b.textContent=label;b.onclick=action;route.appendChild(b);}
function markMode(id){for(const b of route.children){if(b.id===id)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');}}
function coreTargets(){weightAim=sumAim=continueAim=focusAim=0;stairOn=false;tune(2,0);specMode=lesson>=4||unlocked>=4||gameMode==='twins'?1:0;syncLenses();}
function openLesson(n,travel=true){
 gameMode='puzzles';lesson=Math.max(1,Math.min(6,unlocked,n));viewIndex=0;prediction=null;puzzleAttempt=null;coreTargets();markMode('puzzleMode');
 if(travel&&Math.abs(t-lesson)>1e-9)moveClock(lesson);
 renderPuzzle();
}
function renderPuzzle(){
 const l=levels[lesson-1];levelTray.hidden=false;levelTray.innerHTML='';
 for(let n=1;n<=6;n++){const b=document.createElement('button');b.textContent=solved.has(n)?'✓ '+n:String(n);b.setAttribute('aria-label','Beat '+n+(solved.has(n)?', solved':''));b.disabled=n>unlocked;b.className=n===lesson?'selected':'';b.onclick=()=>openLesson(n);levelTray.appendChild(b);}
 $('chapterLabel').textContent='PUZZLE '+lesson+' / 6';$('viewline').textContent=l.title;$('storyText').textContent=l.clue;
 $('canvasTag').textContent='CLOCK OF PRIMES';$('reading').hidden=true;
 $('interaction').innerHTML='<p class="prompt">'+l.question+'</p><div class="puzzle-choices">'+l.choices.map((c,i)=>'<button data-choice="'+i+'" aria-pressed="'+(answers.get(lesson)===i)+'">'+c+'</button>').join('')+'</div><p class="puzzle-instruction">'+(l.choices.length?'Choose, then use <b>One beat →</b>.':'Press <b>One beat →</b> below the clock.')+'</p><p id="puzzleFeedback" role="status"></p><button id="returnToLesson" class="quiet" hidden>Return to beat '+lesson+'</button>';
 for(const b of document.querySelectorAll('[data-choice]'))b.onclick=()=>{answers.set(lesson,+b.dataset.choice);for(const other of document.querySelectorAll('[data-choice]'))other.setAttribute('aria-pressed',String(other===b));if(observed.has(lesson)&&answers.get(lesson)===l.answer)solveLesson();else $('puzzleFeedback').textContent='Prediction set. Watch the clock decide.';};
 $('returnToLesson').onclick=()=>moveClock(lesson);
 $('backView').disabled=lesson===1;$('backView').onclick=()=>openLesson(lesson-1);
 $('nextView').onclick=()=>lesson<6?openLesson(lesson+1):openTwins();
 $('nextView').innerHTML=(lesson<6?'Next puzzle':'Try twin primes')+'<span>→</span>';
 $('nextView').disabled=!solved.has(lesson);
 if(solved.has(lesson))$('puzzleFeedback').textContent=l.reveal;
 $('legend').innerHTML='<span><i class="dot"></i>second hand</span><span><i class="dot red"></i>meeting ray</span>';
}
function solveLesson(){solved.add(lesson);unlocked=Math.min(6,Math.max(unlocked,lesson+1));$('puzzleFeedback').textContent='✓ '+levels[lesson-1].reveal;$('nextView').disabled=false;for(const [i,b] of [...levelTray.children].entries()){b.disabled=i+1>unlocked;if(solved.has(i+1))b.textContent='✓ '+(i+1);}}
function stepClock(direction){
 const from=clockTween&&clockTween.kind==='step'?clockTween.to:t;
 const target=Math.max(1,Math.min(limit,from+direction));
 if(gameMode==='puzzles'&&direction===1&&Math.abs(from-lesson)<1e-8){puzzleAttempt={lesson,target};}
 else if(direction<0)puzzleAttempt=null;
 prediction=null;moveClock(target);clockTween.kind='step';bringIntoView(document.querySelector('.instrument'));
}
function instantStart(){
 clockTween=null;stopAt=null;window.__run=false;puzzleAttempt=null;prediction=null;reset();advanceClock(1,performance.now());PR.update(1);$('play').textContent='Play';updateGuide();updateStory();
}
const pairs=[];for(let p=3;p<=100;p++)if(isPrime(p)&&isPrime(p+2))pairs.push([p,p+2]);let twinIndex=0;
function openTwins(index=twinIndex,travel=true){
 gameMode='twins';twinIndex=(index+pairs.length)%pairs.length;viewIndex=0;prediction=null;coreTargets();specMode=1;markMode('twinMode');levelTray.hidden=true;
 const [p,q]=pairs[twinIndex];
 $('chapterLabel').textContent='STUDY A PAIR';$('viewline').textContent=p+' and '+q+'. What happens between?';$('storyText').textContent='Two primes, two beats apart. Step through the first prime, the number between, and the second prime. Watch which older panes catch the middle.';
 $('interaction').innerHTML='<div class="twin-strip">'+[p,p+1,q].map(n=>'<button data-twin="'+n+'">'+n+'<small>'+(isPrime(n)?'prime':factorize(n).join(' × '))+'</small></button>').join('')+'</div><p class="puzzle-instruction">Each number below is a destination. The clock travels there continuously.</p><div class="choice-row"><button id="earlierPair">← Earlier pair</button><button id="laterPair">Later pair →</button></div><p id="twinRead" role="status"></p>';
 for(const b of document.querySelectorAll('[data-twin]'))b.onclick=()=>moveClock(+b.dataset.twin);
 $('earlierPair').onclick=()=>openTwins(twinIndex-1);$('laterPair').onclick=()=>openTwins(twinIndex+1);
 $('backView').disabled=false;$('backView').onclick=()=>openLesson(6);$('nextView').disabled=false;$('nextView').innerHTML='Follow Euler’s product <span>→</span>';$('nextView').onclick=()=>openMath(2);
 if(travel)moveClock(Math.max(1,p-1));
 $('legend').innerHTML='<span><i class="dot"></i>second hand</span><span><i class="dot red"></i>one pane per prime-power divisor</span>';
}
function openMath(i){gameMode='math';levelTray.hidden=true;mathView(i);specMode=i===2?1:0;markMode(i===2?'eulerMode':'zetaMode');$('nextView').disabled=false;$('backView').disabled=false;$('nextView').onclick=()=>i<6?openMath(i+1):openLesson(1);$('backView').onclick=()=>i>2?openMath(i-1):openTwins(twinIndex,false);}
chooseView=openMath;
const baseGuide=updateGuide;
updateGuide=function(){
 baseGuide();
 const target=clockTween?clockTween.to:t;$('previousBeat').disabled=target<=1;$('stepBeat').disabled=target>=limit;
 $('orientationRead').textContent=reflectionAim?'Reflected: real → · imaginary ↑ · second hand counterclockwise':'Clock: real ↑ · imaginary → · second hand clockwise';
 if(gameMode==='puzzles'){
  if(puzzleAttempt&&t>=puzzleAttempt.target-1e-8){const n=puzzleAttempt.lesson;puzzleAttempt=null;observed.add(n);if(n===lesson){if(lesson===1||answers.get(lesson)===levels[lesson-1].answer)solveLesson();else $('puzzleFeedback').textContent='Look at the panes. You can change your prediction, or step back to watch again.';}}
  if($('returnToLesson'))$('returnToLesson').hidden=(t>=lesson-1e-8&&t<=lesson+1+1e-8)||!!clockTween;
 }else if(gameMode==='twins'){
  const n=Math.floor(t),p=pairs[twinIndex][0];for(const b of document.querySelectorAll('[data-twin]'))b.classList.toggle('current',+b.dataset.twin===n);
  $('twinRead').textContent=n>=p&&n<=p+2?(isPrime(n)?n+': a new prime pane.':n+': '+crossedPanes(n).map(r=>r.base||r.p).join(' × ')+' across the meeting ray.'):'Approach the pair, then use one beat at a time.';
 }
 const panes=crossedPanes(Math.floor(t));$('paneRead').hidden=glassMix<.02;
 $('paneRead').textContent=panes.length?panes.map(r=>r.p+(r.echo?' ['+(r.base)+' again]':'')).join(' → ')+' · panes give '+panes.map(r=>r.base||r.p).join(' × '):'No panes crossed.';
};
$('previousBeat').onclick=()=>stepClock(-1);$('stepBeat').onclick=()=>stepClock(1);
$('reflect').onclick=()=>{reflectionAim=reflectionAim?0:1;$('reflect').setAttribute('aria-pressed',String(!!reflectionAim));$('reflect').textContent=reflectionAim?'Return to clock view':'Reflect to complex plane';};
document.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)||e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();stepClock(e.key==='ArrowLeft'?-1:1);}});
// The diagonal reflection swaps the real/imaginary axes. Projecting a smooth
// half-turn around that diagonal lets the view turn over without teleporting.
const nativeText=g2.fillText.bind(g2);
g2.fillText=function(text,x,y,...rest){const m=g2.getTransform(),X=m.a*x+m.c*y+m.e,Y=m.b*x+m.d*y+m.f;g2.save();g2.setTransform(1,0,0,1,0,0);const w=g2.measureText(text).width;let xx=X;if(g2.textAlign==='center')xx=Math.max(w/2+4,Math.min(W-w/2-4,X));nativeText(text,xx,Math.max(15,Math.min(W-10,Y)),...rest);g2.restore();};
function beginReflection(dt){reflectionMix+=(reflectionAim-reflectionMix)*(1-Math.exp(-dt*5));const c=Math.cos(Math.PI*reflectionMix),a=(1+c)/2,b=-(1-c)/2;g2.save();g2.transform(a,b,b,a,C*(1-a-b),C*(1-a-b));}
function endReflection(){g2.restore();}
// Carry the tape's direction and equals sign with the reflected meeting ray.
// Counter-rotate the ink, preserving the readable mathematical expressions.
const tapeBridge=document.createElementNS('http://www.w3.org/2000/svg','svg');tapeBridge.classList.add('tape-bridge');tapeBridge.setAttribute('aria-hidden','true');
const bridgePath=document.createElementNS('http://www.w3.org/2000/svg','path');bridgePath.setAttribute('fill','none');bridgePath.setAttribute('stroke-width','1.5');tapeBridge.appendChild(bridgePath);document.querySelector('.instrument').appendChild(tapeBridge);
function dockTape(){
 const host=document.querySelector('.instrument').getBoundingClientRect(),frame=$('cv').getBoundingClientRect(),proof=$('originalProof').getBoundingClientRect(),work=$('originalProof').querySelector('.work');
 const u=(1-Math.cos(Math.PI*reflectionMix))/2,angle=Math.atan2(u,1-u)*180/Math.PI;
 const bx=proof.left+proof.width/2,by=proof.top+work.offsetHeight/2,r=R/W*frame.width,cx=frame.left+frame.width/2,cy=frame.top+frame.height/2;
 const gap=innerWidth<=650?10:20,ex=bx+u*(cx+r+gap-bx),ey=by+u*(cy-by);
 work.style.transformOrigin='50% 50%';work.style.transform='translate('+(ex-bx)+'px,'+(ey-by)+'px) rotate('+(-angle)+'deg)';
 work.style.setProperty('--counter-turn',angle+'deg');
 const rx=cx+u*r,ry=cy-(1-u)*r;
 bridgePath.setAttribute('d','M'+(ex-host.left)+' '+(ey-host.top)+' L'+(rx-host.left)+' '+(ry-host.top));bridgePath.setAttribute('stroke',factorColour(Math.floor(t)));bridgePath.setAttribute('opacity','.45');
 tapeBridge.setAttribute('viewBox','0 0 '+host.width+' '+host.height);
}
const beforeDock=updateGuide;updateGuide=function(){beforeDock();dockTape();};
journey[2].text='Each crossed pane contributes one copy of its prime. At 12, the panes at 2, 3 and 4 give 2 × 3 × 2.<br><br>Their weights multiply to the weight of 12. <strong>Now follow the tape:</strong> prime terms arrive, panels print, and sieve factors grow beside ζ(s).';
openLesson(1,false);
