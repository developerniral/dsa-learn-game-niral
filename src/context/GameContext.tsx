import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { PageId, UserStats, Achievement } from '../types/game';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { LEVEL_PATHS } from '../data/lessons';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface GameContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  stats: UserStats;
  achievements: Achievement[];
  isMuted: boolean;
  toggleMute: () => void;
  awardXP: (amount: number, reason?: string) => void;
  completeLesson: (lessonId: string, xpReward: number) => void;
  completeMission: (missionId: string, xpReward: number) => void;
  recordQuizResult: (scorePercent: number, xpEarned: number) => void;
  recordOperation: (structure: string) => void;
  recordAlgorithmTest: () => void;
  resetProgress: () => void;
  notification: { message: string; type: 'xp' | 'badge' | 'level' } | null;
  activeLessonId: string | null;
  setActiveLessonId: (id: string | null) => void;
  activePlaygroundTab: string;
  setActivePlaygroundTab: (tab: string) => void;
}

const STORAGE_KEY = 'dsa_quest_progress_v1';

const DEFAULT_STATS: UserStats = {
  xp: 120, // Initial onboarding starter XP
  level: 1,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessonIds: [],
  completedMissionIds: [],
  unlockedLevelIds: ['level-1', 'level-2'],
  achievementsUnlocked: [],
  quizzesCompleted: 0,
  perfectQuizzes: 0,
  algorithmsTested: 0,
  dataStructuresExplored: [],
  operationsCount: 0
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<string | null>('array-basics');
  const [activePlaygroundTab, setActivePlaygroundTab] = useState<string>('array');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'xp' | 'badge' | 'level' } | null>(null);

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return DEFAULT_STATS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_achievements');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return INITIAL_ACHIEVEMENTS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_achievements', JSON.stringify(achievements));
    } catch {
      // ignore
    }
  }, [achievements]);

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      sound.setMuted(next);
      return next;
    });
  };

  const showNotification = (message: string, type: 'xp' | 'badge' | 'level') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Fallback
    }
  };

  const unlockAchievement = useCallback((badgeId: string) => {
    setAchievements(prev => {
      const target = prev.find(a => a.id === badgeId);
      if (!target || target.isUnlocked) return prev;

      sound.victory();
      triggerConfetti();
      showNotification(`🏆 Badge Unlocked: ${target.title}! (+${target.xpReward} XP)`, 'badge');

      // Award achievement XP
      setStats(curr => ({
        ...curr,
        xp: curr.xp + target.xpReward,
        achievementsUnlocked: [...curr.achievementsUnlocked, badgeId]
      }));

      return prev.map(a =>
        a.id === badgeId
          ? { ...a, isUnlocked: true, unlockedAt: new Date().toLocaleDateString(), progress: a.maxProgress }
          : a
      );
    });
  }, []);

  const awardXP = useCallback((amount: number, reason?: string) => {
    if (amount <= 0) return;
    sound.add();
    showNotification(`+${amount} XP ${reason ? `· ${reason}` : ''}`, 'xp');

    setStats(prev => {
      const newXP = prev.xp + amount;
      const prevLevel = prev.level;
      const newLevel = Math.max(1, Math.floor(newXP / 250) + 1);

      // Check level up
      if (newLevel > prevLevel) {
        sound.victory();
        triggerConfetti();
        showNotification(`🎉 LEVEL UP! You reached Level ${newLevel}!`, 'level');
      }

      // Unlock levels dynamically as player advances
      const newUnlockedLevels = [...prev.unlockedLevelIds];
      LEVEL_PATHS.forEach(level => {
        if (newLevel >= level.requiredLevelToUnlock && !newUnlockedLevels.includes(level.id)) {
          newUnlockedLevels.push(level.id);
        }
      });

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        unlockedLevelIds: newUnlockedLevels
      };
    });
  }, []);

  const completeLesson = useCallback((lessonId: string, xpReward: number) => {
    setStats(prev => {
      if (prev.completedLessonIds.includes(lessonId)) {
        // Already completed - prevent duplicate XP farming
        return prev;
      }
      awardXP(xpReward, 'Lesson Completed');
      return {
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, lessonId]
      };
    });

    // Check achievements
    unlockAchievement('first-steps');
  }, [awardXP, unlockAchievement]);

  const completeMission = useCallback((missionId: string, xpReward: number) => {
    setStats(prev => {
      if (prev.completedMissionIds.includes(missionId)) {
        return prev;
      }
      awardXP(xpReward, 'Mission Accomplished');
      const updated = {
        ...prev,
        completedMissionIds: [...prev.completedMissionIds, missionId]
      };
      if (updated.completedMissionIds.length >= 3) {
        unlockAchievement('coding-centurion');
      }
      return updated;
    });
  }, [awardXP, unlockAchievement]);

  const recordQuizResult = useCallback((scorePercent: number, xpEarned: number) => {
    awardXP(xpEarned, 'Quiz Completed');
    setStats(prev => ({
      ...prev,
      quizzesCompleted: prev.quizzesCompleted + 1,
      perfectQuizzes: scorePercent === 100 ? prev.perfectQuizzes + 1 : prev.perfectQuizzes
    }));

    if (scorePercent === 100) {
      unlockAchievement('perfect-score');
    }
  }, [awardXP, unlockAchievement]);

  const recordOperation = useCallback((structure: string) => {
    sound.click();
    setStats(prev => {
      const explored = prev.dataStructuresExplored.includes(structure)
        ? prev.dataStructuresExplored
        : [...prev.dataStructuresExplored, structure];
      const count = prev.operationsCount + 1;

      if (structure === 'stack' && count >= 5) {
        unlockAchievement('stack-master');
      }
      if (count >= 25) {
        unlockAchievement('curious-experimenter');
      }

      return {
        ...prev,
        dataStructuresExplored: explored,
        operationsCount: count
      };
    });
  }, [unlockAchievement]);

  const recordAlgorithmTest = useCallback(() => {
    setStats(prev => {
      const nextCount = prev.algorithmsTested + 1;
      if (nextCount >= 5) {
        unlockAchievement('algorithm-apprentice');
      }
      return {
        ...prev,
        algorithmsTested: nextCount
      };
    });
  }, [unlockAchievement]);

  const resetProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY + '_achievements');
    } catch {
      // ignore
    }
    setStats(DEFAULT_STATS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    showNotification('Progress reset successfully.', 'xp');
  }, []);

  return (
    <GameContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        stats,
        achievements,
        isMuted,
        toggleMute,
        awardXP,
        completeLesson,
        completeMission,
        recordQuizResult,
        recordOperation,
        recordAlgorithmTest,
        resetProgress,
        notification,
        activeLessonId,
        setActiveLessonId,
        activePlaygroundTab,
        setActivePlaygroundTab
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
