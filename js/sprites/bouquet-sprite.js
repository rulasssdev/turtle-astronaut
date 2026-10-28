import { addOutline, createEmptyGrid, paintGrid, parseSpriteRows } from '../pixel-art/sprite-grid.js';
import { FIGURE_RIM_COLOR, SPRITE_OUTLINE_COLOR } from './outline-colors.js';

const BOUQUET_WIDTH = 30;
const BOUQUET_HEIGHT = 34;

const COLORS = {
  backPaper: '#e3c9a8',
  wrap: '#c9a27e',
  wrapShade: '#a8805d',
  ribbon: '#e86a7f',
  ribbonShade: '#c44b62',
  leaf: '#5c9a5a',
  leafShade: '#3f7144',
};

// Each bloom is painted by its type's painter. Positions are the bloom center, in sprite pixels.
// Later blooms are painted on top of earlier ones.
const BLOOMS = [
  { type: 'gerbera', x: 13, y: 4, radius: 3, colors: { petal: '#f7a6bd', petalShade: '#e0809b', center: '#e0b04a' } },
  { type: 'hydrangea', x: 24, y: 10, radius: 4, colors: { base: '#a8d17a', shade: '#7fae55' } },
  { type: 'rose', x: 19, y: 6, radius: 4, colors: { base: '#f28aa0', shade: '#d9667f' } },
  { type: 'gerbera', x: 8, y: 10, radius: 5, colors: { petal: '#f48fb1', petalShade: '#d9668f', center: '#7a3b2e' } },
  { type: 'lily', x: 16, y: 14, radius: 5, colors: { petal: '#f5ead6', petalShade: '#d8cfc0', center: '#e0b04a' } },
  { type: 'gerbera', x: 23, y: 17, radius: 4, colors: { petal: '#f7a28a', petalShade: '#e07f68', center: '#7a3b2e' } },
  { type: 'rose', x: 7, y: 18, radius: 4, colors: { base: '#f7b6c8', shade: '#e08fa6' } },
];

const LEAF_ROWS = {
  left: ['..LL', '.LLl', 'LLl.', 'Ll..'],
  right: ['LL..', 'lLL.', '.lLL', '..lL'],
};

const LEAVES = [
  { shape: 'left', x: 0, y: 13 },
  { shape: 'right', x: 26, y: 13 },
  { shape: 'left', x: 3, y: 3 },
  { shape: 'right', x: 24, y: 2 },
  { shape: 'right', x: 12, y: 19 },
];

const BLOOM_PAINTERS = {
  // Petals alternate between two tones around a solid center.
  gerbera: ({ distance, angle, radius, colors }) => {
    if (distance <= radius * 0.4) return colors.center;
    const petalIndex = Math.floor(((angle + Math.PI) / (2 * Math.PI)) * 10);
    return petalIndex % 2 === 0 ? colors.petal : colors.petalShade;
  },

  // Rings of two tones read as rolled petals.
  rose: ({ distance, colors }) => (Math.floor(distance) % 2 === 0 ? colors.shade : colors.base),

  // A checker of two greens reads as many tiny florets.
  hydrangea: ({ offsetX, offsetY, colors }) => ((offsetX + offsetY) % 2 === 0 ? colors.base : colors.shade),

  // Three-lobed star with a small center.
  lily: ({ distance, angle, radius, colors }) => {
    const petalReach = radius * (0.45 + 0.55 * Math.abs(Math.cos(1.5 * angle)));
    if (distance > petalReach) return null;
    if (distance <= 1) return colors.center;
    return distance > petalReach - 1 ? colors.petalShade : colors.petal;
  },
};

export function buildBouquetGrid() {
  let grid = createEmptyGrid(BOUQUET_WIDTH, BOUQUET_HEIGHT);

  grid = paintBackPaper(grid);
  for (const leaf of LEAVES) {
    grid = paintGrid(grid, parseSpriteRows(LEAF_ROWS[leaf.shape], { L: COLORS.leaf, l: COLORS.leafShade }), leaf.x, leaf.y);
  }
  for (const bloom of BLOOMS) grid = paintBloom(grid, bloom);
  grid = paintWrap(grid);

  return addOutline(addOutline(grid, SPRITE_OUTLINE_COLOR), FIGURE_RIM_COLOR);
}

function paintBloom(grid, { type, x, y, radius, colors }) {
  const painter = BLOOM_PAINTERS[type];
  if (!painter) throw new Error(`Unknown bloom type "${type}".`);

  return grid.map((row, pixelY) =>
    row.map((existingColor, pixelX) => {
      const offsetX = pixelX - x;
      const offsetY = pixelY - y;
      const distance = Math.hypot(offsetX, offsetY);
      if (distance > radius + 0.5) return existingColor;

      const angle = Math.atan2(offsetY, offsetX);
      return painter({ offsetX, offsetY, distance, angle, radius, colors }) ?? existingColor;
    }),
  );
}

// Light paper fanning out behind the flowers.
function paintBackPaper(grid) {
  const center = { x: 14.5, y: 19 };
  const radius = { x: 14, y: 17 };

  return grid.map((row, y) =>
    row.map((color, x) => {
      const isInFan = y <= center.y && ((x - center.x) / radius.x) ** 2 + ((y - center.y) / radius.y) ** 2 <= 1;
      return isInFan ? COLORS.backPaper : color;
    }),
  );
}

// Kraft cone narrowing to the bottom, shaded on one side, with a ribbon around it.
function paintWrap(grid) {
  const top = { y: 20, left: 6, right: 23 };
  const bottom = { y: BOUQUET_HEIGHT - 1, left: 12, right: 17 };
  const ribbonRows = [27, 28];

  return grid.map((row, y) =>
    row.map((color, x) => {
      if (y < top.y) return color;
      const progress = (y - top.y) / (bottom.y - top.y);
      const left = Math.round(top.left + (bottom.left - top.left) * progress);
      const right = Math.round(top.right + (bottom.right - top.right) * progress);
      if (x < left || x > right) return color;

      const isRightHalf = x > (left + right) / 2;
      if (ribbonRows.includes(y)) return isRightHalf ? COLORS.ribbonShade : COLORS.ribbon;
      return isRightHalf ? COLORS.wrapShade : COLORS.wrap;
    }),
  );
}
