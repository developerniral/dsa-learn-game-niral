import React from 'react';
import { useGame } from '../context/GameContext';
import { ArrayVisualizer } from '../components/visualizations/ArrayVisualizer';
import { StackVisualizer } from '../components/visualizations/StackVisualizer';
import { QueueVisualizer } from '../components/visualizations/QueueVisualizer';
import { SetVisualizer } from '../components/visualizations/SetVisualizer';
import { TreeVisualizer } from '../components/visualizations/TreeVisualizer';
import { GraphVisualizer } from '../components/visualizations/GraphVisualizer';
import { HeapVisualizer } from '../components/visualizations/HeapVisualizer';
import {
  Layers,
  AlignJustify,
  Radio,
  GitFork,
  Network,
  Crown,
  Box
} from 'lucide-react';

interface TabConfig {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const TABS: TabConfig[] = [
  { id: 'array', name: 'Array / List', icon: Layers, tag: 'Contiguous Memory' },
  { id: 'stack', name: 'Stack (LIFO)', icon: Layers, tag: 'Call Stack' },
  { id: 'queue', name: 'Queue (FIFO)', icon: AlignJustify, tag: 'collections.deque' },
  { id: 'set', name: 'Hash Set', icon: Radio, tag: 'Venn Algebra' },
  { id: 'tree', name: 'BST Tree', icon: GitFork, tag: 'Hierarchical' },
  { id: 'graph', name: 'Graph (V, E)', icon: Network, tag: 'Pathfinding' },
  { id: 'heap', name: 'Binary Heap', icon: Crown, tag: 'Priority Queue' }
];

export const Playground: React.FC = () => {
  const { activePlaygroundTab, setActivePlaygroundTab } = useGame();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <Box className="w-4 h-4" />
          <span>HANDS-ON LABORATORY</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Data Structure Playground
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Directly manipulate underlying memory structures, observe visual state transitions, and verify algorithmic time complexities.
        </p>
      </div>

      {/* Segmented Structure Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activePlaygroundTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActivePlaygroundTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Visualizer Panel */}
      <div>
        {activePlaygroundTab === 'array' && <ArrayVisualizer />}
        {activePlaygroundTab === 'stack' && <StackVisualizer />}
        {activePlaygroundTab === 'queue' && <QueueVisualizer />}
        {activePlaygroundTab === 'set' && <SetVisualizer />}
        {activePlaygroundTab === 'tree' && <TreeVisualizer />}
        {activePlaygroundTab === 'graph' && <GraphVisualizer />}
        {activePlaygroundTab === 'heap' && <HeapVisualizer />}
      </div>
    </div>
  );
};
