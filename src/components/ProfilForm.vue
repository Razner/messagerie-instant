<script setup>
import { ProfilStore } from '@/stores/profil';
import { onMounted, ref } from 'vue';

const profilStore = ProfilStore();
const username = ref('');
const image = ref('');
const status = ref('');
const userMeta = ref(null)

const isUsername = ref(false);
const isImage = ref(false);
const isStatus = ref(false);

onMounted(async () => {
  const userArray = await profilStore.getUser()
  if (userArray == []) {
    userMeta.value = [];
  } else {
    userMeta.value = userArray[0]
    if (userMeta.value.display_name != "") {
      isUsername.value = true;
    }
    if (userMeta.value.img != "") {
      isImage.value = true;
    }
    if (userMeta.value.status != "") {
      isStatus.value = true;
    }
  }
})


</script>

<template>
  <div class="page">
    <h1>Profil</h1>
    <div>Connecté en tant que {{ profilStore.user }}</div>
    <div class="form">
      <div class="input">
        <label v-if="isUsername" for="username">Pseudo actuel : {{ userMeta.display_name }}</label>
        <label v-else for="username">Aucun pseudo n'est défini</label>
        <input type="text" v-model="username" placeholder="Nouveau pseudo" id="username" />
      </div>
      <div class="input">
        <label v-if="isImage" for="image">PP actuelle : <img :src="userMeta.img" width="200" height="200" /></label>
        <label v-else for="image">Aucune image n'est définie</label>
        <input type="text" v-model="image" placeholder="Nouveau lien d'image" id="image" />
      </div>
      <div class="input">
        <label v-if="isStatus" for="status">Status actuel : {{ userMeta.status }}</label>
        <label v-else for="status">Aucun status n'est défini</label>
        <input type="text" v-model="status" placeholder="Nouveau status" id="status" />
      </div>

      <button @click="profilStore.CreateUserMeta(profilStore.user, username, image, status)" class="button">Modifier les
        données</button>
    </div>
  </div>
</template>

<style scoped>

.page{
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.button{
  width: fit-content;
}

.input {
  display: flex;
  flex-direction: column;
  width: 75%;
}
</style>
