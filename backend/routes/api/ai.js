const express = require('express');
const router = express.Router();
const aiController = require('../../controllers/aiController');
const authMiddleware = require('../../middleware/auth');

// @route   POST api/ai/generate-question
// @desc    Generate a question for a given scenario
// @access  Private
router.post('/generate-question', authMiddleware, aiController.generateQuestionForScenario);
// ✅ ADD THIS NEW ROUTE
// Use 'authMiddleware' here as well to match the import name
router.post('/evaluate-policy/:gameId', authMiddleware, aiController.evaluatePolicy);
module.exports = router;

//ai.js C:\Users\Rushabh\Desktop\SR TEST\backend\routes\api\ai.js