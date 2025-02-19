import Vue from "vue";
import VueRouter from "vue-router";

// Import your components
import loginView from '../views/LoginView.vue';

import homeView from "../views/homeView.vue";
import ActivitiesView from "@/views/activities/activitiesView.vue";
import GroupsView from "@/views/groups/groupsView.vue";

Vue.use(VueRouter);

// Define routes
const routes = [
  { path: '/login', name: "LoginView", component: loginView },

  { path: "/", name: "HomeView", component: homeView, meta: { requiresAuth: true } },

  { path: "/activities", name: "ActivitiesView", component: ActivitiesView, meta: { requiresAuth: true } },

  { path: "/groups", name: "GroupsView", component: GroupsView, meta: { requiresAuth: true } },
];


const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
