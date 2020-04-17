<template>
  <div id="app">
    <section class="section">
      <h1 class="title is-4 is-3-mobile">
        Crown's Dilemma
      </h1>
      <div class="columns">
        <div class="column is-8">
          <div class="box">
            <cd-charts ref="charts" />
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
            <cd-multi-field v-model="initialValues" :disabled="models !== null" />
          </cd-card>

          <cd-card title="Statistics">
            <cd-statistics ref="statistics" />
          </cd-card>

          <cd-measures :measures="allMeasures" v-model="activeMeasures" />
        </div>
      </div>
    </section>
    <cd-footer></cd-footer>
  </div>
</template>

<script>
import Measures from "@/components/Measures";
import InfectionModel from "@/models/infectionModel";
import modelParameters from "@/modelParameters";
import { measures } from "@/measures";
import MultiField from "@/components/MultiField";
import Charts from "@/components/Charts";
import Statistics from "@/components/Statistics";
import Card from "@/components/Card";
import Footer from "@/components/Footer";
import sicknessModel from "@/models/sicknessModel";

const modelTypes = [InfectionModel, sicknessModel];
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
          value: modelParameters.initiallyInfectedPeople,
          type: "integer",
          minVal: 0
        },
        initialPopulation: {
          value: modelParameters.initialPopulation,
          type: "integer",
          minVal: 0
        }
      },
      models: null,
      allMeasures: measures,
      activeMeasures: [],
      modelState: {}
    };
  },

  methods: {
    correctInitialValues() {
      if (this.initialValues.initialInfections.value > this.initialValues.initialPopulation.value) {
        this.initialValues.initialInfections.value = this.initialValues.initialPopulation.value;
      }
    },
    getModelParameters() {
      modelParameters.initialPopulation = this.initialValues.initialPopulation.value;
      modelParameters.initialInfections = this.initialValues.initialInfections.value;
      return modelParameters;
    },
    gotoNextDays(nDays = 1) {
      if (this.models === null) {
        this.initializeModels();
      }

      let states = this.updateModels(nDays);

      this.$refs.charts.update(...states);
      this.$refs.statistics.update(...states);
    },
    initializeModels() {
      this.correctInitialValues();
      let modelParameters = this.getModelParameters();
      this.models = [];
      this.modelState = {};
      let model;
      modelTypes.forEach(modelType => {
        model = new modelType(modelParameters);
        this.models.push(model);
        Object.assign(this.modelState, model.getState());
      });
    },
    updateModels(nDays) {
      let states = [];
      let newState;
      let result;
      for (let i = 0; i < nDays; i++) {
        newState = { ...this.modelState };
        for (let j = 0; j < this.models.length; j++) {
          result = this.models[j].update(newState, this.activeMeasures);
          Object.assign(newState, result);
        }
        this.modelState = newState;
        states.push(newState);
      }
      return states;
    },
    reset() {
      this.models = null;
      this.activeMeasures = [];
      this.$refs.charts.reset();
      this.$refs.statistics.reset();
    }
  }
};
</script>

<style></style>
