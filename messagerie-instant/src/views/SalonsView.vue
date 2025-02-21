<template>
  <div>
    <h2>Salons</h2>
    <div v-if="errorMessage">{{ errorMessage }}</div>
    <ul>
      <li v-for="salon in salons" :key="salon.channel_id">
        {{ salon.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getChannels } from '../api.js';

export default {
  setup() {
    const router = useRouter();
    const salons = ref([]);
    const errorMessage = ref('');

    onMounted(async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("Aucun token trouvé, redirection vers la page de connexion.");
        router.push({ name: 'Login' });
        return;
      }

      try {
        console.log("Tentative de récupération des salons avec le token...");
        salons.value = await getChannels();
        console.log("Salons récupérés :", salons.value);
      } catch (error) {
        console.error("Erreur lors de la récupération des salons :", error);
        errorMessage.value = 'Erreur lors de la récupération des salons.';
      }
    });

    return { salons, errorMessage };
  },
};
</script>

