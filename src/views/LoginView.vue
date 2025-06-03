<script setup>
import LoginForm from '@/components/LoginForm.vue';


</script>

<template>
  <div class="loginPage">
    <LoginForm />
    <img
      src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTZ2ZTg5MmcwdmxoZGh1OXE3eG1hZnA1NWF5d3dkZ3l5N3AxYmh4cyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XreQmk7ETCak0/giphy.gif"
      alt="Pouce en l'air" class="gif" />
  </div>
</template>

<style scoped>
.gif {
  display: flex;
}

.loginPage {
  height: 100vh;
  display: flex;
  flex-direction: row;
}

@media (max-width: 600px) {
  .gif {
    display: none;
  }
}

@media (max-width: 1024px) {
  .loginPage {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
