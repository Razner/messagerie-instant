<script setup>
</script>

<template>
  <header class="app-header">
    <div class="logo">
      <router-link to="/">
        <img src="/Konekt.png" alt="Konekt Logo" class="logo-image" />
      </router-link>
    </div>
    <nav class="nav-links">
      <router-link to="/">Accueil</router-link>
      <router-link to="/channels">Channels</router-link>
    </nav>
  </header>

  <main>
    <router-view />
  </main>
</template>
