import type { SolvedArm } from '../core/mechanism';
import { gearTeeth, gearEdge } from './geometry';

export function complementaryRadius(radius: number, nextRadius: number) {
  return Math.max(0, radius - nextRadius);
}
/** Paint complete wheels in depth order. A compound path cannot occlude its own
 * interior outlines: each wheel must cover the preceding wheel's details. */
export function psiGearWheels(arms: SolvedArm[], scale: number, reached: number) {
  const layers = [
    { wheels: [] as ReturnType<typeof wheel>[] },
    { wheels: [] as ReturnType<typeof wheel>[] },
  ];
  arms.forEach((arm, i) => {
    layers[i < reached ? 0 : 1].wheels.push(wheel(arm, arms[i + 1], scale, i));
  });
  return layers;
}
function wheel(arm: SolvedArm, next: SolvedArm | undefined, scale: number, id: number) {
  const r = arm.length * scale;
  const pinion = next ? complementaryRadius(r, next.length * scale) : 0;
  return {
    id,
    x: arm.start[0] * scale,
    y: -arm.start[1] * scale,
    r,
    shape: `#cog-${gearTeeth(r)}`,
    phase: (-arm.phase * 180) / Math.PI,
    pinion,
    pinionShape: `#cog-${gearTeeth(pinion)}`,
    axle: Math.min(0.32, r * 0.12),
    edge: gearEdge(r),
  };
}
