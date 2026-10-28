import { buildArcPathData, getArcPoint, getStopProgress, sampleArcPoints } from '../journey/route-geometry.js';
import { getRequiredElement, getSlot } from '../ui/dom.js';
import { animateElement, clearFinishedAnimations, STEP_DURATION_MS, TURTLE_EASING } from '../ui/motion.js';
import { createPlanetElement, createWalkingTurtle } from '../ui/sprite-elements.js';

const ARC_SAMPLES_PER_STEP = 8;

export function createJourneyScene(sceneElement, { stops, messages, onStep }) {
  const stagePlanet = getSlot(sceneElement, 'stage-planet');
  const messageCard = getSlot(sceneElement, 'message-card');
  const stopName = getSlot(sceneElement, 'stop-name');
  const stopMessage = getSlot(sceneElement, 'stop-message');
  const routeMarker = getSlot(sceneElement, 'route-marker');
  const stepButton = getRequiredElement(sceneElement, '[data-action="step"]');

  getSlot(sceneElement, 'route-path').setAttribute('d', buildArcPathData());
  getSlot(sceneElement, 'route-sun').append(createPlanetElement('sun', { className: 'sprite sprite--route-sun' }));
  const routeItems = renderRouteStops(getSlot(sceneElement, 'route-stops'), stops, messages.journey.routeLabel);

  // The route marker is decorative: aria-current on the route already tells where the turtle is.
  const routeTurtle = createWalkingTurtle({ className: 'sprite sprite--route-turtle' });
  routeMarker.append(routeTurtle.element);

  const stageTurtle = createWalkingTurtle({
    accessibleName: messages.spriteNames.turtle,
    className: 'sprite sprite--turtle',
  });
  getSlot(sceneElement, 'stage-turtle').append(stageTurtle.element);

  let isWalking = false;
  let markerStopIndex = 0;

  // aria-disabled instead of disabled, so keyboard focus stays on the button between steps.
  stepButton.addEventListener('click', () => {
    if (!isWalking) onStep();
  });

  function markReachedStops(stopIndex) {
    routeItems.forEach((item, index) => {
      item.classList.toggle('route__stop--reached', index <= stopIndex);
      if (index === stopIndex) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
  }

  function placeRouteMarker(stopIndex) {
    const { x, y } = getArcPoint(getStopProgress(stopIndex, stops.length));
    routeMarker.style.left = `${x}%`;
    routeMarker.style.top = `${y}%`;
    markerStopIndex = stopIndex;
  }

  // The marker follows the curve by passing through several points of the arc.
  async function walkRouteMarker(toStopIndex) {
    const fromProgress = getStopProgress(markerStopIndex, stops.length);
    const toProgress = getStopProgress(toStopIndex, stops.length);
    const keyframes = sampleArcPoints(fromProgress, toProgress, ARC_SAMPLES_PER_STEP).map(({ x, y }) => ({
      left: `${x}%`,
      top: `${y}%`,
    }));

    await animateElement(routeMarker, keyframes, { duration: STEP_DURATION_MS, easing: 'linear' });
    placeRouteMarker(toStopIndex);
    clearFinishedAnimations(routeMarker);
  }

  function renderStopContent(stop) {
    stagePlanet.replaceChildren(
      createPlanetElement(stop.planetId, {
        accessibleName: stop.name,
        className: 'sprite sprite--stage-planet sprite--floating',
      }),
    );
    stopName.textContent = stop.name;
    stopMessage.textContent = stop.message;
  }

  function setWalkingState(walking, buttonLabel) {
    isWalking = walking;
    stepButton.setAttribute('aria-disabled', String(walking));
    stepButton.textContent = buttonLabel;
  }

  function showStop({ stop, stopIndex, buttonLabel }) {
    renderStopContent(stop);
    markReachedStops(stopIndex);
    placeRouteMarker(stopIndex);
    setWalkingState(false, buttonLabel);
  }

  async function swapStagePlanet(stop) {
    const halfStepDuration = STEP_DURATION_MS / 2;

    await Promise.all([
      animateElement(
        stagePlanet,
        [
          { transform: 'translateX(0)', opacity: 1 },
          { transform: 'translateX(-40%)', opacity: 0 },
        ],
        { duration: halfStepDuration, easing: TURTLE_EASING },
      ),
      animateElement(messageCard, [{ opacity: 1 }, { opacity: 0 }], { duration: halfStepDuration / 2 }),
    ]);

    renderStopContent(stop);

    await Promise.all([
      animateElement(
        stagePlanet,
        [
          { transform: 'translateX(40%)', opacity: 0 },
          { transform: 'translateX(0)', opacity: 1 },
        ],
        { duration: halfStepDuration, easing: TURTLE_EASING },
      ),
      animateElement(messageCard, [{ opacity: 0 }, { opacity: 1 }], {
        duration: halfStepDuration / 2,
        delay: halfStepDuration / 2,
      }),
    ]);

    clearFinishedAnimations(stagePlanet);
    clearFinishedAnimations(messageCard);
  }

  async function walkToStop({ stop, stopIndex, buttonLabel }) {
    setWalkingState(true, messages.journey.walkingButton);
    stageTurtle.startWalking();
    routeTurtle.startWalking();

    await Promise.all([walkRouteMarker(stopIndex), swapStagePlanet(stop)]);
    markReachedStops(stopIndex);

    stageTurtle.stopWalking();
    routeTurtle.stopWalking();
    setWalkingState(false, buttonLabel);
  }

  return { element: sceneElement, focusTarget: stepButton, showStop, walkToStop };
}

function renderRouteStops(listElement, stops, routeLabel) {
  listElement.setAttribute('aria-label', routeLabel);

  const items = stops.map((stop, stopIndex) => {
    const { x, y } = getArcPoint(getStopProgress(stopIndex, stops.length));
    const item = document.createElement('li');
    item.className = 'route__stop';
    item.style.left = `${x}%`;
    item.style.top = `${y}%`;
    item.append(createPlanetElement(stop.planetId, { accessibleName: stop.name, className: 'sprite sprite--route-planet' }));
    return item;
  });

  listElement.replaceChildren(...items);
  return items;
}
