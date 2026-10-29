import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/sound';
import { OperationLog } from '../../types/dsa';
import { Plus, Trash2, Search, Shuffle } from 'lucide-react';

export const SetVisualizer: React.FC = () => {
  const { recordOperation } = useGame();
  const [setA, setSetA] = useState<string[]>(['python', 'rust', 'go', 'typescript']);
  const [setB, setSetB] = useState<string[]>(['python', 'c++', 'java', 'go']);
  const [inputVal, setInputVal] = useState<string>('kotlin');
  const [targetSet, setTargetSet] = useState<'A' | 'B'>('A');
  const [membershipTestVal, setMembershipTestVal] = useState<string>('rust');
  const [activeAlgebraMode, setActiveAlgebraMode] = useState<'none' | 'union' | 'intersection' | 'diffA' | 'diffB'>('none');
  const [log, setLog] = useState<OperationLog | null>({
    id: 'init',
    operation: 'Hash Sets Ready',
    details: 'Sets initialized. Fast O(1) lookups via underlying hash table buckets.',
    timeComplexity: 'Average O(1)',
    spaceComplexity: 'O(N)',
    timestamp: Date.now(),
    status: 'info'
  });

  const handleAdd = () => {
    const val = inputVal.trim().toLowerCase();
    if (!val) return;

    const currentSet = targetSet === 'A' ? setA : setB;
    const isDuplicate = currentSet.includes(val);

    if (isDuplicate) {
      sound.compare();
      setLog({
        id: String(Date.now()),
        operation: `set_${targetSet.toLowerCase()}.add("${val}")`,
        details: `Value "${val}" already exists in Set ${targetSet}. Sets enforce uniqueness; duplicate was discarded!`,
        timeComplexity: 'Average O(1) lookup',
        spaceComplexity: 'O(1)',
        timestamp: Date.now(),
        status: 'warning'
      });
      return;
    }

    if (targetSet === 'A') {
      setSetA(prev => [...prev, val]);
    } else {
      setSetB(prev => [...prev, val]);
    }

    sound.add();
    recordOperation('set');
    setLog({
      id: String(Date.now()),
      operation: `set_${targetSet.toLowerCase()}.add("${val}")`,
      details: `Hashed "${val}" and placed into bucket in Set ${targetSet}.`,
      timeComplexity: 'Average O(1)',
      spaceComplexity: 'O(1)',
      timestamp: Date.now(),
      status: 'success'
    });
    setInputVal('');
  };

  const handleRemove = (val: string, fromSet: 'A' | 'B') => {
    if (fromSet === 'A') {
      setSetA(prev => prev.filter(x => x !== val));
    } else {
      setSetB(prev => prev.filter(x => x !== val));
    }
    sound.remove();
    recordOperation('set');
    setLog({
      id: String(Date.now()),
      operation: `set_${fromSet.toLowerCase()}.remove("${val}")`,
      details: `Removed "${val}" from Set ${fromSet}.`,
      timeComplexity: 'Average O(1)',
      spaceComplexity: 'O(1)',
      timestamp: Date.now(),
      status: 'warning'
    });
  };

  const handleMembershipTest = () => {
    const val = membershipTestVal.trim().toLowerCase();
    if (!val) return;
    sound.compare();
    recordOperation('set');

    const inA = setA.includes(val);
    const inB = setB.includes(val);

    setLog({
      id: String(Date.now()),
      operation: `"${val}" in set_a -> ${inA} | in set_b -> ${inB}`,
      details: `Hash lookup calculated hash("${val}"): Set A: ${inA ? 'FOUND' : 'MISSING'}, Set B: ${inB ? 'FOUND' : 'MISSING'}.`,
      timeComplexity: 'Average O(1) membership check',
      spaceComplexity: 'O(1)',
      timestamp: Date.now(),
      status: inA || inB ? 'success' : 'error'
    });
  };

  // Set Algebra calculations
  const unionSet = Array.from(new Set([...setA, ...setB]));
  const intersectionSet = setA.filter(x => setB.includes(x));
  const diffASet = setA.filter(x => !setB.includes(x));
  const diffBSet = setB.filter(x => !setA.includes(x));

  return (
    <div className="space-y-6">
      {/* Venn Diagram / Sets Comparison Stage */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono text-slate-400">
            HASH TABLE SETS & VENN ALGEBRA
          </div>

          {/* Mathematical Set Operation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setActiveAlgebraMode('none')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeAlgebraMode === 'none' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setActiveAlgebraMode('union')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeAlgebraMode === 'union' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Union (A | B)
            </button>
            <button
              onClick={() => setActiveAlgebraMode('intersection')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeAlgebraMode === 'intersection' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Intersection (A & B)
            </button>
            <button
              onClick={() => setActiveAlgebraMode('diffA')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeAlgebraMode === 'diffA' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Diff (A - B)
            </button>
          </div>
        </div>

        {/* Dual Set Display or Computed Algebra View */}
        {activeAlgebraMode === 'none' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Set A */}
            <div className="p-4 rounded-xl border border-blue-900/50 bg-blue-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 font-mono">SET A ({setA.length} items)</span>
                <span className="text-[10px] text-slate-500 font-mono">set_a = {'{...}'}</span>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[90px] p-2 bg-slate-950/40 rounded-lg border border-slate-800/80">
                {setA.map(item => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/40 border border-blue-700/60 text-blue-200 font-mono text-xs font-medium"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemove(item, 'A')}
                      className="text-blue-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Set B */}
            <div className="p-4 rounded-xl border border-purple-900/50 bg-purple-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 font-mono">SET B ({setB.length} items)</span>
                <span className="text-[10px] text-slate-500 font-mono">set_b = {'{...}'}</span>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[90px] p-2 bg-slate-950/40 rounded-lg border border-slate-800/80">
                {setB.map(item => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/40 border border-purple-700/60 text-purple-200 font-mono text-xs font-medium"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemove(item, 'B')}
                      className="text-purple-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Algebra Operation View */
          <div className="p-6 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white font-mono">
                {activeAlgebraMode === 'union' && 'Union Result: set_a | set_b'}
                {activeAlgebraMode === 'intersection' && 'Intersection Result: set_a & set_b'}
                {activeAlgebraMode === 'diffA' && 'Difference Result: set_a - set_b'}
              </div>
              <div className="text-xs text-cyan-400 font-mono">
                {activeAlgebraMode === 'union' && `${unionSet.length} unique elements`}
                {activeAlgebraMode === 'intersection' && `${intersectionSet.length} shared elements`}
                {activeAlgebraMode === 'diffA' && `${diffASet.length} distinct to A`}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[70px] p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              {activeAlgebraMode === 'union' &&
                unionSet.map(item => (
                  <span key={item} className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-200 font-mono text-xs">
                    {item}
                  </span>
                ))}

              {activeAlgebraMode === 'intersection' &&
                (intersectionSet.length > 0 ? (
                  intersectionSet.map(item => (
                    <span key={item} className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-200 font-mono text-xs font-bold">
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 font-mono text-xs">Empty set: No common elements.</span>
                ))}

              {activeAlgebraMode === 'diffA' &&
                (diffASet.length > 0 ? (
                  diffASet.map(item => (
                    <span key={item} className="px-3 py-1.5 rounded-lg bg-amber-950 border border-amber-700 text-amber-200 font-mono text-xs font-bold">
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 font-mono text-xs">Empty set: All elements of A also exist in B.</span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Control Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Add Element */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Add Element</span>
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setTargetSet('A')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  targetSet === 'A' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Target Set A
              </button>
              <button
                onClick={() => setTargetSet('B')}
                className={`px-2 py-0.5 rounded text-[11px] ${
                  targetSet === 'B' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Target Set B
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="e.g. swift"
              className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add (O(1))</span>
            </button>
          </div>
        </div>

        {/* Membership Testing */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <span className="text-xs font-semibold text-slate-300">O(1) Membership Test (`x in S`)</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={membershipTestVal}
              onChange={e => setMembershipTestVal(e.target.value)}
              placeholder="Check element existence..."
              className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleMembershipTest}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Test (O(1))</span>
            </button>
          </div>

          {log && (
            <div className="text-[11px] text-slate-400 font-mono truncate">
              {log.operation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
