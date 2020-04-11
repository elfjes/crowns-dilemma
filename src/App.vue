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
            <cd-multi-field v-model="initialValues" :disabled="model !== null"></cd-multi-field>
          </cd-card>

          <cd-card title="Statistics">
            <cd-statistics ref="statistics"></cd-statistics>
          </cd-card>

          <cd-measures :measures="allMeasures" v-model="activeMeasures"></cd-measures>
        </div>
      </div>
    </section>
    <cd-footer></cd-footer>
  </div>
</template>

<script>
import Measures from "./components/Measures";
import InfectionModel from "./model";
import modelConfig from "./modelConfig";
import { measures } from "./measures";
import MultiField from "./components/MultiField";
import Charts from "./components/Charts";
import Statistics from "./components/Statistics";
import Card from "./components/Card";
import Footer from "./components/Footer";

export default {
  name: "App",
  components: {
    cdCharts: Charts,
    cdMeasures: Measures,
    cdMultiField: MultiField,
    cdStatistics: Statistics,
    cdCard: Card,
    cdFooter: Footer
  },
  data() {
    return {
      initialValues: {
        initialInfections: {
          value: modelConfig.initiallyInfectedPeople,
          type: "integer",
          minVal: 0
        },
        initialPopulation: {
          value: modelConfig.initialPopulation,
          type: "integer",
          minVal: 0
        }
      },
      model: null,
      allMeasures: measures,
      activeMeasures: []
    };
  },
  methods: {
    correctInitialValues() {
      if (this.initialValues.initialInfections.value > this.initialValues.initialPopulation.value) {
        this.initialValues.initialInfections.value = this.initialValues.initialPopulation.value;
      }
    },
    gotoNextDays(nDays = 1) {
      if (this.model === null) {
        this.correctInitialValues();
        this.model = new InfectionModel(
          this.initialValues.initialPopulation.value,
          this.initialValues.initialInfections.value
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
