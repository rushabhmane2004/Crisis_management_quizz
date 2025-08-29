// File: src/pages/CrisisOlympicsPage.jsx
// Description: NEW FILE - A creative and exciting UI for the Crisis Olympics tournament mode.

// File: src/pages/CrisisOlympicsPage.jsx
// ✅ Correct Code
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGameDetails, submitDecision, reset } from '../features/game/gameslice';
import Spinner from '../components/Spinner';

// A visual component to show progress through questions
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

function CrisisOlympicsPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { gameSession, isLoading } = useSelector((state) => state.game);

  // State for game flow
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(15); // Timer for each question
  const [isSubmitting, setIsSubmitting] = useState(false); // Disable buttons on click

  // Fetch game details on component mount
  useEffect(() => {
    if (!user) navigate('/login');
    dispatch(getGameDetails(gameId));
    return () => dispatch(reset());
  }, [user, navigate, dispatch, gameId]);

  // Main timer logic
  useEffect(() => {
    // If an answer is being submitted, pause the timer
    if (isSubmitting) return;

    // If time runs out, move to the next question (0 score for this one)
    if (timer === 0) {
      moveToNextQuestion();
      return;
    }

    // Countdown interval
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // Cleanup interval on component unmount or when dependencies change
    return () => clearInterval(interval);
  }, [timer, isSubmitting]);
  
  // Reset the timer whenever a new question is shown
  useEffect(() => {
    setTimer(15); // Reset to the initial time
  }, [currentQuestionIndex]);


  /**
   * Handles moving to the next question or ending the game.
   */
  const moveToNextQuestion = () => {
    if (gameSession && currentQuestionIndex < gameSession.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setIsSubmitting(false); // Re-enable buttons for the next question
    } else {
      // Last question was answered, navigate to the assessment page
      navigate(`/assessment/${gameId}`);
    }
  };

  /**
   * Handles the user clicking an answer option.
   */
  const handleAnswerClick = async (answerIndex) => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    const decisionData = {
      gameId,
      questionIndex: currentQuestionIndex,
      answerIndex,
    };

    // Dispatch the decision to the backend to update the score
    await dispatch(submitDecision(decisionData));

    // Move to the next question after submission is complete
    moveToNextQuestion();
  };

  if (isLoading || !gameSession || !gameSession.questions) {
    return <Spinner />;
  }
  
  const currentQuestion = gameSession.questions[currentQuestionIndex];
  // Determine timer color based on time remaining
  const timerColor = timer <= 5 ? 'text-red-500' : 'text-white';

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="bg-slate-800 border-4 border-yellow-400 p-6 rounded-lg shadow-2xl text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-300 font-orbitron mb-2" style={{textShadow: '2px 2px 10px #f5b041'}}>CRISIS OLYMPICS</h1>
        <p className="text-lg md:text-xl text-slate-300 mb-6">Make your decision before time runs out!</p>
        
        <div className="my-8">
            <p className="text-lg text-cyan-300">Time Remaining</p>
            <p className={`text-7xl md:text-8xl font-bold my-2 transition-colors duration-300 ${timerColor}`}>{timer}</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-lg min-h-[350px] flex flex-col justify-between">
            <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">
                  {currentQuestion.questionText}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => (
                        <button 
                          key={index} 
                          onClick={() => handleAnswerClick(index)}
                          disabled={isSubmitting || timer === 0}
                          className="p-4 bg-slate-700 text-white rounded transition-colors hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
            </div>

            <Timeline
              total={gameSession.questions.length}
              current={currentQuestionIndex}
            />
        </div>

      </div>
    </div>
  );
}

export default CrisisOlympicsPage;

//C:\Users\Rushabh\Desktop\SR TEST\frontend\frontend\src\pages\CrisisOlympicsPage.jsx