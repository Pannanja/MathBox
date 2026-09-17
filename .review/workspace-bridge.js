// Bridge the typed presentation shell to the established continuous instrument.
let snapMode='integer',pitchMultiplier=1,displayDepth=.42,weightBrightness=false,lightMode='filter',allPaneLabels=false,jRadiusOn=false;
// The beat and the primes keep independent levels; the beat opens quiet and low.
function mixLevel(bus,value){if(bus)bus.gain.setTargetAtTime(value,ctx.currentTime,.03);}
// One hue mapping with its shape exposed: the family, how sharply it falls with
// p, how far it stretches around the wheel, and where the wheel starts.
let spectrumMode='pitch',spectrumExp=1,spectrumSpread=1,spectrumRotate=0;
hueOf=function(p){
 let h;
 if(spectrumMode==='pitch'){const l=Math.log2(p)*spectrumSpread;h=360*(l-Math.floor(l));}
 else{const lam=380+640/Math.pow(p,spectrumExp);h=270*(700-Math.min(700,lam))/320*spectrumSpread;}
 return ((h+spectrumRotate)%360+360)%360;
};
function respectSpectrum(){PR.recolor();updateSpectrum();labelAlphas.clear();}
// tau can ride the clock. The rate is tau per beat and the drive is a function
// of t, not an accumulator, so stepping back winds tau back with the count.
let tauDriveOn=true,tauRate=-1,tauOrigin={t:1,tau:0};
const driveRest='τ then rides the clock: it advances while you play, at the pace you set, and winds back when you step back. σ is untouched, so nothing changes length — every term only turns.';
function anchorTau(){tauOrigin={t:t,tau:tauAim};}
function driveTau(){
 if(!tauDriveOn)return;
 // The bound is the evaluator's, not a slider's: locusZeta grows its truncation
 // with |tau| and tune() already clamps there, so the drive runs the same range.
 const lo=-1000,hi=1000;
 const want=tauOrigin.tau+tauRate*(t-tauOrigin.t),held=Math.max(lo,Math.min(hi,want));
 if(Math.abs(held-tauAim)>1e-9){tauAim=held;$('tauDial').value=held;}
 if(Math.abs(want-held)>1e-9){
  tauDriveOn=false;$('tauDriveOn').checked=false;anchorTau();
  $('driveNote').textContent='τ stopped at '+held.toFixed(0)+', where the ζ evaluator stops being trusted. Switch it back on to carry on from here.';
 }
}
function driveText(){return 'τ is riding the clock at '+(tauRate>0?'+':'−')+Math.abs(tauRate).toFixed(2)+' per beat. Play or step, and every term turns while its length holds.';}
const priorTune=tune;
tune=function(sigma,tau){priorTune(sigma,tau);anchorTau();};
const priorAdvance=advanceClock;
advanceClock=function(next,ms){priorAdvance(next,ms);driveTau();};
let workspaceLayout='clock';const graphBounds={top:0,bottom:300,height:300};
function matchedBeat(value,direction=0){
 if(snapMode==='free')return Math.max(1,Math.min(limit,value));
 const matches=n=>snapMode==='integer'||snapMode==='prime'&&isPrime(n)||snapMode==='twin'&&isPrime(n-1)&&isPrime(n+1);
 if(direction){for(let n=direction>0?Math.floor(value+1e-8)+1:Math.ceil(value-1e-8)-1;n>=1&&n<=limit;n+=direction)if(matches(n))return n;return direction>0?limit:1;}
 let near=Math.round(value);for(let d=0;d<=limit;d++)for(const n of [near+d,near-d])if(n>=1&&n<=limit&&matches(n))return n;return value;
}
stepClock=function(direction){const from=clockTween?.kind==='step'?clockTween.to:t;const target=snapMode==='free'?from+direction:matchedBeat(from,direction);moveClock(target);clockTween.kind='step';clockTween.duration=.48;};
seekFrontier=function(value){moveClock(matchedBeat(Number(value)));if(clockTween){clockTween.kind='scrub';clockTween.duration=.32;}};
function jumpClock(value){clockTween=null;stopAt=null;window.__run=false;clearVoices();const audible=soundOn;soundOn=false;advanceClock(Math.max(1,Math.min(limit,value)),performance.now());soundOn=audible;PR.update(t);$('play').textContent='Play';}
freqOf=function(n){return pitchMultiplier*n;};
// Display colour depth is independent of sigma unless deliberately linked.
paneTransmission=function(p){const c=hueRGB(hueOf(p)),depth=weightBrightness?SIGMA:displayDepth;
 if(lightMode==='light')return c.map(v=>1-Math.exp(-depth*Math.log(p)*(.12+v)));
 const a=c.map(v=>1-v),sum=a.reduce((x,y)=>x+y,0)||1;return a.map(v=>Math.exp(-3*depth*Math.log(p)*v/sum));
};
function paneName(q){const f=factorize(q);if(f.length>1&&f.every(p=>p===f[0]))return String(f[0])+String(f.length).replace(/\d/g,n=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[n]);return String(q);}
function factoredName(n){const counts=new Map();for(const p of factorize(n))counts.set(p,(counts.get(p)||0)+1);return [...counts].map(([p,k])=>k===1?String(p):p+String(k).replace(/\d/g,n=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[n])).join(' × ');}
const labelAlphas=new Map();let labelPositions=[];
function drawPaneLabel(q,r,a){
 const selected=(typeof selectedPrime!=='undefined'&&selectedPrime===(rings.find(v=>v.p===q)?.base||q));
 const x=C+(r+18)*Math.cos(a),y=C+(r+18)*Math.sin(a),text=paneName(q);
 const priority=selected||q===Math.floor(t)||Math.floor(t)%q===0||q<=13;
 const canShow=r>35&&(allPaneLabels||priority||!labelPositions.some(p=>Math.hypot(x-p[0],y-p[1])<48));
 let alpha=labelAlphas.get(q)||0;alpha+=(Number(canShow)-alpha)*.14;labelAlphas.set(q,alpha);if(canShow)labelPositions.push([x,y]);if(alpha<.01)return;
 g2.save();g2.globalAlpha*=alpha;g2.font=(selected?'600 ':'')+'17px system-ui,sans-serif';g2.textAlign='center';g2.textBaseline='middle';g2.fillText(text,x,y);g2.restore();
}
function beamReveal(){return Math.max(0,Math.min(1,t-1));}
function drawJRadius(){if(!jRadiusOn)return;const j=jValue(t),ratio=j/t,angle=Math.PI*.72,dx=Math.cos(angle),dy=Math.sin(angle);g2.save();g2.setTransform(1,0,0,1,0,0);g2.strokeStyle='#a8c7b666';g2.lineWidth=1;g2.setLineDash([3,6]);g2.beginPath();g2.moveTo(C,C);g2.lineTo(C+R*dx,C+R*dy);g2.stroke();g2.setLineDash([]);g2.strokeStyle='#a8c7b6';g2.lineWidth=2;g2.beginPath();g2.moveTo(C,C);g2.lineTo(C+R*ratio*dx,C+R*ratio*dy);g2.stroke();g2.fillStyle='#bad8c7';g2.beginPath();g2.arc(C+R*ratio*dx,C+R*ratio*dy,4,0,7);g2.fill();g2.font='16px system-ui';g2.textAlign='center';g2.fillText('J = '+j.toFixed(2),C+R*.75*dx,C+R*.75*dy+24);g2.restore();}
function resizeWorkspace(){
 const surface=$('clockSurface');if(!surface)return;const b=surface.getBoundingClientRect();
 // Reserve a gutter for the docked tape's upright ink and slide the clock off
 // centre by half of it, so the dial and the equation share the surface.
 const gutter=Math.min(132,b.width*.24),diameter=Math.max(30,Math.min(b.width-gutter,b.height)*.94);
 surface.style.setProperty('--clock-size',diameter+'px');
 surface.style.setProperty('--clock-shift',(-gutter/2)+'px');
 surface.style.setProperty('--tape-span',Math.max(220,Math.min(560,b.height-48))+'px');
 surface.style.setProperty('--tape-thick',(innerWidth<=650?56:80)+'px');
 dockTape();
 ClockMath.resizePlot(plane,[locusRaster,locusBackdrop]);Object.assign(graphBounds,ClockMath.plotBounds(plane));
 locusRasterKey='';backdropState.key='';
}
graphPlotRect=function(canvas){const b=canvas.getBoundingClientRect(),unit=b.width/600;return {left:b.left,top:b.top-graphBounds.top*unit,width:b.width,height:300*unit};};
// Dock the tape to the meeting ray: the equals sign sits on the beam just
// outside the rim and the strip turns with the reflection, so the term arriving
// at the equals sign is the beat crossing the beam. Ink counter-rotates upright.
dockTape=function(){
 const proof=$('originalProof'),work=proof&&proof.querySelector('.work');
 if(!work)return;
 const c=$('cv').getBoundingClientRect(),visible=c.width>2&&workspaceLayout!=='explorer';
 proof.hidden=!visible;if(!visible)return;
 const u=(1-Math.cos(Math.PI*reflectionMix))/2,angle=Math.atan2(u,1-u)*180/Math.PI;
 const r=R/W*c.width,cx=c.left+c.width/2,cy=c.top+c.height/2,gap=innerWidth<=650?18:30;
 proof.style.left=(cx+u*(r+gap))+'px';
 proof.style.top=(cy-(1-u)*(r+gap))+'px';
 work.style.transform='rotate('+(-angle)+'deg)';
 work.style.setProperty('--counter-turn',angle+'deg');
};
const workspace=ClockMath.mountWorkspace({
 read:()=>({time:t,target:clockTween?.to??t,mode:paperMode,sound:soundOn,selected:selectedPrime,sigma:SIGMA,tau:TAUV,j:jValue(t)}),
 seek:value=>seekFrontier(value),jump:jumpClock,resize:resizeWorkspace,
 setting(key,value){if(key==='snap')snapMode=value;else if(key==='fine')moveClock(+value);else if(key==='pitch')pitchMultiplier=+value;else if(key==='layout'){workspaceLayout=value;soundOn=true;$('sound').setAttribute('aria-pressed','true');
for(const event of ['pointerdown','keydown'])addEventListener(event,function open(){removeEventListener(event,open);if(soundOn)unlock();},{once:true});
resizeWorkspace();}else if(key==='spectrum'){spectrumMode=value;respectSpectrum();}else if(key==='spectrumExp'){spectrumExp=+value;respectSpectrum();}else if(key==='spectrumSpread'){spectrumSpread=+value;respectSpectrum();}else if(key==='spectrumRotate'){spectrumRotate=+value;respectSpectrum();}else if(key==='depth')displayDepth=+value;else if(key==='weightBrightness')weightBrightness=value;else if(key==='light'){specMode=value==='off'?0:1;if(value!=='off')lightMode=value;}else if(key==='primeVolume'){primeLevel=+value/100;mixLevel(primeBus,primeLevel);}else if(key==='beatVolume'){beatLevel=+value/100;mixLevel(beatBus,beatLevel);}else if(key==='beatPitch')beatHz=+value;else if(key==='sigma'){const v=+value;if(Number.isFinite(v))tune(v,tauAim);}else if(key==='tau'){const v=+value;if(Number.isFinite(v))tune(sigmaAim,v);}else if(key==='labels')allPaneLabels=value;else if(key==='jRadius')jRadiusOn=value;else if(key==='sumZoom')sumZoom=+value;else if(key==='tauRate'){tauRate=+value;anchorTau();if(tauDriveOn)$('driveNote').textContent=driveText();}else if(key==='tauDrive'){tauDriveOn=!!value;spinning=false;$('spin').className='';anchorTau();$('driveNote').textContent=tauDriveOn?driveText():driveRest;}}
});
function updateSpectrum(){$('spectrumPreview').innerHTML=[2,3,5,7,11,13,17,19,23,29,31,37].map(p=>'<i title="'+p+'" style="background:hsl('+hueOf(p).toFixed(1)+' 68% 62%)"></i>').join('');}
updateSpectrum();
tune(.5,0);anchorTau();sumAim=1;syncLenses();
$('scrub').max=limit;$('reach').value=limit;$('scrubEnd').textContent=limit;
$('sigmaControl').querySelector('label').textContent='σ';$('tauControl').querySelector('label').textContent='τ';
// Formula details retain denominator notation, with the active input stated.
paperFormulas.euler='Σ 1/n<sup>s</sup> = ∏ 1/(1 − 1/p<sup>s</sup>) = ζ(s), for σ > 1';
paperFormulas.log='log ζ(s) = Σₚ Σₖ≥₁ 1/[k(p<sup>k</sup>)<sup>s</sup>] · σ > 1';
paperFormulas.term='∫₀<sup>∞</sup> e<sup>−nx</sup>x<sup>s−1</sup> dx = Γ(s)/n<sup>s</sup> · σ > 0';
$('jIntro').insertAdjacentHTML('beforebegin','<p>On the optional J radius, one count unit is R/t: length = R·J(t)/t. Credits jump by 1/k at pᵏ. This measures a weighted count, not log(q).</p>');
const inspectRadius=document.createElement('button');inspectRadius.textContent='Show J radius';inspectRadius.onclick=()=>{jRadiusOn=!jRadiusOn;$('jRadiusToggle').checked=jRadiusOn;inspectRadius.textContent=jRadiusOn?'Hide J radius':'Show J radius';};$('jBubble').append(inspectRadius);
const redesignedGuide=updateGuide;
updateGuide=function(){redesignedGuide();workspace.update();drawJRadius();dockTape();const beat=Math.floor(t);if($('opProductN').textContent!==String(beat)){$('opProductN').textContent=String(beat);$('opSumN').textContent=String(beat);}const n=Math.floor(t);if(!isPrime(n)&&n>1)$('fac').textContent=factoredName(n);};
// Capture global keyboard shortcuts only outside controls and the graph.
document.addEventListener('keydown',e=>{if(e.target.closest('input,select,textarea,button,summary,#productGraph,[role=separator]'))e.stopPropagation();},true);
resizeWorkspace();
