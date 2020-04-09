import { calculateModelParameters } from "../../src/model";
import { Measure } from "../../src/measures";

describe("model.js", () => {
  const baseParameters = {
    c1: 1,
    c2: 1,
    minDistance: 0
  };
  const cases = [
    [[], {}],
    [[{ modC1: 0.5, modC2: 0.25, minDistance: 1 }], { c1: 0.5, c2: 0.25, minDistance: 1 }],
    [[{ modC1: 0.5 }, { modC1: 0.5 }], { c1: 0.25 }],
    [[{ modC1: 0.5 }, { fixedModC1: 0.3 }], { c1: 0.3 }],
    [[{ modC2: 0.5 }, { fixedModC2: 0.3 }], { c2: 0.3 }]
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
