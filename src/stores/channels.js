import axios from 'axios';

const instance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function createChannel(channelData) {
  try {
    const response = await instance.post('/protected/channel', channelData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du channel:', error);
    if (error.response) {
      console.error('Données de l\'erreur:', error.response.data);
      console.error('Statut:', error.response.status);
    } else if (error.request) {
      console.error('Aucune réponse du serveur');
    }
    throw error;
  }
}

export async function getChannels() {
  try {
    const response = await instance.get('/protected/channels');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des channels:', error);
    if (error.response) {
      console.error('Données de l\'erreur:', error.response.data);
    }
    return [];
  }
}

export async function getChannelById(channelId) {
  try {
    const response = await instance.get(`/protected/channel/${channelId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du channel ${channelId}:`, error);
    throw error;
  }
}

export async function deleteChannel(channelId) {
  const id = parseInt(channelId, 10);
  const url = `/protected/channel/${id}`;

  console.log(`Tentative de suppression du channel ID: ${id}`);
  console.log(`URL de la requête DELETE: ${url}`);

  try {
    const response = await instance.delete(url);
    console.log('Réponse de la suppression:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du channel ${id}:`, error);
    if (error.response) {
      console.error('Données de l\'erreur:', error.response.data);
      console.error('Statut:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Aucune réponse du serveur', error.request);
    } else {
      console.error('Erreur lors de la configuration de la requête:', error.message);
    }
    throw error;
  }
}

export async function updateChannelMetadata(channelId, metadata) {
  const id = parseInt(channelId, 10);
  const url = `/protected/channel/${id}/update_metadata`;

  console.log(`Tentative de mise à jour du channel ID: ${id}`);
  console.log(`URL de la requête PUT: ${url}`, metadata);

  if (metadata.image instanceof File) {
    const formData = new FormData();
    formData.append('image', metadata.image);

    if (metadata.name) {
      formData.append('name', metadata.name);
    }

    if (metadata.description !== undefined) {
      formData.append('description', metadata.description);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      const response = await instance.put(url, formData, config);
      console.log('Réponse de la mise à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du channel ${id}:`, error);
      handleError(error);
      throw error;
    }
  } else {
    try {
      const data = {
        name: metadata.name
      };

      if (metadata.description !== undefined) {
        data.description = metadata.description;
      }

      if (metadata.image === null) {
        data.image = null;
      } else if (metadata.image !== undefined) {
        data.image = true;
      }

      console.log('Données envoyées pour mise à jour:', data);

      const response = await instance.put(url, data);
      console.log('Réponse de la mise à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du channel ${id}:`, error);
      handleError(error);
      throw error;
    }
  }
}

function handleError(error) {
  if (error.response) {
    console.error('Données de l\'erreur:', error.response.data);
    console.error('Statut:', error.response.status);
    console.error('Headers:', error.response.headers);
  } else if (error.request) {
    console.error('Aucune réponse du serveur', error.request);
  } else {
    console.error('Erreur lors de la configuration de la requête:', error.message);
  }
}
