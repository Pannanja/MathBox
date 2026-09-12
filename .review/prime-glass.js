// Adapted from the prime-power glass in orrery-story.html. Every q=p^k
// carries one full pane of p, not a fainter copy of q. RGB encodes hue;
// the scalar weight is computed separately (RGB average is not n^-sigma).
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
 const alpha=glassMix*(1-focusMix),cross=crossedPanes(n);let trans=[1,1,1],last=0;
 g2.save();
 const segment=(a,b)=>{if(b-a<.1)return;g2.globalAlpha=alpha;g2.strokeStyle='#0c1512';g2.lineWidth=15;g2.beginPath();g2.moveTo(C,C-a);g2.lineTo(C,C-b);g2.stroke();g2.strokeStyle=transmissionColour(trans);g2.lineWidth=9;g2.stroke();};
 for(const r of cross){const radius=rad(r.p);segment(last,radius);last=radius;const pane=paneTransmission(r.base||r.p);trans=trans.map((v,i)=>v*pane[i]);}
 segment(last,R);
 for(const r of cross){const y=C-rad(r.p);g2.globalAlpha=alpha;g2.strokeStyle='hsl('+hueOf(r.base||r.p)+' 70% 70%)';g2.lineWidth=3;g2.beginPath();g2.moveTo(C-12,y);g2.lineTo(C+12,y);g2.stroke();g2.fillStyle=g2.strokeStyle;g2.font='22px ui-monospace,monospace';g2.textAlign='right';g2.fillText(String(r.p),C-22,y+7);}
 g2.restore();
}
