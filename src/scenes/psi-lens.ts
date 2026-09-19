import { countedPsi, passedZeros, psiEpicycles, psiIndexAt, psiTrace, psiTrend } from '../math/psi';
import type { PsiTrail } from '../math/psi';
import type { Complex } from '../core/contracts';
import type { PsiBirth } from '../math/psi';

export interface PsiSceneFrame {
 time:number; tau:number; heights:readonly number[]; events:readonly PsiBirth[];
 colour:(p:number)=>string; origin:number; radius:number;
 activePane:{radius:number;angle:number;span:number}|null;
 trail?:PsiTrail|null;
 top:number;
 options?:PsiOptions;
}
/** Tunable defaults, supplied by the page from CLOCK_CONFIG. */
export interface PsiOptions {
 liftMode?:'fixed'|'sqrt'|'auto';
 lift?:number;
 traceSpan?:number;
 traceSteps?:number;
}
const exactOf=(frame:PsiSceneFrame,x:number)=>countedPsi(frame.events,x);
export function psiScene(frame:PsiSceneFrame){
 const x=frame.time,count=passedZeros(frame.heights,frame.tau),index=psiIndexAt(frame.events,x),event=frame.events[index];
 const full=psiEpicycles(x,frame.heights,frame.heights.length),partial=psiEpicycles(x,frame.heights,count);
 // The chain rides just clear of the meeting axis: high enough that no leg
 // crosses it, low enough that it still reads as hanging off that axis.
 let spread=0;for(const q of partial.points)if(Number.isFinite(q[1]))spread=Math.max(spread,Math.abs(q[1]));
 // How high the chain rides. 'auto' clears its own spread, which is honest but
 // jumps about as zeros arrive; a fixed metric holds still so the eye can use
 // the height as a reference instead of re-reading it every frame.
 const opt=frame.options||{},base=opt.lift===undefined?1.15:opt.lift;
 const lift=x<2?0:opt.liftMode==='fixed'?base:opt.liftMode==='sqrt'?base*Math.sqrt(x):spread+.14*Math.sqrt(x);
 // How far the drawn mechanism actually gets from the trend, so the lens can
 // frame what is there instead of a guess that leaves the chain outside.
 const centre=x>=2?psiTrend(x):0;
 const mid=(lift+spread)/2;
 let reach=Math.abs(mid);
 for(const q of partial.points)if(Number.isFinite(q[0])){
  reach=Math.max(reach,Math.abs(q[0]-centre),Math.abs(q[1]+lift-mid));}
 if(Number.isFinite(exactOf(frame,x)))reach=Math.max(reach,Math.abs(exactOf(frame,x)-centre));
 const band=(lift+spread)/2;
 // The mechanism stays on the meeting ray. Radius alone carries psi, so the
 // history the tips draw runs out from the centre along that ray rather than
 // being smeared around the face.
 const angle=frame.top,ux=Math.cos(angle),uy=Math.sin(angle);
 return {x,count,index,exact:countedPsi(frame.events,x),full,partial,lift,spread,band,reach,angle,ux,uy,
  current:event&&x<event.q+1?event:null,
  unit:frame.radius/Math.max(1,x),centre};
}
/** One vector scene for both the clock and microscope: no independent graph coordinates.
 * The chain is a true epicyclic chain, lifted clear of the meeting axis so it can
 * be read while it whips through a birth. Only its shadow on that axis is psi,
 * so the drop and its foot are drawn every frame and the tip never pretends. */
const TRACE_SPAN=.7, TRACE_STEPS=140;
function legInk(i:number,n:number,alpha:number){
 const h=168-138*(n<2?1:i/(n-1));
 return 'hsl('+h.toFixed(0)+' 62% 66% / '+alpha.toFixed(3)+')';
}
export function drawPsiMechanism(c:CanvasRenderingContext2D,frame:PsiSceneFrame,pixelScale=1){
 const s=psiScene(frame),C=frame.origin,u=s.unit,pen=1/pixelScale;
 if(!(s.x>=2)){return s;}
 const lift=s.lift;
 const at=(re:number,im=0)=>[C+u*(re*s.ux-im*s.uy),C+u*(re*s.uy+im*s.ux)];
 c.save();c.lineCap='round';c.lineJoin='round';

 // The high-precision path: where the tip has been and is going, from every
 // searched zero. Its shadow on the axis is the reconstruction, so the steps
 // arrive from the zeros rather than from a counted ledger.
 const opt=frame.options||{};
 const span=opt.traceSpan===undefined?TRACE_SPAN:opt.traceSpan;
 const steps=opt.traceSteps===undefined?TRACE_STEPS:opt.traceSteps;
 const from=Math.max(2,s.x-span);
 const trace=psiTrace(frame.heights,s.count,from,s.x,steps);
 // The ratchet reads every searched zero, not just the heights tau has passed.
 // The pawl only slips once the sum rings faster than the window is wide, and
 // that ringing is 2*pi*x/T: it needs hundreds of heights, not a dozen.
 // Sample it at the rate that ringing actually demands -- eight points per
 // wavelength -- rather than a fixed count, which is 24 samples at x = 60 and
 // was 140 before. The cost follows the detail instead of the zero count.
 const top=frame.heights.length?frame.heights[frame.heights.length-1]:1;
 const wave=2*Math.PI*s.x/Math.max(1,top);
 const trackSteps=Math.max(24,Math.min(220,Math.ceil(8*(s.x-from)/Math.max(1e-6,wave))));
 const track=psiTrace(frame.heights,frame.heights.length,from,s.x,trackSteps);
 if(trace.length>1){
  c.globalAlpha=.62;c.strokeStyle='#7fd3c0';c.lineWidth=1.4*pen;c.beginPath();
  trace.forEach((q:Complex,i:number)=>{const p=at(q[0],q[1]+lift);i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);});
  c.stroke();
 }

 // The ratchet: the foot only marks the axis while the reconstruction is
 // rising. Between prime powers psi is flat and the pawl sits idle; at a birth
 // it advances hard. The ringing either side makes it slip backwards, and the
 // slip is left undrawn rather than papered over -- a gap in the track is a
 // real retreat, not a missing sample.
 if(track.length>1){
  c.lineCap='butt';
  for(let i=1;i<track.length;i++){
   const a=track[i-1][0],b=track[i][0];
   if(!(b>a))continue;
   const p=at(a),q=at(b),rate=(b-a)/((TRACE_SPAN)/TRACE_STEPS);
   c.globalAlpha=Math.min(.95,.22+.5*rate);c.strokeStyle='#e0bd76';
   c.lineWidth=(1.4+2.2*Math.min(1,rate))*pen;
   c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke();
  }
  c.lineCap='round';
 }

 // The meeting axis under the lifted chain, so the drop has something to land on.
 const axisFrom=at(from),axisTo=at(s.x+.6);
 c.globalAlpha=.30;c.strokeStyle='#9fb4a6';c.lineWidth=pen;c.beginPath();
 c.moveTo(axisFrom[0],axisFrom[1]);c.lineTo(axisTo[0],axisTo[1]);c.stroke();

 // The chain is rooted at the trend on the axis; the stem says so, otherwise
 // the lift looks like the mechanism has floated free of what it measures.
 const root=at(s.partial.start),rootUp=at(s.partial.start,lift);
 c.globalAlpha=.34;c.strokeStyle='#9fb4a6';c.lineWidth=pen;c.setLineDash([2*pen,3*pen]);
 c.beginPath();c.moveTo(root[0],root[1]);c.lineTo(rootUp[0],rootUp[1]);c.stroke();c.setLineDash([]);

 const chain=(ch:ReturnType<typeof psiEpicycles>,coloured:boolean,alpha:number)=>{
  const pts=ch.points;if(pts.length<2)return;
  for(let i=1;i<pts.length;i++){
   const a=pts[i-1],b=pts[i],p=at(a[0],a[1]+lift),q=at(b[0],b[1]+lift);
   const r=u*Math.hypot(b[0]-a[0],b[1]-a[1]);
   // The actual circular orbit this rotating vector sweeps, not a decorative gear.
   if(r*pixelScale>=2.5){c.globalAlpha=alpha*.22;c.strokeStyle=coloured?legInk(i-1,pts.length-1,1):'#6f8f84';
    c.lineWidth=.7*pen;c.beginPath();c.arc(p[0],p[1],r,0,2*Math.PI);c.stroke();}
   c.globalAlpha=alpha;c.strokeStyle=coloured?legInk(i-1,pts.length-1,1):'#6f8f84';
   c.lineWidth=(coloured?1.5:.9)*pen;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke();
   if(coloured&&r*pixelScale>=5){c.fillStyle=legInk(i-1,pts.length-1,1);c.globalAlpha=alpha;
    c.beginPath();c.arc(p[0],p[1],1.5*pen,0,2*Math.PI);c.fill();}
  }
 };
 chain(s.full,false,.40);
 chain(s.partial,true,.95);

 // Only the shadow is psi. Drop it and mark the foot.
 const tip=s.partial.tip;
 if(Number.isFinite(tip[0])){
  const tp=at(tip[0],tip[1]+lift),foot=at(tip[0]);
  c.globalAlpha=.55;c.strokeStyle='#f2dfab';c.lineWidth=pen;c.setLineDash([2.5*pen,3*pen]);
  c.beginPath();c.moveTo(tp[0],tp[1]);c.lineTo(foot[0],foot[1]);c.stroke();c.setLineDash([]);
  c.globalAlpha=1;c.fillStyle='#f3aa77';c.beginPath();c.arc(tp[0],tp[1],2.6*pen,0,2*Math.PI);c.fill();
 }
 const mark=(v:number,ink:string,r:number)=>{if(!Number.isFinite(v))return;const p=at(v);c.globalAlpha=1;c.fillStyle=ink;c.beginPath();c.arc(p[0],p[1],r*pen,0,2*Math.PI);c.fill();};
 mark(s.full.endpoint,'#86c7b4',2.2);mark(s.partial.endpoint,'#f3aa77',2.8);mark(s.exact,'#f2dfab',2.2);

 // The pane is the count. Light the one that is printing and tie it to the axis.
 if(s.current&&frame.activePane){
  const a=frame.activePane;c.globalAlpha=.6+.4*(1-(s.x-s.current.q));c.strokeStyle=frame.colour(s.current.p);c.lineWidth=2.2*pen;
  c.beginPath();c.arc(C,C,a.radius,a.angle-a.span/2,a.angle+a.span/2);c.stroke();
  const step=at(s.current.hi);c.globalAlpha=.45;c.lineWidth=pen;c.setLineDash([2*pen,3*pen]);
  c.beginPath();c.moveTo(C,C-a.radius);c.lineTo(step[0],step[1]);c.stroke();c.setLineDash([]);
 }
 c.restore();return s;
}

export class PsiLens {
 draw(canvas:HTMLCanvasElement,frame:PsiSceneFrame,source:HTMLCanvasElement,matrix:DOMMatrix,zoom:number,clockPixelsPerUnit:number){
  const rect=canvas.getBoundingClientRect();if(rect.width<1||rect.height<1)return;
  const dpr=Math.min(3,devicePixelRatio||1),w=rect.width,h=rect.height,r=Math.min(w,h)/2-3;
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  const c=canvas.getContext('2d')!,s=psiScene(frame);
  // Frame what the mechanism actually occupies. A fixed guess left the chain
  // hanging outside the glass exactly when tau had bought enough zeros to make
  // it worth looking at.
  const extent=Math.max(1.5,1.25*Math.log(Math.max(s.x,2)),Math.sqrt(s.x)*.35,s.reach*1.18)/zoom;
  const focus=matrix.transformPoint(new DOMPoint(
   frame.origin+s.unit*(s.centre*s.ux-s.band*s.uy),
   frame.origin+s.unit*(s.centre*s.uy+s.band*s.ux))),sourceRadius=extent*s.unit,scale=r/sourceRadius;
  c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);c.save();c.beginPath();c.arc(w/2,h/2,r,0,2*Math.PI);c.clip();
  c.fillStyle='#0b1511';c.fillRect(0,0,w,h);
  c.translate(w/2,h/2);c.scale(scale,scale);c.translate(-focus.x,-focus.y);
  // No clock bitmap here. Magnifying the clock canvas twenty times is magnifying
  // its pixels, and the backdrop turned into coloured fog that buried the very
  // mechanism this lens exists to show. Everything inside the glass is redrawn
  // as geometry at the lens's own scale, so it is sharp at any magnification.
  c.transform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.e,matrix.f);
  drawPsiMechanism(c,frame,scale);
  c.restore();c.strokeStyle='#a9c1ad77';c.lineWidth=1;c.beginPath();c.arc(w/2,h/2,r,0,2*Math.PI);c.stroke();
  c.strokeStyle='#a9c1ad22';c.beginPath();c.arc(w/2,h/2,r-4,0,2*Math.PI);c.stroke();
  c.font='12px system-ui';c.textAlign='center';c.fillStyle='#b4c3b8';
  const magnification=scale/clockPixelsPerUnit;
  c.fillText('ψ · '+s.count+' / '+frame.heights.length+' zero pairs',w/2,29);
  c.fillText(magnification.toFixed(1)+'× · x = '+s.x.toFixed(2),w/2,h-22);
  return {x:s.x,count:s.count,exact:s.exact,full:s.full.endpoint,partial:s.partial.endpoint,magnification,
   focus:{x:focus.x,y:focus.y},sourceRadius,scale,active:s.current};
 }
}

/** The two pens' paths, laid back onto the dial.
 *
 * Every stored sample is re-placed through the clock's CURRENT contraction, so
 * the whole history creeps inward as the count grows, exactly as the prime
 * annuli do, and the lines are drawn by the same tips that are drawing them
 * now. Nothing here is a separate rendering of psi: it is where the mechanism
 * has been.
 *
 * Teal is every searched zero, the precision the instrument can reach. Orange
 * is the precision tau actually had at each moment, so the gap between the two
 * lines is what the climb up the critical strip has yet to buy. */
export interface PsiTrailFrame {
 trail?:PsiTrail|null; origin:number; radius:number; top:number; scale:number;
 inkFull?:string; inkPassed?:string; width?:number; alphaFull?:number; alphaPassed?:number;
}
export function drawPsiTrail(c:CanvasRenderingContext2D,f:PsiTrailFrame){
 const tr=f.trail;if(!tr||tr.length<2)return 0;
 const C=f.origin,u=f.radius/Math.max(1e-6,f.scale);
 const full=new Path2D(),passed=new Path2D();
 let drawn=0;
 // Same placement as the mechanism itself, so the lines begin at the tips that
 // are drawing them: the meeting ray, with radius carrying psi.
 const ax=Math.cos(f.top),ay=Math.sin(f.top);
 for(let i=0;i<tr.length;i++){
  const p=tr.read(i);
  const fx=C+u*(p.full[0]*ax-p.full[1]*ay),fy=C+u*(p.full[0]*ay+p.full[1]*ax);
  const px=C+u*(p.passed[0]*ax-p.passed[1]*ay),py=C+u*(p.passed[0]*ay+p.passed[1]*ax);
  if(i===0){full.moveTo(fx,fy);passed.moveTo(px,py);}
  else {full.lineTo(fx,fy);passed.lineTo(px,py);drawn++;}
 }
 // Successive turns are only radius/scale apart -- four or five pixels by the
 // time the count reaches ninety -- so the ink has to be thin and faint or the
 // record closes over the dial it is written on.
 const w=f.width===undefined?.6:f.width;
 c.save();c.lineCap='butt';c.lineJoin='round';
 c.globalAlpha=f.alphaFull===undefined?.17:f.alphaFull;
 c.strokeStyle=f.inkFull||'#7fd3c0';c.lineWidth=w;c.stroke(full);
 c.globalAlpha=f.alphaPassed===undefined?.42:f.alphaPassed;
 c.strokeStyle=f.inkPassed||'#f3aa77';c.lineWidth=w;c.stroke(passed);
 c.restore();return drawn;
}
