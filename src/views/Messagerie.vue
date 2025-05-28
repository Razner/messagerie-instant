<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="messagerie-container">
    <!-- Liste des conversations -->
    <div class="conversations-list">
      <div class="conversations-header">
        <h2>Conversations</h2>
      </div>
      <div class="conversations">
        <div
          v-for="channel in channels"
          :key="channel.id"
          :class="['conversation-item', { active: currentChannel === channel.id }]"
          @click="selectChannel(channel.id)"
        >
          <div class="conversation-avatar">
            {{ channel.name.charAt(0).toUpperCase() }}
          </div>
          <div class="conversation-info">
            <div class="conversation-name">{{ channel.name }}</div>
            <div class="conversation-last-message">{{ channel.lastMessage }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Zone de chat -->
    <div class="chat-container">
      <div v-if="currentChannel" class="chat">
        <!-- En-tête du chat -->
        <div class="chat-header">
          <div class="chat-title">
            {{ getCurrentChannelName() }}
          </div>
          <div class="connection-status" :class="{ connected: messageStore.isConnected }">
            {{ messageStore.isConnected ? 'Connecté' : 'Déconnecté' }}
          </div>
        </div>

        <!-- Messages -->
        <div class="messages" ref="messagesContainer">
          <div v-if="messageStore.loading" class="loading-messages">
            Chargement des messages...
          </div>
          <div v-else-if="messageStore.error" class="error-message">
            {{ messageStore.error }}
          </div>
          <template v-else>
            <MessageBubble
              v-for="(msg, index) in messageStore.messages"
              :key="index"
              :author="msg.author"
              :content="msg.content"
            />
          </template>
        </div>

        <!-- Formulaire d'envoi -->
        <MessageForm
          @send-message="addMessage"
          :disabled="messageStore.loading || !messageStore.isConnected"
        />
      </div>
      <div v-else class="no-chat-selected">
        Sélectionnez une conversation pour commencer
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, nextTick } from 'vue'
import { useMessageStore } from '../store/messagerie.js'
import MessageForm from '../components/Message/MessageForm.vue'
import MessageBubble from '../components/Message/MessageBubble.vue'

const messageStore = useMessageStore()
const messagesContainer = ref(null)
const currentChannel = ref(null)

// Liste des canaux disponibles (à remplacer par un appel API)
const channels = ref([
  { id: 1, name: 'Général', lastMessage: 'Bienvenue dans le canal général' },
  { id: 2, name: 'Support', lastMessage: 'Comment puis-je vous aider ?' },
  { id: 3, name: 'Développement', lastMessage: 'Nouvelle fonctionnalité disponible' }
])

// Sélectionner un canal
function selectChannel(channelId) {
  currentChannel.value = channelId
  messageStore.fetchMessages(channelId)
}

// Obtenir le nom du canal actuel
function getCurrentChannelName() {
  const channel = channels.value.find(c => c.id === currentChannel.value)
  return channel ? channel.name : ''
}

// Ajouter un message
async function addMessage(content) {
  try {
    await messageStore.addMessage(content)
    // Faire défiler vers le bas après l'envoi d'un message
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error)
  }
}

// Nettoyer lors du démontage
onUnmounted(() => {
  messageStore.cleanup()
})
</script>

<style scoped>
.messagerie-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
  overflow: hidden;
}

.conversations-list {
  width: 350px;
  background-color: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.conversations-header {
  padding: 1rem;
  background-color: #f0f2f5;
  border-bottom: 1px solid #e0e0e0;
}

.conversations-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #1a1a1a;
}

.conversations {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f2f5;
}

.conversation-item:hover {
  background-color: #f5f5f5;
}

.conversation-item.active {
  background-color: #e9ebeb;
}

.conversation-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #42b983;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.conversation-last-message {
  color: #666;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
}

.chat {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 1rem;
  background-color: #f0f2f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-title {
  font-size: 1.2rem;
  font-weight: 500;
}

.connection-status {
  font-size: 0.9rem;
  color: #666;
}

.connection-status.connected {
  color: #42b983;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-messages,
.error-message {
  text-align: center;
  padding: 1rem;
  color: #666;
}

.error-message {
  color: #dc3545;
}

.no-chat-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 1.2rem;
}
</style>
