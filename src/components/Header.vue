<template>
  <div class="level">
    <div class="level-left">
      <div class="level-item">
        <h1 class="title is-4 is-3-mobile">
          Crown's Dilemma
        </h1>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <cd-buttons :buttons="pages" :value="activePage" @click="doClick($event)" />
      </div>
    </div>
  </div>
</template>

<script>
import Buttons from "@/components/Buttons";
export default {
  name: "Header",
  components: { cdButtons: Buttons },
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
    }
  },
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
