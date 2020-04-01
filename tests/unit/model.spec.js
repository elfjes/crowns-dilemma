import { calculateModelParameters } from "../../src/model";
import { Measure } from "../../src/measures";
import modelConfig from "../../src/modelConfig";

describe("model.js", () => {
  const baseParameters = {
    c1: modelConfig.baseInteractionParameter,
    c2: modelConfig.baseInfectionChanceParameter,
    minDistance: 0
  };
  const cases = [
    [[], {}],
    [[{ modC1: 0.5, modC2: 0.25, minDistance: 1 }], { c1: 5, c2: 0.022, minDistance: 1 }],
    [[{ modC1: 0.5 }, { modC1: 0.5 }], { c1: 2.5 }],
    [[{ modC1: 0.5 }, { fixedModC1: 0.3 }], { c1: 0.3 * 10 }],
    [[{ modC2: 0.5 }, { fixedModC2: 0.3 }], { c2: 0.3 * 0.088 }]
  ];
  test.each(cases)(
    "given %s as measures, return %p as model parameters",
    (measures, expectedResult) => {
      let expected = { ...baseParameters, ...expectedResult };
      let input = measures.map(m => {
        return new Measure(m);
      });
      expect(calculateModelParameters(input)).toEqual(expected);
    }
  );
});
