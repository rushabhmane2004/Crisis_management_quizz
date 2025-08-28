// File: src/pages/GameLobby.jsx
// Description: CORRECTED - This version re-integrates Redux and React Router to make the
// "Launch Scenario" buttons fully functional, fixing the "Simulation" alert issue.
// MODIFIED - Replaced Lucide icons with custom images and adjusted card sizing.

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Play } from 'lucide-react'; // Shield, Users, etc. removed as they are replaced by images
import { startGame, reset } from '../features/game/gameSlice';
import Spinner from '../components/Spinner';

// Import your custom icon images from the assets folder
import singlePlayerIcon from '../assets/single (2).png';
import multiPlayerIcon from '../assets/multi.png';
import aiVsHumanIcon from '../assets/aivshuman.png';
import policyIcon from '../assets/policy.png';
import crisisIcon from '../assets/crisis.png';
import realWorldIcon from '../assets/real.png'; // Assuming a default for 'Single-Player Strategy'

const GameLobby = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { isLoading } = useSelector((state) => state.game);

    const [scenarios, setScenarios] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [loadingScenarioId, setLoadingScenarioId] = useState(null);

    useEffect(() => {
        dispatch(reset());
        const fetchScenarios = async () => {
            if (!user) { navigate('/login'); return; }
            try {
                const token = user?.token;
                const response = await fetch('http://localhost:5000/api/scenarios', { headers: { 'x-auth-token': token } });
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setScenarios(data);
            } catch (error) {
                console.error("Failed to fetch scenarios:", error);
            }
            finally { setFetchLoading(false); }
        };
        fetchScenarios();
    }, [user, navigate, dispatch]);

    const handleStartGame = async (scenario) => {
        setLoadingScenarioId(scenario._id);
        const gameData = { scenarioId: scenario._id, gameType: 'single-player', playerIds: [] };
        try {
            const resultAction = await dispatch(startGame(gameData));
            if (startGame.fulfilled.match(resultAction)) {
                const gameSession = resultAction.payload;
                if (scenario.mode === 'Policy & Governance') navigate(`/policy-game/${gameSession._id}`);
                else if (scenario.mode === 'AI vs. Human Battle') navigate(`/ai-vs-human/${gameSession._id}`);
                else if (scenario.mode === 'Multiplayer Challenge') navigate(`/multiplayer/${gameSession._id}`);
                else if (scenario.mode === 'Crisis Olympics') navigate(`/crisis-olympics/${gameSession._id}`);
                else navigate(`/game/${gameSession._id}`);
            } else {
                alert(`Failed to start game: ${resultAction.payload || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            alert('An unexpected error occurred.');
        } finally {
            setLoadingScenarioId(null);
        }
    };

    const getModeIcon = (mode) => {
        // Common styles for the image tags
        const imageProps = { className: "w-full h-full object-contain" };
        switch (mode) {
            case 'Single-Player Strategy': return <img src={singlePlayerIcon} alt="Single Player" {...imageProps} />;
            case 'Multiplayer Challenge': return <img src={multiPlayerIcon} alt="Multiplayer" {...imageProps} />;
            case 'AI vs. Human Battle': return <img src={aiVsHumanIcon} alt="AI vs Human" {...imageProps} />;
            case 'Policy & Governance': return <img src={policyIcon} alt="Policy" {...imageProps} />;
            case 'Crisis Olympics': return <img src={crisisIcon} alt="Crisis Olympics" {...imageProps} />;
            default: return <img src={realWorldIcon} alt="Real World Scenario" {...imageProps} />;
        }
    };

    if (fetchLoading) return (
        <div className="flex justify-center items-center h-screen bg-slate-900">
            <Spinner />
        </div>
    );

    return (
        <div className="bg-slate-900 min-h-screen">
           <section className="relative text-center pt-20 pb-10 md:pt-32 md:pb-16 px-4 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
                        Master the Art of <span className="text-blue-500">Decision-Making</span>
                    </h2>
                    <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-gray-300">
                        An AI-powered simulation game to test your strategic thinking and risk management skills.
                    </p>
                </div>
            </section>

            <section className="pt-5 pb-20 px-4">
                <style>{`
                    .text-shadow { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); }
                    .rounded-4xl { border-radius: 2rem; }
                `}</style>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl md:text-4xl font-bold text-white">Choose Your Challenge</h3>
                        <p className="mt-4 text-lg text-gray-400">Powered by Lord KALKI AI to provide a dynamic and realistic experience.</p>
                    </div>

                    <div className="group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15">
                        {scenarios.map((scenario) => (
                            <div
                                key={scenario._id}
                                className="group/card rounded-4xl relative overflow-hidden h-72 w-full transition-all duration-500 ease-out backdrop-blur-sm bg-white/10 group-hover:blur-[2px] hover:!blur-none hover:scale-105 hover:border-blue-400 border-2 border-transparent p-[2px] flex flex-col"
                            >
                                <div className="absolute inset-0 border border-white/20 rounded-4xl shadow-lg"></div>

                                {/* Top Section: 40% for Logo */}
                                <div className="flex items-center justify-center h-[40%] relative z-10 transition-transform duration-500 group-hover/card:scale-110">
                                    {getModeIcon(scenario.mode)}
                                </div>

                                {/* Bottom Section: 60% for Text */}
                                <div className="h-[60%] flex flex-col justify-center text-center px-4 relative z-10">
                                    <h3 className="text-xl font-bold text-white mb-2 text-shadow">{scenario.title}</h3>
                                    <p className="text-white/80 mb-4 text-md text-center transition-opacity duration-300 group-hover/card:opacity-0">
                                        {scenario.description}
                                    </p>
                                </div>

                                {/* Button Container */}
                                <div className="absolute inset-0 flex flex-col justify-end p-4 transition-all duration-300 ease-in-out z-10 opacity-0 translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0">
                                    <button
                                        onClick={() => handleStartGame(scenario)}
                                        disabled={loadingScenarioId === scenario._id || isLoading}
                                        className="w-full inline-flex items-center justify-center bg-white/20 text-white px-6 py-2 rounded-xl text-base font-medium hover:bg-white/30 transition-all duration-300 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loadingScenarioId === scenario._id ? (
                                            <Spinner />
                                        ) : (
                                            <>
                                                Launch Scenario <Play className="ml-2" size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GameLobby;
