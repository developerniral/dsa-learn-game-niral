import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { LEVEL_PATHS } from '../data/lessons';
import { CODING_MISSIONS } from '../data/missions';
import { sound } from '../utils/sound';
import {
  Flame,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  Trophy,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  Terminal,
  Activity
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    stats,
    achievements,
    setCurrentPage,
    setActiveLessonId,
    awardXP,
    resetProgress
  } = useGame();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [dailyChallengeDone, setDailyChallengeDone] = useState(false);

  // Compute stats
  const allLessons = LEVEL_PATHS.flatMap(lp => lp.lessons);
  const totalLessonsCount = allLessons.length;
  const completedLessonsCount = stats.completedLessonIds.length;
  const progressPercent = Math.round((completedLessonsCount / totalLessonsCount) * 100);

  const totalMissionsCount = CODING_MISSIONS.length;
  const completedMissionsCount = stats.completedMissionIds.length;

  const nextLevelXP = stats.level * 250;
  const currentLevelBaseXP = (stats.level - 1) * 250;
  const levelProgress = Math.min(
    100,
    Math.max(0, Math.round(((stats.xp - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100))
  );

  // Recommended next lesson
  const nextLesson = allLessons.find(l => !stats.completedLessonIds.includes(l.id)) || allLessons[0];

  const handleDailyChallenge = () => {
    if (dailyChallengeDone) return;
    setDailyChallengeDone(true);
    awardXP(50, 'Daily Challenge Solved');
  };

  const handleContinueLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setCurrentPage('learning-path');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Welcome & Player HUD Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <span>DSA QUEST ADVENTURE ACTIVE</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, Adventurer!
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Master Data Structures &amp; Algorithms through interactive experiments, Python code execution, and algorithmic mastery.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleContinueLesson(nextLesson.id)}
              className="flex items-center gap-2 px-5 py-3 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all shadow-lg shadow-cyan-600/30 hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Continue: {nextLesson.title}</span>
            </button>
            <button
              onClick={() => setCurrentPage('playground')}
              className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-colors"
            >
              <span>DS Playground</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4-KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1: Level & XP */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>PLAYER LEVEL</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-white">Level {stats.level}</div>
            <div className="text-xs text-cyan-400 font-mono mt-0.5">{stats.xp} Total XP</div>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Daily Streak */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>LEARNING STREAK</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-amber-400">{stats.streakDays} Days</div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">Consecutive Practice</div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 font-mono">Keep momentum going!</div>
        </div>

        {/* KPI 3: Lessons Complete */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>LESSONS MASTERED</span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-white">
              {completedLessonsCount} / {totalLessonsCount}
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-0.5">{progressPercent}% of Curriculum</div>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* KPI 4: Missions & Challenges */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>CODING MISSIONS</span>
            <Terminal className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-white">
              {completedMissionsCount} / {totalMissionsCount}
            </div>
            <div className="text-xs text-purple-400 font-mono mt-0.5">Python Challenges</div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 font-mono">
            {totalMissionsCount - completedMissionsCount} remaining
          </div>
        </div>
      </div>

      {/* Two-Column Main Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Learning Path Overview (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Adventure Map: 8 Levels</span>
            </h2>
            <button
              onClick={() => setCurrentPage('learning-path')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LEVEL_PATHS.map(level => {
              const isUnlocked = stats.unlockedLevelIds.includes(level.id);
              const completedCount = level.lessons.filter(l =>
                stats.completedLessonIds.includes(l.id)
              ).length;
              const isFinished = completedCount === level.lessons.length && level.lessons.length > 0;

              return (
                <div
                  key={level.id}
                  onClick={() => {
                    if (isUnlocked) {
                      setActiveLessonId(level.lessons[0]?.id || null);
                      setCurrentPage('learning-path');
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900 cursor-pointer'
                      : 'bg-slate-950/40 border-slate-900 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                      LEVEL 0{level.levelNumber}
                    </span>
                    {isFinished ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[11px] font-mono text-slate-400">
                        {completedCount}/{level.lessons.length} Lessons
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-slate-600">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Requires Lv.{level.requiredLevelToUnlock}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{level.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {level.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Daily Challenge & Recent Achievements (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Daily Quick Challenge Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-cyan-400" />
                DAILY QUEST
              </span>
              <span className="text-[11px] font-mono text-cyan-300 font-semibold">+50 XP</span>
            </div>

            <h3 className="text-sm font-bold text-white">
              Data Structure Riddle
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Which data structure should you use if you need instant O(1) membership checks to prevent duplicate usernames?"
            </p>

            <button
              onClick={handleDailyChallenge}
              disabled={dailyChallengeDone}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                dailyChallengeDone
                  ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300 cursor-default'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
              }`}
            >
              {dailyChallengeDone ? '✓ Solved: Hash Set (O(1))' : 'Solve: Hash Set'}
            </button>
          </div>

          {/* Badges Spotlight */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Achievements
              </h3>
              <button
                onClick={() => setCurrentPage('achievements')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300"
              >
                View all ({achievements.filter(a => a.isUnlocked).length}/{achievements.length})
              </button>
            </div>

            <div className="space-y-2">
              {achievements.slice(0, 3).map(badge => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      badge.isUnlocked
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-slate-800/60 text-slate-600'
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{badge.title}</div>
                    <div className="text-[11px] text-slate-400 truncate">{badge.description}</div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold shrink-0">
                    +{badge.xpReward} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reset progress disclaimer */}
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-500 space-y-2">
            <div>
              DSA Quest saves all earned XP, badges, and completed lessons locally in your browser.
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-slate-400 hover:text-red-400 underline underline-offset-2 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all gameplay progress</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Reset All Progress?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This will reset your XP back to 120, lock advanced levels, and reset all unlocked badges. This action cannot be undone.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  resetProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 px-3 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
