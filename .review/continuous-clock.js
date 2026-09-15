// All changes of counting time pass through this clock. A tutorial can request
// a destination, but cannot replace t or rebuild a scene at that destination.
let clockTween = null;
function moveClock(value, after = null) {
 const to = Math.max(1, Math.min(limit, Number(value)));
 if (!Number.isFinite(to)) return;
 stopAt = null; window.__run = false; clearVoices();
 clockTween = {from:t, to, elapsed:0, duration:Math.max(1, Math.abs(to-t)/2), after};
 $('play').textContent = 'Pause';
}
function advanceClock(next, ms) {
 const old = t, n = Math.floor(next);
 if (next >= old) {
  for (let k = lastInt + 1; k <= n; k++) {
   const f = factorize(k), p = f[0], isP = f.length === 1;
   const isPower = f.length > 0 && f.every(q => q === p);
   if (isPower) {
    rings.push(isP ? {p:k, lap:1, hit:ms, du:-Math.log(1-1/k)} : {p:k, base:p, lap:1, hit:ms, echo:true});
    psiSum += Math.log(p);
   }
   if (isP) {
    piCount++; primeMs = ms;
    bearings.forEach(b => {if(b.pinned){b.pinned=false;b.b=k;}});
    bearings.push({a:k,b:0,ang:TOP,sp:0,pinned:true});
   }
   cand = {n:k,born:ms,prime:isP};
   if (soundOn && next-old<=1.05) {tick(); if(isP){strike(k,3.2,.26/Math.pow(k,.28));remember(k);}}
  }
 } else {
  // A panel has already shrunk to zero before its birth is crossed in reverse.
  // Retain every surviving ring object, so its visual identity is uninterrupted.
  for (const ring of rings) if(ring.p > n) {psiSum-=Math.log(ring.base||ring.p);if(!ring.echo)piCount--;}
  rings = rings.filter(r => r.p <= n);
  bearings = bearings.filter(b => b.a <= n);
  bearings.forEach((b,i)=>{b.pinned=i===bearings.length-1;b.b=b.pinned?0:bearings[i+1].a;});
  cand=null;primeMs=-9999;
 }
 for (const ring of rings) {
  const lap=Math.floor(next/ring.p);
  if(next>old && lap>ring.lap){ring.hit=ms;if(soundOn&&next-old<=1.05)strike(ring.base||ring.p,3.2,.26/Math.pow(ring.p,.28));}
  ring.lap=lap;
 }
 t=next;lastInt=n;unitLap=n;
 $('now').textContent=n;
 $('fac').textContent=n===1?'':isPrime(n)?'prime · a new rhythm':factorize(n).join(' × ');
 $('fac').className=isPrime(n)?'prime':'';
}
function updateClock(dt, ms) {
 if(clockTween){
  const trip=clockTween;trip.elapsed=Math.min(trip.duration,trip.elapsed+dt);
  const u=trip.elapsed/trip.duration, blend=u*u*(3-2*u);
  advanceClock(trip.from+(trip.to-trip.from)*blend,ms);
  if(u===1){clockTween=null;$('play').textContent='Play';if(trip.after)trip.after();}
 }else if(window.__run){
  const destination=stopAt===null?limit:Math.min(limit,stopAt);
  advanceClock(Math.min(destination,t+dt*+$('speed').value),ms);
  if(t>=destination){stopAt=null;window.__run=false;$('play').textContent='Play';}
 }
}
