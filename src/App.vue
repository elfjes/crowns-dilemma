<template>
  <div id="app">
    <section class="section">
      <div class="container">
        <h1 class="title">
          Crown's Dilemma
        </h1>
        <cd-bar-chart
          v-for="chart in charts"
          :key="chart.id"
          ref="charts"
          :id="chart.id"
          :title="chart.title"
          :x-attribute="chart.xAttribute"
          :y-attribute="chart.yAttribute"
        ></cd-bar-chart>
        <button class="button is-primary" @click="gotoNextDay">Next day</button>
      </div>
    </section>
  </div>
</template>

<script>
import BarChart from "./components/BarChart";
import Model from "@/model";

export default {
  name: "App",
  components: {
    cdBarChart: BarChart
  },
  data() {
    return {
      currentInfections: 1,
      currentDay: 0,
      model: new Model(10000, 2),
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
      ]
    };
  },
  methods: {
    gotoNextDay() {
      this.model.update();
      let state = this.model.getState();
      console.log(state);

      this.$refs.charts.forEach(chart => {
        chart.updateChart(state);
      });
    }
  }
};
</script>

<style></style>
