import modelConfig from "@/modelConfig";
import {arrayRoundRobin, arraySum, integrate} from "@/helpers";

export default class Model {
  constructor(population, initiallyInfectedPeople) {
    this.initialPopulation = population;
    this.incubationPeriod = modelConfig.incubationPeriodDays.mean;
    this.sickPeriod = modelConfig.sickPeriodDays.mean;
    this.initialize(initiallyInfectedPeople);
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
    this.uninfectedPeople -= Math.min(
      this.newInfections,
      this.uninfectedPeople
    );

    let newSickPeople = arrayRoundRobin(
      this.infectedPeople,
      this.newInfections
    );
    this.curedPeople += arrayRoundRobin(this.sickPeople, newSickPeople);
  }

  calculateNewInfections(dailyInfectionRatio) {
    return (
      this.totalSickPeople *
      dailyInfectionRatio *
      (this.uninfectedPeople / this.population)
    );
  }

  getState() {
    return {
      day: this.day,
      population: Math.round(this.population),
      newInfections: Math.round(this.newInfections),
      infectedPeople: Math.round(this.totalInfectedPeople),
      sickPeople: Math.round(this.totalSickPeople),
      uninfectedPeople: Math.round(this.uninfectedPeople),
      curedPeople: Math.round(this.curedPeople)
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
      return (
        modifiedInteractions(x) *
        Math.min(maxInfectionChance, modifiedInfectionChance(x))
      );
    },
    0,
    maxInteractionDistance
  );
}

function calculateModelParameters(measures) {
  let rv = {
    c1: modelConfig.baseInteractionParameter,
    c2: modelConfig.baseInfectionChanceParameter,
    minDistance: 0
  };
  if (measures && measures.length > 0) {
    measures.forEach(m => {
      rv.c1 *= m.modC1;
      rv.c2 *= m.modC2;
      rv.minDistance = Math.max(rv.minDistance, m.minDistance);
    });
  }
  return rv;
}

function interactions(c1) {
  return s => {
    return c1 * Math.exp(0.7 * s);
  };
}

function infectionChance(c2) {
  return s => {
    return c2 * Math.exp(-1.5 * s);
  };
}
