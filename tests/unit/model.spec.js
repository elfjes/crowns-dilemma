import InfectionModel, { calculateModelParameters } from "../../src/model";
import { Measure } from "../../src/measures";
import modelConfig from "../../src/modelConfig";

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
      expect(calculateModelParameters(input)).toEqual(expected);
    }
  );
});

describe("InfectionModel", () => {
  let model = null;
  beforeEach(() => {
    model = new InfectionModel(1, 1);
  });
  test("update increases day", () => {
    expect(model.getState().day).toEqual(0);
    model.update([]);
    expect(model.getState().day).toEqual(1);
  });
  test("infected people get sick after incubation period", () => {
    expect(model.getState().sickPeople).toEqual(0);

    for (let i = 0; i < modelConfig.incubationPeriodDays.mean; i++) {
      model.update();
    }
    expect(model.getState().sickPeople).toEqual(1);
  });
  test("sick people are cured after sick period", () => {
    for (let i = 0; i < modelConfig.incubationPeriodDays.mean; i++) {
      model.update();
    }
    for (let i = 0; i < modelConfig.sickPeriodDays.mean; i++) {
      model.update();
    }
    let result = model.getState();
    expect(result.sickPeople).toEqual(0);
    expect(result.curedPeople).toEqual(1);
  });
});
