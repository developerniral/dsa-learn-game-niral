import React from 'react';
import { useGame } from '../../context/GameContext';
import { Volume2, VolumeX, Menu, Flame, Zap, Trophy } from 'lucide-react';
import { PageId } from '../../types/game';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { stats, isMuted, toggleMute, setCurrentPage, notification } = useGame();

  const nextLevelXP = stats.level * 250;
  const currentLevelBaseXP = (stats.level - 1) * 250;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((stats.xp - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100))
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-6 px-4 md:px-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-sm shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              Ω
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
              DSA Quest
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setCurrentPage('learning-path')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Learning Path
          </button>
          <button
            onClick={() => setCurrentPage('playground')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Playground
          </button>
          <button
            onClick={() => setCurrentPage('algorithm-lab')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Algorithm Lab
          </button>
          <button
            onClick={() => setCurrentPage('big-o-arena')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Big O Arena
          </button>
          <button
            onClick={() => setCurrentPage('quiz')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Quiz Challenge
          </button>
        </nav>

        {/* Zone 3: Gamified Stats & Actions */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Notification banner if active */}
          {notification && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 animate-pulse">
              <span>{notification.message}</span>
            </div>
          )}

          {/* Daily Streak */}
          <div
            className="flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-950/30 px-2.5 py-1 rounded-md border border-amber-900/50"
            title="Current Daily Streak"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="tabular-nums font-mono font-semibold">{stats.streakDays}d</span>
          </div>

          {/* Level and XP Meter */}
          <button
            onClick={() => setCurrentPage('settings')}
            className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-1 transition-all"
            title={`Level ${stats.level} · ${stats.xp} Total XP · ${progressPercent}% to Level ${stats.level + 1}`}
          >
            <div className="flex items-center gap-1 text-cyan-400 font-semibold font-mono">
              <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>Lv.{stats.level}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-mono text-slate-400 tabular-nums">{stats.xp} XP</span>
            </div>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg border transition-colors ${
              isMuted
                ? 'border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                : 'border-slate-800 text-cyan-400 hover:bg-cyan-950/30 hover:border-cyan-800/60'
            }`}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            aria-label="Sound Toggle"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Continue / Primary Action */}
          <button
            onClick={() => setCurrentPage('learning-path')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm shadow-cyan-600/30 whitespace-nowrap shrink-0"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Resume Quest</span>
          </button>
        </div>
      </div>
    </header>
  );
};
