export class Measure {
  constructor(options) {
    let defaults = {
      modC1: 1,
      modC2: 1,
      fixedModC1: null,
      fixedModC2: null,
      minDistance: 0,
      displayName: "Unnamed Measure"
    };
    Object.assign(this, defaults, options);
  }
}

export const measures = {
  CLOSE_SHOPS: new Measure({ modC1: 0.5, displayName: "Close all non-vital shops" }),
  LOCKDOWN: new Measure({ fixedModC1: 0.1, displayName: "Lockdown" }),
  MIN_DISTANCE: new Measure({
    minDistance: 1.5,
    displayName: "Keep at least 1.5m distance"
  }),
  WASH_HANDS: new Measure({
    modC2: 0.7,
    displayName: "Wash hands regularly"
  })
};
