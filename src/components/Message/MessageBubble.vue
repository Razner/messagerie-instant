<template>
  <div :class="['message-bubble', author === 'Moi' ? 'my-message' : 'other-message']">
    <div class="message-content">
      {{ content }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  author: String,
  content: String
})
</script>

<style scoped>
.message-bubble {
  color: black;
  background-color: #D9D9D9;
  padding: 10px;
  border-radius: 20px;
  margin-bottom: 12px;
  font-size: 1rem;
  max-width: 70%;
}

.my-message {
  align-self: flex-end;
  background-color: #D9D9D9;
  color: black;
}

.other-message {
  align-self: flex-start;
}
</style>
