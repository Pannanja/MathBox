/** Vector paths live in model-local coordinates; neither themes nor cameras
 * can alter their mathematical radii. Teeth are decorative, not gear ratios.
 * Rotate the contour in geometry so the material lighting does not rotate. */
export function cogPath(radius: number, teeth = 20, phase = 0): string {
  let path = '';
  for (let i = 0; i < teeth; i++) {
    for (const [fraction, depth] of [
      [0, 0.975],
      [0.22, 0.975],
      [0.22, 1],
      [0.7, 1],
      [0.7, 0.975],
      [1, 0.975],
    ]) {
      const a = (2 * Math.PI * (i + fraction)) / teeth + phase;
      path += `${path ? 'L' : 'M'}${(radius * depth * Math.cos(a)).toFixed(4)},${(radius * depth * Math.sin(a)).toFixed(4)}`;
    }
  }
  return path + 'Z';
}
/** Open annular arc. Positive angles turn counterclockwise in complex space. */
export function panePath(radius: number, angle: number, width: number): string {
  const a = angle - width;
  return `M${radius * Math.cos(a)},${-radius * Math.sin(a)} A${radius},${radius} 0 ${width > Math.PI ? 1 : 0} 0 ${radius * Math.cos(angle)},${-radius * Math.sin(angle)}`;
}
export function pointPath(points: readonly (readonly number[])[], scale: number): string {
  let path = '',
    pen = false;
  for (const point of points) {
    if (!point.every(Number.isFinite)) {
      pen = false;
      continue;
    }
    path += `${pen ? 'L' : 'M'}${(point[0] * scale).toFixed(3)},${(-point[1] * scale).toFixed(3)}`;
    pen = true;
  }
  return path;
}

/** One tooth profile and edge hierarchy for both mechanisms. */
export const gearTeeth = (radius: number) => (radius > 12 ? 48 : radius > 2 ? 24 : 12);
export const gearEdge = (radius: number) => Math.min(0.18, radius * 0.025);
