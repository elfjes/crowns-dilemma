<template>
  <div>
    <div class="buttons has-addons">
      <button
        v-for="chart in charts"
        :key="chart.id"
        class="button"
        :class="{ 'is-info': chart.id === activeChart }"
        @click="activate(chart.id)"
      >
        {{ chart.title }}
      </button>
    </div>
    <cd-bar-chart
      v-for="chart in charts"
      v-show="chart.id === activeChart"
      :key="chart.id"
      ref="charts"
      :id="chart.id"
      :title="chart.title"
      :x-attribute="chart.xAttribute"
      :y-attribute="chart.yAttribute"
    ></cd-bar-chart>
  </div>
</template>

<script>
import BarChart from "./BarChart";

export default {
  name: "Charts",
  components: {
    cdBarChart: BarChart
  },
  data() {
    return {
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
      activeChart: "infectionchart"
    };
  },
  methods: {
    activate(idx) {
      this.activeChart = idx;
    },
    update(...states) {
      this.$refs.charts.forEach(chart => {
        chart.update(...states);
      });
    }
  }
};
</script>

<style scoped></style>
