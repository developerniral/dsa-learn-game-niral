import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { GraphNode, GraphEdge } from '../../types/dsa';
import { sound } from '../../utils/sound';
import {
  generateGraphBFSSteps,
  generateGraphDFSSteps,
  TraversalStep
} from '../../algorithms/traversalEngine';
import { Play, Plus, RotateCcw, Shuffle, Trash2 } from 'lucide-react';

const INITIAL_NODES: GraphNode[] = [
  { id: 'A', label: 'A', x: 80, y: 140 },
  { id: 'B', label: 'B', x: 200, y: 70 },
  { id: 'C', label: 'C', x: 200, y: 210 },
  { id: 'D', label: 'D', x: 340, y: 70 },
  { id: 'E', label: 'E', x: 340, y: 210 },
  { id: 'F', label: 'F', x: 460, y: 140 }
];

const INITIAL_EDGES: GraphEdge[] = [
  { id: 'e1', from: 'A', to: 'B' },
  { id: 'e2', from: 'A', to: 'C' },
  { id: 'e3', from: 'B', to: 'D' },
  { id: 'e4', from: 'C', to: 'E' },
  { id: 'e5', from: 'D', to: 'F' },
  { id: 'e6', from: 'E', to: 'F' },
  { id: 'e7', from: 'B', to: 'E' }
];

export const GraphVisualizer: React.FC = () => {
  const { recordOperation } = useGame();
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<GraphEdge[]>(INITIAL_EDGES);
  const [startNodeId, setStartNodeId] = useState<string>('A');
  const [edgeFrom, setEdgeFrom] = useState<string>('A');
  const [edgeTo, setEdgeTo] = useState<string>('D');

  const [activeSteps, setActiveSteps] = useState<TraversalStep[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(-1);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [frontier, setFrontier] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('Graph ready. Select a traversal (BFS or DFS) to explore.');

  const runTraversal = (mode: 'bfs' | 'dfs') => {
    sound.click();
    recordOperation('graph');
    const steps =
      mode === 'bfs'
        ? generateGraphBFSSteps(nodes, edges, startNodeId)
        : generateGraphDFSSteps(nodes, edges, startNodeId);

    setActiveSteps(steps);
    setStepIndex(0);
  };

  useEffect(() => {
    if (activeSteps.length === 0 || stepIndex < 0) return;
    const curr = activeSteps[stepIndex];
    if (curr) {
      setVisitedNodes(curr.visitedNodes);
      setCurrentNode(curr.currentNode || null);
      setFrontier(curr.frontier || []);
      setStatusMessage(curr.message);
      sound.compare();
    }

    if (stepIndex < activeSteps.length - 1) {
      const timer = setTimeout(() => {
        setStepIndex(i => i + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      sound.victory();
    }
  }, [stepIndex, activeSteps]);

  const handleAddEdge = () => {
    if (edgeFrom === edgeTo) return;
    const exists = edges.some(
      e => (e.from === edgeFrom && e.to === edgeTo) || (e.from === edgeTo && e.to === edgeFrom)
    );
    if (exists) {
      sound.error();
      return;
    }
    const newEdge: GraphEdge = {
      id: `e-${Date.now()}`,
      from: edgeFrom,
      to: edgeTo
    };
    setEdges(prev => [...prev, newEdge]);
    sound.add();
    recordOperation('graph');
    setStatusMessage(`Added edge between ${edgeFrom} and ${edgeTo}.`);
  };

  const handleRemoveNode = (id: string) => {
    if (nodes.length <= 2) {
      sound.error();
      return;
    }
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.from !== id && e.to !== id));
    if (startNodeId === id) {
      setStartNodeId(nodes.find(n => n.id !== id)?.id || 'A');
    }
    sound.remove();
    recordOperation('graph');
    setStatusMessage(`Removed node ${id} and connected edges.`);
  };

  const resetGraph = () => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setActiveSteps([]);
    setStepIndex(-1);
    setVisitedNodes([]);
    setCurrentNode(null);
    setFrontier([]);
    setStartNodeId('A');
    setStatusMessage('Graph reset to initial network.');
  };

  return (
    <div className="space-y-6">
      {/* SVG Interactive Graph Canvas */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-slate-400">
              NETWORK GRAPH G = (V, E)
            </div>
            <div className="text-sm font-semibold text-white">
              Vertices |V|: <span className="text-cyan-400 font-mono">{nodes.length}</span> · Edges |E|: <span className="text-slate-300 font-mono">{edges.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
              <span>Start Node:</span>
              <select
                value={startNodeId}
                onChange={e => setStartNodeId(e.target.value)}
                className="px-2 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-cyan-300"
              >
                {nodes.map(n => (
                  <option key={n.id} value={n.id}>
                    Node {n.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => runTraversal('bfs')}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-lg transition-colors flex items-center gap-1"
            >
              <Play className="w-3 h-3" />
              <span>Run BFS (Queue)</span>
            </button>
            <button
              onClick={() => runTraversal('dfs')}
              className="px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/60 rounded-lg transition-colors flex items-center gap-1"
            >
              <Play className="w-3 h-3" />
              <span>Run DFS (Stack)</span>
            </button>
            <button
              onClick={resetGraph}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
              title="Reset Graph"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Graph Canvas */}
        <div className="w-full bg-slate-950/70 border border-slate-800 rounded-xl overflow-x-auto p-4 flex items-center justify-center min-h-[300px]">
          <svg viewBox="0 0 540 280" className="w-full max-w-[540px] h-[280px]">
            {/* Render Edges */}
            {edges.map(edge => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const isTraversed =
                visitedNodes.includes(edge.from) && visitedNodes.includes(edge.to);

              return (
                <line
                  key={edge.id}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isTraversed ? '#06b6d4' : '#334155'}
                  strokeWidth={isTraversed ? '3' : '2'}
                  strokeDasharray={isTraversed ? 'none' : 'none'}
                  className="transition-colors duration-300"
                />
              );
            })}

            {/* Render Nodes */}
            {nodes.map(node => {
              const isCurrent = currentNode === node.id;
              const isVisited = visitedNodes.includes(node.id);
              const isFrontier = frontier.includes(node.id);

              let fillColor = '#1e293b'; // slate-800
              let strokeColor = '#475569'; // slate-600

              if (isCurrent) {
                fillColor = '#06b6d4'; // cyan-500
                strokeColor = '#ecfeff';
              } else if (isVisited) {
                fillColor = '#059669'; // emerald-600
                strokeColor = '#a7f3d0';
              } else if (isFrontier) {
                fillColor = '#7c3aed'; // purple-600
                strokeColor = '#ddd6fe';
              }

              return (
                <g
                  key={node.id}
                  className="cursor-pointer group"
                  onClick={() => handleRemoveNode(node.id)}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="22"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    className="transition-all duration-300"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className="text-xs font-mono font-bold fill-white select-none pointer-events-none"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Traversal State Legend & Step Output */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Active Node
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Visited
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Frontier (Queue/Stack)
            </span>
          </div>

          <div className="text-slate-400">
            Order: [{visitedNodes.join(' → ') || 'None'}]
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          {statusMessage}
        </div>
      </div>

      {/* Edge addition & controls */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-300 font-semibold">Connect Edge:</span>
          <select
            value={edgeFrom}
            onChange={e => setEdgeFrom(e.target.value)}
            className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-white text-xs"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
          <span className="text-slate-500 font-mono">↔</span>
          <select
            value={edgeTo}
            onChange={e => setEdgeTo(e.target.value)}
            className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-white text-xs"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddEdge}
            className="flex items-center gap-1 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Edge</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500">
          Click any circular vertex to delete it. Complexity: O(V + E).
        </div>
      </div>
    </div>
  );
};
