import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ChannelView from '../views/ChannelView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/channels',
      name: 'channels',
      component: ChannelView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ],
})

export default router
