const express = require('express');
const router = express.Router();
const { generateGeminiResponse } = require('../services/gemini');

// POST /chat/:id
router.post('/:id', async (req, res) => {
  const conversationId = req.params.id;
  const userMessage = req.body.message;

  if (!userMessage) return res.status(400).json({ error: 'Aucun message fourni' });

  try {
    const botResponse = await generateGeminiResponse(conversationId, userMessage);
    res.json({ reply: botResponse });
  } catch (err) {
    console.error('Erreur Gemini:', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
