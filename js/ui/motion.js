export const STEP_DURATION_MS = 1400;
export const LEG_FRAME_DURATION_MS = 160;

// Movement in "steps" instead of a smooth glide, like a turtle taking pasitos.
export const TURTLE_EASING = 'steps(5, end)';
export const PIXEL_STEP_EASING = 'steps(4, end)';

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

export function prefersReducedMotion() {
  return reducedMotionQuery.matches;
}

// CSS transitions read the same duration, so JS and CSS stay in sync.
export function applyMotionSettings(rootElement) {
  rootElement.style.setProperty('--step-duration', `${STEP_DURATION_MS}ms`);
}

export function animateElement(element, keyframes, { duration, delay = 0, ...options }) {
  const isReduced = prefersReducedMotion();
  const animation = element.animate(keyframes, {
    duration: isReduced ? 0 : duration,
    delay: isReduced ? 0 : delay,
    fill: 'both',
    ...options,
  });
  return animation.finished;
}

export function clearFinishedAnimations(element) {
  element.getAnimations().forEach((animation) => animation.cancel());
}
