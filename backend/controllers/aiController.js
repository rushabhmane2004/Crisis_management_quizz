const aiService = require('../services/aiService');
const CrisisScenario = require('../models/CrisisScenario');

exports.generateQuestionForScenario = async (req, res) => {
    const { scenarioId } = req.body;
    try {
        const scenario = await CrisisScenario.findById(scenarioId);
        if (!scenario) {
            return res.status(404).json({ msg: 'Scenario not found' });
        }
        const questionData = await aiService.generateSituationalQuestion(scenario.context);
        res.json(questionData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


/**
 * @desc    Evaluate a user's policy text and update the score
 * @route   POST /api/ai/evaluate-policy/:gameId
 * @access  Private
 */
exports.evaluatePolicy = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { policyText } = req.body;
    const userId = req.user.id.toString();

    if (!policyText || policyText.trim().length < 50) {
      return res.status(400).json({ msg: 'Policy text must be at least 50 characters long.' });
    }

    const gameSession = await GameSession.findById(gameId).populate('scenario');
    if (!gameSession) {
      return res.status(404).json({ msg: 'Game session not found.' });
    }

    // ✅ ADDED: Specific check to ensure the scenario was populated correctly.
    // This was the most likely source of the previous "Server error".
    if (!gameSession.scenario) {
        return res.status(404).json({ msg: 'Scenario data for this game session could not be found.' });
    }

    // Call the AI service to get the evaluation
    const evaluation = await aiService.evaluatePolicyText(policyText, gameSession.scenario.context);

    if (!evaluation || typeof evaluation.totalScore !== 'number') {
      return res.status(500).json({ msg: 'AI evaluation failed to return a valid score.' });
    }
    
    // Update the game session score for the user
    gameSession.scores[userId] = evaluation.totalScore;
    gameSession.markModified('scores'); // Important for Mongoose Mixed types

    await gameSession.save();

    res.json(gameSession);

  } catch (error) {
    console.error('Error in evaluatePolicy:', error);
    // ✅ IMPROVED: Always send a JSON object for errors.
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};
//C:\Users\Rushabh\Desktop\SR TEST\backend\controllers\aiController.js