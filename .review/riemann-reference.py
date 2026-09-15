"""Independent 60-digit fixtures; no browser evaluator or quadrature is reused."""
import json
from pathlib import Path
import mpmath as mp

mp.mp.dps = 60
def pair(z):
    return [float(mp.re(z)), float(mp.im(z))]
cases = []
for sigma, tau in [(s,t) for s in [.2,.5,1,1.2,2,3] for t in [0,1,5,14,15]] + [(1.01,1),(.3,3),(.7,-3),(.5,14.134725141734695)]:
    s = mp.mpc(sigma,tau)
    for mode in ['term','finite','infinite','theta']:
        if mode == 'infinite' and sigma <= 1:
            continue
        for n in ([1,2,12,500] if mode in ['term','finite'] else [1]):
            if mode == 'term':
                target = mp.gamma(s)*mp.power(n,-s)
            elif mode == 'finite':
                target = mp.gamma(s)*mp.fsum(mp.power(k,-s) for k in range(1,n+1))
            elif mode == 'infinite':
                target = mp.gamma(s)*mp.zeta(s)
            else:
                target = mp.mpf('.5') if s == 1 else s*(s-1)*mp.gamma(s/2)*mp.power(mp.pi,-s/2)*mp.zeta(s)/2
            cases.append(dict(mode=mode,sigma=sigma,tau=tau,n=n,target=pair(target),gamma=pair(mp.gamma(s))))
Path('.review/riemann-reference.json').write_text(json.dumps(cases,indent=2),encoding='utf-8')
print(f'{len(cases)} independent reference cases')
