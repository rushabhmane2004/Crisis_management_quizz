// File: src/pages/Login.jsx
// Description: Your updated login page code. The page now correctly takes up the full
// screen height and the main application header will not appear on this page.

// File: src/pages/Login.jsx
// Description: Your updated login page code. The page now correctly takes up the full
// screen height and the main application header will not appear on this page.

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';
import logo from '../assets/logo1.png';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) { alert(message); }
        if (isSuccess || user) { navigate('/'); }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md bg-gray-700/50 rounded-2xl shadow-2xl p-8 md:p-8 border border-gray-600 backdrop-blur-lg">
                <div className="text-center mb-8">
                    <img src={logo} alt="CrisisSim Logo" className="mx-auto h-40 w-50" />
                    <h2 className="mt-4 text-3xl font-bold text-white">Welcome Back</h2>
                    <p className="text-gray-400 mt-2">Log in to continue your training.</p>
                </div>
                <form className="space-y-6" onSubmit={onSubmit}>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Email Address</label>
                        <input type="email" name="email" value={email} onChange={onChange} required className="w-full p-3 bg-gray-800 rounded-xl border-2 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-gray-200 focus:outline-none" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} required className="w-full p-3 bg-gray-800 rounded-xl border-2 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-gray-200 focus:outline-none" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="w-full mt-4 py-3 text-lg font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/50">
                        Log In
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-6">
                    Don't have an account? <Link to="/register" className="font-semibold text-orange-500 hover:text-orange-400">Sign Up</Link>
                </p>
            </div>

            {/* Footer */}
            <p className="text-white text-sm mt-6 mb-2 text-center">
                © {new Date().getFullYear()} Crisis Management. All rights reserved.
            </p>
        </div>
    );
};

export default LoginPage;
//C:\Users\Rushabh\Desktop\SR TEST\frontend\frontend\src\pages\Login.jsx

//C:\Users\Rushabh\Desktop\SR TEST\frontend\frontend\src\pages\Login.jsx