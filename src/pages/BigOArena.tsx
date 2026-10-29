import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import {
  COMPLEXITY_CLASSES,
  CODE_CHALLENGES,
  ComplexityClass
} from '../data/bigOData';
import { BigOChart } from '../components/visualizations/BigOChart';
import { PythonCodeBlock } from '../components/common/PythonCodeBlock';
import { sound } from '../utils/sound';
import {
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const BigOArena: React.FC = () => {
  const { awardXP } = useGame();
  const [n, setN] = useState<number>(32);
  const [classAId, setClassAId] = useState<string>('o-n-log-n');
  const [classBId, setClassBId] = useState<string>('o-n2');

  // Classification Practice Game State
  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number>(0);
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const classA = COMPLEXITY_CLASSES.find(c => c.id === classAId) || COMPLEXITY_CLASSES[2];
  const classB = COMPLEXITY_CLASSES.find(c => c.id === classBId) || COMPLEXITY_CLASSES[4];

  const opsA = classA.calculateOps(n);
  const opsB = classB.calculateOps(n);

  const currentChallenge = CODE_CHALLENGES[activeChallengeIdx];

  const handleGuess = (guessSymbol: string) => {
    if (isAnswered) return;
    setSelectedGuess(guessSymbol);
    setIsAnswered(true);

    const isCorrect = guessSymbol === currentChallenge.correctClass;
    if (isCorrect) {
      sound.victory();
      awardXP(30, 'Complexity Classified');
    } else {
      sound.error();
    }
  };

  const handleNextChallenge = () => {
    setSelectedGuess(null);
    setIsAnswered(false);
    setActiveChallengeIdx(idx => (idx + 1) % CODE_CHALLENGES.length);
    sound.click();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <Activity className="w-4 h-4" />
          <span>EFFICIENCY &amp; ASYMPTOTIC SCALING</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Big O Arena
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Compare theoretical operation counts across growth orders. Big O measures how steps scale with input size N, not clock seconds.
        </p>
      </div>

      {/* Interactive Complexity Comparator */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono text-slate-400">
            HEAD-TO-HEAD COMPLEXITY COMPARATOR
          </div>

          {/* Slider for N */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Input Size:</span>
            <span className="text-cyan-400 font-bold text-sm tabular-nums">N = {n}</span>
            <input
              type="range"
              min="2"
              max="64"
              value={n}
              onChange={e => setN(parseInt(e.target.value, 10))}
              className="w-48 accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Dual Selectors & Numerical Operations Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Class A Card */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">COMPLEXITY CLASS 1</span>
              <select
                value={classAId}
                onChange={e => setClassAId(e.target.value)}
                className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-900 border border-slate-700 rounded text-cyan-300"
              >
                {COMPLEXITY_CLASSES.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.symbol} · {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-2xl font-black font-mono" style={{ color: classA.color }}>
                  {classA.symbol}
                </span>
                <span className="text-xs text-slate-400 ml-2">({classA.nickname})</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-white tabular-nums">
                  {opsA >= 10000 ? `${(opsA / 1000).toFixed(0)}k` : opsA}
                </span>
                <span className="text-[11px] text-slate-500 font-mono block">operations at N={n}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{classA.description}</p>
          </div>

          {/* Class B Card */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">COMPLEXITY CLASS 2</span>
              <select
                value={classBId}
                onChange={e => setClassBId(e.target.value)}
                className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-900 border border-slate-700 rounded text-purple-300"
              >
                {COMPLEXITY_CLASSES.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.symbol} · {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-2xl font-black font-mono" style={{ color: classB.color }}>
                  {classB.symbol}
                </span>
                <span className="text-xs text-slate-400 ml-2">({classB.nickname})</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-white tabular-nums">
                  {opsB >= 10000 ? `${(opsB / 1000).toFixed(0)}k` : opsB}
                </span>
                <span className="text-[11px] text-slate-500 font-mono block">operations at N={n}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{classB.description}</p>
          </div>
        </div>

        {/* Multiplier Verdict Banner */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="text-slate-300">
            At N={n}: <strong style={{ color: classA.color }}>{classA.symbol}</strong> uses {opsA} ops vs{' '}
            <strong style={{ color: classB.color }}>{classB.symbol}</strong> using {opsB} ops.
          </div>
          <div className="text-cyan-400 font-bold">
            {opsA === opsB
              ? 'Identical operation volume at this input size'
              : opsA < opsB
              ? `${(opsB / Math.max(1, opsA)).toFixed(1)}x fewer operations with ${classA.symbol}`
              : `${(opsA / Math.max(1, opsB)).toFixed(1)}x fewer operations with ${classB.symbol}`}
          </div>
        </div>

        {/* Growth Curves SVG Plot */}
        <BigOChart n={n} selectedClasses={[classAId, classBId]} />
      </div>

      {/* Code Snippet Classification Practice Game */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              BIG O CLASSIFICATION CHALLENGE
            </span>
            <h2 className="text-lg font-bold text-white">
              Challenge {activeChallengeIdx + 1} of {CODE_CHALLENGES.length}: {currentChallenge.title}
            </h2>
          </div>

          <button
            onClick={handleNextChallenge}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <span>Next Snippet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Code Snippet */}
        <PythonCodeBlock
          code={currentChallenge.code}
          title={`Snippet Analysis: ${currentChallenge.title}`}
          notes={`Loop pattern: ${currentChallenge.loopPattern}`}
        />

        {/* Option Buttons */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-300">
            What is the asymptotic time complexity of this code?
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'].map(sym => {
              const isSelected = selectedGuess === sym;
              const isCorrect = sym === currentChallenge.correctClass;

              let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                }
              }

              return (
                <button
                  key={sym}
                  onClick={() => handleGuess(sym)}
                  disabled={isAnswered}
                  className={`p-3 rounded-xl border font-mono text-xs font-bold transition-all text-center ${btnStyle}`}
                >
                  {sym}
                </button>
              );
            })}
          </div>

          {/* Feedback Explanation */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 animate-fade-in">
              <div className="font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                {selectedGuess === currentChallenge.correctClass ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Correct! Time Complexity: {currentChallenge.correctClass}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Incorrect. The answer is {currentChallenge.correctClass}.</span>
                  </>
                )}
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {currentChallenge.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
