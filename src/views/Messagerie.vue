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
        <div class="messages" ref="messagesContainer" id="message-list">
          <div v-if="messageStore.loading" class="loading-messages">
            Chargement des messages...
          </div>
          <div v-else-if="messageStore.error" class="error-message">
            {{ messageStore.error }}
          </div>
          <template v-else>
            <div class="load-more-container" v-if="messageStore.messages.length > 0">
              <button
                @click="messageStore.loadMoreMessages"
                :disabled="messageStore.loading"
                class="load-more-button"
              >
                Charger plus de messages
              </button>
            </div>
            <MessageBubble
              v-for="(msg, index) in messageStore.messages"
              :key="index"
              :author="msg.author"
              :timestamp="msg.timestamp"
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
import { ref, onUnmounted, nextTick, onMounted } from 'vue'
import { useMessageStore } from '../stores/messagerie.js'
import MessageForm from '../components/Message/MessageForm.vue'
import MessageBubble from '../components/Message/MessageBubble.vue'
import { getChannels } from '../stores/channels.js'
import { watch } from 'vue'

const messageStore = useMessageStore()
const messagesContainer = ref(null)
const currentChannel = ref(null)
const channels = ref([])

watch(
  () => messageStore.messages.length,
  async () => {
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }
)

// Charger la liste des canaux au montage du composant
onMounted(async () => {
  try {
    const channelsList = await getChannels(true)
    channels.value = channelsList
    // Sélectionner le premier canal si disponible
    if (channels.value.length > 0) {
      selectChannel(channels.value[0].id)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des canaux:', error)
  }
})

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
  display: flex;
  height: 100vh;
  overflow-y: auto;
  padding: 1rem;
  padding-bottom: 2rem;
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

.load-more-container {
  text-align: center;
  padding: 1rem;
}

.load-more-button {
  background-color: #f0f2f5;
  color: #1a1a1a;
  border: 1px solid #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.load-more-button:hover {
  background-color: #e4e6e9;
}

.load-more-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
