import { Buckets, Remainder } from "@/helpers";
import CohortTypes from "@/cohortTypes";

export function createCohorts(specs) {
  let rv = {};
  let spec;
  Object.keys(specs).forEach(id => {
    spec = specs[id];
    switch (spec.type) {
      case CohortTypes.SINK:
        rv[id] = new SinkCohort(spec);
        break;
      case CohortTypes.PIPE:
        rv[id] = new PipeCohort(spec);
    }
  });
  return rv;
}

export class PipeCohort {
  constructor(spec) {
    this.targets = spec.targets;
    this.contagiousness = spec.contagiousness;
    this.targetIds = Object.keys(this.targets);
    this.remainders = {};
    this.buckets = {};
    this.targetIds.forEach(id => {
      this.buckets[id] = new Buckets(this.targets[id].durationDays);
      this.remainders[id] = new Remainder();
    });
  }

  processNewPeople(newPeople) {
    let remainingNewPeople = newPeople;
    let rv = {};
    let toAdd;

    this.targetIds.forEach((id, index) => {
      if (index === this.targetIds.length) {
        toAdd = remainingNewPeople;
      } else {
        toAdd = this.remainders[id].processValue(newPeople * this.targets[id].ratio);
      }
      rv[id] = this.buckets[id].rotate(toAdd);
      remainingNewPeople -= toAdd;
    });
    return rv;
  }
  getCurrentPeople() {
    let rv = {};

    this.targetIds.forEach(id => {
      rv[id] = this.buckets[id].total;
    });
    return rv;
  }
}

export class SinkCohort {
  constructor() {
    this.currentPeople = 0;
  }

  processNewPeople(newPeople) {
    this.currentPeople += newPeople;
    return {};
  }
  getCurrentPeople() {
    return this.currentPeople;
  }
}
