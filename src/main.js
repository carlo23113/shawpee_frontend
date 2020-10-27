import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { createProvider } from "./vue-apollo";
import swal from "sweetalert";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  swal,
  apolloProvider: createProvider(),
  render: (h) => h(App),
}).$mount("#app");
