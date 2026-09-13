import json, random
import mpmath as mp
mp.mp.dps=40
random.seed(12)
pairs=[(s,t) for s in [.2,.5,1,2,3] for t in [0,14.134725141734695,35,100,500,1000,-999.8] if (s,t)!=(1,0)]
pairs += [(random.uniform(.2,3),random.uniform(-1000,1000)) for _ in range(30)]
pairs += [(1.000001,0),(.999999,.000001)]
rows=[]
for s,t in pairs:
 z=mp.zeta(mp.mpc(s,t));rows.append([s,t,float(z.real),float(z.imag)])
open('.review/zeta-reference.json','w').write(json.dumps(rows))
