import { test, expect, type Page, type Locator } from '@playwright/test';

async function controls(page: Page, name: string) {
  await page.keyboard.press('Escape');
  const buttons: Record<string, string> = {
    view: 'Visual controls',
    appearance: 'Visual controls',
    color: 'Visual controls',
    effects: 'Visual controls',
    audio: 'Audio controls',
    winding: 'Clock adjustments',
    coupling: 'Clock adjustments',
    input: 'Clock adjustments',
    journey: 'Clock adjustments',
    saved: 'Clock adjustments',
  };
  if (buttons[name]) await page.getByRole('button', { name: buttons[name], exact: true }).click();
}
async function expandMechanisms(page: Page) {
  for (const title of ['Primes', 'Zeta', 'Psi'])
    await page.getByRole('button', { name: 'Expand ' + title + ' controls' }).click();
}
async function reveal(page: Page, locator: Locator) {
  await expect(locator).toBeVisible();
  return locator;
}

test('fresh winding starts at zero and reaches the first prime without singular geometry', async ({
  page,
}) => {
  await page.goto('/');
  const x = page.getByLabel('Count x', { exact: true });
  await expect(x).toHaveValue('0');
  await expect(page.getByLabel('Height tau', { exact: true })).toHaveValue('0');
  // Collapsed headings carry only the symbol, name and switch.
  await expect(page.getByRole('button', { name: 'About Psi', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Expand Psi controls' }).click();
  await page.getByRole('button', { name: 'About Psi', exact: true }).click();
  const notes = page.getByRole('region', { name: 'About Psi', exact: true });
  for (const value of ['0', '0.5', '1', '1.01', '1.5', '2', '0']) {
    await x.fill(value);
    await expect(notes).toContainText(value === '2' ? 'Exact 0.693' : 'Exact 0.000');
    await expect(page.getByLabel('Height tau', { exact: true })).toHaveValue(
      String(-Number(value)),
    );
    const geometry = await page.getByTestId('shared-scene').innerHTML();
    expect(geometry).not.toMatch(/NaN|Infinity/);
    // ψ appears at 1, fully extended; its record rests at the origin until 2.
    await expect(page.getByTestId('psi-axle')).toHaveCount(Number(value) < 1 ? 0 : 1);
    if (Number(value) < 1)
      await expect(page.getByTestId('reference-record')).toHaveAttribute('d', '');
    else if (Number(value) < 2) {
      const d = (await page.getByTestId('reference-record').getAttribute('d'))!;
      expect(d).toMatch(/^M0\.00,0\.00/);
      for (const n of d.match(/-?\d+(\.\d+)?/g)!) expect(Math.abs(+n)).toBeLessThan(1);
    }
  }
});

test('the conjugate reflects across the axis and its sum closes at the stylus on the rim', async ({
  page,
}) => {
  await page.goto('/#v=2&theme=analytic&x=8.25&tau=-24');
  const axle = page.getByTestId('psi-axle');
  await expect(axle).toHaveAttribute('transform', 'translate(320,0)');
  await expect(page.getByTestId('psi-conjugate-sum')).toHaveAttribute('transform', 'scale(1,-1)');
  // Parallelogram O → B → B + B̄ → B̄: its far corner is the stylus on the real axis.
  const closeError = await page.getByTestId('psi-balance').evaluate((node) => {
    const [, , , , tipX, tipY] = node
      .getAttribute('d')!
      .match(/-?[\d.e-]+/g)!
      .map(Number);
    const stylus = document.querySelector('.reference-stylus') as SVGCircleElement;
    return Math.hypot(tipX - stylus.cx.baseVal.value, tipY);
  });
  expect(closeError).toBeLessThan(0.002);
  await expect(page.getByTestId('psi-reflection')).toHaveCount(0);
  await expect(page.getByTestId('psi-count')).toHaveCount(0);
});

test('two dots run the radius and the rim before psi, and the lens waits for it', async ({
  page,
}) => {
  await page.goto('/#v=2&theme=analytic&x=0.25&tau=-0.25');
  await expect(page.getByTestId('psi-lens')).toHaveCount(0);
  await expect(page.getByTestId('radius-dot')).toHaveAttribute('cx', '80');
  const rim = page.getByTestId('perimeter-dot');
  expect(Math.abs(+(await rim.getAttribute('cx'))!)).toBeLessThan(1e-9);
  expect(+(await rim.getAttribute('cy'))!).toBeCloseTo(-320, 6);
  await page.goto('/#v=2&theme=analytic&x=1&tau=-1');
  await expect(page.getByTestId('psi-lens')).toHaveCount(1);
  await page.goto('/#v=2&theme=analytic&x=24&tau=-24');
  await expect(page.getByTestId('lens-tangents')).toHaveAttribute('d', /^M.+L.+M.+L/);
});

test('linked winding, pause, rewind, and unlinking preserve the shared scene', async ({ page }) => {
  const errors: string[] = [];
  let workers = 0;
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('worker', () => workers++);
  await page.goto('/#v=2&theme=analytic&x=24&tau=-24');
  await expect(page.getByRole('button', { name: 'Link x and tau' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByTestId('reference-record')).toHaveAttribute('d', /M.+L/);
  const before = await page.getByTestId('reference-record').getAttribute('d');
  const read = async () => [
    Number(await page.getByLabel('Count x', { exact: true }).inputValue()),
    Number(await page.getByLabel('Height tau', { exact: true }).inputValue()),
  ];
  await page.getByRole('button', { name: 'Step forward' }).click();
  expect(await read()).toEqual([25, -25]);
  await page.getByRole('button', { name: 'Step backward' }).click();
  expect(await read()).toEqual([24, -24]);
  await expect(page.getByTestId('reference-record')).toHaveAttribute('d', before!);
  const workerCount = workers;
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect.poll(async () => (await read())[0]).toBeGreaterThan(24.1);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const stopped = await read();
  expect(stopped[0]).toBeCloseTo(-stopped[1], 9);
  await page.waitForTimeout(100);
  expect(await read()).toEqual(stopped);
  expect(workers).toBe(workerCount); // Clock frames must not recreate geometry workers.
  await page.getByRole('button', { name: 'Link x and tau' }).click();
  await expect(page.getByRole('button', { name: 'Link x and tau' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await page.getByRole('button', { name: 'Step forward' }).click();
  const free = await read();
  expect(free[0]).toBeCloseTo(stopped[0] + 1, 9);
  expect(free[1]).toBe(stopped[1]);
  expect(errors).toEqual([]);
});

test('zeta is a plotted curve; themes, optics, and saved positions preserve geometry', async ({
  page,
}) => {
  await page.goto('/#v=2&theme=analytic&x=24&tau=-24');
  await expect(page.getByTestId('zeta-locus')).toBeHidden();
  const arms = () =>
    page
      .locator('[data-testid="sum-chain"] [data-arm]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('transform')));
  const first = await arms();
  expect(first.length).toBe(128);
  await controls(page, 'appearance');
  await page.getByRole('button', { name: 'Expanse', exact: true }).click();
  expect(await arms()).toEqual(first);
  await expect(page.locator('.axis-label')).toHaveCount(0);
  await expect(page.locator('#clock-scene .axis-label')).toHaveCount(0);
  await controls(page, 'lens');
  const axle = await page.getByTestId('psi-axle').getAttribute('transform');
  await page.getByRole('button', { name: 'Lens zoom in', exact: true }).click();
  await expect(page.getByTestId('psi-axle')).toHaveAttribute('transform', axle!);
  await expect(page.getByTestId('psi-lens').locator('use')).toHaveAttribute('href', '#clock-scene');
  await controls(page, 'input');
  await page.getByLabel('Exact x', { exact: true }).fill('14.134725141734693');
  await page.getByLabel('Exact x', { exact: true }).press('Tab');
  await page.getByLabel('Exact tau', { exact: true }).fill('-14.134725141734693');
  await page.getByLabel('Exact tau', { exact: true }).press('Tab');
  await expect
    .poll(async () => Math.abs(Number(await page.getByTestId('zeta-point').getAttribute('cx'))))
    .toBeLessThan(1e-8);
  await expect
    .poll(async () => Math.abs(Number(await page.getByTestId('zeta-point').getAttribute('cy'))))
    .toBeLessThan(1e-8);
  await expect(page.getByLabel('Exact sigma', { exact: true })).toHaveCount(0);
  await controls(page, 'appearance');
  await controls(page, 'saved');
  await page.getByRole('button', { name: 'Share position' }).click();
  expect(page.url()).toContain('v=2');
  expect(page.url()).toContain('stabilize=false');
  await page.reload();
  await controls(page, 'lens');
  await expect(page.getByRole('button', { name: 'Auto-fit lens' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await controls(page, 'appearance');
  await expect(page.getByRole('button', { name: 'Expanse', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('individual panes and arms are inspectable and pin a prime family', async ({ page }) => {
  await page.goto('/#v=2&theme=analytic&x=24&tau=-24');
  const pane = page.getByRole('button', { name: 'Inspect pane 3', exact: true });
  await pane.focus();
  await expect(page.getByTestId('object-readout')).toContainText('Pane 3 = 3^1');
  await pane.press('Enter');
  await page.getByRole('button', { name: 'Visual controls', exact: true }).focus();
  await expect(page.getByTestId('object-readout')).toContainText('Pane 3 = 3^1');
  await expect(page.locator('[data-arm="term:9"]')).toHaveClass(/selected/);
  await expect(page.locator('[data-pane="9"]')).toHaveClass(/selected/);
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('object-readout')).not.toContainText('Pane 3 =');
  await page.getByRole('button', { name: 'Inspect term 5', exact: true }).focus();
  await expect(page.getByTestId('object-readout')).toContainText('Term 5');
  // Exercise pointer hit-testing at the center of a real arc, not its box.
  const target = page.locator('[data-pane="23"] .hit-path');
  const at = await target.evaluate((node) => {
    const path = node as SVGPathElement;
    const p = path.getPointAtLength(path.getTotalLength() * 0.7);
    return new DOMPoint(p.x, p.y).matrixTransform(path.getScreenCTM()!).toJSON();
  });
  await page.mouse.move(at.x, at.y);
  await expect(page.getByTestId('object-readout')).toContainText('Pane 23');
  await page.mouse.click(at.x, at.y);
  await page.mouse.move(10, 10);
  await expect(page.getByTestId('object-readout')).toContainText('Pane 23');
});

test('mobile retains the overlapping scene and the microscope references that scene', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#v=2&theme=analytic&x=24&tau=-24');
  for (const id of ['sieve', 'zeta-mechanism', 'psi-mechanism', 'psi-record']) {
    await expect(page.getByTestId('shared-scene').getByTestId(id)).toHaveCount(1);
  }
  await expect(page.getByTestId('reference-record')).toHaveAttribute('d', /M.+L/);
  await controls(page, 'lens');
  const axle = await page.getByTestId('psi-axle').getAttribute('transform');
  await page.getByRole('button', { name: 'Move magnifier' }).press('ArrowDown');
  await expect(page.getByTestId('psi-axle')).toHaveAttribute('transform', axle!);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await controls(page, 'view');
  // Overall zoom and the motion setting are retired; appearance keeps themes and colour.
  await reveal(page, page.getByRole('button', { name: 'Analytic', exact: true }));
  await expect(page.getByRole('button', { name: 'Zoom in', exact: true })).toHaveCount(0);
  await expect(page.getByRole('group', { name: 'Visual effects' })).toHaveCount(0);
});

const origin = (page: Page) =>
  page.getByTestId('shared-scene').evaluate((node) => {
    const p = new DOMPoint(0, 0).matrixTransform((node as SVGGraphicsElement).getScreenCTM()!);
    return { x: p.x, y: p.y };
  });
async function centered(page: Page) {
  const size = page.viewportSize()!;
  const p = await origin(page);
  expect(p.x).toBeCloseTo(size.width / 2, 3);
  expect(p.y).toBeCloseTo(size.height / 2, 3);
}
async function noScroll(page: Page) {
  expect(
    await page.evaluate(() => ({
      x: scrollX,
      y: scrollY,
      w: document.documentElement.scrollWidth,
      h: document.documentElement.scrollHeight,
      innerW: innerWidth,
      innerH: innerHeight,
      panels: [...document.querySelectorAll<HTMLElement>('.compact-surface, .transport')].every(
        (n) => n.scrollHeight <= n.clientHeight && n.scrollWidth <= n.clientWidth,
      ),
    })),
  ).toEqual({
    x: 0,
    y: 0,
    w: page.viewportSize()!.width,
    h: page.viewportSize()!.height,
    innerW: page.viewportSize()!.width,
    innerH: page.viewportSize()!.height,
    panels: true,
  });
}
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
  { width: 844, height: 390 },
  { width: 320, height: 568 },
  { width: 568, height: 320 },
]) {
  test(`compact controls stay reachable and origin fixed at ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('/#v=2&theme=analytic&x=24&tau=-24');
    await centered(page);
    await expect(
      page.locator('select,[role="combobox"],[role="menu"],.sheet-navigation'),
    ).toHaveCount(0);
    expect((await page.locator('.mechanism-controls').boundingBox())!.x).toBeLessThan(60);
    await expandMechanisms(page);
    async function reachable(selector: string) {
      for (const node of await page.locator(selector).all()) {
        await node.focus();
        const box = (await node.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
        expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
        expect(
          await node.evaluate((el) => {
            const r = el.getBoundingClientRect();
            const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
            return hit === el || el.contains(hit)
              ? 'reachable'
              : el.outerHTML + ' covered by ' + hit?.outerHTML.slice(0, 150);
          }),
        ).toBe('reachable');
      }
    }
    await reachable('.mechanism-controls button,.mechanism-controls input,.lens-toolbar button');
    for (const title of ['Primes', 'Zeta', 'Psi']) {
      const panel = page.getByRole('region', { name: title + ' controls', exact: true });
      expect((await panel.boundingBox())!.height).toBeLessThan(190);
      await page.getByRole('button', { name: 'About ' + title, exact: true }).click();
      await reachable('.about-popover button');
      await noScroll(page);
      await centered(page);
      await page.keyboard.press('Escape');
    }
    for (const category of ['audio', 'appearance', 'winding']) {
      await controls(page, category);
      await reachable(
        '.utility-popover button,.utility-popover input,.clock-popover button,.clock-popover input',
      );
      await noScroll(page);
      await centered(page);
    }
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Link x and tau' }).click();
    await reachable('.transport button,.transport input:visible');
    await controls(page, 'winding');
    await reachable('.clock-popover button,.clock-popover input');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Collapse Psi controls' }).click();
    await expect(page.getByLabel('Zeta scale')).toBeVisible();
    await page.getByRole('button', { name: 'Expand Psi controls' }).click();
    await expect(page.getByLabel('Psi record', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Fit sum', exact: true }).click();
    await centered(page);
    await page.getByRole('button', { name: 'Step forward' }).click();
    await centered(page);
    await page.getByRole('button', { name: 'Play', exact: true }).click();
    await expect
      .poll(async () => +(await page.getByLabel('Count x', { exact: true }).inputValue()))
      .toBeGreaterThan(25.05);
    await page.getByRole('button', { name: 'Pause', exact: true }).click();
    await centered(page);
    await page.mouse.wheel(500, 900);
    await page.keyboard.press('Escape');
    for (const version of [1, 2]) {
      await page.evaluate((v) => {
        location.hash = `v=${v}&sigma=.8&panX=450&panY=-220&x=14.134725141734693&tau=14.134725141734693`;
      }, version);
      await expect
        .poll(async () => Math.abs(+(await page.getByTestId('zeta-point').getAttribute('cx'))!))
        .toBeLessThan(1e-8);
      await centered(page);
    }
    await noScroll(page);
    await page.setViewportSize({ width: viewport.height, height: viewport.width });
    await expect.poll(async () => (await origin(page)).x).toBeCloseTo(viewport.height / 2, 3);
    await noScroll(page);
  });
}

test('signed presets, reverse play, and destination winding stay coupled', async ({ page }) => {
  await page.goto('/#v=2&theme=analytic&x=24&tau=-24');
  await controls(page, 'coupling');
  await expect(page.getByRole('button', { name: '−1', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: '−2π', exact: true }).click();
  await expect(page.getByLabel('Count x', { exact: true })).toHaveValue('24');
  await expect(page.getByLabel('Height tau', { exact: true })).toHaveValue('-24');
  await page.getByRole('button', { name: 'Step forward' }).click();
  expect(+(await page.getByLabel('Height tau', { exact: true }).inputValue())).toBeCloseTo(
    -24 - 2 * Math.PI,
    10,
  );
  await page.getByRole('button', { name: 'Step backward' }).click();
  await controls(page, 'winding');
  await page.getByRole('button', { name: 'Reverse playback' }).click();
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect
    .poll(async () => +(await page.getByLabel('Count x', { exact: true }).inputValue()))
    .toBeLessThan(23.95);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await page.getByRole('slider', { name: 'Winding speed', exact: true }).fill('4');
  await controls(page, 'journey');
  await page.getByLabel('Winding destination').fill('24.1');
  await page.getByRole('button', { name: 'Wind to x', exact: true }).click();
  await expect(page.getByLabel('Count x', { exact: true })).toHaveValue('24.1');
  await expect(page.getByRole('button', { name: 'Play', exact: true })).toBeVisible();
  expect(+(await page.getByLabel('Height tau', { exact: true }).inputValue())).toBeCloseTo(
    -24 - 0.1 * 2 * Math.PI,
    9,
  );
  await page.getByRole('button', { name: 'Next prime', exact: true }).click();
  await expect(page.getByLabel('Count x', { exact: true })).toHaveValue('29');
  await page.getByRole('button', { name: 'Previous prime', exact: true }).click();
  await expect(page.getByLabel('Count x', { exact: true })).toHaveValue('23');
  await centered(page);
});

test('mechanisms are independent and explanation buttons do not replace controls', async ({
  page,
}) => {
  await page.goto('/#v=2&theme=analytic&x=24&tau=-24');
  await expandMechanisms(page);
  await page.getByLabel('Psi record', { exact: true }).uncheck();
  await page.getByRole('button', { name: 'About Psi', exact: true }).click();
  await expect(page.getByRole('region', { name: 'About Psi', exact: true })).toContainText(
    'Riemann',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'About Psi', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Collapse Psi controls' }).click();
  await page.getByLabel('Zeta playback trail').uncheck();
  await expect(page.getByLabel('Trail lifetime')).toHaveCount(0);
  await page.getByRole('button', { name: 'Expand Psi controls' }).click();
  await expect(page.getByLabel('Psi record', { exact: true })).not.toBeChecked();
  for (const removed of [
    'Zero pairs',
    'Conjugate reflection',
    'Sampled zeta reference curve',
    'Exact count marker',
    'Psi projections',
  ])
    await expect(page.getByLabel(removed, { exact: true })).toHaveCount(0);
  await expect(page.getByLabel('Prime labels')).toBeVisible();
  await expect(page.locator('[data-control="psi"] .lens-toolbar')).toHaveCount(0);
});

test('direct filters and attached lens controls preserve geometry', async ({ page }) => {
  await page.goto('/#v=2&theme=analytic&x=24&tau=-24');
  const axle = await page.getByTestId('psi-axle').getAttribute('transform');
  const arms = await page
    .locator('[data-arm]')
    .evaluateAll((ns) => ns.map((n) => n.getAttribute('transform')));
  await page.getByLabel('Show Primes', { exact: true }).uncheck();
  await page.getByLabel('Show Psi', { exact: true }).uncheck();
  await expect(page.locator('.prime-panes')).toBeHidden();
  await expect(page.getByTestId('sum-chain')).toBeVisible();
  await expect(page.locator('.psi-arms')).toBeHidden();
  await page.getByRole('button', { name: 'Expand Zeta controls' }).click();
  await page.getByLabel('Zeta sum', { exact: true }).uncheck();
  await expect(page.getByTestId('sum-chain')).toBeHidden();
  await page.getByLabel('Show Primes', { exact: true }).check();
  await page.getByRole('button', { name: 'Expand Primes controls' }).click();
  await expect(page.locator('[data-pane="13"] .pane-label')).toBeVisible();
  await page.getByLabel('Prime labels', { exact: true }).uncheck();
  await expect(page.locator('[data-pane="13"] .pane-label')).toBeHidden();
  await page.getByLabel('Prime powers', { exact: true }).uncheck();
  await expect(page.locator('[data-pane="16"]')).toBeHidden();
  await expect(page.locator('[data-pane="17"]')).toBeVisible();
  for (const name of ['Primes', 'Zeta', 'Psi'])
    await page.getByLabel('Show ' + name, { exact: true }).check();
  expect(
    await page
      .locator('[data-arm]')
      .evaluateAll((ns) => ns.map((n) => n.getAttribute('transform'))),
  ).toEqual(arms);
  const grip = page.getByRole('button', { name: 'Move magnifier' }),
    rim = page.locator('.lens-rim');
  const beforeX = +(await rim.getAttribute('cx'))!;
  await grip.focus();
  await grip.press('ArrowRight');
  expect(+(await rim.getAttribute('cx'))!).toBeGreaterThan(beforeX);
  const p = await grip.evaluate((node) => {
    const c = node as SVGCircleElement;
    return new DOMPoint(c.cx.baseVal.value + c.r.baseVal.value, c.cy.baseVal.value)
      .matrixTransform(c.getScreenCTM()!)
      .toJSON();
  });
  const beforeY = +(await rim.getAttribute('cy'))!;
  await page.mouse.move(p.x, p.y);
  await page.mouse.down();
  await page.mouse.move(p.x + 60, p.y + 50, { steps: 5 });
  await page.mouse.up();
  expect(+(await rim.getAttribute('cy'))!).toBeGreaterThan(beforeY);
  await page.getByRole('button', { name: 'Lens zoom in' }).click();
  await expect(page.getByRole('button', { name: 'Auto-fit lens' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await page.getByRole('button', { name: 'Auto-fit lens' }).click();
  await expect(page.getByRole('button', { name: 'Auto-fit lens' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const size = page.getByRole('slider', { name: 'Lens size', exact: true });
  await size.focus();
  await size.press('End');
  await expect(rim).toHaveAttribute('r', '160');
  await controls(page, 'saved');
  await page.getByRole('button', { name: 'Share position' }).click();
  await page.reload();
  await expect(rim).toHaveAttribute('r', '160');
  await page.getByRole('button', { name: 'Hide magnifier' }).click();
  await expect(page.getByTestId('psi-lens')).toHaveCount(0);
  await page.getByRole('button', { name: 'Show magnifier' }).click();
  await expect(page.getByTestId('psi-lens')).toBeVisible();
  await expect(page.getByTestId('psi-axle')).toHaveAttribute('transform', axle!);
  await centered(page);
  await noScroll(page);
});

test('touch lens movement and resize retain the fixed origin', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#v=2&theme=analytic&x=24&tau=-24');
  const grip = page.getByRole('button', { name: 'Move magnifier' });
  const p = await grip.evaluate((node) => {
    const c = node as SVGCircleElement;
    return new DOMPoint(c.cx.baseVal.value, c.cy.baseVal.value + c.r.baseVal.value)
      .matrixTransform(c.getScreenCTM()!)
      .toJSON();
  });
  const rim = page.locator('.lens-rim'),
    oldY = await rim.getAttribute('cy');
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: p.x, y: p.y }],
  });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: p.x + 50, y: p.y + 60 }],
  });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();
  expect(await rim.getAttribute('cy')).not.toBe(oldY);
  await centered(page);
  await noScroll(page);
  await page.setViewportSize({ width: 844, height: 390 });
  await expect.poll(async () => (await origin(page)).x).toBeCloseTo(422, 3);
  const box = await grip.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(844);
  expect(box!.y + box!.height).toBeLessThanOrEqual(390);
  await centered(page);
  await noScroll(page);
});

test('prime-axis contact, continuous history and direct panel switching', async ({ page }) => {
  await page.goto('/#v=2&x=37&tau=-37');
  await expect(page.getByTestId('reference-record')).toHaveAttribute('d', /M.+L/);
  await expect(page.locator('.record-exact')).toHaveCount(0);
  const tip = await page.locator('[data-testid="psi-axle"] .reference-stylus').evaluate((node) => {
    const c = node as SVGCircleElement;
    return new DOMPoint(c.cx.baseVal.value, c.cy.baseVal.value)
      .matrixTransform(c.getScreenCTM()!)
      .toJSON();
  });
  expect(tip.y).toBeCloseTo((await origin(page)).y, 6);
  await page.getByRole('button', { name: 'Expand Psi controls' }).click();
  await controls(page, 'color');
  await page.getByRole('slider', { name: 'Hue', exact: true }).fill('20');
  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Psi record', { exact: true })).toBeVisible();
  await centered(page);
});

test('playback trails fade while paused, clear on seek, and survive reduced motion', async ({
  page,
}) => {
  await page.goto('/#v=2&x=6.95&tau=-14.08&speed=4');
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(page.getByTestId('prime-moment')).toHaveCount(1);
  await expect(page.getByTestId('zero-moment')).toHaveCount(1);
  await expect.poll(() => page.locator('.trail-segment').count()).toBeGreaterThan(2);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const segment = page.locator('.trail-segment').first();
  const opacity = +(await segment.getAttribute('opacity'))!;
  await expect
    .poll(async () => +(await segment.getAttribute('opacity'))!)
    .toBeLessThan(opacity - 0.02);
  await expect(page.getByTestId('zeta-locus')).toBeHidden();
  await page.getByRole('button', { name: 'Step forward' }).click();
  await expect(page.locator('.trail-segment')).toHaveCount(0);
  await expect(page.getByTestId('prime-moment')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  // Reduced motion (for example Windows with animation effects off) quiets the
  // event pulses, but the trail is a record, governed only by its own switch.
  await expect.poll(() => page.locator('.trail-segment').count()).toBeGreaterThan(2);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await centered(page);
});

test('sound requires a gesture and shares interval events without a replay backlog', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const state = { created: 0, notes: 0 };
    (window as any).__soundTest = state;
    const param = () => ({
      value: 0,
      setTargetAtTime() {},
      setValueAtTime() {},
      linearRampToValueAtTime() {},
      exponentialRampToValueAtTime() {},
    });
    (window as any).AudioContext = class {
      state = 'running';
      currentTime = 0;
      destination = {};
      constructor() {
        state.created++;
      }
      async resume() {}
      async close() {}
      createGain() {
        return { gain: param(), connect() {}, disconnect() {} };
      }
      createOscillator() {
        return {
          type: 'sine',
          frequency: param(),
          onended: null,
          connect() {},
          disconnect() {},
          start() {
            state.notes++;
          },
          stop() {},
        };
      }
    };
  });
  await page.goto('/#v=2&x=6.95&tau=-14.08&speed=4');
  expect(await page.evaluate(() => (window as any).__soundTest.created)).toBe(0);
  await controls(page, 'audio');
  await page.getByLabel('Enable sound').check();
  expect(await page.evaluate(() => (window as any).__soundTest.created)).toBe(1);
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => (window as any).__soundTest.notes))
    .toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const notes = await page.evaluate(() => (window as any).__soundTest.notes);
  await page.getByRole('button', { name: 'Step backward' }).click();
  expect(await page.evaluate(() => (window as any).__soundTest.notes)).toBe(notes);
  await page.reload();
  await controls(page, 'audio');
  await expect(page.getByLabel('Enable sound')).not.toBeChecked();
});

test('both psi tips stay inside the lens during seeks, manual zoom and focus offsets', async ({
  page,
}) => {
  for (const state of [
    'x=7&tau=-7',
    'x=8&tau=-500&stabilize=false&psiScale=30',
    'x=2&tau=-900&lensDx=500&lensDy=-500&lensRadius=70',
    'x=127&tau=-900&lensFocus=tip&lensAngle=60',
  ]) {
    await page.goto('/#v=2&' + state);
    const ratios = await page.evaluate(() => {
      const camera = document.querySelector('[data-testid="camera"]') as SVGGraphicsElement;
      const use = document.querySelector('.psi-lens use') as SVGGraphicsElement;
      const rim = document.querySelector('.lens-rim') as SVGCircleElement;
      const matrix = rim.getScreenCTM()!;
      const center = new DOMPoint(rim.cx.baseVal.value, rim.cy.baseVal.value).matrixTransform(
        matrix,
      );
      const radius = rim.r.baseVal.value * Math.hypot(matrix.a, matrix.b);
      return [
        ...document.querySelectorAll<SVGCircleElement>(
          '[data-testid="psi-axle"] > .reference-stylus, [data-testid="psi-axle"] > .developing-stylus',
        ),
      ].map((tip) => {
        const world = new DOMPoint(tip.cx.baseVal.value, tip.cy.baseVal.value)
          .matrixTransform(tip.getScreenCTM()!)
          .matrixTransform(camera.getScreenCTM()!.inverse());
        const projected = world.matrixTransform(use.getScreenCTM()!);
        return Math.hypot(projected.x - center.x, projected.y - center.y) / radius;
      });
    });
    expect(ratios).toHaveLength(2);
    for (const ratio of ratios) {
      expect(ratio).toBeLessThanOrEqual(0.880001);
      // Invert the shader's monotone radial sample to check the visible tip too.
      let lo = 0,
        hi = 1;
      for (let i = 0; i < 32; i++) {
        const r = (lo + hi) / 2;
        if (r * (1 - 0.08 * (1 - r * r)) < ratio) lo = r;
        else hi = r;
      }
      expect(hi).toBeLessThan(0.9);
    }
    await centered(page);
  }
});

test('theme buttons preserve geometry and saved filters', async ({ page }) => {
  await page.goto('/#v=2&theme=analytic&x=24&tau=-24');
  await expect(page.locator('main')).toHaveAttribute('data-theme', 'analytic');
  const vectors = page.getByTestId('psi-vectors');
  await expect(vectors).toBeVisible();
  expect((await vectors.locator('path').first().getAttribute('d'))!.match(/L/g)).toHaveLength(650);
  await expect(page.getByTestId('psi-gears')).toHaveCount(0);
  await vectors.focus();
  await vectors.press('End');
  await expect(page.getByTestId('object-readout')).toContainText('Zero pair 649');
  await expect(page.locator('.axis-label,.measure-label')).toHaveCount(0);
  await expect(page.getByTestId('zeta-locus')).toBeHidden();
  await expect(page.locator('.metal-gear,.starfield,feDisplacementMap')).toHaveCount(0);
  await controls(page, 'appearance');
  await page.getByRole('button', { name: 'Clockwork', exact: true }).click();
  await page.keyboard.press('Escape');
  const gear = page.locator('[data-arm="term:2"] .metal-gear');
  await expect(gear).toHaveAttribute('fill', 'url(#brass)');
  await page.getByRole('button', { name: 'Step forward' }).click();
  await expect(gear).toBeVisible();
  await expect(page.locator('.tick,.grid-dot,#engraving,.vinyl-groove')).toHaveCount(0);
  await page.getByLabel('Show Primes', { exact: true }).uncheck();
  await page.getByLabel('Show Psi', { exact: true }).uncheck();
  await controls(page, 'appearance');
  await page.getByRole('button', { name: 'Expanse', exact: true }).click();
  await expect(page.locator('.starfield')).toBeVisible();
  await expect(page.getByLabel('Count x', { exact: true })).toHaveValue('25');
  await expect(page.getByLabel('Height tau', { exact: true })).toHaveValue('-25');
  await controls(page, 'saved');
  await page.getByRole('button', { name: 'Share position' }).click();
  await page.reload();
  await expect(page.getByLabel('Show Zeta')).toBeChecked();
  await expect(page.getByLabel('Show Primes')).not.toBeChecked();
  await expect(page.getByLabel('Show Psi')).not.toBeChecked();
  await centered(page);
});

test('clockwork shows the full psi budget with reached gold and unreached silver gears', async ({
  page,
}) => {
  await page.goto('/#v=2&x=37&tau=-37&theme=clockwork');
  const gears = page.getByTestId('psi-gears');
  await expect(gears).toHaveAttribute('data-count', '649');
  await expect(gears).toHaveAttribute('data-reached', '5');
  const surface = gears.getByTestId('psi-gear-surface');
  await expect(surface).toHaveAttribute('href', /^data:image\/png;base64,/);
  expect(Number(await surface.getAttribute('data-pixels'))).toBeGreaterThanOrEqual(256);
  await gears.focus();
  await gears.press('Home');
  await expect(page.getByTestId('object-readout')).toContainText('Reached · gold');
  await gears.press('End');
  await expect(page.getByTestId('object-readout')).toContainText('Zero pair 649');
  await expect(page.getByTestId('object-readout')).toContainText('Unreached · silver');
  await gears.press('Enter');
  await page.getByRole('button', { name: 'Visual controls', exact: true }).focus();
  await expect(page.getByTestId('object-readout')).toContainText('Zero pair 649');
  const copy = page.locator('.psi-lens use');
  await expect(copy).toHaveAttribute('href', '#clock-scene');
  await expect(copy).toHaveAttribute('style', /--lens-back-x/);
  await expect(page.locator('#clock-scene')).toHaveAttribute('data-theme', 'clockwork');
  await expect(page.locator('.psi-supports rect')).toHaveCount(2);
  await expect(page.locator('.clock-housing rect')).toHaveCount(0);
  await expect(page.getByTestId('count-spring')).toHaveCount(0);
  await expect(page.locator('.lens-caption,.psi-label,.readings')).toHaveCount(0);
  await expect(page.getByTestId('clock-hand').locator('ellipse')).toHaveCount(1);
  await controls(page, 'filters');
  await page.getByLabel('Show Psi', { exact: true }).uncheck();
  await expect(page.getByTestId('count-ratchet')).toBeHidden();
  await centered(page);
});

test('winding presents three ordered buttons and reveals a tau shaft beside the clock only when unlinked', async ({
  page,
}) => {
  await page.goto('/#v=2&theme=analytic&x=24&tau=-24');
  const names = await page
    .locator('.transport .playback button')
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('aria-label')));
  expect(names).toEqual(['Step backward', 'Play', 'Step forward']);
  await expect(page.getByLabel('Height tau', { exact: true })).toBeHidden();
  await expect(page.locator('.transport input[type="range"]:visible')).toHaveCount(1);
  await page.getByRole('button', { name: 'Link x and tau' }).click();
  const tau = page.getByLabel('Height tau', { exact: true });
  await expect(tau).toBeVisible();
  const bounds = await tau.boundingBox();
  expect(bounds!.width).toBeGreaterThan(bounds!.height * 3);
  await tau.fill('40');
  await expect(page.getByLabel('Count x', { exact: true })).toHaveValue('24');
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 568, height: 320 },
  ]) {
    await page.setViewportSize(viewport);
    const slider = await tau.boundingBox(),
      transport = await page.locator('.transport').boundingBox();
    expect(slider!.x).toBeGreaterThanOrEqual(transport!.x);
    expect(slider!.width).toBeGreaterThan(slider!.height * 3);
    await noScroll(page);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole('button', { name: 'Link x and tau' }).click();
  await expect(tau).toBeHidden();
  await expect(page.locator('[data-pane]')).not.toHaveCount(0);
  const grip = page.getByRole('button', { name: 'Move magnifier' });
  const source = page.locator('.lens-source');
  const before = await source.getAttribute('cx');
  await grip.focus();
  await grip.press('ArrowRight');
  await expect(source).not.toHaveAttribute('cx', before!);
  await centered(page);
  await noScroll(page);
});

test('lens optics and housing share source materials and leave the mathematical plane unchanged', async ({
  page,
}) => {
  await page.goto('/#v=2&theme=clockwork&x=24&tau=-24');
  const rim = page.locator('.lens-rim');
  const lens = await rim.boundingBox();
  expect(lens!.x).toBeGreaterThan(700);
  await expect(page.locator('.psi-mechanism .projection')).toHaveCount(0);
  await expect(
    page.getByTestId('psi-mechanism').locator('.projection,.reference-drop'),
  ).toHaveCount(0);
  await expect(page.locator('.psi-frame')).toBeVisible();
  await expect(page.getByTestId('ratchet-rack')).toHaveAttribute('d', /V3.8 H0 Z$/);
  await expect(page.locator('.lens-suspension')).toBeVisible();
  await expect(page.locator('feDisplacementMap')).toHaveAttribute('xChannelSelector', 'R');
  const axle = await page.getByTestId('psi-axle').getAttribute('transform');
  const copy = page.locator('.psi-lens use');
  const before = await copy.getAttribute('style');
  const grip = page.getByRole('button', { name: 'Move magnifier' });
  await grip.focus();
  await grip.press('ArrowLeft');
  await expect(copy).not.toHaveAttribute('style', before!);
  expect(await page.locator('.rear-plane').evaluate((n) => getComputedStyle(n).transform)).toBe(
    'matrix(1, 0, 0, 1, 0, 0)',
  );
  await expect(page.getByTestId('psi-axle')).toHaveAttribute('transform', axle!);
  const tip = await page.locator('[data-testid="psi-axle"] > .reference-stylus').evaluate((n) => ({
    r: getComputedStyle(n).r,
    fill: getComputedStyle(n).fill,
  }));
  expect(parseFloat(tip.r)).toBeLessThan(0.3);
  expect(tip.fill).toBe('rgb(185, 196, 189)');
  await centered(page);
  await noScroll(page);
});

test('opaque foreground wheels cover rear outlines and metal lighting stays fixed', async ({
  page,
}) => {
  await page.goto('/#v=2&theme=analytic&x=24&tau=-24');
  const pixels = await page.evaluate(async () => {
    // Exercise the production surface, including its exported pixels rather than
    // merely checking SVG attributes that could still paint in the wrong order.
    const modulePath = '/src/render/gear-surface.ts';
    const { createGearSurface } = await import(/* @vite-ignore */ modulePath);
    const paint = createGearSurface();
    const wheel = {
      id: 0,
      x: 0,
      y: 0,
      r: 10,
      shape: '#cog-24',
      phase: 0,
      pinion: 0,
      pinionShape: '#cog-12',
      axle: 0.4,
      edge: 0.18,
    };
    const sample = async (layers: unknown, point: number[]) => {
      const surface = paint(layers, 20);
      const image = new Image();
      image.src = surface.href;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(image, 0, 0);
      return [
        ...ctx.getImageData(
          Math.round(((point[0] - surface.x) / surface.width) * image.width),
          Math.round(((point[1] - surface.y) / surface.height) * image.height),
          1,
          1,
        ).data,
      ];
    };
    const rear = { ...wheel, r: 15 },
      front = { ...wheel, x: 3 };
    return {
      fixed: await sample([{ wheels: [wheel] }, { wheels: [] }], [4, 3]),
      rotated: await sample([{ wheels: [{ ...wheel, phase: 127 }] }, { wheels: [] }], [4, 3]),
      front: await sample([{ wheels: [] }, { wheels: [front] }], [0, 0]),
      overlapping: await sample([{ wheels: [rear] }, { wheels: [front] }], [0, 0]),
    };
  });
  for (let channel = 0; channel < 4; channel++) {
    expect(Math.abs(pixels.fixed[channel] - pixels.rotated[channel])).toBeLessThanOrEqual(2);
    expect(Math.abs(pixels.front[channel] - pixels.overlapping[channel])).toBeLessThanOrEqual(2);
  }
});

test('Expanse psi pins and halos stay proportional in the shared magnified source', async ({
  page,
}) => {
  await page.goto('/#v=2&x=80&tau=-400&theme=expanse');
  const sizes = await page
    .locator('.psi-arms .arm-pin,.psi-arms .star-halo,[data-testid="psi-axle"] > circle')
    .evaluateAll((nodes) => nodes.map((n) => parseFloat(getComputedStyle(n).r)));
  expect(sizes.length).toBeGreaterThan(10);
  for (const r of sizes) expect(r).toBeLessThanOrEqual(1);
  await expect(page.locator('.lens-suspension')).toHaveCount(0);
  await centered(page);
});
