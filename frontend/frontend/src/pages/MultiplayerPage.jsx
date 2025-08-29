// File: src/pages/MultiplayerPage.jsx
// Description: NEW FILE - A placeholder page for the Multiplayer mode.

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGameDetails, reset } from '../features/game/gameslice';
import Spinner from '../components/Spinner';

function MultiplayerPage() {
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

  if (isLoading || !gameSession) return <Spinner />;

  return (
    <div className="container mx-auto p-8 text-center">
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-yellow-300 font-orbitron">Multiplayer Challenge</h1>
        <p className="text-lg text-slate-300 mb-6">
          You have entered the multiplayer lobby for the scenario: <span className="font-bold text-cyan-300">{gameSession.scenario.title}</span>.
        </p>
        <p className="text-slate-400">
          In a full implementation, you would see other players here and interact in real-time. This feature is currently under development.
        </p>
        <button
          onClick={() => navigate('/lobby')}
          className="mt-8 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Lobby
        </button>
      </div>
    </div>
  );
}

export default MultiplayerPage;

//C:\Users\Rushabh\Desktop\SR TEST\frontend\frontend\src\pages\MultiplayerPage.jsx