export interface WorkspaceState { time:number; target:number; mode:string; sound:boolean; selected:number; sigma:number; tau:number; j:number }
export interface WorkspaceActions {
 read():WorkspaceState; seek(value:number):void; jump(value:number):void;
 setting(key:string,value:string|boolean):void; resize():void;
}
const paths:Record<string,string>={
 // Speaker for the mute toggle; a toothed ring for settings; stacked plates for
 // appearance layers; faders for the levels that mix sound and light.
 sound:'M11 5 6 9H3v6h3l5 4V5m4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',
 mute:'M11 5 6 9H3v6h3l5 4V5m4 4 5 6m0-6-5 6',
 gear:'M12 9.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6M10.6 3.4h2.8l.4 2.3 1.9 1.1 2.1-1 1.4 2.4-1.7 1.5v2.6l1.7 1.5-1.4 2.4-2.1-1-1.9 1.1-.4 2.3h-2.8l-.4-2.3-1.9-1.1-2.1 1-1.4-2.4 1.7-1.5V9.7L4.8 8.2l1.4-2.4 2.1 1 1.9-1.1z',
 layers:'m12 3 8.5 4.5L12 12 3.5 7.5zM4.5 12 12 16l7.5-4M4.5 16.5 12 20.5l7.5-4',
 levels:'M5 5v5m0 4v5m7-14v9m0 4v1m7-14v3m0 4v7M2.6 12h4.8M9.6 16h4.8M16.6 9h4.8',
 close:'m6 6 12 12M6 18 18 6'};
const icon=(name:string)=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]||paths.gear}"/></svg>`;
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;

/** Owns presentation and controls; mathematical state remains behind the bridge. */
export function mountWorkspace(actions:WorkspaceActions){
 const app=el('clockApp'),clockStage=el('clockStage'),product=el('productBubble');app.classList.add('redesigned');
 const shell=document.createElement('div');shell.id='workspaceShell';shell.dataset.layout='clock';
 shell.innerHTML=`<section id="clockWorkspace" class="workspace" aria-label="Clock of Primes">
 <header class="workspace-title"><h1>Clock of Primes</h1><div class="workspace-actions"><span id="soundSlot"></span><button id="levelsButton" class="icon-button" title="Sound & light" aria-label="Sound and light levels">${icon('levels')}</button><button id="appearanceButton" class="icon-button" title="Clock appearance" aria-label="Clock appearance">${icon('layers')}</button></div></header>
 <div id="clockSurface"></div><footer id="clockTransport"></footer>
 <aside id="clockInspector" class="inspector" hidden></aside></section>
 <div id="workspaceDivider" role="separator" tabindex="0" aria-label="Resize clock and explorer" aria-orientation="vertical" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100"><i></i></div>
 <section id="riemannWorkspace" class="workspace" aria-label="Riemann explorer"><header class="workspace-title"><h1>Riemann explorer</h1><button id="riemannHelp" class="text-button">Inspect</button></header><div id="riemannContent"></div><aside id="riemannInspector" class="inspector" hidden></aside></section>
 <nav id="workspaceSwitch" aria-label="Workspace"><button data-layout="clock" aria-pressed="true">Clock</button><button data-layout="both" aria-pressed="false">Both</button><button data-layout="explorer" aria-pressed="false">Riemann explorer <span aria-hidden="true">↗</span></button></nav>`;
 app.append(shell);el('clockSurface').append(clockStage,el('originalProof'));el('clockTransport').append(el('transportCorner'));el('clockWorkspace').insertBefore(el('tapeDomain'),el('clockTransport'));
 const panels=new Map<string,{node:HTMLElement;owner:string}>();let openClock='',openRiemann='';
 const close=(owner:string)=>{const id=owner==='clock'?openClock:openRiemann;if(id){const entry=panels.get(id)!;entry.node.hidden=true;entry.node.dataset.open='false';}el(owner+'Inspector').hidden=true;if(owner==='clock')openClock='';else openRiemann='';actions.resize();};
 const open=(id:string)=>{const entry=panels.get(id);if(!entry)return;const {owner,node}=entry;if((owner==='clock'?openClock:openRiemann)===id){close(owner);return;}close(owner);el(owner+'Inspector').append(node);node.hidden=false;node.dataset.open='true';el(owner+'Inspector').hidden=false;el(owner+'Inspector').scrollTop=0;if(owner==='clock')openClock=id;else openRiemann=id;actions.resize();};
 const register=(node:HTMLElement,owner:string)=>{if(node.matches(':popover-open'))node.hidePopover();node.removeAttribute('popover');node.classList.add('inspector-page');node.hidden=true;node.dataset.open='false';panels.set(node.id,{node,owner});el(owner+'Inspector').append(node);node.showPopover=()=>{if(node.dataset.open!=='true')open(node.id);};node.hidePopover=()=>{if(node.dataset.open==='true')close(owner);};node.togglePopover=()=>{open(node.id);return node.dataset.open==='true';};};
 for(const id of ['viewBubble','tuneBubble','observeBubble','jBubble','bridgeBubble'])register(el(id),'clock');
 for(const id of ['exploreOptions','planeNotes','viewHelp'])register(el(id),'riemann');
 if(product.matches(':popover-open'))product.hidePopover();product.removeAttribute('popover');product.dataset.open='false';product.classList.add('explorer-surface');el('riemannContent').append(product);
 product.querySelector<HTMLElement>('.bubble-head')!.hidden=true;
 // Replace the legacy global navigation, retaining state nodes required by the bridge.
 for(const selector of ['#clockApp>.clock-title','#clockApp>.north-west','#clockApp>.north-east','#clockApp>.south-east','#destinations'])app.querySelector(selector)?.remove();
 el('productView').remove();el('reset').remove();
 const sound=el<HTMLButtonElement>('sound');el('soundSlot').append(sound);sound.className='icon-button';sound.innerHTML=icon('sound');sound.setAttribute('aria-label','Enable sound');
 el('levelsButton').onclick=()=>open('soundPanel');el('appearanceButton').onclick=()=>open('viewBubble');el('riemannHelp').onclick=()=>el('explainView').click();
 el('viewBubble').querySelector('.bubble-head b')!.textContent='Clock appearance';el('spec').hidden=true;
 const custom=document.createElement('div');custom.innerHTML=`<label class="field">Spectrum<select id="spectrumChoice"><option value="0">Pitch · log₂ p</option><option value="2">Spectrum · 1/p</option><option value="1">Spectrum · 1/p²</option></select></label><div id="spectrumPreview" aria-label="Prime colour preview"></div>
 <label class="field">Pane light<select id="lightChoice"><option value="off">Off · bare sieve</option><option value="filter" selected>Filtering glass</option><option value="light">Accumulating light</option></select></label><label class="check"><input id="allPaneLabels" type="checkbox"> All pane labels</label><label class="check"><input id="jRadiusToggle" type="checkbox"> J radius · weighted prime count</label><button id="inspectJ">Inspect J</button>`;el('viewBubble').append(custom);
 const bind=(pairs:string[][])=>{for(const [id,key] of pairs)el<HTMLInputElement>(id).addEventListener('input',()=>{const field=el<HTMLInputElement>(id);actions.setting(key,field.type==='checkbox'?field.checked:field.value);});};
 bind([['spectrumChoice','spectrum'],['lightChoice','light'],['allPaneLabels','labels'],['jRadiusToggle','jRadius']]);
 el('inspectJ').onclick=()=>open('jBubble');
 const createPanel=(id:string,title:string,html:string)=>{const p=document.createElement('section');p.id=id;p.className='bubble';p.innerHTML=`<div class="bubble-head"><b>${title}</b><button class="inspector-close" aria-label="Close ${title}">×</button></div>${html}`;register(p,'clock');p.querySelector<HTMLButtonElement>('.inspector-close')!.onclick=()=>close('clock');return p;};
 const gear=createPanel('clockSettings','Clock controls',`<label class="field">Snap / step targets<select id="snapChoice"><option value="integer">On the beat</option><option value="free">Keep fractional position</option><option value="prime">Primes</option><option value="twin">Twin-prime centers</option></select></label><p class="small-note" id="snapHint">Snap winds to a destination. Jump goes there instantly.</p><div id="speedControl"></div><label class="field">Go to number<input id="clockDestination" type="number" min="1" max="5000" step="any" value="100"></label><div class="button-row"><button id="windTo">Wind to</button><button id="jumpTo">Jump</button></div><label class="field">Fine position<input id="fineClock" type="range" min="1" max="21" step="0.001" value="1"></label><p id="travelFeedback" class="small-note" role="status"></p>`);
 const speedLabel=document.createElement('label');speedLabel.className='field';speedLabel.innerHTML='Play speed · beats/s';speedLabel.append(el('speed'),el('liveSpeed'));el('speedControl').append(speedLabel);
 const gearButton=document.createElement('button');gearButton.id='clockGear';gearButton.className='icon-button';gearButton.innerHTML=icon('gear');gearButton.setAttribute('aria-label','Clock controls');gearButton.title='Clock controls';gearButton.onclick=()=>open(gear.id);el('transportCorner').querySelector('.transport')!.append(gearButton);
 const observe=document.createElement('button');observe.id='clockObserve';observe.className='text-button';observe.textContent='Observe';observe.onclick=()=>open('observeBubble');el('clockTransport').append(observe);
 el('snapChoice').onchange=()=>{const value=el<HTMLSelectElement>('snapChoice').value;actions.setting('snap',value);el('snapHint').textContent=value==='twin'?'Visit the center between twin primes; 4 is the exceptional first center.':value==='free'?'One step preserves the fractional position where you paused.':'Steps wind to the next or previous matching beat.';};
 const travel=(jump:boolean)=>{const input=el<HTMLInputElement>('clockDestination'),n=Number(input.value);if(!input.value||!Number.isFinite(n)||n<1||n>5000){el('travelFeedback').textContent='Enter a number from 1 to 5000.';return;}jump?actions.jump(n):actions.seek(n);el('travelFeedback').textContent=(jump?'Jumped to ':'Winding toward ')+n;};
 el('windTo').onclick=()=>travel(false);el('jumpTo').onclick=()=>travel(true);el('clockDestination').onkeydown=e=>{if(e.key==='Enter')travel(e.shiftKey);};
 el('fineClock').oninput=()=>actions.setting('fine',el<HTMLInputElement>('fineClock').value);
 const soundPanel=createPanel('soundPanel','Sound & light',`<div id="volumeControl"></div><label class="field">Primes<input id="primeVolume" type="range" min="0" max="100" step="1" value="100"></label><label class="field">Beat<input id="beatVolume" type="range" min="0" max="100" step="1" value="16"></label><label class="field">Beat pitch · Hz<input id="beatPitch" type="range" min="90" max="900" step="5" value="320"></label><label class="field">Prime pitch · Hz per number<input id="pitchMultiplier" type="range" min="1" max="20" step="0.1" value="20"><output id="pitchReadout">20n Hz</output></label><p class="small-note">At 1n Hz the earliest primes may be inaudible. Ratios stay proportional, and fast winding skips the backlog of notes.</p><label class="field">Pane brightness<input id="colourDepth" type="range" min="0.1" max="1.2" step="0.01" value="0.42"></label><label class="check"><input id="weightBrightness" type="checkbox"> Link pane brightness to σ</label><p class="small-note">Brightness is a display mapping. ξ does not control it.</p>`);
 const volume=document.createElement('label');volume.className='field';volume.textContent='Overall';volume.append(el('vol'));el('volumeControl').append(volume);
 el('pitchMultiplier').oninput=()=>{const value=el<HTMLInputElement>('pitchMultiplier').value;el('pitchReadout').textContent=value+'n Hz';actions.setting('pitch',value);};
 bind([['primeVolume','primeVolume'],['beatVolume','beatVolume'],['beatPitch','beatPitch'],['colourDepth','depth'],['weightBrightness','weightBrightness']]);void soundPanel;
 // A construction catalogue opens only when requested; the selected name remains visible.
 const chooser=document.createElement('details');chooser.id='constructionChooser';const summary=document.createElement('summary');summary.id='constructionSummary';summary.textContent='Sum & product';chooser.append(summary,el('paperViews'));product.prepend(chooser);
 for(const button of el('paperViews').querySelectorAll<HTMLButtonElement>('button')){const copy=document.createElement('small');copy.textContent=button.title;button.append(copy);button.addEventListener('click',()=>{chooser.open=false;summary.textContent=button.childNodes[0].textContent;});}
 const graphWrap=document.createElement('div');graphWrap.id='graphSurface';const graph=el('productGraph');graph.before(graphWrap);graphWrap.append(graph);
 const sigmaRow=el('sigmaDial').closest('.axis-control')!,tauRow=el('tauScrub').closest('.axis-control')!;sigmaRow.id='sigmaControl';tauRow.id='tauControl';graphWrap.append(sigmaRow,tauRow);
 el('paperViewTitle').hidden=true;el('paperEquation').hidden=true;el('planeHint').hidden=true;
 el('exploreDock').append(el('exploreToolbar'));el('exploreToolbar').querySelector('[popovertarget="planeNotes"]')?.remove();
 el('explainView').textContent='Inspect';
 el('fitLocus').textContent='Frame curve';el('exploreMore').textContent='Options';
 const reference=document.createElement('button');reference.id='openPlaneNotes';reference.textContent='Equations & reference';reference.onclick=()=>open('planeNotes');el('exploreOptions').append(reference);
 app.addEventListener('click',e=>{const target=(e.target as HTMLElement).closest<HTMLButtonElement>('[popovertarget]');if(!target)return;const id=target.getAttribute('popovertarget')!;if(!panels.has(id))return;e.preventDefault();if(target.getAttribute('popovertargetaction')==='hide')close(panels.get(id)!.owner);else open(id);},true);
 let layout='clock';let fraction=.5;
 const setLayout=(next:string)=>{layout=next;shell.dataset.layout=next;product.hidden=next==='clock';product.dataset.open=String(next!=='clock');el('riemannWorkspace').inert=next==='clock';el('clockWorkspace').inert=next==='explorer';for(const b of shell.querySelectorAll<HTMLElement>('[data-layout]'))b.setAttribute('aria-pressed',String(b.dataset.layout===next));el('workspaceDivider').setAttribute('aria-valuenow',next==='clock'?'100':next==='explorer'?'0':String(Math.round(fraction*100)));actions.setting('layout',next);actions.resize();};
 for(const b of shell.querySelectorAll<HTMLElement>('[data-layout]'))b.onclick=()=>setLayout(b.dataset.layout!);
 const divider=el('workspaceDivider');divider.onpointerdown=e=>{divider.setPointerCapture(e.pointerId);};divider.onpointermove=e=>{if(!divider.hasPointerCapture(e.pointerId))return;const box=shell.getBoundingClientRect();fraction=Math.max(.05,Math.min(.95,(e.clientX-box.left)/box.width));shell.style.setProperty('--split',fraction*100+'%');if(layout!=='both')setLayout('both');actions.resize();};divider.onpointerup=e=>{if(divider.hasPointerCapture(e.pointerId))divider.releasePointerCapture(e.pointerId);if(fraction<.18)setLayout('explorer');else if(fraction>.82)setLayout('clock');else setLayout('both');};divider.onkeydown=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const direction=e.key==='ArrowLeft'?-1:1;if(layout==='clock')setLayout('both');else if(layout==='explorer')setLayout('both');else{fraction=Math.max(.15,Math.min(.85,fraction+direction*.1));shell.style.setProperty('--split',fraction*100+'%');if(fraction<=.15)setLayout('explorer');else if(fraction>=.85)setLayout('clock');actions.resize();}}};
 const resize=new ResizeObserver(()=>actions.resize());resize.observe(el('clockSurface'));resize.observe(graphWrap);setLayout('clock');
 let lastMode='',lastTime=-1,lastSound:boolean|undefined;
 return {setLayout,update(){const state=actions.read();if(lastSound!==state.sound){lastSound=state.sound;sound.innerHTML=icon('sound');sound.classList.toggle('muted',!state.sound);sound.setAttribute('aria-pressed',String(state.sound));sound.setAttribute('aria-label',state.sound?'Mute sound':'Enable sound');sound.title=state.sound?'Mute sound':'Enable sound';}
 if(lastMode!==state.mode){lastMode=state.mode;summary.textContent=el('paperViews').querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.childNodes[0].textContent||state.mode;el<HTMLButtonElement>('paperTrace').disabled=state.mode==='euler';el('paperTrace').title=state.mode==='euler'?'Choose a construction to replay its path':'Replay this construction';}
 const fine=el<HTMLInputElement>('fineClock');if(document.activeElement!==fine&&Math.abs(state.time-lastTime)>.001){fine.min=String(Math.max(1,state.time-10));fine.max=String(Math.min(5000,state.time+10));fine.value=String(state.time);lastTime=state.time;}
 },open};
}
