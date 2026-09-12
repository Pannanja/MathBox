from pathlib import Path
root=Path(__file__).resolve().parent.parent
f=root/'orrery-of-eratosthenes.html'
p=f.read_text(encoding='utf-8')
p=p.replace('function frame(ms) {',(root/'.review/geometry.js').read_text(encoding='utf-8')+'\nfunction frame(ms) {',1)
p=p.replace('  updateClock(dt, ms);','  updateClock(dt, ms);\n  updateGeometry(dt);',1)
p=p.replace('  const rad = p => (1 - spacingMix) * R * p / t + spacingMix * R * Math.log(Math.max(2, p)) / lnt;','  const rad = p => clockRadius(p);')
p=p.replace('g2.clearRect(0, 0, W, W);','g2.clearRect(0, 0, W, $("cv").height);')
p=p.replace('g2.globalAlpha = focusMix;', 'g2.globalAlpha = focusMix*(1-separateMix);')
p=p.replace('glassMix*(1-focusMix)', 'glassMix*(1-focusMix*(1-separateMix))')
# The beam crosses panes in physical radial order, including while the ruler morphs.
p=p.replace('cross=crossedPanes(n);', 'cross=crossedPanes(n).sort((a,b)=>rad(a.p)-rad(b.p));')
p=p.replace('block = Math.min(block, ring.p)', 'block = block===Infinity||rad(ring.p)<rad(block)?ring.p:block')
a=p.index('  const unit=R*.50,X=z=>C+unit*z[1],Y=z=>C-unit*z[0];')
b=p.index('  // The drawing window',a)
p=p[:a]+'''  const unit=R*.50,sy=C+900*separateMix,X=z=>C+unit*z[1],Y=z=>sy-unit*z[0];
  g2.save();g2.setTransform(1,0,0,1,0,0);
  const rc=Math.cos(Math.PI*reflectionMix),ra=(1+rc)/2,rb=-(1-rc)/2;
  g2.transform(ra,rb,rb,ra,C*(1-ra)-rb*sy,sy*(1-ra)-rb*C);
  g2.globalAlpha=sumMix*separateMix;g2.fillStyle='#0c1512';g2.beginPath();g2.arc(C,sy,R,0,7);g2.fill();
  g2.strokeStyle='#87998f';g2.lineWidth=1;g2.stroke();
  g2.beginPath();g2.arc(C,sy,R-3,0,2*Math.PI);g2.clip();
  sumClipped=raw.points.some(z=>abs(z)*unit>R-3);
'''+p[b:]
p=p.replace('g2.moveTo(C-R,C);g2.lineTo(C+R,C);g2.moveTo(C,C-R);g2.lineTo(C,C+R);','g2.moveTo(C-R,sy);g2.lineTo(C+R,sy);g2.moveTo(C,sy-R);g2.lineTo(C,sy+R);')
p=p.replace("lensArrow(X(a),Y(a),X(b),Y(b),col,k<8?1.7:1);", "const fresh=k===Math.floor(t)?Math.pow(1-(t%1),2):0;\n    lensArrow(X(a),Y(a),X(b),Y(b),col,(k<8?1.7:1)+3*fresh);")
p=p.replace("    lensArrow(X(raw.z),Y(raw.z),X(corrected),Y(corrected),'#ef947c',2.1);", '''    const span=Math.min(3.2,2*Math.PI*2.2/Math.max(Math.abs(TAUV),.45));
    const path=integralTail(SIGMA,TAUV,t,span);
    sumClipped=sumClipped||path.some(z=>abs(add(raw.z,z))*unit>R-3);
    g2.strokeStyle='#ef947c';g2.lineWidth=2.1;g2.beginPath();
    path.forEach((v,i)=>{const z=add(raw.z,v);i?g2.lineTo(X(z),Y(z)):g2.moveTo(X(z),Y(z));});g2.stroke();''')
# Draw the sum's scale in screen coordinates, after leaving the circular clip.
marker='''  g2.restore();
}
function syncLenses()'''
p=p.replace(marker,'''  g2.restore();
  g2.save();g2.setTransform(1,0,0,1,0,0);g2.globalAlpha=sumMix*separateMix;
  g2.fillStyle='#a0afa5';g2.font='21px ui-monospace,monospace';g2.textAlign='center';
  g2.fillText('SUM · SAME BEAT, ITS OWN RULER',C,sy-R+28);
  const bx=C-unit/2,by=sy+R-30;
  g2.strokeStyle='#e9e2d0';g2.lineWidth=1.5;g2.beginPath();g2.moveTo(bx,by);g2.lineTo(bx+unit,by);g2.moveTo(bx,by-6);g2.lineTo(bx,by+6);g2.moveTo(bx+unit,by-6);g2.lineTo(bx+unit,by+6);g2.stroke();
  g2.fillText('1',C,by-10);g2.restore();
}
function syncLenses()''')
p=p.replace('Math.min(W-10,Y)', 'Math.min($("cv").height-10,Y)')
p=p.replace("specMode=i===2?1:0;", "specMode=1;")
p=p.replace('cy=frame.top+frame.height/2', 'cy=frame.top+C/W*frame.width')
p=p.replace('<strong>Coral adds a compensating tail to the mint chain.</strong> At integer beats, its endpoint approaches the continued zeta value as the count grows.', '<strong>The coral curve walks the integral tail.</strong> Above σ = 1 it coils toward its eye; below 1 it unwinds. The eye is the leading tail correction, not the exact gold value. Their gap shrinks as more terms arrive (σ > 0).')
p=p.replace("<span><i class=\"dot coral\"></i>tail corrected</span>", "<span><i class=\"dot coral\"></i>tail spiral &amp; eye</span>")
p=p.replace('Up = real, right = imaginary.', 'The axes follow your chosen clock orientation.')
p=p.replace('The arrow chain uses a separate fixed display scale while the clock’s radii shrink as p/count. Shared timing and factor colours link these views; a common geometric scale has not yet been constructed.', 'Geometry lets the sum move continuously onto its own labelled ruler. The clock radius is a position assigned to an integer; the sum link is the complex value n⁻ˢ. Shared beat and factor colours connect them, not an equality of radii. The optional outward ruler is log(t/q) / log(t/2), easing in over beats 2–3 where that range first opens. It changes displayed arc lengths, not the panel periods. For nonzero σ the same ratio comes from log weights, with σ cancelling; σ = 0 uses that limiting ruler.')
p=p.replace('</style>', '''
.frame{aspect-ratio:auto}.frame canvas{height:auto;display:block;width:100%}.canvas-tag{top:10px}
.geometry{max-width:420px;margin:14px auto 0;border-top:1px solid var(--edge);padding-top:10px;font-size:12px;color:var(--dim)}
.geometry summary{cursor:pointer;color:var(--ivory);display:flex;justify-content:space-between}.geometry summary span{color:var(--dim);font-size:11px}.geometry label{display:flex;justify-content:space-between;gap:12px;margin-top:16px;color:var(--ivory)}.geometry output{color:var(--patina);font:10px var(--mono)}.geometry input{width:100%;margin:10px 0 0}.geometry p{font-size:12px;line-height:1.6;margin:5px 0 14px}.scale-note{max-width:420px;margin:10px auto;text-align:center}
</style>''',1)
f.write_text(p,encoding='utf-8')
