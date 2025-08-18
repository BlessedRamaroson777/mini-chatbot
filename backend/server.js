const express = require('express');
const cors = require('cors');

const conversationsRoutes = require('./routes/conversations');
const chatRoutes = require('./routes/chat');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/conversations', conversationsRoutes);
app.use('/chat', chatRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
