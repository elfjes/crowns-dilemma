<template>
  <div>
    <div v-for="field in Object.keys(value)" class="field is-horizontal" :key="field">
      <div class="field-label is-normal">
        <label class="label">{{ field }}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input
              class="input"
              type="text"
              v-model="value[field].value"
              @blur="validate(value[field])"
              :disabled="disabled"
            />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const converters = {
  integer(value) {
    let rv = parseInt(value);
    if (isFinite(rv)) return rv;
    return 0;
  },
  decimal(value) {
    let rv = parseFloat(value);
    if (isFinite(rv)) return rv;
    return 0;
  }
};
export default {
  name: "MultiField",
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
  methods: {
    validate(field) {
      if (converters[field.type] !== undefined) {
        field.value = converters[field.type](field.value);
      }
      if (field.minVal !== undefined && field.value < field.minVal) {
        field.value = field.minVal;
      }
      if (field.maxVal !== undefined && field.value > field.maxVal) {
        field.value = field.maxVal;
      }
    }
  }
};
</script>

<style scoped></style>
