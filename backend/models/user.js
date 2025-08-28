const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  stats: {
    gamesPlayed: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    scenariosCompleted: { type: Number, default: 0 }
  }
});

// Prevent OverwriteModelError in watch mode
module.exports = mongoose.models.user || mongoose.model('user', UserSchema);
//C:\Users\Rushabh\Desktop\SR TEST\backend\models\user.js