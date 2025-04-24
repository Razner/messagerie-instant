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
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
}

.message-input {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.message-input:disabled {
  background-color: #eee;
  cursor: not-allowed;
}

.send-button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.send-button:hover:not(:disabled) {
  background-color: #369c6d;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
