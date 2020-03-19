<template>
  <div id="app">
    <section class="section">
      <div class="container">
        <h1 class="title">
          Crown's Gambit
        </h1>
        <app-graph></app-graph>
      </div>
    </section>
  </div>
</template>

<script>
import Graph from "./components/Graph";
export default {
  name: "App",
  components: {
    appGraph: Graph
  }
};
</script>

<style>
</style>
