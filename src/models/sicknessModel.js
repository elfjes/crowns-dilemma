import { Buckets } from "@/helpers";

export default class SicknessModel {
  constructor(parameters) {
    this.initialPopulation = parameters.initialPopulation;

    this.sickPeriod = parameters.sickPeriodDays.mean;
    this.incubationPeriod = parameters.incubationPeriodDays.mean;
    this.hospitalizationPeriod = parameters.hospitalizationPeriodDays.mean;

    this.initialInfections = parameters.initiallyInfectedPeople;
    this.hospitilizationFraction = parameters.hospitalizationFraction;
    this.initialize();
  }

  initialize() {
    this.population = this.initialPopulation;
    this.uninfectedPeople = this.initialPopulation - this.initialInfections;

    this.infectedPeople = new Buckets(this.incubationPeriod);
    this.infectedPeople.rotate(this.initialInfections);

    this.sickPeople = new Buckets(this.sickPeriod);
    this.curedPeople = 0;

    this.hospitalizedPartial = 0;
    this.hospitalizedPeople = new Buckets(this.hospitalizationPeriod);
  }

  // eslint-disable-next-line no-unused-vars
  update(data, measures) {
    let newInfections = data.newInfections || 0;

    this.uninfectedPeople -= Math.min(newInfections, this.uninfectedPeople);
    let newSickPeople = this.infectedPeople.rotate(newInfections);
    let newHospitalizedPeople = this.calculateHospitalizations(newSickPeople);
    newSickPeople -= newHospitalizedPeople;
    this.curedPeople += this.hospitalizedPeople.rotate(newHospitalizedPeople);
    this.curedPeople += this.sickPeople.rotate(newSickPeople);
    return this.getState();
  }

  calculateHospitalizations(newSickPeople) {
    let rawValue = newSickPeople * this.hospitilizationFraction + this.hospitalizedPartial;
    let rv = Math.floor(rawValue);
    this.hospitalizedPartial = rawValue - rv;
    return rv;
  }

  getState() {
    return {
      population: this.population,
      infectedPeople: this.infectedPeople.total,
      sickPeople: this.sickPeople.total,
      hospitalizedPeople: this.hospitalizedPeople.total,
      uninfectedPeople: this.uninfectedPeople,
      curedPeople: this.curedPeople
    };
  }
}
