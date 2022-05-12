import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requireLogin: false,
    },
    children: [],
  },
  {
    path: '/about/:id',
    name: 'about',
    component: AboutView,
    meta: {
      requireLogin: false,
    },
    children: [],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
