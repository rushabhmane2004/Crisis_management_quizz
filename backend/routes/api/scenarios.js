const express = require('express');
const router = express.Router();
const scenarioController = require('../../controllers/scenarioController');

// @route   POST api/scenarios
// @desc    Create a crisis scenario
// @access  Public (for now, can be made private)
router.post('/', scenarioController.createScenario);

// @route   GET api/scenarios
// @desc    Get all scenarios
// @access  Public
router.get('/', scenarioController.getAllScenarios);

module.exports = router;

// C:\Users\Rushabh\Desktop\SR TEST\backend\routes\api\scenarios.js