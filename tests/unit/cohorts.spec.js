import { createCohorts, PipeCohort, SinkCohort } from "@/cohorts";
import cohortTypes from "@/cohortTypes";

describe("PipeChort", () => {
  let cohort;
  beforeEach(() => {
    cohort = new PipeCohort({
      targets: {
        NAME: {
          ratio: 0.2,
          durationDays: 1
        },
        OTHER: {
          ratio: 0.8,
          durationDays: 1
        }
      }
    });
  });
  test("PipeCohort is initialized with empty buckets", () => {
    expect(cohort.getCurrentPeople()).toEqual({
      NAME: 0,
      OTHER: 0
    });
  });
  test("Processing new people adds them to buckets by ratio", () => {
    cohort.processNewPeople(10);
    expect(cohort.getCurrentPeople()).toEqual({
      NAME: 2,
      OTHER: 8
    });
  });
  test("Processing new people returns Buckets output", () => {
    cohort.processNewPeople(10);
    let out = cohort.processNewPeople(0);
    expect(out).toEqual({
      NAME: 2,
      OTHER: 8
    });
  });
});

describe("createCohorts", () => {
  test("creates cohorts from spec", () => {
    let specs = { SINK: { type: cohortTypes.SINK }, PIPE: { targets: {}, type: cohortTypes.PIPE } };
    let out = createCohorts(specs);
    expect(out.PIPE).toBeInstanceOf(PipeCohort);
    expect(out.SINK).toBeInstanceOf(SinkCohort);
  });
});
