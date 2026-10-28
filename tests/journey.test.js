import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { JOURNEY_STOPS } from '../js/content/journey-stops.js';
import { Journey } from '../js/journey/journey.js';

describe('Journey', () => {
  it('starts at the first stop', () => {
    const journey = new Journey(JOURNEY_STOPS);
    assert.equal(journey.currentStopIndex, 0);
    assert.equal(journey.currentStop.planetId, 'earth');
    assert.equal(journey.hasArrived, false);
  });

  it('flags the step before the destination and the arrival', () => {
    const journey = new Journey(JOURNEY_STOPS);
    while (!journey.isOneStepFromArrival) journey.advance();

    assert.equal(journey.currentStop.planetId, 'uranus');
    journey.advance();
    assert.equal(journey.hasArrived, true);
    assert.equal(journey.currentStop.planetId, 'neptune');
  });

  it('refuses to walk past the destination', () => {
    const journey = new Journey(JOURNEY_STOPS);
    while (!journey.hasArrived) journey.advance();
    assert.throws(() => journey.advance());
  });

  it('goes back to the first stop on restart', () => {
    const journey = new Journey(JOURNEY_STOPS);
    journey.advance();
    journey.advance();
    journey.restart();
    assert.equal(journey.currentStopIndex, 0);
  });

  it('needs at least two stops', () => {
    assert.throws(() => new Journey([JOURNEY_STOPS[0]]));
  });
});
