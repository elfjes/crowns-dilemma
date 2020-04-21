import { Buckets } from "@/helpers";
import { createCohorts } from "@/cohorts";

export default class SicknessModel {
  constructor(parameters) {
    this.initialPopulation = parameters.initialPopulation;

    this.cohorts = createCohorts(parameters.cohorts || {});
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

    this.cohorts.INFECTED.processNewPeople(this.initialInfections);
    this.infectedPeople = new Buckets(this.incubationPeriod);
    this.infectedPeople.rotate(this.initialInfections);

    this.newMildlySickPeople = 0;
    this.mildlySickPeople = new Buckets(this.sickPeriod);
    this.newSickPeople = 0;
    this.curedPeople = 0;

    this.hospitalizedPartial = 0;
    this.hospitalizedPeople = new Buckets(this.hospitalizationPeriod);
  }

  update(data) {
    let newInfections = data.newInfections || 0;
    newInfections = Math.min(newInfections, this.uninfectedPeople);
    this.uninfectedPeople -= newInfections;

    let outflows = this.calculateOutflows({
      INFECTED: newInfections
    });
    this.processInflows(outflows);

    this.newSickPeople = this.infectedPeople.rotate(newInfections);
    this.newHospitalizedPeople = this.calculateHospitalizations(this.newSickPeople);
    this.newMildlySickPeople = this.newSickPeople - this.newHospitalizedPeople;
    this.curedPeople += this.hospitalizedPeople.rotate(this.newHospitalizedPeople);
    this.curedPeople += this.mildlySickPeople.rotate(this.newMildlySickPeople);
    return this.getState();
  }

  calculateOutflows(outflows) {
    Object.values(this.cohorts).forEach(cohort => {
      let cohortOutflow = cohort.getOutflow();
      Object.keys(cohortOutflow).forEach(id => {
        if (outflows[id] === undefined) {
          outflows[id] = 0;
        }
        outflows[id] += cohortOutflow[id];
      });
    });
    return outflows;
  }

  processInflows(inflows) {
    Object.keys(inflows).forEach(id => {
      this.cohorts[id].addNewPeople(inflows[id]);
    });
  }

  calculateHospitalizations(newSickPeople) {
    let rawValue = newSickPeople * this.hospitilizationFraction + this.hospitalizedPartial;
    let rv = Math.floor(rawValue);
    this.hospitalizedPartial = rawValue - rv;
    return rv;
  }

  getState() {
    let cohorts = {};
    Object.keys(this.cohorts).forEach(id => {
      cohorts[id] = this.cohorts[id].getState();
    });
    return {
      population: this.population,
      infectedPeople: this.cohorts.INFECTED.total,
      newSickPeople:
        (this.cohorts.MILD.latest || 0) +
        (this.cohorts.HOSPITALIZED ? this.cohorts.HOSPITALIZED.latest : 0) +
        (this.cohorts.INTENSIVE_CARE ? this.cohorts.HOSPITALIZED.latest : 0),
      newMildlySickPeople: this.cohorts.MILD.latest,
      mildlySickPeople: this.cohorts.MILD.getState(),
      hospitalizedPeople: this.cohorts.HOSPITALIZED.total,
      newHospitalizedPeople: this.cohorts.HOSPITALIZED.latest,
      uninfectedPeople: this.uninfectedPeople,
      curedPeople: this.cohorts.CURED.total,
      cohorts: cohorts
    };
  }
}
