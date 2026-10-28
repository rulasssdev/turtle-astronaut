import { addOutline, createEmptyGrid } from '../pixel-art/sprite-grid.js';
import { hashToUnitInterval } from '../utils/random.js';
import { SPRITE_OUTLINE_COLOR } from './outline-colors.js';

// Radii are in sprite pixels and roughly keep the real size order (Jupiter biggest, Mars smallest).
export const PLANETS = {
  // Not a stop: drawn at the center of the route. It is the light source, so it has no shadow side.
  sun: {
    radius: 8,
    surface: 'continents',
    isLightSource: true,
    colors: { base: '#f2c14e', shade: '#d98b2b', detail: '#f7dd7a' },
  },
  earth: {
    radius: 9,
    surface: 'continents',
    colors: { base: '#3f78c9', shade: '#2a5294', detail: '#5fae5a' },
  },
  mars: {
    radius: 7,
    surface: 'craters',
    colors: { base: '#c9603f', shade: '#8f3d2a', detail: '#a34b31' },
  },
  jupiter: {
    radius: 14,
    surface: 'bands',
    colors: { base: '#e0c29a', shade: '#9c7553', detail: '#b9805c' },
  },
  saturn: {
    radius: 11,
    surface: 'bands',
    colors: { base: '#e3c98f', shade: '#a68a55', detail: '#cdb078', ring: '#f1e2b8' },
  },
  uranus: {
    radius: 10,
    surface: 'plain',
    colors: { base: '#8fd3d6', shade: '#5b9da2' },
  },
  neptune: {
    radius: 10,
    surface: 'storm',
    colors: { base: '#3e6fd8', shade: '#27479a', detail: '#1f3a80' },
  },
};

const MARS_CRATER_OFFSETS = [
  [-3, -2],
  [-2, -2],
  [1, 2],
  [2, -4],
  [-1, 3],
];

// Each painter returns the surface color for one pixel, or null to keep the base color.
const SURFACE_PAINTERS = {
  plain: () => null,

  bands: ({ offsetY, radius, colors }) => (Math.floor((offsetY + radius) / 3) % 2 === 1 ? colors.detail : null),

  continents: ({ offsetX, offsetY, colors }) =>
    hashToUnitInterval(Math.floor((offsetX + 64) / 3), Math.floor((offsetY + 64) / 3), 7) > 0.58 ? colors.detail : null,

  craters: ({ offsetX, offsetY, colors }) =>
    MARS_CRATER_OFFSETS.some(([craterX, craterY]) => craterX === offsetX && craterY === offsetY) ? colors.detail : null,

  storm: ({ offsetX, offsetY, colors }) => {
    const spotX = (offsetX + 3) / 2.5;
    const spotY = (offsetY - 2) / 1.2;
    return spotX * spotX + spotY * spotY <= 1 ? colors.detail : null;
  },
};

const RING_WIDTH_FACTOR = 1.75;
const RING_HEIGHT_FACTOR = 0.32;
const RING_TILT = 0.18;

export function buildPlanetGrid(planetId) {
  const planet = PLANETS[planetId];
  if (!planet) throw new Error(`Unknown planet "${planetId}".`);

  const { radius, colors } = planet;
  const ring = colors.ring ? createRingShape(radius) : null;
  const halfWidth = ring ? ring.radiusX : radius;
  const grid = createEmptyGrid(halfWidth * 2 + 1, radius * 2 + 1);
  const paintSurface = SURFACE_PAINTERS[planet.surface];

  const planetGrid = grid.map((row, y) =>
    row.map((_, x) => {
      const offsetX = x - halfWidth;
      const offsetY = y - radius;
      const isPlanetPixel = offsetX * offsetX + offsetY * offsetY <= (radius + 0.5) ** 2;
      const ringPosition = ring ? ring.locate(offsetX, offsetY) : 'none';

      if (ringPosition === 'front') return colors.ring;
      if (isPlanetPixel) return paintPlanetPixel({ offsetX, offsetY, radius, colors, paintSurface, isLightSource: planet.isLightSource });
      if (ringPosition === 'back') return colors.ring;
      return null;
    }),
  );

  return addOutline(planetGrid, SPRITE_OUTLINE_COLOR);
}

function paintPlanetPixel({ offsetX, offsetY, radius, colors, paintSurface, isLightSource }) {
  // Light comes from the top left, so the bottom-right rim stays in shadow.
  const isInShadow = !isLightSource && offsetX + offsetY > radius * 0.55;
  if (isInShadow) return colors.shade;
  return paintSurface({ offsetX, offsetY, radius, colors }) ?? colors.base;
}

function createRingShape(planetRadius) {
  const radiusX = Math.round(planetRadius * RING_WIDTH_FACTOR);
  const radiusY = Math.max(2, Math.round(planetRadius * RING_HEIGHT_FACTOR));

  function locate(offsetX, offsetY) {
    const tiltedY = offsetY + offsetX * RING_TILT;
    const distance = (offsetX / radiusX) ** 2 + (tiltedY / radiusY) ** 2;
    const isOnRing = distance <= 1 && distance >= 0.55;
    if (!isOnRing) return 'none';
    return tiltedY >= 0 ? 'front' : 'back';
  }

  return { radiusX, locate };
}
