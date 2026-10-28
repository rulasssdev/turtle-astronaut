// How each of you looks in pixel art. Options come from js/sprites/character-layers.js:
//   hairStyle: sideSwept, wavyShort, pulledBackCurly, longCurly
//   outfit: buttonShirt, hoodieAndJeans, dress
//   mouthStyle: calm, softSmile, bigSmile
//   accessories: dimples, eyelashes, glasses, hoopEarrings, necklace, bracelet, watch, hoodieDetails
// After changing anything here, run `npm run build:images` so the link preview matches.
export const PEOPLE = {
  sender: {
    accessibleName: 'Tu Pichito en pixel art',
    hairStyle: 'sideSwept',
    outfit: 'buttonShirt',
    mouthStyle: 'calm',
    accessories: ['dimples', 'watch'],
    colors: {
      hair: '#16110f',
      hairTexture: '#4a382e',
      skin: '#c48a5f',
      skinShadow: '#9c6641',
      blush: '#cc8466',
      eyeWhite: '#f5ead6',
      iris: '#24160f',
      lips: '#8f4a3c',
      top: '#2a2b33',
      topShadow: '#191a20',
      outfitDetail: '#6a6c7a',
      bottom: '#bdbcb7',
      bottomShadow: '#93928e',
      shoes: '#3a3330',
    },
  },

  recipient: {
    accessibleName: 'Tú en pixel art',
    hairStyle: 'pulledBackCurly',
    outfit: 'dress',
    mouthStyle: 'softSmile',
    accessories: ['eyelashes', 'bracelet'],
    colors: {
      hair: '#141010',
      hairTexture: '#4d3a31',
      skin: '#d4a07c',
      skinShadow: '#b5815f',
      blush: '#d98479',
      eyeWhite: '#f5ead6',
      iris: '#24160f',
      lips: '#cf5b6e',
      top: '#d63a3a',
      topShadow: '#a82a2f',
      outfitDetail: '#f6b3bd',
      shoes: '#7a2a2a',
    },
  },
};
