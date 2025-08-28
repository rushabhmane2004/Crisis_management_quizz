// File: src/pages/Dashboard.jsx
// Description: This is the animated main menu page that users will see after logging in.

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const backgroundGradientCSS = `
@keyframes pastelGradient {
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 100%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 0%; }
  100% { background-position: 0% 50%; }
}
.dashboard-animated-bg {
  background: linear-gradient(120deg, #1e3a8a, #0d9488, #374151, #3b82f6, #065f46, #7c3aed, #1e1b4b, #06b6d4);
  background-size: 300% 300%;
  animation: pastelGradient 25s ease-in-out infinite;
}
`;

const navCardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: i => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.2 + i * 0.15, type: "spring", stiffness: 74 }
  }),
  whileHover: {
    scale: 1.04,
    boxShadow: `0 0 0 4px #3b82f645, 0 12px 32px 0 #3b82f6ab`,
    borderColor: '#3b82f6'
  }
};

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden dashboard-animated-bg">
      <style>{backgroundGradientCSS}</style>
      
      {/* 👇 CHANGED: Increased top padding (pt-32) to prevent overlap with the fixed header */}
      <main className="container mx-auto px-6 pt-32 pb-16 flex flex-col items-center text-center">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg font-orbitron"
        >
          MAIN MENU
        </motion.h1>
        
        <motion.p 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg text-gray-300">
          Your next challenge awaits.
        </motion.p>

        <nav className="w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {[
            { to: "/lobby", label: "Start New Game", icon: "🎲", i: 0 },
            { to: "/leaderboard", label: "Leaderboard", icon: "🏆", i: 1 }
          ].map(({ to, label, icon, i }) => (
            <motion.div
              key={to}
              variants={navCardVariants}
              initial="initial"
              animate="animate"
              custom={i}
              whileHover="whileHover"
              className="group cursor-pointer border-[3px] border-transparent shadow-xl transition rounded-2xl bg-slate-800/80 backdrop-blur-md p-8 flex flex-col items-center gap-5 min-h-[180px] select-none"
              style={{ boxShadow: "0 2px 24px 0 rgba(0,0,0,0.2)" }}
              onClick={() => navigate(to)}
            >
              <span className="text-5xl mb-2 block select-none">{icon}</span>
              <span className="text-lg sm:text-xl font-semibold text-white group-hover:text-cyan-300 transition">
                {label}
              </span>
            </motion.div>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Dashboard;

//C:\Users\Rushabh\Desktop\SR TEST\frontend\frontend\src\pages\Dashboard.jsx