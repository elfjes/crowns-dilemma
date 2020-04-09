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
    <component
      v-for="chart in charts"
      v-show="chart.id === activeChart"
      :is="chart.component"
      :key="chart.id"
      ref="charts"
      :id="chart.id"
      :title="chart.title"
      :config="chart.config"
    ></component>
  </div>
</template>

<script>
import BarChart from "./BarChart";
import TotalDistributionChart from "./TotalDistributionChart";

export default {
  name: "Charts",
  components: {
    cdBarChart: BarChart,
    cdTotalDistributionChart: TotalDistributionChart
  },
  data() {
    return {
      charts: [
        {
          id: "infectionchart",
          title: "New Infections",
          component: "cdBarChart",
          config: {
            xAttribute: "day",
            yAttribute: "newInfections"
          }
        },
        {
          id: "sickpeoplechart",
          title: "Total Distribution",
          component: "cdTotalDistributionChart",
          config: undefined
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
    },
    reset() {
      this.$refs.charts.forEach(chart => {
        chart.reset();
      });
    }
  }
};
</script>

<style scoped></style>
