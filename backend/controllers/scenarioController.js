const CrisisScenario = require('../models/CrisisScenario');

exports.createScenario = async (req, res) => {
    try {
        const newScenario = new CrisisScenario(req.body);
        const scenario = await newScenario.save();
        res.json(scenario);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllScenarios = async (req, res) => {
  try {
    // ✅ CORRECT: This query now includes all fields, including 'mode'.
    const scenarios = await CrisisScenario.find(); 
    res.json(scenarios);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

//C:\Users\Rushabh\Desktop\SR TEST\backend\controllers\scenarioController.js