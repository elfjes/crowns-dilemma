import { integrate } from "../helpers";

export default class InfectionModel {
  constructor(parameters) {
    this.initialize();
    this.partiallyInfected = 0;
    this.parameters = parameters;
  }

  initialize() {
    this.day = 0;
    this.newInfections = 0;
  }

  update(data, measures) {
    let population = data.population;
    let uninfectedPeople = data.uninfectedPeople;
    let sickPeople = data.sickPeople;

    this.day++;
    let R0 = dailyReproduction(calculateInfectivityParameters(measures), this.parameters);
    this.newInfections = this.calculateNewInfections(R0, uninfectedPeople, population, sickPeople);

    return this.getState();
  }

  calculateNewInfections(dailyInfectionRatio, uninfectedPeople, population, sickPeople) {
    let rawInfections =
      sickPeople * dailyInfectionRatio * (uninfectedPeople / population) + this.partiallyInfected;
    let rv = Math.floor(rawInfections);
    this.partiallyInfected = rawInfections - rv;
    return rv;
  }

  getState() {
    return {
      day: this.day,
      newInfections: this.newInfections
    };
  }
}

function dailyReproduction(infectivityParameters, baseParameters) {
  let maxInteractionDistance = 3;
  let modifiedInteractions = interactions(
    infectivityParameters.c1,
    baseParameters.baseInteractionParameter
  );
  let modifiedInfectionChance = infectionChance(
    infectivityParameters.c2,
    baseParameters.baseInfectionChanceParameter
  );
  let maxInfectionChance = modifiedInfectionChance(infectivityParameters.minDistance);
  return integrate(
    x => {
      return modifiedInteractions(x) * Math.min(maxInfectionChance, modifiedInfectionChance(x));
    },
    0,
    maxInteractionDistance
  );
}

export function calculateInfectivityParameters(measures) {
  let rv = {
    c1: 1,
    c2: 1,
    minDistance: 0
  };
  let fixedC1 = null;
  let fixedC2 = null;
  let c1 = 1;
  let c2 = 1;
  if (measures && measures.length > 0) {
    measures.forEach(m => {
      // if any of the measures have a fixedMod defined for either C1 or C2, then the minimum value for fixedModCx
      // is taken as the final Cx modifier. modCx values in all measures are ignored
      if (m.fixedC1 === null) {
        c1 *= m.c1;
      } else if (fixedC1 === null) {
        fixedC1 = m.fixedC1;
      } else {
        fixedC1 = Math.min(fixedC1, m.fixedC1);
      }

      if (m.fixedC2 === null) {
        c2 *= m.c2;
      } else if (fixedC2 === null) {
        fixedC2 = m.fixedC2;
      } else {
        fixedC2 = Math.min(fixedC2, m.fixedC2);
      }

      rv.minDistance = Math.max(rv.minDistance, m.minDistance);
    });
    rv.c1 = fixedC1 === null ? c1 : Math.min(c1, fixedC1);
    rv.c2 = fixedC2 === null ? c2 : Math.min(c2, fixedC2);
  }
  return rv;
}

function interactions(c1, alpha) {
  return s => {
    return c1 * alpha * Math.exp(0.7 * s);
  };
}

function infectionChance(c2, alpha) {
  return s => {
    return c2 * alpha * Math.exp(-1.5 * s);
  };
}
