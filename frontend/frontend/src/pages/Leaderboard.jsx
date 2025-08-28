// File: src/pages/Leaderboard.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import axios from "axios";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [gameMode, setGameMode] = useState("Single-Player"); // default backend value
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const gameModes = [
    { label: "Single Player", value: "Single-Player" },
    { label: "Multiplayer", value: "Multiplayer" },
    { label: "AI vs Human", value: "AI-vs-Human" },
    { label: "Real-World Crisis", value: "Real-World-Crisis" },
    { label: "Policy & Governance", value: "Policy-Governance" },
    { label: "Crisis Olympics", value: "Crisis-Olympics" },
  ];

  // Fetch leaderboard from backend
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/leaderboard/${gameMode}`
        );
        setPlayers(res.data);
      } catch (err) {
        console.error("[LEADERBOARD FETCH ERROR]", err);
      }
    };
    fetchLeaderboard();
  }, [gameMode]);

  const getRankColor = (index) => {
    if (index === 0) return "border-yellow-400 shadow-yellow-400/50"; // Gold
    if (index === 1) return "border-slate-300 shadow-slate-300/50"; // Silver
    if (index === 2) return "border-orange-400 shadow-orange-400/50"; // Bronze
    return "border-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-800 pt-28 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-white font-orbitron flex items-center justify-center gap-4">
            <Crown className="text-yellow-400" size={40} />
            Leaderboard
          </h1>
          <p className="text-lg text-gray-400 mt-2">
            See who's leading the response efforts.
          </p>
        </motion.div>

        {/* Game Mode Dropdown */}
        <div className="flex justify-center mb-6 relative">
          <div className="relative inline-block text-left w-64">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex justify-between items-center bg-gray-900/60 backdrop-blur-lg border border-gray-600 text-white px-4 py-3 rounded-xl shadow-lg hover:bg-gray-800/60 transition-all duration-300"
            >
              {
                gameModes.find((mode) => mode.value === gameMode)?.label ||
                "Select Mode"
              }
              <span
                className={`ml-2 transform transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ▾
              </span>
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute z-20 mt-2 w-full rounded-xl shadow-xl border border-gray-700 bg-gray-900/80 backdrop-blur-xl overflow-hidden"
              >
                {gameModes.map((mode, i) => (
                  <motion.button
                    key={i}
                    onClick={() => {
                      setGameMode(mode.value);
                      setIsDropdownOpen(false);
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="block w-full text-left px-4 py-3 text-gray-200 hover:bg-gray-700/60 hover:text-white transition-all duration-300"
                  >
                    {mode.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <motion.div
          className="w-full bg-gray-950/50 rounded-2xl shadow-2xl p-6 border border-gray-700 backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="space-y-3">
            {players.length > 0 ? (
              players.map((player, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center p-4 rounded-xl bg-gray-800/60 border-l-4 transition-all duration-300 ${getRankColor(
                    index
                  )}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(55, 65, 81, 0.8)",
                  }}
                >
                  <span className="font-bold text-white text-xl w-12 text-center">
                    #{index + 1}
                  </span>
                  <span className="flex-grow text-left ml-4 font-semibold text-lg text-gray-200">
                    {player.playerName}
                  </span>
                  <span className="font-mono font-bold text-xl text-cyan-400">
                    {player.score.toLocaleString()} pts
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">
                The leaderboard is currently empty for this mode.
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <button
            onClick={() => navigate("/lobby")}
            className="block mx-auto mt-10 py-3 px-8 text-lg font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/50"
          >
            Return to Game Lobby
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
