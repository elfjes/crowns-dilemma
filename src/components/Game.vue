<template>
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
        <button class="button is-danger" @click="$store.commit('stop')">
          Restart simulation
        </button>
      </div>
    </div>
    <div class="column is-4">
      <cd-card title="Statistics">
        <cd-statistics ref="statistics" />
      </cd-card>

      <cd-measures :measures="allMeasures" v-model="activeMeasures" />
    </div>
  </div>
</template>

<script>
import Measures from "@/components/Measures";
import InfectionModel from "@/models/infectionModel";
import modelParameters from "@/modelParameters";
import { measures } from "@/measures";
import Charts from "@/components/Charts";
import Statistics from "@/components/Statistics";
import Card from "@/components/Card";
import sicknessModel from "@/models/sicknessModel";
import cohortSpecs from "@/cohortSpecs";
import { mapState } from "vuex";

const modelTypes = [InfectionModel, sicknessModel];
export default {
  name: "Game",
  components: {
    cdCharts: Charts,
    cdMeasures: Measures,
    cdStatistics: Statistics,
    cdCard: Card
  },
  props: {
    initialValues: Object
  },
  data() {
    return {
      models: null,
      allMeasures: measures,
      activeMeasures: [],
      modelState: {}
    };
  },

  methods: {
    getModelParameters() {
      modelParameters.initialPopulation = this.initialValues.initialPopulation;
      modelParameters.initialInfections = this.initialValues.initialInfections;
      modelParameters.cohorts = cohortSpecs;
      return modelParameters;
    },
    gotoNextDays(nDays = 1) {
      if (this.models === null) {
        this.initializeModels();
        this.$store.commit("start");
      }

      let states = this.updateModels(nDays);

      this.$refs.charts.update(...states);
      this.$refs.statistics.update(...states);
    },
    initializeModels() {
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
      this.$store.commit("stop");
      this.activeMeasures = [];
      this.$refs.charts.reset();
      this.$refs.statistics.reset();
    }
  },
  computed: mapState({
    running: state => state.running
  }),
  watch: {
    running(running) {
      if (!running) {
        this.reset();
      }
    }
  }
};
</script>

<style scoped></style>
