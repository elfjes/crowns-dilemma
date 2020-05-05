export default {
  initialPopulation: 10000,
  initialInfections: 2,
  baseInteractionParameter: 10,
  baseInfectionChanceParameter: 0.088,
  hospitalizationFraction: 0.1,
  cohorts: {
    INFECTED: {
      type: "PIPE",
      targets: {
        HOSPITALIZED: {
          ratio: 0.12,
          durationDays: 7
        },
        INTENSIVE_CARE: {
          ratio: 0.05,
          durationDays: 7
        },
        MILD: {
          ratio: 0.83,
          durationDays: 7
        }
      },
      contagiousness: 0.05
    },
    MILD: {
      type: "PIPE",

      targets: {
        DEAD: {
          ratio: 0.05,
          durationDays: 3
        },
        CURED: {
          ratio: 0.95,
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
    INTENSIVE_CARE: {
      type: "PIPE",

      targets: {
        DEAD: {
          ratio: 0.3,
          durationDays: 10
        },
        CURED: {
          ratio: 0.7,
          durationDays: 21
        }
      },
      contagiousness: 0.2
    },
    CURED: {
      type: "SINK",
      contagiousness: 0
    },
    DEAD: {
      type: "SINK",
      contagiousness: 0
    }
  }
};
