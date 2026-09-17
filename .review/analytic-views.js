// Initial orientation is the ordinary complex plane: real right, imaginary up.
reflectionAim=reflectionMix=1;$('reflect').setAttribute('aria-pressed','true');
$('tauDial').min=-35;
const complexInput=document.createElement('div');complexInput.className='complex-input';
const sigmaGroup=$('sigmaSlot').parentElement,tauGroup=$('tauSlot').parentElement;
sigmaGroup.before(complexInput);
complexInput.append(...sigmaGroup.children,...tauGroup.children);sigmaGroup.remove();tauGroup.remove();
for(const [axis,min,max] of [['sigma',.2,3],['tau',-35,35]]){
 const label=complexInput.querySelector('label[for="'+axis+'Dial"]'),field=document.createElement('input');
 field.id=axis+'Exact';field.type='number';field.min=min;field.max=max;field.step='any';field.value=axis==='sigma'?sigmaAim:tauAim;
 field.setAttribute('aria-label',axis==='sigma'?'Exact sigma':'Exact tau');field.title='↑ / ↓: 0.0001 · Shift: 0.01 · Alt: 0.000001';
 label.querySelector('output').hidden=true;label.firstChild.textContent=axis==='sigma'?'σ':'τ';label.append(field);label.htmlFor=field.id;
 field.oninput=()=>{if(field.value!==''&&field.validity.valid)tune(axis==='sigma'?+field.value:sigmaAim,axis==='tau'?+field.value:tauAim);};
 field.onkeydown=e=>{if(!['ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const step=e.altKey?.000001:e.shiftKey?.01:.0001,value=Math.max(min,Math.min(max,(axis==='sigma'?sigmaAim:tauAim)+(e.key==='ArrowUp'?step:-step)));field.value=Number(value.toFixed(12));field.oninput();};
 field.onblur=()=>{field.value=Number((axis==='sigma'?sigmaAim:tauAim).toFixed(12));};
 $(axis+'Dial').step='.0001';
}
complexInput.insertAdjacentHTML('beforeend','<div id="complexPad" aria-hidden="true"><span id="complexDot"></span></div>');
function pickComplex(e){const b=$('complexPad').getBoundingClientRect();tune(.2+2.8*Math.max(0,Math.min(1,(e.clientX-b.left)/b.width)),35-70*Math.max(0,Math.min(1,(e.clientY-b.top)/b.height)));}
$('complexPad').onpointerdown=e=>{e.currentTarget.setPointerCapture(e.pointerId);pickComplex(e);};
$('complexPad').onpointermove=e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))pickComplex(e);};
const productButton=document.createElement('button');productButton.textContent='Sum × Product';productButton.id='productView';productButton.setAttribute('popovertarget','productBubble');$('layerButtons').append(productButton);
const productBubble=document.createElement('section');productBubble.id='productBubble';productBubble.className='bubble product-bubble';productBubble.setAttribute('popover','manual');
productBubble.innerHTML=`<div class="bubble-head"><b>Sum + product · one complex plane</b><button popovertarget="productBubble" popovertargetaction="hide" aria-label="Close product graph">×</button></div>
<canvas id="productGraph" width="600" height="300" aria-label="Complex plane: prime-coloured partial products, blue finite sum, gold zeta"></canvas>
<div class="product-tools"><button id="productPrev" aria-label="Previous prime factor">←</button><button id="productNext" aria-label="Next prime factor">→</button><button id="fitPaths" title="Fit the current paths once; keep this ruler as the clock moves">Fit</button><button id="focusZeta" title="Centre on the current zeta value, then use the zoom slider">ζ</button><button id="homeGraph" title="Centre on zero with radius 2">0</button><input id="productRange" type="range" min="-5" max="3" step=".01" value=".30103" aria-label="Logarithmic graph extent"><output id="productExtent">±2</output></div>
<p id="productDetails"></p><p id="productStatus"></p>`;stage.append(productBubble);
$('productRange').step='any';
const analyticPrimes=[];for(let p=2;p<=5001;p++)if(isPrime(p))analyticPrimes.push(p);
function eulerPath(x,sigma,tau){
 let z=[1,0];const points=[{p:1,z:[1,0],factor:[1,0]}];
 // A prime's factor is taken over the same lap its pane is printed, so it is
 // complete at x = p + 1 rather than at x = p, matching the clock.
 for(const p of analyticPrimes){if(p+1>x)break;const factor=div([1,0],sub([1,0],power(p,sigma,tau)));z=mul(z,factor);points.push({p,z:[...z],factor});}
 const printing=Math.floor(x),fr=x-printing;
 let arriving=null;
 if(fr>0&&isPrime(printing)){const f=div([1,0],sub([1,0],power(printing,sigma,tau))),r=Math.pow(abs(f),fr),a=Math.atan2(f[1],f[0])*fr;arriving=mul(z,[r*Math.cos(a),r*Math.sin(a)]);}
 return {points,z,arriving};
}
let selectedProduct=-1,productHitPoints=[];
$('productPrev').onclick=()=>{const last=eulerPath(t,SIGMA,TAUV).points.length-1;selectedProduct=Math.max(0,(selectedProduct<0?last:selectedProduct)-1);};
$('productNext').onclick=()=>{const last=eulerPath(t,SIGMA,TAUV).points.length-1;selectedProduct=Math.min(last,(selectedProduct<0?last:selectedProduct)+1);};
$('productGraph').onpointerdown=e=>{const b=e.currentTarget.getBoundingClientRect(),x=(e.clientX-b.left)*600/b.width,y=(e.clientY-b.top)*300/b.height;let best=Infinity;for(const p of productHitPoints){const d=Math.hypot(p.x-x,p.y-y);if(d<best){best=d;selectedProduct=p.i;}}};
const complexText=z=>z.every(Number.isFinite)?z[0].toFixed(4)+(z[1]<0?' − ':' + ')+Math.abs(z[1]).toFixed(4)+'i':'outside numeric range';
let graphCentre=[0,0],graphCentreAim=[0,0],graphLogExtent=Math.log10(2),graphLastMs=performance.now();
function graphTick(value,step){const digits=Math.max(0,Math.ceil(-Math.log10(step))+1);return Math.abs(value)<1e7&&digits<=12?value.toFixed(digits):value.toPrecision(6);}
function setGraphView(centre,extent){if(!centre.every(Number.isFinite)||!Number.isFinite(extent)||extent<=0)return;graphCentreAim=[...centre];const value=Math.log10(Math.max(1e-14,extent));$('productRange').max=Math.max(3,Math.ceil(value));$('productRange').value=value;}
$('homeGraph').onclick=()=>setGraphView([0,0],2);
$('focusZeta').onclick=()=>{if(Math.hypot(SIGMA-1,TAUV)>1e-8)setGraphView(zeta(SIGMA,TAUV),10**+$('productRange').value);};
$('fitPaths').onclick=()=>{
 const product=eulerPath(t,SIGMA,TAUV),sum=continuumSum(t,SIGMA,TAUV),zs=[...sum.points,...product.points.map(p=>p.z),sum.z];
 if(product.arriving)zs.push(product.arriving);if(Math.hypot(SIGMA-1,TAUV)>1e-8)zs.push(zeta(SIGMA,TAUV));
 const finite=zs.filter(z=>z.every(Number.isFinite));let lo=[Infinity,Infinity],hi=[-Infinity,-Infinity];
 for(const z of finite)for(let a=0;a<2;a++){lo[a]=Math.min(lo[a],z[a]);hi[a]=Math.max(hi[a],z[a]);}
 const centre=lo.map((v,i)=>v/2+hi[i]/2),extent=Math.max((hi[0]-lo[0])/4,(hi[1]-lo[1])/2,.01)*1.18;setGraphView(centre,extent);
};
function drawProductGraph(){
 if(!$('productBubble').matches(':popover-open'))return;
 const ms=performance.now(),ease=1-Math.exp(-Math.min(.05,(ms-graphLastMs)/1000)*12);graphLastMs=ms;
 graphCentre=graphCentre.map((v,i)=>v+(graphCentreAim[i]-v)*ease);graphLogExtent+=(+$('productRange').value-graphLogExtent)*ease;
 const ctx=$('productGraph').getContext('2d'),extent=10**graphLogExtent,unit=125/extent,X=z=>300+unit*(z[0]-graphCentre[0]),Y=z=>150-unit*(z[1]-graphCentre[1]);
 const bounds=ClockMath.plotBounds(ctx.canvas);ctx.clearRect(0,bounds.top,600,bounds.height);ClockMath.drawComplexPlane(ctx,graphCentre,extent,bounds);
 const data=eulerPath(t,SIGMA,TAUV),points=data.points,idx=selectedProduct<0?points.length-1:Math.min(selectedProduct,points.length-1),selected=points[idx];productHitPoints=[];
 // Markers and labels are sized in CSS pixels and culled against the live band.
 ctx.save();const band=ClockMath.clipPlot(ctx),u=ClockMath.plotFont(ctx,13,'ui-sans-serif');
 function dot(z,col,r,label,below){if(!z.every(Number.isFinite))return;const x=X(z),y=Y(z);if(x<0||x>600||y<band.inTop||y>band.inBottom)return;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,r*u,0,7);ctx.fill();if(label)ctx.fillText(label,x+7*u,y+(below?16:-7)*u);}
 if(typeof drawExplorationUnderlay==='function')drawExplorationUnderlay(ctx,X,Y);
 const rawSum=continuumSum(t,SIGMA,TAUV);ctx.strokeStyle='#87bff2';ctx.lineWidth=2*u;ctx.beginPath();
 for(let i=0;i<rawSum.points.length;i++){const z=rawSum.points[i];if(i)ctx.lineTo(X(z),Y(z));else ctx.moveTo(X(z),Y(z));}ctx.lineTo(X(rawSum.z),Y(rawSum.z));ctx.stroke();dot([0,0],'#87bff2',3,'Σ starts at 0');
 if(typeof selectedPrime!=='undefined'&&selectedPrime){ctx.strokeStyle=factorColour(selectedPrime);ctx.lineWidth=4*u;for(let k=selectedPrime;k<rawSum.points.length;k+=selectedPrime){ctx.beginPath();ctx.moveTo(X(rawSum.points[k-1]),Y(rawSum.points[k-1]));ctx.lineTo(X(rawSum.points[k]),Y(rawSum.points[k]));ctx.stroke();}}
 for(let i=0;i<points.length;i++){const q=points[i],col=i?'hsl('+hueOf(q.p)+' 68% 68%)':'#ddd';if(i&&q.z.every(Number.isFinite)&&points[i-1].z.every(Number.isFinite)){ctx.strokeStyle=col;ctx.lineWidth=(i===idx?3:1.6)*u;ctx.beginPath();ctx.moveTo(X(points[i-1].z),Y(points[i-1].z));ctx.lineTo(X(q.z),Y(q.z));ctx.stroke();}dot(q.z,col,i===idx?5:2,i===idx?(i?'p='+q.p:'Π starts at 1'):'',i===idx&&!i);if(Math.abs(X(q.z)-300)<300&&Y(q.z)>band.inTop&&Y(q.z)<band.inBottom)productHitPoints.push({i,x:X(q.z),y:Y(q.z)});}
 if(typeof selectedPrime!=='undefined'&&selectedPrime){const j=points.findIndex(q=>q.p===selectedPrime);if(j>0){ctx.strokeStyle='#fff2c0';ctx.lineWidth=5*u;ctx.beginPath();ctx.moveTo(X(points[j-1].z),Y(points[j-1].z));ctx.lineTo(X(points[j].z),Y(points[j].z));ctx.stroke();dot(points[j].z,'#fff2c0',6,'linked p='+selectedPrime);}}
 if(data.arriving){ctx.strokeStyle='#ddd8';ctx.setLineDash([3*u,3*u]);ctx.beginPath();ctx.moveTo(X(data.z),Y(data.z));ctx.lineTo(X(data.arriving),Y(data.arriving));ctx.stroke();ctx.setLineDash([]);}
 const sum=continuumSum(t,SIGMA,TAUV).z,pole=Math.hypot(SIGMA-1,TAUV)<1e-8,target=pole?[Infinity,0]:zeta(SIGMA,TAUV);
 dot(sum,'#87bff2',4,'Σ');dot(target,'#e8bd65',4,'ζ');ctx.restore();
 $('productExtent').textContent='±'+extent.toPrecision(2);$('focusZeta').disabled=pole;
 $('productDetails').textContent=(idx?'p='+selected.p+' · × (1 − '+selected.p+'⁻ˢ)⁻¹ = '+complexText(selected.factor):'Empty product = 1')+' → '+complexText(selected.z);
 const error=abs(sub(data.z,target));
 const outside=[...rawSum.points,...points.map(p=>p.z),target].some(z=>!z.every(Number.isFinite)||X(z)<0||X(z)>600||Y(z)<20||Y(z)>280);
 $('productStatus').textContent=(SIGMA>1?'σ > 1: both converge to gold ζ. ':'σ ≤ 1: finite products only; no continued-ζ convergence promised. ')+(pole?'ζ has a pole. ':'Product error '+error.toPrecision(3)+'. ')+'Blue: full sum. Coloured: product; dashed: arrival.'+(outside?' Outside view · Fit to include paths.':' Ruler stays fixed until you change it.');
}
$('viewBubble').insertAdjacentHTML('beforeend','<p id="psiExplanation">Prime count plots (ψ − smooth)/√x on the numbered axis. Gold: ledger residual; green: finite zero-pair approximation. ψ jumps by log p at pᵏ; between jumps the subtracted trend keeps moving. Smooth = x − log(2π) − ½ log(1 − x⁻²). At a jump the zero formula targets the midpoint.</p>');
const analyticGuide=updateGuide;
updateGuide=function(){analyticGuide();$('complexDot').style.left=(SIGMA-.2)/2.8*100+'%';$('complexDot').style.bottom=(TAUV+35)/70*100+'%';drawProductGraph();
 for(const [id,value] of [['sigmaExact',sigmaAim],['tauExact',tauAim]])if(document.activeElement!==$(id))$(id).value=Number(value.toFixed(12));
 $('stair').title='ψ = '+psiSum.toFixed(4)+'; graph: (ψ − smooth)/√x';
 $('psiExplanation').hidden=stairMix<.005;
};
