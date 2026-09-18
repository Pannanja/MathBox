// The zero heights are found, not tabulated. On the critical line
// Z(t) = e^{iθ(t)}·ζ(½+it) is real, so its sign changes bracket the zeros
// exactly, and bisection against the same Euler–Maclaurin evaluator the ζ curve
// uses places each one to about 1e-14. θ only needs to be right to well under a
// radian: at a true zero both parts of ζ vanish, so no rotation can move it.
// The search runs to the height that evaluator is trusted to, τ = 1000, which
// holds 649 zeros. The tabulated thirty stay as the seed so the ledger has
// something to draw while the search runs.
const ZERO_LIMIT=1000;
let zeroHeights=heights.slice(),zeroAuto=true,zeroSearchNote='searching to τ = '+ZERO_LIMIT+'…';
function zeroSearchJob(){
 function theta(t){const h=t/2,w=1/t;return h*Math.log(h/Math.PI)-h-Math.PI/8+w/48+7*w**3/5760+31*w**5/80640+127*w**7/430080;}
 function Z(t){const z=locusZeta(.5,t),a=theta(t);return Math.cos(a)*z[0]-Math.sin(a)*z[1];}
 self.onmessage=e=>{
  // The first zero is at 14.13, so the scan opens at 10. The step is well under
  // the closest spacing in this range, which is 0.31.
  const {limit,step}=e.data,began=performance.now(),found=[],base=10;
  let sent=0,flushed=began,prev=Z(base);
  const flush=(progress,done)=>{const chunk=new Float64Array(found.slice(sent));sent=found.length;flushed=performance.now();
   self.postMessage({chunk,progress,done,expected:theta(limit)/Math.PI+1,ms:flushed-began},[chunk.buffer]);};
  for(let i=1;;i++){
   const t=base+i*step;if(t>limit)break;
   const z=Z(t);
   if((prev<0)!==(z<0)){
    let lo=t-step,hi=t,flo=prev;
    for(let k=0;k<70;k++){const mid=(lo+hi)/2;if(mid<=lo||mid>=hi)break;const fm=Z(mid);if((flo<0)!==(fm<0))hi=mid;else{lo=mid;flo=fm;}}
    found.push((lo+hi)/2);
   }
   prev=z;
   if(found.length>sent&&performance.now()-flushed>=120)flush(t/limit,false);
  }
  flush(1,true);
 };
}
// One table feeds every route: PSI.vec for the ledger's epicycles and heights
// for reconstruction(). Replacing it in place keeps them from drifting apart.
function applyZeros(list){
 if(!list.length)return;
 zeroHeights=list;
 heights.length=0;for(const g of list)heights.push(g);
 PSI.nz=list.length;PSI.g1=list[0];PSI.syncR=Math.exp(-2*Math.PI/list[0]);
 $('zeroDial').max=list.length;
 if(zeroAuto)$('zeroDial').value=list.length;
}
PSI.vec=function(x,i){
 const g=zeroHeights[i];if(g===undefined)return [0,0];
 const a=g*Math.log(x),d=.25+g*g,cr=Math.cos(a),ci=Math.sin(a);
 return [-2*(cr*.5+ci*g)/d,-2*(ci*.5-cr*g)/d];
};
$('zeroDial').addEventListener('input',()=>{zeroAuto=false;});
applyZeros(zeroHeights);
(function seekZeros(){
 const url=URL.createObjectURL(new Blob([locusZeta.toString()+'\n('+zeroSearchJob.toString()+')();'],{type:'text/javascript'}));
 let worker;
 try{worker=new Worker(url);}catch(error){zeroSearchNote='search unavailable, using the tabulated '+zeroHeights.length;URL.revokeObjectURL(url);return;}
 URL.revokeObjectURL(url);
 const found=[];
 worker.onmessage=e=>{
  const {chunk,progress,done,expected,ms}=e.data;
  for(const g of chunk)found.push(g);
  if(found.length>=zeroHeights.length)applyZeros(found.slice());
  // θ(T)/π + 1 predicts how many zeros lie below T. Printing both is the
  // search's own check that it missed none.
  zeroSearchNote=done?found.length+' found to τ = '+ZERO_LIMIT+', '+expected.toFixed(2)+' predicted, in '+(ms/1000).toFixed(1)+' s'
                     :'searching · '+Math.round(progress*100)+'% · '+found.length+' found';
  if(done)worker.terminate();
 };
 worker.postMessage({limit:ZERO_LIMIT,step:.05});
})();
