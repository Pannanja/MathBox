// One clock scene, inspected through a circular camera with a uniform scale.
let psiStairAim=0,psiStairMix=0,psiPredicted=NaN,psiPassedPredicted=NaN;
let psiZoom=2,psiLens=null,psiLensReadout=null,psiSceneFrame=null,psiSceneMatrix=null;
const psiContext=document.createElement('canvas'),psiContext2=psiContext.getContext('2d');
const psiEvents=[];
for(let p=2;p<=limit;p++){if(!isPrime(p))continue;for(let q=p,k=1;q<=limit;q*=p,k++)psiEvents.push({q,p,k,rise:Math.log(p)});}
psiEvents.sort((a,b)=>a.q-b.q);{let v=0;for(const e of psiEvents){e.lo=v;v+=e.rise;e.hi=v;}}
function psiIndex(x){let lo=0,hi=psiEvents.length;while(lo<hi){const mid=(lo+hi)>>1;if(psiEvents[mid].q<=x)lo=mid+1;else hi=mid;}return lo-1;}
function psiAt(x){const i=psiIndex(x);return i<0?0:psiEvents[i].hi;}
function psiResidual(v,x){return (v-smooth(x))/Math.sqrt(x);}
function drawPsiStair(){
 if(psiStairMix<.005)return;
 const event=psiEvents[psiIndex(t)],active=event&&t<event.q+1?event:null,span=active?panelSpan(active.q,t):null;
 psiSceneFrame={time:t,tau:TAUV,heights:zeroHeights,events:psiEvents,colour:primeInk,origin:C,radius:R,
  activePane:active?{radius:clockRadius(active.q),angle:span.c0,span:span.w}:null};
 psiSceneMatrix=g2.getTransform();
 if(psiStairAim){
  if(psiContext.width!==g2.canvas.width||psiContext.height!==g2.canvas.height){psiContext.width=g2.canvas.width;psiContext.height=g2.canvas.height;}
  psiContext2.clearRect(0,0,psiContext.width,psiContext.height);psiContext2.drawImage(g2.canvas,0,0);
 }
 g2.save();const scene=ClockMath.drawPsiMechanism(g2,psiSceneFrame);g2.restore();
 psiPredicted=scene.full.endpoint;psiPassedPredicted=scene.partial.endpoint;
}
function ensurePsiLens(){
 if($('psiMagnifier'))return;
 const lens=document.createElement('section');lens.id='psiMagnifier';lens.setAttribute('aria-label','Psi microscope');
 lens.innerHTML=`<canvas id="psiDetailCanvas" role="img" aria-label="Circular magnification of the clock’s counting teeth and conjugate epicycles"></canvas>
 <div id="psiLegend"><span class="counted">● Counted</span><span class="reference">● Reference</span><span class="developing">● Passed</span></div>
 <div class="psi-tools"><label>Zoom <input id="psiZoom" aria-label="Microscope magnification" type="range" min="0.5" max="8" step="0.05" value="2"></label><button id="psiExplain" aria-expanded="false" aria-label="About the psi microscope" title="About this mechanism">?</button><button id="psiClose" aria-label="Close psi microscope">×</button></div>
 <p id="psiExplanation" hidden><span id="psiReadout"></span>This lens enlarges the marked circle on the clock. The same rotating arms, pane arcs and counting teeth keep their positions and proportions. Scroll over the lens to zoom.<br><br>Each prime power pᵏ adds log p to the count. Teal uses all searched zeros; orange uses heights up to |τ|. Every conjugate pair returns to the counting axis. Prediction and count may differ: at a step, the infinite formula targets its midpoint. Pause the clock and adjust τ to inspect the same mechanism with more zero pairs.</p>`;
 $('clockSurface').append(lens);psiLens=new ClockMath.PsiLens();
 const tether=document.createElementNS('http://www.w3.org/2000/svg','svg');tether.id='psiTether';tether.setAttribute('aria-hidden','true');tether.innerHTML='<path fill="none" stroke="#a9c1ad55" stroke-width="1"/><circle fill="#a9c1ad08" stroke="#a9c1ad88" stroke-width="1"/>';$('clockSurface').append(tether);
 $('psiClose').onclick=()=>setPsiVisible(false);
 $('psiZoom').oninput=e=>psiZoom=+e.target.value;
 $('psiDetailCanvas').addEventListener('wheel',e=>{e.preventDefault();psiZoom=Math.max(.5,Math.min(8,psiZoom*Math.exp(-e.deltaY*.001)));$('psiZoom').value=psiZoom;},{passive:false});
 $('psiExplain').onclick=()=>{const show=$('psiExplanation').hidden;$('psiExplanation').hidden=!show;$('psiExplain').setAttribute('aria-expanded',String(show));};
}
function setPsiVisible(on){
 psiStairAim=on?1:0;ensurePsiLens();$('psiMagnifier').hidden=!on;$('psiTether').style.display=on?'':'none';$('clockSurface').classList.toggle('psi-inspecting',on);
 $('psiStair').classList.toggle('on',on);$('psiStair').setAttribute('aria-pressed',String(on));
 if(on&&$('viewBubble').dataset.open==='true')$('viewBubble').hidePopover();resizeWorkspace();
}
$('layerButtons').insertAdjacentHTML('beforeend','<button id="psiStair" aria-pressed="false" title="Look into the clock’s counting teeth and zero epicycles">ψ · microscope</button>');
$('psiStair').onclick=()=>setPsiVisible(!psiStairAim);
const psiStairGuide=updateGuide;
updateGuide=function(){psiStairGuide();
 if(!psiStairAim||!psiLens||!psiSceneFrame||workspaceLayout==='explorer')return;
 const clockBox=$('cv').getBoundingClientRect(),pixelScale=clockBox.width/$('cv').width;
 psiLensReadout=psiLens.draw($('psiDetailCanvas'),psiSceneFrame,psiContext,psiSceneMatrix,psiZoom,pixelScale);
 const r=psiLensReadout;if(!r)return;
 $('psiReadout').textContent=r.x<2?'ψ = 0 · the zero formula starts at x = 2':r.exact.toFixed(3)+' counted · '+r.full.toFixed(3)+' reference · '+r.partial.toFixed(3)+' from '+r.count+' passed zeros.';
 $('reading').textContent=$('psiReadout').textContent;
 const surface=$('clockSurface').getBoundingClientRect(),lens=$('psiDetailCanvas').getBoundingClientRect(),sx=clockBox.left-surface.left+r.focus.x*pixelScale,sy=clockBox.top-surface.top+r.focus.y*pixelScale,sr=r.sourceRadius*pixelScale;
 const lx=lens.left-surface.left+lens.width/2,ly=lens.top-surface.top+lens.height/2,lr=lens.width/2-3,dx=lx-sx,dy=ly-sy,d=Math.hypot(dx,dy)||1;
 const circle=$('psiTether').querySelector('circle');circle.setAttribute('cx',sx);circle.setAttribute('cy',sy);circle.setAttribute('r',sr);
 $('psiTether').querySelector('path').setAttribute('d',d>sr+lr?'M '+(sx+dx/d*sr)+' '+(sy+dy/d*sr)+' L '+(lx-dx/d*lr)+' '+(ly-dy/d*lr):'');
};
