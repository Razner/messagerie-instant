<script setup>
import { RouterLink } from 'vue-router';
import { computed } from 'vue';

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('token');
});
</script>

<template>
  <div class="home">
    <h1>Bienvenue sur la messagerie instantanée</h1>
    <div class="navigation">
      <RouterLink v-if="!isAuthenticated" to="/login" class="nav-link">
        Se connecter
      </RouterLink>
      <RouterLink v-if="isAuthenticated" to="/message" class="nav-link">
        Accéder à la messagerie
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem;
  text-align: center;
}

.navigation {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.nav-link {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #369c6d;
}
</style>
