// Shared coordinates for inputs and outputs; sampled loci are not summation paths.
const plane=$('productGraph');
$('productBubble').querySelector('.bubble-head b').textContent='The complex plane';
$('productBubble').querySelector('.bubble-head button').hidden=true;
$('eulerInputs').insertAdjacentHTML('beforeend',`<div id="planeActions"><button id="placeInput" aria-pressed="false">Place s</button><label><input id="lockSigma" type="checkbox" checked> Hold σ</label><label><input id="ghostPaths" type="checkbox" checked> −τ ghosts</label><label><input id="tauLoci" type="checkbox" checked> τ endpoint trails</label></div>`);
const sweep=document.createElement('div');sweep.id='tauSweep';sweep.innerHTML=`<label>τ window <input id="tauLow" type="number" min="-35" max="35" step="any" value="0" aria-label="Tau window start"></label><input id="tauScrub" type="range" min="0" max="20" step=".0001" value="0" aria-label="Explore tau at fixed sigma"><input id="tauHigh" type="number" min="-35" max="35" step="any" value="20" aria-label="Tau window end"><button id="fitTogether">Fit s + paths</button>`;
$('eulerInputs').before(sweep);
const hint=document.createElement('p');hint.id='planeHint';hint.textContent='Drag s to tune · drag space to pan · wheel / pinch to zoom · dotted trails follow τ';sweep.before(hint);
let placing=false,planeDrag=null,trailCache={key:'',rows:[],ms:0};
$('placeInput').onclick=()=>{placing=!placing;$('placeInput').setAttribute('aria-pressed',String(placing));plane.style.cursor=placing?'crosshair':'grab';};
function tauWindow(){return [+$('tauLow').value,+$('tauHigh').value];}
for(const id of ['tauLow','tauHigh'])$(id).onchange=()=>{let [a,b]=tauWindow();if(!Number.isFinite(a)||!Number.isFinite(b)||a>=b||a< -35||b>35){$('tauLow').value=$('tauScrub').min;$('tauHigh').value=$('tauScrub').max;return;}$('tauScrub').min=a;$('tauScrub').max=b;trailCache.key='';};
$('tauScrub').oninput=()=>tune(sigmaAim,+$('tauScrub').value);
function planePixel(e){const b=graphPlotRect(plane);return [(e.clientX-b.left)*600/b.width,(e.clientY-b.top)*300/b.height];}
function planeValue(q){const u=125/10**graphLogExtent;return [graphCentre[0]+(q[0]-300)/u,graphCentre[1]-(q[1]-150)/u];}
function tunePoint(q){const z=planeValue(q);tune($('lockSigma').checked?sigmaAim:Math.max(.2,Math.min(3,z[0])),Math.max(-35,Math.min(35,z[1])));}
const factorPick=plane.onpointerdown;
const touches=new Map();let pinch=null;
plane.onpointerdown=e=>{e.preventDefault();plane.setPointerCapture(e.pointerId);touches.set(e.pointerId,planePixel(e));if(touches.size===2){const [a,b]=[...touches.values()];pinch={distance:Math.hypot(a[0]-b[0],a[1]-b[1]),extent:10**graphLogExtent};planeDrag=null;return;}
 const q=planePixel(e),z=planeValue(q),near=Math.hypot(z[0]-SIGMA,z[1]-TAUV)*125/10**graphLogExtent<16;
 planeDrag={q,centre:[...graphCentre],unit:125/10**graphLogExtent,input:placing||near||e.shiftKey,moved:false};if(planeDrag.input)tunePoint(q);
};
plane.onpointermove=e=>{if(!touches.has(e.pointerId))return;const q=planePixel(e);touches.set(e.pointerId,q);if(pinch&&touches.size===2){const [a,b]=[...touches.values()];setGraphView(graphCentreAim,pinch.extent*pinch.distance/Math.max(1,Math.hypot(a[0]-b[0],a[1]-b[1])));return;}if(!planeDrag)return;const d=planeDrag;d.moved ||= Math.hypot(q[0]-d.q[0],q[1]-d.q[1])>3;if(d.input)tunePoint(q);else setGraphView([d.centre[0]-(q[0]-d.q[0])/d.unit,d.centre[1]+(q[1]-d.q[1])/d.unit],10**+$('productRange').value);};
function endPlane(e){if(planeDrag&&!planeDrag.input&&!planeDrag.moved&&e.type==='pointerup')factorPick(e);touches.delete(e.pointerId);planeDrag=null;pinch=null;}
plane.onpointerup=endPlane;plane.onpointercancel=endPlane;
plane.addEventListener('wheel',e=>{e.preventDefault();const q=planePixel(e),anchor=planeValue(q),extent=Math.max(1e-5,Math.min(1e8,10**graphLogExtent*Math.exp(Math.max(-1,Math.min(1,e.deltaY*.002))))),unit=125/extent;setGraphView([anchor[0]-(q[0]-300)/unit,anchor[1]+(q[1]-150)/unit],extent);},{passive:false});
plane.tabIndex=0;plane.setAttribute('aria-label','Shared input and output complex plane. Arrow keys adjust tau; Shift arrows adjust sigma. Drag input to tune, background to pan, wheel to zoom.');
plane.onkeydown=e=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();const sign=['ArrowUp','ArrowRight'].includes(e.key)?1:-1,step=e.altKey?.001:.05;tune(e.shiftKey?sigmaAim+sign*step:sigmaAim,e.shiftKey?tauAim:tauAim+sign*step);};
function tauTrails(){const [a,b]=tauWindow(),key=[t,SIGMA,a,b].join('/'),ms=performance.now();if(key!==trailCache.key&&ms-trailCache.ms>220){const rows=[];for(let i=0;i<=40;i++){const tau=a+(b-a)*i/40;rows.push({tau,sum:continuumSum(t,SIGMA,tau).z,product:eulerPath(t,SIGMA,tau).z});}trailCache={key,rows,ms};}return trailCache.rows;}
function drawExplorationUnderlay(ctx,X,Y){
 ctx.save();ctx.fillStyle='#9eafbf0c';ctx.fillRect(X([0,0]),20,X([1,0])-X([0,0]),260);ctx.strokeStyle='#a9b5c133';ctx.setLineDash([3,6]);for(const sigma of [0,.5,1,SIGMA]){ctx.beginPath();ctx.moveTo(X([sigma,0]),20);ctx.lineTo(X([sigma,0]),280);ctx.stroke();}ctx.setLineDash([]);
 function path(zs,col,dash=[]){ctx.strokeStyle=col;ctx.lineWidth=1.3;ctx.setLineDash(dash);ctx.beginPath();let fresh=true;for(const z of zs){if(!z.every(Number.isFinite)){fresh=true;continue;}if(fresh){ctx.moveTo(X(z),Y(z));fresh=false;}else ctx.lineTo(X(z),Y(z));}ctx.stroke();ctx.setLineDash([]);}
 if($('ghostPaths').checked){const s=continuumSum(t,SIGMA,TAUV),p=eulerPath(t,SIGMA,TAUV);path([...s.points,s.z].map(z=>[z[0],-z[1]]),'#87bff240');for(let i=1;i<p.points.length;i++)path([p.points[i-1].z,p.points[i].z].map(z=>[z[0],-z[1]]),'hsla('+hueOf(p.points[i].p)+' 68% 68% / .23)');if(p.arriving)path([p.z,p.arriving].map(z=>[z[0],-z[1]]),'#ffffff30',[3,3]);}
 if($('tauLoci').checked){const rows=tauTrails();path(rows.map(r=>r.sum),'#87bff270',[2,5]);path(rows.map(r=>r.product),'#db9e7470',[2,5]);}
 ctx.restore();
}
$('fitTogether').onclick=()=>{const s=continuumSum(t,SIGMA,TAUV),p=eulerPath(t,SIGMA,TAUV);let zs=[...s.points,s.z,...p.points.map(q=>q.z)];if(p.arriving)zs.push(p.arriving);if(Math.hypot(SIGMA-1,TAUV)>1e-8)zs.push(zeta(SIGMA,TAUV));if($('ghostPaths').checked)zs.push(...zs.map(z=>[z[0],-z[1]]));if($('tauLoci').checked)for(const r of tauTrails())zs.push(r.sum,r.product);zs.push([SIGMA,TAUV],[sigmaAim,tauAim]);const finite=zs.filter(z=>z.every(Number.isFinite)),lo=[0,1].map(i=>Math.min(...finite.map(z=>z[i]))),hi=[0,1].map(i=>Math.max(...finite.map(z=>z[i])));setGraphView(lo.map((v,i)=>(v+hi[i])/2),Math.max((hi[0]-lo[0])/4,(hi[1]-lo[1])/2,.05)*1.2);};
const explorationGuide=updateGuide;
updateGuide=function(){explorationGuide();const ctx=plane.getContext('2d'),u=125/10**graphLogExtent,x=300+u*(SIGMA-graphCentre[0]),y=150-u*(TAUV-graphCentre[1]);ctx.save();ctx.strokeStyle='#e5b8ff';ctx.fillStyle='#e5b8ff';ctx.lineWidth=2;const px=Math.max(14,Math.min(580,x)),py=Math.max(32,Math.min(260,y));ctx.beginPath();ctx.arc(px,py,7,0,7);ctx.stroke();ctx.fillText('s'+(px!==x||py!==y?' ↗ off view':''),px+10,py-10);ctx.restore();if(document.activeElement!==$('tauScrub'))$('tauScrub').value=tauAim;};
// Explanations belong in an optional overlay, leaving the plane unobstructed.
const planeNotes=document.createElement('section');planeNotes.id='planeNotes';planeNotes.className='bubble';planeNotes.setAttribute('popover','auto');planeNotes.innerHTML='<div class="bubble-head"><b>Reading the plane</b><button popovertarget="planeNotes" popovertargetaction="hide">×</button></div><p>Purple s is the input; blue Σ and coloured Π are finite paths at the current beat. Dim paths use −τ: exact conjugates across the real axis. The faint band is 0 &lt; σ &lt; 1.</p><p>Dotted blue and amber curves sample the endpoints as τ varies across the chosen window, at fixed σ and beat. They are not additional sum terms. Drag the τ slider to follow them. The two infinite expressions converge together only for σ &gt; 1.</p><p>Hold σ constrains input dragging vertically. Turn it off to place s freely (0.2 ≤ σ ≤ 3, |τ| ≤ 35). Drag empty space to pan; wheel or pinch to zoom. Fit includes the current paths; Fit s + paths also includes the input, ghosts and enabled endpoint trails.</p>';
planeNotes.append($('productDetails'),$('productStatus'),$('sectorMeasure'));stage.append(planeNotes);
const explain=document.createElement('button');explain.textContent='Guide';explain.setAttribute('popovertarget','planeNotes');document.querySelector('.product-tools').append(explain);
