<template>
  <div class="buttons has-addons">
    <button
      v-for="button in buttonsAsObjects"
      :key="button.id"
      class="button"
      :class="buttonClass(button)"
      @click="doClick(button.id)"
    >
      {{ button.name }}
    </button>
  </div>
</template>

<script>
export default {
  name: "Buttons",
  props: {
    buttons: Array,
    value: String,
    activeClass: {
      type: String,
      default: "is-info"
    }
  },
  data() {
    return {
      activeButton: null
    };
  },
  computed: {
    buttonsAsObjects() {
      let out = [];
      this.buttons.forEach(button => {
        if (button instanceof Object) {
          out.push(button);
        } else {
          out.push({
            name: button,
            id: button
          });
        }
      });
      return out;
    }
  },
  methods: {
    doClick(button) {
      this.activeButton = button;
      this.$emit("input", button);
      this.$emit("click", button);
    },
    buttonClass(button) {
      let out = {};
      if (button.id === this.activeButton) {
        out[this.activeClass] = true;
      }
      return out;
    }
  },
  created() {
    this.activeButton = this.value;
  },
  watch: {
    value(val) {
      this.activeButton = val;
    }
  }
};
</script>

<style scoped></style>
