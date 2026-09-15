/** Keep the existing mathematical camera centered at (300,150), extending its
 * visible rectangle to the actual display aspect ratio without stretching units.
 * `scale` converts CSS pixels into logical units so text and strokes can be
 * sized for the reader rather than for the retired 600x300 drawing box. */
export interface PlotBounds { top:number; bottom:number; height:number; scale:number }
export function plotBounds(canvas:HTMLCanvasElement):PlotBounds{
 const height=Number(canvas.dataset.logicalHeight)||300,scale=Number(canvas.dataset.logicalScale)||1;
 return {top:150-height/2,bottom:150+height/2,height,scale};
}
export function resizePlot(canvas:HTMLCanvasElement,rasters:HTMLCanvasElement[]=[]){
 const box=canvas.getBoundingClientRect();if(box.width<1||box.height<1)return;
 const ratio=Math.min(3,window.devicePixelRatio||1),width=Math.round(box.width*ratio),height=Math.round(box.height*ratio);
 const logicalHeight=600*height/width,top=150-logicalHeight/2;
 for(const c of [canvas,...rasters]){
  if(c.width===width&&c.height===height)continue;
  c.width=width;c.height=height;c.dataset.logicalHeight=String(logicalHeight);c.dataset.logicalScale=String(600/box.width);
  c.getContext('2d')!.setTransform(width/600,0,0,width/600,0,-top*width/600);
 }
}

/** The band left for the ruler once edge labels have their room, in logical units. */
export function plotBand(canvas:HTMLCanvasElement){
 const b=plotBounds(canvas);
 return {...b,inTop:b.top+26*b.scale,inBottom:b.bottom-20*b.scale};
}
/** Clip drawing to that band. Returns the band so callers can cull to it. */
export function clipPlot(ctx:CanvasRenderingContext2D){
 const b=plotBand(ctx.canvas as HTMLCanvasElement);
 ctx.beginPath();ctx.rect(0,b.inTop,600,b.inBottom-b.inTop);ctx.clip();return b;
}
/** Set a font in CSS pixels and return logical units per CSS pixel. */
export function plotFont(ctx:CanvasRenderingContext2D,px:number,family='ui-monospace'){
 const scale=plotBounds(ctx.canvas as HTMLCanvasElement).scale;ctx.font=px*scale+'px '+family;return scale;
}
