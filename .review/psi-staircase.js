// One clock scene, inspected through a circular camera with a uniform scale.
let psiStairAim=0,psiStairMix=0,psiPredicted=NaN,psiPassedPredicted=NaN;
const PSI_CFG=(typeof CLOCK_CONFIG==='object'&&CLOCK_CONFIG)||{};
const PSI_LENS_CFG=PSI_CFG.psiLens||{},PSI_MECH_CFG=PSI_CFG.psiMechanism||{},PSI_REC_CFG=PSI_CFG.psiRecord||{};
let psiZoom=PSI_LENS_CFG.zoom===undefined?1:PSI_LENS_CFG.zoom,psiLens=null,psiLensReadout=null,psiSceneFrame=null,psiSceneMatrix=null,psiHeld=null;
// The pawl's paper. It follows the clock's own x, not the lens's held x, so
// holding x to study one interval does not stop the record being written.
// Built on first draw, never at load: ClockMath is assigned further down the
// same concatenated script, so touching it at top level is a TDZ fault.
let psiPaper=null,psiPaperZeros=0,psiTrailSegments=0;
const psiContext=document.createElement('canvas'),psiContext2=psiContext.getContext('2d');
const psiEvents=[];
for(let p=2;p<=limit;p++){if(!isPrime(p))continue;for(let q=p,k=1;q<=limit;q*=p,k++)psiEvents.push({q,p,k,rise:Math.log(p)});}
psiEvents.sort((a,b)=>a.q-b.q);{let v=0;for(const e of psiEvents){e.lo=v;v+=e.rise;e.hi=v;}}
function psiIndex(x){let lo=0,hi=psiEvents.length;while(lo<hi){const mid=(lo+hi)>>1;if(psiEvents[mid].q<=x)lo=mid+1;else hi=mid;}return lo-1;}
function psiAt(x){const i=psiIndex(x);return i<0?0:psiEvents[i].hi;}
function psiResidual(v,x){return (v-smooth(x))/Math.sqrt(x);}
function drawPsiStair(){
 if(psiStairMix<.005)return;
 const x=psiHeld===null?t:psiHeld;
 const event=psiEvents[psiIndex(x)],active=event&&x<event.q+1?event:null,span=active?panelSpan(active.q,x):null;
 psiSceneFrame={time:x,tau:TAUV,heights:zeroHeights,events:psiEvents,colour:primeInk,origin:C,radius:R,top:TOP,
  activePane:active?{radius:clockRadius(active.q),angle:span.c0,span:span.w}:null,options:PSI_MECH_CFG};
 if(!psiPaper)psiPaper=new ClockMath.PsiTrail(PSI_REC_CFG.cap);
 if(zeroHeights.length!==psiPaperZeros){psiPaper.reset(t);psiPaperZeros=zeroHeights.length;}
 psiPaper.advance(t,zeroHeights,ClockMath.passedZeros(zeroHeights,TAUV),PSI_REC_CFG.budget);
 psiSceneFrame.record=psiPaper;
 psiSceneMatrix=g2.getTransform();
 if(psiStairAim){
  if(psiContext.width!==g2.canvas.width||psiContext.height!==g2.canvas.height){psiContext.width=g2.canvas.width;psiContext.height=g2.canvas.height;}
  psiContext2.clearRect(0,0,psiContext.width,psiContext.height);psiContext2.drawImage(g2.canvas,0,0);
 }
 // The record is written on the dial itself, one turn per unit of psi, riding
 // the same contraction as the prime annuli. Drawn under the mechanism.
 g2.save();g2.globalAlpha=psiStairMix;
 psiTrailSegments=ClockMath.drawPsiTrail(g2,{trail:psiPaper,origin:C,radius:R,top:TOP,scale:Math.max(1,t),
  inkFull:PSI_REC_CFG.inkFull,inkPassed:PSI_REC_CFG.inkPassed,width:PSI_REC_CFG.width,
  alphaFull:PSI_REC_CFG.alphaFull,alphaPassed:PSI_REC_CFG.alphaPassed});
 g2.restore();
 g2.save();const scene=ClockMath.drawPsiMechanism(g2,psiSceneFrame);g2.restore();
 psiPredicted=scene.full.endpoint;psiPassedPredicted=scene.partial.endpoint;
}
function ensurePsiLens(){
 if($('psiMagnifier'))return;
 const lens=document.createElement('section');lens.id='psiMagnifier';lens.setAttribute('aria-label','Psi microscope');
 lens.innerHTML=`<canvas id="psiDetailCanvas" role="img" aria-label="Circular magnification of the clock’s psi epicycles and the path they trace"></canvas>
 <div id="psiLegend"><span class="counted">● Counted</span><span class="reference">● Reference</span><span class="developing">● Passed</span></div>
 <div class="psi-tools"><button id="psiHold" aria-pressed="false" title="Hold x still while the clock plays on">Hold x</button><label>Zoom <input id="psiZoom" aria-label="Microscope magnification" type="range" min="0.5" max="8" step="0.05" value="1"></label><button id="psiExplain" aria-expanded="false" aria-label="About the psi microscope" title="About this mechanism">?</button><button id="psiClose" aria-label="Close psi microscope">×</button></div>
 <p id="psiExplanation" hidden><span id="psiReadout"></span>This lens enlarges the marked circle on the clock. The same rotating arms and pane arcs keep their positions and proportions. Scroll over the lens to zoom.<br><br>Each zero pair is one turning arm, and the arms hang just clear of the meeting axis so they can be read while they whip through a birth. Only the <em>shadow</em> on that axis is ψ: the dashed drop and its foot are the value, never the tip. Coloured arms are the heights up to |τ|, and their colour walks from teal to orange as more are found; the dim chain behind them is every searched zero. The teal path is where the tip has just been. The count itself is not drawn — the panes are the count, and the lit pane is the one printing now. Prediction and count may differ: at a step, the infinite formula targets its midpoint. Hold x to keep one interval still while τ climbs and the arms multiply.</p>`;
 $('clockSurface').append(lens);psiLens=new ClockMath.PsiLens();
 lens.dataset.corner=PSI_LENS_CFG.corner||'top-left';
 makePsiLensDraggable(lens);
 const tether=document.createElementNS('http://www.w3.org/2000/svg','svg');tether.id='psiTether';tether.setAttribute('aria-hidden','true');tether.innerHTML='<path fill="none" stroke="#a9c1ad55" stroke-width="1"/><circle fill="#a9c1ad08" stroke="#a9c1ad88" stroke-width="1"/>';$('clockSurface').append(tether);
 $('psiClose').onclick=()=>setPsiVisible(false);
 $('psiHold').onclick=()=>{psiHeld=psiHeld===null?t:null;$('psiHold').classList.toggle('on',psiHeld!==null);$('psiHold').setAttribute('aria-pressed',String(psiHeld!==null));};
 $('psiZoom').value=psiZoom;$('psiZoom').oninput=e=>psiZoom=+e.target.value;
 $('psiDetailCanvas').addEventListener('wheel',e=>{e.preventDefault();psiZoom=Math.max(.5,Math.min(8,psiZoom*Math.exp(-e.deltaY*.001)));$('psiZoom').value=psiZoom;},{passive:false});
 $('psiExplain').onclick=()=>{const show=$('psiExplanation').hidden;$('psiExplanation').hidden=!show;$('psiExplain').setAttribute('aria-expanded',String(show));};
}
// The glass is furniture, not a fixed fitting: wherever it is parked it will
// cover something, so it can be dragged. A drag pins it in surface pixels and
// the corner rule stops applying; resizing re-clamps it back inside.
function makePsiLensDraggable(lens){
 let drag=null;
 const clamp=()=>{
  if(!lens.dataset.placed)return;
  const s=$('clockSurface').getBoundingClientRect(),b=lens.getBoundingClientRect();
  lens.style.left=Math.max(0,Math.min(s.width-b.width,parseFloat(lens.style.left)||0))+'px';
  lens.style.top=Math.max(0,Math.min(s.height-b.height,parseFloat(lens.style.top)||0))+'px';
 };
 lens.addEventListener('pointerdown',e=>{
  if(e.target.closest('button,input,label,a'))return;
  const s=$('clockSurface').getBoundingClientRect(),b=lens.getBoundingClientRect();
  drag={dx:e.clientX-b.left,dy:e.clientY-b.top,w:s.width,h:s.height,bw:b.width,bh:b.height};
  lens.dataset.placed='1';lens.style.right='auto';lens.style.bottom='auto';lens.style.transform='none';
  lens.setPointerCapture(e.pointerId);lens.classList.add('dragging');e.preventDefault();
 });
 lens.addEventListener('pointermove',e=>{
  if(!drag)return;
  const s=$('clockSurface').getBoundingClientRect();
  lens.style.left=Math.max(0,Math.min(drag.w-drag.bw,e.clientX-s.left-drag.dx))+'px';
  lens.style.top=Math.max(0,Math.min(drag.h-drag.bh,e.clientY-s.top-drag.dy))+'px';
 });
 for(const ev of ['pointerup','pointercancel'])lens.addEventListener(ev,e=>{
  if(!drag)return;drag=null;lens.classList.remove('dragging');
  try{lens.releasePointerCapture(e.pointerId);}catch(_){}
 });
 addEventListener('resize',clamp);
 psiLensClamp=clamp;
}
let psiLensClamp=null;
function setPsiVisible(on){
 psiStairAim=on?1:0;ensurePsiLens();$('psiMagnifier').hidden=!on;$('psiTether').style.display=on?'':'none';$('clockSurface').classList.toggle('psi-inspecting',on);
 $('psiStair').classList.toggle('on',on);$('psiStair').setAttribute('aria-pressed',String(on));
 if(on&&$('viewBubble').dataset.open==='true')$('viewBubble').hidePopover();resizeWorkspace();if(psiLensClamp)psiLensClamp();
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
