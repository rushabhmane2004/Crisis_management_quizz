const mongoose = require('mongoose');

// The other parts of your schema remain the same
// ...

const gameSessionSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'crisisScenario', required: true },
  gameType: {
  type: String,
  enum: [
    'single-player',
    'multiplayer',
    'ai-vs-human',
    'real-world-crisis',
    'policy-governance',
    'crisis-olympics'
  ],
  required: true
},

  questions: [
    {
      questionText: { type: String, required: true },
      options: [
        {
          text: { type: String, required: true },
          score: { type: Number, required: true }
        }
      ],
      playerAnswers: [
        {
          player: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
          answerIndex: { type: Number, required: true }
        }
      ]
    }
  ],

  // ✅ CORRECTED: Changed from Map to a plain Object using mongoose.Schema.Types.Mixed
  // This is the most reliable way to store a { userId: score } object.
  scores: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }
});

module.exports = mongoose.models.GameSession || mongoose.model('GameSession', gameSessionSchema);

//C:\Users\Rushabh\Desktop\SR TEST\backend\models\GameSession.js