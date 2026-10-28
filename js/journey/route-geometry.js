// The route is drawn as an arc around the sun. Positions are percentages of the route box,
// with the sun at the bottom center.
const ARC_CENTER = { x: 50, y: 100 };
const ARC_RADIUS = { x: 44, y: 70 };
const START_ANGLE_DEGREES = 165;
const END_ANGLE_DEGREES = 15;

// progress goes from 0 (first stop) to 1 (last stop).
export function getArcPoint(progress) {
  const angleDegrees = START_ANGLE_DEGREES + (END_ANGLE_DEGREES - START_ANGLE_DEGREES) * progress;
  const angle = (angleDegrees * Math.PI) / 180;
  return {
    x: ARC_CENTER.x + ARC_RADIUS.x * Math.cos(angle),
    y: ARC_CENTER.y - ARC_RADIUS.y * Math.sin(angle),
  };
}

export function getStopProgress(stopIndex, stopCount) {
  return stopIndex / (stopCount - 1);
}

export function sampleArcPoints(fromProgress, toProgress, sampleCount) {
  return Array.from({ length: sampleCount }, (_, sampleIndex) =>
    getArcPoint(fromProgress + ((toProgress - fromProgress) * sampleIndex) / (sampleCount - 1)),
  );
}

// SVG path through the whole arc, for a viewBox of 0 0 100 100.
export function buildArcPathData(sampleCount = 40) {
  return sampleArcPoints(0, 1, sampleCount)
    .map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(' ');
}
