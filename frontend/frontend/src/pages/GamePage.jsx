import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGameDetails, submitDecision, reset } from '../features/game/gameslice';
import Spinner from '../components/Spinner';
import { jwtDecode } from "jwt-decode";

// This is a standard sub-component, it's fine.
const Timeline = ({ total, current }) => (
  <div className="flex justify-center items-center space-x-2 mt-8">
    {Array.from({ length: total }).map((_, index) => (
      <div
        key={index}
        className={`w-12 h-2 rounded-full transition-colors duration-500 ${
          index < current
            ? 'bg-green-500'
            : index === current
            ? 'bg-yellow-400'
            : 'bg-slate-600'
        }`}
      />
    ))}
  </div>
);

function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get data directly from the Redux store. This is our single source of truth.
  const { user } = useSelector((state) => state.auth);
  const { gameSession, isLoading } = useSelector((state) => state.game);

  // Local state for UI that doesn't need to be in Redux.
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);

  // This useEffect correctly loads the game data into Redux when the page loads.
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(getGameDetails(gameId));
    // Cleans up the state when we leave the page.
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch, gameId]);

  // The final, corrected click handler.
  const handleAnswerClick = async (answerIndex) => {
    const decisionData = {
      gameId,
      questionIndex: currentQuestionIndex,
      answerIndex,
    };
    // Check if the answer is correct before dispatching
    const correctOptionIndex = gameSession.questions[currentQuestionIndex]?.correctOptionIndex;
    setLastAnswerCorrect(answerIndex === correctOptionIndex);
    // 1. Dispatch the action to update the score.
    // We wait for it to complete by using 'await'.
    const resultAction = await dispatch(submitDecision(decisionData));

    // 2. Check if the action was successful.
    if (submitDecision.fulfilled.match(resultAction)) {
      // 3. Only after a successful update, we move to the next question.
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (gameSession && nextQuestionIndex < gameSession.questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
        setLastAnswerCorrect(null); // Reset for next question
      } else {
        // Or end the game if it was the last question.
        navigate(`/assessment/${gameId}`);
      }
    }
  };
  if (isLoading || !gameSession || !gameSession.questions) {
  return <Spinner />;
  }


  // THIS IS THE CRITICAL FIX:
  // Check for game loading, the game session, AND the user object.
  let idKey = '';
  if (user && user.token) {
    try {
      const decoded = jwtDecode(user.token);
      idKey = decoded.user?.id || decoded.user?._id || '';
    } catch (e) {
      idKey = '';
    }
  }
  // Debug logs
  // console.log(`[FRONTEND DEBUG] Reading score with user ID key: "${idKey}"`);
  // console.log('[FRONTEND DEBUG] Full scores object from Redux:', gameSession.scores);

  const totalScore = gameSession.scores?.[idKey] || 0;
  const currentQuestion = gameSession.questions?.[currentQuestionIndex];

  if (isLoading || !gameSession) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto py-40 px-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center border-b border-slate-600 pb-4 mb-6">
          <h2 className="text-xl font-bold text-yellow-300">
            Scenario: {gameSession.scenario?.title}
          </h2>
          {/* Show total score and last answer correctness */}
          <div className="text-lg font-semibold bg-slate-700 text-cyan-300 px-4 py-2 rounded-lg">
            Total Score: {totalScore}
          </div>
        </div>

        <div className="mb-8 min-h-[100px] flex items-center justify-center">
          <h3 className="text-2xl font-semibold text-white text-center">
            {currentQuestion?.questionText || 'Loading question...'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              className={`w-full bg-slate-700 border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-slate-900 font-semibold p-4 rounded-lg transition-colors duration-300 text-left`}
            >
              {option.text}
            </button>
          ))}
        </div>

        <Timeline
          total={gameSession.questions?.length || 0}
          current={currentQuestionIndex}
        />
      </div>
    </div>
  );
}

export default GamePage;