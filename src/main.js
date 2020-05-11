import Vue from "vue";
import App from "@/App.vue";
import "./../node_modules/bulma/css/bulma.css";
import store from "@/store";
import { Tabs } from "buefy";
Vue.config.productionTip = false;

Vue.use(Tabs);
new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
