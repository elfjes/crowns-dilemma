export class Measure {
  constructor(id, options) {
    let defaults = {
      c1: 1,
      c2: 1,
      fixedC1: null,
      fixedC2: null,
      minDistance: 0,
      displayName: "Unnamed Measure"
    };
    this.id = id;
    Object.assign(this, defaults, options);
  }
}

export const measures = [
  new Measure("CLOSE_SHOPS", { c1: 0.5, displayName: "Close all non-vital shops" }),
  new Measure("LOCKDOWN", { fixedC1: 0.1, displayName: "Lockdown" }),
  new Measure("MIN_DISTANCE", {
    minDistance: 1.5,
    displayName: "Keep at least 1.5m distance"
  }),
  new Measure("WASH_HANDS", {
    c2: 0.7,
    displayName: "Wash hands regularly"
  })
];
