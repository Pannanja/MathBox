// Clock of Primes - default settings.
//
// Edit this file and run `npm run build`. Every value here is a DEFAULT: the
// page's own controls still override it at runtime, and nothing here is saved
// back. It is deliberately a plain object with no logic, so it stays readable.
//
// `var`, not `const`: this fragment is concatenated ahead of every other one,
// and a var binding is reachable from the console as CLOCK_CONFIG while a
// const at this position is not.
var CLOCK_CONFIG = {

 psiLens: {
  // Starting magnification. The glass now frames the mechanism's own reach, so
  // 1 means "fit what is there" rather than "no magnification".
  zoom: 1,

  // Which quadrant of the clock surface the glass sits in:
  // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'right'
  corner: 'top-right',

  // Float the glass over the dial instead of reserving a column for it. False
  // restores the old behaviour, where the clock shrank to make room.
  overlap: true,

  // Largest the glass may get, in px. It still shrinks to fit small screens.
  maxWidth: 330
 },

 psiMechanism: {
  // Height of the epicycle chain above the meeting axis.
  //   'fixed' - height is `lift`, in psi units, whatever x does
  //   'sqrt'  - height is `lift` * sqrt(x), so it keeps pace with the chain,
  //             whose own size is order sqrt(x)
  //   'auto'  - just clear the chain's own spread; the height then jumps about
  //             as zeros arrive, which is what a fixed metric is meant to fix
  // 0.5 puts the chain a little above its own spread at the counts tau reaches
  // in normal play; larger values push it clear but shrink the mechanism, since
  // the glass frames whatever the chain occupies.
  liftMode: 'sqrt',
  lift: .5,

  // How far back along x the tip's path is traced, and at how many samples.
  traceSpan: .7,
  traceSteps: 140
 },

 psiRecord: {
  // Width of one bin of the pawl's paper, in psi units. Smaller resolves the
  // treads more finely and costs memory: the array spans psi up to `maxPsi`.
  binWidth: .02,
  maxPsi: 5400,

  // Most samples one frame may walk before the record gives up and starts a
  // fresh sheet. A jump larger than this cannot be written honestly.
  budget: 3000,

  // Ink of the groove written on the dial.
  ink: '#c9a55c'
 }
};
