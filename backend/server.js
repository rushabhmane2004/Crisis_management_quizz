const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

// Load env vars
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/games', require('./routes/api/games'));
app.use('/api/scenarios', require('./routes/api/scenarios'));
app.use('/api/ai', require('./routes/api/ai')); // New AI route
app.use('/api/leaderboard', require('./routes/api/leaderboard')); // New Leaderboard route

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//C:\Users\Rushabh\Desktop\SR TEST\backend\server.js