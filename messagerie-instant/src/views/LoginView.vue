<template>
    <div>
      <h1>Connexion</h1>
      <form @submit.prevent="handleLogin">
        <input v-model="username" type="text" placeholder="Nom d'utilisateur" required />
        <input v-model="password" type="password" placeholder="Mot de passe" required />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { login } from '../api.js';  
  
  const username = ref("");
  const password = ref("");
  
  const handleLogin = async () => {
    try {
      const token = await login(username.value, password.value); 
      localStorage.setItem("token", token);
      console.log("Connexion réussie :", token);
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  };
  </script>
  