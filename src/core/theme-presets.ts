import type { ExhibitState, Theme } from './state';
export interface ThemePreset {
  id: string;
  title: string;
  theme: Theme;
  patch: Partial<ExhibitState>;
}
/** Presentation only: presets never seek, change coupling, or move the origin. */
export const themePresets: ThemePreset[] = [
  {
    id: 'clockwork-all',
    title: 'All systems',
    theme: 'clockwork',
    patch: {
      layers: 255,
      psiLens: true,
      focus: 'zeta',
      mode: 'zeta',
      referenceCurve: false,
      trail: true,
    },
  },
  {
    id: 'clockwork-primes',
    title: 'Prime sieve',
    theme: 'clockwork',
    patch: {
      layers: 3,
      psiLens: false,
      focus: 'sieve',
      mode: 'zeta',
      referenceCurve: false,
      trail: false,
    },
  },
  {
    id: 'clockwork-psi',
    title: 'Explicit formula',
    theme: 'clockwork',
    patch: {
      layers: 1 | 2 | 16 | 32 | 128,
      psiLens: true,
      focus: 'psi',
      mode: 'zeta',
      referenceCurve: false,
      trail: false,
    },
  },
  {
    id: 'expanse-all',
    title: 'All systems',
    theme: 'expanse',
    patch: {
      layers: 255,
      psiLens: true,
      focus: 'zeta',
      mode: 'zeta',
      referenceCurve: false,
      trail: true,
    },
  },
  {
    id: 'expanse-primes',
    title: 'Prime galaxy',
    theme: 'expanse',
    patch: {
      layers: 3,
      psiLens: false,
      focus: 'sieve',
      mode: 'zeta',
      referenceCurve: false,
      trail: false,
    },
  },
  {
    id: 'expanse-zeta',
    title: 'Zeta orbits',
    theme: 'expanse',
    patch: {
      layers: 4 | 8,
      psiLens: false,
      focus: 'zeta',
      mode: 'zeta',
      referenceCurve: false,
      trail: true,
    },
  },
];
export function applyThemePreset(state: ExhibitState, preset: ThemePreset): ExhibitState {
  return { ...state, ...preset.patch, theme: preset.theme };
}
