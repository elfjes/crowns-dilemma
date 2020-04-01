<template>
  <div id="app">
    <section class="section">
      <h1 class="title is-3">
        Crown's Dilemma
      </h1>
      <cd-initial-values
        class="column is-4-desktop is-8-tablet"
        v-model="initialValues"
        :disabled="model !== null"
      ></cd-initial-values>
      <div class="columns">
        <div class="column is-8">
          <div class="box">
            <cd-charts ref="charts"></cd-charts>
          </div>
        </div>
        <div class="column is-4 is-multiline">
          <cd-statistics ref="statistics"></cd-statistics>
          <cd-measures :measures="allMeasures" @input="activeMeasures = $event"></cd-measures>
        </div>
      </div>
      <div class="buttons">
        <button class="button is-primary" @click="gotoNextDays()">
          Next day
        </button>
        <button class="button is-primary" @click="gotoNextDays(7)">
          Next 7 days
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import Measures from "./components/Measures";
import Model from "./model";
import modelConfig from "./modelConfig";
import { measures } from "./measures";
import InitialValues from "./components/InitialValues";
import Charts from "./components/Charts";
import Statistics from "./components/Statistics";

export default {
  name: "App",
  components: {
    cdCharts: Charts,
    cdMeasures: Measures,
    cdInitialValues: InitialValues,
    cdStatistics: Statistics
  },
  data() {
    return {
      initialValues: {
        initialInfections: modelConfig.initiallyInfectedPeople,
        initialPopulation: modelConfig.initialPopulation
      },
      currentDay: 0,
      model: null,
      charts: [
        {
          id: "infectionchart",
          title: "New Infections",
          xAttribute: "day",
          yAttribute: "newInfections"
        },
        {
          id: "sickpeoplechart",
          title: "Total Sick People",
          xAttribute: "day",
          yAttribute: "sickPeople"
        }
      ],
      allMeasures: Object.values(measures),
      activeMeasures: []
    };
  },
  methods: {
    correctInitialValues() {
      if (this.initialValues.initialPopulation < 0) {
        this.initialValues.initialPopulation = 0;
      }
      if (this.initialValues.initialInfections < 0) {
        this.initialValues.initialInfections = 0;
      }
      if (this.initialValues.initialInfections > this.initialValues.initialPopulation) {
        this.initialValues.initialInfections = this.initialValues.initialPopulation;
      }
    },
    gotoNextDays(nDays = 1) {
      if (this.model === null) {
        this.correctInitialValues();
        this.model = new Model(
          this.initialValues.initialPopulation,
          this.initialValues.initialInfections
        );
      }

      let states = [];
      for (let i = 0; i < nDays; i++) {
        this.model.update(this.activeMeasures);
        states.push(this.model.getState());
      }

      this.$refs.charts.update(...states);
      this.$refs.statistics.update(...states);
    }
  }
};
</script>

<style></style>
