import { Achievement } from '../types/game';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first DSA interactive lesson.',
    icon: 'Footprints',
    category: 'learning',
    xpReward: 50,
    isUnlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'array-adventurer',
    title: 'Array Adventurer',
    description: 'Master Array Explorer by completing all Level 1 missions and lessons.',
    icon: 'Layers',
    category: 'learning',
    xpReward: 100,
    isUnlocked: false,
    progress: 0,
    maxProgress: 2
  },
  {
    id: 'stack-master',
    title: 'Stack Master',
    description: 'Conquer LIFO stack operations and push at least 5 elements in the playground.',
    icon: 'Layers',
    category: 'playground',
    xpReward: 100,
    isUnlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'queue-commander',
    title: 'Queue Commander',
    description: 'Complete the queue challenges and learn collections.deque.',
    icon: 'AlignJustify',
    category: 'learning',
    xpReward: 100,
    isUnlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'tree-whisperer',
    title: 'Tree Whisperer',
    description: 'Insert 5 nodes and run all 3 DFS traversals on a Binary Search Tree.',
    icon: 'GitFork',
    category: 'playground',
    xpReward: 120,
    isUnlocked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'graph-pathfinder',
    title: 'Graph Pathfinder',
    description: 'Execute both BFS and DFS traversals on a graph.',
    icon: 'Network',
    category: 'playground',
    xpReward: 120,
    isUnlocked: false,
    progress: 0,
    maxProgress: 2
  },
  {
    id: 'algorithm-apprentice',
    title: 'Algorithm Apprentice',
    description: 'Run 5 algorithm visualizer simulations in the Algorithm Lab.',
    icon: 'Cpu',
    category: 'algorithms',
    xpReward: 150,
    isUnlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'big-o-detective',
    title: 'Big O Detective',
    description: 'Correctly classify 5 complexity curves or loop snippets in the Big O Arena.',
    icon: 'Activity',
    category: 'mastery',
    xpReward: 150,
    isUnlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'perfect-score',
    title: 'Flawless Intellect',
    description: 'Score 100% on a full Quiz Challenge round.',
    icon: 'Award',
    category: 'quiz',
    xpReward: 200,
    isUnlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'consistent-learner',
    title: 'Consistent Learner',
    description: 'Maintain a 3-day learning streak in DSA Quest.',
    icon: 'Flame',
    category: 'learning',
    xpReward: 150,
    isUnlocked: false,
    progress: 1,
    maxProgress: 3
  },
  {
    id: 'curious-experimenter',
    title: 'Curious Experimenter',
    description: 'Perform 25 interactive data structure operations in the playground.',
    icon: 'Sparkles',
    category: 'playground',
    xpReward: 100,
    isUnlocked: false,
    progress: 0,
    maxProgress: 25
  },
  {
    id: 'coding-centurion',
    title: 'Mission Specialist',
    description: 'Complete 3 real coding challenges in the Coding Missions arena.',
    icon: 'Terminal',
    category: 'mastery',
    xpReward: 200,
    isUnlocked: false,
    progress: 0,
    maxProgress: 3
  }
];
