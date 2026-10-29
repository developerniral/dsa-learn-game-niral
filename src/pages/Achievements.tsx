import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import {
  Award,
  Trophy,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Flame,
  Terminal,
  Cpu,
  Activity,
  Footprints
} from 'lucide-react';

const CATEGORIES = ['all', 'learning', 'playground', 'algorithms', 'quiz', 'mastery'] as const;

export const Achievements: React.FC = () => {
  const { achievements } = useGame();
  const [filter, setFilter] = useState<typeof CATEGORIES[number]>('all');

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalXP = achievements
    .filter(a => a.isUnlocked)
    .reduce((sum, a) => sum + a.xpReward, 0);

  const filtered =
    filter === 'all'
      ? achievements
      : achievements.filter(a => a.category === filter);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <Award className="w-4 h-4" />
          <span>HALL OF MASTERY</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Achievements &amp; Badges
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Unlock milestone badges as you experiment in playgrounds, solve algorithm simulations, and ace quizzes.
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-mono">BADGES EARNED</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {unlockedCount} / {achievements.length}
            </div>
          </div>
          <Trophy className="w-8 h-8 text-amber-400" />
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-mono">ACHIEVEMENT XP</span>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
              +{totalXP} XP
            </div>
          </div>
          <Sparkles className="w-8 h-8 text-cyan-400" />
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-mono">COMPLETION RATE</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/80 border border-slate-800 rounded-xl w-fit overflow-x-auto">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              filter === cat
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(badge => {
          const isUnlocked = badge.isUnlocked;

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all ${
                isUnlocked
                  ? 'bg-slate-900/70 border-slate-700 shadow-lg'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isUnlocked
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-slate-800/60 text-slate-600'
                  }`}
                >
                  <Trophy className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400 font-semibold">
                    +{badge.xpReward} XP
                  </span>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>
              </div>

              <h3 className="text-sm font-bold text-white mb-1">{badge.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[36px]">
                {badge.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>{isUnlocked ? 'Completed' : 'In Progress'}</span>
                  <span>
                    {isUnlocked ? badge.maxProgress : badge.progress} / {badge.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isUnlocked ? 'bg-emerald-500' : 'bg-cyan-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(((isUnlocked ? badge.maxProgress : badge.progress) / badge.maxProgress) * 100)
                      )}%`
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
