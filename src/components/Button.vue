<template>
  <button class="button" @click="$emit('click')">
    <span class="icon">
      <i class="fas" :class="iconClass"></i>
    </span>
    <span v-if="!isMobile || mobileText"><slot /></span>
  </button>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Button",
  props: {
    icon: String,
    mobileText: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      isMobile: state => state.isMobile
    }),
    iconClass() {
      return "fa-" + this.icon;
    }
  }
};
</script>

<style scoped></style>
