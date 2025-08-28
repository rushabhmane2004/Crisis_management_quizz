// File: src/pages/Register.jsx
// Description: Updated to match the professional, dark-themed UI from your design.

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password2: '' });
    const { name, email, password, password2 } = formData;

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
        if (password !== password2) {
            alert('Passwords do not match');
        } else {
            dispatch(register({ name, email, password }));
        }
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="flex items-center justify-center min-h-[85vh] bg-gray-800">
            <div className="w-full max-w-md bg-gray-700/50 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-600 backdrop-blur-lg">
                <div className="text-center mb-8">
                    <UserPlus className="mx-auto text-orange-500" size={48} />
                    <h2 className="mt-4 text-3xl font-bold text-white">Create Your Account</h2>
                    <p className="text-gray-400 mt-2">Join the next generation of leaders.</p>
                </div>
                <form className="space-y-6" onSubmit={onSubmit}>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Full Name</label>
                        <input type="text" name="name" value={name} onChange={onChange} required className="w-full p-3 bg-gray-800 rounded-lg border-2 border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 text-gray-200 focus:outline-none" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Email Address</label>
                        <input type="email" name="email" value={email} onChange={onChange} required className="w-full p-3 bg-gray-800 rounded-lg border-2 border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 text-gray-200 focus:outline-none" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} required className="w-full p-3 bg-gray-800 rounded-lg border-2 border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 text-gray-200 focus:outline-none" placeholder="••••••••" />
                    </div>
                     <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Confirm Password</label>
                        <input type="password" name="password2" value={password2} onChange={onChange} required className="w-full p-3 bg-gray-800 rounded-lg border-2 border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 text-gray-200 focus:outline-none" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="w-full mt-4 py-3 text-lg font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-orange-500/50">
                        Create Account
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-6">
                    Already have an account? <Link to="/login" className="font-semibold text-blue-500 hover:text-blue-400">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;

//C:\Users\Rushabh\Desktop\SR TEST\frontend\frontend\src\pages\Register.jsx