export type ExplorerMode='euler'|'log'|'xiarm'|'term'|'finite'|'infinite'|'theta';
export function viewDomain(mode: ExplorerMode){
  return {
    tauLimit:mode==='theta'?35:['term','finite','infinite','xiarm'].includes(mode)?15:1000,
    sigmaBoundary:['euler','log','infinite'].includes(mode)?1:null,
    boundaryKind:mode==='infinite'?'diverges':['euler','log'].includes(mode)?'finite only':'none',
    sigmaMin:.2,sigmaMax:3
  } as const;
}
