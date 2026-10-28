import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildArcPathData, getArcPoint, getStopProgress, sampleArcPoints } from '../js/journey/route-geometry.js';

describe('route arc', () => {
  it('starts on the left, peaks in the middle and ends on the right', () => {
    const start = getArcPoint(0);
    const middle = getArcPoint(0.5);
    const end = getArcPoint(1);

    assert.ok(start.x < middle.x && middle.x < end.x);
    assert.ok(middle.y < start.y && middle.y < end.y);
    assert.equal(start.y.toFixed(5), end.y.toFixed(5));
  });

  it('keeps every point inside the route box', () => {
    for (const { x, y } of sampleArcPoints(0, 1, 50)) {
      assert.ok(x > 0 && x < 100 && y > 0 && y < 100, `${x}, ${y} is outside`);
    }
  });

  it('spreads stops evenly from first to last', () => {
    assert.equal(getStopProgress(0, 6), 0);
    assert.equal(getStopProgress(5, 6), 1);
  });

  it('builds an SVG path that starts with a move command', () => {
    assert.match(buildArcPathData(), /^M [\d.]+ [\d.]+ L/);
  });
});
