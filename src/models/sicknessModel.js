import { Buckets } from "../helpers";

export default class SicknessModel {
  constructor(parameters) {
    this.initialPopulation = parameters.initialPopulation;

    this.sickPeriod = parameters.sickPeriodDays.mean;
    this.incubationPeriod = parameters.incubationPeriodDays.mean;
    this.initialInfections = parameters.initiallyInfectedPeople;

    this.initialize();
  }

  initialize() {
    this.population = this.initialPopulation;
    this.uninfectedPeople = this.initialPopulation - this.initialInfections;

    this.infectedPeople = new Buckets(this.incubationPeriod);
    this.infectedPeople.rotate(this.initialInfections);

    this.sickPeople = new Buckets(this.sickPeriod);
    this.curedPeople = 0;
  }

  // eslint-disable-next-line no-unused-vars
  update(data, measures) {
    let newInfections = data.newInfections;

    this.uninfectedPeople -= Math.min(newInfections, this.uninfectedPeople);

    let newSickPeople = this.infectedPeople.rotate(newInfections);
    this.curedPeople += this.sickPeople.rotate(newSickPeople);
    return this.getState();
  }

  getState() {
    return {
      population: this.population,
      infectedPeople: this.infectedPeople.total,
      sickPeople: this.sickPeople.total,
      uninfectedPeople: this.uninfectedPeople,
      curedPeople: this.curedPeople
    };
  }
}
