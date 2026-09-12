from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
p=(root/'.review/first-pass.html').read_text(encoding='utf-8')
def section(text,start,end,replacement):
    a=text.index(start);b=text.index(end,a)
    return text[:a]+replacement+'\n'+text[b:]

# Restore the continuous equation directly over the meeting line, at all stages.
p=re.sub(r'   <details><summary>Euler’s sieve tape</summary>.*?</details>', '', p, count=1)
live='''<div class="proof" id="originalProof" aria-label="Live Euler sieve: terms enter the equals sign on each beat">
    <div class="work"><span id="tape"><span id="strip"></span></span><span class="eq" id="equals">=</span><span class="rhs"><span id="factorWindow"><span id="pf"></span></span><span class="zeta-symbol">ζ(s)</span></span></div>
    <div id="tapeDomain"></div><div class="equation-thread" aria-hidden="true"></div>
   </div>'''
p=p.replace('   <div class="frame">', '   '+live+'\n   <div class="frame">',1)
css='''
/* The equation and clock share a center line and a single continuous time. */
.proof{position:relative;width:100%;margin:10px 0 0}.proof .work{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 30px minmax(0,1fr);gap:0;height:40px;align-items:center;font:14px var(--mono);margin:0}.proof #tape{height:40px;overflow:hidden;width:calc(100% + 15px);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 90%,transparent)}.proof #strip{top:8px}.proof .tt{text-align:center;white-space:nowrap;line-height:24px}.proof .eq{position:relative;text-align:center;z-index:1;font:25px var(--serif);background:var(--plate)}.proof .rhs{display:flex;align-items:center;gap:5px;min-width:0;overflow:hidden}.proof #factorWindow{overflow:hidden;min-width:0;flex:1;mask-image:linear-gradient(90deg,transparent,#000 8%)}.proof #pf{display:flex;white-space:nowrap;width:max-content;will-change:transform}.proof .fx{display:inline-block;overflow:hidden;white-space:nowrap;flex-shrink:0}.proof .factor-hit{text-shadow:0 0 8px currentColor}.proof .zeta-symbol{font:18px var(--serif);flex-shrink:0}.proof #tapeDomain{font:10px/1.5 var(--mono);color:var(--dim);text-align:center;min-height:30px;margin-top:3px}.equation-thread{width:1px;height:15px;background:#e0453c66;margin:0 auto}.canvas-tag{top:1%}.frame{margin-top:0}.product-equality{font-size:20px;color:var(--brass);line-height:1.7;margin:14px 0}.transport button:disabled{opacity:.45}#motionRead{color:var(--patina);font:11px/1.5 var(--mono);min-height:20px;text-align:center;margin:6px 0}.guide-hint{font-size:12px!important}.drawer-grid{grid-template-columns:1fr}.experimental-controls{display:none}.story-nav{margin-top:16px}.feedback{min-height:36px}.scrubber{margin-top:8px}
@media(max-width:650px){.proof .work{font-size:11px;grid-template-columns:minmax(0,1fr) 24px minmax(0,1fr)}.proof #tape{width:calc(100% + 12px)}.proof #tapeDomain{font-size:9px;min-height:28px}.proof .zeta-symbol{font-size:15px}.instrument{scroll-margin-top:8px}.equation-thread{height:8px}.frame{max-width:330px}.proof{margin-top:8px}.experience{gap:10px}}
'''
p=p.replace('</style>',css+'\n</style>',1)
p=p.replace('   <div class="scrubber">','   <div id="motionRead" aria-live="off"></div>\n   <div class="scrubber">',1)
p=p.replace('↺ Restart','↶ Rewind')
p=p.replace('<span id="now">3</span><span id="fac">prime</span>', '<span id="now">1</span><span id="fac"></span>')
p=p.replace('value="3.35"', 'value="1"')
p=p.replace('aria-label="Restart the count at one"','aria-label="Continuously rewind to one"')
p=p.replace('Counting time; drag to pause and inspect','Target counting time; the clock moves continuously to this value')
p=p.replace('Open the instrument · extra controls','Pace, sound &amp; counting destination')
p=p.replace('<div><h2>Combine visual layers</h2>','<div class="experimental-controls" hidden><h2>Combine visual layers</h2>')
p=p.replace('<div class="transportRow"><button id="markA">','<div class="transportRow" hidden><button id="markA">')
p=p.replace('<p id="loopMessage">','<p id="loopMessage" hidden>')
p=p.replace('<h2>Inspect &amp; repeat</h2>','<h2>Travel through the count</h2><p>The clock passes through every intervening beat. Retarget it at any time, or pause to hold the current position.</p>')
p=p.replace('The product chapter uses unique factorization: choosing a power from each prime’s geometric series produces each positive integer exactly once.', 'The product chapter follows Euler’s sieve: each factor (1 − p⁻ˢ) removes the surviving multiples of p from the series. The tape’s right side is the product of those factors times ζ(s). The panel for p still occupies its original 1/p slot; no repeated-factor construction is asserted by this chapter.')
p=p.replace('The sum and Euler product converge absolutely for Re(s) &gt; 1.', 'The ordinary sum and Euler product converge absolutely for Re(s) &gt; 1. In the critical strip the tape shows finite terms only, not a convergent infinite equality.')
p=p.replace(' The decorative sieve-density spiral in the drawer is a different product, ∏(1 − 1/p), measured over a complete residue cycle.', '')

p=section(p,'const PR = (function () {',"const g2 = $('cv')",(root/'.review/live-tape.js').read_text(encoding='utf-8'))
p=section(p,'  if (window.__run) {\n    t +=', '  const n = Math.floor(t), fr = t - n;', '  updateClock(dt, ms);')
p=p.replace('Math.min((ms - lastFrame) / 1000, 0.1)','Math.min((ms - lastFrame) / 1000, 0.05)')
p=section(p,"$('play').addEventListener('click'", "$('logr').addEventListener", '''$('play').addEventListener('click', () => {
 cancelPrediction();
 const moving=window.__run||clockTween!==null;
 clockTween=null;stopAt=null;window.__run=!moving&&t<limit;
 if(soundOn&&window.__run)unlock();
 $('play').textContent=window.__run?'Pause':'Play';
});
$('reset').addEventListener('click',()=>{cancelPrediction();moveClock(1);});''')
p=section(p,'// A focused story controls the lenses;', 'function seekFrontier(', (root/'.review/continuous-clock.js').read_text(encoding='utf-8')+'\n'+(root/'.review/story-v2.js').read_text(encoding='utf-8'))
p=section(p,'function seekFrontier(', 'function readLoop(){', 'function seekFrontier(value){ cancelPrediction();moveClock(value); }')
p=p.replace('seekFrontier(3.35);','')
p=p.replace("    tip:'How strongly each lens filters. Drives both the sky and the colour the number wears. Only used with coloured glass.'", "    tip:'How strongly each lens filters. Drives both the sky and the colour the number wears. Only used with coloured glass.'")
p=p.replace('    host.appendChild(wrap);', "    if(c.id==='spread'||c.id==='octaves')wrap.hidden=true;\n    host.appendChild(wrap);")
# Coherent fades for analytic overlays: the ledger remains drawn until its fade
# finishes, rather than disappearing as soon as its target boolean changes.
p=p.replace('if (stairOn && t > 1)', 'if (stairMix > .001 && t > 1)')
p=p.replace('if (stairMix > .005 && t > 1.05)', 'if (stairMix > .005 && t > 1.000001)')
p=p.replace('g2.save(); g2.globalAlpha = stairMix;', 'g2.save(); g2.globalAlpha = stairMix * Math.min(1, (t - 1) / .35);')
p=p.replace("v = Math.min(c.max, Math.max(c.min, +v));", "v = Number(v);if(!Number.isFinite(v))return;v = Math.min(c.max, Math.max(c.min, v));")
(root/'orrery-of-eratosthenes.html').write_text(p,encoding='utf-8')
