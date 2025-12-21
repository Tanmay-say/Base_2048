import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { Landing } from './pages/Landing';
import { HowToPlay } from './pages/HowToPlay';
import { MainGame } from './pages/MainGame';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { InstallPrompt } from './pwa/InstallPrompt';

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/game" element={<MainGame />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <InstallPrompt />
      </Router>
    </GameProvider>
  );
}

export default App;
