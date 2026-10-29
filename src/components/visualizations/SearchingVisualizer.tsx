import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { AlgorithmStep } from '../../types/dsa';
import { sound } from '../../utils/sound';
import {
  generateLinearSearchSteps,
  generateBinarySearchSteps
} from '../../algorithms/searchingEngine';
import { Play, Pause, RotateCcw, SkipForward, Search } from 'lucide-react';

export const SearchingVisualizer: React.FC = () => {
  const { recordAlgorithmTest } = useGame();
  const [searchType, setSearchType] = useState<'linear' | 'binary'>('binary');
  const [target, setTarget] = useState<number>(47);
  // Sorted array for binary search demonstration
  const [sortedArray] = useState<number[]>([
    5, 12, 19, 23, 31, 38, 47, 56, 64, 72, 85, 93, 108, 120, 135
  ]);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [comparisonsCount, setComparisonsCount] = useState<number>(0);

  useEffect(() => {
    setIsPlaying(false);
    const newSteps =
      searchType === 'binary'
        ? generateBinarySearchSteps(sortedArray, target)
        : generateLinearSearchSteps(sortedArray, target);

    setSteps(newSteps);
    setStepIndex(0);
    setComparisonsCount(0);
  }, [searchType, target, sortedArray]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setStepIndex(curr => {
        if (curr >= steps.length - 1) {
          setIsPlaying(false);
          sound.victory();
          recordAlgorithmTest();
          return curr;
        }
        const next = curr + 1;
        if (steps[next]?.comparingIndices?.length) {
          setComparisonsCount(c => c + 1);
          sound.compare();
        }
        return next;
      });
    }, 700);

    return () => clearInterval(timer);
  }, [isPlaying, steps, recordAlgorithmTest]);

  const handleStepForward = () => {
    if (stepIndex < steps.length - 1) {
      const next = stepIndex + 1;
      if (steps[next]?.comparingIndices?.length) {
        setComparisonsCount(c => c + 1);
        sound.compare();
      }
      setStepIndex(next);
    }
  };

  const currentStep = steps[stepIndex] || {
    array: sortedArray,
    message: 'Ready.'
  };

  return (
    <div className="space-y-6">
      {/* Strategy Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchType('binary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              searchType === 'binary'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Binary Search (O(log n))
          </button>
          <button
            onClick={() => setSearchType('linear')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              searchType === 'linear'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Linear Search (O(n))
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Target:</span>
          <input
            type="number"
            value={target}
            onChange={e => setTarget(parseInt(e.target.value, 10) || 0)}
            className="w-20 px-2 py-1 text-xs font-mono bg-slate-950 border border-slate-800 rounded text-cyan-300 focus:outline-none"
          />
        </div>
      </div>

      {/* Visual Search Runway */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            SEARCH RUNWAY · {searchType.toUpperCase()} SEARCH
          </span>
          <span className="text-cyan-400">
            Comparisons Evaluated: <strong className="tabular-nums">{comparisonsCount}</strong>
          </span>
        </div>

        {/* Pointer Legend for Binary Search */}
        {searchType === 'binary' && (
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Left Pointer
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Midpoint (mid)
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Right Pointer
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Target Match
            </span>
          </div>
        )}

        {/* Array Cells Runway */}
        <div className="overflow-x-auto pb-4">
          <div className="flex items-center gap-2 min-w-max py-4">
            {sortedArray.map((val, idx) => {
              const isMid = currentStep.midPointer === idx;
              const isLeft = currentStep.leftPointer === idx;
              const isRight = currentStep.rightPointer === idx;
              const isComparing = currentStep.comparingIndices?.includes(idx);
              const isTargetFound = currentStep.targetIndex === idx;

              // In binary search, dim cells outside active range [left..right]
              const isOutsideRange =
                searchType === 'binary' &&
                currentStep.leftPointer !== undefined &&
                currentStep.rightPointer !== undefined &&
                (idx < currentStep.leftPointer || idx > currentStep.rightPointer);

              return (
                <div key={idx} className="flex flex-col items-center">
                  {/* Top Pointer Indicator */}
                  <div className="h-6 flex items-center justify-center text-[11px] font-mono font-bold">
                    {isTargetFound && <span className="text-emerald-400">★ MATCH</span>}
                    {!isTargetFound && isMid && <span className="text-amber-400">MID</span>}
                    {!isTargetFound && !isMid && isLeft && isRight && <span className="text-cyan-400">L+R</span>}
                    {!isTargetFound && !isMid && isLeft && !isRight && <span className="text-blue-400">L</span>}
                    {!isTargetFound && !isMid && !isLeft && isRight && <span className="text-purple-400">R</span>}
                  </div>

                  {/* Cell Box */}
                  <div
                    onClick={() => setTarget(val)}
                    className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center font-mono font-bold text-sm cursor-pointer transition-all duration-200 ${
                      isTargetFound
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400'
                        : isMid
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400'
                        : isComparing
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : isOutsideRange
                        ? 'opacity-25 bg-slate-900 border-slate-800 text-slate-600'
                        : 'bg-slate-800/80 border-slate-700 text-white hover:border-slate-500'
                    }`}
                  >
                    <span>{val}</span>
                  </div>

                  {/* Index Label */}
                  <span className="text-[10px] font-mono text-slate-500 mt-1">
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          {currentStep.message}
        </div>
      </div>

      {/* Controls Strip */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isPlaying ? 'Pause' : 'Play Search'}</span>
        </button>

        <button
          onClick={handleStepForward}
          disabled={isPlaying || stepIndex >= steps.length - 1}
          className="px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1"
        >
          <SkipForward className="w-4 h-4" />
          <span>Step</span>
        </button>

        <button
          onClick={() => {
            setIsPlaying(false);
            setStepIndex(0);
            setComparisonsCount(0);
          }}
          className="px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="text-xs text-slate-500 ml-auto">
          Tip: Click on any cell above to set it as the target search value.
        </div>
      </div>
    </div>
  );
};
