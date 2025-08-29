// File: src/pages/AIvsHumanPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGameDetails, submitDecision, reset } from '../features/game/gameslice';
import Spinner from '../components/Spinner';
import { FaUser, FaRobot } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode";

function AIvsHumanPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { gameSession, isLoading } = useSelector((state) => state.game);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  useEffect(() => {
    if (!user) navigate('/login');
    dispatch(getGameDetails(gameId));
    return () => dispatch(reset());
  }, [user, navigate, dispatch, gameId]);

  const handleAnswerClick = async (answerIndex) => {
    // ✅ FIX: Find the AI's best option by looking for the highest score number.
    const bestOption = gameSession.questions[currentQuestionIndex].options.reduce(
      (max, opt) => (opt.score > max.score ? opt : max)
    );
    
    // ✅ FIX: Add the AI's best score (a number) to the AI's total.
    setAiScore(prev => prev + bestOption.score);

    const decisionData = { gameId, questionIndex: currentQuestionIndex, answerIndex };
    await dispatch(submitDecision(decisionData));

    if (currentQuestionIndex < gameSession.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setTimeout(() => navigate(`/assessment/${gameId}`), 100);
    }
  };

  if (isLoading || !gameSession || !user || !gameSession.questions) {
    return <Spinner />;
  }

  const currentQuestion = gameSession.questions[currentQuestionIndex];

  // ✅ FIX: Get the human player's score directly from the scores object.
  let userId = '';
  if (user && user.token) {
    try {
        const decoded = jwtDecode(user.token);
        userId = decoded.user?.id || decoded.user?._id || '';
    } catch (e) { console.error("Invalid token"); }
  }
  const playerTotalScore = gameSession.scores[userId] || 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-yellow-300 font-orbitron">AI vs Human Battle</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Human Player Panel */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-2xl border-2 border-cyan-400">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-cyan-300 flex items-center"><FaUser className="mr-2" /> Your Progress</h2>
            <div className="text-lg font-semibold bg-slate-700 text-cyan-300 px-4 py-2 rounded-lg">Score: {playerTotalScore}</div>
          </div>
          <div className="mb-6">
            <p className="text-slate-400 mb-2">Question {currentQuestionIndex + 1} of {gameSession.questions.length}</p>
            <h3 className="text-xl font-semibold text-white min-h-[60px]">{currentQuestion.questionText}</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, index) => (
              <button key={index} onClick={() => handleAnswerClick(index)} className="w-full bg-slate-700 border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-slate-900 font-semibold p-3 rounded-lg transition-colors text-left">
                {option.text}
              </button>
            ))}
          </div>
        </div>
        {/* AI Player Panel */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-2xl border-2 border-red-400">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-red-300 flex items-center"><FaRobot className="mr-2" /> AI Progress</h2>
            <div className="text-lg font-semibold bg-slate-700 text-red-300 px-4 py-2 rounded-lg">Score: {aiScore}</div>
          </div>
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <p className="text-lg">AI is analyzing the situation...</p>
            <p>It will make its decision after you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIvsHumanPage;