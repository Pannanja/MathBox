import type { Complex } from '../core/contracts';

/** One ruler for every explorer view. The violet band describes input s only. */
export function drawComplexPlane(ctx: CanvasRenderingContext2D,centre: Complex,extent: number){
  const unit=125/extent,X=(re:number)=>300+unit*(re-centre[0]),Y=(im:number)=>150-unit*(im-centre[1]);
  const tick=(v:number,step:number)=>{
    const digits=Math.max(0,Math.ceil(-Math.log10(step))+1);
    return Math.abs(v)<1e7&&digits<=12?v.toFixed(digits):v.toPrecision(5);
  };
  ctx.save();ctx.font='12px ui-monospace';ctx.lineWidth=1;
  ctx.save();ctx.beginPath();ctx.rect(0,20,600,260);ctx.clip();
  // Clip before drawing: tiny output scales may put s=1 millions of pixels away.
  const left=Math.max(0,X(0)),right=Math.min(600,X(1));
  if(right>left){ctx.fillStyle='#b18cd015';ctx.fillRect(left,20,right-left,260);}
  ctx.strokeStyle='#71897b38';
  for(let i=-2;i<=2;i++){
    ctx.beginPath();ctx.moveTo(300+i*125,20);ctx.lineTo(300+i*125,280);
    ctx.moveTo(0,150-i*62.5);ctx.lineTo(600,150-i*62.5);ctx.stroke();
  }
  for(const re of [0,.5,1]){
    const x=X(re);if(x<0||x>600)continue;
    ctx.strokeStyle=re===.5?'#c79de4a0':'#c79de466';ctx.setLineDash(re===.5?[5,5]:[]);
    ctx.beginPath();ctx.moveTo(x,20);ctx.lineTo(x,280);ctx.stroke();
  }
  ctx.setLineDash([]);ctx.strokeStyle='#bfd0c7b0';ctx.lineWidth=1.5;
  const x0=X(0),y0=Y(0);
  if(x0>=0&&x0<=600){ctx.beginPath();ctx.moveTo(x0,20);ctx.lineTo(x0,280);ctx.stroke();}
  if(y0>=20&&y0<=280){ctx.beginPath();ctx.moveTo(0,y0);ctx.lineTo(600,y0);ctx.stroke();}
  if(x0>=0&&x0<=600&&y0>=20&&y0<=280){ctx.fillStyle='#d7e4dc';ctx.fillText('0',Math.min(586,x0+5),Math.min(275,y0+15));}
  ctx.restore();
  ctx.fillStyle='#acbdb2';
  for(let i=-2;i<=2;i++){
    ctx.fillText(tick(centre[0]+i*extent,extent),Math.min(500,Math.max(3,303+i*125)),296);
    if(i<2)ctx.fillText(tick(centre[1]+i*extent/2,extent/2),4,146-i*62.5);
  }
  ctx.fillStyle='#c7d6cd';ctx.fillText('Im(z) ↑',4,14);ctx.fillText('Re(z) →',535,14);
  ctx.fillStyle='#c79de4';ctx.textAlign='center';
  const stripVisible=right>left;
  ctx.fillText(stripVisible?'critical strip · input s':X(1)<0?'← input critical strip off view':'input critical strip off view →',300,14);
  for(const re of [.5,1]){const x=X(re);if(x>48&&x<550)ctx.fillText(re===.5?'σ=½':'σ=1',x,34);}
  ctx.textAlign='left';
  if(x0<0||x0>600||y0<20||y0>280){
    const horizontal=x0<0?'←':x0>600?'→':'',vertical=y0<20?'↑':y0>280?'↓':'';
    ctx.fillStyle='#acbdb2';ctx.fillText('0 '+horizontal+vertical+' off view',8,272);
  }
  ctx.restore();
}
