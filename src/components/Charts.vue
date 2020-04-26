<template>
  <div>
    <cd-buttons :buttons="buttons" v-model="activeChart" />
    <component
      v-for="chart in charts"
      v-show="chart.id === activeChart"
      :is="chart.component"
      :key="chart.id"
      ref="charts"
      :id="chart.id"
      :title="chart.title"
      :config="chart.config"
    />
  </div>
</template>

<script>
import BarChart from "@/components/BarChart";
import { chartColors } from "@/chartHelpers";
import Buttons from "@/components/Buttons";

export default {
  name: "Charts",
  components: {
    cdBarChart: BarChart,
    cdButtons: Buttons
  },
  data() {
    return {
      charts: [
        {
          id: "infectionchart",
          title: "New Cases",
          component: "cdBarChart",
          config: {
            stacked: true,
            xAttribute: "day",
            datasets: [
              {
                label: "New Mild Cases",
                yAttribute: "cohorts.MILD.latest",
                backgroundColor: chartColors.orange
              },
              {
                label: "New Hospitalizations",
                yAttribute: "cohorts.HOSPITALIZED.latest",
                backgroundColor: chartColors.red
              },
              {
                label: "New on Intensive Care",
                yAttribute: "cohorts.INTENSIVE_CARE.latest",
                backgroundColor: chartColors.purple
              }
            ],
            yAttribute: "newInfections"
          }
        },
        {
          id: "sickpeoplechart",
          title: "Total Distribution",
          component: "cdBarChart",
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
                yAttribute: "cohorts.INFECTED.total",
                backgroundColor: chartColors.yellow
              },
              {
                label: "Mildly Sick",
                yAttribute: "cohorts.MILD.total",
                backgroundColor: chartColors.orange
              },
              {
                label: "Hospitalized",
                yAttribute: "cohorts.HOSPITALIZED.total",
                backgroundColor: chartColors.red
              },
              {
                label: "Intensive Care",
                yAttribute: "cohorts.INTENSIVE_CARE.total",
                backgroundColor: chartColors.purple
              },
              {
                label: "Recovered",
                yAttribute: "cohorts.CURED.total",
                backgroundColor: chartColors.green
              },
              {
                label: "Deceased",
                yAttribute: "cohorts.DEAD.total",
                backgroundColor: chartColors.darkGrey
              }
            ]
          }
        }
      ],
      activeChart: "infectionchart"
    };
  },
  computed: {
    buttons() {
      let out = [];
      this.charts.forEach(chart => {
        out.push({
          id: chart.id,
          name: chart.title
        });
      });
      return out;
    }
  },
  methods: {
    activate(chartId) {
      this.activeChart = chartId;
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
