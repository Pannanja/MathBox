/** The only bridge from the legacy classic script into the new module graph. */
import IntegralWorker from './workers/integral.worker?worker&inline';
export { riemannGamma, riemannIntegrate } from './math/riemann';
export { paneAt } from './core/clock';
export { logEuler, primePowersThrough } from './math/log-euler';
export { logArmAt } from './math/log-arm';
export { layoutArm, foldArm } from './render/arm';
export { LogArmScene } from './scenes/log-arm';
export { xiArm } from './math/xi-arm';
export { XiArmScene } from './scenes/xi-arm';
export { drawComplexPlane } from './render/complex-plane';
export { viewDomain } from './core/view-domains';
export function createIntegralWorker(): Worker { return new IntegralWorker(); }
