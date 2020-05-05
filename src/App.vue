<template>
  <div id="app">
    <section class="section">
      <cd-header :pages="pages" v-model="activePage" />
      <cd-game v-show="activePage === 'game'" :initial-values="initialValues" key="game" />
      <cd-settings v-show="activePage === 'setup'" :disabled="running" key="setup" />
    </section>
    <cd-footer></cd-footer>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Game from "@/components/Game";
import Footer from "@/components/Footer";
import { IntField, Schema } from "@/validation";
import Settings from "@/components/Settings";
import { mapState } from "vuex";

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
    cdFooter: Footer,
    cdSettings: Settings
  },
  computed: mapState({
    running: state => state.running,
    initialValues: state => state.initialValues
  }),
  data() {
    return {
      initialValueSchema: initialValueSchema,
      pages: [
        {
          id: "setup",
          name: "Setup"
        },
        {
          id: "game",
          name: "Game"
        }
      ],
      activePage: "game"
    };
  }
};
</script>

<style></style>
