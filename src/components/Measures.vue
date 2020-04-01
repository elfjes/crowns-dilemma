<template>
  <section class="container">
    <h2 class="title is-2">Measures</h2>
    <div class="field">
      <div v-for="(measure, index) in measures" :key="index" class="control">
        <button class="button" :class="{ 'is-info': isActive[index] }" @click="clicked(index)">
          {{ measure.displayName }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from "vue";

export default {
  name: "Measures.vue",
  props: {
    measures: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      isActive: new Array(this.measures.length).fill(false)
    };
  },
  methods: {
    clicked(index) {
      this.isActive[index] = Vue.set(this.isActive, index, !this.isActive[index]);

      let activeMeasures = [];
      for (let i = 0; i < this.measures.length; i++) {
        if (this.isActive[i]) {
          activeMeasures.push(this.measures[i]);
        }
      }
      this.$emit("input", activeMeasures);
    }
  }
};
</script>

<style scoped></style>
