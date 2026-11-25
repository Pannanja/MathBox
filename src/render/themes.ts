import type { Theme } from '../core/state';
export interface ThemePalette {
  forward: string;
  reverse: string;
  family: (p: number) => string;
}
export const themes: Record<Theme, ThemePalette> = {
  analytic: {
    forward: '#8dd7e8',
    reverse: '#d8a1dc',
    family: (p) => `hsl(${(Math.log2(p) * 137.508 + 92) % 360} 58% 69%)`,
  },
  clockwork: {
    forward: '#c2d6d0',
    reverse: '#e9c47d',
    family: (p) => `hsl(${(Math.log2(p) % 1) * 270 + 30} 32% 67%)`,
  },
  expanse: {
    forward: '#a9c5ff',
    reverse: '#e0a7cf',
    family: (p) => `hsl(${(Math.log2(p) % 1) * 280 + 90} 65% 75%)`,
  },
};
