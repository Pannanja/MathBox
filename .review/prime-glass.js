// Adapted from the prime-power glass in orrery-story.html. Every q=p^k
// carries one full pane of p, not a fainter copy of q. RGB encodes hue;
// the scalar weight is computed separately (RGB average is not n^-sigma).
// The light recipe lives here, ahead of everything that paints with it, so the
// tape, the sum's links and the beam read the same settings rather than each
// keeping a private copy. The workspace assigns these; it does not redeclare.
let displayDepth=.42,weightBrightness=false,lightMode='filter';
// One prime, one colour. Panes, product factors and product vectors share it.
function primeInk(p){return 'hsl('+hueOf(p)+' 68% 68%)';}
// The light a number's panes let through, composed exactly as the beam does.
function stackedTransmission(n){
 let T=lightMode==='light'?[.12,.12,.12]:[1,1,1];
 for(const p of factorize(n)){const pane=paneTransmission(p);T=T.map((v,i)=>lightMode==='light'?1-(1-v)*(1-pane[i]):v*pane[i]);}
 return T;
}
// Changes shape whenever the recipe does, so cached ink can be dropped.
function inkRecipe(){return lightMode+'/'+(weightBrightness?SIGMA.toFixed(3):displayDepth);}
function paneTransmission(p){
 const c=hueRGB(hueOf(p)),a=c.map(v=>1-v),total=a.reduce((s,v)=>s+v,0)||1;
 return a.map(v=>Math.exp(-3*SIGMA*Math.log(p)*v/total));
}
function transmissionColour(T){return 'rgb('+T.map(v=>Math.round(255*Math.pow(Math.max(0,Math.min(1,v)),1/2.2))).join(',')+')';}
function paneColour(p){return transmissionColour(paneTransmission(p));}
function crossedPanes(n){return rings.filter(r=>n%r.p===0).sort((a,b)=>a.p-b.p);}
function paneWeight(n){return crossedPanes(n).reduce((w,r)=>w*Math.pow(r.base||r.p,-SIGMA),1);}
function drawPrimeGlass(rad,n){
 if(glassMix<.001)return;
 const alpha=glassMix*(1-focusMix),cross=crossedPanes(n);let trans=lightMode==='light'?[.12,.12,.12]:[1,1,1],last=0;
 g2.save();
 const segment=(a,b)=>{b=Math.min(b,R*beamReveal());if(b-a<.1)return;g2.globalAlpha=alpha;g2.lineCap='round';g2.strokeStyle=transmissionColour(trans);g2.shadowColor=g2.strokeStyle;g2.shadowBlur=10;g2.lineWidth=2.4;g2.beginPath();g2.moveTo(C,C-a);g2.lineTo(C,C-b);g2.stroke();g2.shadowBlur=0;};
 for(const r of cross){const radius=rad(r.p);segment(last,radius);last=radius;const pane=paneTransmission(r.base||r.p);trans=trans.map((v,i)=>lightMode==='light'?1-(1-v)*(1-pane[i]):v*pane[i]);}
 segment(last,R);
 for(const r of cross){const y=C-rad(r.p);g2.globalAlpha=alpha;g2.strokeStyle=primeInk(r.base||r.p);g2.lineWidth=1.5;g2.beginPath();g2.moveTo(C-6,y);g2.lineTo(C+6,y);g2.stroke();g2.fillStyle=g2.strokeStyle;drawPaneLabel(r.p,rad(r.p),TOP);}
 g2.restore();
}
