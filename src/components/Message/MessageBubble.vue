<template>
  <div :class="['message-bubble', author === 'Moi' ? 'my-message' : 'other-message']">
    <div class="message-content">
      <template v-if="content.type === 'Text'">
        {{ content.value }}
      </template>
      <template v-else-if="content.type === 'Image'">
        <img :src="content.value" alt="image message" class="message-image" />
      </template>
      <template v-else>
        <em>Type de message non supporté: {{ content.type }}</em>
      </template>
    </div>
    <div class="message-info">
      <span class="message-author">{{ author }}</span>
      <span class="message-time">{{ formatTime(timestamp) }}</span>
    </div>
  </div>
</template>

<script setup>

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  author: {
    type: String,
    required: true
  },
  content: {
    type: Object,
    required: true,
    validator: (value) => {
      return value &&
             typeof value.type === 'string' &&
             typeof value.value === 'string' &&
             ['Text', 'Image'].includes(value.type)
    }
  },
  timestamp: {
    type: Number,
    required: true
  }
})

function formatTime(timestamp) {
  const date = new Date(timestamp * 1000) // Convertir le timestamp Unix en millisecondes
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.message-bubble {
  max-width: 70%;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
}

.my-message {
  align-self: flex-end;
}

.other-message {
  align-self: flex-start;
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 1rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.my-message .message-content {
  background-color: #dcf8c6;
  border-top-right-radius: 0;
}

.other-message .message-content {
  background-color: white;
  border-top-left-radius: 0;
}

.message-image {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 4px;
}

.message-info {
  display: flex;
  gap: 8px;
  font-size: 0.75rem;
  color: #666;
  margin-top: 4px;
  padding: 0 4px;
}

.my-message .message-info {
  justify-content: flex-end;
}

.message-author {
  font-weight: 500;
}

.message-time {
  opacity: 0.8;
}
</style>
