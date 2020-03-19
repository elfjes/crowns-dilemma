<template>
  <div id="app">
    <section class="section">
      <div class="container">
        <h1 class="title">
          Crown's Dilemma
        </h1>
        <app-graph></app-graph>
        <button class="button is-primary" @click="nextDay">Next day</button>
      </div>
    </section>
  </div>
</template>

<script>
import Graph from "./components/Graph";
import { EventBus } from "./bus.js";

export default {
  name: "App",
  components: {
    appGraph: Graph
  },
  data() {
    return {
      currentInfections: 1,
      currentDay: 3
    };
  },
  methods: {
    nextDay() {
      this.currentInfections *= 1.2;
      this.currentDay++;
      EventBus.$emit("newDay:infections", {
        day: this.currentDay,
        infections: this.currentInfections
      });
    }
  }
};
</script>

<style></style>
