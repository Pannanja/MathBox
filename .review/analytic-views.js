// Initial orientation is the ordinary complex plane: real right, imaginary up.
reflectionAim=reflectionMix=1;$('reflect').setAttribute('aria-pressed','true');
$('tauDial').min=-35;
const complexInput=document.createElement('div');complexInput.className='complex-input';
const sigmaGroup=$('sigmaSlot').parentElement,tauGroup=$('tauSlot').parentElement;
sigmaGroup.before(complexInput);
complexInput.append(...sigmaGroup.children,...tauGroup.children);sigmaGroup.remove();tauGroup.remove();
complexInput.insertAdjacentHTML('beforeend','<div id="complexPad" aria-hidden="true"><span id="complexDot"></span></div>');
function pickComplex(e){const b=$('complexPad').getBoundingClientRect();tune(.2+2.8*Math.max(0,Math.min(1,(e.clientX-b.left)/b.width)),35-70*Math.max(0,Math.min(1,(e.clientY-b.top)/b.height)));}
$('complexPad').onpointerdown=e=>{e.currentTarget.setPointerCapture(e.pointerId);pickComplex(e);};
$('complexPad').onpointermove=e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))pickComplex(e);};
const productButton=document.createElement('button');productButton.textContent='Product';productButton.id='productView';productButton.setAttribute('popovertarget','productBubble');$('layerButtons').append(productButton);
const productBubble=document.createElement('section');productBubble.id='productBubble';productBubble.className='bubble product-bubble';productBubble.setAttribute('popover','manual');
productBubble.innerHTML=`<div class="bubble-head"><b>Euler product · one factor at a time</b><button popovertarget="productBubble" popovertargetaction="hide" aria-label="Close product graph">×</button></div>
<canvas id="productGraph" width="600" height="300" aria-label="Complex plane: prime-coloured partial products, blue finite sum, gold zeta"></canvas>
<div class="product-tools"><button id="productPrev" aria-label="Previous prime factor">←</button><button id="productNext" aria-label="Next prime factor">→</button><span>View ±</span><input id="productRange" type="range" min="0" max="3" step=".01" value=".30103" aria-label="Logarithmic graph extent"><output id="productExtent">2</output></div>
<p id="productDetails"></p><p id="productStatus"></p>`;stage.append(productBubble);
const analyticPrimes=[];for(let p=2;p<=5001;p++)if(isPrime(p))analyticPrimes.push(p);
function eulerPath(x,sigma,tau){
 let z=[1,0];const points=[{p:1,z:[1,0],factor:[1,0]}];
 for(const p of analyticPrimes){if(p>x)break;const factor=div([1,0],sub([1,0],power(p,sigma,tau)));z=mul(z,factor);points.push({p,z:[...z],factor});}
 const next=Math.floor(x)+1,fr=x-Math.floor(x);
 let arriving=null;
 if(fr>0&&isPrime(next)){const f=div([1,0],sub([1,0],power(next,sigma,tau))),r=Math.pow(abs(f),fr),a=Math.atan2(f[1],f[0])*fr;arriving=mul(z,[r*Math.cos(a),r*Math.sin(a)]);}
 return {points,z,arriving};
}
let selectedProduct=-1,productHitPoints=[];
$('productPrev').onclick=()=>{const last=eulerPath(t,SIGMA,TAUV).points.length-1;selectedProduct=Math.max(0,(selectedProduct<0?last:selectedProduct)-1);};
$('productNext').onclick=()=>{const last=eulerPath(t,SIGMA,TAUV).points.length-1;selectedProduct=Math.min(last,(selectedProduct<0?last:selectedProduct)+1);};
$('productGraph').onpointerdown=e=>{const b=e.currentTarget.getBoundingClientRect(),x=(e.clientX-b.left)*600/b.width,y=(e.clientY-b.top)*300/b.height;let best=Infinity;for(const p of productHitPoints){const d=Math.hypot(p.x-x,p.y-y);if(d<best){best=d;selectedProduct=p.i;}}};
const complexText=z=>z.every(Number.isFinite)?z[0].toFixed(4)+(z[1]<0?' − ':' + ')+Math.abs(z[1]).toFixed(4)+'i':'outside numeric range';
function drawProductGraph(){
 if(!$('productBubble').matches(':popover-open'))return;
 const ctx=$('productGraph').getContext('2d'),extent=10**+$('productRange').value,unit=125/extent,X=z=>300+unit*z[0],Y=z=>150-unit*z[1];
 ctx.clearRect(0,0,600,300);ctx.font='12px ui-monospace';ctx.lineWidth=1;ctx.strokeStyle='#71897b66';ctx.fillStyle='#b0bfb6';
 for(let i=-2;i<=2;i++){const v=i*extent/2;ctx.beginPath();ctx.moveTo(X([v,0]),25);ctx.lineTo(X([v,0]),275);ctx.moveTo(50,Y([0,v]));ctx.lineTo(550,Y([0,v]));ctx.stroke();ctx.fillText(v.toPrecision(2),X([v,0])+3,165);if(i)ctx.fillText(v.toPrecision(2),304,Y([0,v])-4);}
 ctx.fillText('Re →',550,146);ctx.fillText('Im ↑',308,16);
 const data=eulerPath(t,SIGMA,TAUV),points=data.points,idx=selectedProduct<0?points.length-1:Math.min(selectedProduct,points.length-1),selected=points[idx];productHitPoints=[];
 ctx.save();ctx.beginPath();ctx.rect(0,20,600,260);ctx.clip();
 function dot(z,col,r,label){if(!z.every(Number.isFinite))return;const x=X(z),y=Y(z);if(x<0||x>600||y<20||y>280)return;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();if(label)ctx.fillText(label,x+7,y-7);}
 for(let i=0;i<points.length;i++){const q=points[i],col=i?'hsl('+hueOf(q.p)+' 68% 68%)':'#ddd';if(i&&q.z.every(Number.isFinite)&&points[i-1].z.every(Number.isFinite)){ctx.strokeStyle=col;ctx.lineWidth=i===idx?3:1.6;ctx.beginPath();ctx.moveTo(X(points[i-1].z),Y(points[i-1].z));ctx.lineTo(X(q.z),Y(q.z));ctx.stroke();}dot(q.z,col,i===idx?5:2,i===idx?(i?'p='+q.p:'start: 1'):'');if(Math.abs(X(q.z)-300)<300&&Math.abs(Y(q.z)-150)<130)productHitPoints.push({i,x:X(q.z),y:Y(q.z)});}
 if(data.arriving){ctx.strokeStyle='#ddd8';ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(X(data.z),Y(data.z));ctx.lineTo(X(data.arriving),Y(data.arriving));ctx.stroke();ctx.setLineDash([]);}
 const sum=continuumSum(t,SIGMA,TAUV).z,pole=Math.hypot(SIGMA-1,TAUV)<1e-8,target=pole?[Infinity,0]:zeta(SIGMA,TAUV);
 dot(sum,'#87bff2',4,'Σ');dot(target,'#e8bd65',4,'ζ');ctx.restore();
 $('productExtent').textContent=extent.toPrecision(3);
 $('productDetails').textContent=(idx?'p='+selected.p+' · × (1 − '+selected.p+'⁻ˢ)⁻¹ = '+complexText(selected.factor):'Empty product = 1')+' → '+complexText(selected.z);
 const error=abs(sub(data.z,target));
 $('productStatus').textContent=(SIGMA>1?'σ > 1: sum and product converge to gold ζ. ':'σ ≤ 1: finite products only; no convergence to the continued ζ is promised. ')+(pole?'ζ has a pole here. ':'Product error '+error.toPrecision(3)+'. ')+points.slice(1).length+' prime factors · blue Σ. Dashed: arriving factor.'+(Math.abs(data.z[0])*unit>290||Math.abs(data.z[1])*unit>130?' Product outside view; widen ±.':'');
}
$('viewBubble').insertAdjacentHTML('beforeend','<p id="psiExplanation">Prime count plots (ψ − smooth)/√x on the numbered axis. Gold: ledger residual; green: finite zero-pair approximation. ψ jumps by log p at pᵏ; between jumps the subtracted trend keeps moving. Smooth = x − log(2π) − ½ log(1 − x⁻²). At a jump the zero formula targets the midpoint.</p>');
const analyticGuide=updateGuide;
updateGuide=function(){analyticGuide();$('complexDot').style.left=(SIGMA-.2)/2.8*100+'%';$('complexDot').style.bottom=(TAUV+35)/70*100+'%';drawProductGraph();
 $('stair').title='ψ = '+psiSum.toFixed(4)+'; graph: (ψ − smooth)/√x';
 $('psiExplanation').hidden=stairMix<.005;
};
