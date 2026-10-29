import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { TreeNode } from '../../types/dsa';
import { sound } from '../../utils/sound';
import {
  generateTreeInorderSteps,
  generateTreePreorderSteps,
  generateTreePostorderSteps,
  TraversalStep
} from '../../algorithms/traversalEngine';
import { Plus, Search, Play, RotateCcw, Trash2 } from 'lucide-react';

interface RenderNode extends TreeNode {
  x: number;
  y: number;
  left?: RenderNode | null;
  right?: RenderNode | null;
}

export const TreeVisualizer: React.FC = () => {
  const { recordOperation } = useGame();
  const [values, setValues] = useState<number[]>([50, 30, 70, 20, 40, 60, 80]);
  const [inputVal, setInputVal] = useState<string>('65');
  const [searchVal, setSearchVal] = useState<string>('40');
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  const [activeTraversalSteps, setActiveTraversalSteps] = useState<TraversalStep[]>([]);
  const [traversalStepIndex, setTraversalStepIndex] = useState<number>(-1);
  const [statusMessage, setStatusMessage] = useState<string>('Binary Search Tree ready. Left subtree < Root < Right subtree.');

  // Build BST tree object from values
  const buildBST = (vals: number[]): TreeNode | null => {
    if (vals.length === 0) return null;

    const insertNode = (root: TreeNode | null, val: number): TreeNode => {
      if (!root) return { id: `node-${val}`, value: val };
      if (val < root.value) {
        root.left = insertNode(root.left || null, val);
      } else if (val > root.value) {
        root.right = insertNode(root.right || null, val);
      }
      return root;
    };

    let root: TreeNode | null = null;
    for (const v of vals) {
      root = insertNode(root, v);
    }
    return root;
  };

  const bstRoot = buildBST(values);

  // Position nodes for SVG rendering
  const layoutTree = (node: TreeNode | null, x = 320, y = 50, offset = 120): RenderNode | null => {
    if (!node) return null;
    return {
      ...node,
      x,
      y,
      left: layoutTree(node.left || null, x - offset, y + 65, offset * 0.55),
      right: layoutTree(node.right || null, x + offset, y + 65, offset * 0.55)
    };
  };

  const renderedTree = layoutTree(bstRoot);

  const handleInsert = () => {
    const val = parseInt(inputVal, 10);
    if (isNaN(val)) return;
    if (values.includes(val)) {
      setStatusMessage(`Value ${val} already exists in the BST.`);
      sound.error();
      return;
    }
    if (values.length >= 15) {
      setStatusMessage('Maximum visual node limit reached (15 nodes).');
      sound.error();
      return;
    }

    setValues(prev => [...prev, val]);
    sound.add();
    recordOperation('tree');
    setHighlightedNodes([String(val)]);
    setStatusMessage(`Inserted ${val} into BST. Traversed branches according to val < node.val rule in O(log n).`);
    setInputVal('');
  };

  const handleSearch = () => {
    const target = parseInt(searchVal, 10);
    if (isNaN(target)) return;
    sound.compare();
    recordOperation('tree');

    const path: string[] = [];
    let curr = bstRoot;
    let found = false;

    while (curr) {
      path.push(String(curr.value));
      if (curr.value === target) {
        found = true;
        break;
      } else if (target < curr.value) {
        curr = curr.left || null;
      } else {
        curr = curr.right || null;
      }
    }

    setHighlightedNodes(path);
    if (found) {
      sound.victory();
      setStatusMessage(`Target ${target} located! Path from root: [${path.join(' -> ')}] in ${path.length} comparisons O(h).`);
    } else {
      sound.error();
      setStatusMessage(`Target ${target} is not in the tree. Explored path: [${path.join(' -> ')}].`);
    }
  };

  const handleRemove = (val: number) => {
    setValues(prev => prev.filter(v => v !== val));
    sound.remove();
    recordOperation('tree');
    setHighlightedNodes([]);
    setStatusMessage(`Node ${val} removed from BST.`);
  };

  const runTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    sound.click();
    let steps: TraversalStep[] = [];
    if (type === 'inorder') steps = generateTreeInorderSteps(bstRoot);
    if (type === 'preorder') steps = generateTreePreorderSteps(bstRoot);
    if (type === 'postorder') steps = generateTreePostorderSteps(bstRoot);

    setActiveTraversalSteps(steps);
    setTraversalStepIndex(0);
  };

  // Traversal stepper
  useEffect(() => {
    if (activeTraversalSteps.length === 0 || traversalStepIndex < 0) return;
    const step = activeTraversalSteps[traversalStepIndex];
    if (step) {
      setStatusMessage(step.message);
      if (step.currentNode) {
        setHighlightedNodes([step.currentNode]);
        sound.compare();
      }
    }

    if (traversalStepIndex < activeTraversalSteps.length - 1) {
      const timer = setTimeout(() => {
        setTraversalStepIndex(idx => idx + 1);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [traversalStepIndex, activeTraversalSteps]);

  // Recursively render branches & nodes
  const renderBranches = (node: RenderNode | null): React.ReactNode => {
    if (!node) return null;
    return (
      <React.Fragment key={`branch-${node.value}`}>
        {node.left && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="#475569"
            strokeWidth="2"
          />
        )}
        {node.right && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="#475569"
            strokeWidth="2"
          />
        )}
        {node.left && renderBranches(node.left)}
        {node.right && renderBranches(node.right)}
      </React.Fragment>
    );
  };

  const renderNodes = (node: RenderNode | null): React.ReactNode => {
    if (!node) return null;
    const isHighlighted = highlightedNodes.includes(String(node.value));

    return (
      <React.Fragment key={`node-${node.value}`}>
        <g
          className="cursor-pointer group"
          onClick={() => handleRemove(node.value)}
        >
          <circle
            cx={node.x}
            cy={node.y}
            r="20"
            className={`transition-all duration-300 ${
              isHighlighted
                ? 'fill-cyan-500 stroke-cyan-200 stroke-2'
                : 'fill-slate-800 stroke-slate-600 stroke-2 group-hover:fill-slate-700'
            }`}
          />
          <text
            x={node.x}
            y={node.y + 5}
            textAnchor="middle"
            className="text-xs font-mono font-bold fill-white select-none pointer-events-none"
          >
            {node.value}
          </text>
        </g>
        {node.left && renderNodes(node.left)}
        {node.right && renderNodes(node.right)}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-6">
      {/* SVG Tree Canvas */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-slate-400">
              BINARY SEARCH TREE (BST)
            </div>
            <div className="text-sm font-semibold text-white">
              Nodes: <span className="text-cyan-400 font-mono">{values.length}</span> · Invariant: Left &lt; Root &lt; Right
            </div>
          </div>

          {/* Traversal Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => runTraversal('inorder')}
              className="px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg transition-colors flex items-center gap-1"
            >
              <Play className="w-3 h-3" />
              <span>Inorder (Sorted)</span>
            </button>
            <button
              onClick={() => runTraversal('preorder')}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Preorder
            </button>
            <button
              onClick={() => runTraversal('postorder')}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Postorder
            </button>
            <button
              onClick={() => {
                setValues([50, 30, 70, 20, 40, 60, 80]);
                setHighlightedNodes([]);
                setStatusMessage('Reset tree to balanced sample.');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
              title="Reset Tree"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tree Canvas */}
        <div className="w-full bg-slate-950/70 border border-slate-800 rounded-xl overflow-x-auto p-4 flex items-center justify-center min-h-[340px]">
          {values.length === 0 ? (
            <div className="text-slate-600 font-mono text-xs">Tree is empty. Insert nodes below.</div>
          ) : (
            <svg viewBox="0 0 640 320" className="w-full max-w-[640px] h-[300px]">
              {renderBranches(renderedTree)}
              {renderNodes(renderedTree)}
            </svg>
          )}
        </div>

        {/* Status ticker */}
        <div className="text-xs font-mono text-cyan-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 truncate">
          {statusMessage}
        </div>
      </div>

      {/* Control Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Insert node */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-300">Insert Node into BST</div>
          <div className="flex gap-2">
            <input
              type="number"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="e.g. 55"
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
          <div className="text-[11px] text-slate-500">
            Click on any circle node on the canvas to remove it.
          </div>
        </div>

        {/* Search node */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-300">Search Node Value</div>
          <div className="flex gap-2">
            <input
              type="number"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search target value..."
              className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search (O(log n))</span>
            </button>
          </div>
          <div className="text-[11px] text-slate-500">
            Logarithmic search navigates left or right at each comparison, ignoring half the remaining tree each step.
          </div>
        </div>
      </div>
    </div>
  );
};
