import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import BrowsePage from '../pages/BrowsePage.vue'
import ComponentPage from '../pages/ComponentPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/browse',
      name: 'browse',
      component: BrowsePage,
    },
    {
      path: '/component/:id',
      name: 'component',
      component: ComponentPage,
    },
  ],
})

export default router
