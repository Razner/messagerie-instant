import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'messagerie',
      component: () => import('../views/Messagerie.vue'),
      meta: {
        title: 'Messagerie',
      },
    },
  ],
})

export default router
