import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { Landing } from './pages/Landing';
import { HowToPlay } from './pages/HowToPlay';
import { MainGame } from './pages/MainGame';
import { GameOver } from './pages/GameOver';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/game" element={<MainGame />} />
          <Route path="/game-over" element={<GameOver />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
