<template>
  <div class="box">
    <h2 class="title is-4">Measures</h2>
    <div class="field">
      <div v-for="measure in measures" :key="measure.id" class="control">
        <button
          class="button is-small"
          :class="{ 'is-info': measureMap[measure.id].active }"
          @click="clicked(measure.id)"
        >
          {{ measure.displayName }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Measures.vue",
  props: {
    measures: {
      type: Array,
      default() {
        return [];
      }
    },
    value: {
      type: Array
    }
  },
  data() {
    return {
      measureMap: this.getMeasureMap()
    };
  },
  methods: {
    getMeasureMap() {
      let rv = {};
      this.measures.forEach(measure => {
        rv[measure.id] = {
          active: false,
          measure
        };
      });
      return rv;
    },
    clicked(id) {
      this.measureMap[id].active = !this.measureMap[id].active;

      let activeMeasures = [];
      Object.values(this.measureMap).forEach(item => {
        if (item.active) {
          activeMeasures.push(item.measure);
        }
      });

      this.$emit("input", activeMeasures);
    }
  },
  watch: {
    value(activeMeasures) {
      this.measureMap = this.getMeasureMap();
      activeMeasures.forEach(measure => {
        this.measureMap[measure.id].active = true;
      });
    }
  }
};
</script>

<style scoped></style>
