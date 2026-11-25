import type { Focus } from './state';
/** Bits without a short label follow their group's master switch only. */
export const layers = [
  { bit: 1, group: 'sieve', label: 'Prime panes' },
  { bit: 2, group: 'sieve', label: 'Prime labels', short: 'Labels' },
  { bit: 64, group: 'sieve', label: 'Prime powers', short: 'Powers' },
  { bit: 4, group: 'zeta', label: 'Zeta sum', short: 'Sum' },
  { bit: 8, group: 'zeta', label: 'Zeta value' },
  { bit: 16, group: 'psi', label: 'Psi sum', short: 'Sum' },
  { bit: 32, group: 'psi', label: 'Psi record', short: 'Record' },
] as const;
export const groupMask = (group: Focus) =>
  layers.filter((l) => l.group === group).reduce((mask, l) => mask | l.bit, 0);

export const systems: { id: Focus; name: string; description: string }[] = [
  { id: 'sieve', name: 'Eratosthenes', description: 'Sieve' },
  { id: 'zeta', name: 'Euler', description: 'ζ sum' },
  { id: 'psi', name: 'Riemann', description: 'ψ formula' },
];
