import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import adminhome from "../views/admin/adminhome.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    component: adminhome,
    name: "adminhome",
    path: "/adminhome",
  },
];

const router = new VueRouter({
  mode: "history",
  //base: process.env.BASE_URL,
  routes,
});

export default router;
