<template>
  <div>
    <canvas :id="id"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

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
      type: Object
    }
  },
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
        labels: [],
        datasets: [
          {
            label: this.title,
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 3
          }
        ]
      }
    };
  },
  methods: {
    emptyChartData() {
      return {
        labels: [],
        datasets: [
          {
            label: this.title,
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 3
          }
        ]
      };
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
        this.chart.data.labels.push(update[this.config.xAttribute]);
        this.chart.data.datasets[0].data.push(update[this.config.yAttribute]);
        this.chart.data.datasets[0].backgroundColor.push(this.backgroundColor);
        this.chart.data.datasets[0].borderColor.push(this.borderColor);
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
