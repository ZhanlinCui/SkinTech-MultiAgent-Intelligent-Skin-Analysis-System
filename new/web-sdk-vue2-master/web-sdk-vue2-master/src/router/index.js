import Vue from "vue";
import VueRouter from "vue-router";
import XrtcPlayer from "../views/XrtcPlayer.vue";
import AvatarView from "../views/avatardemo.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "avatar",
    component: AvatarView,
  },
  {
    path:"/player",
    name:"xrtcplayer",
    component:XrtcPlayer,
  }
];

const router = new VueRouter({
  routes,
});

export default router;
