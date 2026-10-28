import { getRequiredElement, getSlot } from '../ui/dom.js';
import { createCharacterElement, createHeartElement } from '../ui/sprite-elements.js';

export function createPromiseScene(sceneElement, { people, onGoHome }) {
  getSlot(sceneElement, 'promise-sender').append(createCharacterElement(people.sender, 'sprite sprite--figure sprite--idle'));
  getSlot(sceneElement, 'promise-recipient').append(
    createCharacterElement(people.recipient, 'sprite sprite--figure sprite--idle sprite--idle-offset'),
  );

  const heartColor = getComputedStyle(sceneElement).getPropertyValue('--color-heart-pink').trim();
  getSlot(sceneElement, 'promise-heart').append(createHeartElement(heartColor, 'sprite sprite--promise-heart'));

  const homeButton = getRequiredElement(sceneElement, '[data-action="go-home"]');
  homeButton.addEventListener('click', onGoHome);

  // Focus the title first so the message is read before the button.
  const title = getRequiredElement(sceneElement, '#promise-title');
  return { element: sceneElement, focusTarget: title };
}
