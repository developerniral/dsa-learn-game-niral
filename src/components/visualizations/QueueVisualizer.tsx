import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/sound';
import { OperationLog } from '../../types/dsa';
import { ArrowRight, LogOut, LogIn, Eye, Trash2 } from 'lucide-react';

export const QueueVisualizer: React.FC = () => {
  const { recordOperation } = useGame();
  const [queue, setQueue] = useState<string[]>(['Job_#1', 'Job_#2', 'Job_#3', 'Job_#4']);
  const [inputVal, setInputVal] = useState<string>('Job_#5');
  const [peekHighlight, setPeekHighlight] = useState<boolean>(false);
  const [log, setLog] = useState<OperationLog | null>({
    id: 'init',
    operation: 'Queue (FIFO) Initialized',
    details: 'Queue active with 4 items. First element enqueued is the first to be dequeued.',
    timeComplexity: 'O(1) enqueue/dequeue via collections.deque',
    spaceComplexity: 'O(N)',
    timestamp: Date.now(),
    status: 'info'
  });

  const handleEnqueue = () => {
    if (!inputVal.trim()) return;
    if (queue.length >= 8) {
      sound.error();
      setLog({
        id: String(Date.now()),
        operation: 'Queue Full',
        details: 'Visual pipeline capacity reached (8 elements max).',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(N)',
        timestamp: Date.now(),
        status: 'warning'
      });
      return;
    }

    const item = inputVal.trim();
    setQueue(prev => [...prev, item]);
    sound.add();
    recordOperation('queue');
    setPeekHighlight(false);

    setLog({
      id: String(Date.now()),
      operation: `enqueue("${item}") / append()`,
      details: `Enqueued "${item}" at the REAR. Queue length is now ${queue.length + 1}.`,
      timeComplexity: 'O(1) Constant',
      spaceComplexity: 'O(1)',
      timestamp: Date.now(),
      status: 'success'
    });

    const nextNum = parseInt(item.replace(/\D/g, '') || '0', 10) + 1;
    setInputVal(`Job_#${nextNum}`);
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      sound.error();
      setLog({
        id: String(Date.now()),
        operation: 'Queue Underflow',
        details: 'Cannot dequeue from an empty queue.',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        timestamp: Date.now(),
        status: 'error'
      });
      return;
    }

    const removed = queue[0];
    setQueue(prev => prev.slice(1));
    sound.remove();
    recordOperation('queue');
    setPeekHighlight(false);

    setLog({
      id: String(Date.now()),
      operation: `dequeue() -> "${removed}" / popleft()`,
      details: `Removed "${removed}" from the FRONT. Notice the front pointer moves forward.`,
      timeComplexity: 'O(1) with deque (vs O(n) with list.pop(0))',
      spaceComplexity: 'O(1)',
      timestamp: Date.now(),
      status: 'warning'
    });
  };

  const handlePeek = () => {
    if (queue.length === 0) return;
    sound.compare();
    recordOperation('queue');
    setPeekHighlight(true);
    const frontItem = queue[0];

    setLog({
      id: String(Date.now()),
      operation: `peek() -> "${frontItem}" / queue[0]`,
      details: `Next item scheduled for processing is "${frontItem}" at the FRONT.`,
      timeComplexity: 'O(1) Constant',
      spaceComplexity: 'O(1)',
      timestamp: Date.now(),
      status: 'info'
    });
  };

  const handleClear = () => {
    setQueue([]);
    sound.remove();
    setPeekHighlight(false);
    setLog({
      id: String(Date.now()),
      operation: 'queue.clear()',
      details: 'Queue flushed.',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      timestamp: Date.now(),
      status: 'info'
    });
  };

  return (
    <div className="space-y-6">
      {/* Horizontal Pipeline */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">
            FIFO PIPELINE (FIRST IN, FIRST OUT)
          </div>
          <div className="text-xs font-mono text-emerald-400 font-semibold">
            Count: {queue.length}
          </div>
        </div>

        {/* Conduit */}
        <div className="relative border-y-2 border-dashed border-slate-700 bg-slate-950/60 rounded-xl p-4 min-h-[140px] flex items-center justify-between overflow-x-auto">
          {/* Dequeue Exit Indicator */}
          <div className="shrink-0 flex flex-col items-center mr-4 text-emerald-400">
            <span className="text-[10px] font-mono font-bold">FRONT (EXIT)</span>
            <LogOut className="w-5 h-5 mt-1 animate-pulse" />
          </div>

          {/* Queue elements from Front (index 0) to Rear (last index) */}
          <div className="flex-1 flex items-center gap-3 overflow-x-auto py-2 px-2">
            {queue.length === 0 ? (
              <div className="w-full text-center text-slate-600 font-mono text-xs">
                Queue is empty. New items arrive at the REAR.
              </div>
            ) : (
              queue.map((item, idx) => {
                const isFront = idx === 0;
                const isRear = idx === queue.length - 1;

                return (
                  <div key={`${idx}-${item}`} className="flex flex-col items-center shrink-0">
                    <div
                      className={`px-4 py-3 rounded-xl border font-mono text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                        isFront
                          ? peekHighlight
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 shadow-lg'
                            : 'bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-md shadow-emerald-950'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span>{item}</span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-mono text-slate-500">
                      {isFront && <span className="text-emerald-400 font-bold">Front[0]</span>}
                      {isRear && !isFront && <span className="text-cyan-400 font-bold">Rear[{idx}]</span>}
                      {!isFront && !isRear && <span>[{idx}]</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Enqueue Entry Indicator */}
          <div className="shrink-0 flex flex-col items-center ml-4 text-cyan-400">
            <span className="text-[10px] font-mono font-bold">REAR (ENTRY)</span>
            <LogIn className="w-5 h-5 mt-1 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Items exit at Front (popleft)</span>
          <span>Items enter at Rear (append)</span>
        </div>
      </div>

      {/* Controls & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Controls */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-300">Queue Controls</div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="e.g. Job_#6"
              className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleEnqueue}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Enqueue (O(1))</span>
            </button>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleDequeue}
              disabled={queue.length === 0}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-900/60 disabled:opacity-40 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Dequeue (O(1))</span>
            </button>
            <button
              onClick={handlePeek}
              disabled={queue.length === 0}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-900/60 disabled:opacity-40 rounded-lg transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Peek Front</span>
            </button>
            <button
              onClick={handleClear}
              className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Telemetry Log */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Operation Details</span>
              {log && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {log.timeComplexity}
                </span>
              )}
            </div>
            {log && <div className="text-xs font-mono text-cyan-300 mb-1">{log.operation}</div>}
            {log && <div className="text-[11px] text-slate-400">{log.details}</div>}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-sans">
            Python Tip: Never use `list.pop(0)` for queues in real projects. It forces O(n) element shifts. Use `collections.deque.popleft()` for true O(1).
          </div>
        </div>
      </div>
    </div>
  );
};
