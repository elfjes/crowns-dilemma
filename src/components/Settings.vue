<template>
  <div>
    <div v-if="running" class="notification is-warning is-light">
      Updating initial values is disabled while a simulation is running. Please restart (
      <span class="icon has-text-danger"> <i class="fas fa-undo"></i> </span>) the current
      simulation if you want to update any initial values
    </div>
    <div class="container">
      <cd-multi-field :defaults="initialValues" :disabled="disabled" @input="update" />
    </div>
  </div>
</template>

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
      initialValues: state => state.initialValues,
      running: state => state.running
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
