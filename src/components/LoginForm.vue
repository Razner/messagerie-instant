<script setup>
import { LoginStore } from '@/stores/auth';
import { ref } from 'vue';

const loginStore = LoginStore()
const username = ref('');
const password = ref('');

</script>

<template>
  <div class="form">
    <input type="text" v-model="username" placeholder="Pseudo" class="input"/>
  <input type="password" v-model="password" placeholder="Mot de passe" class="input"/>
  <button @click="loginStore.Login(username, password)" class="button">Se connecter</button>
  </div>

</template>

<style>
  .input {
    padding: 1%;
    width: 75%;
    border-radius: 0.5rem;
    box-shadow: none;
    border: none;
  }

  .form {
    display: flex;
    width: 50%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10%;
  }

  .button {
    padding: 3%;
    background-color: #4CAF50;
    border-radius: 0.5rem;
    color: white;
    border: none;
    cursor: pointer;
  }

  .button:hover {
    background-color: #45a049;
  }

  .button:active {
    background-color: white;
    color: #4CAF50;
  }
</style>
