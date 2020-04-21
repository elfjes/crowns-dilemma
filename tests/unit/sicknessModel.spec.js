import modelParameters from "@/modelParameters";
import SicknessModel from "@/models/sicknessModel";
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
    model = getModel(
      {
        initialPopulation: 1,
        initiallyInfectedPeople: 1,
        hospitalizationFraction: 0,
        cohorts: cohortSpecs
      },
      true
    );
  });

  function defaultData() {
    return {
      newInfections: 0
    };
  }

  test("infected people get sick after incubation period", () => {
    expect(model.getState().cohorts.MILD).toEqual(
      expect.objectContaining({
        total: 1,
        latest: 1
      })
    );
  });
  test("sick people are cured after sick period", () => {
    for (let i = 0; i < modelParameters.sickPeriodDays.mean; i++) {
      model.update(defaultData());
    }
    let result = model.getState();
    expect(result.cohorts.MILD).toEqual(
      expect.objectContaining({
        total: 0,
        latest: 0
      })
    );
    expect(result.cohorts.CURED.total).toEqual(1);
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
        cohorts: cohortSpec
      },
      true
    );
  });

  test("infected people may get hospitalized", () => {
    let state = model.getState();

    expect(state.cohorts.HOSPITALIZED).toEqual(
      expect.objectContaining({
        total: 6,
        latest: 6
      })
    );
  });
  test("hospitalized people are cured after sick period", () => {
    model = getModel(
      {
        initialPopulation: 1,
        initiallyInfectedPeople: 1,
        hospitalizationFraction: 1,
        cohorts: cohortSpec
      },
      true
    );
    for (let i = 0; i < modelParameters.hospitalizationPeriodDays.mean; i++) {
      model.update(defaultData());
    }
    let result = model.getState();
    expect(result.cohorts.HOSPITALIZED.total).toEqual(0);
    expect(result.cohorts.CURED.total).toEqual(1);
  });
});
