import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { LEVEL_PATHS } from '../data/lessons';
import { Lesson, LevelPath } from '../types/game';
import { PythonCodeBlock } from '../components/common/PythonCodeBlock';
import { sound } from '../utils/sound';
import {
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Box,
  HelpCircle,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export const LearningPath: React.FC = () => {
  const {
    stats,
    activeLessonId,
    setActiveLessonId,
    completeLesson,
    setCurrentPage,
    setActivePlaygroundTab
  } = useGame();

  const allLessons = LEVEL_PATHS.flatMap(lp => lp.lessons);
  const currentLesson: Lesson =
    allLessons.find(l => l.id === activeLessonId) || allLessons[0];

  const currentLevel =
    LEVEL_PATHS.find(lp => lp.id === currentLesson.levelId) || LEVEL_PATHS[0];

  // Quick check state
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState<boolean>(false);

  const handleSelectLesson = (lesson: Lesson, level: LevelPath) => {
    if (!stats.unlockedLevelIds.includes(level.id)) {
      sound.error();
      return;
    }
    setActiveLessonId(lesson.id);
    setSelectedAnswerIndex(null);
    setHasSubmittedAnswer(false);
    sound.click();
  };

  const handleCheckAnswer = () => {
    if (selectedAnswerIndex === null) return;
    setHasSubmittedAnswer(true);

    const isCorrect = selectedAnswerIndex === currentLesson.quickCheck.correctIndex;
    if (isCorrect) {
      sound.victory();
      completeLesson(currentLesson.id, currentLesson.xpReward);
    } else {
      sound.error();
    }
  };

  const isCompleted = stats.completedLessonIds.includes(currentLesson.id);

  const jumpToPlayground = () => {
    // Map lesson to playground tab
    const tabMap: Record<string, string> = {
      'array-basics': 'array',
      'linear-search-lesson': 'array',
      'stack-mechanics': 'stack',
      'queue-mechanics': 'queue',
      'set-operations': 'set',
      'bst-traversal': 'tree',
      'graph-traversals': 'graph',
      'heap-mechanics': 'heap',
      'big-o-foundations': 'array'
    };
    const targetTab = tabMap[currentLesson.id] || 'array';
    setActivePlaygroundTab(targetTab);
    setCurrentPage('playground');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <BookOpen className="w-4 h-4" />
          <span>CURRICULUM ROADMAP</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          DSA Adventure Path
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Follow the master quest line from contiguous arrays to graphs, heaps, and asymptotic Big-O efficiency.
        </p>
      </div>

      {/* Main Grid: Left Levels Stepper (4 cols) & Right Lesson Reader (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interconnected Adventure Levels (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Quest Progression (8 Levels)
          </div>

          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {LEVEL_PATHS.map((level, idx) => {
              const isUnlocked = stats.unlockedLevelIds.includes(level.id);
              const isCurrentLevel = level.id === currentLevel.id;
              const completedCount = level.lessons.filter(l =>
                stats.completedLessonIds.includes(l.id)
              ).length;
              const allDone = completedCount === level.lessons.length;

              return (
                <div
                  key={level.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrentLevel
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/40'
                      : isUnlocked
                      ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-900 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400">
                      LEVEL 0{level.levelNumber}
                    </span>
                    {allDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : !isUnlocked ? (
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">
                        {completedCount}/{level.lessons.length}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-white mb-2">{level.name}</h3>

                  {/* Lessons list inside this level */}
                  <div className="space-y-1">
                    {level.lessons.map(lesson => {
                      const isLessonSelected = lesson.id === currentLesson.id;
                      const isLessonDone = stats.completedLessonIds.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleSelectLesson(lesson, level)}
                          disabled={!isUnlocked}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-all ${
                            isLessonSelected
                              ? 'bg-cyan-600 text-white font-semibold'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="truncate">{lesson.title}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 text-[10px] font-mono">
                            {isLessonDone && !isLessonSelected && (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            )}
                            <span>+{lesson.xpReward} XP</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Comprehensive Lesson Reader (8 Cols) */}
        <div className="lg:col-span-8 p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
          {/* Lesson Header */}
          <div className="space-y-3 pb-6 border-b border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-cyan-400 font-bold">LEVEL 0{currentLevel.levelNumber}</span>
                <span>/</span>
                <span>{currentLevel.name}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3 h-3" />
                  {currentLesson.estimatedMinutes} min
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                  Reward: +{currentLesson.xpReward} XP
                </span>
                {isCompleted && (
                  <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mastered</span>
                  </span>
                )}
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {currentLesson.title}
            </h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              {currentLesson.subtitle}
            </p>
          </div>

          {/* Core Concept Theory */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Theoretical Foundation
            </h3>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              {currentLesson.concept}
            </p>
          </div>

          {/* Key Takeaways */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Key Invariants &amp; Rules</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside leading-relaxed">
              {currentLesson.keyTakeaways.map((takeaway, i) => (
                <li key={i}>{takeaway}</li>
              ))}
            </ul>
          </div>

          {/* Python Code Example */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Python 3 Implementation
              </h3>
              <button
                onClick={jumpToPlayground}
                className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                <Box className="w-3.5 h-3.5" />
                <span>Launch in Playground</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <PythonCodeBlock
              code={currentLesson.pythonCode}
              title={`${currentLesson.title} (Python)`}
              expectedOutput={currentLesson.expectedOutput}
            />
          </div>

          {/* Step-by-Step Execution Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Code Execution Trace
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              {currentLesson.codeExplanation.map((expl, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-950/40 border border-slate-800/80">
                  {expl}
                </div>
              ))}
            </div>
          </div>

          {/* Common Pitfall / Misconception */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono">
              <AlertTriangle className="w-4 h-4" />
              <span>Common Pitfall &amp; Misconception</span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {currentLesson.commonMistakes}
            </p>
          </div>

          {/* Quick Check Challenge */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-cyan-800/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                QUICK CHECK CHALLENGE
              </span>
              <span className="text-[11px] font-mono text-cyan-300">
                +{currentLesson.xpReward} XP
              </span>
            </div>

            <div className="text-xs md:text-sm font-semibold text-white">
              {currentLesson.quickCheck.question}
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentLesson.quickCheck.options.map((opt, idx) => {
                const isSelected = selectedAnswerIndex === idx;
                const isCorrect = idx === currentLesson.quickCheck.correctIndex;

                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                if (hasSubmittedAnswer) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/60 border-emerald-600 text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-950/60 border-rose-600 text-rose-200';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-cyan-950 border-cyan-500 text-white font-semibold ring-1 ring-cyan-500';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!hasSubmittedAnswer) {
                        setSelectedAnswerIndex(idx);
                        sound.click();
                      }
                    }}
                    disabled={hasSubmittedAnswer}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {hasSubmittedAnswer && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submit Check Button */}
            {!hasSubmittedAnswer ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedAnswerIndex === null}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 rounded-xl transition-colors shadow-md"
              >
                Submit Answer
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-cyan-300 font-mono">
                  {selectedAnswerIndex === currentLesson.quickCheck.correctIndex
                    ? '🎉 Correct! Well done.'
                    : 'Not quite. Check the explanation below:'}
                </div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  {currentLesson.quickCheck.explanation}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
