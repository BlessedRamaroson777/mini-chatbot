const express = require('express');
const router = express.Router();
const { conversations, saveConversations } = require('../services/gemini');

// GET /conversations
router.get('/', (req, res) => {
  const list = Object.keys(conversations).map(id => ({
    id,
    title: conversations[id][0]?.text?.slice(0, 20) || 'Nouvelle conversation'
  }));
  res.json(list);
});

// GET /conversations/:id
router.get('/:id', (req, res) => {
  res.json(conversations[req.params.id] || []);
});

// POST /conversations (nouvelle conversation)
router.post('/', (req, res) => {
  const id = Date.now().toString();
  conversations[id] = [];
  saveConversations();
  res.json({ id });
});

// DELETE /conversations/:id
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  if (conversations[id]) {
    delete conversations[id];
    saveConversations();
    return res.json({ success: true });
  } else {
    return res.status(404).json({ error: 'Conversation introuvable' });
  }
});

module.exports = router;
