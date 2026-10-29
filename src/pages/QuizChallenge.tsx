import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { QUIZ_QUESTIONS } from '../data/quizzes';
import { QuizQuestion } from '../types/game';
import { sound } from '../utils/sound';
import { PythonCodeBlock } from '../components/common/PythonCodeBlock';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const QuizChallenge: React.FC = () => {
  const { recordQuizResult, setCurrentPage } = useGame();
  const [questions] = useState<QuizQuestion[]>(QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [totalXPEarned, setTotalXPEarned] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  const currentQ = questions[currentIndex];

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctAnswerIndex;
    if (isCorrect) {
      sound.victory();
      setCorrectAnswersCount(c => c + 1);
      setTotalXPEarned(xp => xp + currentQ.xpReward);
    } else {
      sound.error();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      sound.click();
    } else {
      // Quiz finished!
      const finalScorePercent = Math.round(
        (correctAnswersCount / questions.length) * 100
      );
      const bonusXP = finalScorePercent === 100 ? 100 : 0;
      const finalXP = totalXPEarned + bonusXP;

      recordQuizResult(finalScorePercent, finalXP);
      setIsQuizCompleted(true);
      sound.victory();
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswersCount(0);
    setTotalXPEarned(0);
    setIsQuizCompleted(false);
    sound.click();
  };

  // Result Screen
  if (isQuizCompleted) {
    const scorePercent = Math.round((correctAnswersCount / questions.length) * 100);
    const isPerfect = scorePercent === 100;

    return (
      <div className="max-w-3xl mx-auto py-8 space-y-6">
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Quiz Challenge Complete!</h2>
            <p className="text-xs text-slate-400">
              {isPerfect
                ? 'Flawless Intellect! You achieved a perfect 100% score with zero mistakes.'
                : scorePercent >= 70
                ? 'Strong understanding! You have solid foundational DSA skills.'
                : 'Good effort! Review the suggested topics below to solidify your mastery.'}
            </p>
          </div>

          {/* Score breakdown stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono block">FINAL SCORE</span>
              <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                {scorePercent}%
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono block">CORRECT</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                {correctAnswersCount}/{questions.length}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono block">XP EARNED</span>
              <span className="text-2xl font-extrabold text-amber-400 font-mono">
                +{totalXPEarned + (isPerfect ? 100 : 0)}
              </span>
            </div>
          </div>

          {isPerfect && (
            <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-amber-300 text-xs font-semibold">
              🏆 +100 Bonus XP awarded for 100% Perfect Score!
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={restartQuiz}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Challenge</span>
            </button>
            <button
              onClick={() => setCurrentPage('learning-path')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Back to Learning Path</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>DSA ASSESSMENT ARENA</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Quiz Challenge
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Put your knowledge to the test with output predictions, complexity questions, bug detection, and architectural choices.
        </p>
      </div>

      {/* Question Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
        {/* Progress & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-cyan-400 font-bold">
              QUESTION {currentIndex + 1} OF {questions.length}
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-mono">{currentQ.topic}</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Score: {correctAnswersCount} correct</span>
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              +{currentQ.xpReward} XP
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-cyan-500 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Text */}
        <div className="space-y-3">
          <h2 className="text-base md:text-lg font-bold text-white leading-relaxed">
            {currentQ.question}
          </h2>

          {/* Optional Code Snippet */}
          {currentQ.codeSnippet && (
            <PythonCodeBlock
              code={currentQ.codeSnippet}
              title="Code Under Inspection"
            />
          )}
        </div>

        {/* 4 Options Grid */}
        <div className="space-y-2.5">
          {currentQ.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctAnswerIndex;

            let optionStyle = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900';
            if (isAnswerSubmitted) {
              if (isCorrect) {
                optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold ring-1 ring-emerald-500';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
              }
            } else if (isSelected) {
              optionStyle = 'bg-cyan-950 border-cyan-500 text-white font-semibold ring-1 ring-cyan-500';
            }

            return (
              <button
                key={idx}
                onClick={() => {
                  if (!isAnswerSubmitted) {
                    setSelectedOption(idx);
                    sound.click();
                  }
                }}
                disabled={isAnswerSubmitted}
                className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all flex items-center justify-between ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-400 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{optionText}</span>
                </div>

                {isAnswerSubmitted && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer: Submit or Next */}
        <div className="pt-4 border-t border-slate-800/80">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 rounded-xl transition-colors shadow-md"
            >
              Submit Answer
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                <div className="font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                  {selectedOption === currentQ.correctAnswerIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Correct Answer! (+{currentQ.xpReward} XP)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Incorrect. Review Explanation:</span>
                    </>
                  )}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Quiz Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
