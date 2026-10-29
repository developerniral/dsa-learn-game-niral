import { TreeNode, GraphNode, GraphEdge } from '../types/dsa';

export interface TraversalStep {
  visitedNodes: string[];
  currentNode?: string;
  frontier?: string[];
  message: string;
}

export function generateTreeInorderSteps(root: TreeNode | null): TraversalStep[] {
  const steps: TraversalStep[] = [];
  const visited: string[] = [];

  function inorder(node: TreeNode | null) {
    if (!node) return;
    
    steps.push({
      visitedNodes: [...visited],
      currentNode: String(node.value),
      message: `Visiting node ${node.value}. Traversing down into left subtree first.`
    });

    if (node.left) {
      inorder(node.left);
    }

    visited.push(String(node.value));
    steps.push({
      visitedNodes: [...visited],
      currentNode: String(node.value),
      message: `Recorded ${node.value} in Inorder sequence (Left -> Root -> Right).`
    });

    if (node.right) {
      inorder(node.right);
    }
  }

  inorder(root);
  steps.push({
    visitedNodes: [...visited],
    message: `Inorder traversal complete: [${visited.join(', ')}]. Notice BST values appear in ascending numerical order!`
  });
  return steps;
}

export function generateTreePreorderSteps(root: TreeNode | null): TraversalStep[] {
  const steps: TraversalStep[] = [];
  const visited: string[] = [];

  function preorder(node: TreeNode | null) {
    if (!node) return;

    visited.push(String(node.value));
    steps.push({
      visitedNodes: [...visited],
      currentNode: String(node.value),
      message: `Root visited immediately: Recorded ${node.value} (Root -> Left -> Right).`
    });

    if (node.left) preorder(node.left);
    if (node.right) preorder(node.right);
  }

  preorder(root);
  steps.push({
    visitedNodes: [...visited],
    message: `Preorder traversal complete: [${visited.join(', ')}]. Useful for cloning or serializing trees.`
  });
  return steps;
}

export function generateTreePostorderSteps(root: TreeNode | null): TraversalStep[] {
  const steps: TraversalStep[] = [];
  const visited: string[] = [];

  function postorder(node: TreeNode | null) {
    if (!node) return;

    steps.push({
      visitedNodes: [...visited],
      currentNode: String(node.value),
      message: `Node ${node.value}: processing subtrees before recording value.`
    });

    if (node.left) postorder(node.left);
    if (node.right) postorder(node.right);

    visited.push(String(node.value));
    steps.push({
      visitedNodes: [...visited],
      currentNode: String(node.value),
      message: `Both subtrees processed: Recorded ${node.value} (Left -> Right -> Root).`
    });
  }

  postorder(root);
  steps.push({
    visitedNodes: [...visited],
    message: `Postorder traversal complete: [${visited.join(', ')}]. Ideal for deleting nodes and evaluating postfix expressions.`
  });
  return steps;
}

export function generateGraphBFSSteps(nodes: GraphNode[], edges: GraphEdge[], startId: string): TraversalStep[] {
  const steps: TraversalStep[] = [];
  const visited: string[] = [];
  const queue: string[] = [startId];
  const seen = new Set<string>([startId]);

  // Build adjacency list
  const adj = new Map<string, string[]>();
  nodes.forEach(n => adj.set(n.id, []));
  edges.forEach(e => {
    adj.get(e.from)?.push(e.to);
    if (!e.directed) {
      adj.get(e.to)?.push(e.from);
    }
  });

  steps.push({
    visitedNodes: [],
    frontier: [...queue],
    currentNode: startId,
    message: `Starting Breadth-First Search (BFS) from node ${startId}. Added to FIFO Queue.`
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    visited.push(current);

    const neighbors = (adj.get(current) || []).filter(n => !seen.has(n));

    steps.push({
      visitedNodes: [...visited],
      currentNode: current,
      frontier: [...queue],
      message: `Dequeued and visited node ${current}. Examining connected neighbors: [${neighbors.join(', ') || 'None'}].`
    });

    for (const neighbor of neighbors) {
      seen.add(neighbor);
      queue.push(neighbor);
      steps.push({
        visitedNodes: [...visited],
        currentNode: current,
        frontier: [...queue],
        message: `Discovered unvisited neighbor ${neighbor}. Added to Queue.`
      });
    }
  }

  steps.push({
    visitedNodes: [...visited],
    message: `BFS complete! Traversal order: [${visited.join(' -> ')}]. Explored level-by-level in concentric rings.`
  });

  return steps;
}

export function generateGraphDFSSteps(nodes: GraphNode[], edges: GraphEdge[], startId: string): TraversalStep[] {
  const steps: TraversalStep[] = [];
  const visited: string[] = [];
  const stack: string[] = [startId];
  const seen = new Set<string>();

  // Build adjacency list
  const adj = new Map<string, string[]>();
  nodes.forEach(n => adj.set(n.id, []));
  edges.forEach(e => {
    adj.get(e.from)?.push(e.to);
    if (!e.directed) {
      adj.get(e.to)?.push(e.from);
    }
  });

  steps.push({
    visitedNodes: [],
    frontier: [...stack],
    currentNode: startId,
    message: `Starting Depth-First Search (DFS) from node ${startId} using LIFO Stack.`
  });

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (!seen.has(current)) {
      seen.add(current);
      visited.push(current);

      const neighbors = (adj.get(current) || []).filter(n => !seen.has(n));

      steps.push({
        visitedNodes: [...visited],
        currentNode: current,
        frontier: [...stack],
        message: `Popped and visited node ${current}. Diving down connected branches.`
      });

      // Push neighbors in reverse order so first neighbor is popped first
      for (let i = neighbors.length - 1; i >= 0; i--) {
        stack.push(neighbors[i]);
      }
    }
  }

  steps.push({
    visitedNodes: [...visited],
    message: `DFS complete! Traversal order: [${visited.join(' -> ')}]. Followed deepest branches before backtracking.`
  });

  return steps;
}
