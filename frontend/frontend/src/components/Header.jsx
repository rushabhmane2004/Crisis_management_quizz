// File: src/components/Header.jsx
// Description: UPDATED - The header now uses the `useLocation` hook to check the
// current path and returns `null` (nothing) on the login and register pages.

import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // 👈 Import useLocation
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authslice';
import { LogIn, UserPlus, Play, Crown, LogOut } from 'lucide-react';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation(); // 👈 Get the current location object
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    // ✨ If the current path is /login or /register, don't render the header
    if (['/login', '/register'].includes(location.pathname)) {
        return null;
    }
    
    const navButtonStyles = "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50";

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
            <div className="
                mx-auto
                flex items-center justify-between
                px-4 py-4
                bg-gray-950/50 backdrop-blur-[3px] 
                rounded-3xl
                border border-white/10
                shadow-2xl shadow-black/20
            ">
                <Link to="/" className="flex items-center space-x-3 cursor-pointer shrink-0">
                    <h1 className="
                        font-passion font-black
                        text-4xl 
                        tracking-tight
                        text-[#2B7FFF] 
                        drop-shadow-[0_0_3px_rgba(0,0,0,0.9)]
                        transition-all duration-300 
                        hover:drop-shadow-[0_2px_8px_rgba(43,127,255,0.5)]">
                            Crisis Quizz
                    </h1>
                </Link>

                <nav className="hidden md:flex items-center space-x-1">
                    {user ? (
                        <>
                            <button 
                                onClick={() => navigate('/lobby')} 
                                className={`${navButtonStyles} bg-blue-600 text-white hover:bg-blue-500`}
                            >
                                <Play size={16} />
                                <span>Game Lobby</span>
                            </button>
                             <button 
                                onClick={() => navigate('/leaderboard')} 
                                className={`${navButtonStyles} text-gray-300 hover:bg-white/10 hover:text-white`}
                            >
                                <Crown size={16} />
                                <span>Leaderboard</span>
                            </button>
                            <button 
                                onClick={onLogout} 
                                className={`${navButtonStyles} text-gray-300 hover:bg-red-500/10 hover:text-red-400`}
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => navigate('/login')} 
                                className={`${navButtonStyles} text-gray-300 hover:bg-white/10 hover:text-white`}
                            >
                                <LogIn size={16}/>
                                <span>Login</span>
                            </button>
                            <button 
                                onClick={() => navigate('/register')} 
                                className={`${navButtonStyles} bg-orange-600 text-white hover:bg-orange-500`}
                            >
                                <UserPlus size={16}/>
                                <span>Sign Up</span>
                            </button>
                        </>
                    )}
                </nav>
            </div>  
        </header>
    );
};

export default Header;
