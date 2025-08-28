// File: src/pages/PolicyPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGameDetails, reset } from '../features/game/gameSlice';
import Spinner from '../components/Spinner';

function PolicyPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { gameSession, isLoading } = useSelector((state) => state.game);
  const [policyText, setPolicyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
    dispatch(getGameDetails(gameId));
    return () => dispatch(reset());
  }, [user, navigate, dispatch, gameId]);

  const handleSubmitPolicy = async () => {
    if (policyText.trim().length < 50) {
      setError('Your policy must be at least 50 characters long.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/ai/evaluate-policy/${gameId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token,
        },
        body: JSON.stringify({ policyText }),
      });

      // ✅ IMPROVED: Robustly handle both JSON and non-JSON error responses.
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            // If the server sent a JSON error, parse it.
            const errData = await response.json();
            throw new Error(errData.msg || 'An unknown error occurred.');
        } else {
            // If the server sent a text/html error, use the raw text.
            const errText = await response.text();
            throw new Error(errText);
        }
      }

      // If the submission was successful, navigate to the assessment page.
      navigate(`/assessment/${gameId}`);

    } catch (err) {
      console.error('Policy submission error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !gameSession) return <Spinner />;

  return (
    <div className="container mx-auto p-8">
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-yellow-300 font-orbitron">{gameSession.scenario.title}</h1>
        <p className="text-lg text-slate-300 mb-6">{gameSession.scenario.description}</p>
        <hr className="border-slate-600 my-6" />
        <div className="mb-6">
          <label htmlFor="policyText" className="block text-xl font-semibold text-white mb-2">
            Propose Your Policy
          </label>
          <p className="text-sm text-slate-400 mb-4">
            Based on the scenario, write a clear policy to address the crisis. The Lord KALKI AI will evaluate its effectiveness, ethics, and risk management.
          </p>
          <textarea
            id="policyText"
            rows="10"
            value={policyText}
            onChange={(e) => setPolicyText(e.target.value)}
            className="w-full p-4 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none text-white"
            placeholder="Begin writing your policy here..."
          />
        </div>
        
        {/* Display any error messages */}
        {error && <p className="text-red-500 text-center mb-4 bg-red-900/50 p-3 rounded">{error}</p>}
        
        <button
          onClick={handleSubmitPolicy}
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-wait text-lg"
        >
          {isSubmitting ? 'Evaluating with Lord KALKI AI...' : 'Submit Policy for AI Judgment'}
        </button>
      </div>
    </div>
  );
}

export default PolicyPage;