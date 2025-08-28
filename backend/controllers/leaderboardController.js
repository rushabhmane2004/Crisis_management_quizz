const User = require('../models/user');

const Leaderboard = require('../models/Leaderboard');

exports.getLeaderboard = async (req, res) => {
  try {
    const { gameMode } = req.params;
    // Find leaderboard entries for the selected game mode, sorted by score
    const leaderboard = await Leaderboard.find({ gameMode })
      .sort({ score: -1 })
      .limit(10);

    return res.json(leaderboard);
  } catch (err) {
    console.error('[LEADERBOARD ERROR]', err.message);
    res.status(500).send('Server Error');
  }
};
//C:\Users\Rushabh\Desktop\SR TEST\backend\controllers\leaderboardController.js