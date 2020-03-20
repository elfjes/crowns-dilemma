function arraySum(array) {
  return array.reduce((a, b) => a + b, 0);
}

function arrayRoundRobin(array, newValue) {
  if (array.length < 1) {
    throw new RangeError("Cannot assign new value to zero length Array");
  }
  let rv = array.shift();
  array.push(newValue);
  return rv;
}

export default class Model {
  constructor(population, initiallyInfectedPeople) {
    this.initialPopulation = population;
    this.dailyInfectionRatio = 1;
    this.incubationPeriod = 7;
    this.sickPeriod = 7;
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

  update() {
    this.day++;
    this.newInfections = this.calculateNewInfections();
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

  calculateNewInfections() {
    return (
      this.totalSickPeople *
      this.dailyInfectionRatio *
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
