import CohortTypes from "@/cohortTypes";

export const CohortSpecs = {
  INFECTED: {
    type: CohortTypes.PIPE,
    targets: {
      MILD: {
        ratio: 0.8,
        durationDays: 7
      },
      HOSPITALIZED: {
        ratio: 0.1,
        durationDays: 7
      },
      INTENSIVE_CARE: {
        ratio: 0.1,
        durationDays: 7
      }
    },
    contagiousness: 0.2
  },
  MILD: {
    type: CohortTypes.PIPE,

    targets: {
      CURED: {
        ratio: 0.95,
        durationDays: 7
      },
      DEAD: {
        ratio: 0.05,
        durationDays: 3
      }
    },
    contagiousness: 1
  },
  HOSPITALIZED: {
    type: CohortTypes.PIPE,

    targets: {
      CURED: {
        ratio: 1,
        durationDays: 14
      }
    },
    contagiousness: 0.5
  },
  INTENSIVE_CARE: {
    type: CohortTypes.PIPE,

    targets: {
      CURED: {
        ratio: 0.7,
        durationDays: 21
      },
      DEAD: {
        ratio: 0.3,
        durationDays: 10
      }
    },
    contagiousness: 0.2
  },
  CURED: {
    type: CohortTypes.SINK
  },
  DEAD: {
    type: CohortTypes.SINK
  }
};

export default {
  initialPopulation: 10000,
  initiallyInfectedPeople: 2,
  incubationPeriodDays: { mean: CohortSpecs.INFECTED.targets.MILD.durationDays },
  sickPeriodDays: { mean: CohortSpecs.MILD.targets.CURED.durationDays },
  hospitalizationPeriodDays: { mean: CohortSpecs.HOSPITALIZED.targets.CURED.durationDays },
  baseInteractionParameter: 10,
  baseInfectionChanceParameter: 0.088,
  hospitalizationFraction: 0.1
};
