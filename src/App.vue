<template>
  <div id="app">
    <section class="section">
      <div class="container">
        <h1 class="title is-1">
          Crown's Dilemma
        </h1>
        <cd-initial-values v-model="initialValues" :disabled="model !== null"></cd-initial-values>
        <cd-bar-chart
          v-for="chart in charts"
          :key="chart.id"
          ref="charts"
          :id="chart.id"
          :title="chart.title"
          :x-attribute="chart.xAttribute"
          :y-attribute="chart.yAttribute"
        ></cd-bar-chart>
        <div class="buttons">
          <button class="button is-primary" @click="gotoNextDays()">
            Next day
          </button>
          <button class="button is-primary" @click="gotoNextDays(7)">
            Next 7 days
          </button>
        </div>
        <cd-measures :measures="allMeasures" @input="activeMeasures = $event"></cd-measures>
      </div>
    </section>
  </div>
</template>

<script>
import BarChart from "./components/BarChart";
import Measures from "./components/Measures";
import Model from "./model";
import modelConfig from "@/modelConfig";
import { measures } from "@/measures";
import InitialValues from "./components/InitialValues";

export default {
  name: "App",
  components: {
    cdBarChart: BarChart,
    cdMeasures: Measures,
    cdInitialValues: InitialValues
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

      this.$refs.charts.forEach(chart => {
        chart.update(...states);
      });
    }
  }
};
</script>

<style></style>
