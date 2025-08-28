// controllers/gameController.js

const GameSession = require('../models/GameSession');
const Scenario = require('../models/CrisisScenario');
const aiService = require('../services/aiService');
const User = require('../models/user');
const Leaderboard = require('../models/leaderboard'); // ✅ import leaderboard model


// 🔧 Step 1 — Add Normalizer
function normalizeGameType(mode) {
  if (!mode) return 'single-player'; // fallback default

  const map = {
    'Crisis Olympics': 'crisis-olympics',
    'crisis-olympics': 'crisis-olympics',

    'Real-World Simulation': 'real-world-crisis',
    'real-world-crisis': 'real-world-crisis',

    'Single-Player Strategy': 'single-player',
    'single-player': 'single-player',

    'Multiplayer': 'multiplayer',
    'multiplayer': 'multiplayer',

    'AI-vs-Human': 'ai-vs-human',
    'ai-vs-human': 'ai-vs-human',

    'Policy-Governance': 'policy-governance',
    'policy-governance': 'policy-governance',
  };

  return map[mode] || 'single-player'; // fallback
}
// @desc    Start a new game
// @route   POST /api/games/start
// @access  Private
exports.startGame = async (req, res) => {
  try {
    const { scenarioId } = req.body;
    const scenario = await Scenario.findById(scenarioId);

    if (!scenario) {
      return res.status(404).json({ message: 'Scenario not found' });
    }

    // ✅ Pass the scenario's mode to the AI service
    const questions = await aiService.generateSituationalQuestions(scenario.context, scenario.mode);

    // ✅ NEW VALIDATION LOGIC
    const isValid = Array.isArray(questions) && 
                      questions.length > 0 && 
                      questions.every(q => 
                        q && 
                        typeof q.questionText === 'string' && 
                        q.questionText.length > 0 &&
                        Array.isArray(q.options) && 
                        q.options.length === 4 &&
                        q.options.every(opt => opt && typeof opt.text === 'string' && typeof opt.score === 'number')
                      );

    if (!isValid) {
      console.error("AI returned invalid data structure. Aborting game start.");
      return res.status(500).json({ message: 'The AI failed to generate a valid game. Please try starting a new game.' });
    }
    // ✅ END OF VALIDATION LOGIC

    const formattedQuestions = questions.map(q => ({
      questionText: q.questionText,
      options: q.options.map(opt => ({
        text: opt.text,
        score: Number(opt.score),
      })),
      playerAnswers: [],
    }));

    const userId = req.user.id.toString();
    const scoresObj = { [userId]: 0 };

    const newGameSession = new GameSession({
  scenario,
  questions: formattedQuestions,
  players: [req.user.id],
  scores: scoresObj,
  gameType: normalizeGameType(scenario.mode)  // ✅ normalized
});


    await newGameSession.save();
    return res.json(newGameSession);
    
  } catch (error) {
    console.error('Error starting game:', error);
    return res.status(500).json({ message: 'A critical error occurred while starting the game.' });
  }
};

// @desc    Submit a decision
// @route   POST /api/games/:gameId/decision
// @access  Private
exports.submitDecision = async (req, res) => {
  try {
    const { questionIndex, answerIndex } = req.body;
    const userId = req.user.id.toString();
    const { gameId } = req.params;
    // ✅ ADD THIS LOG
    console.log(`[BACKEND DEBUG] Updating score for user ID key: "${userId}"`);

    const gameSession = await GameSession.findById(gameId);
    if (!gameSession) {
      return res.status(404).json({ message: 'Game session not found' });
    }

    const question = gameSession.questions[questionIndex];
    if (!question) return res.status(400).json({ message: 'Invalid question index' });

    const answer = question.options[answerIndex];
    if (!answer) return res.status(400).json({ message: 'Invalid answer index' });

    const alreadyAnswered = question.playerAnswers.some(pa => pa.player.toString() === userId);

    if (!alreadyAnswered) {
      question.playerAnswers.push({ player: userId, answerIndex });

      // --- START OF SIMPLIFIED LOGIC ---
      const answerScore = Number(answer.score || 0);
      // ✅ Read from the score Object using standard bracket notation
      const previousScore = gameSession.scores[userId] || 0;
      const newTotalScore = previousScore + answerScore;

      // ✅ Update the score Object using standard bracket notation
      gameSession.scores[userId] = newTotalScore;
      
      // Mongoose MUST be told that a "Mixed" type has changed.
      gameSession.markModified('scores');
      gameSession.markModified('questions');
      // --- END OF SIMPLIFIED LOGIC ---

      await gameSession.save();

      // Update user stats
      const player = await User.findById(userId);
      if (player) {
        player.stats.totalScore = (player.stats.totalScore || 0) + answerScore;
        await player.save();

        // --- ACCURATE LEADERBOARD UPDATE LOGIC ---
        let leaderboardGameMode = null;
        let scenarioDoc = gameSession.scenario;

        // If scenario is not populated, populate it
        if (!scenarioDoc.mode) {
          scenarioDoc = await Scenario.findById(gameSession.scenario);
        }

        if (scenarioDoc && scenarioDoc.mode) {
          leaderboardGameMode = scenarioDoc.mode;
        } else {
          const gameTypeToLeaderboardMode = {
  'single-player': 'Single-Player',
  'multiplayer': 'Multiplayer',
  'ai-vs-human': 'AI-vs-Human',
  'real-world-crisis': 'Real-World-Crisis',
  'policy-governance': 'Policy-Governance',
  'crisis-olympics': 'Crisis-Olympics',
};
leaderboardGameMode = gameTypeToLeaderboardMode[gameSession.gameType] || null;

        }

        // Only update leaderboard if we have a valid mode string
        if (leaderboardGameMode) {
          await Leaderboard.findOneAndUpdate(
            { playerName: player.name, gameMode: leaderboardGameMode },
            {
              $set: { playerName: player.name, gameMode: leaderboardGameMode },
              $inc: { score: answerScore },
            },
            { upsert: true, new: true }
          );
        } else {
          console.warn(`[LEADERBOARD] Not updating: No valid game mode found for session ${gameSession._id}`);
        }
        // --- END LEADERBOARD UPDATE LOGIC ---
      }

      // Now we can just return the updated session. No special conversion needed.
      return res.json(gameSession);
    }

    return res.json(gameSession);

  } catch (error) {
    console.error('[BACKEND LOG] CRITICAL ERROR in submitDecision:', error);
    return res.status(500).json({ message: 'Error submitting decision' });
  }
};

// @desc    Get game details
// @route   GET /api/games/:id
// @access  Private
exports.getGameDetails = async (req, res) => {
  try {
    // Using .lean() for performance and to get a plain JS object
    const gameSession = await GameSession.findById(req.params.id).lean();

    if (!gameSession) {
      return res.status(404).json({ message: 'Game session not found' });
    }

    // ✅ CORRECTED: Convert Mongoose Map to a plain object for JSON serialization
    if (gameSession.scores instanceof Map) {
      gameSession.scores = Object.fromEntries(gameSession.scores);
    }

    return res.json(gameSession);
  } catch (error) {
    console.error('Error fetching game details:', error);
    return res.status(500).json({ message: 'Error fetching game details' });
  }
};


// @desc    End the game session
// @route   POST /api/games/:id/end
// @access  Private
exports.endGame = async (req, res) => {
  try {
    const { id } = req.params;
    const gameSession = await GameSession.findById(id);

    if (!gameSession) {
      return res.status(404).json({ message: 'Game session not found' });
    }

    gameSession.endedAt = new Date();
    await gameSession.save();
    return res.json({ message: 'Game ended', gameSession });
  } catch (error) {
    console.error('Error ending game:', error);
    return res.status(500).json({ message: 'Error ending game' });
  }
};

/**
 * @desc    Evaluate a user's policy text and update the score
 * @route   POST /api/games/evaluate-policy/:gameId
 * @access  Private
 */
exports.evaluatePolicy = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { policyText } = req.body;
    const userId = req.user.id.toString();

    if (!policyText || policyText.trim().length < 50) {
      return res.status(400).json({ message: 'Policy text must be at least 50 characters long.' });
    }

    const gameSession = await GameSession.findById(gameId).populate('scenario');
    if (!gameSession) {
      return res.status(404).json({ message: 'Game session not found.' });
    }

    // Call the AI service to get the evaluation
    const evaluation = await aiService.evaluatePolicyText(policyText, gameSession.scenario.context);

    // Validate the AI response
    if (!evaluation || typeof evaluation.totalScore !== 'number') {
        return res.status(500).json({ message: 'AI evaluation failed to return a valid score.' });
    }
    
    // Update the game session score for the user
    gameSession.scores[userId] = evaluation.totalScore;
    gameSession.markModified('scores'); // Important for Mixed types

    await gameSession.save();

    res.json({ message: 'Policy evaluated successfully', gameSession });

  } catch (error) {
    console.error('Error in evaluatePolicy:', error);
    res.status(500).json({ message: 'Server error during policy evaluation.' });
  }
};
