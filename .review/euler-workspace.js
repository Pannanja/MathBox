// Keep input, scale and output in one persistent instrument beside the clock.
function graphPlotRect(canvas){const b=canvas.getBoundingClientRect(),width=Math.min(b.width,b.height*2),height=width/2;return {left:b.left+(b.width-width)/2,top:b.top+(b.height-height)/2,width,height};}
$('productBubble').classList.add('euler-workspace');
const controls=document.createElement('div');controls.id='eulerInputs';controls.append(complexInput,$('zeroShortcut'));$('productGraph').after(controls);
$('productBubble').querySelector('.bubble-head b').textContent='Euler · input and complex paths';
const mechanics=document.createElement('p');mechanics.id='sectorMeasure';mechanics.textContent='Hover a prime arc or product point to measure its complementary sector. Click to pin.';$('productStatus').after(mechanics);
document.querySelector('[popovertarget="tuneBubble"]').textContent='Pace & count';
$('tuneBubble').querySelector('.bubble-head b').textContent='Pace & count';
$('productBubble').showPopover();
const workspaceGuide=updateGuide;
updateGuide=function(){workspaceGuide();
 if(!selectedPrime){mechanics.textContent='Hover a prime arc or product point to measure its complementary sector. Click to pin.';return;}
 const p=selectedPrime,span=panelSpan(p,t),fraction=1-span.w/(2*Math.PI),z=sub([1,0],power(p,SIGMA,TAUV));
 mechanics.textContent='p = '+p+(pinnedPrime===p?' · pinned':' · preview')+' · sector remainder '+(fraction*100).toFixed(2)+'%'+(t<p?' (not born)':t<p+1?' (growing)':' = 1 − 1/'+p)+'. Weighted 1 − '+p+'⁻ˢ = '+complexText(z)+'. '+(t>=p+1&&Math.abs(SIGMA-1)<1e-5&&Math.abs(TAUV)<1e-5?'Equal at s = 1.':'Area and weight differ.');
};
