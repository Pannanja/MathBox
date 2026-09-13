// J is right-continuous here: the complete credit is booked at a birth.
// Arc printing still takes one beat. Riemann's inversion instead assigns
// midpoint values exactly at jumps; the notes distinguish that convention.
const jDenominator=27720;
const jBirths=[];let jUnits=0;
for(let q=2;q<=limit;q++){
 const fs=factorize(q);if(fs.every(p=>p===fs[0])){
  const k=fs.length,units=jDenominator/k;jUnits+=units;
  jBirths.push({q,p:fs[0],k,units,total:jUnits});
 }
}
function jThrough(x){let lo=0,hi=jBirths.length;while(lo<hi){const mid=(lo+hi)>>1;if(jBirths[mid].q<=x)lo=mid+1;else hi=mid;}return lo;}
function jValue(x){const end=jThrough(x);return end?jBirths[end-1].total/jDenominator:0;}
function jFraction(units){
 const whole=Math.floor(units/jDenominator),rem=Math.round(units-whole*jDenominator);
 if(!rem)return String(whole);
 const gcd=(a,b)=>b?gcd(b,a%b):a,d=gcd(rem,jDenominator),a=rem/d,b=jDenominator/d;
 const small={'1/2':'½','1/3':'⅓','2/3':'⅔','1/4':'¼','3/4':'¾','1/6':'⅙','5/6':'⅚'};
 return (whole?whole+' ':'')+(small[a+'/'+b]||a+'/'+b);
}
const jButton=document.createElement('button');jButton.textContent='J ledger';jButton.setAttribute('popovertarget','jBubble');document.querySelector('.north-west').appendChild(jButton);
const jBubble=document.createElement('section');jBubble.id='jBubble';jBubble.className='bubble j-bubble';jBubble.setAttribute('popover','manual');jBubble.setAttribute('aria-label','Riemann weighted prime-power ledger');
jBubble.innerHTML=`<div class="bubble-head"><b>J · a ledger of births</b><button popovertarget="jBubble" popovertargetaction="hide" aria-label="Close J ledger">×</button></div>
 <p id="jIntro" class="muted">Prime: <b>1</b> credit. Prime square: <b>½</b>. Prime cube: <b>⅓</b>. Only new arcs contribute.</p>
 <div id="jReceipts" aria-label="Contributions from recent births"></div>
 <div class="j-total"><span id="jAt">At beat 1</span><output id="jTotal">0</output></div>
 <p id="jEvent">No prime-power births yet.</p>
 <p id="jEarlier" class="muted">Bar height shows the contribution; a full bar is 1.</p>
 <div class="button-row"><button data-j-beat="3">Watch 4 next</button><button data-j-beat="7">Watch 8 next</button><button data-j-beat="9">Total at 10</button></div>`;
stage.appendChild(jBubble);
for(const b of jBubble.querySelectorAll('[data-j-beat]'))b.onclick=()=>moveClock(+b.dataset.jBeat);
const jCards=new Map();let jStamp=-1;
function updateJLedger(){
 const n=Math.floor(t),end=jThrough(n),shown=jBirths.slice(Math.max(0,end-7),end),current=shown.find(e=>e.q===n);
 if(n!==jStamp){
  jStamp=n;
  for(const [q,node] of jCards)if(!shown.some(e=>e.q===q)){node.remove();jCards.delete(q);}
  for(const e of shown){
   if(!jCards.has(e.q)){const node=document.createElement('div');node.className='j-receipt';node.dataset.q=e.q;node.style.color=factorColour(e.p);node.innerHTML='<span class="j-credit">'+jFraction(e.units)+'</span><span class="j-bar-slot"><i style="height:'+(100/e.k)+'%"></i></span><span>'+e.q+'</span>';node.setAttribute('aria-label','Birth '+e.q+' contributes '+(e.k===1?'1':'1/'+e.k));jCards.set(e.q,node);}
   $('jReceipts').appendChild(jCards.get(e.q));
  }
  $('jAt').textContent='J at beat '+n;$('jTotal').textContent=jFraction(end?jBirths[end-1].total:0);
  $('jEvent').textContent=n===1?'Start with an empty ledger. Use forward one.':current?(current.k===1?n+' is prime: one whole credit.':n+' is a prime '+(current.k===2?'square':current.k===3?'cube':'power')+': '+jFraction(current.units)+' of a credit.') :n+' has no new prime-power arc. The total stays still.';
  const earlier=end>7?jBirths[end-8].total:0;
  $('jIntro').textContent=earlier?'Earlier births: '+jFraction(earlier)+'. New credits: 1 for a prime, ½ for a square, ⅓ for a cube.':'Prime: 1 credit. Prime square: ½. Prime cube: ⅓. Only new arcs contribute.';
  $('jEarlier').textContent=earlier?'Earlier births: '+jFraction(earlier)+'. A full bar is 1.':'Bar height shows the contribution; a full bar is 1.';
 }
 for(const [q,node] of jCards){node.classList.toggle('j-current',q===n);node.style.setProperty('--pulse',String(q===n?1-(t-n):0));}
 if(!jBubble.matches(':popover-open')||!current)return;
 // Point out the actual newborn arc, in the clock's current radius law and
 // orientation. This halo is phase-driven, so stepping back retraces it.
 const rad=clockRadius(current.q),sp=panelSpan(current.q,t),a=sp.c0-sp.w/2;
 const u=(1-Math.cos(Math.PI*reflectionMix))/2,x=C+rad*Math.cos(a),y=C+rad*Math.sin(a);
 const X=C+(1-u)*(x-C)-u*(y-C),Y=C-u*(x-C)+(1-u)*(y-C);
 g2.save();g2.setTransform(1,0,0,1,0,0);g2.globalAlpha=.4+.6*(1-(t-n));g2.strokeStyle=factorColour(current.p);g2.lineWidth=4;g2.beginPath();g2.arc(X,Y,17,0,2*Math.PI);g2.stroke();g2.restore();
}
const guideBeforeJ=updateGuide;updateGuide=function(){guideBeforeJ();updateJLedger();};
updateJLedger();
