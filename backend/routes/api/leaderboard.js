// File: backend/routes/leaderboard.js

// File: backend/routes/api/leaderboard.js

const express = require("express");
const router = express.Router();
const { getLeaderboard } = require("../../controllers/leaderboardController");

// @route   GET /api/leaderboard
// @desc    Get all leaderboard entries (optional usage)
// @access  Public
router.get("/", getLeaderboard);

// @route   GET /api/leaderboard/:gameMode
// @desc    Get leaderboard for a specific game mode
// @access  Public
router.get("/:gameMode", getLeaderboard);

// @route   POST /api/leaderboard
// @desc    Add new score
// @access  Public (can restrict later if needed)
router.post("/", async (req, res) => {
  try {
    const { playerName, score, gameMode } = req.body;

    if (!playerName || !score || !gameMode) {
      return res.status(400).json({ msg: "Please provide all fields" });
    }

    const validGameModes = [
      "Single-Player",
      "Multiplayer",
      "AI-vs-Human",
      "Real-World-Crisis",
      "Policy-Governance",
      "Crisis-Olympics",
    ];

    if (!validGameModes.includes(gameMode)) {
      return res.status(400).json({ msg: "Invalid game mode" });
    }

    const newEntry = new Leaderboard({ playerName, score, gameMode });
    await newEntry.save();

    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

//C:\Users\Rushabh\Desktop\SR TEST\backend\routes\api\leaderboard.js