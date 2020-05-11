<template>
  <div>
    <template v-for="prop in properties">
      <div class="columns is-mobile" :key="prop.ref">
        <div class="column">
          <p class="has-text-weight-bold">{{ prop.displayName }}:</p>
        </div>
        <div class="column">
          <p>{{ getState(prop.ref) }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getNestedValue } from "@/helpers";

export default {
  name: "Statistics",
  data() {
    return {
      properties: [
        {
          ref: "newSickPeople",
          displayName: "New Cases"
        },
        {
          ref: "cohorts.MILD.total",
          displayName: "Mildly Sick"
        },
        {
          ref: "cohorts.HOSPITALIZED.total",
          displayName: "Hospitalized"
        },
        {
          ref: "cohorts.INTENSIVE_CARE.total",
          displayName: "Intensive Care"
        },
        {
          ref: "uninfectedPeople",
          displayName: "Uninfected"
        },

        {
          ref: "cohorts.CURED.total",
          displayName: "Cured"
        },
        {
          ref: "cohorts.DEAD.total",
          displayName: "Deceased"
        }
      ],
      state: {}
    };
  },
  methods: {
    getState(ref) {
      let val = getNestedValue(ref, this.state);
      return val === undefined ? "-" : val;
    },
    update(...states) {
      this.state = states[states.length - 1];
    },
    reset() {
      this.state = {};
    }
  }
};
</script>

<style scoped></style>
