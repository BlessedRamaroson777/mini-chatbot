<template>
  <div class="app-container">
    <Sidebar
      :conversations="conversations"
      :activeConversation="activeConversation"
      @select="selectConversation"
      @new="newConversation"
      @delete="deleteConversation"
      @deleteAll="deleteAllConversations"
    />

    <ChatContainer
      :messages="messages"
      :isTyping="isTyping"
      v-model:userInput="userInput"
      @send="sendMessage"
    />
  </div>
</template>

<script>
import axios from "axios";
import Sidebar from "./components/Sidebar.vue";
import ChatContainer from "./components/ChatContainer.vue";

export default {
  components: { Sidebar, ChatContainer },
  data() {
    return {
      conversations: [],
      activeConversation: null,
      messages: [],
      userInput: "",
      isTyping: false
    };
  },
  async mounted() {
    await this.loadConversations();
  },
  methods: {
    async loadConversations() {
      const res = await axios.get("http://localhost:3000/conversations");
      this.conversations = res.data;
      if (!this.activeConversation && this.conversations.length > 0) {
        this.selectConversation(this.conversations[0].id);
      }
    },
    async selectConversation(id) {
      this.activeConversation = id;
      const res = await axios.get(`http://localhost:3000/conversations/${id}`);
      this.messages = res.data;
    },
    async newConversation() {
      const res = await axios.post("http://localhost:3000/conversations");
      this.activeConversation = res.data.id;
      this.messages = [];
      await this.loadConversations();
    },
    async sendMessage(msg) {
      if (!msg.trim() || !this.activeConversation) return;

      this.messages.push({ role: "user", text: msg });
      this.userInput = "";
      this.isTyping = true;

      try {
        const res = await axios.post(
          `http://localhost:3000/chat/${this.activeConversation}`,
          { message: msg }
        );
        this.messages.push({ role: "model", text: res.data.reply });
      } catch {
        this.messages.push({
          role: "model",
          text: "Erreur: impossible de contacter le serveur."
        });
      } finally {
        this.isTyping = false;
      }
    },
    async deleteConversation(id) {
      await axios.delete(`http://localhost:3000/conversations/${id}`);
      await this.loadConversations();
    },
    async deleteAllConversations() {
      for (const conv of this.conversations) {
        await axios.delete(`http://localhost:3000/conversations/${conv.id}`);
      }
      await this.loadConversations();
      this.activeConversation = null;
      this.messages = [];
    }
  }
};
</script>

<style src="./assets/styles.css"></style>
