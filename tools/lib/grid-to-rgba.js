import { getGridSize } from '../../js/pixel-art/sprite-grid.js';

// Expands every sprite pixel into a scale x scale block (nearest neighbour, so edges stay sharp).
export function gridToRgba(grid, scale) {
  const { width, height } = getGridSize(grid);
  const outputWidth = width * scale;
  const pixels = Buffer.alloc(outputWidth * height * scale * 4);

  grid.forEach((row, gridY) => {
    row.forEach((color, gridX) => {
      if (color === null) return;
      const [red, green, blue] = parseHexColor(color);

      for (let blockY = 0; blockY < scale; blockY += 1) {
        for (let blockX = 0; blockX < scale; blockX += 1) {
          const offset = ((gridY * scale + blockY) * outputWidth + gridX * scale + blockX) * 4;
          pixels[offset] = red;
          pixels[offset + 1] = green;
          pixels[offset + 2] = blue;
          pixels[offset + 3] = 255;
        }
      }
    });
  });

  return { width: outputWidth, height: height * scale, pixels };
}

function parseHexColor(hexColor) {
  const match = /^#([0-9a-f]{6})$/i.exec(hexColor);
  if (!match) throw new Error(`Only #rrggbb colors can be exported, got "${hexColor}".`);
  const value = parseInt(match[1], 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}
