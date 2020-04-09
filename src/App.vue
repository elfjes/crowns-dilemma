<template>
  <div id="app">
    <section class="section">
      <h1 class="title is-4 is-3-mobile">
        Crown's Dilemma
      </h1>
      <div class="columns">
        <div class="column is-8">
          <div class="box">
            <cd-charts ref="charts"></cd-charts>
          </div>
          <div class="buttons">
            <button class="button is-primary" @click="gotoNextDays()">
              Next day
            </button>
            <button class="button is-primary" @click="gotoNextDays(7)">
              Next 7 days
            </button>
            <button class="button is-danger" @click="reset">
              Restart simulation
            </button>
          </div>
        </div>
        <div class="column is-4">
          <cd-card title="Initial Values" start-collapsed>
            <cd-initial-values
              v-model="initialValues"
              :disabled="model !== null"
            ></cd-initial-values>
          </cd-card>

          <cd-card title="Statistics">
            <cd-statistics ref="statistics"></cd-statistics>
          </cd-card>

          <cd-measures :measures="allMeasures" v-model="activeMeasures"></cd-measures>
        </div>
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
import Card from "./components/Card";

export default {
  name: "App",
  components: {
    cdCharts: Charts,
    cdMeasures: Measures,
    cdInitialValues: InitialValues,
    cdStatistics: Statistics,
    cdCard: Card
  },
  data() {
    return {
      initialValues: {
        initialInfections: modelConfig.initiallyInfectedPeople,
        initialPopulation: modelConfig.initialPopulation
      },
      model: null,
      allMeasures: measures,
      activeMeasures: []
    };
  },
  methods: {
    correctInitialValues() {
      this.initialValues.initialPopulation = this.convertToNumber(
        this.initialValues.initialPopulation,
        0
      );
      this.initialValues.initialInfections = this.convertToNumber(
        this.initialValues.initialInfections,
        0
      );
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
    convertToNumber(value, fallback = 0) {
      let rv = parseFloat(value);
      if (isFinite(rv)) return rv;
      return fallback;
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
    },
    reset() {
      this.model = null;
      this.activeMeasures = [];
      this.$refs.charts.reset();
      this.$refs.statistics.reset();
    }
  }
};
</script>

<style></style>
