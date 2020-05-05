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
              v-model="values[field]"
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
    defaults: {
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
  data() {
    return {
      values: {}
    };
  },
  methods: {
    validate() {
      this.values = this.schema.load(this.values);
      this.$emit("input", this.values);
    }
  },
  created() {
    this.values = this.defaults;
  },
  watch: {
    defaults(val) {
      this.values = val;
    }
  }
};
</script>

<style scoped></style>
