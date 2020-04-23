<template>
  <div>
    <div v-for="field in schema.fieldNames" class="field is-horizontal" :key="field">
      <div class="field-label is-normal">
        <label class="label">{{ field }}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input
              class="input"
              type="text"
              v-model="value[field]"
              @blur="validate()"
              :disabled="disabled"
            />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IntField, Schema } from "@/validation";

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
    },
    schema: {
      type: Schema,
      default() {
        return new Schema({
          fields: {
            initialInfections: new IntField({ minVal: 0, default: 0 }),
            initialPopulation: new IntField({ minVal: 0, default: 0 })
          },
          loaders: [
            obj => {
              if (obj.initialInfections > obj.initialPopulation) {
                obj.initialInfections = obj.initialPopulation;
              }
              return obj;
            }
          ]
        });
      }
    }
  },

  methods: {
    validate() {
      this.value = this.schema.load(this.value);
      this.$emit("input", this.value);
    }
  }
};
</script>

<style scoped></style>
