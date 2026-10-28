export class Journey {
  #stops;
  #currentStopIndex = 0;

  constructor(stops) {
    if (stops.length < 2) throw new Error('A journey needs at least a starting stop and a destination.');
    this.#stops = stops;
  }

  get stops() {
    return this.#stops;
  }

  get currentStopIndex() {
    return this.#currentStopIndex;
  }

  get currentStop() {
    return this.#stops[this.#currentStopIndex];
  }

  get hasArrived() {
    return this.#currentStopIndex === this.#stops.length - 1;
  }

  get isOneStepFromArrival() {
    return this.#currentStopIndex === this.#stops.length - 2;
  }

  advance() {
    if (this.hasArrived) throw new Error('The journey already reached its destination.');
    this.#currentStopIndex += 1;
    return this.currentStop;
  }

  restart() {
    this.#currentStopIndex = 0;
  }
}
