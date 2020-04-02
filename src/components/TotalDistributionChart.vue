<template>
  <canvas :id="id"></canvas>
</template>

<script>
import Chart from "chart.js";

const chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)"
};
export default {
  name: "Graph",
  props: {
    id: {
      type: String
    },
    title: {
      type: String
    },
    config: {
      type: Object,
      default() {
        return {
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
              label: "Sick",
              yAttribute: "sickPeople",
              backgroundColor: chartColors.red
            },
            {
              label: "Recovered",
              yAttribute: "curedPeople",
              backgroundColor: chartColors.green
            }
          ]
        };
      }
    }
  },
  data() {
    return {
      chart: null,
      type: "bar",
      options: {
        responsive: true,
        lineTension: 1,
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                padding: 25
              }
            }
          ]
        }
      },
      data: {
        labels: [],
        datasets: [
          {
            label: "Uninfected",
            data: [],
            backgroundColor: []
          },
          {
            label: "Infected",
            data: [],
            backgroundColor: []
          },
          {
            label: "Sick",
            data: [],
            backgroundColor: []
          },
          {
            label: "Recovered",
            data: [],
            backgroundColor: []
          }
        ]
      }
    };
  },
  methods: {
    emptyChartData() {
      let rv = {
        labels: [],
        datasets: []
      };
      this.config.datasets.forEach(datasetConfig => {
        rv.datasets.push({
          label: datasetConfig.label,
          data: [],
          backgroundColor: []
        });
      });

      return rv;
    },
    createChart() {
      const ctx = document.getElementById(this.id);
      this.chart = new Chart(ctx, {
        type: this.type,
        data: this.emptyChartData(),
        options: this.options
      });
    },
    update(...updates) {
      updates.forEach(update => {
        this.chart.data.labels.push(update["day"]);
        for (let i = 0; i < this.config.datasets.length; i++) {
          this.chart.data.datasets[i].data.push(update[this.config.datasets[i].yAttribute]);
          this.chart.data.datasets[i].backgroundColor.push(this.config.datasets[i].backgroundColor);
        }
      });
      this.chart.update();
    },
    reset() {
      this.chart.options = this.options;
      this.chart.data = this.emptyChartData();
      this.chart.update();
    }
  },
  mounted() {
    this.createChart();
  }
};
</script>

<style scoped></style>
