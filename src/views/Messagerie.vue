<template>
  <div class="messagerie">
    <div v-if="messageStore.error" class="error-message">
      {{ messageStore.error }}
    </div>
    <div v-else-if="messageStore.loading" class="loading">
      Chargement...
    </div>
    <div v-else class="conversation-container">
      <div class="connection-status" :class="{ connected: messageStore.isConnected }">
        {{ messageStore.isConnected ? 'Connecté' : 'Déconnecté' }}
      </div>
      <div class="messages">
        <MessageBubble
          v-for="(msg, index) in messageStore.messages"
          :key="index"
          :author="msg.author"
          :content="msg.content"
        />
      </div>
      <MessageForm @send-message="addMessage" :disabled="messageStore.loading || !messageStore.isConnected" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useMessageStore } from '../store/messagerie.js'
import MessageForm from '../components/Message/MessageForm.vue'
import MessageBubble from '../components/Message/MessageBubble.vue'

const messageStore = useMessageStore()

// Au montage du composant, on récupère les messages du canal 1
onMounted(() => {
  messageStore.fetchMessages(1)
})

// Nettoyer la connexion WebSocket lors du démontage
onUnmounted(() => {
  messageStore.cleanup()
})

async function addMessage(content) {
  try {
    await messageStore.addMessage(content)
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error)
  }
}
</script>

<style scoped>
.messagerie {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

.conversation-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.connection-status {
  padding: 8px;
  text-align: center;
  background-color: #ff4444;
  color: white;
  font-size: 0.9rem;
}

.connection-status.connected {
  background-color: #42b983;
}

.messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.messages::-webkit-scrollbar {
  display: none;
}

.error-message {
  color: #ff4444;
  padding: 20px;
  text-align: center;
  background-color: #ffeeee;
  width: 100%;
}

.loading {
  padding: 20px;
  text-align: center;
  width: 100%;
}
</style>
