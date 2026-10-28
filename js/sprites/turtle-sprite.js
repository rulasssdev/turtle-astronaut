import { addOutline, parseSpriteRows } from '../pixel-art/sprite-grid.js';
import { FIGURE_RIM_COLOR, SPRITE_OUTLINE_COLOR } from './outline-colors.js';

// R helmet rim, g helmet glass, w glass glint, T skin, e eye and mouth, K shell, k shell pattern, b belly.
const TURTLE_PALETTE = {
  R: '#d9dde8',
  g: '#7fb8e6',
  w: '#f5ffff',
  T: '#a7d98b',
  e: '#12152b',
  K: '#3d6b35',
  k: '#79c267',
  b: '#e8d9a8',
};

// Facing right, with the head inside an astronaut helmet.
const TURTLE_BODY_ROWS = [
  '................RRRR.',
  '...............RwgggR',
  '...............RwgTTR',
  '......KKKKKK...RgTTeR',
  '....KKkkKKkkKK.RgTTTR',
  '...KkkKKkkKKkkKRggggR',
  '..KKkkKKkkKKkkKTRRRR.',
  '..KKKKKKKKKKKKKTT....',
  'TTbbbbbbbbbbbbbbb....',
];

// Two leg poses; alternating them while moving makes the turtle walk.
const TURTLE_LEG_POSES = [
  ['...TT.......TT.......', '...TT.......TT.......'],
  ['....TT.....TT........', '....TT.....TT........'],
];

// Facing the viewer, with both front flippers in the bottom rows so it can rest them on a ledge.
const TURTLE_FRONT_ROWS = [
  '.....RRRRRRR.....',
  '....RwwgggggR....',
  '...RwgTTTTTggR...',
  '...RgTeTTTeTgR...',
  '...RgTTTTTTTgR...',
  '...RgTTTeTTTgR...',
  '....RgTTTTTgR....',
  '.....RRRRRRR.....',
  '..KKKKkTTTkKKKK..',
  '.KKkKbbbbbbbKkKK.',
  '.KkKKbbbbbbbKKkK.',
  '..KKKbbbbbbbKKK..',
  '...TTbbbbbbbTT...',
  '..TTT.......TTT..',
];

// Rows of TURTLE_FRONT_ROWS (plus both outlines) that rest on the ledge.
export const TURTLE_FRONT_LEDGE_ROWS = 4;

export function buildTurtleFrontGrid() {
  const turtle = parseSpriteRows(TURTLE_FRONT_ROWS, TURTLE_PALETTE);
  return addOutline(addOutline(turtle, SPRITE_OUTLINE_COLOR), FIGURE_RIM_COLOR);
}

export function buildTurtleFrames() {
  return TURTLE_LEG_POSES.map((legRows) => {
    const turtle = parseSpriteRows([...TURTLE_BODY_ROWS, ...legRows], TURTLE_PALETTE);
    return addOutline(addOutline(turtle, SPRITE_OUTLINE_COLOR), FIGURE_RIM_COLOR);
  });
}
