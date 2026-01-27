const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const { chat } = require('./agent/chatbot');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection (Optional but requested by user)
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
}

// Basic health check
app.get('/', (req, res) => {
    res.json({ message: 'Fly Your Tech API is running' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        const response = await chat(messages);
        res.json(response);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat message', details: error.message });
    }
});

// Endpoint to fetch leads (for the Lead Management Tool visualization if needed)
app.get('/api/leads', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(__dirname, 'data/leads.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
