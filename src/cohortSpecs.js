export default {
  INFECTED: {
    type: "PIPE",
    targets: {
      HOSPITALIZED: {
        ratio: 0.1,
        durationDays: 7
      },
      INTENSIVE_CARE: {
        ratio: 0.1,
        durationDays: 7
      },
      MILD: {
        ratio: 0.8,
        durationDays: 7
      }
    },
    contagiousness: 0.2
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
    type: "SINK"
  },
  DEAD: {
    type: "SINK"
  }
};
