<template>
  <section>
    <h2 class="title is-2">Initial Values</h2>
    <div v-for="field in Object.keys(value)" class="field is-horizontal" :key="field">
      <div class="field-label is-normal">
        <label class="label">{{ field }}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input class="input" type="text" v-model="value[field]" :disabled="disabled" />
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "InitialValues",
  props: {
    value: {
      type: Object,
      default() {
        return {};
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

};
</script>

<style scoped></style>
