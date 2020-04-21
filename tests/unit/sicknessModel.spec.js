import modelParameters from "@/modelParameters";
import SicknessModel from "@/models/sicknessModel";
import { createCohorts } from "@/cohorts";
import cohortSpecs from "@/cohortSpecs";

function getModel(customParameters, ff = false) {
  let parameters = { ...modelParameters, ...customParameters };
  let model = new SicknessModel(parameters);

  if (ff) {
    fastForwardIncubationPeriod(model, parameters.incubationPeriodDays.mean, defaultData());
  }
  return model;
}
function fastForwardIncubationPeriod(model, incubationPeriod, data) {
  for (let i = 0; i < incubationPeriod; i++) {
    model.update(data);
  }
}

function defaultData() {
  return {
    newInfections: 0
  };
}
describe("Sickness model without hospitalizations", () => {
  let model = null;

  beforeEach(() => {
    model = getModel({
      initialPopulation: 1,
      initiallyInfectedPeople: 1,
      hospitalizationFraction: 0,
      cohorts: createCohorts(cohortSpecs)
    });
  });

  function defaultData() {
    return {
      newInfections: 0
    };
  }

  test("infected people get sick after incubation period", () => {
    expect(model.getState().mildlySickPeople).toEqual(0);

    for (let i = 0; i < modelParameters.incubationPeriodDays.mean; i++) {
      model.update(defaultData());
    }
    expect(model.getState().mildlySickPeople).toEqual(1);
  });
  test("sick people are cured after sick period", () => {
    for (let i = 0; i < modelParameters.incubationPeriodDays.mean; i++) {
      model.update(defaultData());
    }
    for (let i = 0; i < modelParameters.sickPeriodDays.mean; i++) {
      model.update(defaultData());
    }
    let result = model.getState();
    expect(result.mildlySickPeople).toEqual(0);
    expect(result.curedPeople).toEqual(1);
  });
});

describe("Sickness model with hospitalizations", () => {
  let model = null;
  let cohortSpec = {
    INFECTED: {
      type: "PIPE",
      targets: {
        HOSPITALIZED: {
          ratio: 0.6,
          durationDays: 7
        },
        MILD: {
          ratio: 0.4,
          durationDays: 7
        }
      },
      contagiousness: 0.2
    },
    MILD: {
      type: "PIPE",

      targets: {
        CURED: {
          ratio: 1,
          durationDays: 7
        }
      },
      contagiousness: 1
    },
    HOSPITALIZED: {
      type: "PIPE",

      targets: {
        CURED: {
          ratio: 1,
          durationDays: 14
        }
      },
      contagiousness: 0.5
    },

    CURED: {
      type: "SINK"
    }
  };
  beforeEach(() => {
    model = getModel(
      {
        initialPopulation: 10,
        initiallyInfectedPeople: 10,
        hospitalizationFraction: 0.6,
        cohorts: createCohorts(cohortSpec)
      },
      true
    );
  });

  test("infected people may get hospitalized", () => {
    let state = model.getState();
    expect(state.newMildlySickPeople).toEqual(4);
    expect(state.mildlySickPeople).toEqual(4);
    expect(state.newHospitalizedPeople).toEqual(6);
    expect(state.hospitalizedPeople).toEqual(6);
  });
  test("hospitalized people are cured after sick period", () => {
    model = getModel(
      {
        initialPopulation: 1,
        initiallyInfectedPeople: 1,
        hospitalizationFraction: 1,
        cohorts: createCohorts(cohortSpec)
      },
      true
    );
    for (let i = 0; i < modelParameters.hospitalizationPeriodDays.mean; i++) {
      model.update(defaultData());
    }
    let result = model.getState();
    expect(result.hospitalizedPeople).toEqual(0);
    expect(result.curedPeople).toEqual(1);
  });
});
