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
  // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'right'
  // Only the starting place: the glass can be dragged anywhere on the surface,
  // and a drag overrides this until the page is reloaded.
  corner: 'top-left',

  // Float the glass over the dial instead of reserving a column for it. False
  // restores the old behaviour, where the clock shrank to make room.
  overlap: true,

  // Largest the glass may get, in px. It still shrinks to fit small screens.
  maxWidth: 330
 },

 psiMechanism: {
  // Where the epicycle axle hangs above the meeting axis.
  //   'arm'   - at the length of the longest single arm, the first zero's, so
  //             THAT arm at full extension just passes through the real axis.
  //             Measured at x = 90: the longest arm is 1.3 psi units while the
  //             chain swings 2.8, so the chain does cross the axis -- which is
  //             what passing through means. Raise `lift`, or use 'auto', if
  //             you want it to clear instead.
  //   'reach' - at the whole chain stretched straight, every leg summed. The
  //             literal full extension, but the arms nearly always cancel and
  //             never all line up, so the axle floats far above anything that
  //             happens: 38 psi units at x = 90 with every searched height.
  //   'fixed' - a constant psi height, whatever x does
  //   'sqrt'  - `lift` * sqrt(x), keeping pace with a chain of that order
  //   'auto'  - just clear the chain's own spread; the height then jumps about
  //             as zeros arrive, which is what a fixed metric is meant to fix
  // `lift` multiplies the chosen metric: 1 grazes the axis, less than 1 lets
  // the arm cross it, more than 1 keeps it clear.
  liftMode: 'arm',
  lift: 1,

  // How far back along x the tip's path is traced, and at how many samples.
  traceSpan: .7,
  traceSteps: 140
 },

 // The two pens: the path the epicycle tips have drawn across the dial.
 psiRecord: {
  // How many samples of the path are kept. When it fills, every other sample
  // is dropped, so the trail still spans the whole history at half the
  // resolution rather than losing its beginning. Costs 5 floats each.
  cap: 8000,

  // Most samples one frame may walk before the trail gives up and starts a
  // fresh sheet. A jump larger than this cannot be written honestly.
  budget: 2000,

  // Teal: every searched zero. Orange: the zeros tau had passed at the moment
  // that stretch was drawn. The gap between them is what climbing the critical
  // strip has yet to buy.
  inkFull: '#7fd3c0',
  inkPassed: '#f3aa77',

  // One turn per unit of psi means successive turns are only radius/count
  // apart, a few pixels once the clock is past fifty. Thin and faint, or the
  // record closes over the dial it is written on.
  width: .6,
  alphaFull: .17,
  alphaPassed: .42,

  // Turns of the disk per unit of psi. The stylus stays on the meeting ray and
  // the face rotates beneath it, so this sets how tightly the record coils.
  // Successive turns end up radius/count apart, so higher values crowd fast.
  turnsPerUnit: 1
 }
};
