<template>
  <form @submit.prevent="handleSubmit" class="message-form">
    <input
      v-model="message"
      type="text"
      placeholder="Tapez votre message..."
      class="message-input"
      :disabled="disabled"
    />
    <button
      type="submit"
      class="send-button"
      :disabled="!isValid || disabled"
    >
      {{ disabled ? 'Envoi...' : 'Envoyer' }}
    </button>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const message = ref('')
const emit = defineEmits(['send-message'])

const isValid = computed(() => {
  return message.value.trim().length > 0
})

function handleSubmit() {
  if (isValid.value) {
    emit('send-message', message.value)
    message.value = ''
  }
}
</script>

<style scoped>
.message-form {
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: #f0f2f5;
  border-top: 1px solid #e0e0e0;
}

.message-input {
  flex: 1;
  padding: 12px;
  border-radius: 24px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
  background-color: white;
}

.message-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.send-button {
  padding: 12px 24px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.send-button:hover:not(:disabled) {
  background-color: #369c6d;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
