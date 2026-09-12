// Two distinct infinite-series coefficient sequences, connected by a visual
// interpolation, not the logarithm of a finite partial sum.
let bridgePrime=2,bridgeAim=0,bridgeMix=0,areaAim=0,areaMix=0,ladderAim=0,ladderMix=0,bridgeStamp=0,ladderPrevious=null;
function logCoefficient(n){if(n<2)return 0;const f=factorize(n);return f.every(p=>p===f[0])?1/f.length:0;}
function normalizedArea(k,u){return Math.pow(u,k)/k;}
const whyJ=document.createElement('button');whyJ.textContent='Why these fractions?';whyJ.id='whyJ';jBubble.querySelector('.button-row').prepend(whyJ);
const bridge=document.createElement('section');bridge.id='bridgeBubble';bridge.className='bubble bridge-bubble';bridge.setAttribute('popover','manual');bridge.setAttribute('aria-label','From Euler factors to the J ledger');
bridge.innerHTML=`<div class="bubble-head"><b>From the product to J</b><button popovertarget="bridgeBubble" popovertargetaction="hide" aria-label="Close J explanation">×</button></div>
 <div class="bridge-primes button-row"><span>A prime’s ladder</span><button data-bridge-prime="2" aria-pressed="true">2</button><button data-bridge-prime="3" aria-pressed="false">3</button><button data-bridge-prime="5" aria-pressed="false">5</button></div>
 <div class="bridge-coefficients"><label for="bridgeExpansion">Take the logarithm <output id="bridgeExpansionRead">ζ</output></label><input id="bridgeExpansion" type="range" min="0" max="1" step=".01" value="0"><div id="bridgeTerms"></div><p id="bridgeExpansionNote" class="muted"></p></div>
 <div class="bridge-areas"><svg id="bridgeAreas" viewBox="0 0 300 94" role="img" aria-label="Unit areas giving the coefficients one, one half, and one third"></svg><label for="bridgeSweep">Trace the areas <output id="bridgeSweepRead">u = 0</output></label><input id="bridgeSweep" type="range" min="0" max="1" step=".01" value="0"></div>
 <p class="muted bridge-meaning">log[1/(1−z)] = ∫₀ᶻ (1+v+v²+…)dv, with z=p⁻ˢ. The unit areas multiply z, z², z³. J counts those areas at birth.</p>
 <div class="button-row bridge-actions"><button id="bridgeVisit">Visit 10</button><button id="bridgeCompare">Coefficients</button><button id="bridgeTrace">Trace areas</button><button id="bridgeLadder" aria-pressed="false">Log ladder</button><button id="bridgeLedger">See J</button></div>`;
stage.appendChild(bridge);
whyJ.onclick=()=>{jBubble.hidePopover();bridge.showPopover();};
$('bridgeLedger').onclick=()=>{bridge.hidePopover();jBubble.showPopover();};
$('bridgeVisit').onclick=()=>moveClock(10);
$('bridgeCompare').onclick=()=>bridge.classList.remove('area-face');
$('bridgeTrace').onclick=()=>{bridge.classList.add('area-face');areaAim=areaAim>.99?0:1;$('bridgeSweep').value=areaAim;};
$('bridgeExpansion').oninput=e=>bridgeAim=+e.target.value;
$('bridgeSweep').oninput=e=>areaAim=+e.target.value;
$('bridgeLadder').onclick=()=>{ladderAim=1-ladderAim;$('bridgeLadder').setAttribute('aria-pressed',String(!!ladderAim));if(ladderAim){ladderPrevious={logRad,radialAim};logRad=true;radialAim=0;$('radialDial').value=0;}else if(ladderPrevious&&logRad&&radialAim===0){logRad=ladderPrevious.logRad;radialAim=ladderPrevious.radialAim;$('radialDial').value=radialAim;}};
for(const b of bridge.querySelectorAll('[data-bridge-prime]'))b.onclick=()=>{bridgePrime=+b.dataset.bridgePrime;for(const q of bridge.querySelectorAll('[data-bridge-prime]'))q.setAttribute('aria-pressed',String(q===b));};
const bridgeTerms=[];
for(let n=1;n<=12;n++){const node=document.createElement('div');node.className='bridge-term';node.dataset.n=n;node.innerHTML='<span>'+n+'</span><i></i><small></small>';$('bridgeTerms').appendChild(node);bridgeTerms.push(node);}
function updateBridge(){
 const now=performance.now(),dt=bridgeStamp?Math.min(.05,(now-bridgeStamp)/1000):0;bridgeStamp=now;const e=1-Math.exp(-dt*7);
 bridgeMix+=(bridgeAim-bridgeMix)*e;areaMix+=(areaAim-areaMix)*e;ladderMix+=(ladderAim-ladderMix)*e;
 const shade=factorColour(bridgePrime);
 if(!bridge.matches(':popover-open')){drawBridgeLadder(shade);return;}
 $('bridgeExpansionRead').textContent=bridgeMix<.005?'ζ':bridgeMix>.995?'log ζ':'changing';
 $('bridgeExpansionNote').textContent=bridgeMix<.005?'Each integer has coefficient 1. Shown: arrived terms through 12.':bridgeMix>.995?'Only prime powers remain, with coefficient 1/k. These are infinite-series coefficients, not log of this finite sample.':'Comparing two expansions; the in-between picture is a visual morph.';
 for(let n=1;n<=12;n++){
  const node=bridgeTerms[n-1],c=logCoefficient(n),value=1+(c-1)*bridgeMix,arrived=n<=Math.floor(t);
  node.style.visibility=arrived?'visible':'hidden';node.style.color=factorColour(n);node.style.opacity=c?1:1-.87*bridgeMix;
  node.querySelector('i').style.setProperty('--coefficient',String(value));
  node.querySelector('small').textContent=value<.005?'0':Math.abs(value-1)<.005?'1':bridgeMix>.995?jFraction(Math.round(c*jDenominator)):value.toFixed(1);
 }
 let svg='';
 for(let k=1;k<=3;k++){
  const x=14+(k-1)*100,y=22,w=70,h=43,q=Math.pow(bridgePrime,k);let curve='',fill='M '+x+' '+(y+h);
  for(let i=0;i<=48;i++){const u=i/48,xx=x+w*u,yy=y+h-h*Math.pow(u,k-1);curve+=(i?' L ':'M ')+xx+' '+yy;}
  for(let i=0;i<=48;i++){const u=areaMix*i/48;fill+=' L '+(x+w*u)+' '+(y+h-h*Math.pow(u,k-1));}fill+=' L '+(x+w*areaMix)+' '+(y+h)+' Z';
  const label=k===1?'1':k===2?'u':'u²',credit=areaMix>.995?jFraction(jDenominator/k):normalizedArea(k,areaMix).toFixed(2);
  svg+='<g fill="none" stroke="'+shade+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" opacity=".3"/><path d="'+fill+'" fill="'+shade+'" fill-opacity=".38" stroke="none"/><path d="'+curve+'" stroke-width="1.5"/><path d="M '+(x+w*areaMix)+' '+y+' V '+(y+h)+'" stroke-dasharray="2 2"/></g><g fill="'+shade+'" text-anchor="middle" font-family="monospace" font-size="10"><text x="'+(x+w/2)+'" y="14">'+q+' · '+label+'</text><text x="'+(x+w/2)+'" y="81">area '+credit+'</text></g>';
 }
 $('bridgeAreas').innerHTML=svg;$('bridgeSweepRead').textContent='u = '+areaMix.toFixed(2);
 drawBridgeLadder(shade);
}
function drawBridgeLadder(shade){
 if(ladderMix<.005)return;
 // An explicit log ruler has origin log(1)=0 at the axle. Fade this measure
 // out if the user changes to a radius law where those distances differ.
 const alpha=ladderMix*spacingMix*(1-radialMix);if(alpha<.005)return;
 const angle=3*Math.PI/4,dx=Math.cos(angle),dy=Math.sin(angle),u=(1-Math.cos(Math.PI*reflectionMix))/2;
 const xy=r=>{const x=r*dx,y=r*dy;return [C+(1-u)*x-u*y,C-u*x+(1-u)*y];};
 g2.save();g2.setTransform(1,0,0,1,0,0);g2.globalAlpha=alpha;g2.strokeStyle=shade;g2.fillStyle=shade;g2.lineWidth=2;g2.font='16px ui-monospace,monospace';g2.textAlign='center';
 const end=xy(R);g2.beginPath();g2.moveTo(C,C);g2.lineTo(...end);g2.stroke();g2.fillText('1',C-15,C+18);
 for(let k=1,q=bridgePrime;q<=t;k++,q*=bridgePrime){
  const r=R*Math.log(q)/Math.log(Math.max(t,2.0001)),[x,y]=xy(r);g2.globalAlpha=alpha;g2.beginPath();g2.arc(x,y,6,0,7);g2.fill();g2.fillText(q+' · '+jFraction(jDenominator/k),x-32,y);
  const previous=xy(R*Math.log(q/bridgePrime)/Math.log(Math.max(t,2.0001)));g2.lineWidth=k===1?9:4;g2.globalAlpha=alpha*(k===1?1:.55);g2.beginPath();g2.moveTo(...previous);g2.lineTo(x,y);g2.stroke();g2.lineWidth=2;
 }
 g2.restore();
}
const guideBeforeBridge=updateGuide;updateGuide=function(){guideBeforeBridge();updateBridge();};
