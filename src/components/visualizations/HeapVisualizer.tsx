import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/sound';
import { Plus, ArrowDown, RotateCcw, Shuffle } from 'lucide-react';

export const HeapVisualizer: React.FC = () => {
  const { recordOperation } = useGame();
  const [heap, setHeap] = useState<number[]>([10, 25, 18, 42, 35, 60, 29]);
  const [heapType, setHeapType] = useState<'min' | 'max'>('min');
  const [inputVal, setInputVal] = useState<string>('12');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Min-Heap initialized: Parent index (i-1)//2 is always <= Children (2i+1, 2i+2).'
  );

  // Sift Up insertion
  const handleInsert = () => {
    const val = parseInt(inputVal, 10);
    if (isNaN(val)) return;
    if (heap.length >= 15) {
      sound.error();
      setStatusMessage('Maximum heap capacity (15 nodes) reached for visual balance.');
      return;
    }

    sound.add();
    recordOperation('heap');
    const newHeap = [...heap, val];
    let curr = newHeap.length - 1;

    // Sift up
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      const shouldSwap =
        heapType === 'min'
          ? newHeap[curr] < newHeap[parent]
          : newHeap[curr] > newHeap[parent];

      if (shouldSwap) {
        const temp = newHeap[curr];
        newHeap[curr] = newHeap[parent];
        newHeap[parent] = temp;
        curr = parent;
      } else {
        break;
      }
    }

    setHeap(newHeap);
    setHighlightedIndex(curr);
    setStatusMessage(`Inserted ${val} and sifted up to restore ${heapType}-heap invariant in O(log n).`);
    setInputVal('');
  };

  // Extract Root (Min or Max)
  const handleExtractRoot = () => {
    if (heap.length === 0) {
      sound.error();
      return;
    }

    sound.remove();
    recordOperation('heap');
    const rootVal = heap[0];

    if (heap.length === 1) {
      setHeap([]);
      setStatusMessage(`Extracted sole element ${rootVal}. Heap is now empty.`);
      return;
    }

    const newHeap = [...heap];
    // Move last element to root
    newHeap[0] = newHeap.pop()!;
    let curr = 0;
    const n = newHeap.length;

    // Sift down
    while (true) {
      let candidate = curr;
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;

      if (heapType === 'min') {
        if (left < n && newHeap[left] < newHeap[candidate]) candidate = left;
        if (right < n && newHeap[right] < newHeap[candidate]) candidate = right;
      } else {
        if (left < n && newHeap[left] > newHeap[candidate]) candidate = left;
        if (right < n && newHeap[right] > newHeap[candidate]) candidate = right;
      }

      if (candidate !== curr) {
        const temp = newHeap[curr];
        newHeap[curr] = newHeap[candidate];
        newHeap[candidate] = temp;
        curr = candidate;
      } else {
        break;
      }
    }

    setHeap(newHeap);
    setHighlightedIndex(0);
    setStatusMessage(`Extracted root (${rootVal}). Replaced with last leaf and sifted down in O(log n).`);
  };

  const handleRandomize = () => {
    sound.click();
    const raw = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    // Heapify
    const h = [...raw];
    for (let i = Math.floor(h.length / 2) - 1; i >= 0; i--) {
      let curr = i;
      while (true) {
        let candidate = curr;
        const left = 2 * curr + 1;
        const right = 2 * curr + 2;
        if (heapType === 'min') {
          if (left < h.length && h[left] < h[candidate]) candidate = left;
          if (right < h.length && h[right] < h[candidate]) candidate = right;
        } else {
          if (left < h.length && h[left] > h[candidate]) candidate = left;
          if (right < h.length && h[right] > h[candidate]) candidate = right;
        }
        if (candidate !== curr) {
          const temp = h[curr];
          h[curr] = h[candidate];
          h[candidate] = temp;
          curr = candidate;
        } else break;
      }
    }
    setHeap(h);
    setHighlightedIndex(null);
    setStatusMessage(`Heapified random array in linear O(N) time.`);
  };

  // Node positions on complete binary tree SVG
  const getNodePos = (idx: number) => {
    // Level 0: 1 node (y=40)
    // Level 1: 2 nodes (y=100)
    // Level 2: 4 nodes (y=160)
    // Level 3: 8 nodes (y=220)
    const level = Math.floor(Math.log2(idx + 1));
    const levelStart = Math.pow(2, level) - 1;
    const posInLevel = idx - levelStart;
    const totalInLevel = Math.pow(2, level);
    const spacing = 520 / (totalInLevel + 1);
    const x = spacing * (posInLevel + 1);
    const y = 40 + level * 60;
    return { x, y };
  };

  return (
    <div className="space-y-6">
      {/* Visual Canvas: Tree + Array */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-slate-400">
              DUAL REPRESENTATION (COMPLETE TREE &amp; FLAT ARRAY)
            </div>
            <div className="text-sm font-semibold text-white">
              Heap Type:{' '}
              <span className="text-cyan-400 font-mono uppercase">
                {heapType}-HEAP
              </span>{' '}
              · Root element: <span className="text-emerald-400 font-mono">{heap[0] ?? 'None'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setHeapType(t => (t === 'min' ? 'max' : 'min'));
                sound.click();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg transition-colors"
            >
              Switch to {heapType === 'min' ? 'Max-Heap' : 'Min-Heap'}
            </button>
            <button
              onClick={handleRandomize}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Random Heapify</span>
            </button>
          </div>
        </div>

        {/* 1. Complete Binary Tree SVG */}
        <div className="w-full bg-slate-950/70 border border-slate-800 rounded-xl overflow-x-auto p-4 flex items-center justify-center min-h-[260px]">
          {heap.length === 0 ? (
            <div className="text-slate-600 font-mono text-xs">Heap is empty.</div>
          ) : (
            <svg viewBox="0 0 520 250" className="w-full max-w-[520px] h-[250px]">
              {/* Draw parent-child branch lines */}
              {heap.map((_, idx) => {
                const left = 2 * idx + 1;
                const right = 2 * idx + 2;
                const pPos = getNodePos(idx);

                return (
                  <React.Fragment key={`branch-${idx}`}>
                    {left < heap.length && (
                      <line
                        x1={pPos.x}
                        y1={pPos.y}
                        x2={getNodePos(left).x}
                        y2={getNodePos(left).y}
                        stroke="#334155"
                        strokeWidth="2"
                      />
                    )}
                    {right < heap.length && (
                      <line
                        x1={pPos.x}
                        y1={pPos.y}
                        x2={getNodePos(right).x}
                        y2={getNodePos(right).y}
                        stroke="#334155"
                        strokeWidth="2"
                      />
                    )}
                  </React.Fragment>
                );
              })}

              {/* Draw nodes */}
              {heap.map((val, idx) => {
                const pos = getNodePos(idx);
                const isHighlighted = highlightedIndex === idx;
                const isRoot = idx === 0;

                return (
                  <g key={`heap-node-${idx}`}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="18"
                      className={`transition-all duration-300 ${
                        isHighlighted
                          ? 'fill-cyan-500 stroke-cyan-200 stroke-2'
                          : isRoot
                          ? 'fill-emerald-600 stroke-emerald-300 stroke-2'
                          : 'fill-slate-800 stroke-slate-600 stroke-2'
                      }`}
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      className="text-xs font-mono font-bold fill-white select-none pointer-events-none"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* 2. Flat 1D Array View */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>FLAT ARRAY STORAGE: Left = 2i + 1 · Right = 2i + 2 · Parent = (i - 1) // 2</span>
            <span>Index 0 is root (peek O(1))</span>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-2 min-w-max">
              {heap.map((val, idx) => {
                const isSelected = highlightedIndex === idx;
                return (
                  <div
                    key={`arr-${idx}`}
                    onClick={() => setHighlightedIndex(idx)}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg border flex items-center justify-center font-mono font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/40'
                          : idx === 0
                          ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300'
                          : 'bg-slate-800/80 border-slate-700 text-white'
                      }`}
                    >
                      {val}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-1">
                      [{idx}]
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          {statusMessage}
        </div>
      </div>

      {/* Control Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Insert */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-300">Insert &amp; Sift-Up</div>
          <div className="flex gap-2">
            <input
              type="number"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="e.g. 19"
              className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleInsert}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert (O(log n))</span>
            </button>
          </div>
        </div>

        {/* Extract Root */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-300">Extract Root (Priority Queue)</div>
          <button
            onClick={handleExtractRoot}
            disabled={heap.length === 0}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 disabled:opacity-40 rounded-lg transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Extract {heapType === 'min' ? 'Minimum' : 'Maximum'} (O(log n))</span>
          </button>
        </div>
      </div>
    </div>
  );
};
