<template>
  <div class="sidebar">
    <div class="sidebar-top">
      <button @click="$emit('new')" class="btn new-btn">+ Nouvelle</button>
      <button v-if="conversations.length" @click="$emit('deleteAll')" class="btn clear-btn">
        Tout effacer
      </button>
    </div>

    <div class="conversations-list">
      <div
        v-for="conv in conversations"
        :key="conv.id"
        :class="['conversation-item', { active: conv.id === activeConversation }]"
        @click="$emit('select', conv.id)"
      >
        <span>{{ conv.title }}</span>
        <span @click.stop="$emit('delete', conv.id)" class="delete-btn">×</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["conversations", "activeConversation"]
};
</script>
