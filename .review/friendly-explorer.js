// One everyday control surface; optional comparisons and factor tools are secondary.
$('lockSigma').checked=false;
const options=document.createElement('section');options.id='exploreOptions';options.className='bubble';options.setAttribute('popover','auto');options.innerHTML='<div class="bubble-head"><b>Exploration options</b><button popovertarget="exploreOptions" popovertargetaction="hide" aria-label="Close exploration options">×</button></div><p>Trace a vertical line</p><div id="traceWindow"><label>From τ </label><span>to</span></div><p>Compare and navigate</p><div id="extraViews"></div>';
stage.append(options);
const windowRow=$('traceWindow');windowRow.querySelector('label').append($('tauLow'));windowRow.append($('tauHigh'));const spanLabel=$('locusSpan').parentElement;spanLabel.firstChild.textContent='Span ';windowRow.append(spanLabel);
options.append($('planeActions'));
$('placeInput').textContent='Place input on plot';const oldPlace=$('placeInput').onclick;$('placeInput').onclick=()=>{oldPlace();options.hidePopover();};
const lockLabel=$('lockSigma').parentElement;lockLabel.lastChild.textContent=' Lock real part (σ)';
$('ghostPaths').parentElement.lastChild.textContent=' Mirror at −τ';
$('zetaLocus').parentElement.lastChild.textContent=' Show ζ curve';
const extras=$('extraViews');
for(const [id,label] of [['fitPaths','Fit sum & product'],['fitTogether','Fit input & outputs'],['focusZeta','Centre on ζ'],['homeGraph','Centre on zero'],['productPrev','Previous factor'],['productNext','Next factor'],['clearLink','Clear factor']]){$(id).textContent=label;extras.append($(id));}
const dock=document.createElement('div');dock.id='exploreDock';$('productGraph').after(dock);
for(const [axis,title,slider] of [['sigma','Real σ',$('sigmaDial')],['tau','Height τ',$('tauScrub')]]){const row=document.createElement('div');row.className='axis-control';row.innerHTML='<label for="'+axis+'Exact">'+title+'</label>';row.append(slider,$(axis+'Exact'));dock.append(row);}
$('sigmaDial').oninput=()=>tune(+$('sigmaDial').value,tauAim);
const toolbar=document.createElement('div');toolbar.id='exploreToolbar';dock.append(toolbar);toolbar.append($('fitLocus'));$('fitLocus').textContent='Fit curve';
for(const [id,text,factor] of [['zoomOut','−',1.6],['zoomIn','+',1/1.6]]){const button=document.createElement('button');button.id=id;button.textContent=text;button.setAttribute('aria-label',id==='zoomOut'?'Zoom out':'Zoom in');button.onclick=()=>{locusFitPending=false;setGraphView(graphCentreAim,10**+$('productRange').value*factor);};toolbar.append(button);}
const explorerMoreButton=document.createElement('button');explorerMoreButton.id='exploreMore';explorerMoreButton.textContent='Options';explorerMoreButton.setAttribute('popovertarget','exploreOptions');toolbar.append(explorerMoreButton,explain);
const caption=document.createElement('p');caption.id='liveCurveState';caption.textContent='Gold ζ · blue sum · coloured product';
dock.append(toolbar,caption,$('locusStatus'));$('productGraph').after(dock);
$('planeHint').textContent='Drag the purple s to change the input. Drag empty space to pan. Scroll to zoom.';
$('planeHint').before(dock);dock.before($('planeHint'));
// The old containers retain nonvisual state controls used by the renderer.
for(const id of ['eulerInputs','tauSweep','locusTools'])$(id).hidden=true;
document.querySelector('.product-tools').hidden=true;
$('productBubble').querySelector('.bubble-head b').textContent='Explore ζ';
// Picking an offscreen input badge should work just like picking its visible point.
const inputPointerDown=plane.onpointerdown;
plane.onpointerdown=e=>{const q=planePixel(e),unit=125/10**graphLogExtent,x=Math.max(14,Math.min(580,300+unit*(SIGMA-graphCentre[0]))),y=Math.max(32,Math.min(260,150-unit*(TAUV-graphCentre[1]))),near=Math.hypot(q[0]-x,q[1]-y)<16;
 if(near&&!placing&&!e.shiftKey){e.preventDefault();plane.setPointerCapture(e.pointerId);touches.set(e.pointerId,q);if(touches.size>1){inputPointerDown(e);return;}planeDrag={q,centre:[...graphCentre],unit,input:true,moved:false,relative:[sigmaAim,tauAim]};return;}inputPointerDown(e);
};
const inputPointerMove=plane.onpointermove;
plane.onpointermove=e=>{if(planeDrag?.relative&&touches.has(e.pointerId)){const q=planePixel(e),d=planeDrag;touches.set(e.pointerId,q);d.moved=true;tune($('lockSigma').checked?d.relative[0]:d.relative[0]+(q[0]-d.q[0])/d.unit,d.relative[1]-(q[1]-d.q[1])/d.unit);return;}inputPointerMove(e);};
planeNotes.insertAdjacentHTML('beforeend','<p>While the full curve is recalculated, a dashed local preview is evaluated directly at the moving input. A faint previous curve is labelled with its real part. It is context, not an interpolated answer. The real part is unlocked by default; use Options to constrain dragging vertically.</p>');
