<template>
  <div class="box">
    <h2 class="title is-4">Statistics</h2>
    <template v-for="prop in properties">
      <div class="columns is-desktop" :key="prop.ref">
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
export default {
  name: "Statistics",
  data() {
    return {
      properties: [
        {
          ref: "newInfections",
          displayName: "New Infections"
        },
        {
          ref: "infectedPeople",
          displayName: "Infected People"
        },
        {
          ref: "sickPeople",
          displayName: "Sick People"
        },
        {
          ref: "uninfectedPeople",
          displayName: "Uninfected People"
        },
        {
          ref: "curedPeople",
          displayName: "Cured People"
        }
      ],
      state: {}
    };
  },
  methods: {
    getState(ref) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.state.hasOwnProperty(ref)) {
        return this.state[ref];
      }
      return "-";
    },
    update(...states) {
      this.state = states[states.length - 1];
    }
  }
};
</script>

<style scoped></style>
