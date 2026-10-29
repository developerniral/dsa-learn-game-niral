/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { LearningPath } from './pages/LearningPath';
import { Playground } from './pages/Playground';
import { AlgorithmLab } from './pages/AlgorithmLab';
import { BigOArena } from './pages/BigOArena';
import { QuizChallenge } from './pages/QuizChallenge';
import { CodingMissions } from './pages/CodingMissions';
import { Achievements } from './pages/Achievements';
import { Settings } from './pages/Settings';

const AppContent: React.FC = () => {
  const { currentPage } = useGame();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'learning-path' && <LearningPath />}
          {currentPage === 'playground' && <Playground />}
          {currentPage === 'algorithm-lab' && <AlgorithmLab />}
          {currentPage === 'big-o-arena' && <BigOArena />}
          {currentPage === 'quiz' && <QuizChallenge />}
          {currentPage === 'missions' && <CodingMissions />}
          {currentPage === 'achievements' && <Achievements />}
          {currentPage === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
