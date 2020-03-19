<template>
  <canvas id="infection-chart"></canvas>
</template>

<script>
import Chart from "chart.js";
import {EventBus} from "../bus.js";

export default {
  name: "Graph",
  data() {
    return {
      chart: null,
      backgroundColor: "rgba(54,73,93,.5)",
      borderColor: "#36495d",
      type: "bar",
      options: {
        responsive: true,
        lineTension: 1,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                padding: 25
              }
            }
          ]
        }
      },
      data: {
        labels: [0, 1, 2],
        datasets: [
          {
            label: "Number of Infections",
            data: [1, 2, 3],
            backgroundColor: [
              "rgba(54,73,93,.5)",
              "rgba(54,73,93,.5)",
              "rgba(54,73,93,.5)"
            ],
            borderColor: ["#36495d", "#36495d", "#36495d"],
            borderWidth: 3
          }
        ]
      }
    };
  },
  computed: {
    datasets() {
      let out = {
        label: "Number of Infections",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 3
      };
      for (let i = 0; i < this.infections.length; i++) {
        out.data.push(this.infections[i]);
        out.backgroundColor.push(this.backgroundColor);
        out.borderColor.push(this.borderColor);
      }
      return [out];
    }
  },
  methods: {
    createChart(chartId) {
      const ctx = document.getElementById(chartId);
      this.chart = new Chart(ctx, {
        type: this.type,
        data: this.data,
        options: this.options
      });
    },
    updateChart(payload) {
      this.chart.data.labels.push(payload.day);
      this.chart.data.datasets[0].data.push(payload.infections);
      this.chart.data.datasets[0].backgroundColor.push(this.backgroundColor);
      this.chart.data.datasets[0].borderColor.push(this.borderColor);
      this.chart.update()
    }
  },
  mounted() {
    this.createChart("infection-chart");
    EventBus.$on("newDay:infections", this.updateChart);
  },
  destroy() {
    EventBus.$off("newDay:infections", this.updateChart);
  }
};
</script>

<style scoped></style>
