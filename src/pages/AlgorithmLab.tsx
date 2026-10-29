import React, { useState } from 'react';
import { SortingVisualizer } from '../components/visualizations/SortingVisualizer';
import { SearchingVisualizer } from '../components/visualizations/SearchingVisualizer';
import { Cpu, BarChart2, Search } from 'lucide-react';

export const AlgorithmLab: React.FC = () => {
  const [activeLab, setActiveLab] = useState<'sorting' | 'searching'>('sorting');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <Cpu className="w-4 h-4" />
          <span>ALGORITHM EXECUTION LAB</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Algorithm Lab
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Step through fundamental sorting and searching algorithms with dynamic bar charts, real-time comparison counts, and execution traces.
        </p>
      </div>

      {/* Lab Segmented Mode Toggles */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveLab('sorting')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeLab === 'sorting'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Sorting Algorithms (Bubble, Quick, Merge...)</span>
        </button>

        <button
          onClick={() => setActiveLab('searching')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeLab === 'searching'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Searching Algorithms (Linear vs. Binary)</span>
        </button>
      </div>

      {/* Active Lab Component */}
      <div>
        {activeLab === 'sorting' ? <SortingVisualizer /> : <SearchingVisualizer />}
      </div>
    </div>
  );
};
