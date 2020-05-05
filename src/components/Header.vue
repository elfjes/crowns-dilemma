<template>
  <div class="level is-mobile">
    <div class="level-left">
      <div class="level-item">
        <h1 class="title is-4 is-3-mobile">
          Crown's Dilemma
        </h1>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <div class="field has-addons">
          <p class="control">
            <cd-button
              :class="{ 'is-info': activePage === 'setup' }"
              @click="toggleSetup"
              icon="cog"
              >Setup
            </cd-button>
          </p>
          <p class="control">
            <cd-button
              :class="{ 'is-danger': running, 'has-text-danger': !running }"
              @click="$store.commit('stop')"
              icon="undo"
              >Restart simulation</cd-button
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import Button from "@/components/Button";

  export default {
  name: "Header",
  components: {
    cdButton: Button
  },
  props: {
    pages: {
      type: Array
    },
    value: String
  },
  data() {
    return {
      activePage: null
    };
  },
  methods: {
    doClick(val) {
      this.activePage = val;
      this.$emit("input", val);
    },
    toggleSetup() {
      this.activePage = this.activePage === "setup" ? "game" : "setup";
      this.$emit("input", this.activePage);
    }
  },
  computed: mapState({
    isMobile: state => state.isMobile,
    running: state => state.running
  }),
  created() {
    this.activePage = this.value;
  },
  watch: {
    value(val) {
      this.activePage = val;
    }
  }
};
</script>

<style scoped></style>
