import cohortSpecs from "@/cohortSpecs";

export default {
  initialPopulation: 10000,
  initiallyInfectedPeople: 2,
  incubationPeriodDays: { mean: cohortSpecs.INFECTED.targets.MILD.durationDays },
  sickPeriodDays: { mean: cohortSpecs.MILD.targets.CURED.durationDays },
  hospitalizationPeriodDays: { mean: cohortSpecs.HOSPITALIZED.targets.CURED.durationDays },
  baseInteractionParameter: 10,
  baseInfectionChanceParameter: 0.088,
  hospitalizationFraction: 0.1
};
