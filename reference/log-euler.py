"""Independent high-precision reference sums; run from the project root."""
import json
from pathlib import Path
import mpmath as mp

mp.mp.dps=60
def pair(z): return [float(mp.re(z)),float(mp.im(z))]
cases=[]
for limit in [1,4,9,12,100,500]:
    # Trial division here is independent of the browser's sieve.
    primes=[p for p in range(2,limit+1) if all(p%d for d in range(2,int(p**.5)+1))]
    for sigma,tau in [(2,0),(2,1),(.5,14),(.5,-14)]:
        s=mp.mpc(sigma,tau)
        terms=[]
        for p in primes:
            q,k=p,1
            while q<=limit:
                terms.append(mp.power(q,-s)/k)
                q*=p
                k+=1
        exact=mp.fsum(terms)
        log_product=mp.fsum(-mp.log(1-mp.power(p,-s)) for p in primes)
        cases.append(dict(limit=limit,sigma=sigma,tau=tau,endpoint=pair(exact),logProduct=pair(log_product)))
Path('reference/log-euler.json').write_text(json.dumps(cases,indent=2),encoding='utf-8')
print(f'{len(cases)} log-Euler fixtures at 60-digit precision')
