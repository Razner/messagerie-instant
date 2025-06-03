import { defineStore } from 'pinia'
import axios from '@/plugins/axios'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [],
    error: null,
    loading: false,
    currentChannel: null,
    socket: null,
    isConnected: false,
    batchOffset: 0
  }),

  actions: {
    async fetchMessages(channelId, batchOffset = 0) {
      this.loading = true
      this.error = null
      try {
        console.log('Récupération des messages pour le channel:', channelId)
        console.log('Type de channelId:', typeof channelId)
        console.log('Offset:', batchOffset)

        // Calculer le nombre de messages à récupérer
        const messageCount = 40
        const url = `/channel/${channelId}/messages/0`
        console.log('URL de la requête:', url)

        const response = await axios.get(url)
        console.log('Messages reçus:', response.data)

        if (batchOffset === 0) {
          // Si c'est le premier chargement, on remplace les messages
          this.messages = response.data
        } else {
          // Sinon on ajoute les messages au début (pour le chargement des messages plus anciens)
          this.messages = [...response.data, ...this.messages]
        }

        this.currentChannel = channelId
        this.batchOffset = batchOffset

        // Initialiser la connexion WebSocket si ce n'est pas déjà fait
        if (!this.socket) {
          this.initWebSocket(channelId)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error)
        this.error = error.response?.data || 'Erreur lors de la récupération des messages'
        throw error
      } finally {
        this.loading = false
      }
    },

    initWebSocket(channelId) {
      // Fermer la connexion existante si elle existe
      if (this.socket) {
        this.socket.close()
      }

      const token = sessionStorage.getItem('token')
      // Créer une nouvelle connexion WebSocket avec la bonne URL
      const wsUrl = `https://edu.tardigrade.land/msg/ws/channel/${channelId}/token/${token}`
      this.socket = new WebSocket(wsUrl)

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

      // La connexion est établie
      this.socket.onopen = () => {
        this.isConnected = true
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
          type: 'Text',
          value: content
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

    // Charger plus de messages (40 messages plus anciens)
    async loadMoreMessages() {
      if (this.currentChannel && !this.loading) {
        const nextOffset = this.batchOffset + 40
        await this.fetchMessages(this.currentChannel, nextOffset)
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
