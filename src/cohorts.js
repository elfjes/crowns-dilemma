import { Buckets, Remainder } from "@/helpers";

export function createCohorts(specs) {
  let rv = {};
  let spec;
  Object.keys(specs).forEach(id => {
    spec = specs[id];
    switch (spec.type) {
      case "SINK":
        rv[id] = new SinkCohort(spec);
        break;
      case "PIPE":
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
  getOutflow() {
    let rv = {};

    this.targetIds.forEach(id => {
      rv[id] = this.buckets[id].pull();
    });
    return rv;
  }
  addNewPeople(newPeople) {
    let remainingNewPeople = newPeople;
    let toAdd;

    this.targetIds.forEach((id, index) => {
      if (index === this.targetIds.length - 1) {
        toAdd = remainingNewPeople;
      } else {
        toAdd = this.remainders[id].processValue(newPeople * this.targets[id].ratio);
      }
      this.buckets[id].push(toAdd);
      remainingNewPeople -= toAdd;
    });
  }
  processNewPeople(newPeople) {
    this.addNewPeople(newPeople);
    return this.getOutflow();
  }
  getCurrentPeople() {
    let rv = {};

    this.targetIds.forEach(id => {
      rv[id] = this.buckets[id].total;
    });
    return rv;
  }
  get total() {
    return Object.values(this.buckets).reduce((currVal, bucket) => currVal + bucket.total, 0);
  }
  get latest() {
    return Object.values(this.buckets).reduce((currVal, bucket) => currVal + bucket.latest, 0);
  }
}

export class SinkCohort {
  constructor() {
    this.total = 0;
    this.latest = 0;
  }
  getOutflow() {
    return {};
  }
  addNewPeople(newPeople) {
    this.latest = newPeople;
    this.total += newPeople;
  }

  processNewPeople(newPeople) {
    this.addNewPeople(newPeople);
    return this.getOutflow();
  }
  getCurrentPeople() {
    return this.currentPeople;
  }
}
