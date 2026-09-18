// Readable ink follows the multiplicative glass recipe at a fixed display
// depth. Repeated primes participate; ink brightness is not |n^-s|.
const factorColourCache=new Map();let factorColourRecipe='';
// A number wears the light its panes let through, on the live recipe rather
// than a frozen copy of it, so the tape follows the light panel. A prime wears
// its own colour instead: see primeInk, which is what its pane is painted in.
function factorColour(n){
 const recipe=inkRecipe();
 if(recipe!==factorColourRecipe){factorColourRecipe=recipe;factorColourCache.clear();}
 if(n===1)return '#ede8d9';if(factorColourCache.has(n))return factorColourCache.get(n);
 const T=stackedTransmission(n);
 const ink='rgb('+T.map(v=>Math.round(90+165*Math.pow(Math.max(0,Math.min(1,v)),1/2.2))).join(',')+')';
 factorColourCache.set(n,ink);return ink;
}
const PR=(()=>{
 const strip=$('strip'),pf=$('pf'),tape=$('tape'),slot=76;
 const terms=new Map(),factors=new Map(),primes=Array.from({length:5000},(_,i)=>i+2).filter(isPrime);
 const dots=document.createElement('span');dots.className='product-dots';dots.textContent='…';pf.appendChild(dots);
 // Primes keep a recency queue so the small anchors stop being swapped out
 // every beat; slots run from the equals sign outward, small p first.
 let lastTime=0,lastN=1,touched=[];
 function render(tt){
  const now=performance.now(),dt=lastTime?Math.min(.05,(now-lastTime)/1000):0;lastTime=now;
  const ease=1-Math.exp(-dt*16),n=Math.floor(tt),width=parseFloat(getComputedStyle(tape).width),visible=Math.ceil(width/slot)+2;
  const born=primes.filter(p=>p<=n),active=[...new Set(factorize(n))];
  const linked=typeof selectedPrime!=='undefined'&&selectedPrime<=n?selectedPrime:0;
  // Reserve places for every absorbing prime, then use spare room for recent
  // factors. The remainder stays accumulated in the ellipsis.
  const available=Math.max(48,pf.parentElement.parentElement.clientWidth-44);
  const upright=typeof reflectionMix!=='undefined'&&reflectionMix>.5;
  if(n!==lastN)for(const p of active){const at=touched.indexOf(p);if(at>=0)touched.splice(at,1);touched.unshift(p);}
  const room=Math.max(3,Math.min(9,Math.floor(available/(upright?32:68))));
  const ascending=(a,b)=>a-b;
  const anchors=touched.filter(p=>p<=n).slice(0,3).sort(ascending);
  const present=active.filter(p=>!anchors.includes(p)).sort(ascending);
  const newest=[];for(let i=born.length-1;i>=0&&newest.length<2;i--){const p=born[i];if(!anchors.includes(p)&&!present.includes(p))newest.push(p);}
  newest.sort(ascending);
  if(linked&&![...anchors,...present,...newest].includes(linked))present.push(linked),present.sort(ascending);
  // Nearest the equals sign: the stable anchors, then what is dividing n now,
  // then the ellipsis for everything folded away, then the frontier.
  const order=[...anchors,...present];
  const hiddenCount=born.length-order.length-newest.length;
  const gapAt=hiddenCount>0?order.length:-1;if(gapAt>=0)order.push(null);
  order.push(...newest);
  while(order.length>room){const drop=order.findIndex(v=>v!==null&&newest.indexOf(v)<0&&active.indexOf(v)<0);if(drop<0)break;order.splice(drop,1);}
  const shown=order.filter(v=>v!==null);
  for(let k=Math.max(1,n-1);k<=n+visible;k++)if(!terms.has(k)){
   const el=document.createElement('span');el.className='tt';el.dataset.n=k;el.dataset.factorization=factorize(k).join('×');el.style.width=slot+'px';el.style.left=(-k*slot)+'px';el.title=k+' = '+(factorize(k).join(' × ')||'1');el.innerHTML='<span class="term-ink">'+(k===1?'1':'+ 1/'+k+'<sup>s</sup>')+'</span>';strip.appendChild(el);terms.set(k,el);
  }
  for(const [k,el] of terms){
   if(k<n-1||k>n+visible){el.remove();terms.delete(k);continue;}
   el.classList.toggle('dead',born.some(p=>p<k&&k%p===0));el.style.color=factorColour(k);el.style.opacity=Math.max(0,Math.min(1,1-(tt-k))).toFixed(4);
  }
  // Terms leave through the sum operator, so the strip stops short of it by the
  // operator's width plus the slot the fade needs. A term is opaque a slot and
  // a half clear of the sigma and has faded out by the time it reaches it,
  // rather than sliding across it at full strength.
  const sumGlyph=$('sumOp'),opRoom=(sumGlyph?sumGlyph.offsetWidth:0)+slot+24;
  strip.style.transform='translateX('+(tt*slot+width-opRoom-slot/2).toFixed(4)+'px)';
  const hidden=Math.max(0,born.length-shown.length),slots=Math.max(1,order.length);
  const cell=Math.min(upright?32:76,available/slots),total=slots*cell;
  $('factorWindow').style.width=total+'px';
  const gapIndex=order.indexOf(null);
  dots.style.left=(gapIndex<0?total:gapIndex*cell)+'px';dots.style.width=cell+'px';
  dots.style.opacity=gapIndex<0?'0':'1';dots.dataset.hiddenCount=hidden;dots.title=hidden+' accumulated prime factors are folded here';
  for(const p of shown)if(!factors.has(p)){
   const el=document.createElement('span');el.className='fx';el.dataset.p=p;el.innerHTML='<span class="factor-ink">(1−1/'+p+'<sup>s</sup>)</span>';el.style.color=primeInk(p);pf.appendChild(el);
   // A new prime rises into place from the slot beneath it, never from the far end.
   factors.set(p,{el,x:Math.max(0,(order.indexOf(p)-1)*cell),y:0,alpha:0});
  }
  const phase=tt-n,pulse=.3+.7*Math.pow(1-phase,2);
  for(const [p,f] of factors){
   const index=order.indexOf(p),wanted=index>=0,birth=Math.max(0,Math.min(1,tt-p));
   const x=wanted?index*cell:Math.max(0,(gapIndex<0?total:gapIndex*cell)),y=0;
   f.x+=(x-f.x)*ease;f.y+=(y-f.y)*ease;f.alpha+=((wanted?1:0)-f.alpha)*ease;
   const natural=f.el.firstChild.offsetWidth||65,fontScale=upright?1:Math.min(1,Math.max(.72,(cell-3)/natural));
   f.el.style.left=f.x+'px';f.el.style.top=f.y+'px';f.el.style.width=cell+'px';f.el.style.opacity=(f.alpha*birth).toFixed(4);f.el.style.setProperty('--ink-scale',fontScale);
   const absorbs=active.includes(p);f.el.classList.toggle('factor-hit',absorbs);f.el.dataset.absorbing=String(absorbs);f.el.style.textShadow=absorbs?'0 0 '+(6+8*pulse)+'px currentColor, 0 0 2px currentColor':'none';
   if(!wanted&&f.alpha<.002){f.el.remove();factors.delete(p);}
  }
  $('equals').style.color=factorColour(n);$('equals').style.textShadow='0 0 '+(9*pulse)+'px '+factorColour(n);
  lastN=n;
 }
 function reset(){for(const el of terms.values())el.remove();terms.clear();for(const f of factors.values())f.el.remove();factors.clear();lastN=1;}
 return {update:render,reset,tick:()=>{},recolor:()=>{factorColourCache.clear();render(t);}};
})();
