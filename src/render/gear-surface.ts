import { cogPath } from './geometry';
import { metals } from './materials';
import type { psiGearWheels } from './psi-gears';

/** A single oversampled surface avoids thousands of changing SVG shadow nodes.
 * Every wheel is still painted, in order, with the same contour and metals as ζ.
 * The source and magnifier reference this identical surface. */
export function createGearSurface() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const shapes = new Map([12, 24, 48].map((n) => [`#cog-${n}`, new Path2D(cogPath(1, n))]));
  return (layers: ReturnType<typeof psiGearWheels>, detail: number, simplifyDetail = false) => {
    const wheels = layers.flatMap((layer) => layer.wheels);
    const x = Math.min(0, ...wheels.map((w) => w.x - w.r)) - 0.4;
    const y = Math.min(0, ...wheels.map((w) => w.y - w.r)) - 0.4;
    const width = Math.max(0, ...wheels.map((w) => w.x + w.r)) + 0.4 - x;
    const height = Math.max(0, ...wheels.map((w) => w.y + w.r)) + 0.4 - y;
    const resolution = Math.min(
      2048 / Math.max(width, height),
      Math.max(detail * 2, 256 / Math.max(width, height)),
    );
    canvas.width = Math.ceil(width * resolution);
    canvas.height = Math.ceil(height * resolution);
    ctx.setTransform(resolution, 0, 0, resolution, -x * resolution, -y * resolution);
    ctx.lineJoin = 'round';
    layers.forEach((layer, i) => {
      for (const w of layer.wheels) {
        const metal = i ? metals.steel : metals.brass;
        const face = (radius: number, shape: string, edge: number) => {
          // The tooth relief is 2.5% of the radius. Under half a display pixel
          // an opaque disc retains the silhouette and the wheel's depth order.
          if (simplifyDetail && radius * detail < 2) {
            ctx.beginPath();
            ctx.arc(w.x, w.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = metal[1][1];
            ctx.fill();
            return;
          }
          ctx.save();
          ctx.translate(w.x, w.y);
          // Construct the lighting before the contour turns.
          const gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
          for (const [stop, color] of metal) gradient.addColorStop(stop, color);
          ctx.rotate((w.phase * Math.PI) / 180);
          ctx.scale(radius, radius);
          ctx.fillStyle = gradient;
          ctx.strokeStyle = '#302b23';
          ctx.lineWidth = edge / radius;
          const rounded = simplifyDetail && radius * detail * 0.025 < 0.5;
          if (rounded) {
            ctx.beginPath();
            ctx.arc(0, 0, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.fill(shapes.get(shape)!);
            ctx.stroke(shapes.get(shape)!);
          }
          ctx.restore();
        };
        face(w.r, w.shape, w.edge);
        if (w.pinion > 0.004 && (!simplifyDetail || w.pinion * detail >= 0.5))
          face(w.pinion, w.pinionShape, w.edge * 0.65);
        if (simplifyDetail && w.axle * detail < 0.5) continue;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.axle, 0, Math.PI * 2);
        ctx.fillStyle = '#252b29';
        ctx.fill();
        ctx.strokeStyle = '#b4a582';
        ctx.lineWidth = w.edge * 0.5;
        ctx.stroke();
      }
    });
    return {
      x,
      y,
      width,
      height,
      href: canvas.toDataURL(),
      pixels: Math.max(canvas.width, canvas.height),
    };
  };
}
