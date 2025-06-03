import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


export const instance = axios.create({
  baseURL: 'https://edu.tardigrade.land/msg/protected',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

const decodedToken = () => {
  const token = sessionStorage.getItem("token");
  return jwtDecode(token).sub;
}

instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function createChannel(channelData) {
  try {
    const response = await instance.post('/channel', channelData);
    window.location.reload();
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

export async function getChannels(all = false) {
  var sortedChannels = [];
  try {
    const response = await instance.get('/user/channels');
    const user = decodedToken();
    for(const channel of response.data) {
      if (channel.creator == user) {
        sortedChannels.push(channel);
      }
    }
    if (all){
      return response.data;
    }
    return sortedChannels;
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
    const response = await instance.get(`/channel/${channelId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du channel ${channelId}:`, error);
    throw error;
  }
}

export async function deleteChannel(channelId) {
  const id = parseInt(channelId, 10);
  const url = `/channel/${id}`;

  try {
    const response = await instance.delete(url);
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

export async function addUserToChannel(channelId, userId) {
  const url = `/channel/${channelId}/user/${userId}`;

  try {
    const response = await instance.put(url);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de l'ajout de l'utilisateur ${userId} au channel ${channelId}:`, error);
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

export async function banUserFromChannel(channelId, userId) {
  const url = `/channel/${channelId}/user/${userId}`;

  try {
    const response = await instance.delete(url);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors du bannissement de l'utilisateur ${userId} du channel ${channelId}:`, error);
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
  const url = `/channel/${id}/update_metadata`;

  if (metadata.image instanceof File) {
    const formData = new FormData();
    formData.append('image', metadata.image);

    if (metadata.name) {
      formData.append('name', metadata.name);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      const response = await instance.put(url, formData, config);
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

      if (metadata.image === null) {
        data.image = null;
      } else if (metadata.image !== undefined) {
        data.image = true;
      }

      const response = await instance.put(url, data);
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
