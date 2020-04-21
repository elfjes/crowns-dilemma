import { createCohorts } from "@/cohorts";

export default class SicknessModel {
  constructor(parameters) {
    this.initialPopulation = parameters.initialPopulation;

    this.initialInfections = parameters.initiallyInfectedPeople;
    this.initialize(parameters);
  }

  initialize(parameters) {
    this.uninfectedPeople = this.initialPopulation - this.initialInfections;
    this.cohorts = createCohorts(parameters.cohorts || {});
    this.cohorts.INFECTED.processNewPeople(this.initialInfections);
  }

  update(data) {
    let newInfections = data.newInfections || 0;
    newInfections = Math.min(newInfections, this.uninfectedPeople);
    this.uninfectedPeople -= newInfections;

    let outflows = this.calculateOutflows({
      INFECTED: newInfections
    });
    this.processInflows(outflows);

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

  getState() {
    let cohorts = Object.keys(this.cohorts).reduce((val, id) => {
      val[id] = this.cohorts[id].getState();
      return val;
    }, {});

    return {
      population: this.initialPopulation,
      infectedPeople: this.cohorts.INFECTED.total,
      newSickPeople:
        (this.cohorts.MILD.latest || 0) +
        (this.cohorts.HOSPITALIZED ? this.cohorts.HOSPITALIZED.latest : 0) +
        (this.cohorts.INTENSIVE_CARE ? this.cohorts.HOSPITALIZED.latest : 0),
      uninfectedPeople: this.uninfectedPeople,
      cohorts: cohorts
    };
  }
}
