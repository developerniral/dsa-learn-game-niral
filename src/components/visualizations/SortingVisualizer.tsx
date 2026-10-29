import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { AlgorithmStep } from '../../types/dsa';
import { sound } from '../../utils/sound';
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateQuickSortSteps,
  generateMergeSortSteps
} from '../../algorithms/sortingEngine';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Shuffle,
  BarChart2
} from 'lucide-react';

export type SortAlgorithm =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'quick'
  | 'merge';

interface SortAlgorithmInfo {
  id: SortAlgorithm;
  name: string;
  best: string;
  avg: string;
  worst: string;
  space: string;
  stable: boolean;
  desc: string;
}

const ALGORITHMS_INFO: Record<SortAlgorithm, SortAlgorithmInfo> = {
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    best: 'O(n) (sorted array)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1) in-place',
    stable: true,
    desc: 'Repeatedly steps through the list, compares adjacent elements and swaps them if out of order.'
  },
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    best: 'O(n²)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1) in-place',
    stable: false,
    desc: 'Divides list into sorted and unsorted segments. Repeatedly finds minimum from unsorted and places at front.'
  },
  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    best: 'O(n) (nearly sorted)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1) in-place',
    stable: true,
    desc: 'Builds sorted array one element at a time by sliding current item into its proper position.'
  },
  quick: {
    id: 'quick',
    name: 'Quick Sort',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n²) (bad pivot)',
    space: 'O(log n) call stack',
    stable: false,
    desc: 'Divide-and-conquer: selects a pivot, partitions array around pivot, and recurses on left and right.'
  },
  merge: {
    id: 'merge',
    name: 'Merge Sort',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n) auxiliary buffer',
    stable: true,
    desc: 'Divide-and-conquer: recursively halves array down to single items, then merges sorted subarrays.'
  }
};

export const SortingVisualizer: React.FC = () => {
  const { recordAlgorithmTest } = useGame();
  const [selectedAlgo, setSelectedAlgo] = useState<SortAlgorithm>('bubble');
  const [arraySize, setArraySize] = useState<number>(12);
  const [array, setArray] = useState<number[]>([45, 12, 89, 23, 67, 34, 91, 5, 52, 78, 19, 61]);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 0.5x, 1x, 2x, 4x
  const [comparisonsCount, setComparisonsCount] = useState<number>(0);
  const [swapsCount, setSwapsCount] = useState<number>(0);

  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;

  // Generate steps based on selected algorithm
  const generateStepsFor = (algo: SortAlgorithm, inputArr: number[]) => {
    switch (algo) {
      case 'bubble':
        return generateBubbleSortSteps(inputArr);
      case 'selection':
        return generateSelectionSortSteps(inputArr);
      case 'insertion':
        return generateInsertionSortSteps(inputArr);
      case 'quick':
        return generateQuickSortSteps(inputArr);
      case 'merge':
        return generateMergeSortSteps(inputArr);
    }
  };

  // Re-generate steps on array or algorithm change
  useEffect(() => {
    setIsPlaying(false);
    const newSteps = generateStepsFor(selectedAlgo, array);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setComparisonsCount(0);
    setSwapsCount(0);
  }, [selectedAlgo, array]);

  // Stepper playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const baseDelay = 450;
    const interval = baseDelay / speed;

    const timer = setInterval(() => {
      setCurrentStepIndex(curr => {
        if (curr >= steps.length - 1) {
          setIsPlaying(false);
          sound.victory();
          recordAlgorithmTest();
          return curr;
        }

        const next = curr + 1;
        const nextStep = steps[next];
        if (nextStep) {
          if (nextStep.comparingIndices && nextStep.comparingIndices.length > 0) {
            setComparisonsCount(c => c + 1);
            sound.compare();
          }
          if (nextStep.swappingIndices && nextStep.swappingIndices.length > 0) {
            setSwapsCount(s => s + 1);
            sound.swap();
          }
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, steps, speed, recordAlgorithmTest]);

  // Single step forward
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      const next = currentStepIndex + 1;
      const nextStep = steps[next];
      if (nextStep.comparingIndices?.length) {
        setComparisonsCount(c => c + 1);
        sound.compare();
      }
      if (nextStep.swappingIndices?.length) {
        setSwapsCount(s => s + 1);
        sound.swap();
      }
      setCurrentStepIndex(next);
    }
  };

  const handleRandomize = () => {
    setIsPlaying(false);
    const newArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 88) + 10);
    setArray(newArr);
    sound.click();
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setComparisonsCount(0);
    setSwapsCount(0);
    sound.click();
  };

  const currentStep = steps[currentStepIndex] || {
    array,
    message: 'Ready to run.'
  };

  const currentDisplayArray = currentStep.array || array;
  const maxVal = Math.max(...currentDisplayArray, 100);
  const info = ALGORITHMS_INFO[selectedAlgo];

  return (
    <div className="space-y-6">
      {/* Algorithm Selector Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl">
        {(Object.keys(ALGORITHMS_INFO) as SortAlgorithm[]).map(algoKey => {
          const isSelected = selectedAlgo === algoKey;
          return (
            <button
              key={algoKey}
              onClick={() => setSelectedAlgo(algoKey)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                isSelected
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {ALGORITHMS_INFO[algoKey].name}
            </button>
          );
        })}
      </div>

      {/* Visual Chart Stage */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        {/* Stage Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-slate-400">
              EXECUTION TRACE · STEP {currentStepIndex + 1}/{steps.length}
            </span>
            <span className="text-xs font-mono text-cyan-400">
              Comparisons: <strong className="tabular-nums">{comparisonsCount}</strong>
            </span>
            <span className="text-xs font-mono text-purple-400">
              Swaps/Moves: <strong className="tabular-nums">{swapsCount}</strong>
            </span>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span>Speed:</span>
            {[0.5, 1, 2, 4].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  speed === s
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Vertical Bar Chart */}
        <div className="h-64 w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-end justify-center gap-1.5 sm:gap-2.5 overflow-x-auto">
          {currentDisplayArray.map((val, idx) => {
            const heightPercent = Math.max(12, Math.round((val / maxVal) * 92));
            const isComparing = currentStep.comparingIndices?.includes(idx);
            const isSwapping = currentStep.swappingIndices?.includes(idx);
            const isSorted = currentStep.sortedIndices?.includes(idx);
            const isPivot = currentStep.pivotIndex === idx;

            let barColor = 'bg-slate-700/80 border-slate-600 text-slate-300';
            if (isSwapping) {
              barColor = 'bg-rose-500 border-rose-400 text-white animate-pulse';
            } else if (isComparing) {
              barColor = 'bg-amber-400 border-amber-300 text-slate-950 font-bold';
            } else if (isPivot) {
              barColor = 'bg-purple-500 border-purple-400 text-white';
            } else if (isSorted) {
              barColor = 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold';
            }

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end max-w-[48px] min-w-[20px] transition-all duration-150"
                style={{ height: '100%' }}
              >
                <div
                  className={`w-full rounded-t-md border flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold transition-all duration-150 ${barColor}`}
                  style={{ height: `${heightPercent}%` }}
                >
                  <span className="hidden sm:inline select-none">{val}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 mt-1 select-none">
                  {idx}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar & Status Message */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-cyan-500 h-full transition-all duration-150"
            style={{
              width: `${Math.round(((currentStepIndex + 1) / (steps.length || 1)) * 100)}%`
            }}
          />
        </div>

        <div className="text-xs font-mono text-cyan-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          {currentStep.message}
        </div>
      </div>

      {/* Control Strip & Complexity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Playback Controls */}
        <div className="md:col-span-6 p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-md shadow-cyan-900/30"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Start Animation'}</span>
            </button>

            <button
              onClick={handleStepForward}
              disabled={isPlaying || currentStepIndex >= steps.length - 1}
              className="px-3 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1"
              title="Step Forward"
            >
              <SkipForward className="w-4 h-4" />
              <span>Step</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleRandomize}
              className="px-3 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
              title="Generate New Random Array"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Input Size: {arraySize}</span>
            <input
              type="range"
              min="6"
              max="20"
              value={arraySize}
              onChange={e => {
                const sz = parseInt(e.target.value, 10);
                setArraySize(sz);
                const newArr = Array.from({ length: sz }, () => Math.floor(Math.random() * 88) + 10);
                setArray(newArr);
              }}
              className="w-40 accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Algorithm Complexity Spec */}
        <div className="md:col-span-6 p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-sans">{info.name} Specs</span>
            <span className="text-[11px] font-mono text-cyan-400">{info.stable ? 'Stable Sort' : 'Unstable Sort'}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">BEST CASE</span>
              <span className="text-emerald-400 font-semibold">{info.best}</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">AVERAGE CASE</span>
              <span className="text-cyan-400 font-semibold">{info.avg}</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">WORST CASE</span>
              <span className="text-rose-400 font-semibold">{info.worst}</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">SPACE COMPLEXITY</span>
              <span className="text-purple-400 font-semibold">{info.space}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
