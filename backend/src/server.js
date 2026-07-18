require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const settingsRouter = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stageway';

app.use(cors());
app.use(express.json());

app.use('/api/settings', settingsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = app;
