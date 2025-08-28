// File: src/App.jsx
// Description: No changes needed here. The Header is still rendered globally,
// but it will conditionally hide itself based on the route.

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';

import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GameLobby from './pages/GameLobby';
import GamePage from './pages/GamePage';
import PolicyPage from './pages/PolicyPage';
import AIvsHumanPage from './pages/AIvsHumanPage';
import MultiplayerPage from './pages/MultiplayerPage';
import CrisisOlympicsPage from './pages/CrisisOlympicsPage';
import AssessmentPage from './pages/AssessmentPage';
import Leaderboard from './pages/Leaderboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- Protected Routes --- */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lobby" element={<GameLobby />} />
            
            <Route path="/game/:gameId" element={<GamePage />} />
            <Route path="/policy-game/:gameId" element={<PolicyPage />} />
            <Route path="/ai-vs-human/:gameId" element={<AIvsHumanPage />} />
            <Route path="/multiplayer/:gameId" element={<MultiplayerPage />} />
            <Route path="/crisis-olympics/:gameId" element={<CrisisOlympicsPage />} />
            <Route path="/assessment/:gameId" element={<AssessmentPage />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

//C:\Users\Rushabh\Desktop\SR TEST\frontend\frontend\src\App.jsx