import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGameDetails, reset } from '../features/game/gameslice';
import Spinner from '../components/Spinner';
import { jwtDecode } from "jwt-decode";

function AssessmentPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { gameSession, isLoading } = useSelector((state) => state.game);

  useEffect(() => {
    if (!user) navigate('/login');
    dispatch(getGameDetails(gameId));
    return () => dispatch(reset());
  }, [user, navigate, dispatch, gameId]);

  const getEvaluationTitle = (score) => {
    if (score >= 90) return 'Crisis Mastermind';
    if (score >= 70) return 'Strategic Problem Solver';
    if (score >= 50) return 'Reactive Responder';
    return 'High-Risk Decision-Maker';
  };

  // Wait for all data to load
  if (isLoading || !gameSession || !user || !gameSession.scores) {
    return <Spinner />;
  }

  // Get user ID from token
  let idKey = '';
  if (user && user.token) {
    try {
      const decoded = jwtDecode(user.token);
      // Log for debugging
      // console.log('Decoded JWT:', decoded);
      idKey = decoded.user?.id || decoded.user?._id || '';
    } catch (e) {
      idKey = '';
    }
  }

  // Log for debugging
  // console.log('idKey:', idKey);
  // console.log('gameSession.scores:', gameSession.scores);

  // Fallback: if idKey is not found, try to use the first key in scores
  let totalScore = 0;
  if (idKey && gameSession.scores[idKey] !== undefined) {
    totalScore = gameSession.scores[idKey];
  } else {
    // fallback: use the first score if idKey is missing
    const firstScore = Object.values(gameSession.scores)[0];
    if (firstScore !== undefined) totalScore = firstScore;
  }

  const evaluationTitle = getEvaluationTitle(totalScore);

  return (
    <div className="container mx-auto p-40">
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-yellow-300 mb-2 font-orbitron">Assessment Complete</h1>
        <p className="text-lg text-slate-300 mb-6">Lord KALKI AI has evaluated your performance.</p>

        <div className="p-6 rounded-lg my-6 bg-cyan-900/50 border border-cyan-400">
          <p className="text-xl font-semibold text-cyan-200">Your Final Score</p>
          <p className="text-7xl font-bold text-white my-2">{totalScore}</p>
          <p className="text-2xl font-bold text-cyan-300">{evaluationTitle}</p>
        </div>

        <button
          onClick={() => navigate('/lobby')}
          className="mt-8 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-lg"
        >
          Return to Lobby
        </button>
      </div>
    </div>
  );
}

export default AssessmentPage;