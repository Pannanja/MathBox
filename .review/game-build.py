from pathlib import Path
import os
import runpy
root=Path(__file__).resolve().parent.parent
page_output=Path(os.environ.get('CLOCK_HTML_OUTPUT',str(root / 'orrery-of-eratosthenes.html')))
if not (root/'.build/clock-math.js').exists():
 raise SystemExit('Missing TypeScript bundle. Run npm install, then npm run build.')
runpy.run_path(str(root/'.review/revise.py'))
p=page_output.read_text(encoding='utf-8')
p=p.replace('The Orrery of Eratosthenes · One beat, many primes','Clock of Primes')
p=p.replace('The Orrery of Eratosthenes','Clock of Primes').replace('One beat, many primes','One beat. One discovery.')
p=p.replace('white body','second hand').replace('white marker','second hand').replace('White marker','Second hand')
p=p.replace("g2.fillText('MEETING LINE',C,24)", "g2.fillText('MEETING RAY',C-40,24)")
p=p.replace('One lap of the white marker, one integer.','One lap of the second hand, one integer.')
p=p.replace('<button id="play" class="primary">Play</button><button id="stepBeat">One beat</button>', '<button id="previousBeat" aria-label="Back one beat">← One beat</button><button id="stepBeat" class="primary" aria-label="Forward one beat">One beat →</button><button id="play" class="quiet">Play</button>')
p=p.replace('↶ Rewind','↺ Start').replace('aria-label="Continuously rewind to one"','aria-label="Restart instantly at beat one"')
p=p.replace('<button id="sound" class="quiet" aria-pressed="false">Sound off</button>', '')
p=p.replace('<p id="clockDescription"', '<div id="paneRead"></div><div class="view-controls"><button id="reflect" aria-pressed="false">Reflect to complex plane</button><button id="sound" class="quiet" aria-pressed="false">Sound off</button><span id="orientationRead"></span></div><p id="clockDescription"')
css='''
.mast{padding-bottom:18px}.route{padding-top:18px}.route button[aria-current=step]{color:var(--brass);border-bottom:1px solid var(--brass)}.level-tray{display:flex;gap:8px;margin-bottom:18px}.level-tray button{width:39px;height:39px;padding:0;border-radius:50%;font:13px var(--mono)}.level-tray .selected{background:var(--brass);color:var(--plate);border-color:var(--brass)}.puzzle-choices{display:grid;gap:10px}.puzzle-choices button{text-align:left;min-height:48px}.puzzle-choices button[aria-pressed=true]{border-color:var(--brass);background:#e0bd7612;color:var(--brass)}.puzzle-instruction{font-size:13px!important;margin:16px 0!important}#puzzleFeedback{color:var(--patina);font-size:15px;min-height:54px;line-height:1.65}.story h1{font-size:clamp(32px,3.4vw,46px)}.story-nav{margin-top:16px}.transport{flex-wrap:wrap;gap:6px}.transport #play{min-width:0}#stepBeat{min-width:120px}.view-controls{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:10px}.view-controls button{font-size:11px;padding:6px 9px}#orientationRead{width:100%;text-align:center;color:var(--dim);font:10px/1.5 var(--mono)}#paneRead{color:var(--patina);font:11px/1.6 var(--mono);text-align:center;min-height:20px;margin-top:8px}.twin-strip{display:flex;gap:10px;margin:10px 0}.twin-strip button{flex:1;font:24px var(--serif);padding:12px 4px}.twin-strip small{display:block;color:var(--dim);font:12px var(--mono);margin-top:8px}.twin-strip .current{border-color:var(--brass);background:#e0bd7612}.twin-strip .current small{color:var(--brass)}#twinRead{color:var(--patina);font-size:14px}.story .interaction{padding-bottom:0}.frame{max-width:520px;margin-left:auto;margin-right:auto}.proof{max-width:520px;margin-left:auto;margin-right:auto}
@media(max-width:650px){.level-tray{order:-1;align-self:flex-start;margin:8px 0 0}.level-tray button{width:34px;height:34px}.route{gap:4px;flex-wrap:wrap}.route button{font-size:12px;padding:6px}.story h1{font-size:31px}.frame{max-width:300px}.transport button{font-size:12px;padding:8px}.transport #stepBeat{min-width:105px}.proof{width:100%}#orientationRead{font-size:9px}.view-controls{gap:4px}.view-controls button{font-size:10px}.story>.interaction{width:100%}.puzzle-instruction{margin:12px 0!important}}
'''
p=p.replace('</style>',css+'</style>',1)
css_tape='''
.instrument{position:relative}.proof{position:relative;z-index:3;pointer-events:none}.proof .work{height:80px;z-index:3;will-change:transform}.proof #tape{height:80px}.proof #strip{top:28px}.proof .rhs{overflow:visible;height:80px}.proof #factorWindow{height:80px;position:relative;overflow:visible;mask-image:none}.proof #pf{position:absolute;top:50%;left:0;width:100%;height:0;display:block;transform:none!important}.proof .fx{position:absolute;height:24px;max-width:none!important;overflow:visible;transform:translateY(-50%);font:12px/24px var(--mono);transition:none}.factor-ink,.term-ink{display:inline-block;white-space:nowrap;transform:rotate(var(--counter-turn,0deg)) scale(var(--ink-scale,1));transform-origin:center}.tt.dead .term-ink{text-decoration:line-through}.proof .eq,.proof .zeta-symbol{transform:rotate(var(--counter-turn,0deg))}.proof .eq{background:transparent}.proof .zeta-symbol{font-size:16px}.proof #tapeDomain{position:relative;z-index:4;background:var(--plate);padding:3px 0;margin-top:0}.product-dots{position:absolute;top:-12px;font:20px/24px var(--serif);color:var(--dim);transform:rotate(var(--counter-turn,0deg));transition:opacity .15s}.equation-thread{visibility:hidden}.tape-bridge{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:1}.proof .factor-hit{font-weight:600}.scale-note{color:var(--dim);font:11px/1.6 var(--mono);margin-top:14px}
@media(max-width:650px){.proof .fx{font-size:11px}.proof .zeta-symbol{font-size:14px}.proof #tapeDomain{font-size:9px}.proof .work{height:80px}.proof #tape{height:80px}}
.proof{pointer-events:auto}.proof .tt{top:0;height:24px;display:flex;align-items:center;justify-content:center}
'''
p=p.replace('</style>',css_tape+'</style>',1)
glass=(root/'.review/prime-glass.js').read_text(encoding='utf-8')
p=p.replace('function frame(ms) {',glass+'\nfunction frame(ms) {',1)
p=p.replace('  g2.clearRect(0, 0, W, W);','  g2.clearRect(0, 0, W, W);\n  beginReflection(dt);',1)
p=p.replace('  drawBeatLabels();','  drawBeatLabels();\n  endReflection();',1)
p=p.replace("tx.fillStyle = 'hsl(' + hueOf(ring.base || p).toFixed(1) + ', 100%, ' + (100 - 40 * kSp).toFixed(1) + '%)';", 'tx.fillStyle = paneColour(ring.base || p);')
p=p.replace("gl.drawImage(lightC, 0, 0);gl.globalCompositeOperation = 'multiply';\n    gl.drawImage(transC, 0, 0);gl.globalCompositeOperation = 'source-over';", "gl.drawImage(transC, 0, 0);gl.globalCompositeOperation = 'destination-in';\n    gl.drawImage(lightC, 0, 0);gl.globalCompositeOperation = 'source-over';")
a=p.index('    if (ring.echo) {',p.index("g2.strokeStyle = 'rgba(80,90,102,0.30)'"));b=p.index("    const col = 'hsl('",a)
p=p[:a]+'''    if (ring.echo) {
      if(glassMix<.001&&stairMix<.001)return;
      g2.save();g2.globalAlpha=Math.max(glassMix,stairMix);
      const sp=panelSpan(p,t),w=Math.max(.65,Math.min(1.7,r*Math.PI/p*.28));
      g2.strokeStyle='hsla('+hueOf(ring.base)+' 55% 60% / .25)';g2.lineWidth=1;g2.beginPath();g2.arc(C,C,r,0,7);g2.stroke();
      g2.fillStyle='hsl('+hueOf(ring.base)+' 68% 62%)';band(r-w,r+w,sp.c0-sp.w/2,sp.c0+sp.w/2);
      if(r>55&&!(glassMix>.5&&n%p===0)){g2.fillStyle='hsl('+hueOf(ring.base)+' 65% 76%)';drawPaneLabel(p,r,sp.c0+sp.w/2);}
      g2.restore();return;
    }
'''+p[b:]
# Fade between the bare sieve ray and the factor-reading glass ray.
a=p.index('  const juice = ');b=p.index('  if (riemann)',a)
chunk=p[a:b].replace('(1 - focusMix)', '(1 - focusMix) * (1 - glassMix)')
p=p[:a]+chunk+'  drawPrimeGlass(rad,n);\n'+p[b:]
p=p.replace('if (r > 70) {', 'if (r > 70 && !(glassMix > .5 && n % p === 0)) {')
p=p.replace('g2.arc(ux, uy, 6.5, 0, 7)', 'g2.arc(ux, uy, 9, 0, 7)')
p=p.replace("$('reset').addEventListener('click',()=>{cancelPrediction();moveClock(1);});", "$('reset').addEventListener('click',()=>instantStart());")
p=p.replace('function seekFrontier(value)',(root/'.review/puzzles.js').read_text(encoding='utf-8')+'\nfunction seekFrontier(value)',1)
p=p.replace('reset();\nchooseView(0);', 'reset();\nopenLesson(1,false);')
p=p.replace('A visual path from prime rhythms to the Riemann hypothesis.','Six beats to learn the clock. A lifetime to follow the primes.')
p=p.replace('Take your time. Every chapter can be revisited.','← / → step one beat · Space plays or pauses')
p=p.replace('An <b>orrery</b>', 'An <b>orrery</b>')
p=p.replace('The view zooms out as the count grows.', 'The view zooms out as the count grows. Each q = p^k has a full panel of width 2π/q in the same glass as p. At beat n, one pane is crossed for each prime-power divisor; the number of p-panes is the exponent of p. The scalar weight is the product of p^−σ across those panes. Displayed RGB colours encode the factor mixture, not calibrated physical luminance.')
p=p.replace('In the complex view, up is real and right is imaginary.', 'In clock orientation, up is real and right is imaginary. Reflection swaps these axes: right becomes real and up becomes imaginary; the second hand then moves counterclockwise. Labels remain upright. Reflection changes only the view, not the count or arithmetic.')
p=p.replace("const a=raw.points[k-1],b=raw.points[k],col=k===1?'#e9e2d0':'hsl('+hueOf(factorize(k)[0]||2)+' 55% 64%)';", "const a=raw.points[k-1],b=raw.points[k],col=factorColour(k);")
p=p.replace('The gold point uses Euler–Maclaurin with six correction terms.', 'The gold point uses Euler–Maclaurin with six correction terms. The arrow chain uses a separate fixed display scale while the clock’s radii shrink as p/count. Shared timing and factor colours link these views; a common geometric scale has not yet been constructed.')
page_output.write_text(p,encoding='utf-8')
runpy.run_path(str(root/'.review/integrate-story.py'))
runpy.run_path(str(root/'.review/viewport-build.py'))
