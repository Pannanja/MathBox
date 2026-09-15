import { riemannIntegrate } from '../math/riemann';
import type { IntegralRequest, IntegralResponse } from '../core/contracts';

onmessage=(event: MessageEvent<IntegralRequest>)=>{
  const result=riemannIntegrate(event.data);
  const response: IntegralResponse={...result,key:event.data.key};
  postMessage(response,{transfer:result.valid?[result.rows.buffer]:[]});
};
