<template>
  <div>
    <b-tabs v-model="activeTab">
      <template v-for="chart in charts">
        <b-tab-item :key="chart.id" :label="chart.title">
          <component :is="chart.component" ref="charts" :id="chart.id" :config="chart.config" />
        </b-tab-item>
      </template>
      <b-tab-item v-if="isMobile" key="statistics" label="Statistics">
        <cd-statistics ref="statistics"></cd-statistics>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import BarChart from "@/components/BarChart";
import { chartColors } from "@/chartHelpers";
import Buttons from "@/components/Buttons";
import Statistics from "@/components/Statistics";
import { mapState } from "vuex";

export default {
  name: "Charts",
  components: {
    cdBarChart: BarChart,
    cdButtons: Buttons,
    cdStatistics: Statistics
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
      activeTab: 0
    };
  },
  computed: {
    ...mapState({
      isMobile: state => state.isMobile
    }),
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
    views() {
      return this.$refs.statistics
        ? [...this.$refs.charts, this.$refs.statistics]
        : this.$refs.charts;
    },
    update(...states) {
      this.views().forEach(chart => {
        chart.update(...states);
      });
    },
    reset() {
      this.views().forEach(chart => {
        chart.reset();
      });
    }
  }
};
</script>

<style scoped></style>
