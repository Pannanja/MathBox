/** Inverse radial sampling: 8% central enlargement, fading smoothly to zero
 * displacement at the rim. Shared with the SVG displacement-map generator. */
export function lensSample(x: number, y: number) {
  const gain = 0.08 * Math.max(0, 1 - x * x - y * y);
  return { x: x * (1 - gain), y: y * (1 - gain) };
}
/** Forward projection for containment checks; the radial map is monotone. */
export function lensRadiusAfterGlass(radius: number) {
  let lo = 0,
    hi = 1;
  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2;
    if (lensSample(mid, 0).x < radius) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
export function lensDisplacementMap() {
  const canvas = document.createElement('canvas');
  const size = 256;
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d')!;
  const pixels = context.createImageData(size, size);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const u = (2 * (x + 0.5)) / size - 1,
        v = (2 * (y + 0.5)) / size - 1;
      const sample = lensSample(u, v),
        i = (y * size + x) * 4;
      // feDisplacementMap scale is .16 times the aperture radius.
      pixels.data[i] = Math.round(255 * (0.5 + (sample.x - u) / 0.16));
      pixels.data[i + 1] = Math.round(255 * (0.5 + (sample.y - v) / 0.16));
      pixels.data[i + 2] = 128;
      pixels.data[i + 3] = 255;
    }
  context.putImageData(pixels, 0, 0);
  return canvas.toDataURL();
}

/** Closest available resting place to psi. Reserve the permanent control rail,
 * winding and attached toolbar, without ever changing the clock's layout. */
export function lensRestingPlace(
  target: { x: number; y: number },
  radius: number,
  width: number,
  height: number,
  railHeight: number,
) {
  const portrait = width <= 600 && height > 500;
  const short = height <= 500;
  const toolbar = portrait ? 76 : 42;
  const rail = short
    ? { x: 56, y: 0, w: Math.min(574, width - 56), h: 8 + railHeight }
    : { x: 0, y: 0, w: portrait ? 204 : 196, h: (portrait ? 58 : 66) + railHeight };
  const obstacles = [rail, { x: 0, y: height - 96, w: 296, h: 96 }, { x: 0, y: 0, w: 64, h: 112 }];
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const bound = (p: { x: number; y: number }) => ({
    x: clamp(p.x, radius + 12, width - radius - 12),
    y: clamp(p.y, radius + 12, height - radius - toolbar),
  });
  const candidates = [target];
  for (const box of obstacles)
    candidates.push(
      { x: box.x - radius - 12, y: target.y },
      { x: box.x + box.w + radius + 12, y: target.y },
      { x: target.x, y: box.y - radius - toolbar },
      { x: target.x, y: box.y + box.h + radius + 12 },
    );
  function score(p: { x: number; y: number }) {
    let penalty = 0;
    for (const box of obstacles) {
      const overlapX = Math.max(
        0,
        Math.min(p.x + radius + 8, box.x + box.w) - Math.max(p.x - radius - 8, box.x),
      );
      const overlapY = Math.max(
        0,
        Math.min(p.y + radius + toolbar, box.y + box.h) - Math.max(p.y - radius - 8, box.y),
      );
      penalty += overlapX * overlapY * 100;
    }
    return penalty + Math.hypot(p.x - target.x, p.y - target.y);
  }
  return candidates.map(bound).sort((a, b) => score(a) - score(b))[0];
}
