class Measure {
  constructor(modC1, modC2, minDistance, displayName) {
    this.modC1 = modC1;
    this.modC2 = modC2;
    this.minDistance = minDistance;
    this.displayName = displayName
  }
}

export const measures = {
  CLOSE_SHOPS: new Measure(0.2, 1, 0, "Close all shops"),
  MIN_DISTANCE: new Measure(1, 1, 1.5, "Advocate minimum distance"),
  WASH_HANDS: new Measure(1, 0.7, 1.5, "Advocate washing hands regularly")
};