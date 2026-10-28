import { addOutline, parseSpriteRows, stackLayers } from '../pixel-art/sprite-grid.js';
import { ACCESSORIES, BODY_LAYER, HAIR_STYLES, MOUTH_STYLES, OUTFITS } from './character-layers.js';
import { FIGURE_RIM_COLOR, SPRITE_OUTLINE_COLOR } from './outline-colors.js';

const DEFAULT_ACCESSORY_COLORS = {
  glasses: '#20232f',
  jewelry: '#e0b04a',
  watch: '#c9ccd6',
  drawstring: '#d4cab8',
};

export function buildCharacterGrid(appearance) {
  const hairStyle = pickOption(HAIR_STYLES, appearance.hairStyle, 'hair style');
  const outfitLayer = pickOption(OUTFITS, appearance.outfit, 'outfit');
  const mouthLayer = pickOption(MOUTH_STYLES, appearance.mouthStyle, 'mouth style');
  const accessoryLayers = (appearance.accessories ?? []).map((name) => pickOption(ACCESSORIES, name, 'accessory'));

  const palette = createCharacterPalette(appearance.colors);
  const layersBottomToTop = [hairStyle.back, BODY_LAYER, outfitLayer, mouthLayer, hairStyle.front, ...accessoryLayers].filter(
    Boolean,
  );
  const figure = stackLayers(layersBottomToTop.map((layerRows) => parseSpriteRows(layerRows, palette)));

  return addOutline(addOutline(figure, SPRITE_OUTLINE_COLOR), FIGURE_RIM_COLOR);
}

function pickOption(options, name, kind) {
  const option = options[name];
  if (!option) {
    throw new Error(`Unknown ${kind} "${name}". Available: ${Object.keys(options).join(', ')}.`);
  }
  return option;
}

function createCharacterPalette(colors) {
  const accessoryColors = { ...DEFAULT_ACCESSORY_COLORS, ...colors };
  return {
    H: colors.hair,
    h: colors.hairTexture,
    B: colors.hair,
    S: colors.skin,
    s: colors.skinShadow,
    r: colors.blush,
    W: colors.eyeWhite,
    E: colors.iris,
    M: colors.lips,
    T: colors.eyeWhite,
    C: colors.top,
    c: colors.topShadow,
    P: colors.bottom,
    p: colors.bottomShadow,
    X: colors.outfitDetail,
    K: colors.shoes,
    G: accessoryColors.glasses,
    A: accessoryColors.jewelry,
    w: accessoryColors.watch,
    D: accessoryColors.drawstring,
  };
}
