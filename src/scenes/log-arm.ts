import type { Complex, ComplexInput } from '../core/contracts';
import { logArmAt } from '../math/log-arm';
import type { LogArmModel, LogArmTerm } from '../math/log-arm';
import { drawArm, foldArm, layoutArm, segmentDistance } from '../render/arm';
import type { ArmSegment } from '../render/arm';

interface Frame {
  time: number; input: ComplexInput; selectedPrime: number; progress: number;
  centre: Complex; extent: number;
  compact?: boolean;
  colour: (p: number)=>string; highlightColour: (p: number)=>string;
}
type Hit = {segment: ArmSegment<LogArmTerm>;from: Complex;to: Complex};
export class LogArmScene {
  private key='';
  private model: LogArmModel|null=null;
  private hits: Hit[]=[];
  private hoverQ=0;
  private pinnedQ=0;
  private extra=new Set<string>();
  activeQ=0;

  snapshot(input: ComplexInput,time: number): LogArmModel {
    const key=[input.sigma,input.tau,time].join('/');
    if(key!==this.key){this.model=logArmAt(input,time);this.key=key;}
    return this.model!;
  }
  clear(){this.hoverQ=0;this.pinnedQ=0;this.extra.clear();}
  private active(model: LogArmModel,prime: number){
    const eligible=model.terms.filter(t=>!prime||t.source.p===prime);
    return eligible.find(t=>t.source.q===this.hoverQ)||eligible.find(t=>t.source.q===this.pinnedQ)||eligible[eligible.length-1];
  }
  pick(point: Complex,pin=false): number {
    let nearest: Hit|undefined,best=10;
    for(const hit of this.hits){const d=segmentDistance(point,hit.from,hit.to);if(d<=best){best=d;nearest=hit;}}
    if(nearest?.segment.items.length===1){const term=nearest.segment.items[0].meta;this.hoverQ=term.source.q;if(pin)this.pinnedQ=this.hoverQ;return term.source.p;}
    this.hoverQ=0;
    if(pin&&nearest){for(const item of nearest.segment.items.slice(0,4))this.extra.add(item.id);}
    return 0;
  }
  fit(input: ComplexInput,time: number,prime: number,includeInput=false){
    const model=this.snapshot(input,time),segments=layoutArm(model.terms.map(t=>({id:t.id,value:t.value,meta:t}))),active=this.active(model,prime);
    const points: Complex[]=[[0,0],...segments.map(s=>s.to)];
    const anchor=segments.find(s=>s.items[0].meta===active)?.from;
    if(anchor&&active){const r=active.magnitude;points.push([anchor[0]-r,anchor[1]-r],[anchor[0]+r,anchor[1]+r]);}
    if(includeInput)points.push([input.sigma,input.tau]);
    const lo: Complex=[Math.min(...points.map(z=>z[0])),Math.min(...points.map(z=>z[1]))],hi: Complex=[Math.max(...points.map(z=>z[0])),Math.max(...points.map(z=>z[1]))];
    return {centre:[(lo[0]+hi[0])/2,(lo[1]+hi[1])/2] as Complex,extent:Math.max((hi[0]-lo[0])/4,(hi[1]-lo[1])/2,.01)*1.2};
  }
  draw(ctx: CanvasRenderingContext2D,frame: Frame){
    const {input,time,selectedPrime,progress,centre,extent}=frame,model=this.snapshot(input,time);
    const segments=layoutArm(model.terms.map(t=>({id:t.id,value:t.value,meta:t}))),active=this.active(model,selectedPrime);
    this.activeQ=active?.source.q||0;
    const expanded=new Set(this.extra);
    for(const term of [...model.terms.slice(0,3),...model.terms.slice(-2)])expanded.add(term.id);
    for(const term of model.terms)if(term.source.p===selectedPrime)expanded.add(term.id);
    if(active)expanded.add(active.id);
    const visible=frame.compact?foldArm(segments,expanded):segments,unit=125/extent;
    const project=(z: Complex): Complex=>[300+unit*(z[0]-centre[0]),150-unit*(z[1]-centre[1])];
    ctx.save();ctx.beginPath();ctx.rect(0,20,600,260);ctx.clip();
    // Preserve the actual intermediate geometry underneath folded aggregates.
    ctx.strokeStyle='#8da798';ctx.globalAlpha=.2;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(...project([0,0]));
    for(const segment of segments)ctx.lineTo(...project(segment.to));ctx.stroke();ctx.globalAlpha=1;
    const anchor=segments.find(s=>s.items[0].meta===active)?.from;
    if(active&&anchor){
      const at=project(anchor),radius=unit*active.magnitude;
      ctx.strokeStyle=frame.colour(active.source.p);ctx.globalAlpha=.25;ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(at[0],at[1],radius,0,2*Math.PI);ctx.stroke();ctx.globalAlpha=1;
    }
    const drawn=drawArm(ctx,visible,progress,{project,colour:item=>item.meta.source.q===this.activeQ||item.meta.source.p===selectedPrime?frame.highlightColour(item.meta.source.p):frame.colour(item.meta.source.p),highlighted:item=>item.meta.source.q===this.activeQ});
    this.hits=drawn.hits;
    const tip=project(drawn.tip);ctx.fillStyle='#e9be67';ctx.beginPath();ctx.arc(tip[0],tip[1],4,0,2*Math.PI);ctx.fill();
    ctx.font='12px ui-monospace';ctx.fillText(progress<.999?'partial L':'L',tip[0]+9,tip[1]-9);
    if(active){const segment=segments.find(s=>s.items[0].meta===active)!;const at=project(segment.to);ctx.fillStyle=frame.highlightColour(active.source.p);ctx.fillText('q='+active.source.q,at[0]+8,at[1]+18);}
    ctx.restore();
    const folded=visible.filter(s=>s.items.length>1).reduce((a,s)=>a+s.items.length,0);
    return {model,active,folded,replaying:progress<.999,tip:drawn.tip};
  }
}
