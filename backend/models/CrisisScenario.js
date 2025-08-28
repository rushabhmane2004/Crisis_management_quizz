const mongoose = require('mongoose');

const CrisisScenarioSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  mode: { 
    type: String, 
    required: true,
    enum: [
      'Single-Player Strategy', 
      'Multiplayer Challenge', 
      'AI vs. Human Battle', 
      'Real-World Simulation', 
      'Policy & Governance', 
      'Crisis Olympics'
    ]
  },
  context: { type: String, required: true }
});

module.exports = mongoose.models.crisisScenario || mongoose.model('crisisScenario', CrisisScenarioSchema);
