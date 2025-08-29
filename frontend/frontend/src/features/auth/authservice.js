import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL + '/api/auth';

const register = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }
  return res.data;
};

const login = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData);
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }
  return res.data;
};

const getUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return { user: res.data.user, token };
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const authService = { register, login, getUser, logout };

export default authService;
//C:\Users\Rushabh\Desktop\SR TEST\frontend\frontend\src\features\auth\authservice.js