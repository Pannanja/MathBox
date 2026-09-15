import type { Complex, ComplexInput } from '../core/contracts';
import { xiArm } from '../math/xi-arm';
import type { XiArmModel, XiVector } from '../math/xi-arm';
import { drawArm, foldArm, layoutArm, segmentDistance } from '../render/arm';
import type { ArmSegment } from '../render/arm';

interface Frame {
  input: ComplexInput; target: Complex; progress: number; centre: Complex; extent: number;
  compact?: boolean;
}
type Hit = {segment: ArmSegment<XiVector>;from: Complex;to: Complex};
const colour=(direction:number)=>direction===1?'#68d9c4':'#edab71';

/** Quadrature pairs have their own identity; they are not prime-power panes. */
export class XiArmScene {
  private key='';
  private model: XiArmModel|null=null;
  private hits: Hit[]=[];
  private hover=-1;
  private pinned=-1;
  private extra=new Set<number>();
  activeIndex=-1;

  snapshot(input: ComplexInput): XiArmModel {
    const key=[input.sigma,input.tau].join('/');
    if(key!==this.key){this.model=xiArm(input);this.key=key;}
    return this.model!;
  }
  clear(){this.hover=-1;this.pinned=-1;this.extra.clear();}
  invalidate(){this.hits=[];}
  private active(model: XiArmModel){
    if(this.hover>=0)return this.hover;
    if(this.pinned>=0)return this.pinned;
    // A fixed representative node makes input changes continuous, even when
    // the largest term changes. u≈0.3 lies in the substantial part of K.
    return model.terms.filter(t=>t.source.direction===1).reduce((a,b)=>Math.abs(a.source.u-.3)<Math.abs(b.source.u-.3)?a:b).source.index;
  }
  pick(point: Complex,pin=false){
    let nearest: Hit|undefined,best=9;
    for(const hit of this.hits){
      if(Math.hypot(hit.to[0]-hit.from[0],hit.to[1]-hit.from[1])<2)continue;
      const d=segmentDistance(point,hit.from,hit.to);
      if(d<best){best=d;nearest=hit;}
    }
    this.hover=nearest?.segment.items.length===1?nearest.segment.items[0].meta.source.index:-1;
    if(pin&&this.hover>=0)this.pinned=this.hover;
    if(pin&&nearest&&this.hover<0){
      const pairs=[...new Set(nearest.segment.items.map(item=>item.meta.source.index))];
      for(const index of pairs.slice(0,2))this.extra.add(index);
    }
    return this.hover;
  }
  fit(input: ComplexInput,target: Complex,includeInput=false){
    const model=this.snapshot(input),segments=layoutArm(model.terms.map(t=>({id:t.id,value:t.value,meta:t}))),active=this.active(model);
    const points: Complex[]=[[0,0],target,...segments.map(s=>s.to)];
    for(const segment of segments)if(segment.items[0].meta.source.index===active){
      const r=segment.items[0].meta.magnitude,a=segment.from;
      points.push([a[0]-r,a[1]-r],[a[0]+r,a[1]+r]);
    }
    if(includeInput)points.push([input.sigma,input.tau]);
    const lo: Complex=[Math.min(...points.map(z=>z[0])),Math.min(...points.map(z=>z[1]))],hi: Complex=[Math.max(...points.map(z=>z[0])),Math.max(...points.map(z=>z[1]))];
    return {centre:[(lo[0]+hi[0])/2,(lo[1]+hi[1])/2] as Complex,extent:Math.max((hi[0]-lo[0])/4,(hi[1]-lo[1])/2,1e-12)*1.2};
  }
  draw(ctx: CanvasRenderingContext2D,frame: Frame){
    const {input,target,progress,centre,extent}=frame,model=this.snapshot(input);
    const segments=layoutArm(model.terms.map(t=>({id:t.id,value:t.value,meta:t}))),active=this.active(model);
    this.activeIndex=active;
    // Expand whole pairs only: every folded group retains its cancellation.
    const expanded=new Set<string>();
    for(const term of model.terms)if(Math.abs(term.source.index-active)<=1||this.extra.has(term.source.index))expanded.add(term.id);
    const visible=frame.compact?foldArm(segments,expanded):segments,unit=125/extent;
    const project=(z: Complex): Complex=>[300+unit*(z[0]-centre[0]),150-unit*(z[1]-centre[1])];
    ctx.save();ctx.beginPath();ctx.rect(0,20,600,260);ctx.clip();
    ctx.strokeStyle='#91afbe';ctx.globalAlpha=.24;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(...project([0,0]));
    for(const segment of segments)ctx.lineTo(...project(segment.to));ctx.stroke();ctx.globalAlpha=1;
    for(const segment of segments)if(segment.items[0].meta.source.index===active){
      const term=segment.items[0].meta,at=project(segment.from);
      ctx.strokeStyle=colour(term.source.direction);ctx.globalAlpha=.4;ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(at[0],at[1],unit*term.magnitude,0,2*Math.PI);ctx.stroke();ctx.globalAlpha=1;
    }
    const drawn=drawArm(ctx,visible,progress,{project,colour:item=>colour(item.meta.source.direction),highlighted:item=>item.meta.source.index===active});
    this.hits=drawn.hits;
    const tip=project(drawn.tip),goal=project(target);
    ctx.fillStyle='#a9d8f2';ctx.beginPath();ctx.arc(tip[0],tip[1],3,0,2*Math.PI);ctx.fill();
    ctx.strokeStyle='#e9be67';ctx.lineWidth=2;ctx.beginPath();ctx.arc(goal[0],goal[1],6,0,2*Math.PI);ctx.stroke();
    ctx.font='12px ui-monospace';ctx.fillStyle='#e9be67';ctx.fillText('ξ',goal[0]+10,goal[1]-10);
    if(progress<.999){ctx.fillStyle='#a9d8f2';ctx.fillText('partial',tip[0]+8,tip[1]+17);}
    ctx.restore();
    return {model,active:model.terms.filter(t=>t.source.index===active),foldedPairs:visible.filter(s=>s.items.length>1).reduce((a,s)=>a+s.items.length/2,0),tip:drawn.tip};
  }
}
