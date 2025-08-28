const express = require('express');
const router = express.Router();
const gameController = require('../../controllers/gameController');
const authMiddleware = require('../../middleware/auth');

// @route   POST api/games/start
// @desc    Start a new game session
// @access  Private
router.post('/start', authMiddleware, gameController.startGame);

// @route   POST api/games/:gameId/decision
// @desc    Submit a decision for a game session
// @access  Private
router.post('/:gameId/decision', authMiddleware, gameController.submitDecision);

// @route   GET api/games/:id
// @desc    Get current game state
// @access  Private
router.get('/:id', authMiddleware, gameController.getGameDetails);

// @route   POST api/games/:id/end
// @desc    End the game session
// @access  Private
router.post('/:id/end', authMiddleware, gameController.endGame);

module.exports = router;
//C:\Users\Rushabh\Desktop\SR TEST\backend\routes\api\games.js