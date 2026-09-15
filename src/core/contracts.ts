/** Mathematical complex coordinates: real right, imaginary up. */
export type Complex = readonly [real: number, imaginary: number];
export interface ComplexInput { readonly sigma: number; readonly tau: number }

/** A glass pane contributes its base prime, not its prime-power label, to FTA. */
export interface PrimePowerSource {
  readonly kind: 'prime-power';
  readonly p: number;
  readonly k: number;
  readonly q: number;
}
export interface PrimePowerContribution {
  readonly id: string;
  readonly quantity: 'log-zeta';
  readonly source: PrimePowerSource;
  readonly ledgerWeight: number;
  readonly magnitude: number;
  readonly phase: number;
  readonly value: Complex;
}

export type IntegralMode = 'term' | 'finite' | 'infinite' | 'theta';
export interface IntegralJob extends ComplexInput {
  readonly mode: IntegralMode;
  readonly n: number;
}
export interface IntegralSuccess extends IntegralJob {
  readonly valid: true;
  /** Stride four: x, real, imaginary, accumulated path length. */
  readonly rows: Float64Array;
  readonly endpoint: Complex;
  readonly estimatedQuadratureError: number;
  /** Floating-point cancellation estimate, not an interval certificate. */
  readonly estimatedRoundoffError: number;
  /** Bound for integration cutoffs, not a certified total numerical error. */
  readonly omittedBound: number;
  readonly low: number;
  readonly high: number;
  readonly length: number;
  readonly steps: number;
}
export interface IntegralFailure { readonly valid: false; readonly reason: string }
export type IntegralResult = IntegralSuccess | IntegralFailure;
/** The current worker sends one complete result; key identifies its exact input. */
export interface IntegralRequest extends IntegralJob { readonly key: string }
export type IntegralResponse = IntegralResult & { readonly key: string };
