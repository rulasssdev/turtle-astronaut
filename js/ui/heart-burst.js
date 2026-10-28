import { animateElement, prefersReducedMotion } from './motion.js';
import { createHeartElement } from './sprite-elements.js';

const BURST_DURATION_MS = 1600;
const DELAY_BETWEEN_BURST_HEARTS_MS = 70;

const FLOAT_DURATION_MS = 2600;
const FLOAT_SPAWN_INTERVAL_MS = 450;

// A ring of hearts bursts out from between the two characters.
export function playHeartBurst(layer, { color, heartCount = 9 }) {
  if (prefersReducedMotion()) return;

  for (let heartIndex = 0; heartIndex < heartCount; heartIndex += 1) {
    // Spread the hearts over the upper half circle so they rise away from the couple.
    const angle = (Math.PI * (heartIndex + 0.5)) / heartCount;
    const distance = 70 + (heartIndex % 3) * 24;

    launchHeart(layer, {
      color,
      startLeft: '50%',
      startTop: '35%',
      moveX: Math.cos(angle) * distance,
      moveY: -Math.sin(angle) * distance,
      duration: BURST_DURATION_MS,
      delay: heartIndex * DELAY_BETWEEN_BURST_HEARTS_MS,
    });
  }
}

// Small hearts keep rising around the couple until the returned function is called.
export function startFloatingHearts(layer, { colors }) {
  if (prefersReducedMotion()) return () => {};

  let heartCount = 0;
  const timerId = setInterval(() => {
    if (document.hidden) return;

    // Alternate sides so hearts never pile up on one character.
    const isLeftSide = heartCount % 2 === 0;
    const horizontalPercent = isLeftSide ? 5 + Math.random() * 35 : 60 + Math.random() * 35;

    launchHeart(layer, {
      color: colors[heartCount % colors.length],
      startLeft: `${horizontalPercent}%`,
      startTop: `${55 + Math.random() * 35}%`,
      moveX: (Math.random() - 0.5) * 30,
      moveY: -(70 + Math.random() * 50),
      duration: FLOAT_DURATION_MS,
      delay: 0,
    });
    heartCount += 1;
  }, FLOAT_SPAWN_INTERVAL_MS);

  return function stopFloatingHearts() {
    clearInterval(timerId);
    layer.replaceChildren();
  };
}

function launchHeart(layer, { color, startLeft, startTop, moveX, moveY, duration, delay }) {
  const heart = createHeartElement(color, 'sprite sprite--heart');
  heart.style.left = startLeft;
  heart.style.top = startTop;
  layer.append(heart);

  animateElement(
    heart,
    [
      { transform: 'translate(-50%, -50%)', opacity: 0 },
      { opacity: 1, offset: 0.15 },
      { opacity: 1, offset: 0.7 },
      { transform: `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`, opacity: 0 },
    ],
    { duration, delay, easing: 'steps(10, end)' },
  ).finally(() => heart.remove());
}
