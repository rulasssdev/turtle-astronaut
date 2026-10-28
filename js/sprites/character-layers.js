// Characters are chibi full-body sprites of 20x28 pixels (before the outline), built by stacking layers:
// hair back, body, outfit, mouth, hair front, accessories.
// Symbols map to an appearance color in character-sprite.js:
//   H hair, h second hair tone (texture), B eyebrows, S skin, s skin shadow, r blush,
//   W eye white, E iris, M lips, T teeth, C top, c top shadow, P bottom, p bottom shadow,
//   X outfit detail (buttons, print), K shoes, G glasses frame, A jewelry, w watch,
//   D drawstring, . transparent

export const FIGURE_WIDTH = 20;
export const FIGURE_HEIGHT = 28;

const EMPTY_ROW = '.'.repeat(FIGURE_WIDTH);

// Builds a full-height layer from only the rows that have pixels, e.g. { 7: '....GGGG....GGGG....' }.
function overlayRows(rowsByIndex) {
  return Array.from({ length: FIGURE_HEIGHT }, (_, rowIndex) => rowsByIndex[rowIndex] ?? EMPTY_ROW);
}

// Head, neck, arms and legs in skin; the outfit layer dresses it.
export const BODY_LAYER = [
  '....................',
  '....................',
  '....................',
  '......SSSSSSSS......',
  '....SSSSSSSSSSSS....',
  '...SSSSSSSSSSSSSS...',
  '...SSSSSSSSSSSSSS...',
  '...SSBBSSSSSSBBSS...',
  '..sSSEWSSSSSSEWSSs..',
  '..sSSEESSSSSSEESSs..',
  '...SSEESSSSSSEESS...',
  '...SrrSSSssSSSrrS...',
  '...SSSSSSSSSSSSSS...',
  '....SSSSSSSSSSSS....',
  '......SSSSSSSS......',
  '........ssss........',
  '......SSSSSSSS......',
  '.....SSSSSSSSSS.....',
  '.....SsSSSSSSsS.....',
  '.....SsSSSSSSsS.....',
  '.....SsSSSSSSsS.....',
  '.....SsSSSSSSsS.....',
  '.......SSSSSS.......',
  '.......SSSSSS.......',
  '.......SS..SS.......',
  '.......SS..SS.......',
  '.......SS..SS.......',
  '....................',
];

export const OUTFITS = {
  hoodieAndJeans: overlayRows({
    16: '......CCCCCCCC......',
    17: '.....CCCCCCCCCC.....',
    18: '.....CcCCCCCCcC.....',
    19: '.....CcCCCCCCcC.....',
    20: '.....CcCCCCCCcC.....',
    21: '......cCCCCCCc......',
    22: '.......CCCCCC.......',
    23: '.......PPPPPP.......',
    24: '.......PP..PP.......',
    25: '.......PP..PP.......',
    26: '.......PP..PP.......',
    27: '......KKK..KKK......',
  }),

  buttonShirt: overlayRows({
    16: '......CCcCCcCC......',
    17: '.....CCCCCXCCCC.....',
    18: '.....CcCCCCCCcC.....',
    19: '......cCCCXCCc......',
    20: '......cCCCCCCc......',
    21: '......cCCCXCCc......',
    22: '.......CCCCCC.......',
    23: '.......PPPPPP.......',
    24: '.......PP..PP.......',
    25: '.......PP..PP.......',
    26: '.......PP..PP.......',
    27: '......KKK..KKK......',
  }),

  dress: overlayRows({
    16: '.......CCCCCC.......',
    17: '......CCCCCCCC......',
    18: '.......CCXCCC.......',
    19: '.......CCCCXC.......',
    20: '......CCXCCCCC......',
    21: '......CCCCCXCC......',
    22: '......CCCCCCCC......',
    23: '......CXCCCCCC......',
    24: '.....CCCCCCXCCC.....',
    25: '.....CCCCCCCCCC.....',
    26: '.....cCCXCCCCCc.....',
    27: '.......KK..KK.......',
  }),
};

export const MOUTH_STYLES = {
  calm: overlayRows({
    12: '.........MM.........',
  }),
  softSmile: overlayRows({
    12: '........M..M........',
    13: '.........MM.........',
  }),
  bigSmile: overlayRows({
    12: '.......M....M.......',
    13: '........TTTT........',
  }),
};

// A hair style has a front layer (over the face) and an optional back layer (behind head and body).
export const HAIR_STYLES = {
  sideSwept: {
    front: overlayRows({
      1: '.....HHHHHHHHH......',
      2: '....HHHHHHHHHHHH....',
      3: '...HHHHHHHHHHHHHH...',
      4: '..HHHhhHHHHHHHHHHH..',
      5: '..HHHHHHHHHH...HHH..',
      6: '..HHHHHH.......HHH..',
      7: '..HH............HH..',
    }),
  },

  wavyShort: {
    front: overlayRows({
      0: '......HHhHHHH.......',
      1: '....HHHHHHHHHHhH....',
      2: '...HHhHHHHHHhHHHH...',
      3: '..HHHHHHHHHHHHHHHH..',
      4: '..HHHhHHHHHHHhHHHH..',
      5: '..HHHHHHHHHHHHHHHH..',
      6: '..HHHH.HHHHH.HHHHH..',
      7: '..HH............HH..',
    }),
  },

  // Pulled back with a middle part, and a curly ponytail behind the head.
  pulledBackCurly: {
    back: overlayRows({
      3: '................HHH.',
      4: '...............HHhHH',
      5: '...............HhHHH',
      6: '................HHHh',
      7: '................hHH.',
      8: '................HH..',
      9: '.................Hh.',
      10: '.................hH.',
      11: '................HHh.',
      12: '.................Hh.',
      13: '.................hH.',
      14: '................Hh..',
    }),
    front: overlayRows({
      1: '......HHHHHHHH......',
      2: '....HHHHHhHHHHHH....',
      3: '...HHHHHHhHHHHHHH...',
      4: '..HHHHHHHhHHHHHHHH..',
      5: '..HHHHH......HHHHH..',
      6: '..HHH..........HHH..',
      7: '..HH............HH..',
    }),
  },

  longCurly: {
    back: overlayRows({
      2: '....HHHHHHHHHHHH....',
      3: '..HHHHHHHHHHHHHHHH..',
      4: '.HHHHHHHHHHHHHHHHHH.',
      5: '.HHHHHHHHHHHHHHHHHH.',
      6: 'HHHHHHHHHHHHHHHHHHHH',
      7: 'HHHHHHHHHHHHHHHHHHHH',
      8: 'HHHHHHHHHHHHHHHHHHHH',
      9: 'HHHHHHHHHHHHHHHHHHHH',
      10: 'HHHHHHHHHHHHHHHHHHHH',
      11: 'HHHHHHHHHHHHHHHHHHHH',
      12: 'HHHHHHHHHHHHHHHHHHHH',
      13: 'HHHHHHHHHHHHHHHHHHHH',
      14: 'HHHHHHHHHHHHHHHHHHHH',
      15: 'HHHHHHHHHHHHHHHHHHHH',
      16: 'HHHHHHHHHHHHHHHHHHHH',
      17: 'HHHHHHHHHHHHHHHHHHHH',
      18: 'HHhHHHHHHHHHHHHHHhHH',
      19: 'hHHHHHHHHHHHHHHHHHHh',
      20: 'HhHHHHHHHHHHHHHHHHhH',
      21: 'HHHhHHHHHHHHHHHHhHHH',
      22: '.hHH............HHh.',
      23: '..h..............h..',
    }),
    front: overlayRows({
      0: '.....HHhHHHhHHH.....',
      1: '...HHHHHHhHHHHHHH...',
      2: '..HHhHHHHHHHHHhHHH..',
      3: '.HHHHHHHHHHHHHHHHHH.',
      4: '.HHhHHHHH..HHHHHhHH.',
      5: '.HHHHHH......HHHHHH.',
      6: 'HHHHH..........HHHHH',
      7: 'HHhH............HhHH',
      8: 'HHH..............HHH',
      9: 'HhH..............HhH',
      10: 'HHH..............HHH',
      11: 'HHHh............hHHH',
      12: 'hHHH............HHHh',
      13: 'HHhHH..........HHhHH',
      14: 'HHHHh..........hHHHH',
      15: 'hHHH............HHHh',
      16: 'HHhHH..........HHhHH',
      17: 'HHHHH..........HHHHH',
    }),
  },
};

// Accessories are drawn last, on top of hair and clothes.
export const ACCESSORIES = {
  dimples: overlayRows({
    12: '......s......s......',
  }),
  eyelashes: overlayRows({
    8: '....E..........E....',
  }),
  glasses: overlayRows({
    7: '....GGGG....GGGG....',
    8: '....G..GGGGGG..G....',
    9: '....G..G....G..G....',
    10: '....G..G....G..G....',
    11: '....GGGG....GGGG....',
  }),
  hoopEarrings: overlayRows({
    10: '..A..............A..',
    11: '..A..............A..',
  }),
  necklace: overlayRows({
    16: '........AAAA........',
    17: '.........AA.........',
  }),
  bracelet: overlayRows({
    21: '.....A..............',
  }),
  watch: overlayRows({
    21: '..............w.....',
  }),
  hoodieDetails: overlayRows({
    16: '......cccccccc......',
    17: '........D..D........',
    18: '........D..D........',
    20: '.......cccccc.......',
  }),
};
