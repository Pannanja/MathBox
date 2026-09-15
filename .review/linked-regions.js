// A prime-family selection connects exact divisibility, not approximate area.
let selectedPrime=0,pinnedPrime=0;
function primeHighlight(p){return 'hsl('+hueOf(p)+' 88% 51%)';}
function previewPrime(p){selectedPrime=isPrime(p)?p:pinnedPrime;}
function linkPrime(p){pinnedPrime=isPrime(p)?p:0;selectedPrime=pinnedPrime;if(selectedPrime){const i=eulerPath(t,SIGMA,TAUV).points.findIndex(q=>q.p===p);if(i>=0)selectedProduct=i;}}
const linkedReadout=document.createElement('div');linkedReadout.id='linkedReadout';linkedReadout.hidden=true;linkedReadout.setAttribute('role','status');stage.append(linkedReadout);
const clearLink=document.createElement('button');clearLink.id='clearLink';clearLink.textContent='Clear';clearLink.title='Clear the linked prime highlight';clearLink.onclick=()=>linkPrime(0);document.querySelector('.product-tools').append(clearLink);
$('productView').title='Select a product point or use the arrows to link its prime across the clock, tape and sum';
for(const id of ['productPrev','productNext']){const prior=$(id).onclick;$(id).onclick=()=>{prior();const q=eulerPath(t,SIGMA,TAUV).points[selectedProduct];linkPrime(q?q.p:0);};}
const priorPick=$('productGraph').onpointerdown;
$('productGraph').onpointerdown=e=>{const b=e.currentTarget.getBoundingClientRect(),x=(e.clientX-b.left)*600/b.width,y=(e.clientY-b.top)*300/b.height;
 if(!productHitPoints.some(p=>Math.hypot(p.x-x,p.y-y)<18))return;
 priorPick(e);const q=eulerPath(t,SIGMA,TAUV).points[selectedProduct];linkPrime(q?q.p:0);
};
$('pf').addEventListener('click',e=>{const el=e.target.closest('.fx');if(el)linkPrime(+el.dataset.p);});
$('pf').addEventListener('pointerover',e=>{const el=e.target.closest('.fx');if(el)previewPrime(+el.dataset.p);});
$('pf').addEventListener('pointerleave',()=>previewPrime(0));
$('productGraph').addEventListener('pointermove',e=>{const b=e.currentTarget.getBoundingClientRect(),x=(e.clientX-b.left)*600/b.width,y=(e.clientY-b.top)*300/b.height;let hit=null,best=18;for(const p of productHitPoints){const d=Math.hypot(p.x-x,p.y-y);if(d<best){hit=p;best=d;}}const q=hit?eulerPath(t,SIGMA,TAUV).points[hit.i]:null;previewPrime(q?q.p:0);});
$('productGraph').addEventListener('pointerleave',()=>previewPrime(0));
$('pf').addEventListener('keydown',e=>{if(!['Enter',' '].includes(e.key))return;const el=e.target.closest('.fx');if(el){e.preventDefault();e.stopPropagation();linkPrime(+el.dataset.p);}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')linkPrime(0);});
function linkedRings(){return selectedPrime?rings.filter(r=>(r.base||r.p)===selectedPrime):[];}
const unlinkedGlass=drawPrimeGlass;
drawPrimeGlass=function(rad,n){unlinkedGlass(rad,n);if(!selectedPrime)return;g2.save();g2.strokeStyle=primeHighlight(selectedPrime);g2.fillStyle=g2.strokeStyle;
 const primeRing=rings.find(r=>r.p===selectedPrime);if(primeRing){const radius=rad(primeRing.p),span=panelSpan(primeRing.p,t);g2.globalAlpha=.28;g2.beginPath();g2.moveTo(C,C);g2.arc(C,C,radius,span.c0+span.w/2,span.c0-span.w/2+2*Math.PI);g2.closePath();g2.fill();}
 g2.globalAlpha=.9;g2.shadowColor=g2.strokeStyle;g2.shadowBlur=7;
 for(const ring of linkedRings()){const r=rad(ring.p),sp=panelSpan(ring.p,t);if(r<=0||sp.w<=0)continue;g2.lineWidth=typeof logArmScene!=='undefined'&&paperMode==='log'&&ring.p===logArmScene.activeQ?11:7;g2.beginPath();g2.arc(C,C,r,sp.c0-sp.w/2,sp.c0+sp.w/2);g2.stroke();}
 g2.restore();
};
// Hit-test the actual arc band. Reflection's intermediate transform can become
// singular; defer picking during that brief transition instead of guessing.
function clockPrimeAt(e){const b=e.currentTarget.getBoundingClientRect(),dx=(e.clientX-b.left)*W/b.width-C,dy=(e.clientY-b.top)*W/b.height-C,c=Math.cos(Math.PI*reflectionMix);if(Math.abs(c)<.15)return 0;
 const a=(1+c)/2,v=-(1-c)/2,x=(a*dx-v*dy)/c,y=(a*dy-v*dx)/c,r=Math.hypot(x,y),angle=Math.atan2(y,x);let nearest=null,best=14;
 for(const ring of rings){const radius=clockRadius(ring.p),sp=panelSpan(ring.p,t),delta=Math.atan2(Math.sin(angle-sp.c0),Math.cos(angle-sp.c0)),distance=Math.abs(r-radius);if(sp.w>0&&Math.abs(delta)<=sp.w/2+.025&&distance<best){best=distance;nearest=ring;}}
 return nearest?(nearest.base||nearest.p):0;
}
$('cv').addEventListener('click',e=>{const p=clockPrimeAt(e);if(p)linkPrime(p);});
$('cv').addEventListener('pointermove',e=>previewPrime(clockPrimeAt(e)));
$('cv').addEventListener('pointerleave',()=>previewPrime(0));
const unlinkedGuide=updateGuide;
updateGuide=function(){unlinkedGuide();
 for(const el of $('strip').querySelectorAll('.tt'))el.classList.toggle('linked-term',!!selectedPrime&&+el.dataset.n%selectedPrime===0);
 for(const el of $('pf').querySelectorAll('.fx')){el.classList.toggle('linked-factor',+el.dataset.p===selectedPrime);el.style.setProperty('--highlight',primeHighlight(+el.dataset.p));el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label','Link prime '+el.dataset.p+' across clock and sum');el.setAttribute('aria-pressed',String(+el.dataset.p===pinnedPrime));}
 linkedReadout.hidden=!selectedPrime;clearLink.disabled=!selectedPrime;
 if(selectedPrime){const powers=linkedRings().map(r=>r.p).sort((a,b)=>a-b);const message='p = '+selectedPrime+' · panes '+(powers.join(', ')||'not born yet')+' · sum: multiples of '+selectedPrime+' · Esc clears';if(linkedReadout.textContent!==message)linkedReadout.textContent=message;}
};
