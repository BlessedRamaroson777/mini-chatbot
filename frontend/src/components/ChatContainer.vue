<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
        <div class="message-content" v-html="formatMessage(msg.text)"></div>
      </div>
      <div v-if="isTyping" class="message typing">
        <div class="message-content">Gemini est en train d'écrire...</div>
      </div>
    </div>

    <div class="input-container">
      <input v-model="localInput" @keyup.enter="send" placeholder="Écrivez votre message..." />
      <button @click="send" class="btn send-btn">Envoyer</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["messages", "isTyping", "userInput"],
  emits: ["send", "update:userInput"],
  data() {
    return { localInput: this.userInput };
  },
  watch: {
    userInput(newVal) {
      this.localInput = newVal;
    }
  },
  methods: {
    send() {
      if (this.localInput.trim()) {
        this.$emit("send", this.localInput);
        this.$emit("update:userInput", "");
        this.localInput = "";
      }
    },
    formatMessage(text) {
      const codeRegex = /```(\w*)\n([\s\S]*?)```/g;
      return text
        .replace(codeRegex, (_, __, code) => `<pre class="code"><code>${code}</code></pre>`)
        .replace(/\n/g, "<br>");
    }
  }
};
</script>
