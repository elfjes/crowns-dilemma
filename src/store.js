import Vue from "vue";
import Vuex from "vuex";
import modelParameters from "@/modelParameters";
import { isMobile } from "@/helpers";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    running: false,
    initialValues: {
      initialInfections: modelParameters.initialInfections,
      initialPopulation: modelParameters.initialPopulation
    },
    models: [],
    isMobile: isMobile()
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
    },
    setMobile(state) {
      state.isMobile = true;
    },
    setDesktop(state) {
      state.isMobile = false;
    }
  }
});

window.addEventListener("resize", () => {
  if (isMobile()) {
    store.commit("setMobile");
  } else {
    store.commit("setDesktop");
  }
});

export default store;
