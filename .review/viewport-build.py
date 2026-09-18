from pathlib import Path
import os
root=Path(__file__).resolve().parent.parent
page_output=Path(os.environ.get('CLOCK_HTML_OUTPUT',str(root / 'orrery-of-eratosthenes.html')))
f=page_output
p=f.read_text(encoding='utf-8')
p=p.replace('</style>',(root/'.review/viewport.css').read_text(encoding='utf-8')+'\n</style>',1)
p=p.replace('</script>',(root/'.review/viewport.js').read_text(encoding='utf-8')+'\n</script>',1)
p=p.replace('</style>',(root/'.review/j-ledger.css').read_text(encoding='utf-8')+'\n</style>',1)
p=p.replace('</script>',(root/'.review/j-ledger.js').read_text(encoding='utf-8')+'\n</script>',1)
p=p.replace('</style>',(root/'.review/j-bridge.css').read_text(encoding='utf-8')+'\n</style>',1)
p=p.replace('</script>',(root/'.review/j-bridge.js').read_text(encoding='utf-8')+'\n</script>',1)
p=p.replace('const u=trip.elapsed/trip.duration, blend=u*u*(3-2*u);','const u=trip.elapsed/trip.duration, blend=1-(1-u)*(1-u);')
# Draw the sum after the glass beam, so aligned vectors are visible at tau=0.
p=p.replace('  drawContinuum(ms, rad);','')
p=p.replace('  drawPrimeGlass(rad,n);','  drawPrimeGlass(rad,n);\n  drawContinuum(ms,rad);')
# The window the sum is drawn in and the ruler it is drawn with are separate:
# sumR frames the view, sumZoom sets how many pixels one unit is worth.
p=p.replace('  const unit=R*.50,sy=C+900*separateMix,X=z=>C+unit*z[1],Y=z=>sy-unit*z[0];', '  const sumR=R*(1-.68*separateMix),unit=sumR*sumUnitRadii(),sx=C+R*.58*separateMix,sy=C+R*.58*separateMix,X=z=>sx+unit*z[1],Y=z=>sy-unit*z[0];')
p=p.replace('g2.transform(ra,rb,rb,ra,C*(1-ra)-rb*sy,sy*(1-ra)-rb*C);','g2.transform(ra,rb,rb,ra,sx*(1-ra)-rb*sy,sy*(1-ra)-rb*sx);')
p=p.replace('g2.arc(C,sy,R,0,7)','g2.arc(sx,sy,sumR+8,0,7)')
p=p.replace("g2.strokeStyle='#87998f';g2.lineWidth=1;g2.stroke();", "g2.strokeStyle='#87998f';g2.lineWidth=1;g2.beginPath();g2.arc(sx,sy,sumR,0,7);g2.stroke();")
p=p.replace('g2.arc(C,sy,R-3,0,2*Math.PI)','g2.arc(sx,sy,sumR+8,0,2*Math.PI)')
p=p.replace('abs(z)*unit>R-3','abs(z)*unit>sumR+8').replace('abs(add(raw.z,z))*unit>R-3','abs(add(raw.z,z))*unit>sumR+8')
p=p.replace('g2.moveTo(C-R,sy);g2.lineTo(C+R,sy);g2.moveTo(C,sy-R);g2.lineTo(C,sy+R);','g2.moveTo(sx-sumR,sy);g2.lineTo(sx+sumR,sy);g2.moveTo(sx,sy-sumR);g2.lineTo(sx,sy+sumR);')
p=p.replace('    lensArrow(X(a),Y(a),X(b),Y(b),col,(k<8?1.7:1)+3*fresh);','    lensArrow(X(a),Y(a),X(b),Y(b),"#0c1512",(k<8?7:4)+3*fresh);\n    lensArrow(X(a),Y(a),X(b),Y(b),col,(k<8?2.8:1.5)+3*fresh);')
p=p.replace("g2.fillText('SUM · SAME BEAT, ITS OWN RULER',C,sy-R+28);", "g2.fillText(sumRulerLabel(),sx,sy-sumR-12);")
# A unit wider than the inset is drawn as the fraction of it that fits.
p=p.replace('const bx=C-unit/2,by=sy+R-30;', 'const bar=Math.min(unit,2*sumR-16),bx=sx-bar/2,by=sy+sumR-18;')
p=p.replace('g2.lineTo(bx+unit,by);','g2.lineTo(bx+bar,by);').replace('g2.moveTo(bx+unit,by-6);g2.lineTo(bx+unit,by+6);','g2.moveTo(bx+bar,by-6);g2.lineTo(bx+bar,by+6);')
p=p.replace("g2.fillText('1',C,by-10)","g2.fillText(bar<unit-.5?(bar/unit).toFixed(2):'1',sx,by-10)")
# Unused old slogan must not remain even in the hidden shell.
p=p.replace('<small>One beat. One discovery.</small>','')
p=p.replace('</style>',(root/'.review/analytic-views.css').read_text(encoding='utf-8')+'\n</style>',1)
p=p.replace('</script>',(root/'.review/analytic-views.js').read_text(encoding='utf-8')+'\n</script>',1)
# Either mechanism can be brought to the front of the other. The sum is drawn
# once, before the dial or after it, and whatever is behind sits under a veil.
p=p.replace('  beginReflection(dt);','  beginReflection(dt);\n  if(layerFront<0){drawContinuum(ms,rad);layerVeil();}',1)
p=p.replace('  drawPrimeGlass(rad,n);\n  drawContinuum(ms,rad);','  drawPrimeGlass(rad,n);\n  drawPsiStair();\n  if(layerFront>=0){layerVeil();drawContinuum(ms,rad);}',1)
p=p.replace('</style>',(root/'.review/linked-regions.css').read_text(encoding='utf-8')+'\n</style>',1)
p=p.replace('</script>',(root/'.review/linked-regions.js').read_text(encoding='utf-8')+'\n</script>',1)
p=p.replace('    lensArrow(X(a),Y(a),X(b),Y(b),col,(k<8?2.8:1.5)+3*fresh);','    lensArrow(X(a),Y(a),X(b),Y(b),col,(k<8?2.8:1.5)+3*fresh);\n    if(selectedPrime && k%selectedPrime===0)lensArrow(X(a),Y(a),X(b),Y(b),factorColour(selectedPrime),5);')
p=p.replace("ctx.strokeStyle='#fff2c0';ctx.lineWidth=5", "ctx.strokeStyle=primeHighlight(selectedPrime);ctx.lineWidth=5").replace("dot(points[j].z,'#fff2c0',6", "dot(points[j].z,primeHighlight(selectedPrime),6")
p=p.replace('ctx.strokeStyle=factorColour(selectedPrime);ctx.lineWidth=4','ctx.strokeStyle=primeHighlight(selectedPrime);ctx.lineWidth=4')
p=p.replace('</style>',(root/'.review/euler-workspace.css').read_text(encoding='utf-8')+'\n</style>',1)
p=p.replace('</script>',(root/'.review/euler-workspace.js').read_text(encoding='utf-8')+'\n</script>',1)
p=p.replace('const b=e.currentTarget.getBoundingClientRect(),x=(e.clientX-b.left)*600/b.width','const b=graphPlotRect(e.currentTarget),x=(e.clientX-b.left)*600/b.width')
p=p.replace('Y(b),factorColour(selectedPrime),5','Y(b),primeHighlight(selectedPrime),5')
# The sum's links lose their arrow tips; the chain already shows its direction.
for call in ['lensArrow(X(a),Y(a),X(b),Y(b),"#0c1512",(k<8?7:4)+3*fresh)',
             'lensArrow(X(a),Y(a),X(b),Y(b),col,(k<8?2.8:1.5)+3*fresh)',
             'lensArrow(X(a),Y(a),X(b),Y(b),primeHighlight(selectedPrime),5)']:
 if call not in p: raise SystemExit('Missing sum link call: '+call)
 p=p.replace(call,call[:-1]+',false)')
p=p.replace('</style>',(root/'.review/complex-exploration.css').read_text(encoding='utf-8')+'\n</style>',1)
p=p.replace('</script>',(root/'.review/complex-exploration.js').read_text(encoding='utf-8')+'\n</script>',1)
p=p.replace('</style>',(root/'.review/zeta-locus.css').read_text(encoding='utf-8')+'\n</style>',1)
p=p.replace('</script>',(root/'.review/zeta-locus.js').read_text(encoding='utf-8')+'\n</script>',1)
# The zero heights come from a search against locusZeta, so the fragment follows
# the evaluator that defines it, and the staircase follows the heights.
p=p.replace('</script>',(root/'.review/psi-zeros.js').read_text(encoding='utf-8')+'\n</script>',1)
p=p.replace('</style>',(root/'.review/psi-staircase.css').read_text(encoding='utf-8')+'\n</style>',1)
p=p.replace('</script>',(root/'.review/psi-staircase.js').read_text(encoding='utf-8')+'\n</script>',1)
if '  powerPaneMix += ((powerPanesOn ? 1 : 0) - powerPaneMix) * ease;' not in p: raise SystemExit('Missing pane mix line')
p=p.replace('  powerPaneMix += ((powerPanesOn ? 1 : 0) - powerPaneMix) * ease;','  powerPaneMix += ((powerPanesOn ? 1 : 0) - powerPaneMix) * ease;\n  psiStairMix += ((psiStairAim ? 1 : 0) - psiStairMix) * ease;',1)
p=p.replace('</style>',(root/'.review/friendly-explorer.css').read_text(encoding='utf-8')+'\n</style>',1)
p=p.replace('</script>',(root/'.review/friendly-explorer.js').read_text(encoding='utf-8')+'\n</script>',1)
p=p.replace('SIGMA += (sigmaAim - SIGMA) * ease;', 'SIGMA += (sigmaAim - SIGMA) * (1-Math.exp(-dt*14));')
p=p.replace('TAUV += (tauAim - TAUV) * ease;', 'TAUV += (tauAim - TAUV) * (1-Math.exp(-dt*14));')
p=p.replace('</script>',(root/'.review/shifted-clock.js').read_text(encoding='utf-8')+'\n</script>',1)
p=p.replace('</style>',(root/'.review/riemann-views.css').read_text(encoding='utf-8')+'\n</style>',1)
p=p.replace('</script>', (root/'.build/clock-math.js').read_text(encoding='utf-8')+'\nconst {riemannGamma,riemannIntegrate}=ClockMath;\n</script>',1)
for name in ['riemann-views.js']:
 p=p.replace('</script>',(root/'.review'/name).read_text(encoding='utf-8')+'\n</script>',1)
p=p.replace("$('productRange').step='any';", "$('productRange').step='any';$('productRange').min=-14;")
# The typed workspace now owns presentation. Existing panels are docked into
# its inspector rather than participating in the browser's popover top layer.
p=p.replace(".matches(':popover-open')", ".matches('[data-open=\"true\"]')")
p=p.replace('</style>',(root/'src/ui/theme.css').read_text(encoding='utf-8')+'\n</style>',1)
p=p.replace('</script>',(root/'.review/workspace-bridge.js').read_text(encoding='utf-8')+'\n</script>',1)
f.write_text(p,encoding='utf-8')
