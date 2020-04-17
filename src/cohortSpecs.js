export default {
  INFECTED: {
    type: "PIPE",
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
    type: "PIPE",

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
    type: "SINK"
  },
  DEAD: {
    type: "SINK"
  }
};
