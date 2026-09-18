// psi(x) as a radial staircase, with the explicit formula's epicycles at its head.
//
// The plotted quantity is (psi(x) - smooth(x)) / sqrt(x), where smooth is
// x - log 2pi - half log(1 - 1/x^2). That is the one coordinate in which the
// staircase and the zeros are the same size: a riser is log p / sqrt(q), which
// runs 0.2 to 0.7 over the clock's range, and the leading zero's epicycle is
// 2/gamma_1 = 0.14. On the clock's own radius, where psi is of order x and its
// whole correction is of order sqrt(x), the entire zero chain would be a couple
// of pixels.
//
// Radius carries that residual, zero on the dashed circle. Angle carries x
// across most of a turn, so the head stops short of its own first step rather
// than landing on it. Each riser is drawn in the ink of the prime that caused
// it; between risers the tread still drifts, because the subtracted trend keeps
// moving while the count stands still.
//
// The chain at the head is -Sum over zeros of 2 Re(x^rho / rho), each term an
// epicycle, laid tip to tail with its real axis pointing outward along the head
// radius. Its reach along that radius is what the formula predicts; the
// staircase is what the machine counted. At a riser the formula aims at the
// middle of the step, so the two meet there and not on either tread.
const STAIR_TURN=.92,STAIR_IN=.10,STAIR_OUT=.70,STAIR_GAIN=.45,STAIR_STEPS=720;
// A value v sits at R*(IN + (OUT - IN)*v/count), the clock's own ruler held
// clear of both the middle and the rim. The trend smooth(x) on that ruler
// climbs out of the origin, so the stair reads as a climb and the arm writing
// it stands at the outside.
//
// stairScale lifts the departure from the trend, and only the departure. At 0
// nothing is lifted and the picture is true, which leaves the whole zero chain
// a few pixels wide, since psi is of order x and its correction only of order
// sqrt(x). At 1 the departure is carried as a fraction of the radius it sits
// on: .45 of it per unit of (psi - smooth)/sqrt(x). That keeps a riser and an
// epicycle the same size at any count, and it cannot reach the origin, because
// the residual never leaves the band it is divided into.
let stairScale=1,psiStairAim=0,psiStairMix=0,psiPredicted=0;
function stairRulerName(){return stairScale<.02?'departure true, on the clock radius':stairScale>.98?'departure lifted to .45 radius per (ψ − smooth)/√x':'departure lifted '+stairScale.toFixed(2);}
const psiEvents=[];
for(let p=2;p<=limit;p++){if(!isPrime(p))continue;for(let q=p;q<=limit;q*=p)psiEvents.push({q,p,rise:Math.log(p)});}
psiEvents.sort((a,b)=>a.q-b.q);
{let v=0;for(const e of psiEvents){e.lo=v;v+=e.rise;e.hi=v;}}
// The last prime power at or below x, by bisection on a table that never moves.
function psiIndex(x){let lo=0,hi=psiEvents.length;while(lo<hi){const mid=(lo+hi)>>1;if(psiEvents[mid].q<=x)lo=mid+1;else hi=mid;}return lo-1;}
function psiAt(x){const i=psiIndex(x);return i<0?0:psiEvents[i].hi;}
function psiResidual(v,x){return (v-smooth(x))/Math.sqrt(x);}
function drawPsiStair(){
 if(psiStairMix<.005||t<=2.5)return;
 g2.save();g2.globalAlpha=psiStairMix;
 const rOn=v=>R*(STAIR_IN+(STAIR_OUT-STAIR_IN)*Math.max(0,v)/t),rTrend=x=>rOn(smooth(x));
 const rAt=(x,v)=>{const base=rTrend(x);
  return stairScale*base*(1+STAIR_GAIN*psiResidual(v,x))+(1-stairScale)*rOn(v);};
 // The sweep runs the other way about the horizontal, so the climb reads
 // outward from noon rather than back into itself.
 const turn=x=>TOP-2*Math.PI*STAIR_TURN*(x-2)/Math.max(1e-9,t-2);
 const at=(x,v)=>{const a=turn(x),r=rAt(x,v);return [C+r*Math.cos(a),C+r*Math.sin(a)];};
 // The trend, and a band half a sqrt(x) either side of it. All three climb
 // with the stair, so the gap to the trend is read at a glance.
 const guides=[[-.5,'rgba(135,153,143,.10)',1,[]],[.5,'rgba(135,153,143,.10)',1,[]],[0,'rgba(135,153,143,.34)',1,[3,6]]];
 for(const [off,col,w,dash] of guides){
  g2.strokeStyle=col;g2.lineWidth=w;g2.setLineDash(dash);g2.beginPath();
  for(let k=0;k<=120;k++){const x=2+(t-2)*k/120,q=at(x,smooth(x)+off*Math.sqrt(x));
   if(k)g2.lineTo(q[0],q[1]);else g2.moveTo(q[0],q[1]);}
  g2.stroke();g2.setLineDash([]);
 }
 // One walk in x lays the treads and stops at each prime power for its riser,
 // so the sample count is fixed no matter how far the clock has run.
 const last=psiIndex(t),treads=new Path2D(),dx=(t-2)/STAIR_STEPS;
 let started=false,held=0;
 for(let k=0,i=0;k<=STAIR_STEPS;k++){
  const x=2+k*dx;
  while(i<=last&&psiEvents[i].q<=x){
   const e=psiEvents[i],foot=at(e.q,e.lo),head=at(e.q,e.hi);
   if(started)treads.lineTo(foot[0],foot[1]);
   g2.strokeStyle=primeInk(e.p);g2.lineWidth=2;
   g2.beginPath();g2.moveTo(foot[0],foot[1]);g2.lineTo(head[0],head[1]);g2.stroke();
   treads.moveTo(head[0],head[1]);started=true;held=e.hi;i++;
  }
  if(started){const q=at(x,held);treads.lineTo(q[0],q[1]);}
 }
 g2.strokeStyle='rgba(224,189,118,.78)';g2.lineWidth=1.7;g2.stroke(treads);
 const th=turn(t),ux=Math.cos(th),uy=Math.sin(th),trend=smooth(t);
 const G=rAt(t,trend+Math.sqrt(t))-rAt(t,trend);
 const tick=(v,col,w,len)=>{const r=rAt(t,v);g2.strokeStyle=col;g2.lineWidth=w;g2.beginPath();
  g2.moveTo(C+r*ux-uy*len/2,C+r*uy+ux*len/2);g2.lineTo(C+r*ux+uy*len/2,C+r*uy-ux*len/2);g2.stroke();};
 const foot=at(t,trend),count=Math.min(Math.ceil(zeroCount),PSI.nz);
 let cx=foot[0],cy=foot[1],total=0;
 const chain=new Path2D();chain.moveTo(cx,cy);
 for(let i=0;i<count;i++){
  const fade=Math.min(1,zeroCount-i),v=PSI.vec(t,i),dr=G*v[0]*fade,dp=G*v[1]*fade;
  cx+=ux*dr-uy*dp;cy+=uy*dr+ux*dp;chain.lineTo(cx,cy);total+=v[0]*fade;
 }
 psiPredicted=trend+Math.sqrt(t)*total;
 g2.strokeStyle='rgba(111,174,155,.72)';g2.lineWidth=1.2;g2.stroke(chain);
 // The leading zero alone, which sets the longest wave in the staircase.
 if(count){const v=PSI.vec(t,0);
  g2.strokeStyle='rgba(201,165,92,.85)';g2.lineWidth=2.2;g2.beginPath();g2.moveTo(foot[0],foot[1]);
  g2.lineTo(foot[0]+ux*G*v[0]-uy*G*v[1],foot[1]+uy*G*v[0]+ux*G*v[1]);g2.stroke();}
 g2.fillStyle='rgba(135,153,143,.8)';g2.beginPath();g2.arc(foot[0],foot[1],3,0,7);g2.fill();
 g2.fillStyle='rgba(111,174,155,.95)';g2.beginPath();g2.arc(cx,cy,3.5,0,7);g2.fill();
 // Where the chain lands, carried back onto the radius: the formula's answer.
 g2.strokeStyle='rgba(111,174,155,.45)';g2.lineWidth=1;g2.setLineDash([4,5]);
 g2.beginPath();g2.moveTo(cx,cy);g2.lineTo(C+rAt(t,psiPredicted)*ux,C+rAt(t,psiPredicted)*uy);g2.stroke();g2.setLineDash([]);
 tick(psiPredicted,'rgba(111,174,155,.95)',1.8,17);
 tick(psiAt(t),'rgba(201,165,92,.95)',2.6,23);
 g2.restore();
}
$('layerButtons').insertAdjacentHTML('beforeend','<button id="psiStair" aria-pressed="false" title="Count the prime powers as a radial staircase, with the explicit formula&#39;s epicycles at its head.">\u03c8 staircase</button>');
$('psiStair').onclick=()=>{psiStairAim=psiStairAim?0:1;$('psiStair').className=psiStairAim?'on':'';$('psiStair').setAttribute('aria-pressed',psiStairAim?'true':'false');};
const psiStairGuide=updateGuide;
updateGuide=function(){psiStairGuide();
 if(psiStairMix>.01)$('reading').textContent='\u03c8('+t.toFixed(2)+') = '+psiAt(t).toFixed(3)+' counted \u00b7 '+psiPredicted.toFixed(3)+' from '+Math.round(zeroCount)+' zeros \u00b7 '+stairRulerName()+' \u00b7 '+zeroSearchNote;
};
