// Builds assets/og-image.png (link preview) and assets/favicon.png from the same sprites the page uses.
// Run it again after changing people.js so the preview matches the new looks.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { PEOPLE } from '../js/content/people.js';
import { createEmptyGrid, paintGrid } from '../js/pixel-art/sprite-grid.js';
import { buildCharacterGrid } from '../js/sprites/character-sprite.js';
import { buildHeartGrid } from '../js/sprites/heart-sprite.js';
import { buildPlanetGrid } from '../js/sprites/planet-sprite.js';
import { buildTurtleFrames } from '../js/sprites/turtle-sprite.js';
import { createSeededRandom } from '../js/utils/random.js';
import { gridToRgba } from './lib/grid-to-rgba.js';
import { encodePng } from './lib/png-encoder.js';

const ASSETS_DIRECTORY = new URL('../assets/', import.meta.url);

const COLORS = {
  night: '#12152b',
  star: '#f5ead6',
  dimStar: '#6f6f86',
  path: '#d4cab8',
  heart: '#f28aa0',
};

// 120x63 sprite pixels scaled by 10 gives the 1200x630 size link previews expect.
const PREVIEW = { columns: 120, rows: 63, scale: 10 };
const FAVICON = { size: 26, scale: 2 };

function buildPreviewGrid() {
  const random = createSeededRandom(2024);
  let grid = createEmptyGrid(PREVIEW.columns, PREVIEW.rows, COLORS.night);

  for (let starIndex = 0; starIndex < 70; starIndex += 1) {
    const x = Math.floor(random() * PREVIEW.columns);
    const y = Math.floor(random() * PREVIEW.rows);
    grid[y][x] = random() > 0.7 ? COLORS.star : COLORS.dimStar;
  }

  // WhatsApp's small preview crops a centered square (columns 29 to 91), so the couple and
  // the turtle stay inside it; Neptune sits outside and only shows in the large preview.
  grid = paintGrid(grid, buildPlanetGrid('neptune'), 95, 4);

  // Dotted path from the turtle up to Neptune.
  for (let step = 0; step <= 8; step += 1) {
    grid[49 - Math.round(step * 2.6)][72 + step * 3] = COLORS.path;
  }

  grid = paintGrid(grid, buildCharacterGrid(PEOPLE.sender), 32, 13);
  grid = paintGrid(grid, buildCharacterGrid(PEOPLE.recipient), 58, 13);
  grid = paintGrid(grid, buildHeartGrid(COLORS.heart), 52, 5);
  grid = paintGrid(grid, buildTurtleFrames()[0], 46, 46);

  return grid;
}

function buildFaviconGrid() {
  const turtle = buildTurtleFrames()[0];
  const offsetY = Math.floor((FAVICON.size - turtle.length) / 2);
  return paintGrid(createEmptyGrid(FAVICON.size, FAVICON.size), turtle, 0, offsetY);
}

async function writePng(fileName, grid, scale) {
  const image = gridToRgba(grid, scale);
  const fileUrl = new URL(fileName, ASSETS_DIRECTORY);
  await writeFile(fileUrl, encodePng(image.width, image.height, image.pixels));
  console.log(`Generated ${fileURLToPath(fileUrl)} (${image.width}x${image.height})`);
}

await mkdir(ASSETS_DIRECTORY, { recursive: true });
await writePng('og-image.png', buildPreviewGrid(), PREVIEW.scale);
await writePng('favicon.png', buildFaviconGrid(), FAVICON.scale);
