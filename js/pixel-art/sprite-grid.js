// A sprite grid is an array of rows; each cell is a CSS color string or null (transparent).

const TRANSPARENT_SYMBOL = '.';

export function parseSpriteRows(rows, palette) {
  const expectedWidth = rows[0]?.length ?? 0;

  return rows.map((row, rowIndex) => {
    if (row.length !== expectedWidth) {
      throw new Error(`Sprite row ${rowIndex} has ${row.length} pixels, expected ${expectedWidth}.`);
    }

    return [...row].map((symbol) => {
      if (symbol === TRANSPARENT_SYMBOL) return null;

      const color = palette[symbol];
      if (!color) throw new Error(`No color defined for sprite symbol "${symbol}".`);
      return color;
    });
  });
}

export function getGridSize(grid) {
  return { width: grid[0]?.length ?? 0, height: grid.length };
}

export function createEmptyGrid(width, height, fillColor = null) {
  return Array.from({ length: height }, () => Array(width).fill(fillColor));
}

// Layers are ordered bottom to top; a transparent pixel lets the layer below show through.
export function stackLayers(layers) {
  const { width, height } = getGridSize(layers[0]);

  for (const layer of layers) {
    const size = getGridSize(layer);
    if (size.width !== width || size.height !== height) {
      throw new Error(`Cannot stack a ${size.width}x${size.height} layer onto a ${width}x${height} sprite.`);
    }
  }

  return createEmptyGrid(width, height).map((row, y) =>
    row.map((_, x) => {
      for (let layerIndex = layers.length - 1; layerIndex >= 0; layerIndex -= 1) {
        const color = layers[layerIndex][y][x];
        if (color !== null) return color;
      }
      return null;
    }),
  );
}

const SIDE_NEIGHBORS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

// Grows the sprite by one pixel on every side and paints a 1px outline around its silhouette.
export function addOutline(grid, outlineColor) {
  const { width, height } = getGridSize(grid);
  const paddedGrid = paintGrid(createEmptyGrid(width + 2, height + 2), grid, 1, 1);

  return paddedGrid.map((row, y) =>
    row.map((color, x) => {
      if (color !== null) return color;
      const touchesSprite = SIDE_NEIGHBORS.some(([offsetX, offsetY]) => paddedGrid[y + offsetY]?.[x + offsetX] != null);
      return touchesSprite ? outlineColor : null;
    }),
  );
}

// Returns a copy of targetGrid with sourceGrid painted on top at (offsetX, offsetY); pixels outside are dropped.
export function paintGrid(targetGrid, sourceGrid, offsetX, offsetY) {
  const paintedGrid = targetGrid.map((row) => [...row]);
  const target = getGridSize(targetGrid);

  sourceGrid.forEach((row, sourceY) => {
    row.forEach((color, sourceX) => {
      const x = offsetX + sourceX;
      const y = offsetY + sourceY;
      const isInside = x >= 0 && y >= 0 && x < target.width && y < target.height;
      if (color !== null && isInside) paintedGrid[y][x] = color;
    });
  });

  return paintedGrid;
}
