<template>
  <canvas :id="id"></canvas>
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
    xAttribute: {
      type: String
    },
    yAttribute: {
      type: String
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
    createChart() {
      const ctx = document.getElementById(this.id);
      this.chart = new Chart(ctx, {
        type: this.type,
        data: this.data,
        options: this.options
      });
    },
    update(...updates) {
      updates.forEach(update => {
        this.chart.data.labels.push(update[this.xAttribute]);
        this.chart.data.datasets[0].data.push(update[this.yAttribute]);
        this.chart.data.datasets[0].backgroundColor.push(this.backgroundColor);
        this.chart.data.datasets[0].borderColor.push(this.borderColor);
      });
      this.chart.update();
    }
  },
  mounted() {
    this.createChart();
  }
};
</script>

<style scoped></style>
