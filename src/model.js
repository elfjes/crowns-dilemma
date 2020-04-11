import modelConfig from "@/modelConfig";
import { arrayRoundRobin, arraySum, integrate } from "@/helpers";

export default class Model {
  constructor(population, initiallyInfectedPeople) {
    this.initialPopulation = population;
    this.incubationPeriod = modelConfig.incubationPeriodDays.mean;
    this.sickPeriod = modelConfig.sickPeriodDays.mean;
    this.initialize(initiallyInfectedPeople);
    this.partiallyInfected = 0;
  }

  get totalInfectedPeople() {
    return arraySum(this.infectedPeople);
  }

  get totalSickPeople() {
    return arraySum(this.sickPeople);
  }

  initialize(initiallyInfectedPeople) {
    this.day = 0;
    this.population = this.initialPopulation;
    this.uninfectedPeople = this.initialPopulation - initiallyInfectedPeople;
    this.curedPeople = 0;
    this.newInfections = 0;
    this.infectedPeople = new Array(this.incubationPeriod).fill(0);
    arrayRoundRobin(this.infectedPeople, initiallyInfectedPeople);
    this.sickPeople = new Array(this.sickPeriod).fill(0);
  }

  update(measures) {
    this.day++;
    let R0 = dailyReproduction(calculateModelParameters(measures));
    this.newInfections = this.calculateNewInfections(R0);
    this.uninfectedPeople -= Math.min(this.newInfections, this.uninfectedPeople);

    let newSickPeople = arrayRoundRobin(this.infectedPeople, this.newInfections);
    this.curedPeople += arrayRoundRobin(this.sickPeople, newSickPeople);
  }

  calculateNewInfections(dailyInfectionRatio) {
    let rawInfections =
      this.totalSickPeople * dailyInfectionRatio * (this.uninfectedPeople / this.population) +
      this.partiallyInfected;
    let rv = Math.floor(rawInfections);
    this.partiallyInfected = rawInfections - rv;
    return rv;
  }

  getState() {
    return {
      day: this.day,
      population: this.population,
      newInfections: this.newInfections,
      infectedPeople: this.totalInfectedPeople,
      sickPeople: this.totalSickPeople,
      uninfectedPeople: this.uninfectedPeople,
      curedPeople: this.curedPeople
    };
  }
}

function dailyReproduction(parameters) {
  let maxInteractionDistance = 3;
  let modifiedInteractions = interactions(parameters.c1);
  let modifiedInfectionChance = infectionChance(parameters.c2);
  let maxInfectionChance = modifiedInfectionChance(parameters.minDistance);
  return integrate(
    x => {
      return modifiedInteractions(x) * Math.min(maxInfectionChance, modifiedInfectionChance(x));
    },
    0,
    maxInteractionDistance
  );
}

export function calculateModelParameters(measures) {
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

function interactions(c1) {
  let alpha = modelConfig.baseInteractionParameter;

  return s => {
    return c1 * alpha * Math.exp(0.7 * s);
  };
}

function infectionChance(c2) {
  let alpha = modelConfig.baseInfectionChanceParameter;

  return s => {
    return c2 * alpha * Math.exp(-1.5 * s);
  };
}
