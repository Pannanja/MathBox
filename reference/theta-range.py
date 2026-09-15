"""Independent 70-digit fixtures for the extended theta integral window."""
import json
from pathlib import Path
import mpmath as mp

mp.mp.dps = 70
cases = []
for sigma in [.2, .3, .5, .7, 1, 2, 3]:
    for tau in [-35, -30, -20, 16, 20, 21.022039638771555,
                25.01085758014569, 30, 32.93506158773919, 35]:
        s = mp.mpc(sigma, tau)
        z = s*(s-1)*mp.gamma(s/2)*mp.pi**(-s/2)*mp.zeta(s)/2
        cases.append(dict(mode='theta', sigma=sigma, tau=tau, n=1,
                          target=[float(z.real), float(z.imag)]))
Path('reference/theta-range.json').write_text(json.dumps(cases, indent=2), encoding='utf-8')
print(f'{len(cases)} extended theta reference cases')
