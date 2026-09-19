import { countedPsi, passedZeros, psiArm, psiIndexAt, psiTrend } from '../math/psi';
import type { PsiBirth } from '../math/psi';

export interface PsiSceneFrame {
 time:number; tau:number; heights:readonly number[]; events:readonly PsiBirth[];
 colour:(p:number)=>string; origin:number; radius:number;
 activePane:{radius:number;angle:number;span:number}|null;
}
export function psiScene(frame:PsiSceneFrame){
 const x=frame.time,count=passedZeros(frame.heights,frame.tau),index=psiIndexAt(frame.events,x),event=frame.events[index];
 return {x,count,index,exact:countedPsi(frame.events,x),full:psiArm(x,frame.heights,frame.heights.length),
  partial:psiArm(x,frame.heights,count),current:event&&x<event.q+1?event:null,
  unit:frame.radius/Math.max(1,x),centre:x>=2?psiTrend(x):0};
}
/** One vector scene for both the clock and microscope: no independent graph coordinates. */
export function drawPsiMechanism(c:CanvasRenderingContext2D,frame:PsiSceneFrame,pixelScale=1){
 const s=psiScene(frame),C=frame.origin,u=s.unit,at=(re:number,im=0)=>[C+u*im,C-u*re],pen=1/pixelScale;
 const tooth=.1*Math.sqrt(s.x),offset=u*tooth;
 c.save();c.lineCap='round';c.lineJoin='round';
 // The same counted teeth live beside the meeting ray in both views.
 for(let i=Math.max(0,s.index-24);i<=s.index;i++){
  const e=frame.events[i],a=at(e.lo),b=at(e.hi);c.strokeStyle=frame.colour(e.p);c.globalAlpha=e===s.current?1:.65;
  c.lineWidth=(e===s.current?2.2:1.3)*pen;c.beginPath();c.moveTo(a[0]+offset,a[1]);c.lineTo(b[0]+offset,b[1]);c.stroke();
  c.lineWidth=pen;c.beginPath();c.moveTo(b[0]+offset*.65,b[1]);c.lineTo(b[0]+offset*1.35,b[1]);c.stroke();
 }
 const arm=(chain:ReturnType<typeof psiArm>,ink:string,alpha:number)=>{
  c.strokeStyle=ink;c.fillStyle=ink;
  for(let i=1;i<chain.points.length;i++){
   const a=chain.points[i-1],b=chain.points[i],p=at(a[0],a[1]),q=at(b[0],b[1]),r=u*Math.hypot(b[0]-a[0],b[1]-a[1]);
   // Actual circular orbit of this rotating vector, not decorative gear teeth.
   if(r*pixelScale>=2){c.globalAlpha=alpha*.38;c.lineWidth=.8*pen;c.beginPath();c.arc(p[0],p[1],r,0,2*Math.PI);c.stroke();}
   c.globalAlpha=alpha;c.lineWidth=1.2*pen;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke();
   if(r*pixelScale>=5){c.beginPath();c.arc(p[0],p[1],1.6*pen,0,2*Math.PI);c.fill();}
  }
 };
 arm(s.full,'#86c7b4',.42);arm(s.partial,'#f3aa77',.95);
 const mark=(v:number,ink:string,r:number)=>{if(!Number.isFinite(v))return;const p=at(v);c.globalAlpha=1;c.fillStyle=ink;c.beginPath();c.arc(p[0],p[1],r*pen,0,2*Math.PI);c.fill();};
 mark(s.exact,'#f2dfab',3);mark(s.full.endpoint,'#86c7b4',2.2);mark(s.partial.endpoint,'#f3aa77',2.6);
 if(s.current&&frame.activePane){
  const a=frame.activePane;c.globalAlpha=.6+.4*(1-(s.x-s.current.q));c.strokeStyle=frame.colour(s.current.p);c.lineWidth=2*pen;
  c.beginPath();c.arc(C,C,a.radius,a.angle-a.span/2,a.angle+a.span/2);c.stroke();
  const end=at(s.current.hi);c.globalAlpha=.4;c.lineWidth=pen;c.setLineDash([2*pen,3*pen]);c.beginPath();c.moveTo(C,C-a.radius);c.lineTo(end[0]+offset,end[1]);c.stroke();
 }
 c.restore();return s;
}

export class PsiLens {
 draw(canvas:HTMLCanvasElement,frame:PsiSceneFrame,source:HTMLCanvasElement,matrix:DOMMatrix,zoom:number,clockPixelsPerUnit:number){
  const rect=canvas.getBoundingClientRect();if(rect.width<1||rect.height<1)return;
  const dpr=Math.min(3,devicePixelRatio||1),w=rect.width,h=rect.height,r=Math.min(w,h)/2-3;
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  const c=canvas.getContext('2d')!,s=psiScene(frame);
  const extent=Math.max(1.5,1.25*Math.log(Math.max(s.x,2)),Math.sqrt(s.x)*.35)/zoom;
  const focus=matrix.transformPoint(new DOMPoint(frame.origin,frame.origin-s.unit*s.centre)),sourceRadius=extent*s.unit,scale=r/sourceRadius;
  c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);c.save();c.beginPath();c.arc(w/2,h/2,r,0,2*Math.PI);c.clip();
  c.fillStyle='#0b1511';c.fillRect(0,0,w,h);
  c.translate(w/2,h/2);c.scale(scale,scale);c.translate(-focus.x,-focus.y);
  // The actual clock backdrop, captured immediately before drawing this mechanism.
  c.globalAlpha=.6;c.drawImage(source,0,0);c.globalAlpha=1;
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
