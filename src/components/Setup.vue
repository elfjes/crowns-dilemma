<template
  ><div>
    <cd-multi-field :defaults="initialValues" :disabled="disabled" @input="update" />
    <button class="button is-danger" @click="$store.commit('stop')">
      Restart simulation
    </button>
  </div></template
>

<script>
import MultiField from "@/components/MultiField";
import { mapState } from "vuex";

export default {
  name: "Setup",
  components: {
    cdMultiField: MultiField
  },
  props: {
    disabled: Boolean,
    value: Object
  },
  computed: {
    ...mapState({
      initialValues: state => state.initialValues
    })
  },
  methods: {
    update(val) {
      this.$store.commit("updateInitialValues", val);
    }
  }
};
</script>

<style scoped></style>
