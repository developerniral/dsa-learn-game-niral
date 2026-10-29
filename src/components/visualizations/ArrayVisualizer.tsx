import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { OperationLog } from '../../types/dsa';
import { sound } from '../../utils/sound';
import { Plus, Trash2, Search, RotateCcw, Shuffle, Edit2, ArrowDown } from 'lucide-react';

export const ArrayVisualizer: React.FC = () => {
  const { recordOperation } = useGame();
  const [array, setArray] = useState<number[]>([15, 42, 8, 23, 77, 91]);
  const [history, setHistory] = useState<number[][]>([]);
  const [inputValue, setInputValue] = useState<string>('50');
  const [indexValue, setIndexValue] = useState<string>('2');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [searchingValue, setSearchingValue] = useState<string>('23');
  const [log, setLog] = useState<OperationLog | null>({
    id: 'initial',
    operation: 'Array Ready',
    details: 'Initial dynamic list initialized in contiguous memory with 6 elements.',
    timeComplexity: 'O(1) random access',
    spaceComplexity: 'O(N) memory',
    timestamp: Date.now(),
    status: 'info'
  });

  const saveHistory = () => {
    setHistory(prev => [...prev.slice(-10), [...array]]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setArray(prev);
    sound.click();
    setLog({
      id: String(Date.now()),
      operation: 'Undo',
      details: 'Reverted array to previous state.',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(N)',
      timestamp: Date.now(),
      status: 'info'
    });
  };

  // Add at end (append)
  const handleAppend = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    saveHistory();
    const newArr = [...array, val];
    setArray(newArr);
    sound.add();
    recordOperation('array');
    setHighlightedIndex(newArr.length - 1);
    setLog({
      id: String(Date.now()),
      operation: 'append(val)',
      details: `Appended ${val} to end of dynamic array at index ${newArr.length - 1}. No elements shifted.`,
      timeComplexity: 'Amortized O(1)',
      spaceComplexity: 'O(1) aux',
      timestamp: Date.now(),
      status: 'success'
    });
  };

  // Insert at index
  const handleInsert = () => {
    const val = parseInt(inputValue, 10);
    const idx = parseInt(indexValue, 10);
    if (isNaN(val) || isNaN(idx) || idx < 0 || idx > array.length) {
      sound.error();
      setLog({
        id: String(Date.now()),
        operation: 'Insert Error',
        details: `Invalid index ${idx}. Must be between 0 and ${array.length}.`,
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        timestamp: Date.now(),
        status: 'error'
      });
      return;
    }
    saveHistory();
    const newArr = [...array];
    newArr.splice(idx, 0, val);
    setArray(newArr);
    sound.add();
    recordOperation('array');
    setHighlightedIndex(idx);
    const shiftedCount = array.length - idx;
    setLog({
      id: String(Date.now()),
      operation: `insert(${idx}, ${val})`,
      details: `Inserted ${val} at index ${idx}. Shifted ${shiftedCount} element(s) right to make space.`,
      timeComplexity: `O(N) (shifted ${shiftedCount} items)`,
      spaceComplexity: 'O(1) aux',
      timestamp: Date.now(),
      status: 'success'
    });
  };

  // Update at index
  const handleUpdate = () => {
    const val = parseInt(inputValue, 10);
    const idx = parseInt(indexValue, 10);
    if (isNaN(val) || isNaN(idx) || idx < 0 || idx >= array.length) {
      sound.error();
      return;
    }
    saveHistory();
    const newArr = [...array];
    newArr[idx] = val;
    setArray(newArr);
    sound.click();
    recordOperation('array');
    setHighlightedIndex(idx);
    setLog({
      id: String(Date.now()),
      operation: `arr[${idx}] = ${val}`,
      details: `In-place updated index ${idx} directly using BaseAddress + (${idx} * sizeof(elem)).`,
      timeComplexity: 'O(1) Constant',
      spaceComplexity: 'O(1)',
      timestamp: Date.now(),
      status: 'success'
    });
  };

  // Remove element at index
  const handleRemove = (idx: number) => {
    if (idx < 0 || idx >= array.length) return;
    saveHistory();
    const removedVal = array[idx];
    const newArr = array.filter((_, i) => i !== idx);
    setArray(newArr);
    sound.remove();
    recordOperation('array');
    const shiftedCount = array.length - 1 - idx;
    setLog({
      id: String(Date.now()),
      operation: `pop(${idx})`,
      details: `Removed ${removedVal} from index ${idx}. Shifted ${shiftedCount} remaining elements left.`,
      timeComplexity: idx === array.length - 1 ? 'O(1) (end of list)' : `O(N) (${shiftedCount} items shifted)`,
      spaceComplexity: 'O(1)',
      timestamp: Date.now(),
      status: 'warning'
    });
    setHighlightedIndex(null);
  };

  // Search for element
  const handleSearch = () => {
    const val = parseInt(searchingValue, 10);
    if (isNaN(val)) return;
    sound.compare();
    recordOperation('array');
    const idx = array.indexOf(val);
    if (idx !== -1) {
      setHighlightedIndex(idx);
      setLog({
        id: String(Date.now()),
        operation: `linear_search(${val})`,
        details: `Found target ${val} at index ${idx} after scanning ${idx + 1} element(s).`,
        timeComplexity: `O(N) (found at step ${idx + 1}/${array.length})`,
        spaceComplexity: 'O(1)',
        timestamp: Date.now(),
        status: 'success'
      });
    } else {
      setHighlightedIndex(null);
      sound.error();
      setLog({
        id: String(Date.now()),
        operation: `linear_search(${val})`,
        details: `Target ${val} not found in array after inspecting all ${array.length} elements.`,
        timeComplexity: `O(N) (${array.length} comparisons)`,
        spaceComplexity: 'O(1)',
        timestamp: Date.now(),
        status: 'error'
      });
    }
  };

  // Randomize
  const handleRandomize = () => {
    saveHistory();
    const count = 7;
    const newArr = Array.from({ length: count }, () => Math.floor(Math.random() * 95) + 5);
    setArray(newArr);
    sound.click();
    setHighlightedIndex(null);
    setLog({
      id: String(Date.now()),
      operation: 'generate_random()',
      details: `Populated array with ${count} random integer values.`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      timestamp: Date.now(),
      status: 'info'
    });
  };

  // Clear
  const handleClear = () => {
    saveHistory();
    setArray([]);
    sound.remove();
    setHighlightedIndex(null);
    setLog({
      id: String(Date.now()),
      operation: 'clear()',
      details: 'Array emptied. Length is now 0.',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      timestamp: Date.now(),
      status: 'warning'
    });
  };

  return (
    <div className="space-y-6">
      {/* Visual Memory Strip */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs text-slate-400 font-mono">CONTIGUOUS MEMORY ALLOCATION</div>
            <div className="text-sm font-semibold text-white">
              Length: <span className="text-cyan-400 font-mono">{array.length}</span> · Capacity: <span className="text-slate-400 font-mono">{Math.max(8, Math.pow(2, Math.ceil(Math.log2(array.length || 1))))}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomize}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Random</span>
            </button>
            <button
              onClick={undo}
              disabled={history.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/40 border border-red-900/50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Array Cells */}
        {array.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-mono text-sm border-2 border-dashed border-slate-800 rounded-xl">
            Array is currently empty. Use the controls below to append elements.
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex items-end gap-2.5 min-w-max py-2">
              {array.map((val, idx) => {
                const isSelected = highlightedIndex === idx;
                // Virtual simulated memory address (0x1000 + idx * 4)
                const memAddress = `0x${(4096 + idx * 4).toString(16).toUpperCase()}`;

                return (
                  <div key={`${idx}-${val}`} className="flex flex-col items-center group">
                    {/* Highlight indicator arrow */}
                    {isSelected && (
                      <div className="text-cyan-400 animate-bounce mb-1">
                        <ArrowDown className="w-4 h-4" />
                      </div>
                    )}
                    {!isSelected && <div className="h-5" />}

                    {/* Array Cell Box */}
                    <div
                      onClick={() => setHighlightedIndex(idx)}
                      className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border font-mono font-bold text-lg transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/40 scale-105 shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-800/80 border-slate-700 text-white hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      <span>{val}</span>
                    </div>

                    {/* 0-Based Index */}
                    <div className="mt-2 text-xs font-mono font-semibold text-slate-400">
                      [{idx}]
                    </div>

                    {/* Memory Address */}
                    <div className="text-[10px] font-mono text-slate-600 group-hover:text-slate-400 transition-colors">
                      {memAddress}
                    </div>

                    {/* Delete button on hover */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleRemove(idx);
                      }}
                      className="mt-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 transition-opacity"
                      title={`Remove element at index ${idx}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Control Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Panel 1: Value & Index Operations */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-300">Insert & Update Elements</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Value</label>
              <input
                type="number"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Index</label>
              <input
                type="number"
                value={indexValue}
                onChange={e => setIndexValue(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={handleAppend}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Append (O(1))</span>
            </button>
            <button
              onClick={handleInsert}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert (O(n))</span>
            </button>
          </div>

          <button
            onClick={handleUpdate}
            className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Update at Index (O(1))</span>
          </button>
        </div>

        {/* Panel 2: Search */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-300">Linear Value Search</div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Target Number</label>
            <input
              type="number"
              value={searchingValue}
              onChange={e => setSearchingValue(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Scan Array (O(n))</span>
          </button>

          <div className="text-[11px] text-slate-500 leading-relaxed">
            In an unsorted list, linear search evaluates elements from index 0 sequentially until a match or the end is reached.
          </div>
        </div>

        {/* Panel 3: Live Operation Concept Card */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Operation Telemetry</span>
              {log && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {log.timeComplexity}
                </span>
              )}
            </div>

            {log ? (
              <div className="space-y-1.5 text-xs">
                <div className="font-mono font-semibold text-cyan-300">{log.operation}</div>
                <div className="text-slate-400 text-[11px] leading-relaxed">{log.details}</div>
              </div>
            ) : (
              <div className="text-xs text-slate-500">Perform an operation to view complexity and memory details.</div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Memory: Contiguous</span>
            <span>Lookup: O(1)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
