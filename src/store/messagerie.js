import { defineStore } from 'pinia'
import axios from '../plugins/axios'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [],
    error: null,
    loading: false,
    currentChannel: null,
    socket: null,
    isConnected: false
  }),

  actions: {
    async fetchMessages(channelId, batchOffset = 0) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`/channel/${channelId}/messages/${batchOffset}`)
        this.messages = response.data.sort((a, b) => a.timestamp - b.timestamp)
        this.currentChannel = channelId

        // Initialiser la connexion WebSocket si ce n'est pas déjà fait
        if (!this.socket) {
          this.initWebSocket(channelId)
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la récupération des messages'
        console.error('Erreur lors de la récupération des messages:', error)
      } finally {
        this.loading = false
      }
    },

    initWebSocket(channelId) {
      // Fermer la connexion existante si elle existe
      if (this.socket) {
        this.socket.close()
      }

      // Créer une nouvelle connexion WebSocket
      const wsUrl = `wss://edu.tardigrade.land/msg/protected/channel/${channelId}/ws`
      this.socket = new WebSocket(wsUrl)

      // Ajouter le token d'authentification
      this.socket.onopen = () => {
        this.socket.send(JSON.stringify({
          type: 'auth',
          token: localStorage.getItem('token')
        }))
        this.isConnected = true
      }

      // Gérer les messages entrants
      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          if (message.type === 'new_message') {
            this.messages.push(message.data)
            this.messages.sort((a, b) => a.timestamp - b.timestamp)
          }
        } catch (error) {
          console.error('Erreur lors du traitement du message WebSocket:', error)
        }
      }

      // Gérer les erreurs
      this.socket.onerror = (error) => {
        console.error('Erreur WebSocket:', error)
        this.error = 'Erreur de connexion en temps réel'
      }

      // Gérer la fermeture
      this.socket.onclose = () => {
        this.isConnected = false
        // Tentative de reconnexion après 5 secondes
        setTimeout(() => {
          if (this.currentChannel) {
            this.initWebSocket(this.currentChannel)
          }
        }, 5000)
      }
    },

    async addMessage(content) {
      if (!this.currentChannel) {
        throw new Error('Aucun canal sélectionné')
      }

      this.loading = true
      this.error = null
      try {
        await axios.post(`/channel/${this.currentChannel}/message`, {
          content: {
            type: 'Text',
            value: content
          }
        })
        // Le message sera ajouté via le WebSocket, pas besoin de rafraîchir
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de l\'envoi du message'
        console.error('Erreur lors de l\'envoi du message:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Nettoyer la connexion WebSocket lors de la destruction du store
    cleanup() {
      if (this.socket) {
        this.socket.close()
        this.socket = null
        this.isConnected = false
      }
    }
  }
})
