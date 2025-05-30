import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfilView from '@/views/ProfilView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/profil',
      name: 'profil',
      component: ProfilView
    }

  ],
})

router.beforeEach((to) => {
  const token = sessionStorage.getItem("token");
  if (to.name !== 'login' && !token) {
    return { name: 'login' }
  }
  return true
})

export default router
