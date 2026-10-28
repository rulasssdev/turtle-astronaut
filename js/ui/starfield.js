import { createSeededRandom } from '../utils/random.js';
import { animateElement, prefersReducedMotion } from './motion.js';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const SKY_SIZE = 240;

// Sparkles are plus-shaped stars: a center pixel and four arms that flash on and off.
const SPARKLE_ARM_OFFSETS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export function renderStarfield(container, { starCount = 120, sparkleCount = 7, seed = 2024 } = {}) {
  const nextRandom = createSeededRandom(seed);
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
  svg.setAttribute('class', 'starfield__sky');
  svg.setAttribute('viewBox', `0 0 ${SKY_SIZE} ${SKY_SIZE}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.setAttribute('shape-rendering', 'crispEdges');

  for (let starIndex = 0; starIndex < starCount; starIndex += 1) {
    const isBrightStar = nextRandom() > 0.8;
    const size = isBrightStar ? 1 : 0.6;
    const star = createPixel(Math.floor(nextRandom() * SKY_SIZE), Math.floor(nextRandom() * SKY_SIZE), size);
    star.setAttribute('class', isBrightStar ? 'star star--twinkle' : 'star');
    if (isBrightStar) setTwinkleTiming(star, nextRandom);
    svg.append(star);
  }

  for (let sparkleIndex = 0; sparkleIndex < sparkleCount; sparkleIndex += 1) {
    svg.append(createSparkle(Math.floor(nextRandom() * SKY_SIZE), Math.floor(nextRandom() * SKY_SIZE), nextRandom));
  }

  container.replaceChildren(svg);
}

function createPixel(x, y, size) {
  const pixel = document.createElementNS(SVG_NAMESPACE, 'rect');
  pixel.setAttribute('x', x);
  pixel.setAttribute('y', y);
  pixel.setAttribute('width', size);
  pixel.setAttribute('height', size);
  return pixel;
}

function createSparkle(centerX, centerY, nextRandom) {
  const sparkle = document.createElementNS(SVG_NAMESPACE, 'g');
  sparkle.setAttribute('class', 'sparkle');
  setTwinkleTiming(sparkle, nextRandom);

  const center = createPixel(centerX, centerY, 1);
  center.setAttribute('class', 'sparkle__center');
  const arms = SPARKLE_ARM_OFFSETS.map(([offsetX, offsetY]) => {
    const arm = createPixel(centerX + offsetX, centerY + offsetY, 1);
    arm.setAttribute('class', 'sparkle__arm');
    return arm;
  });

  sparkle.append(center, ...arms);
  return sparkle;
}

function setTwinkleTiming(element, nextRandom) {
  element.style.setProperty('--twinkle-duration', `${(2.5 + nextRandom() * 3).toFixed(2)}s`);
  element.style.setProperty('--twinkle-delay', `${(-nextRandom() * 5).toFixed(2)}s`);
}

const SHOOTING_STAR_DURATION_MS = 900;

// A shooting star crosses the sky every few seconds while the tab is visible.
export function startShootingStars(container, { minDelayMs = 4500, maxDelayMs = 9000 } = {}) {
  if (prefersReducedMotion()) return;

  function scheduleNext() {
    const delay = minDelayMs + Math.random() * (maxDelayMs - minDelayMs);
    setTimeout(() => {
      if (!document.hidden) launchShootingStar(container);
      scheduleNext();
    }, delay);
  }

  scheduleNext();
}

function launchShootingStar(container) {
  const shootingStar = document.createElement('div');
  shootingStar.className = 'shooting-star';
  shootingStar.style.left = `${5 + Math.random() * 60}%`;
  shootingStar.style.top = `${Math.random() * 35}%`;
  container.append(shootingStar);

  animateElement(
    shootingStar,
    [
      { transform: 'rotate(28deg) translateX(0)', opacity: 0 },
      { opacity: 1, offset: 0.2 },
      { transform: 'rotate(28deg) translateX(280px)', opacity: 0 },
    ],
    { duration: SHOOTING_STAR_DURATION_MS, easing: 'steps(12, end)' },
  ).finally(() => shootingStar.remove());
}
