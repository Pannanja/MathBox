// Readable ink follows the multiplicative glass recipe at a fixed display
// depth. Repeated primes participate; ink brightness is not |n^-s|.
const factorColourCache=new Map();
function factorColour(n){
 if(n===1)return '#ede8d9';if(factorColourCache.has(n))return factorColourCache.get(n);
 let T=[1,1,1];
 for(const p of factorize(n)){const c=hueRGB(hueOf(p)),w=c.map(v=>1-v),sum=w.reduce((a,b)=>a+b,0)||1;T=T.map((v,i)=>v*Math.exp(-3*.42*Math.log(p)*w[i]/sum));}
 const ink='rgb('+T.map(v=>Math.round(90+165*Math.pow(v,1/2.2))).join(',')+')';factorColourCache.set(n,ink);return ink;
}
const PR=(()=>{
 const strip=$('strip'),pf=$('pf'),tape=$('tape'),slot=76;
 const terms=new Map(),factors=new Map(),primes=Array.from({length:5000},(_,i)=>i+2).filter(isPrime);
 const dots=document.createElement('span');dots.className='product-dots';dots.textContent='…';pf.appendChild(dots);
 let lastTime=0,lastN=1;
 function render(tt){
  const now=performance.now(),dt=lastTime?Math.min(.05,(now-lastTime)/1000):0;lastTime=now;
  const ease=1-Math.exp(-dt*16),n=Math.floor(tt),width=parseFloat(getComputedStyle(tape).width),visible=Math.ceil(width/slot)+2;
  const born=primes.filter(p=>p<=n),active=[...new Set(factorize(n))];
  // Reserve places for every absorbing prime, then use spare room for recent
  // factors. The remainder stays accumulated in the ellipsis.
  const available=Math.max(48,pf.parentElement.parentElement.clientWidth-44);
  const upright=typeof reflectionMix!=='undefined'&&reflectionMix>.5;
  const capacity=Math.max(active.length,Math.min(5,Math.floor(available/(upright?32:68))));
  const shown=active.slice();
  for(let i=born.length-1;i>=0&&shown.length<capacity;i--)if(!shown.includes(born[i]))shown.push(born[i]);
  shown.sort((a,b)=>b-a);
  for(let k=Math.max(1,n-1);k<=n+visible;k++)if(!terms.has(k)){
   const el=document.createElement('span');el.className='tt';el.dataset.n=k;el.dataset.factorization=factorize(k).join('×');el.style.width=slot+'px';el.style.left=(-k*slot)+'px';el.title=k+' = '+(factorize(k).join(' × ')||'1');el.innerHTML='<span class="term-ink">'+(k===1?'1':'+ 1/'+k+'<sup>s</sup>')+'</span>';strip.appendChild(el);terms.set(k,el);
  }
  for(const [k,el] of terms){
   if(k<n-1||k>n+visible){el.remove();terms.delete(k);continue;}
   el.classList.toggle('dead',born.some(p=>p<k&&k%p===0));el.style.color=factorColour(k);el.style.opacity=Math.max(0,Math.min(1,1-(tt-k))).toFixed(4);
  }
  strip.style.transform='translateX('+(tt*slot+width-slot/2).toFixed(4)+'px)';
  const hidden=born.length-shown.length,space=available-(hidden?20:0);
  const columns=shown.length>3&&space<225&&!upright?Math.ceil(shown.length/2):Math.max(1,shown.length),cell=Math.min(upright?32:76,space/columns);
  const total=(shown.length?columns*cell:0)+(hidden?20:0);$('factorWindow').style.width=total+'px';
  dots.style.left=Math.max(0,total-20)+'px';dots.style.opacity=hidden?'1':'0';dots.dataset.hiddenCount=hidden;dots.title=hidden+' accumulated prime factors are folded here';
  for(const p of shown)if(!factors.has(p)){
   const el=document.createElement('span');el.className='fx';el.dataset.p=p;el.innerHTML='<span class="factor-ink">(1−'+p+'<sup>−s</sup>)</span>';el.style.color=factorColour(p);pf.appendChild(el);factors.set(p,{el,x:p>lastN?0:total-20,y:0,alpha:0});
  }
  const phase=tt-n,pulse=.3+.7*Math.pow(1-phase,2);
  for(const [p,f] of factors){
   const index=shown.indexOf(p),wanted=index>=0,birth=Math.max(0,Math.min(1,tt-p));
   const x=wanted?(index%columns)*cell:total-20,rows=Math.ceil(shown.length/columns),y=wanted?(Math.floor(index/columns)-(rows-1)/2)*25:0;
   f.x+=(x-f.x)*ease;f.y+=(y-f.y)*ease;f.alpha+=((wanted?1:0)-f.alpha)*ease;
   const natural=f.el.firstChild.offsetWidth||65,fontScale=upright?1:Math.min(1,Math.max(.72,(cell-3)/natural));
   f.el.style.left=f.x+'px';f.el.style.top=f.y+'px';f.el.style.width=cell+'px';f.el.style.opacity=(f.alpha*birth).toFixed(4);f.el.style.setProperty('--ink-scale',fontScale);
   const absorbs=active.includes(p);f.el.classList.toggle('factor-hit',absorbs);f.el.dataset.absorbing=String(absorbs);f.el.style.textShadow=absorbs?'0 0 '+(6+8*pulse)+'px currentColor, 0 0 2px currentColor':'none';
   if(!wanted&&f.alpha<.002){f.el.remove();factors.delete(p);}
  }
  $('equals').style.color=factorColour(n);$('equals').style.textShadow='0 0 '+(9*pulse)+'px '+factorColour(n);
  $('tapeDomain').textContent=SIGMA>1?'Euler’s sieve · infinite sum/product: Re(s) > 1':'Finite terms · the ordinary infinite sum/product does not converge here';lastN=n;
 }
 function reset(){for(const el of terms.values())el.remove();terms.clear();for(const f of factors.values())f.el.remove();factors.clear();lastN=1;}
 return {update:render,reset,tick:()=>{},recolor:()=>{factorColourCache.clear();render(t);}};
})();
