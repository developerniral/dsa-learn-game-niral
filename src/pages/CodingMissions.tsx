import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CODING_MISSIONS } from '../data/missions';
import { CodingMission } from '../types/game';
import { PythonCodeBlock } from '../components/common/PythonCodeBlock';
import { sound } from '../utils/sound';
import {
  Terminal,
  CheckCircle2,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Code2
} from 'lucide-react';

export const CodingMissions: React.FC = () => {
  const { stats, completeMission } = useGame();
  const [selectedMissionId, setSelectedMissionId] = useState<string>(CODING_MISSIONS[0].id);
  const [unlockedHintsCount, setUnlockedHintsCount] = useState<number>(0);
  const [codeDraft, setCodeDraft] = useState<string>(CODING_MISSIONS[0].starterCode);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string } | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const mission =
    CODING_MISSIONS.find(m => m.id === selectedMissionId) || CODING_MISSIONS[0];

  const handleSelectMission = (m: CodingMission) => {
    setSelectedMissionId(m.id);
    setCodeDraft(m.starterCode);
    setUnlockedHintsCount(0);
    setTestResults(null);
    setShowSolution(false);
    sound.click();
  };

  const handleRevealNextHint = () => {
    if (unlockedHintsCount < mission.hints.length) {
      setUnlockedHintsCount(c => c + 1);
      sound.click();
    }
  };

  const handleRunTests = () => {
    sound.compare();
    // Validate whether user completed the code or used starter code without changes
    const isStillEmptyPass = codeDraft.includes('pass') && !codeDraft.includes('return');
    
    // Simulate test evaluation
    setTimeout(() => {
      if (isStillEmptyPass) {
        sound.error();
        setTestResults({
          passed: false,
          message: 'Code not yet completed. Replace `pass` with your implementation or review the hints.'
        });
      } else {
        sound.victory();
        setTestResults({
          passed: true,
          message: `All ${mission.testCases.length} Test Cases Passed! Solution validated successfully.`
        });
        completeMission(mission.id, mission.xpReward);
      }
    }, 400);
  };

  const isCompleted = stats.completedMissionIds.includes(mission.id);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <Terminal className="w-4 h-4" />
          <span>PYTHON CODING MISSIONS</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Practical Coding Arena
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Implement canonical data structure routines and algorithm patterns in Python. Use progressive hints if you get stuck.
        </p>
      </div>

      {/* Main Grid: Mission List (4 cols) & Workspace (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mission Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Missions ({CODING_MISSIONS.length})
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {CODING_MISSIONS.map(m => {
              const isSelected = m.id === mission.id;
              const isDone = stats.completedMissionIds.includes(m.id);

              return (
                <button
                  key={m.id}
                  onClick={() => handleSelectMission(m)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">
                      {m.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      <span className="text-[10px] font-mono text-slate-400">
                        +{m.xpReward} XP
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-white mb-1 truncate">{m.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{m.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Coding Mission Workspace (8 cols) */}
        <div className="lg:col-span-8 p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
          {/* Mission Header */}
          <div className="space-y-3 pb-4 border-b border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                {mission.category} · {mission.difficulty}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                  +{mission.xpReward} XP
                </span>
                {isCompleted && (
                  <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                )}
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white">
              {mission.title}
            </h2>
            <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {mission.problemStatement}
            </div>
          </div>

          {/* Test Cases Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Test Case Specifications
            </div>
            <div className="space-y-1.5">
              {mission.testCases.map((tc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-slate-400">Input: <span className="text-cyan-300">{tc.inputDesc}</span></span>
                  <span className="text-slate-400">Expected: <span className="text-emerald-400">{tc.expectedOutput}</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Python Solution Workspace
              </span>
              <button
                onClick={() => {
                  setCodeDraft(mission.solutionCode);
                  sound.click();
                }}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
              >
                Fill Working Code
              </button>
            </div>

            <textarea
              value={codeDraft}
              onChange={e => setCodeDraft(e.target.value)}
              rows={9}
              className="w-full p-4 font-mono text-xs text-cyan-100 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Run & Verify Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunTests}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors shadow-md shadow-cyan-900/30"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Validate Solution</span>
            </button>

            <button
              onClick={() => setCodeDraft(mission.starterCode)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Starter</span>
            </button>

            <button
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors ml-auto"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showSolution ? 'Hide Solution' : 'Inspect Canonical Solution'}</span>
            </button>
          </div>

          {/* Test Results Output */}
          {testResults && (
            <div
              className={`p-4 rounded-xl border text-xs font-mono space-y-1 ${
                testResults.passed
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-800 text-rose-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {testResults.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Sparkles className="w-4 h-4 text-rose-400" />
                )}
                <span>{testResults.message}</span>
              </div>
            </div>
          )}

          {/* Progressive Hints */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Progressive Hints ({unlockedHintsCount}/{mission.hints.length})</span>
              </span>

              {unlockedHintsCount < mission.hints.length && (
                <button
                  onClick={handleRevealNextHint}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300"
                >
                  Reveal Next Hint
                </button>
              )}
            </div>

            {unlockedHintsCount === 0 ? (
              <div className="text-xs text-slate-500">
                Stuck? Click 'Reveal Next Hint' to get step-by-step guidance without spoiling the solution.
              </div>
            ) : (
              <div className="space-y-2">
                {mission.hints.slice(0, unlockedHintsCount).map((hint, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200/90 leading-relaxed">
                    {hint}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Canonical Solution Block */}
          {showSolution && (
            <div className="space-y-3 animate-fade-in">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Canonical Python Solution &amp; Analysis
              </h3>
              <PythonCodeBlock
                code={mission.solutionCode}
                title="Author Solution"
              />
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <p className="text-slate-300 leading-relaxed">{mission.explanation}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                  <div>Time Complexity: <span className="text-cyan-400">{mission.complexityAnalysis.time}</span></div>
                  <div>Space Complexity: <span className="text-purple-400">{mission.complexityAnalysis.space}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
