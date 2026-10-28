import { Journey } from './journey/journey.js';
import { createArrivalScene } from './scenes/arrival-scene.js';
import { createFlowersScene } from './scenes/flowers-scene.js';
import { createIntroScene } from './scenes/intro-scene.js';
import { createJourneyScene } from './scenes/journey-scene.js';
import { createPromiseScene } from './scenes/promise-scene.js';
import { fillTextSlots, getRequiredElement, getSlot } from './ui/dom.js';
import { applyMotionSettings } from './ui/motion.js';
import { playSceneEnter, playSceneExit, resetSceneAfterExit } from './ui/scene-transitions.js';
import { renderStarfield, startShootingStars } from './ui/starfield.js';

export function startApp({ messages, stops, people }) {
  const appElement = getSlot(document, 'app');
  const starfield = getSlot(document, 'starfield');

  document.title = messages.documentTitle;
  applyMotionSettings(document.documentElement);
  renderStarfield(starfield);
  startShootingStars(starfield);
  fillTextSlots(appElement, messages);

  const journey = new Journey(stops);

  const scenes = {
    intro: createIntroScene(getRequiredElement(appElement, '[data-scene="intro"]'), {
      people,
      messages,
      onStart: () => goToScene('flowers'),
    }),
    flowers: createFlowersScene(getRequiredElement(appElement, '[data-scene="flowers"]'), {
      messages,
      onContinue: startJourney,
    }),
    journey: createJourneyScene(getRequiredElement(appElement, '[data-scene="journey"]'), {
      stops,
      messages,
      onStep: takeNextStep,
    }),
    arrival: createArrivalScene(getRequiredElement(appElement, '[data-scene="arrival"]'), {
      people,
      messages,
      onContinue: () => goToScene('promise'),
    }),
    promise: createPromiseScene(getRequiredElement(appElement, '[data-scene="promise"]'), {
      people,
      onGoHome: () => goToScene('intro'),
    }),
  };

  // Clicks during a scene change are ignored so animations never overlap.
  let isChangingScene = false;

  async function showScene(sceneName, { moveFocus = true } = {}) {
    isChangingScene = true;
    const nextScene = scenes[sceneName];
    const visibleScene = Object.values(scenes).find((scene) => !scene.element.hidden);

    if (visibleScene && visibleScene !== nextScene) {
      visibleScene.onHide?.();
      await playSceneExit(visibleScene.element);
      visibleScene.element.hidden = true;
      resetSceneAfterExit(visibleScene.element);
    }

    nextScene.element.hidden = false;
    window.scrollTo({ top: 0 });
    if (moveFocus) nextScene.focusTarget.focus();

    await playSceneEnter(nextScene.element);
    nextScene.onShow?.();
    isChangingScene = false;
  }

  function describeCurrentStop() {
    return {
      stop: journey.currentStop,
      stopIndex: journey.currentStopIndex,
      buttonLabel: getStepButtonLabel(journey, messages.journey),
    };
  }

  async function goToScene(sceneName) {
    if (isChangingScene) return;
    await showScene(sceneName);
  }

  async function startJourney() {
    if (isChangingScene) return;
    journey.restart();
    scenes.journey.showStop(describeCurrentStop());
    await showScene('journey');
  }

  async function takeNextStep() {
    if (isChangingScene) return;

    if (journey.hasArrived) {
      await showScene('arrival');
      return;
    }

    journey.advance();
    await scenes.journey.walkToStop(describeCurrentStop());
  }

  appElement.hidden = false;
  showScene('intro', { moveFocus: false });
}

function getStepButtonLabel(journey, journeyMessages) {
  if (journey.hasArrived) return journeyMessages.openMessageButton;
  if (journey.isOneStepFromArrival) return journeyMessages.lastStepButton;
  return journeyMessages.stepButton;
}
