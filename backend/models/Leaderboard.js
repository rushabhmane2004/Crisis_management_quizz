// File: backend/models/leaderboard.js
const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  score: { type: Number, required: true },
  gameMode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
//C:\Users\Rushabh\Desktop\SR TEST\backend\models\Leaderboard.js