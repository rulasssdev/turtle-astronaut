import { TURTLE_FRONT_LEDGE_ROWS } from '../sprites/turtle-sprite.js';
import { getRequiredElement, getSlot } from '../ui/dom.js';
import { createCharacterElement, createFrontTurtleElement } from '../ui/sprite-elements.js';

export function createIntroScene(sceneElement, { people, messages, onStart }) {
  getSlot(sceneElement, 'intro-sender').append(createCharacterElement(people.sender, 'sprite sprite--figure sprite--idle'));
  getSlot(sceneElement, 'intro-recipient').append(
    createCharacterElement(people.recipient, 'sprite sprite--figure sprite--idle sprite--idle-offset'),
  );

  const turtleSlot = getSlot(sceneElement, 'intro-turtle');
  turtleSlot.style.setProperty('--ledge-rows', TURTLE_FRONT_LEDGE_ROWS);
  turtleSlot.append(
    createFrontTurtleElement({ accessibleName: messages.spriteNames.leaningTurtle, className: 'sprite' }),
  );

  const startButton = getRequiredElement(sceneElement, '[data-action="start"]');
  startButton.addEventListener('click', onStart);

  return { element: sceneElement, focusTarget: startButton };
}
