import { createRouter, createWebHistory } from 'vue-router'
import CatalogoView from '@/views/CatalogoView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/catalogo',
      name: 'catalogo',
      component: CatalogoView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    }
  ],
})

export default router
