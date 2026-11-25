import heights from './zero-heights.json';
/** Precomputed using the original page's Hardy-Z scan and Euler–Maclaurin
 * evaluator. Positive critical-line roots through height 1000; see scripts/. */
export const zeroHeights: readonly number[] = heights;
