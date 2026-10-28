import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { JOURNEY_STOPS } from '../js/content/journey-stops.js';
import { PEOPLE } from '../js/content/people.js';
import { addOutline, getGridSize, parseSpriteRows, stackLayers } from '../js/pixel-art/sprite-grid.js';
import {
  ACCESSORIES,
  FIGURE_HEIGHT,
  FIGURE_WIDTH,
  HAIR_STYLES,
  MOUTH_STYLES,
  OUTFITS,
} from '../js/sprites/character-layers.js';
import { buildBouquetGrid } from '../js/sprites/bouquet-sprite.js';
import { buildCharacterGrid } from '../js/sprites/character-sprite.js';
import { buildSparkleGrid } from '../js/sprites/sparkle-sprite.js';
import { buildPlanetGrid, PLANETS } from '../js/sprites/planet-sprite.js';
import { buildTurtleFrames, buildTurtleFrontGrid, TURTLE_FRONT_LEDGE_ROWS } from '../js/sprites/turtle-sprite.js';

// Characters get two outlines (dark line and lighter rim), one pixel each per side.
const OUTLINED_FIGURE_SIZE = { width: FIGURE_WIDTH + 4, height: FIGURE_HEIGHT + 4 };

describe('sprite grid', () => {
  it('rejects rows of different widths', () => {
    assert.throws(() => parseSpriteRows(['AA', 'A'], { A: '#ffffff' }), /row 1/);
  });

  it('rejects symbols without a color', () => {
    assert.throws(() => parseSpriteRows(['AZ'], { A: '#ffffff' }), /"Z"/);
  });

  it('lets lower layers show through transparent pixels', () => {
    const bottom = parseSpriteRows(['AA'], { A: '#000000' });
    const top = parseSpriteRows(['.B'], { B: '#ffffff' });
    assert.deepEqual(stackLayers([bottom, top]), [['#000000', '#ffffff']]);
  });

  it('outlines a sprite on its sides but not its corners', () => {
    const outlined = addOutline(parseSpriteRows(['A'], { A: '#ffffff' }), '#000000');
    assert.deepEqual(outlined, [
      [null, '#000000', null],
      ['#000000', '#ffffff', '#000000'],
      [null, '#000000', null],
    ]);
  });
});

describe('characters', () => {
  const basePerson = PEOPLE.sender;

  for (const [name, person] of Object.entries(PEOPLE)) {
    it(`builds the ${name} figure from people.js`, () => {
      assert.deepEqual(getGridSize(buildCharacterGrid(person)), OUTLINED_FIGURE_SIZE);
    });
  }

  for (const hairStyle of Object.keys(HAIR_STYLES)) {
    for (const outfit of Object.keys(OUTFITS)) {
      it(`builds a figure with ${hairStyle} hair, ${outfit} and every accessory`, () => {
        const grid = buildCharacterGrid({ ...basePerson, hairStyle, outfit, accessories: Object.keys(ACCESSORIES) });
        assert.deepEqual(getGridSize(grid), OUTLINED_FIGURE_SIZE);
      });
    }
  }

  it('names the available options when one is unknown', () => {
    assert.throws(() => buildCharacterGrid({ ...basePerson, hairStyle: 'mohawk' }), /Available/);
    assert.throws(() => buildCharacterGrid({ ...basePerson, mouthStyle: 'frown' }), /Available/);
    assert.throws(() => buildCharacterGrid({ ...basePerson, outfit: 'tuxedo' }), /Available/);
    assert.throws(() => buildCharacterGrid({ ...basePerson, accessories: ['crown'] }), /Available/);
  });
});

describe('planets and turtle', () => {
  it('has a sprite for every stop on the route, plus the sun', () => {
    for (const planetId of [...JOURNEY_STOPS.map((stop) => stop.planetId), 'sun']) {
      assert.ok(PLANETS[planetId], `missing planet ${planetId}`);
      assert.ok(getGridSize(buildPlanetGrid(planetId)).width > 0);
    }
  });

  it('builds the bouquet and the sparkle', () => {
    assert.ok(getGridSize(buildBouquetGrid()).width > 0);
    assert.deepEqual(getGridSize(buildSparkleGrid()), { width: 5, height: 5 });
  });

  it('builds the front-facing turtle with room for its ledge rows', () => {
    assert.ok(getGridSize(buildTurtleFrontGrid()).height > TURTLE_FRONT_LEDGE_ROWS);
  });

  it('builds turtle frames of the same size so they can swap in place', () => {
    const [firstFrame, secondFrame] = buildTurtleFrames();
    assert.deepEqual(getGridSize(firstFrame), getGridSize(secondFrame));
  });
});
