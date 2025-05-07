<script setup>
import { ref, onMounted } from "vue";
import {
  createChannel,
  getChannels,
  deleteChannel,
  updateChannelMetadata,
} from "../stores/channels";

const newChannelImage = ref(null);
const channels = ref([]);
const newChannel = ref({
  name: "",
  description: "",
});
const loading = ref(false);
const error = ref("");
const errorDetails = ref("");
const success = ref("");
const deletingChannel = ref(false);
const editingChannel = ref(false);
const editChannelId = ref(null);
const editChannelName = ref("");
const editChannelDescription = ref("");
const editChannelImage = ref(null);
const editChannelImagePreview = ref("");
const showEditModal = ref(false);

onMounted(async () => {
  try {
    loading.value = true;
    const response = await getChannels();
    channels.value = response;
  } catch (err) {
    error.value = "Erreur lors du chargement des channels";
    if (err.message) {
      errorDetails.value = `Détail: ${err.message}`;
    }
    console.error(err);
  } finally {
    loading.value = false;
  }
});

async function handleCreateChannel() {
  if (!newChannel.value.name) {
    error.value = "Le nom du channel est requis";
    return;
  }

  try {
    loading.value = true;
    error.value = "";
    errorDetails.value = "";
    success.value = "";

    if (newChannelImage.value && newChannelImage.value instanceof File) {
      const formData = new FormData();
      formData.append("name", newChannel.value.name);
      if (newChannel.value.description) {
        formData.append("description", newChannel.value.description);
      }
      formData.append("image", newChannelImage.value);

      const response = await instance.post("/protected/channel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data.imageUrl;

      channels.value.push({ ...response.data, imageUrl });
    } else {
      const payloadWithDefaultImage = {
        ...newChannel.value,
        imageUrl: "/Konekt.png",
      };
      const createdChannel = await createChannel(payloadWithDefaultImage);
      channels.value.push(createdChannel);
    }

    newChannel.value = {
      name: "",
      description: "",
    };
    newChannelImage.value = null;

    success.value = "Votre channel a été créé";
  } catch (err) {
    error.value = "Erreur lors de la création du channel";
    errorDetails.value = err.message || "Erreur inconnue";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function handleDeleteChannel(channelId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce channel ?")) {
    return;
  }

  const id = parseInt(channelId, 10);
  console.log(`Suppression du channel avec l'ID: ${id} (type: ${typeof id})`);

  try {
    deletingChannel.value = true;
    error.value = "";
    errorDetails.value = "";

    await deleteChannel(id);

    channels.value = channels.value.filter((channel) => channel.id !== id);

    success.value = "Vous avez supprimé(e) votre channel";
  } catch (err) {
    error.value = "Erreur lors de la suppression du channel";

    if (err.response) {
      errorDetails.value = `Statut: ${err.response.status}, Message: ${JSON.stringify(
        err.response.data || "Pas de détails"
      )}`;
      console.error("Réponse du serveur:", err.response);
    } else if (err.request) {
      errorDetails.value = "Impossible de se connecter au serveur.";
      console.error("Requête envoyée mais pas de réponse:", err.request);
    } else {
      errorDetails.value = err.message || "Erreur inconnue";
    }

    console.error("Erreur détaillée:", err);
  } finally {
    deletingChannel.value = false;
  }
}

function openEditModal(channel) {
  editChannelId.value = channel.id;
  editChannelName.value = channel.name;
  editChannelDescription.value = channel.description || "";
  editChannelImage.value = null;
  editChannelImagePreview.value = channel.imageUrl || "";
  showEditModal.value = true;
}

function handleImageChange(event) {
  const file = event.target.files[0];
  console.log(file);
  if (file) {
    editChannelImage.value = file;

    if (editChannelImagePreview.value) {
      URL.revokeObjectURL(editChannelImagePreview.value);
    }
    editChannelImagePreview.value = URL.createObjectURL(file);
  }
}

function removeImage() {
  if (
    editChannelImagePreview.value &&
    !editChannelImagePreview.value.startsWith("http")
  ) {
    URL.revokeObjectURL(editChannelImagePreview.value);
  }

  editChannelImage.value = null;
  editChannelImagePreview.value = "";
}

async function handleUpdateChannel() {
  if (!editChannelName.value.trim()) {
    error.value = "Le nom du channel est requis";
    return;
  }

  try {
    editingChannel.value = true;
    error.value = "";
    errorDetails.value = "";
    success.value = "";

    const metadata = {
      name: editChannelName.value,
      description: editChannelDescription.value,
    };

    if (editChannelImage.value) {
      metadata.image = editChannelImage.value;
    } else if (
      editChannelImagePreview.value === "" &&
      channels.value.find((ch) => ch.id === editChannelId.value)?.imageUrl
    ) {
      metadata.image = null;
    }

    const updatedChannel = await updateChannelMetadata(editChannelId.value, metadata);

    const index = channels.value.findIndex((ch) => ch.id === editChannelId.value);
    if (index !== -1) {
      channels.value[index] = { ...channels.value[index], ...updatedChannel };
    }

    success.value = "Channel mis à jour avec succès";
    showEditModal.value = false;
  } catch (err) {
    error.value = "Erreur lors de la mise à jour du channel";

    if (err.response) {
      errorDetails.value = `Statut: ${err.response.status}, Message: ${JSON.stringify(
        err.response.data || "Pas de détails"
      )}`;
      console.error("Détails de la réponse:", err.response);
    } else if (err.request) {
      errorDetails.value = "Impossible de se connecter au serveur.";
      console.error("Requête envoyée mais pas de réponse:", err.request);
    } else {
      errorDetails.value = err.message || "Erreur inconnue";
    }

    console.error("Erreur lors de la mise à jour:", err);
  } finally {
    editingChannel.value = false;
  }
}

function closeEditModal() {
  showEditModal.value = false;
  if (
    editChannelImagePreview.value &&
    !editChannelImagePreview.value.startsWith("http")
  ) {
    URL.revokeObjectURL(editChannelImagePreview.value);
  }
}
</script>

<template>
  <div class="channel-page">
    <h1>Gestion des Channels</h1>
    <div class="channel-form">
      <h2>Créer un nouveau channel</h2>

      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
        <p v-if="errorDetails" class="error-details">{{ errorDetails }}</p>
      </div>

      <div v-if="success" class="success-message">{{ success }}</div>

      <form @submit.prevent="handleCreateChannel">
        <div class="form-group">
          <label for="channelName">Nom du channel *</label>
          <div class="input-with-icon">
            <span class="hashtag">#</span>
            <input
              id="channelName"
              v-model="newChannel.name"
              type="text"
              required
              placeholder="nouveau-channel"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="channelDescription">Description</label>
          <textarea
            id="channelDescription"
            v-model="newChannel.description"
            placeholder="Ajouter une description..."
          ></textarea>
        </div>

        <div class="form-group">
          <label for="editChannelImage">Image du channel</label>
          <div class="image-upload-container">
            <div v-if="editChannelImagePreview" class="image-preview">
              <img :src="editChannelImagePreview" alt="Prévisualisation" />
              <button type="button" @click="removeImage" class="remove-image-button">
                <span class="delete-icon">×</span> Supprimer l'image
              </button>
            </div>
            <input
              id="editChannelImage"
              type="file"
              accept="image/*"
              @change="handleImageChange"
              class="image-input"
            />
            <label for="editChannelImage" class="image-input-label">
              {{ editChannelImagePreview ? "Changer l'image" : "Ajouter une image" }}
            </label>
          </div>
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "Création en cours..." : "Créer le channel" }}
        </button>
      </form>
    </div>

    <div class="channels-list">
      <h2>Channels existants</h2>

      <div v-if="loading && !channels.length" class="loading">
        <div class="discord-loader"></div>
        Chargement des channels...
      </div>

      <div v-else-if="!channels.length" class="no-channels">
        <svg width="184" height="141" viewBox="0 0 184 141" class="empty-icon">
          <g>
            <rect
              x="40"
              y="30"
              width="30"
              height="10"
              rx="3"
              fill="currentColor"
              opacity="0.4"
            ></rect>
            <rect
              x="40"
              y="50"
              width="60"
              height="10"
              rx="3"
              fill="currentColor"
              opacity="0.4"
            ></rect>
            <rect
              x="40"
              y="70"
              width="75"
              height="10"
              rx="3"
              fill="currentColor"
              opacity="0.4"
            ></rect>
            <rect
              x="40"
              y="90"
              width="50"
              height="10"
              rx="3"
              fill="currentColor"
              opacity="0.4"
            ></rect>
          </g>
        </svg>
        <p>Aucun channel disponible. Créez-en un nouveau !</p>
      </div>

      <ul v-else>
        <li v-for="channel in channels" :key="channel.id" class="channel-item">
          <div class="channel-header">
            <div class="channel-image">
              <img :src="channel.imageUrl || '/Konekt.png'" alt="Channel image" />
            </div>
            <h3>
              <span class="channel-hash">#</span>
              {{ channel.name }}
            </h3>
            <div class="channel-actions">
              <button
                @click="openEditModal(channel)"
                class="edit-button"
                :disabled="editingChannel"
              >
                <span class="edit-icon">✎</span>
              </button>
              <button
                @click="handleDeleteChannel(channel.id)"
                class="delete-button"
                :disabled="deletingChannel"
              >
                <span class="delete-icon">×</span>
              </button>
            </div>
          </div>
          <div class="channel-content">
            <p class="channel-description">
              {{ channel.description || "Aucune description" }}
            </p>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Modifier le channel</h3>
          <button @click="closeEditModal" class="close-button">&times;</button>
        </div>

        <div v-if="error" class="error-message">
          <p>{{ error }}</p>
          <p v-if="errorDetails" class="error-details">{{ errorDetails }}</p>
        </div>

        <form @submit.prevent="handleUpdateChannel" class="edit-form">
          <div class="form-group">
            <label for="editChannelName">Nom du channel *</label>
            <div class="input-with-icon">
              <span class="hashtag">#</span>
              <input
                id="editChannelName"
                v-model="editChannelName"
                type="text"
                required
                placeholder="nom-du-channel"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="editChannelDescription">Description</label>
            <textarea
              id="editChannelDescription"
              v-model="editChannelDescription"
              placeholder="Ajouter une description..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="editChannelImage">Image du channel</label>
            <div class="image-upload-container">
              <div v-if="editChannelImagePreview" class="image-preview">
                <img :src="editChannelImagePreview" alt="Prévisualisation" />
                <button type="button" @click="removeImage" class="remove-image-button">
                  <span class="delete-icon">×</span> Supprimer l'image
                </button>
              </div>
              <input
                id="editChannelImage"
                type="file"
                accept="image/*"
                @change="handleImageChange"
                class="image-input"
              />
              <label for="editChannelImage" class="image-input-label">
                {{ editChannelImagePreview ? "Changer l'image" : "Modifier l'image" }}
              </label>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" @click="closeEditModal" class="cancel-button">
              Annuler
            </button>
            <button type="submit" :disabled="editingChannel" class="save-button">
              {{ editingChannel ? "Enregistrement..." : "Enregistrer" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
