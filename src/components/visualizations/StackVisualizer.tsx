import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/sound';
import { OperationLog } from '../../types/dsa';
import { ArrowUp, ArrowDown, Eye, Trash2, RotateCcw } from 'lucide-react';

export const StackVisualizer: React.FC = () => {
  const { recordOperation } = useGame();
  const [stack, setStack] = useState<string[]>(['Token_A', 'Token_B', 'Token_C']);
  const [inputVal, setInputVal] = useState<string>('Token_D');
  const [peekHighlight, setPeekHighlight] = useState<boolean>(false);
  const [log, setLog] = useState<OperationLog | null>({
    id: 'init',
    operation: 'Stack Ready',
    details: 'Stack initialized with 3 frames. Last-In, First-Out (LIFO) discipline active.',
    timeComplexity: 'O(1) push/pop/peek',
    spaceComplexity: 'O(N)',
    timestamp: Date.now(),
    status: 'info'
  });

  const handlePush = () => {
    if (!inputVal.trim()) return;
    if (stack.length >= 8) {
      sound.error();
      setLog({
        id: String(Date.now()),
        operation: 'Stack Overflow Warning',
        details: 'Visual container limit reached (max 8 items) to maintain viewport clarity.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(N)',
        timestamp: Date.now(),
        status: 'warning'
      });
      return;
    }

    const nextVal = inputVal.trim();
    setStack(prev => [...prev, nextVal]);
    sound.add();
    recordOperation('stack');
    setPeekHighlight(false);

    setLog({
      id: String(Date.now()),
      operation: `push("${nextVal}")`,
      details: `Pushed "${nextVal}" onto the top of the stack. New stack depth is ${stack.length + 1}.`,
      timeComplexity: 'O(1) Constant',
      spaceComplexity: 'O(1) aux',
      timestamp: Date.now(),
      status: 'success'
    });

    setInputVal(`Token_${String.fromCharCode(65 + stack.length + 1)}`);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      sound.error();
      setLog({
        id: String(Date.now()),
        operation: 'Stack Underflow Exception',
        details: 'Cannot pop from an empty stack! In Python, calling [].pop() raises IndexError.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        timestamp: Date.now(),
        status: 'error'
      });
      return;
    }

    const popped = stack[stack.length - 1];
    setStack(prev => prev.slice(0, -1));
    sound.remove();
    recordOperation('stack');
    setPeekHighlight(false);

    setLog({
      id: String(Date.now()),
      operation: `pop() -> "${popped}"`,
      details: `Removed most recently added item "${popped}" from the top of the stack.`,
      timeComplexity: 'O(1) Constant',
      spaceComplexity: 'O(1)',
      timestamp: Date.now(),
      status: 'warning'
    });
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      sound.error();
      return;
    }
    const top = stack[stack.length - 1];
    sound.compare();
    recordOperation('stack');
    setPeekHighlight(true);

    setLog({
      id: String(Date.now()),
      operation: `peek() / stack[-1] -> "${top}"`,
      details: `Inspected top element "${top}" without removing it from memory.`,
      timeComplexity: 'O(1) Constant',
      spaceComplexity: 'O(1)',
      timestamp: Date.now(),
      status: 'info'
    });
  };

  const handleClear = () => {
    setStack([]);
    sound.remove();
    setPeekHighlight(false);
    setLog({
      id: String(Date.now()),
      operation: 'stack.clear()',
      details: 'Stack reset to empty state.',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      timestamp: Date.now(),
      status: 'info'
    });
  };

  return (
    <div className="space-y-6">
      {/* Visual Vertical Stack Tank */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left: Vertical Stack Tube */}
        <div className="md:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-end min-h-[380px] shadow-xl relative overflow-hidden">
          <div className="absolute top-4 left-4 text-xs font-mono text-slate-400">
            LIFO VERTICAL CONTAINER
          </div>

          <div className="absolute top-4 right-4 text-xs font-mono text-cyan-400 font-semibold">
            Depth: {stack.length}
          </div>

          {/* Vertical Tube */}
          <div className="w-56 border-x-2 border-b-2 border-slate-700 bg-slate-950/60 rounded-b-2xl p-3 flex flex-col-reverse gap-2 min-h-[260px] justify-start shadow-inner">
            {stack.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600 font-mono text-xs text-center px-4">
                Empty Stack (Underflow state)
              </div>
            ) : (
              stack.map((item, index) => {
                const isTop = index === stack.length - 1;
                return (
                  <div
                    key={`${index}-${item}`}
                    className={`relative w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold flex items-center justify-between border transition-all duration-300 ${
                      isTop
                        ? peekHighlight
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 shadow-lg'
                          : 'bg-purple-600/30 border-purple-400 text-purple-200 shadow-md shadow-purple-900/30'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span>{item}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      depth {index}
                    </span>

                    {/* Top Pointer Badge */}
                    {isTop && (
                      <div className="absolute -left-16 flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-400">
                        <span>TOP</span>
                        <span>→</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-3 text-[11px] font-mono text-slate-500">
            ▲ Push and Pop occur exclusively at the TOP
          </div>
        </div>

        {/* Right: Controls & Call Stack Scenario */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          {/* Controls */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Stack Operations (O(1))
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Item label e.g. View_Cart"
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handlePush}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors shadow-sm"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Push (O(1))</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={handlePop}
                disabled={stack.length === 0}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/60 disabled:opacity-40 rounded-lg transition-colors"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                <span>Pop (O(1))</span>
              </button>
              <button
                onClick={handlePeek}
                disabled={stack.length === 0}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-900/60 disabled:opacity-40 rounded-lg transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Peek (O(1))</span>
              </button>
              <button
                onClick={handleClear}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Operational Log & Python Mapping */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Live Mechanics</span>
              {log && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  {log.timeComplexity}
                </span>
              )}
            </div>

            {log && (
              <div className="text-xs font-mono text-cyan-300">{log.operation}</div>
            )}
            {log && (
              <div className="text-[11px] text-slate-400 leading-relaxed">{log.details}</div>
            )}

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-sans">
              Real-World Use Cases: Browser History back navigation, Undo/Redo commands, syntax parsing, and the OS execution call stack.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
