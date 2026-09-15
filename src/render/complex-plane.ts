import type { Complex } from '../core/contracts';
import type { PlotBounds } from './viewport';

/** One ruler for every explorer view. The violet band describes input s only.
 * Horizontal logical coordinates stay 0..600; the vertical extent follows the
 * display aspect ratio, so every edge-anchored label is placed against bounds. */
export function drawComplexPlane(ctx: CanvasRenderingContext2D,centre: Complex,extent: number,bounds: PlotBounds={top:0,bottom:300,height:300,scale:1}){
  const unit=125/extent,X=(re:number)=>300+unit*(re-centre[0]),Y=(im:number)=>150-unit*(im-centre[1]);
  // One CSS pixel in logical units: labels stay 12-14px on every canvas size.
  const u=bounds.scale,pad=6*u;
  const inTop=bounds.top+26*u,inBottom=bounds.bottom-20*u;  // matches plotBand
  const rows=Math.max(1,Math.floor((inBottom-inTop)/125));
  const tick=(v:number,step:number)=>{
    const digits=Math.max(0,Math.ceil(-Math.log10(step))+1);
    return Math.abs(v)<1e7&&digits<=12?v.toFixed(digits):v.toPrecision(5);
  };
  ctx.save();ctx.font=13*u+'px ui-monospace';ctx.lineWidth=u;
  ctx.save();ctx.beginPath();ctx.rect(0,inTop,600,inBottom-inTop);ctx.clip();
  // Clip before drawing: tiny output scales may put s=1 millions of pixels away.
  const left=Math.max(0,X(0)),right=Math.min(600,X(1));
  if(right>left){ctx.fillStyle='#b18cd015';ctx.fillRect(left,inTop,right-left,inBottom-inTop);}
  ctx.strokeStyle='#71897b38';
  ctx.beginPath();
  for(let i=-2;i<=2;i++){ctx.moveTo(300+i*125,inTop);ctx.lineTo(300+i*125,inBottom);}
  for(let k=-rows;k<=rows;k++){const y=150+k*62.5;if(y<inTop||y>inBottom)continue;ctx.moveTo(0,y);ctx.lineTo(600,y);}
  ctx.stroke();
  for(const re of [0,.5,1]){
    const x=X(re);if(x<0||x>600)continue;
    ctx.strokeStyle=re===.5?'#c79de4a0':'#c79de466';ctx.setLineDash(re===.5?[5*u,5*u]:[]);
    ctx.beginPath();ctx.moveTo(x,inTop);ctx.lineTo(x,inBottom);ctx.stroke();
  }
  ctx.setLineDash([]);ctx.strokeStyle='#bfd0c7b0';ctx.lineWidth=1.5*u;
  const x0=X(0),y0=Y(0);
  if(x0>=0&&x0<=600){ctx.beginPath();ctx.moveTo(x0,inTop);ctx.lineTo(x0,inBottom);ctx.stroke();}
  if(y0>=inTop&&y0<=inBottom){ctx.beginPath();ctx.moveTo(0,y0);ctx.lineTo(600,y0);ctx.stroke();}
  if(x0>=0&&x0<=600&&y0>=inTop&&y0<=inBottom){ctx.fillStyle='#d7e4dc';ctx.fillText('0',Math.min(600-14*u,x0+pad),Math.min(inBottom-pad,y0+16*u));}
  ctx.restore();
  ctx.fillStyle='#acbdb2';
  for(let i=-2;i<=2;i++)ctx.fillText(tick(centre[0]+i*extent,extent),Math.min(600-56*u,Math.max(pad,300+i*125+pad)),bounds.bottom-5*u);
  for(let k=-rows;k<=rows;k++){const y=150+k*62.5;if(y<inTop+13*u||y>inBottom)continue;ctx.fillText(tick(centre[1]-k*extent/2,extent/2),pad,y-5*u);}
  ctx.font=14*u+'px ui-monospace';ctx.fillStyle='#c7d6cd';ctx.fillText('Im(z) ↑',pad,bounds.top+15*u);ctx.textAlign='right';ctx.fillText('Re(z) →',600-pad,bounds.top+15*u);
  ctx.fillStyle='#c79de4';ctx.textAlign='center';
  const stripVisible=right>left;
  ctx.fillText(stripVisible?'critical strip · input s':X(1)<0?'← input critical strip off view':'input critical strip off view →',300,bounds.top+14);
  ctx.font=13*u+'px ui-monospace';for(const re of [.5,1]){const x=X(re);if(x>48*u&&x<600-50*u)ctx.fillText(re===.5?'σ=½':'σ=1',x,inTop+14*u);}
  ctx.textAlign='left';
  if(x0<0||x0>600||y0<inTop||y0>inBottom){
    const horizontal=x0<0?'←':x0>600?'→':'',vertical=y0<inTop?'↑':y0>inBottom?'↓':'';
    ctx.fillStyle='#acbdb2';ctx.fillText('0 '+horizontal+vertical+' off view',pad,bounds.bottom-24*u);
  }
  ctx.restore();
}
