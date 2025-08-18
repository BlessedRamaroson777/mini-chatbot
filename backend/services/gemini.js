const fs = require('fs');
const path = require('path');
const { GoogleAuth } = require('google-auth-library');

// Chemin vers le JSON dans data/
const HISTORY_FILE = path.join(__dirname, '../data/conversations.json');

const auth = new GoogleAuth({
  keyFile: path.join(__dirname, '../service-account.json'),
  scopes: ['https://www.googleapis.com/auth/generative-language'],
});

// Charger ou créer le fichier JSON
let conversations = {};
if (fs.existsSync(HISTORY_FILE)) {
  try {
    conversations = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch {
    conversations = {};
  }
}

function saveConversations() {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(conversations, null, 2));
}

async function generateGeminiResponse(conversationId, message) {
  if (!conversations[conversationId]) conversations[conversationId] = [];
  conversations[conversationId].push({ role: 'user', text: message });
  saveConversations();

  const client = await auth.getClient();
  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  const res = await client.request({
    url,
    method: 'POST',
    data: {
      contents: conversations[conversationId].map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }))
    },
  });

  const reply = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Pas de réponse';
  conversations[conversationId].push({ role: 'model', text: reply });
  saveConversations();

  return reply;
}

module.exports = { conversations, saveConversations, generateGeminiResponse };
