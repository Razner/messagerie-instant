import axios from 'axios'

// Création d'une instance axios avec une configuration de base
const axiosInstance = axios.create({
  baseURL: 'https://edu.tardigrade.land/msg/protected',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token d'authentification à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs globalement
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erreur avec réponse du serveur
      switch (error.response.status) {
        case 401:
          // Gérer l'erreur d'authentification
          console.error('Non authentifié')
          break
        case 403:
          // Gérer l'erreur d'autorisation
          console.error('Non autorisé')
          break
        default:
          console.error('Erreur serveur:', error.response.data)
      }
    } else if (error.request) {
      // La requête a été faite mais pas de réponse reçue
      console.error('Pas de réponse du serveur')
    } else {
      // Erreur lors de la configuration de la requête
      console.error('Erreur de configuration:', error.message)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
