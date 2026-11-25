import { lensSample, lensRadiusAfterGlass, lensRestingPlace } from '../src/render/lens';
import { lensParallax } from '../src/core/optics';
import { complementaryRadius, psiGearWheels } from '../src/render/psi-gears';
import { ratchetGeometry } from '../src/render/ratchet';
import { applyThemePreset, themePresets } from '../src/core/theme-presets';
import { crossings, freshExperience, tickExperience } from '../src/core/experience';
import { psiOptics, containedLensScale, smoothLens, followLens } from '../src/core/optics';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { births, countedPsi, primePowers } from '../src/math/primes';
import { xiMechanism, psiMechanism, sieveAt, solveArms, sumMechanism } from '../src/core/mechanism';
import { zeta } from '../src/math/zeta';
import { zeroHeights } from '../src/math/zeros';
import {
  advance,
  decodePosition,
  encodePosition,
  initialState,
  wind,
  canAdvance,
} from '../src/core/state';
import { project, paneAngle, carriedPoint, CLOCK_RADIUS, WORLD } from '../src/core/layout';
import { sampleRecord, recordPaths, RECORD_STRIDE, RECORD_SETTLED } from '../src/math/record';
import { psiTip, passedZeros, trivialZeros } from '../src/math/psi';
import { panePath } from '../src/render/geometry';

const near = (a: number, b: number, tolerance = 1e-11) =>
  assert.ok(Math.abs(a - b) < tolerance, `${a} ≠ ${b}`);

test('prime-power ledger equals log lcm(1,…,n), including repeated powers', () => {
  const gcd = (a: bigint, b: bigint): bigint => (b ? gcd(b, a % b) : a);
  let lcm = 1n;
  for (let n = 1; n <= 128; n++) {
    lcm = (lcm / gcd(lcm, BigInt(n))) * BigInt(n);
    near(countedPsi(n), Math.log(Number(lcm)));
  }
  assert.deepEqual(
    primePowers(10).map((e) => e.q),
    [2, 3, 4, 5, 7, 8, 9],
  );
  for (const e of births) near(countedPsi(e.q) - countedPsi(e.q - 1e-8), Math.log(e.p));
});

test('pane contacts reconstruct the integer and reversals have no history', () => {
  for (let n = 2; n <= 128; n++) {
    const contacts = sieveAt(n).panes.filter((p) => p.active);
    assert.equal(
      contacts.reduce((product, pane) => product * pane.p, 1),
      n,
    );
  }
  const before = sieveAt(24.5);
  sieveAt(100);
  assert.deepEqual(sieveAt(24.5), before);
  assert.equal(sieveAt(8).panes.find((p) => p.q === 8)?.growth, 0);
  assert.equal(sieveAt(9).panes.find((p) => p.q === 8)?.growth, 1);
});

test('xi arms close on the real axis at sigma=1/2 and respond off the line', () => {
  for (const tau of [-15, -7, 0, 7, zeroHeights[0], 15]) {
    const m = xiMechanism(0.5, tau);
    near(m.endpoint[1], 0);
    near(m.arms.at(-1)!.end[0], m.endpoint[0]);
    near(m.arms.at(-1)!.end[1], m.endpoint[1]);
  }
  near(xiMechanism(0.5, 0).endpoint[0], 0.4971207781883141);
  assert.ok(Math.hypot(...xiMechanism(0.5, zeroHeights[0]).endpoint) < 1e-12);
  const off = xiMechanism(0.8, zeroHeights[0]);
  assert.ok(Math.abs(off.endpoint[1]) > 1e-4);
  assert.notEqual(off.arms[0].length, off.arms[1].length);
  const reflected = xiMechanism(0.2, -zeroHeights[0]);
  near(off.endpoint[0], reflected.endpoint[0]);
  near(off.endpoint[1], reflected.endpoint[1]);
});

test('psi projected endpoint agrees with the independent real explicit formula', () => {
  for (const x of [2, 8, 24.5, 60.5, 128])
    for (const count of [0, 1, 12, 30, 649]) {
      const m = psiMechanism(x, count);
      let expected = x - Math.log(2 * Math.PI) - 0.5 * Math.log(1 - x ** -2);
      for (const g of zeroHeights.slice(0, count)) {
        expected -=
          (2 * Math.sqrt(x) * (0.5 * Math.cos(g * Math.log(x)) + g * Math.sin(g * Math.log(x)))) /
          (0.25 + g * g);
      }
      near(m.approximation, expected);
      near(m.anchor + m.tip[0], expected);
    }
  assert.notEqual(
    psiMechanism(8, 12).approximation,
    countedPsi(8),
    'do not erase truncation error',
  );
});

test('zeta reference handles real input, a known zero, conjugation, and the pole', () => {
  near(zeta(2, 0)[0], Math.PI ** 2 / 6);
  assert.ok(Math.hypot(...zeta(0.5, zeroHeights[0])) < 1e-11);
  const a = zeta(0.8, 9),
    b = zeta(0.8, -9);
  near(a[0], b[0]);
  near(a[1], -b[1]);
  assert.deepEqual(zeta(1, 0), [Infinity, Infinity]);
});

test('positions restore every parameter and reject corrupt or unsupported input', () => {
  const state = {
    ...initialState,
    x: 60.5,
    theme: 'expanse' as const,
    psiMount: 'lower-left' as const,
    psiScale: 9.3,
    linked: false,
    ratio: 2,
  };
  assert.deepEqual(decodePosition(encodePosition(state)), state);
  assert.equal(decodePosition('').theme, 'analytic');
  assert.equal(decodePosition('#v=2&x=24').theme, 'analytic');
  assert.equal(decodePosition('#v=2&x=24&theme=clockwork').theme, 'clockwork');
  assert.deepEqual(decodePosition(encodePosition(initialState)), initialState);
  const bad = decodePosition('#v=1&x=NaN&tau=Infinity&sigma=100&zeros=2.4&zoom=-5&theme=unknown');
  assert.equal(bad.x, initialState.x);
  assert.equal(bad.tau, initialState.tau);
  assert.equal(bad.sigma, 0.5);
  assert.equal(bad.zeros, 2);
  assert.deepEqual(decodePosition('#v=999&sigma=3'), initialState);
});

test('playback links x and tau 1:-1 by default and preserves the optics', () => {
  const next = advance(initialState, 0.016);
  assert.equal(initialState.drive, 'x');
  assert.equal(initialState.sigma, 0.5);
  assert.ok(next.x > initialState.x);
  assert.ok(next.tau < initialState.tau);
  near(next.x - initialState.x, initialState.tau - next.tau);
  assert.equal(next.psiScale, initialState.psiScale);
  assert.equal(next.psiMount, initialState.psiMount);
  const count = advance({ ...initialState, drive: 'x', linked: false }, 0.016);
  assert.equal(count.tau, initialState.tau);
  assert.ok(count.x > initialState.x);
  assert.equal(advance({ ...initialState, linked: false, x: 5000 }, 1).x, 5000);
  // Linked 1:−1, the shafts stop together where τ reaches the verified zero height.
  assert.equal(advance({ ...initialState, x: 1000, tau: -1000 }, 1).x, 1000);
  assert.throws(() =>
    solveArms([
      {
        id: 'bad',
        parent: 'missing',
        length: 1,
        phase: 0,
        family: 0,
        label: '',
        drive: { coordinate: 'tau', rate: 1 },
      },
    ]),
  );
});

test('linked scrubbing is reversible, keeps its offset, and stops both shafts at bounds', () => {
  const start = { ...initialState, x: 24, tau: 31, ratio: 2 };
  const wound = wind(start, 'x', 30);
  near(wound.tau, 43);
  assert.deepEqual(wind(wound, 'x', 24), start);
  const reverse = wind(start, 'tau', 29);
  near(reverse.x, 23);
  const end = wind({ ...initialState, x: 127, tau: 999, ratio: 2 }, 'x', 128);
  near(end.x, 127.5);
  near(end.tau, 1000);
  assert.equal(canAdvance(end), false);
  const unlinked = wind({ ...initialState, linked: false }, 'tau', -500);
  assert.equal(unlinked.x, initialState.x);
  assert.equal(unlinked.tau, -500);
  const tauOnly = advance({ ...initialState, drive: 'tau', linked: false }, 0.05);
  assert.equal(tauOnly.x, initialState.x);
  assert.ok(tauOnly.tau > initialState.tau);
});

test('counterclockwise arcs and carried ink have the same complex-plane orientation', () => {
  assert.deepEqual(project([1, 0], 10), [10, -0]);
  assert.deepEqual(project([0, 1], 10), [0, -10]);
  for (const q of [2, 3, 8, 13]) {
    const now = q + 0.5,
      a = paneAngle(q, now);
    const ink = carriedPoint([q, 0], q, now);
    near(ink[0], ((CLOCK_RADIUS * q) / now) * Math.cos(a));
    near(ink[1], ((-CLOCK_RADIUS * q) / now) * Math.sin(a));
    assert.ok(ink[1] < 0, 'first motion rises above the real axis');
  }
  const arc = panePath(100, Math.PI / 2, Math.PI / 4);
  assert.ok(
    !arc.includes('Z') && !arc.includes('L'),
    'panes are open annular arcs, not filled sectors',
  );
});

test('Dirichlet vectors are all present at full length with the n^-s phase law', () => {
  assert.equal(sumMechanism(0.5, 0).arms.length, 128);
  near(sumMechanism(0.5, 12, 1).endpoint[0], 1);
  near(sumMechanism(0.5, 12, 1).endpoint[1], 0);
  const m = sumMechanism(0.7, 4, 8);
  let re = 0,
    im = 0;
  for (let n = 1; n <= 8; n++) {
    const r = n ** -0.7,
      phase = -4 * Math.log(n);
    re += r * Math.cos(phase);
    im += r * Math.sin(phase);
  }
  near(m.endpoint[0], re);
  near(m.endpoint[1], im);
  near(m.arms.at(-1)!.length, 8 ** -0.7);
});

test('the recovered reference table resolves 649 zeros, including high heights', () => {
  assert.equal(zeroHeights.length, 649);
  for (const i of [0, 29, 100, 400, 648])
    assert.ok(Math.hypot(...zeta(0.5, zeroHeights[i])) < 1e-9);
  for (let i = 1; i < zeroHeights.length; i++) assert.ok(zeroHeights[i] > zeroHeights[i - 1]);
  assert.equal(passedZeros(14), 0);
  assert.equal(passedZeros(24), 2);
  assert.equal(passedZeros(1000), 649);
});

test('the inscription ends at its stylus and rewinding reproduces the same record', () => {
  const rows = sampleRecord(30, 12);
  assert.deepEqual([...rows.slice(0, RECORD_STRIDE)], [1, 0, 0], 'the record starts at the origin');
  for (let i = RECORD_STRIDE; i < rows.length; i += RECORD_STRIDE) {
    const x = rows[i],
      model = psiMechanism(x, 30);
    assert.ok(x >= RECORD_SETTLED);
    near(rows[i + 1], model.approximation);
    near(rows[i + 2], model.tip[1]);
  }
  const x = 8.25,
    p = carriedPoint(psiTip(x, 30), x, x);
  const before = recordPaths(rows, x, 30);
  assert.ok(before.reference.endsWith(`L${p[0]},${p[1]}`));
  recordPaths(rows, 11, 30);
  assert.deepEqual(recordPaths(rows, x, 30), before);
});

test('public positions and animation normalize sigma and discard legacy pan', () => {
  for (const version of [1, 2]) {
    const state = decodePosition(`#v=${version}&x=42&sigma=.8&panX=500&panY=-350`);
    assert.equal(state.x, 42);
    assert.equal(state.sigma, 0.5);
    assert.ok(!('panX' in state) && !('panY' in state));
  }
  const off = { ...initialState, sigma: 0.8 };
  assert.equal(advance(off, 0.02).sigma, 0.5);
  assert.equal(wind(off, 'x', NaN).sigma, 0.5);
  assert.equal(decodePosition(encodePosition(off)).sigma, 0.5);
});

test('signed gearing preserves offsets, both limits, both drives, and reversibility', () => {
  for (const ratio of [-1, -2 * Math.PI, -0.1, 2]) {
    const start = { ...initialState, x: 24, ratio, tau: 7 };
    for (const coordinate of ['x', 'tau'] as const) {
      const target = coordinate === 'x' ? 40 : 7 + ratio * 16;
      const end = wind(start, coordinate, target);
      near(end.x, 40);
      near(end.tau, 7 + ratio * 16);
      near(wind(end, coordinate, start[coordinate]).x, start.x);
      near(wind(end, coordinate, start[coordinate]).tau, start.tau);
    }
    for (const direction of [-1, 1]) {
      const start = {
        ...initialState,
        ratio,
        direction,
        x: 60,
        tau: direction * Math.sign(ratio) * 999.9,
      };
      const end = wind(start, 'x', direction > 0 ? 128 : 2);
      near(Math.abs(end.tau), 1000);
      near(end.tau - start.tau, ratio * (end.x - start.x));
      assert.equal(canAdvance(end), false);
      assert.ok(canAdvance({ ...end, direction: -direction }));
    }
    assert.equal(decodePosition(encodePosition(start)).ratio, ratio);
  }
  for (const raw of ['0', 'NaN', 'Infinity', '.01'])
    assert.equal(decodePosition('#v=2&ratio=' + raw).ratio, -1);
  const a = advance(initialState, 0.02);
  const b = advance({ ...a, direction: -1 }, 0.02);
  near(b.x, initialState.x);
  near(b.tau, initialState.tau);
});

test('lens fit covers psi geometry and has bounded, smoothed motion', () => {
  for (const x of [2, 8, 24, 80, 128]) {
    const state = { ...initialState, x };
    const m = psiMechanism(x, state.zeros),
      optics = psiOptics(state, m);
    assert.ok(Number.isFinite(optics.scale));
    const unit = CLOCK_RADIUS / x;
    const axle = [WORLD.centre[0] + m.anchor * unit, WORLD.centre[1]];
    for (const arm of m.arms) {
      const edge =
        Math.hypot(
          axle[0] + arm.start[0] * unit - optics.focus.x,
          axle[1] - arm.start[1] * unit - optics.focus.y,
        ) +
        arm.length * unit;
      assert.ok(edge * optics.scale <= state.lensRadius * 0.8200001);
    }
    assert.deepEqual(psiMechanism(x, state.zeros), m);
  }
  assert.ok(smoothLens(7, 7.5, 0.05) > 7);
  assert.ok(smoothLens(7, 3, 0.05) < 7 && smoothLens(7, 3, 0.05) > 3);
  assert.ok(smoothLens(7, 20, 0.05) > 7 && smoothLens(7, 20, 0.05) < 20);
});

test('finitely many trivial zeros match the closed form away from x = 1', () => {
  for (const x of [1.05, 1.2, 2, 50]) near(trivialZeros(x), -0.5 * Math.log(1 - x ** -2), 1e-12);
  assert.ok(Number.isFinite(trivialZeros(1)));
});

test('the two zero branches meet tip to tail and end on the real axis', () => {
  for (const x of [1.00001, 1.5, 2, 8.25, 37, 100]) {
    for (const count of [1, 30, 649]) {
      const model = psiMechanism(x, count);
      // The conjugate branch retraces the chain from its finest term outward.
      let [re, im] = model.branchTip;
      for (const arm of [...model.arms].reverse()) {
        re += arm.end[0] - arm.start[0];
        im -= arm.end[1] - arm.start[1];
      }
      re += model.offset;
      near(im, 0);
      near(re + model.anchor, psiTip(x, count)[0]);
      near(model.tip[0], re);
      near(model.tip[1], 0);
    }
  }
  // At x = 1 every zero vector −1/ρ points up: the chain starts fully extended.
  const start = psiMechanism(1, 649);
  for (const arm of start.arms) assert.ok(Math.abs(arm.phase - Math.PI / 2) < 0.04);
  assert.ok(Number.isFinite(start.offset) && start.offset > 0);
});

test('material rotation has continuous period independent of a count discontinuity', () => {
  const a = carriedPoint([10, 0], 20, 60),
    b = carriedPoint([12, 0], 20, 60);
  near(a[0] / 10, b[0] / 12);
  near(a[1] / 10, b[1] / 12);
  const before = carriedPoint([10, 1], 20 - 1e-7, 60),
    after = carriedPoint([10, 1], 20 + 1e-7, 60);
  assert.ok(Math.hypot(before[0] - after[0], before[1] - after[1]) < 0.0001);
});

test('events cross intervals once, distinguish powers, and include negative heights', () => {
  const g = zeroHeights[0];
  assert.deepEqual(
    crossings({ x: 6.9, tau: -g + 0.01 }, { x: 7, tau: -g }).map((e) => e.kind),
    ['prime', 'zero'],
  );
  assert.equal(crossings({ x: 7, tau: -g }, { x: 7.1, tau: -g - 0.01 }).length, 0);
  assert.equal(crossings({ x: 7.9, tau: 0 }, { x: 8.1, tau: 0 })[0].kind, 'power');
  assert.ok(
    crossings({ x: 9, tau: -16 }, { x: 6, tau: 16 }).filter((e) => e.kind === 'zero').length === 2,
  );
  assert.equal(crossings({ x: 8, tau: 10 }, { x: 8, tau: 10 }).length, 0);
});

test('trail memory and lifetime are bounded independently of frame count', () => {
  let memory = freshExperience(),
    state = { x: 24, tau: -24 };
  for (let i = 0; i < 1000; i++) {
    const next = { x: state.x + 0.001, tau: state.tau - 0.01 };
    memory = tickExperience(memory, state, next, 0.05, 2, true);
    state = next;
  }
  assert.ok(memory.trail.length <= 51);
  assert.ok(memory.trail.every((p) => p.age < 2));
  assert.ok(memory.moments.length <= 24);
  assert.equal(tickExperience(memory, state, state, 0.05, 2, false).trail.length, 0);
  assert.deepEqual(freshExperience().trail, []);
});

test('lens zooms out with its continuous target and eases back in', () => {
  assert.equal(followLens(10, 4, 0.016), 4);
  const eased = followLens(4, 10, 0.016);
  assert.ok(eased > 4 && eased < 10);
});

test('the look-ahead lens is continuous through a prime power and frames it beforehand', () => {
  for (const q of [7, 8, 37]) {
    let last: ReturnType<typeof psiOptics> | null = null;
    for (let x = q - 0.3; x < q + 0.3; x += 0.002) {
      const optics = psiOptics({ ...initialState, x, tau: -x });
      if (last) {
        // A frame's step changes the scale by a few percent at most.
        assert.ok(Math.abs(Math.log(optics.scale / last.scale)) < 0.05, `scale jump at ${x}`);
        assert.ok(
          Math.hypot(optics.focus.x - last.focus.x, optics.focus.y - last.focus.y) * optics.scale <
            0.08 * initialState.lensRadius,
          `focus jump at ${x}`,
        );
      }
      // Containment does not need to cut in: the fit already holds both tips.
      assert.ok(optics.scale <= optics.tipLimit * 1.0000001, `tip cap engaged at ${x}`);
      last = optics;
    }
  }
});

test('live lens guard contains reference and developing tips regardless of the smoothing window', () => {
  for (const x of [2, 6.95, 7, 7.05, 31, 97, 128])
    for (const tau of [-900, -14, 0, 200])
      for (const lensFocus of ['mechanism', 'axle', 'tip'] as const) {
        const state = {
          ...initialState,
          x,
          tau,
          lensFocus,
          lensRadius: 70,
          lensDx: 250,
          lensDy: -400,
        };
        const optics = psiOptics(state),
          scale = containedLensScale(30, optics);
        for (const tip of optics.tips)
          assert.ok(
            Math.hypot(tip[0] - optics.focus.x, tip[1] - optics.focus.y) * scale <=
              state.lensRadius * 0.9000001,
          );
      }
});
test('theme presets preserve winding and main camera state', () => {
  for (const preset of themePresets) {
    const start = { ...initialState, x: 37.2, tau: -81.3, ratio: -2 * Math.PI };
    const next = applyThemePreset(start, preset);
    assert.deepEqual([next.x, next.tau, next.ratio], [start.x, start.tau, start.ratio]);
    assert.deepEqual(decodePosition(encodePosition(next)), next);
  }
});
test('paused trail opacity can decay without creating samples or events', () => {
  const memory = {
    ...freshExperience(),
    trail: [
      { re: 1, im: 2, age: 0 },
      { re: 2, im: 3, age: 0 },
    ],
  };
  const point = { x: 24, tau: -24 };
  const faded = tickExperience(memory, point, point, 0.5, 1, true);
  assert.equal(faded.trail[0].age, 0.5);
  assert.equal(faded.trail.length, 2);
  assert.equal(faded.moments.length, 0);
  assert.equal(tickExperience(faded, point, point, 1, 1, true).trail.length, 0);
});

test('ratchet uses weighted prime-power teeth and is reversible', () => {
  for (const x of [2, 3.9, 4, 7.99, 8, 37, 80, 128]) {
    const unit = 320 / x,
      model = ratchetGeometry(x, unit);
    near(model.stop, countedPsi(x) * unit);
    assert.deepEqual(
      model.teeth.map((t) => t.q),
      births.filter((b) => b.q <= x).map((b) => b.q),
    );
    model.teeth.forEach((tooth, i) => near(tooth.right - tooth.left, births[i].rise * unit));
    ratchetGeometry(128, 2.5);
    assert.deepEqual(ratchetGeometry(x, unit), model);
  }
});

test('ordered psi gears retain every axle, foreground silver layer and tangent complementary pinions', () => {
  for (const x of [2, 37.25, 128]) {
    const arms = psiMechanism(x, 649).arms,
      scale = 320 / x;
    const layers = psiGearWheels(arms, scale, 5);
    assert.equal(layers[0].wheels.length, 5);
    assert.equal(layers[1].wheels.length, 644);
    const wheels = layers.flatMap((l) => l.wheels);
    assert.deepEqual(
      wheels.map((w) => w.id),
      Array.from({ length: 649 }, (_, i) => i),
    );
    wheels.forEach((w, i) => {
      near(w.x, arms[i].start[0] * scale);
      near(w.y, -arms[i].start[1] * scale);
      assert.ok(w.edge <= w.r * 0.025 + 1e-9);
      assert.ok(w.axle > 0);
    });
    assert.ok(!/NaN|Infinity/.test(JSON.stringify(layers)));
    for (let i = 0; i < arms.length - 1; i++) {
      const a = arms[i],
        b = arms[i + 1],
        r = a.length * scale,
        next = b.length * scale;
      near(
        complementaryRadius(r, next) + next,
        Math.hypot(a.start[0] - b.start[0], a.start[1] - b.start[1]) * scale,
      );
    }
  }
});

test('lens parallax changes the sampled source while preserving current tip containment', () => {
  const optics = {
      focus: { x: 400, y: 250 },
      tips: [
        [415, 260],
        [380, 230],
      ],
    },
    home = { x: 120, y: 120 };
  for (const angle of [0, 30, -90])
    for (const scale of [0.1, 2, 30])
      for (const dx of [-1000, 0, 80]) {
        const lens = { x: 120 + dx, y: 150, r: 110 };
        const result = lensParallax(optics, lens, home, scale, angle);
        assert.ok(Math.hypot(result.focus.x - optics.focus.x, result.focus.y - optics.focus.y) > 0);
        for (const tip of optics.tips)
          assert.ok(
            Math.hypot(tip[0] - result.focus.x, tip[1] - result.focus.y) * result.scale <=
              99 + 1e-9,
          );
      }
});

test('subtle radial glass is monotone, has an unchanged rim, and contains the guarded tips', () => {
  near(lensSample(0, 0).x, 0);
  near(lensSample(1, 0).x, 1);
  let previous = -1;
  for (let i = 0; i <= 100; i++) {
    const r = i / 100,
      sample = lensSample(r, 0).x;
    assert.ok(sample > previous);
    near(lensRadiusAfterGlass(sample), r, 1e-8);
    previous = sample;
  }
  for (const x of [2, 7, 24, 97, 128])
    for (const tau of [-900, 0, 37]) {
      const optics = psiOptics({ ...initialState, x, tau });
      const lens = { x: 1000, y: -200, r: 70 };
      const glass = lensParallax(optics, lens, { x: 0, y: 0 }, 30, 45);
      assert.ok(Math.hypot(glass.depth.x, glass.depth.y) * glass.scale <= lens.r * 0.035 + 1e-9);
      for (const tip of optics.tips) {
        const radius =
          (Math.hypot(tip[0] - glass.focus.x, tip[1] - glass.focus.y) * glass.scale) / lens.r;
        assert.ok(lensRadiusAfterGlass(radius) < 0.9);
      }
    }
});

test('lens rests at psi when space allows and yields to the permanent controls', () => {
  const target = { x: 900, y: 550 };
  assert.deepEqual(lensRestingPlace(target, 120, 1440, 900, 120), target);
  const desktop = lensRestingPlace({ x: 280, y: 350 }, 148, 1440, 900, 430);
  assert.ok(desktop.x - 148 > 196);
  const phone = lensRestingPlace({ x: 300, y: 280 }, 52, 320, 568, 360);
  assert.ok(phone.x - 52 >= 204);
  assert.ok(phone.y + 52 + 76 <= 472);
});

test('zeta matches the 66 mpmath reference values carried from the predecessor', async () => {
  const { readFileSync } = await import('node:fs');
  const rows: number[][] = JSON.parse(
    readFileSync(new URL('./fixtures/zeta-reference.json', import.meta.url), 'utf8'),
  );
  assert.equal(rows.length, 66);
  for (const [sigma, tau, re, im] of rows) {
    const z = zeta(sigma, tau),
      scale = Math.max(1, Math.hypot(re, im));
    // Near the pole only the size, not 1e-12 digits, is meaningful.
    const tolerance = Math.hypot(sigma - 1, tau) < 1e-3 ? 1e-4 : 1e-9;
    assert.ok(
      Math.hypot(z[0] - re, z[1] - im) / scale < tolerance,
      `ζ(${sigma} + ${tau}i) = ${z} against ${re}, ${im}`,
    );
  }
});

test('the prime-power ledger runs through 5000 with independent counts', () => {
  const primes = births.filter((b) => b.k === 1);
  assert.equal(primes.length, 669); // π(5000)
  assert.equal(births.at(-1)!.q, 4999);
  let psi = 0;
  for (let n = 2; n <= 5000; n++) {
    // Trial division: n counts when it is a power of its least prime factor.
    let p = 2;
    while (n % p) p++;
    let m = n;
    while (m % p === 0) m /= p;
    if (m === 1) psi += Math.log(p);
  }
  near(countedPsi(5000), psi, 1e-9);
});
