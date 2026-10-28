import { addOutline, parseSpriteRows } from '../pixel-art/sprite-grid.js';
import { SPRITE_OUTLINE_COLOR } from './outline-colors.js';

const HEART_ROWS = [
  '.HH.HH.',
  'HHHHHHH',
  'HHHHHHH',
  '.HHHHH.',
  '..HHH..',
  '...H...',
];

export function buildHeartGrid(color) {
  return addOutline(parseSpriteRows(HEART_ROWS, { H: color }), SPRITE_OUTLINE_COLOR);
}
