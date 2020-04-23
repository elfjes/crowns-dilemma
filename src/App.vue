<template>
  <div id="app">
    <section class="section">
      <cd-header />
      <cd-game />
    </section>
    <cd-footer></cd-footer>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Game from "@/components/Game";
import Footer from "@/components/Footer";
import modelParameters from "@/modelParameters";
import { IntField, Schema } from "@/validation";

const initialValueSchema = new Schema({
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

export default {
  name: "App",
  components: {
    cdHeader: Header,
    cdGame: Game,
    cdFooter: Footer
  },
  data() {
    return {
      initialValues: {
        initialInfections: modelParameters.initialInfections,
        initialPopulation: modelParameters.initialPopulation
      },
      initialValueSchema: initialValueSchema
    };
  }
};
</script>

<style></style>
