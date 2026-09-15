// Riemann views occupy the existing plot. They never retune s or move the clock.
let paperMode='euler',paperData=null,paperWorker=null,paperKey='',paperChanged=0,paperRequested='',paperProgress=0,paperProgressAim=1,paperPlaying=false,paperRewinding=false,paperLast=performance.now(),paperFitPending=false,paperFitInput=false;
const paperCache=new Map();
const logArmScene=new ClockMath.LogArmScene();let logArmReadout=null;
const xiArmScene=new ClockMath.XiArmScene();let xiArmReadout=null;
const xiInputValid=()=>SIGMA>=.2&&SIGMA<=3&&Math.abs(TAUV)<=15;
const paperSelector={value:'euler',onchange:null};
const paperViews={
 euler:{label:'Sum & product',title:'Sum & product → ζ',description:'Blue sum, prime-coloured product and gold ζ curve. Both infinite expressions converge for σ > 1.'},
 log:{label:'Prime powers',title:'Prime powers → log ζ',description:'Each prime-power pane supplies one coloured vector q^(−s)/k. This is the finite logarithmic sum.'},
 xiarm:{label:'ξ rotations',title:'Paired rotations → ξ',description:'Opposite rotations reconstruct ξ from integral samples. These pairs are independent of the prime panes.'},
 term:{label:'One term',title:'One integral → Γ(s)n⁻ˢ',description:'Accumulate one exponential kernel. The clock supplies n; the gold ring is the independent target.'},
 finite:{label:'Finite sum',title:'Finite integral → Γ(s)Sₙ(s)',description:'Integrate the first N exponential kernels, with N from the clock.'},
 infinite:{label:'Infinite sum',title:'Infinite integral → Γ(s)ζ(s)',description:'Integrate 1/(eˣ−1) with its complex weight. This integral requires σ > 1.'},
 theta:{label:'ξ symmetry',title:'Theta integral → ξ',description:'The two theta weights exchange under s ↔ 1−s. The gold ring is the independent ξ target.'}
};
const paperNavigation=document.createElement('nav');paperNavigation.id='paperViews';paperNavigation.setAttribute('aria-label','Complex constructions');
for(const [label,modes] of [['Build',['euler','log','xiarm']],['Integrate',['term','finite','infinite','theta']]]){
 const row=document.createElement('div');row.className='paper-view-row';row.setAttribute('role','group');row.setAttribute('aria-label',label);const name=document.createElement('span');name.textContent=label;row.append(name);
 for(const mode of modes){const button=document.createElement('button');button.type='button';button.dataset.view=mode;button.textContent=paperViews[mode].label;button.title=paperViews[mode].description;button.setAttribute('aria-pressed',String(mode==='euler'));button.onclick=()=>{paperSelector.value=mode;paperSelector.onchange();};row.append(button);}
 paperNavigation.append(row);
}
$('productBubble').querySelector('.bubble-head b').textContent='Complex explorer';
$('productBubble').querySelector('.bubble-head').after(paperNavigation);
const paperViewTitle=document.createElement('div');paperViewTitle.id='paperViewTitle';paperViewTitle.setAttribute('aria-live','polite');paperNavigation.after(paperViewTitle);
const paperGuideEquation=document.createElement('p');paperGuideEquation.id='paperGuideEquation';planeNotes.querySelector('.bubble-head').after(paperGuideEquation);
function updatePaperNavigation(){
 paperViewTitle.replaceChildren(document.createTextNode(paperViews[paperMode].title));if(typeof viewHelpButton!=='undefined')paperViewTitle.append(viewHelpButton);paperViewTitle.title=paperViews[paperMode].description;
 for(const button of paperNavigation.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.view===paperMode));
 plane.setAttribute('aria-label',paperViews[paperMode].title+'. Shared complex ruler: purple input s and critical strip; paths show output values.');
 if($('paperExplanation'))$('paperExplanation').textContent=paperViews[paperMode].description;
}
updatePaperNavigation();
const paperEquation=document.createElement('div');paperEquation.id='paperEquation';paperEquation.textContent='Σ n⁻ˢ = Π (1 − p⁻ˢ)⁻¹ = ζ(s), for σ > 1';$('productGraph').before(paperEquation);
const paperControls=document.createElement('div');paperControls.id='paperControls';paperControls.innerHTML='<button id="paperTrace">Trace integral</button><input id="paperScrub" type="range" min="0" max="1" step=".0001" value="1" aria-label="Integral accumulation progress">';$('exploreOptions').append(paperControls);
$('paperTrace').textContent='Trace';$('paperTrace').title='Replay the integral or arm; in Euler view, open One term';$('exploreMore').before($('paperTrace'));paperControls.insertAdjacentHTML('afterbegin','<label for="paperScrub">Integral progress</label>');
const paperExplanation=document.createElement('p');paperExplanation.id='paperExplanation';paperExplanation.textContent=paperViews.euler.description;$('exploreOptions').append(paperExplanation);
const foldOption=document.createElement('label');foldOption.id='foldArmOption';foldOption.innerHTML='<input id="foldArmTerms" type="checkbox"> Fold unselected vectors (Prime powers / ξ rotations)';$('exploreOptions').append(foldOption);
const paperFormulas={
 xiarm:'ξ(s) ≈ Σⱼ Aⱼ[e<sup>(σ−½)uⱼ+iτuⱼ</sup> + e<sup>−(σ−½)uⱼ−iτuⱼ</sup>]',
 log:'log ζ(s) = Σₚ Σₖ≥₁ (p<sup>k</sup>)<sup>−s</sup>/k · σ > 1',
 euler:'Σ n<sup>−s</sup> = Π (1 − p<sup>−s</sup>)<sup>−1</sup> = ζ(s), for σ > 1',
 term:'∫₀<sup>∞</sup> e<sup>−nx</sup>x<sup>s−1</sup> dx = Γ(s)n<sup>−s</sup> · σ > 0',
 finite:'∫₀<sup>∞</sup> (Σ<sub>k=1</sub><sup>N</sup> e<sup>−kx</sup>)x<sup>s−1</sup> dx = Γ(s)S<sub>N</sub>(s) · σ > 0',
 infinite:'∫₀<sup>∞</sup> x<sup>s−1</sup>/(e<sup>x</sup> − 1) dx = Γ(s)ζ(s) · σ > 1',
 theta:'ξ(s) = ½ + ½s(s−1) ∫₁<sup>∞</sup> ψ(x)[x<sup>s/2−1</sup> + x<sup>−(s+1)/2</sup>] dx'
};
paperEquation.textContent=paperViews.euler.description;paperGuideEquation.innerHTML=paperFormulas.euler;
function paperTarget(mode,sigma,tau,n){const gamma=riemannGamma(sigma,tau);if(mode==='term')return mul(gamma,power(n,sigma,tau));if(mode==='finite')return mul(gamma,continuumSum(n,sigma,tau).z);if(mode==='infinite')return mul(gamma,zeta(sigma,tau));if(Math.hypot(sigma-1,tau)<1e-10)return [.5,0];const pref=scale(mul([sigma,tau],[sigma-1,tau]),.5),piWeight=power(Math.PI,sigma/2,tau/2);return mul(mul(pref,riemannGamma(sigma/2,tau/2)),mul(piWeight,zeta(sigma,tau)));}
function paperComplex(z){return z.every(Number.isFinite)?z[0].toPrecision(5)+(z[1]<0?' − ':' + ')+Math.abs(z[1]).toPrecision(5)+'i':'outside numeric range';}
paperSelector.onchange=()=>{paperMode=paperSelector.value;updatePaperNavigation();paperEquation.textContent=paperViews[paperMode].description;paperGuideEquation.innerHTML=paperFormulas[paperMode];paperData=null;paperProgress=0;paperProgressAim=0;paperPlaying=!['euler','log','xiarm'].includes(paperMode);if(['log','xiarm'].includes(paperMode))paperProgress=paperProgressAim=1;paperRewinding=false;paperFitPending=false;paperRequested='';paperWorker?.terminate();paperWorker=null;productHitPoints=[];};
$('paperTrace').onclick=()=>{if(paperMode==='euler'){paperSelector.value='term';paperSelector.onchange();}else{paperProgressAim=0;paperPlaying=false;paperRewinding=true;}$('exploreOptions').hidePopover();};
$('paperScrub').oninput=e=>{paperPlaying=false;paperRewinding=false;paperProgressAim=+e.target.value;};
function requestPaper(){if(['log','xiarm'].includes(paperMode))return;const n=Math.max(1,Math.floor(t)),key=[paperMode,sigmaAim,tauAim,paperMode==='term'||paperMode==='finite'?n:0].join('/'),now=performance.now();if(key!==paperKey){paperKey=key;paperChanged=now;paperRequested='';paperWorker?.terminate();paperWorker=null;}if(key===paperRequested||now-paperChanged<50)return;paperRequested=key;
 if(Math.abs(tauAim)>ClockMath.viewDomain(paperMode).tauLimit||(paperMode==='infinite'&&sigmaAim<=1)){paperData={key,...riemannIntegrate({mode:paperMode,sigma:sigmaAim,tau:tauAim,n})};return;}
 if(paperCache.has(key)){paperData=paperCache.get(key);if(paperFitPending)fitPaper();return;}
 try{paperWorker=ClockMath.createIntegralWorker();}catch(e){paperData={key,valid:false,reason:'Integral worker unavailable in this browser.'};return;}const worker=paperWorker;
 worker.onmessage=e=>{if(worker!==paperWorker||e.data.key!==paperKey)return;paperData=e.data;paperCache.set(key,paperData);if(paperCache.size>8)paperCache.delete(paperCache.keys().next().value);worker.terminate();paperWorker=null;if(paperFitPending)fitPaper();};
 worker.onerror=()=>{if(worker!==paperWorker)return;paperData={key,valid:false,reason:'Integral calculation failed.'};worker.terminate();paperWorker=null;};worker.postMessage({key,mode:paperMode,sigma:sigmaAim,tau:tauAim,n});
}
function fitPaper(includeInput=paperFitInput){if(paperMode==='xiarm'){if(sigmaAim<.2||sigmaAim>3||Math.abs(tauAim)>15)return;const input={sigma:sigmaAim,tau:tauAim},view=xiArmScene.fit(input,paperTarget('theta',sigmaAim,tauAim,1),includeInput);setGraphView(view.centre,view.extent);return;}if(paperMode==='log'){const view=logArmScene.fit({sigma:sigmaAim,tau:tauAim},t,selectedPrime,includeInput);setGraphView(view.centre,view.extent);return;}paperFitInput=includeInput;if(!paperData?.valid||paperData.key!==paperKey){paperFitPending=true;return;}paperFitPending=false;const d=paperData.rows,lo=[Infinity,Infinity],hi=[-Infinity,-Infinity];for(let i=0;i<d.length;i+=4)for(let k=0;k<2;k++){lo[k]=Math.min(lo[k],d[i+1+k]);hi[k]=Math.max(hi[k],d[i+1+k]);}const target=paperData.target??=paperTarget(paperMode,paperData.sigma,paperData.tau,paperData.n);for(let k=0;k<2;k++){lo[k]=Math.min(lo[k],target[k]);hi[k]=Math.max(hi[k],target[k]);}if(includeInput)for(let k=0;k<2;k++){const value=k?tauAim:sigmaAim;lo[k]=Math.min(lo[k],value);hi[k]=Math.max(hi[k],value);}setGraphView(lo.map((v,k)=>(v+hi[k])/2),Math.max((hi[0]-lo[0])/4,(hi[1]-lo[1])/2,1e-14)*1.18);}
const normalFit=$('fitLocus').onclick;$('fitLocus').onclick=()=>{if(paperMode==='euler')normalFit();else{requestPaper();fitPaper(false);}};
const normalFitTogether=$('fitTogether').onclick;$('fitTogether').onclick=()=>{if(paperMode==='euler')normalFitTogether();else{requestPaper();fitPaper(true);}};
for(const event of ['pointerdown','wheel'])plane.addEventListener(event,()=>paperFitPending=false,{capture:true,passive:true});
function tickPaperProgress(dt,ease,canPlay){if(canPlay&&paperRewinding&&paperProgress<.002){paperRewinding=false;paperPlaying=true;}if(canPlay&&paperPlaying){paperProgressAim=Math.min(1,paperProgressAim+dt/7);if(paperProgressAim===1)paperPlaying=false;}paperProgress+=(paperProgressAim-paperProgress)*ease;if(document.activeElement!==$('paperScrub'))$('paperScrub').value=paperProgress;}
const normalProductGraph=drawProductGraph;
drawProductGraph=function(){if(paperMode==='euler'){normalProductGraph();return;}if(!$('productBubble').matches(':popover-open'))return;
 requestPaper();const now=performance.now(),dt=Math.min(.05,(now-paperLast)/1000),ease=1-Math.exp(-dt*12);paperLast=now;graphLastMs=now;graphCentre=graphCentre.map((v,k)=>v+(graphCentreAim[k]-v)*ease);graphLogExtent+=(+$('productRange').value-graphLogExtent)*ease;
 const ctx=plane.getContext('2d'),extent=10**graphLogExtent,u=125/extent,X=z=>300+u*(z[0]-graphCentre[0]),Y=z=>150-u*(z[1]-graphCentre[1]);ctx.clearRect(0,0,600,300);ClockMath.drawComplexPlane(ctx,graphCentre,extent);productHitPoints=[];
 if(paperMode==='log'){
  tickPaperProgress(dt,ease,true);
  logArmReadout=logArmScene.draw(ctx,{input:{sigma:SIGMA,tau:TAUV},time:t,selectedPrime,progress:paperProgress,centre:graphCentre,extent,compact:$('foldArmTerms').checked,colour:factorColour,highlightColour:primeHighlight});
  const r=logArmReadout,a=r.active;
  $('productDetails').textContent='Pane-grown L = '+paperComplex(r.model.endpoint)+'. Completed cutoff sum = '+paperComplex(r.model.completedCutoffEndpoint)+'.'+(a?' q='+a.source.q+' contributes '+paperComplex(a.fullValue)+' when fully grown.':'');
  $('productStatus').textContent=(SIGMA>1?'As the cutoff grows, the logarithmic sum converges to log ζ. ':'σ ≤ 1: finite terms only; convergence to log ζ is not claimed. ')+'exp(L) is not the finite Euler product: the prime-power cutoff omits higher powers. The circle is the active vector’s full radius. All vectors are shown by default. Options can fold unselected terms into dashed sums; click a dashed group to expand.';
  $('productExtent').textContent='±'+extent.toPrecision(2);return;
 }
 if(paperMode==='xiarm'){drawXiArm(ctx,extent,dt,ease);return;}
 const current=paperData?.key===paperKey,settled=current&&paperData.valid&&Math.abs(SIGMA-paperData.sigma)<1e-4&&Math.abs(TAUV-paperData.tau)<1e-4;
 if(current&&!paperData.valid){ctx.fillStyle='#dcb884';ctx.font='14px ui-sans-serif';const lines=Math.abs(tauAim)>ClockMath.viewDomain(paperMode).tauLimit?['This view resolves |τ| ≤ '+ClockMath.viewDomain(paperMode).tauLimit+'.','The Euler explorer still supports |τ| ≤ 1000.']:paperMode==='infinite'&&sigmaAim<=1?['The integral fails at its lower endpoint.','For σ ≤ 1, choose Finite sum or Symmetry.']:[paperData.reason,'Try another input or return to Euler.'];lines.forEach((line,i)=>ctx.fillText(line,65,130+i*25));$('productDetails').textContent=paperData.reason;$('productStatus').textContent='No integral endpoint was calculated.';return;}
 if(!paperData?.valid){$('productDetails').textContent='Computing the integral independently…';$('productStatus').textContent='';return;}
 const d=paperData.rows;tickPaperProgress(dt,ease,settled);
 const stopLength=paperProgress*paperData.length;let stop=0;while(stop+4<d.length&&d[stop+7]<stopLength)stop+=4;
 const next=Math.min(stop+4,d.length-4),den=d[next+3]-d[stop+3],f=den>0?Math.max(0,Math.min(1,(stopLength-d[stop+3])/den)):1,point=[d[stop+1]+f*(d[next+1]-d[stop+1]),d[stop+2]+f*(d[next+2]-d[stop+2])],xValue=d[stop]+f*(d[next]-d[stop]);
 ctx.save();ctx.beginPath();ctx.rect(0,20,600,260);ctx.clip();ctx.globalAlpha=settled?1:.2;ctx.strokeStyle='#87bff23a';ctx.lineWidth=1.4;ctx.beginPath();for(let i=0;i<d.length;i+=4){const z=[d[i+1],d[i+2]];if(i)ctx.lineTo(X(z),Y(z));else ctx.moveTo(X(z),Y(z));}ctx.stroke();ctx.strokeStyle='#87bff2';ctx.lineWidth=2.6;ctx.beginPath();for(let i=0;i<=stop;i+=4){const z=[d[i+1],d[i+2]];if(i)ctx.lineTo(X(z),Y(z));else ctx.moveTo(X(z),Y(z));}ctx.lineTo(X(point),Y(point));ctx.stroke();ctx.fillStyle='#9bcff8';ctx.beginPath();ctx.arc(X(point),Y(point),4,0,7);ctx.fill();
 const target=paperData.target??=paperTarget(paperMode,paperData.sigma,paperData.tau,paperData.n);ctx.strokeStyle='#e9be67';ctx.lineWidth=2;ctx.beginPath();ctx.arc(X(target),Y(target),6,0,7);ctx.stroke();ctx.restore();
 $('productDetails').textContent='Integral endpoint '+paperComplex(paperData.endpoint)+'; independent target '+paperComplex(target)+'.';
 $('productStatus').textContent='Endpoint gap '+abs(sub(paperData.endpoint,target)).toExponential(2)+' · numerical estimate '+(paperData.estimatedQuadratureError+paperData.estimatedRoundoffError).toExponential(1)+' · omitted-tail bound '+paperData.omittedBound.toExponential(1)+'.';
 $('productExtent').textContent='±'+extent.toPrecision(2);paperData.displayX=xValue;
};
const paperGuide=updateGuide;updateGuide=function(){paperGuide();if(paperMode==='euler')return;if(paperMode==='log'){updateLogArmGuide();return;}if(paperMode==='xiarm'){updateXiArmGuide();return;}const current=paperData?.key===paperKey,n=Math.floor(t),description=paperMode==='term'?'n = '+n+' · one clock term':paperMode==='finite'?'N = '+n+' · finite kernel':paperMode==='infinite'?'Infinite kernel · σ > 1 required':'ψ(x) = Σₙ≥1 exp(−πn²x) · ξ(s) = ξ(1−s)';
 $('planeHint').textContent=description+' · Fit curve to inspect';$('liveCurveState').textContent=current&&paperData.valid?'Blue: accumulated integral · gold ring: independent target':'Integral view · '+(current?paperData.reason:'updating for this input…');
 $('locusStatus').textContent=current&&paperData.valid?'x = '+(paperData.displayX||0).toPrecision(3)+(paperData.omittedBound>1e-7?' · lower endpoint unresolved':''):'No convergence is claimed outside the stated domain.';
};
const changePaper=paperSelector.onchange;paperSelector.onchange=()=>{changePaper();$('paperControls').querySelector('label').textContent=['log','xiarm'].includes(paperMode)?'Arm progress':'Integral progress';if(paperMode==='euler'){$('planeHint').textContent='Drag the purple s to change the input. Drag empty space to pan. Scroll to zoom.';locusRequested='';$('locusStatus').textContent='Preparing ζ curve…';}};
planeNotes.insertAdjacentHTML('beforeend','<p>Riemann views: One term integrates e⁻ⁿˣxˢ⁻¹, with n from the clock. Finite sum integrates the first N exponential kernels; both require σ > 0. Infinite sum replaces those kernels by 1/(eˣ−1) and requires σ > 1. The blue path is calculated by quadrature, independently of the gold gamma/zeta target. A finite lower/upper cutoff is used; Guide reports a bound for the omitted tails and an estimated quadrature error. Near σ = 1 from above, the lower endpoint may remain unresolved.</p><p>Symmetry uses Riemann’s transformed theta integral: ξ(s)=½+½s(s−1)∫₁∞ψ(x)[x^(s/2−1)+x^(−(s+1)/2)]dx. Here ψ is the Gaussian sum Σexp(−πn²x), not the prime-count ψ. Its two powers exchange under s↦1−s. On σ=½ they are conjugates, so the accumulated path is real: ξ(½+iτ)=½−(τ²+¼)∫₁∞ψ(x)x^(−3/4)cos(½τ log x)dx. This is the cosine integral on page 3 of the translation; Riemann calls this function ξ(t), while the view uses the modern ξ(s) notation. This implements the resulting identity; the contour and theta-transformation arguments that establish it are not yet animated. Γ is the gamma function: Riemann writes Γ(s) as Π(s−1). For positive integers m, Γ(m)=(m−1)!.</p><p>One-term, finite-sum and infinite-sum integrals currently resolve |τ|≤15; ξ symmetry resolves |τ|≤35. They do not narrow the main Euler/zeta explorer. The trace advances through the actual sampled path and reports its current x; its playback speed is chosen for visibility rather than a uniform x speed. Fit curve uses the same fixed ruler after fitting; changing s does not silently rescale.</p>');

function updateLogArmGuide(){
 const r=logArmReadout,a=r?.active;
 $('planeHint').textContent=a?'Pane '+a.source.q+(a.source.k>1?' = '+a.source.p+'^'+a.source.k:'')+' · J +'+(a.source.k===1?'1':'1/'+a.source.k)+' · '+Math.round(a.growth*100)+'% grown':'Advance to beat 2, then watch its pane grow.';
 $('liveCurveState').textContent=(paperProgress<.999?'Replaying arm · ':'')+'Gold tip: finite L · circle: active term'+(r?.folded?' · '+r.folded+' folded':' · all terms');
 $('locusStatus').textContent=SIGMA>1?'σ > 1 · log ζ limit':'σ ≤ 1 · finite only';
}
plane.addEventListener('pointermove',e=>{if(planeDrag)return;if(paperMode==='log')previewPrime(logArmScene.pick(planePixel(e)));if(paperMode==='xiarm')xiArmScene.pick(planePixel(e));});
plane.addEventListener('pointerleave',()=>{if(paperMode==='log'){logArmScene.pick([-100,-100]);previewPrime(0);}if(paperMode==='xiarm')xiArmScene.pick([-100,-100]);});
const beforeLogPointerUp=plane.onpointerup;
plane.onpointerup=e=>{const pick=['log','xiarm'].includes(paperMode)&&planeDrag&&!planeDrag.input&&!planeDrag.moved;beforeLogPointerUp(e);if(pick&&paperMode==='xiarm')xiArmScene.pick(planePixel(e),true);if(pick&&paperMode==='log'){const p=logArmScene.pick(planePixel(e),true);if(p)linkPrime(p);}};
$('clearLink').addEventListener('click',()=>logArmScene.clear());
document.addEventListener('keydown',e=>{if(e.key==='Escape'){logArmScene.clear();xiArmScene.clear();}});
planeNotes.insertAdjacentHTML('beforeend','<p>The prime-power arm shows L=Σ g_q(T)q^(−s)/k, for panes q=p^k. A pane begins at T=q and grows through T=q+1; g follows that growth from 0 to 1. This is a reveal of the finite logarithmic sum, not an area claim. The J weight 1/k is additional to q^(−σ). The phase is −τ log q, so clock playback grows arriving vectors; changing τ rotates them. The active circle shows the full vector length q^(−σ)/k. Trace and the progress slider replay the displayed construction without moving the clock. All terms are drawn by default. Optional folded terms retain their aggregate value; the faint path shows their intermediate sums. Replay follows the displayed vectors, including aggregates, rather than pretending an aggregate is one prime power. Hover a coloured vector to highlight its prime family; click to pin its pane, or click a dashed aggregate to expand four terms. The branch of log ζ is the one defined by the Euler series for σ>1; no principal-log target or continuation is substituted.</p>');

function drawXiArm(ctx,extent,dt,ease){
 if(!xiInputValid()){
  xiArmReadout=null;xiArmScene.invalidate();ctx.fillStyle='#dcb884';ctx.font='14px ui-sans-serif';
  ctx.fillText('The ξ arm resolves 0.2 ≤ σ ≤ 3, |τ| ≤ 15.',55,130);ctx.fillText('Move s into this window, or return to Euler.',55,155);
  $('productDetails').textContent='No paired endpoint is shown outside the validated window.';$('productStatus').textContent='The Euler explorer retains its wider τ range.';return;
 }
 tickPaperProgress(dt,ease,true);
 const target=paperTarget('theta',SIGMA,TAUV,1);
 xiArmReadout=xiArmScene.draw(ctx,{input:{sigma:SIGMA,tau:TAUV},target,progress:paperProgress,centre:graphCentre,extent,compact:$('foldArmTerms').checked});
 const r=xiArmReadout,a=r.active,m=r.model;
 $('productDetails').textContent='Paired endpoint '+paperComplex(m.endpoint)+'; independent ξ target '+paperComplex(target)+'. Active radii '+a[0].magnitude.toPrecision(4)+' and '+a[1].magnitude.toPrecision(4)+'.';
 $('productStatus').textContent='Endpoint gap '+abs(sub(m.endpoint,target)).toExponential(2)+' · estimated numerical error '+m.errorEstimate.toExponential(1)+' · omitted-tail bound '+m.omittedBound.toExponential(1)+'. 96 quadrature pairs; u ≤ 2.5. Error estimates are not certified bounds. All pairs are shown by default; folding is optional.';
 $('productExtent').textContent='±'+extent.toPrecision(2);
}
function updateXiArmGuide(){
 const r=xiArmReadout,a=r?.active[0];
 $('planeHint').textContent=a?'u = '+a.source.u.toFixed(3)+' · angles ±'+(TAUV*a.source.u).toFixed(3)+' rad · '+(Math.abs(SIGMA-.5)<1e-8?'equal radii':'radius ratio '+Math.exp(2*(SIGMA-.5)*a.source.u).toPrecision(3)):'ξ arm · validated for 0.2 ≤ σ ≤ 3, |τ| ≤ 15';
 $('liveCurveState').textContent=r?(paperProgress<.999?'Replay · ':'')+'Teal +τu · amber −τu · gold ring ξ'+(r.foldedPairs?' · '+r.foldedPairs+' pairs folded':' · all '+r.model.pairs+' pairs'):'Move s into the validated window to see the pairs.';
 $('locusStatus').textContent=r?'Quadrature pairs · clock-independent':'Outside ξ arm range';
}
planeNotes.insertAdjacentHTML('beforeend','<p>The ξ paired arm rewrites the theta integral as ξ(s)=∫₀∞K(u)cosh((s−½)u)du, where K(u)=Σₙ≥1[8π²n⁴exp(9u/2)−12πn²exp(5u/2)]exp(−πn²exp(2u)). At each quadrature node, A=wK(u)/2 supplies two vectors with lengths A exp(±(σ−½)u) and angles ±τu. Teal turns with +τu; amber turns with −τu. At σ=½ the lengths agree and the imaginary parts cancel pair by pair. Circles mark the two active radii, attached tip to tail. Hover a vector to inspect a pair; click to pin, Escape to clear. All pairs are drawn by default. If folding is enabled in Options, only whole pairs are folded; their net contribution remains visible as a dashed segment and the faint path retains each intermediate vector. Trace replays the displayed vectors, including folded aggregates.</p><p>These nodes sample an integral: they are not primes, prime powers, or zeros. Changing the clock does not change their weights or phases. The gold ξ target comes from the separate gamma/zeta evaluator, not from adjusting the arm endpoint. The positive kernel is a rearrangement of the theta representation; the steps deriving that kernel and a clock-mounted reveal are still to come. The 96-node calculation is compared with 64 nodes and includes a floating-point error estimate; those are estimates, while the omitted integral and Gaussian tails have bounds. Near a zero, cancellation makes relative error unhelpful: inspect absolute error. The phase convention follows the <a href="https://arxiv.org/html/1904.12438#S1" target="_blank" rel="noopener">classical Fourier representation</a>, rescaled from H₀(z)=ξ(½+iz/2)/8 by u↦u/2.</p>');

planeNotes.querySelector('.bubble-head').insertAdjacentHTML('afterend','<p class="coordinate-note">Every view uses the same complex ruler: solid axes cross at zero. Purple marks the input s, the critical strip 0 &lt; Re(s) &lt; 1 and its dashed centre σ=½. Curves and vector endpoints are output values on that shared ruler; their position inside the purple band is not a claim about where their input lies. Fit input &amp; outputs in Options brings s into view. Prime powers builds log ζ; ξ rotations is the counter-rotating integral construction.</p>');

// View-specific explanations and slider domains share the evaluator's limits.
var viewHelpButton=document.createElement('button');viewHelpButton.id='explainView';viewHelpButton.textContent='Explain view';viewHelpButton.setAttribute('popovertarget','viewHelp');
const viewHelp=document.createElement('section');viewHelp.id='viewHelp';viewHelp.className='bubble';viewHelp.setAttribute('popover','auto');stage.append(viewHelp);
const viewStories={
 euler:[
  'Two ways to build the same number',
  'The blue chain adds one term for every integer. The coloured chain multiplies one factor for every prime. Their endpoints approach the gold ζ value as the clock advances, provided σ is greater than 1.',
  'The gold curve is a different object: it traces ζ as τ varies at fixed σ. Each point on it is a complete output, not another term of the blue sum.',
  'Change the beat to add terms. Change σ to alter their sizes and τ to turn them. Below σ=1 you can still inspect finite paths, but they no longer supply the convergent infinite sum and product.'
 ],
 log:[
  'Turn prime factors into an additive chain',
  'Each prime-power pane supplies one arrow. The pane 4=2² contributes half of 4^(−s); 8=2³ contributes a third of 8^(−s). Colour identifies the base prime.',
  'The tip is a finite approximation to log ζ, not ζ itself. Taking a logarithm turns multiplication into addition; the extra 1/k weights come from expanding each prime factor.',
  'Step the clock to watch a pane and its arrow grow together. Hover an arrow to link its prime family. The infinite logarithmic sum converges when σ>1; below that, this view displays finite terms only.'
 ],
 xiarm:[
  'Build ξ from opposite rotations',
  'Each teal arrow has an amber partner. Changing τ rotates them in opposite directions. At σ=½ their lengths match, so each pair cancels vertically.',
  'These pairs sample the theta integral; they are not prime panes. Together they reconstruct ξ, a symmetrized version of ζ with the pole removed. The gold ring is calculated separately as a check.',
  'Hover a pair, then vary σ to unbalance its lengths. Vary τ near 14.134725 to watch the complete chain close near the first zero. Clock time does not change these integral samples.'
 ],
 term:[
  'Replace one sum term with an integral',
  'Instead of drawing the single arrow n^(−s), accumulate a continuous stream of tiny contributions. The clock supplies n. Trace shows that accumulation as the integration variable x increases.',
  'The blue endpoint is Γ(s) times n^(−s). Gamma is the scaling factor introduced by this integral identity, so the endpoint is not the original sum term by itself.',
  'Change the beat to choose n, then replay with Trace. This real-axis integral requires σ>0. Its current numerical window is |τ|≤15.'
 ],
 finite:[
  'Integrate a finite collection of terms',
  'Combine the first N exponential kernels, then accumulate their complex weights into one blue path. The clock supplies N; Trace advances through x, not through the clock beats.',
  'The endpoint is Γ(s) times the finite sum of n^(−s). The gold ring comes from evaluating that finite sum and Gamma independently.',
  'Compare with One term, then increase the beat. This integral still works in the critical strip because it contains only finitely many kernels. It requires σ>0; the current numerical window is |τ|≤15.'
 ],
 infinite:[
  'Let all the exponential kernels join in',
  'The infinite geometric sum of the kernels becomes 1/(eˣ−1). The blue path accumulates it with the same complex weight used in the preceding integral views.',
  'The endpoint is Γ(s)ζ(s), not ζ(s) alone. The gold ring is an independent check. Clock time has no effect because the kernel already includes every integer.',
  'Move σ towards 1 from the right to see the lower endpoint become difficult. At σ≤1 this integral actually diverges; this is a mathematical boundary. The |τ|≤15 boundary is only a numerical limit.'
 ],
 theta:[
  'Use symmetry to reach beyond the Euler domain',
  'Riemann reorganizes a Gaussian sum into two matching weights. The blue path starts at ½ and adds their integral from x=1 to infinity. Its endpoint is ξ, checked by the gold ring.',
  'Exchanging s and 1−s swaps the two weights. On σ=½ they are conjugates, so their imaginary parts cancel and the accumulated path stays on the real axis. This is the integral behind ξ rotations.',
  'ξ itself is defined throughout the complex plane. This view now resolves |τ|≤35, within the shared σ controls 0.2–3. At high τ, large cancellations leave tiny answers; extending farther needs better precision checks, not merely a wider slider.'
 ]
};
function refreshViewHelp(){
 const [title,shows,meaning,tryIt]=viewStories[paperMode];
 viewHelp.innerHTML='<div class="bubble-head"><b>'+title+'</b><button popovertarget="viewHelp" popovertargetaction="hide" aria-label="Close view explanation">×</button></div><p>'+shows+'</p><p>'+meaning+'</p><p><strong>Try it.</strong> '+tryIt+'</p><div class="view-equation">'+paperFormulas[paperMode]+'</div><p class="domain-key">Slider colours: green = supported; amber = finite terms only; hatched = divergent integral or outside the numerical window. The σ limits 0.2–3 belong to the shared clock controls.</p><button id="useViewRange">Use this view’s τ range</button>';
 $('useViewRange').onclick=()=>{const limit=ClockMath.viewDomain(paperMode).tauLimit;$('tauLow').value=-limit;$('tauHigh').value=limit;$('tauHigh').onchange();updateDomainSliders();};
}
viewHelpButton.addEventListener('click',refreshViewHelp);paperViewTitle.append(viewHelpButton);
for(const [id,axis] of [['sigmaDial','sigma'],['tauScrub','tau']]){
 const input=$(id);input.classList.add('domain-range');const caption=document.createElement('output');caption.id=axis+'Domain';caption.className='domain-caption';caption.setAttribute('aria-live','polite');input.closest('.axis-control').append(caption);input.setAttribute('aria-describedby',caption.id);
}
let domainKey='';
function updateDomainSliders(){
 const d=ClockMath.viewDomain(paperMode),lo=+$('tauScrub').min,hi=+$('tauScrub').max,key=[paperMode,lo,hi,sigmaAim>1,Math.abs(tauAim)>d.tauLimit].join('/');if(key===domainKey)return;domainKey=key;
 const green='#609d87',amber='#b3904b',invalid='#665869';
 const percent=(v,a,b)=>Math.max(0,Math.min(100,100*(v-a)/(b-a)));
 const sigma=$('sigmaDial'),threshold=percent(1,+sigma.min,+sigma.max),left=d.boundaryKind==='finite only'?amber:invalid;
 const hatch='repeating-linear-gradient(135deg,#665869 0 3px,#382e40 3px 6px)';sigma.style.background=d.sigmaBoundary===null?green:d.boundaryKind==='finite only'?'linear-gradient(to right,'+left+' '+threshold+'%,'+green+' '+threshold+'%)':'linear-gradient(to right,transparent '+threshold+'%,'+green+' '+threshold+'%),'+hatch;
 const a=percent(-d.tauLimit,lo,hi),b=percent(d.tauLimit,lo,hi);
 $('tauScrub').style.background='linear-gradient(to right,transparent '+a+'%,'+green+' '+a+'%,'+green+' '+b+'%,transparent '+b+'%),'+hatch;
 const sigmaText=d.boundaryKind==='finite only'?'σ ≤ 1: finite only · σ > 1: convergent':d.boundaryKind==='diverges'?'σ ≤ 1: integral diverges · σ > 1: supported':'σ 0.2–3: supported · shared clock range';
 const tauText='|τ| ≤ '+d.tauLimit+(d.tauLimit===1000?' · explorer range':' · numerical window')+(Math.abs(tauAim)>d.tauLimit?' · input outside':'');
 $('sigmaDomain').textContent=sigmaText;$('tauDomain').textContent=tauText;
 sigma.title=sigmaText;$('tauScrub').title=tauText+'; displayed slider '+lo+' to '+hi;
 $('sigmaExact').setAttribute('aria-describedby','sigmaDomain');$('tauExact').setAttribute('aria-describedby','tauDomain');
 $('sigmaExact').classList.toggle('outside-domain',paperMode==='infinite'&&sigmaAim<=1);$('tauExact').classList.toggle('outside-domain',Math.abs(tauAim)>d.tauLimit);
}
const domainGuide=updateGuide;updateGuide=function(){domainGuide();updateDomainSliders();};
const explainChange=paperSelector.onchange;paperSelector.onchange=()=>{explainChange();refreshViewHelp();updateDomainSliders();};
refreshViewHelp();updateDomainSliders();
