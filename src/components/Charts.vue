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
import BarChart from "@/components/BarChart";
import StackedBarChart from "@/components/StackedBarChart";
import { chartColors } from "@/chartHelpers";

export default {
  name: "Charts",
  components: {
    cdBarChart: BarChart,
    cdStackedBarChart: StackedBarChart
  },
  data() {
    return {
      charts: [
        {
          id: "infectionchart",
          title: "New Infections",
          component: "cdStackedBarChart",
          config: {
            stacked: false,
            xAttribute: "day",
            datasets: [
              {
                label: "New Cases",
                yAttribute: "newSickPeople",
                backgroundColor: chartColors.red
              },
              {
                label: "New Hospitalizations",
                yAttribute: "newHospitalizedPeople",
                backgroundColor: chartColors.purple
              }
            ],
            yAttribute: "newInfections"
          }
        },
        {
          id: "sickpeoplechart",
          title: "Total Distribution",
          component: "cdStackedBarChart",
          config: {
            stacked: true,
            xAttribute: "day",
            datasets: [
              {
                label: "Uninfected",
                yAttribute: "uninfectedPeople",
                backgroundColor: chartColors.blue
              },
              {
                label: "Infected",
                yAttribute: "infectedPeople",
                backgroundColor: chartColors.yellow
              },
              {
                label: "Mildly Sick",
                yAttribute: "mildlySickPeople",
                backgroundColor: chartColors.red
              },
              {
                label: "Hospitalized",
                yAttribute: "hospitalizedPeople",
                backgroundColor: chartColors.purple
              },
              {
                label: "Recovered",
                yAttribute: "curedPeople",
                backgroundColor: chartColors.green
              }
            ]
          }
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
