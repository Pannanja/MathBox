// Euler–Maclaurin evaluator shared verbatim by the page and its curve worker.
// The truncation grows with |Im(s)|; the old fixed N=96 was only for small heights.
function locusZeta(sigma,tau){
 if(Math.hypot(sigma-1,tau)<1e-12)return [Infinity,Infinity];
 const N=Math.max(96,Math.ceil(1.25*Math.abs(tau))),ln=Math.log(N);
 let re=0,im=0,cr=0,ci=0;
 for(let n=1;n<=N;n++){const l=Math.log(n),r=Math.exp(-sigma*l),a=-tau*l,yr=r*Math.cos(a)-cr,yi=r*Math.sin(a)-ci,tr=re+yr,ti=im+yi;cr=(tr-re)-yr;ci=(ti-im)-yi;re=tr;im=ti;}
 const a=-tau*ln,r=Math.exp(-sigma*ln),nr=r*Math.cos(a),ni=r*Math.sin(a),d=(sigma-1)**2+tau*tau;
 re+=N*(nr*(sigma-1)+ni*tau)/d-nr/2;im+=N*(ni*(sigma-1)-nr*tau)/d-ni/2;
 const coeff=[1/12,-1/720,1/30240,-1/1209600,1/47900160,-691/1307674368000];let rr=1,ri=0,j=0;
 for(let k=1;k<=6;k++){while(j<2*k-1){const next=rr*(sigma+j)-ri*tau;ri=rr*tau+ri*(sigma+j);rr=next;j++;}const f=coeff[k-1]*Math.pow(N,1-2*k);re+=f*(rr*nr-ri*ni);im+=f*(rr*ni+ri*nr);}
 return [re,im];
}
zeta=locusZeta;
// Extend every visible input route together, including the exact-field shortcuts.
$('tauExact').min=$('tauDial').min=-1000;$('tauExact').max=$('tauDial').max=1000;
$('tauExact').onkeydown=e=>{if(!['ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const step=e.altKey?.000001:e.shiftKey?.01:.0001;const value=Math.max(-1000,Math.min(1000,tauAim+(e.key==='ArrowUp'?step:-step)));$('tauExact').value=Number(value.toFixed(12));$('tauExact').oninput();};
const rawTune=tune;tune=function(sigma,tau){rawTune(Math.max(.2,Math.min(3,sigma)),Math.max(-1000,Math.min(1000,tau)));};
tunePoint=function(q){const z=planeValue(q);tune($('lockSigma').checked?sigmaAim:z[0],z[1]);};
for(const id of ['tauLow','tauHigh']){$(id).min=-1000;$(id).max=1000;$(id).onchange=()=>{const [a,b]=tauWindow();if($(id).value===''||!Number.isFinite(a)||!Number.isFinite(b)||a>=b||a< -1000||b>1000){$('tauLow').value=$('tauScrub').min;$('tauHigh').value=$('tauScrub').max;return;}$('tauScrub').min=a;$('tauScrub').max=b;trailCache.key='';};}
$('tauHigh').value=60;$('tauHigh').onchange();
$('tauLoci').checked=false;planeNotes.append($('tauLoci').parentElement);
$('planeActions').insertAdjacentHTML('beforeend','<label><input id="zetaLocus" type="checkbox" checked> ζ curve</label>');
const locusTools=document.createElement('div');locusTools.id='locusTools';locusTools.innerHTML='<button id="fitLocus">Fit ζ curve</button><label>τ span <select id="locusSpan" aria-label="Zeta curve tau span"><option value="60">60</option><option value="100">100</option><option value="500">500</option><option value="1000">1000</option></select></label><output id="locusStatus" aria-live="polite">Preparing ζ curve…</output>';$('planeHint').before(locusTools);
$('locusSpan').onchange=()=>{const width=+$('locusSpan').value,a=Math.min(+$('tauLow').value,1000-width);$('tauLow').value=a;$('tauHigh').value=a+width;$('tauHigh').onchange();};
$('planeHint').textContent='Drag s · pan space · wheel to zoom · gold curve follows τ · brighter near current τ';
planeNotes.insertAdjacentHTML('beforeend','<p>The gold curve is ζ(σ+iτ) itself, computed independently of the clock beat. Bright gold follows the current τ; dim gold is its −τ reflection when ghosts are enabled. Fit ζ curve frames the output alone, so a large input height does not squeeze the loops. τ spans up to 1000 in either direction are supported. Change the window endpoints to isolate a tangle.</p><p>Curve points stream from a background worker as they are computed; completed curves are cached for six recent σ/window combinations. Sampling uses steps no larger than 0.04 with extra subdivision for curvature. At extreme zoom a polyline still has finite resolution; narrow the τ window and inspect it. The pole at s=1 breaks the curve. The critical line has no singularity there at nonzero τ; its many visits near zero create the loops.</p>');
for(const p of planeNotes.querySelectorAll('p'))p.innerHTML=p.innerHTML.replace('|τ| ≤ 35','|τ| ≤ 1000');
let locusPrevious=null,locusData=null,locusWorker=null,locusWanted='',locusChanged=0,locusRequested='',locusFitPending=false;const locusCache=new Map();
function computeLocusJob(){
 self.onmessage=e=>{const {sigma,a,b,key}=e.data,start=performance.now(),rows=[];let sent=0,lastFlush=start,limited=false;
 function flush(progress,done=false){const chunk=new Float64Array(rows.slice(sent));sent=rows.length;lastFlush=performance.now();self.postMessage({key,sigma,a,b,chunk,progress,done,limited,ms:lastFlush-start},[chunk.buffer]);}
 const sample=tau=>[tau,...locusZeta(sigma,tau)];
 function append(q){rows.push(...q);}
 function refine(left,right,depth){const mid=sample((left[0]+right[0])/2);const err=Math.hypot(mid[1]-(left[1]+right[1])/2,mid[2]-(left[2]+right[2])/2),scale=1+Math.hypot(mid[1],mid[2]);if(depth<7&&err>2e-4*scale&&rows.length<360000){refine(left,mid,depth+1);refine(mid,right,depth+1);}else {if(err>2e-4*scale)limited=true;append(right);}}
 const steps=Math.ceil((b-a)/.04);let left=sample(a);append(left);
 for(let i=1;i<=steps;i++){const right=sample(a+(b-a)*i/steps);if(sigma===1&&left[0]<0&&right[0]>0){append([0,NaN,NaN]);append(right);}else refine(left,right,0);left=right;if(i===1||performance.now()-lastFlush>=32)flush(i/steps);}
 flush(1,true);};
}
function requestLocus(){if(!$('zetaLocus').checked)return;const [a,b]=tauWindow(),sigma=sigmaAim,key=[sigma,a,b].join('/'),now=performance.now();if(key!==locusWanted){if(locusData?.done)locusPrevious=locusData;locusWanted=key;locusChanged=now;if(locusWorker){locusWorker.terminate();locusWorker=null;}locusRequested='';$('locusStatus').textContent='Preparing curve…';}if(key===locusRequested||now-locusChanged<40)return;locusRequested=key;
 if(locusCache.has(key)){locusData=locusCache.get(key);$('locusStatus').textContent=locusData.data.length/3+' points · cached'+(locusData.limited?' · narrow window for detail':'');if(locusFitPending){locusFitPending=false;fitZetaCurve();}return;}
 const url=URL.createObjectURL(new Blob([locusZeta.toString()+'\n('+computeLocusJob.toString()+')();'],{type:'text/javascript'}));
 try{locusWorker=new Worker(url);}catch(error){$('locusStatus').textContent='Curve worker unavailable';URL.revokeObjectURL(url);return;}URL.revokeObjectURL(url);$('locusStatus').textContent='Computing ζ…';
 const worker=locusWorker;let buffer=new Float64Array(3072),used=0;
 worker.onmessage=e=>{if(worker!==locusWorker||e.data.key!==locusWanted)return;const {chunk,...meta}=e.data;
  if(used+chunk.length>buffer.length){const expanded=new Float64Array(Math.max(buffer.length*2,used+chunk.length));expanded.set(buffer.subarray(0,used));buffer=expanded;}
  buffer.set(chunk,used);used+=chunk.length;locusData={...meta,data:meta.done?buffer.slice(0,used):buffer.subarray(0,used)};
  if(meta.done){locusCache.set(key,locusData);if(locusCache.size>6)locusCache.delete(locusCache.keys().next().value);$('locusStatus').textContent=used/3+' points · '+(meta.ms/1000).toFixed(2)+' s'+(meta.limited?' · narrow window for detail':'');worker.terminate();locusWorker=null;}
  else $('locusStatus').textContent='Growing ζ · '+Math.round(meta.progress*100)+'% · '+used/3+' points';
  if(locusFitPending)fitZetaCurve();
 };
 locusWorker.onerror=()=>{if(worker!==locusWorker)return;$('locusStatus').textContent='Curve calculation failed';locusWorker?.terminate();locusWorker=null;};locusWorker.postMessage({key,sigma,a,b});
}
function fitZetaCurve(){if(!locusData||locusData.key!==locusWanted){locusFitPending=true;return;}locusFitPending=!locusData.done;let lo=[Infinity,Infinity],hi=[-Infinity,-Infinity];const d=locusData.data;for(let i=0;i<d.length;i+=3){if(!Number.isFinite(d[i+1])||!Number.isFinite(d[i+2]))continue;for(let axis=0;axis<2;axis++){lo[axis]=Math.min(lo[axis],d[i+1+axis]);hi[axis]=Math.max(hi[axis],d[i+1+axis]);}if($('ghostPaths').checked){lo[1]=Math.min(lo[1],-d[i+2]);hi[1]=Math.max(hi[1],-d[i+2]);}}if(lo.every(Number.isFinite))setGraphView(lo.map((v,i)=>(v+hi[i])/2),Math.max((hi[0]-lo[0])/4,(hi[1]-lo[1])/2,.01)*1.15);}
$('fitLocus').onclick=()=>{if(!$('zetaLocus').checked)$('zetaLocus').checked=true;requestLocus();fitZetaCurve();};
const beforeLocus=drawExplorationUnderlay;
// Keep the previous curve as labelled context; calculate live local detail at the
// displayed input, never by morphing values from a different sigma.
const locusRaster=document.createElement('canvas'),locusBackdrop=document.createElement('canvas');
for(const canvas of [locusRaster,locusBackdrop]){canvas.width=600;canvas.height=300;}
let locusRasterKey='',locusRasterCount=0;const backdropState={key:'',count:0};
let liveLocusPreview={sigma:NaN,tau:NaN,rows:[],ms:0};
function paintLocus(data,canvas,state,ctx,X,Y,alpha){
 const d=data.data,key=[data.key,graphCentre[0].toPrecision(9),graphCentre[1].toPrecision(9),graphLogExtent.toPrecision(9),$('ghostPaths').checked].join('/');
 // The raster shares the main canvas transform, so it is composited over the
 // same visible logical rectangle rather than the retired 600x300 assumption.
 const bounds=ClockMath.plotBounds(canvas);
 if(key!==state.key||d.length!==state.count){const c=canvas.getContext('2d');if(key!==state.key||d.length<state.count){c.clearRect(0,bounds.top,600,bounds.height);state.count=0;}state.key=key;c.lineWidth=1;
  for(const ghost of ($('ghostPaths').checked?[true,false]:[false])){c.strokeStyle=ghost?'#e8bd6518':'#e8bd654c';c.beginPath();let fresh=true;for(let i=Math.max(0,state.count-3);i<d.length;i+=3){const z=[d[i+1],ghost?-d[i+2]:d[i+2]];if(!z.every(Number.isFinite)){fresh=true;continue;}if(fresh){c.moveTo(X(z),Y(z));fresh=false;}else c.lineTo(X(z),Y(z));}c.stroke();}state.count=d.length;}
 ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(canvas,0,bounds.top,600,bounds.height);ctx.restore();
}
drawExplorationUnderlay=function(ctx,X,Y){beforeLocus(ctx,X,Y);requestLocus();if(!$('zetaLocus').checked)return;
 const current=locusData?.key===locusWanted,settled=current&&Math.abs(SIGMA-locusData.sigma)<1e-4,ready=settled&&locusData.done;
 if(!ready&&locusPrevious&&locusPrevious.key!==locusWanted)paintLocus(locusPrevious,locusBackdrop,backdropState,ctx,X,Y,.24);
 if(current){const state={key:locusRasterKey,count:locusRasterCount};paintLocus(locusData,locusRaster,state,ctx,X,Y,settled?1:.25);locusRasterKey=state.key;locusRasterCount=state.count;}
 if(liveLocusPreview.sigma!==SIGMA||liveLocusPreview.tau!==TAUV){const start=performance.now(),rows=[];for(let i=0;i<=24;i++){const tau=Math.max(-1000,Math.min(1000,TAUV-.6+i*.05));rows.push([tau,...locusZeta(SIGMA,tau)]);}liveLocusPreview={sigma:SIGMA,tau:TAUV,rows,ms:performance.now()-start};}
 ctx.save();ctx.strokeStyle='#ffe3a1';ctx.lineWidth=2.4;ctx.setLineDash(ready?[]:[4,3]);ctx.beginPath();let fresh=true,prior=null;
 for(const q of liveLocusPreview.rows){const z=q.slice(1);if(!z.every(Number.isFinite)){fresh=true;prior=q;continue;}if(SIGMA===1&&prior&&prior[0]<0&&q[0]>0)fresh=true;if(fresh){ctx.moveTo(X(z),Y(z));fresh=false;}else ctx.lineTo(X(z),Y(z));prior=q;}ctx.stroke();ctx.restore();
 const text=ready?'Gold ζ · blue sum · coloured product':'Dashed: live detail'+(locusPrevious&&locusPrevious.key!==locusWanted?' · faint: previous σ '+Number(locusPrevious.sigma.toFixed(4)):' · full curve updating');
 if($('liveCurveState')&&$('liveCurveState').textContent!==text)$('liveCurveState').textContent=text;
};

// A requested fit follows incoming bounds until completion; direct navigation releases it.
for(const event of ['pointerdown','wheel'])plane.addEventListener(event,()=>{locusFitPending=false;},{capture:true,passive:true});
for(const id of ['fitPaths','fitTogether','focusZeta','homeGraph'])$(id).addEventListener('click',()=>{locusFitPending=false;},{capture:true});
$('productRange').addEventListener('input',()=>{locusFitPending=false;});
