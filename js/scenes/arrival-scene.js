import { getRequiredElement, getSlot } from '../ui/dom.js';
import { playHeartBurst, startFloatingHearts } from '../ui/heart-burst.js';
import { createCharacterElement, createPlanetElement } from '../ui/sprite-elements.js';

export function createArrivalScene(sceneElement, { people, messages, onContinue }) {
  getSlot(sceneElement, 'arrival-planet').append(
    createPlanetElement('neptune', { className: 'sprite sprite--arrival-planet sprite--floating' }),
  );
  getSlot(sceneElement, 'arrival-sender').append(createCharacterElement(people.sender, 'sprite sprite--figure sprite--idle'));
  getSlot(sceneElement, 'arrival-recipient').append(
    createCharacterElement(people.recipient, 'sprite sprite--figure sprite--idle sprite--idle-offset'),
  );

  const headline = getSlot(sceneElement, 'arrival-headline');
  renderHeadline(headline, messages.arrival);

  const heartsLayer = getSlot(sceneElement, 'hearts');
  const continueButton = getRequiredElement(sceneElement, '[data-action="show-promise"]');
  continueButton.addEventListener('click', onContinue);

  let stopFloatingHearts = () => {};

  function onShow() {
    const styles = getComputedStyle(sceneElement);
    const neptuneBlue = styles.getPropertyValue('--color-neptune').trim();
    const heartPink = styles.getPropertyValue('--color-heart-pink').trim();

    playHeartBurst(heartsLayer, { color: neptuneBlue });
    stopFloatingHearts = startFloatingHearts(heartsLayer, { colors: [heartPink, neptuneBlue] });
  }

  function onHide() {
    stopFloatingHearts();
  }

  return { element: sceneElement, focusTarget: headline, onShow, onHide };
}

function renderHeadline(headlineElement, { headline, highlightedWord }) {
  const wordStart = headline.indexOf(highlightedWord);
  if (!highlightedWord || wordStart === -1) {
    headlineElement.textContent = headline;
    return;
  }

  const highlight = document.createElement('span');
  highlight.className = 'arrival__highlight';
  highlight.textContent = highlightedWord;

  headlineElement.replaceChildren(
    headline.slice(0, wordStart),
    highlight,
    headline.slice(wordStart + highlightedWord.length),
  );
}
