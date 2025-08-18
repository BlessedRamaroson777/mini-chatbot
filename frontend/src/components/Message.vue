<template>
  <div :class="['message', role]">
    <div class="message-content" v-html="formatMessage(text)"></div>
  </div>
</template>

<script>
export default {
  props: ["role", "text"],
  methods: {
    formatMessage(text) {
      const codeRegex = /```(\w*)\n([\s\S]*?)```/g;
      return text
        .replace(codeRegex, (_, __, code) => `<pre class="code"><code>${code}</code></pre>`)
        .replace(/\n/g, "<br>");
    }
  }
};
</script>
