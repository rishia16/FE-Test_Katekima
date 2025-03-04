import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/detail/:name',
    name: 'Detail',
    component: () => import('../views/DetailsView.vue'),
    props: true
  },
  {
    path: '/add',
    name: 'AddProduct',
    component: () => import('../views/AddView.vue'),
  },
  {
    path: '/edit/:id',
    name: 'EditProduct',
    component: () => import('../views/EditView.vue'),
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
