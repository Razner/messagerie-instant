import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import MessagerieView from '@/views/Messagerie.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/message',
      name: 'message',
      component: MessagerieView,
      meta: {
        requiresAuth: true
      }
    }
  ],
})

// Navigation guard pour vérifier l'authentification
router.beforeEach((to, from, next) => {
  // Si la route n'est pas la page de connexion
  if (to.path !== '/login') {
    const token = localStorage.getItem('token')
    if (!token) {
      // Rediriger vers la page de connexion si non authentifié
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    // Si on est sur la page de connexion et qu'on a déjà un token
    const token = localStorage.getItem('token')
    if (token) {
      // Rediriger vers la page d'accueil
      next({ path: '/' })
    } else {
      next()
    }
  }
})

export default router
