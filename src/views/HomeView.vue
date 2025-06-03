<script setup>
import { RouterLink } from 'vue-router';
import { computed } from 'vue';

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('token');
});
</script>

<template>
  <div class="home">
    <h1>Bienvenue sur Konekt</h1>

    <div class="features">
      <div class="feature-card">
        <h2>Gestion des Channels</h2>
        <p>Créez et gérez vos channels de discussion</p>
        <router-link to="/channels" class="btn">Accéder aux Channels</router-link>
      </div>
      <div class="feature-card">
        <h2>Messagerie Instantanée</h2>
        <p>Discutez en temps réel avec vos collègues</p>
        <router-link to="/message" class="btn">Accéder à la Messagerie</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem;
  text-align: center;
}

.features {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 2rem;
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 300px;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.btn:hover {
  background-color: #369c6d;
}
</style>
