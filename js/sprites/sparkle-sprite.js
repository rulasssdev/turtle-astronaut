import { parseSpriteRows } from '../pixel-art/sprite-grid.js';

const SPARKLE_ROWS = [
  '..Y..',
  '..Y..',
  'YYWYY',
  '..Y..',
  '..Y..',
];

export function buildSparkleGrid() {
  return parseSpriteRows(SPARKLE_ROWS, { Y: '#f7dd7a', W: '#fffbe6' });
}
