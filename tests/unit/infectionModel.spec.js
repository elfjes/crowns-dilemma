import InfectionModel, { calculateInfectivityParameters } from "@/models/infectionModel";
import { Measure } from "@/measures";
import modelParameters from "@/modelParameters";

describe("calculateModelParameters", () => {
  const baseParameters = {
    c1: 1,
    c2: 1,
    minDistance: 0
  };
  const cases = [
    [[], {}],
    [[{ c1: 0.5, c2: 0.25, minDistance: 1 }], { c1: 0.5, c2: 0.25, minDistance: 1 }],
    [[{ c1: 0.5 }, { c1: 0.5 }], { c1: 0.25 }],
    [[{ c1: 0.5 }, { fixedC1: 0.3 }], { c1: 0.3 }],
    [[{ fixedC1: 0.5 }, { fixedC1: 0.3 }], { c1: 0.3 }],
    [[{ fixedC2: 0.5 }, { fixedC2: 0.3 }], { c2: 0.3 }],
    [[{ c2: 0.5 }, { fixedC2: 0.3 }], { c2: 0.3 }]
  ];
  test.each(cases)(
    "given %s as measures, return %p as model parameters",
    (measures, expectedResult) => {
      let expected = { ...baseParameters, ...expectedResult };
      let input = measures.map(m => {
        return new Measure("MEASURE", m);
      });
      expect(calculateInfectivityParameters(input)).toEqual(expected);
    }
  );
});

describe("InfectionModel", () => {
  let model = null;
  function defaultData() {
    return {
      uninfectedPeople: 0,
      population: 1,
      sickPeople: 0
    };
  }
  beforeEach(() => {
    model = new InfectionModel(modelParameters);
  });
  test("update increases day", () => {
    expect(model.getState().day).toEqual(0);
    model.update(defaultData());
    expect(model.getState().day).toEqual(1);
  });
  test("default R0_daily is about 1", () => {
    let data = defaultData();
    data.sickPeople = 1;

    for (let i = 0; i < modelParameters.incubationPeriodDays.mean; i++) {
      model.update({
        uninfectedPeople: 100,
        population: 100,
        sickPeople: 10
      });

      expect(model.getState().newInfections).toEqual(10);
    }
  });
});
