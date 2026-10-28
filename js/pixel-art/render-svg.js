import { getGridSize } from './sprite-grid.js';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export function createSpriteSvg(grid, { accessibleName, className } = {}) {
  const svg = createSvgShell(grid, { accessibleName, className });
  svg.append(createPixelGroup(grid));
  return svg;
}

// One <svg> holding every frame; only the active frame is displayed.
export function createAnimatedSpriteSvg(frames, { accessibleName, className } = {}) {
  const svg = createSvgShell(frames[0], { accessibleName, className });
  const frameGroups = frames.map((frame) => createPixelGroup(frame));
  svg.append(...frameGroups);

  function showFrame(frameIndex) {
    frameGroups.forEach((group, index) => {
      group.style.display = index === frameIndex ? '' : 'none';
    });
  }

  showFrame(0);
  return { element: svg, frameCount: frames.length, showFrame };
}

function createSvgShell(grid, { accessibleName, className }) {
  const { width, height } = getGridSize(grid);
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('shape-rendering', 'crispEdges');
  if (className) svg.setAttribute('class', className);

  if (accessibleName) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', accessibleName);
  } else {
    svg.setAttribute('aria-hidden', 'true');
  }

  return svg;
}

// Consecutive pixels of the same color become one <rect>, which keeps the DOM small.
function createPixelGroup(grid) {
  const group = document.createElementNS(SVG_NAMESPACE, 'g');

  grid.forEach((row, y) => {
    let runStartX = 0;

    for (let x = 1; x <= row.length; x += 1) {
      const runColor = row[runStartX];
      if (x < row.length && row[x] === runColor) continue;

      if (runColor !== null) {
        const rect = document.createElementNS(SVG_NAMESPACE, 'rect');
        rect.setAttribute('x', runStartX);
        rect.setAttribute('y', y);
        rect.setAttribute('width', x - runStartX);
        rect.setAttribute('height', 1);
        rect.setAttribute('fill', runColor);
        group.append(rect);
      }
      runStartX = x;
    }
  });

  return group;
}
