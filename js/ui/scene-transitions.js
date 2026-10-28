import { animateElement, clearFinishedAnimations, PIXEL_STEP_EASING } from './motion.js';

const ENTER_DURATION_MS = 480;
const ENTER_STAGGER_MS = 110;
const EXIT_DURATION_MS = 260;

// The scene's [data-enter] parts rise into place one after another.
export async function playSceneEnter(sceneElement) {
  const parts = [...sceneElement.querySelectorAll('[data-enter]')];

  await Promise.all(
    parts.map((part, partIndex) =>
      animateElement(
        part,
        [
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: ENTER_DURATION_MS, delay: partIndex * ENTER_STAGGER_MS, easing: PIXEL_STEP_EASING },
      ),
    ),
  );

  parts.forEach(clearFinishedAnimations);
}

export async function playSceneExit(sceneElement) {
  await animateElement(
    sceneElement,
    [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-16px)' },
    ],
    { duration: EXIT_DURATION_MS, easing: PIXEL_STEP_EASING },
  );
}

export function resetSceneAfterExit(sceneElement) {
  clearFinishedAnimations(sceneElement);
}
