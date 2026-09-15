import type { Complex } from '../core/contracts';
import { plotBounds } from './viewport';

export interface VectorItem<T> { readonly id: string; readonly value: Complex; readonly meta: T }
export interface ArmSegment<T> {
  readonly from: Complex;
  readonly to: Complex;
  readonly items: readonly VectorItem<T>[];
}

/** The full chain is accumulated before folding; hidden terms keep their value. */
export function layoutArm<T>(items: readonly VectorItem<T>[]): ArmSegment<T>[] {
  let re=0,im=0,cr=0,ci=0;
  return items.map(item=>{
    const from: Complex=[re,im],yr=item.value[0]-cr,yi=item.value[1]-ci,tr=re+yr,ti=im+yi;
    cr=(tr-re)-yr;ci=(ti-im)-yi;re=tr;im=ti;
    return {from,to:[re,im],items:[item]};
  });
}
export function foldArm<T>(segments: readonly ArmSegment<T>[], expanded: ReadonlySet<string>): ArmSegment<T>[] {
  const result: ArmSegment<T>[]=[];let pending: ArmSegment<T>[]=[];
  function flush(){if(pending.length){result.push({from:pending[0].from,to:pending[pending.length-1].to,items:pending.flatMap(s=>s.items)});pending=[];}}
  for(const segment of segments){if(expanded.has(segment.items[0].id)){flush();result.push(segment);}else pending.push(segment);}
  flush();return result;
}
export function segmentDistance(point: Complex, from: Complex, to: Complex): number {
  const dx=to[0]-from[0],dy=to[1]-from[1],d=dx*dx+dy*dy;
  const f=d?Math.max(0,Math.min(1,((point[0]-from[0])*dx+(point[1]-from[1])*dy)/d)):0;
  return Math.hypot(point[0]-from[0]-f*dx,point[1]-from[1]-f*dy);
}
export interface ArmDrawStyle<T> {
  project: (z: Complex)=>Complex;
  colour: (item: VectorItem<T>)=>string;
  highlighted: (item: VectorItem<T>)=>boolean;
}
/** Prefix tracing follows vector lengths; it never alters the computed endpoint. */
export function drawArm<T>(ctx: CanvasRenderingContext2D, segments: readonly ArmSegment<T>[], progress: number, style: ArmDrawStyle<T>) {
  const lengths=segments.map(s=>Math.hypot(s.to[0]-s.from[0],s.to[1]-s.from[1]));
  let remaining=lengths.reduce((a,b)=>a+b,0)*Math.max(0,Math.min(1,progress));
  let tip: Complex=[0,0];
  const hits: {segment: ArmSegment<T>;from: Complex;to: Complex}[]=[];
  const u=plotBounds(ctx.canvas as HTMLCanvasElement).scale;
  ctx.save();ctx.lineCap='round';
  segments.forEach((segment,i)=>{
    const a=style.project(segment.from),b=style.project(segment.to),item=segment.items[0],folded=segment.items.length>1;
    const highlighted=!folded&&style.highlighted(item),colour=folded?'#9aafa2':style.colour(item);
    ctx.strokeStyle=colour;ctx.setLineDash(folded?[3*u,5*u]:[]);ctx.lineWidth=(highlighted?3.6:2)*u;
    ctx.globalAlpha=.2;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();
    const f=lengths[i]===0?(progress>=1?1:0):Math.max(0,Math.min(1,remaining/lengths[i]));
    if(f>0){
      tip=[segment.from[0]+f*(segment.to[0]-segment.from[0]),segment.from[1]+f*(segment.to[1]-segment.from[1])];
      const end=style.project(tip);ctx.globalAlpha=folded?.6:1;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...end);ctx.stroke();
      if(!folded&&Math.hypot(end[0]-a[0],end[1]-a[1])>14*u){
        const angle=Math.atan2(end[1]-a[1],end[0]-a[0]);ctx.setLineDash([]);ctx.beginPath();
        ctx.moveTo(end[0]-6*u*Math.cos(angle-.45),end[1]-6*u*Math.sin(angle-.45));ctx.lineTo(...end);
        ctx.lineTo(end[0]-6*u*Math.cos(angle+.45),end[1]-6*u*Math.sin(angle+.45));ctx.stroke();
      }
    }
    remaining-=lengths[i];hits.push({segment,from:a,to:b});
  });
  ctx.restore();return {tip,hits};
}
