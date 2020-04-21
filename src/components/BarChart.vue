<template>
  <canvas :id="id" />
</template>

<script>
import Chart from "chart.js";

export default {
  name: "StackedBarChart",
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
      type: "bar",
      options: {
        responsive: true,
        lineTension: 1,
        scales: {
          xAxes: [{ stacked: false }],
          yAxes: [
            {
              stacked: false,
              ticks: {
                beginAtZero: true,
                padding: 25
              }
            }
          ]
        }
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
      this.options.scales.xAxes[0].stacked =
        this.config.stacked || this.options.scales.xAxes[0].stacked;
      this.options.scales.yAxes[0].stacked =
        this.config.stacked || this.options.scales.xAxes[0].stacked;
      this.chart = new Chart(ctx, {
        type: this.type,
        data: this.emptyChartData(),
        options: this.options
      });
    },
    update(...updates) {
      updates.forEach(update => {
        this.chart.data.labels.push(update[this.config.xAttribute]);
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
