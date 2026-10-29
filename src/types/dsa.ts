export type StructureType =
  | 'array'
  | 'stack'
  | 'queue'
  | 'set'
  | 'tree'
  | 'graph'
  | 'heap';

export type AlgorithmType =
  | 'linear-search'
  | 'binary-search'
  | 'bubble-sort'
  | 'selection-sort'
  | 'insertion-sort'
  | 'merge-sort'
  | 'quick-sort'
  | 'bfs'
  | 'dfs'
  | 'heapify';

export interface OperationLog {
  id: string;
  operation: string;
  details: string;
  timeComplexity: string;
  spaceComplexity: string;
  timestamp: number;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode | null;
  right?: TreeNode | null;
  x?: number;
  y?: number;
  highlighted?: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight?: number;
  directed?: boolean;
}

export interface AlgorithmStep {
  array: number[];
  comparingIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: number[];
  pivotIndex?: number;
  leftPointer?: number;
  rightPointer?: number;
  midPointer?: number;
  targetIndex?: number;
  visitedNodes?: string[];
  activeNode?: string;
  frontier?: string[];
  message: string;
  codeLine?: number;
}

export interface AlgorithmMeta {
  id: AlgorithmType;
  name: string;
  category: 'searching' | 'sorting' | 'traversal';
  bestTime: string;
  avgTime: string;
  worstTime: string;
  spaceComplexity: string;
  stable: boolean;
  inPlace: boolean;
  description: string;
  pythonCode: string;
  keyRule: string;
}
