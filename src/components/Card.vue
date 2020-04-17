<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ title }}
      </p>
      <p class="card-header-icon" aria-label="show/hide content" @click="visible = !visible">
        <span class="icon">
          <i
            class="fas"
            :class="visible ? 'fa-angle-left' : 'fa-angle-down'"
            aria-hidden="true"
          ></i>
        </span>
      </p>
    </header>
    <div v-if="visible" class="card-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    title: {
      type: String
    },
    startCollapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: !this.startCollapsed
    };
  }
};
</script>

<style scoped></style>
