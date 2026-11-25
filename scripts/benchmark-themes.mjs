import { chromium } from '@playwright/test';
import { preview } from 'vite';

// Run after npm run build, with other browser workloads stopped.
const server = await preview({ preview: { host: '127.0.0.1', port: 0 } });
try {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const themes = ['analytic', 'clockwork', 'expanse'];
    for (const [x, tau] of [
      [24, -24],
      [80, -400],
    ]) {
      for (let round = 0; round < themes.length; round++) {
        for (let offset = 0; offset < themes.length; offset++) {
          const theme = themes[(round + offset) % themes.length];
          const page = await browser.newPage({
            viewport: { width: 1440, height: 900 },
            deviceScaleFactor: 1,
          });
          await page.goto(
            server.resolvedUrls.local[0] +
              '#v=2&theme=' +
              theme +
              '&x=' +
              x +
              '&tau=' +
              tau +
              '&zeros=649&referenceCurve=true',
          );
          await page.waitForFunction(() =>
            ['reference-record', 'zeta-locus'].every((id) =>
              document
                .querySelector('[data-testid="' + id + '"]')
                ?.getAttribute('d')
                ?.includes('L'),
            ),
          );
          await page.getByRole('button', { name: 'Play', exact: true }).click();
          await page.waitForTimeout(1000);
          const sample = await page.evaluate(
            () =>
              new Promise((resolve) => {
                const gaps = [];
                let start, previous;
                function frame(time) {
                  if (previous === undefined) start = time;
                  else gaps.push(time - previous);
                  previous = time;
                  if (time - start < 5000) return requestAnimationFrame(frame);
                  const fps = (1000 * gaps.length) / (time - start);
                  gaps.sort((a, b) => a - b);
                  resolve({
                    fps: +fps.toFixed(1),
                    p95ms: +gaps[Math.ceil(gaps.length * 0.95) - 1].toFixed(1),
                  });
                }
                requestAnimationFrame(frame);
              }),
          );
          if (Number(await page.getByLabel('Count x', { exact: true }).inputValue()) <= x)
            throw new Error('Playback did not advance.');
          console.log(JSON.stringify({ x, tau, theme, round: round + 1, ...sample }));
          await page.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
} finally {
  await server.close();
}
