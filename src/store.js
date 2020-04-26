import Vue from "vue";
import Vuex from "vuex";
import modelParameters from "@/modelParameters";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    running: false,
    initialValues: {
      initialInfections: modelParameters.initialInfections,
      initialPopulation: modelParameters.initialPopulation
    },
    models: []
  },
  mutations: {
    start(state) {
      state.running = true;
    },
    stop(state) {
      state.running = false;
    },
    updateInitialValues(state, payload) {
      state.initialValues = { ...state.initialValues, ...payload };
    }
  }
});
