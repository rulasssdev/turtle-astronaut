import { getRequiredElement, getSlot } from '../ui/dom.js';
import { createBouquetElement, createSparkleElement } from '../ui/sprite-elements.js';

// Where each sparkle sits around the bouquet, as percentages of the bouquet box.
const SPARKLE_POSITIONS = [
  { left: 8, top: 12 },
  { left: 88, top: 6 },
  { left: -4, top: 48 },
  { left: 102, top: 40 },
  { left: 14, top: 82 },
  { left: 90, top: 76 },
  { left: 50, top: -8 },
  { left: 30, top: 30 },
  { left: 70, top: 24 },
];

export function createFlowersScene(sceneElement, { messages, onContinue }) {
  getSlot(sceneElement, 'bouquet').append(
    createBouquetElement({ accessibleName: messages.flowers.bouquetName, className: 'sprite sprite--bouquet sprite--floating' }),
  );
  renderSparkles(getSlot(sceneElement, 'bouquet-sparkles'));

  const continueButton = getRequiredElement(sceneElement, '[data-action="begin-journey"]');
  continueButton.addEventListener('click', onContinue);

  return { element: sceneElement, focusTarget: continueButton };
}

function renderSparkles(layer) {
  const sparkles = SPARKLE_POSITIONS.map(({ left, top }, sparkleIndex) => {
    const sparkle = createSparkleElement('sprite sprite--sparkle');
    sparkle.style.left = `${left}%`;
    sparkle.style.top = `${top}%`;
    // Spread the twinkles out so they never flash all at once.
    sparkle.style.setProperty('--twinkle-duration', `${1.6 + (sparkleIndex % 3) * 0.5}s`);
    sparkle.style.setProperty('--twinkle-delay', `${-sparkleIndex * 0.37}s`);
    return sparkle;
  });

  layer.replaceChildren(...sparkles);
}
