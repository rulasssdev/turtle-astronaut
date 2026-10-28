import { createAnimatedSpriteSvg, createSpriteSvg } from '../pixel-art/render-svg.js';
import { getGridSize } from '../pixel-art/sprite-grid.js';
import { buildBouquetGrid } from '../sprites/bouquet-sprite.js';
import { buildCharacterGrid } from '../sprites/character-sprite.js';
import { buildSparkleGrid } from '../sprites/sparkle-sprite.js';
import { buildHeartGrid } from '../sprites/heart-sprite.js';
import { buildPlanetGrid } from '../sprites/planet-sprite.js';
import { buildTurtleFrames, buildTurtleFrontGrid } from '../sprites/turtle-sprite.js';
import { LEG_FRAME_DURATION_MS, prefersReducedMotion } from './motion.js';

// Every sprite knows its pixel width, so CSS can draw all of them with the same pixel size.
function withPixelWidth(svg, grid) {
  svg.style.setProperty('--sprite-columns', getGridSize(grid).width);
  return svg;
}

export function createCharacterElement(person, className = 'sprite') {
  const grid = buildCharacterGrid(person);
  return withPixelWidth(createSpriteSvg(grid, { accessibleName: person.accessibleName, className }), grid);
}

export function createPlanetElement(planetId, { accessibleName, className = 'sprite' } = {}) {
  const grid = buildPlanetGrid(planetId);
  return withPixelWidth(createSpriteSvg(grid, { accessibleName, className }), grid);
}

export function createBouquetElement({ accessibleName, className = 'sprite' } = {}) {
  const grid = buildBouquetGrid();
  return withPixelWidth(createSpriteSvg(grid, { accessibleName, className }), grid);
}

export function createFrontTurtleElement({ accessibleName, className = 'sprite' } = {}) {
  const grid = buildTurtleFrontGrid();
  return withPixelWidth(createSpriteSvg(grid, { accessibleName, className }), grid);
}

export function createSparkleElement(className = 'sprite') {
  const grid = buildSparkleGrid();
  return withPixelWidth(createSpriteSvg(grid, { className }), grid);
}

export function createHeartElement(color, className = 'sprite') {
  const grid = buildHeartGrid(color);
  return withPixelWidth(createSpriteSvg(grid, { className }), grid);
}

export function createWalkingTurtle({ accessibleName, className = 'sprite' } = {}) {
  const frames = buildTurtleFrames();
  const sprite = createAnimatedSpriteSvg(frames, { accessibleName, className });
  withPixelWidth(sprite.element, frames[0]);

  let legTimerId = null;
  let currentFrame = 0;

  function startWalking() {
    if (legTimerId !== null || prefersReducedMotion()) return;
    legTimerId = setInterval(() => {
      currentFrame = (currentFrame + 1) % sprite.frameCount;
      sprite.showFrame(currentFrame);
    }, LEG_FRAME_DURATION_MS);
  }

  function stopWalking() {
    clearInterval(legTimerId);
    legTimerId = null;
    currentFrame = 0;
    sprite.showFrame(currentFrame);
  }

  return { element: sprite.element, startWalking, stopWalking };
}
