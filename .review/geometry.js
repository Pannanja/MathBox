// Adapted from orrery-story.html: a live logarithmic ruler and the integral
// tail. The beat remains the only counting clock; these are view transforms.
let radialAim=0,radialMix=0,separateAim=0,separateMix=0,sumClipped=false;
// One unit of the sum is sigma radii: sigma = 1 is the rim, sigma = 1/2 is half
// way in, so the real part of s is a length you can read against the dial.
// sumZoom is the observer's factor on top of it. Neither changes the terms,
// which keep their lengths n^-sigma whatever the ruler says.
let sumZoom=1;
function sumUnitRadii(){return SIGMA*sumZoom;}
function sumRulerLabel(){return 'SUM · 1 = '+sumUnitRadii().toFixed(2)+' × radius';}
function clockRadius(q,x=t,mix=radialMix){
 const original=(1-spacingMix)*R*q/x+spacingMix*R*Math.log(Math.max(2,q))/Math.log(Math.max(x,2.0001));
 // Below beat 3 the log range is degenerate. Open it continuously over 2..3.
 const ready=Math.max(0,Math.min(1,x-2));
 const outward=R*Math.max(0,Math.min(1,Math.log(Math.max(x,2.0001)/q)/Math.log(Math.max(x,2.0001)/2)));
 return original+(outward-original)*mix*ready;
}
// Terms print across [n, n+1], so at time t the chain has reached t - 1.
function sumFrontier(){return Math.max(1,t-1);}
function integralTail(sigma,tau,x,span,steps=240){
 const a=power(x,sigma-1,tau),out=[];
 for(let i=0;i<=steps;i++)out.push(div(sub(a,power(x*Math.exp(span*i/steps),sigma-1,tau)),[sigma-1,tau]));
 return out;
}
function updateGeometry(dt){
 const ease=1-Math.exp(-dt*5);
 radialMix+=(radialAim-radialMix)*ease;
 separateMix+=((sumMix>.001?separateAim*sumMix:0)-separateMix)*ease;
 const height=Math.round(W+900*separateMix);
 if($('cv').height!==height)$('cv').height=height;
 $('radialRead').textContent=radialMix<.01?'Births at the rim':radialMix>.99?'Births at the axle':'Changing ruler';
 $('separateRead').textContent=separateAim<.01?'Together':separateAim>.99?'Separate sum':'Separating';
 $('sumScaleNote').hidden=sumMix<.01;
 $('sumScaleNote').textContent='Sum ruler: one unit is '+sumUnitRadii().toFixed(2)+' radii (σ × '+sumZoom.toFixed(2)+'). '+(continueMix>.1?(SIGMA>1.001?'The coral tail coils inward.':SIGMA<.999?'The coral tail unwinds outward.':'The coral tail keeps a fixed radius.'):'A link has length n⁻σ and angle −τ log n.')+(sumClipped?' Portions extend beyond the circle; the ruler stays fixed.':'');
}
const geometry=document.createElement('details');geometry.className='geometry';
geometry.innerHTML=`<summary>Geometry <span>Ruler · separate sum</span></summary>
 <label for="radialDial">Clock ruler <output id="radialRead">Births at the rim</output></label>
 <input id="radialDial" type="range" min="0" max="1" step=".01" value="0">
 <p>Slide from the original clock to a log ruler: new arcs begin at the axle and drift outward. Equal steps along a prime-power ladder become equal radial gaps. The periods stay the same.</p>
 <label for="separateDial">Separate the sum <output id="separateRead">Together</output></label>
 <input id="separateDial" type="range" min="0" max="1" step=".01" value="0">
 <p>In Toward zeta, move the sum onto its own ruler. The same terms arrive on the same beat, wearing the same factor colours. These settings stay yours when you change chapters.</p>`;
document.querySelector('.view-controls').after(geometry);
const scaleNote=document.createElement('p');scaleNote.id='sumScaleNote';scaleNote.className='scale-note';scaleNote.hidden=true;geometry.before(scaleNote);
$('radialDial').oninput=e=>radialAim=+e.target.value;
$('separateDial').oninput=e=>separateAim=+e.target.value;
