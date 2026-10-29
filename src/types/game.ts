export type PageId =
  | 'dashboard'
  | 'learning-path'
  | 'playground'
  | 'algorithm-lab'
  | 'big-o-arena'
  | 'quiz'
  | 'missions'
  | 'achievements'
  | 'settings';

export interface UserStats {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  completedMissionIds: string[];
  unlockedLevelIds: string[];
  achievementsUnlocked: string[];
  quizzesCompleted: number;
  perfectQuizzes: number;
  algorithmsTested: number;
  dataStructuresExplored: string[];
  operationsCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'playground' | 'algorithms' | 'quiz' | 'mastery';
  xpReward: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface LessonObjective {
  text: string;
  isCompleted?: boolean;
}

export interface Lesson {
  id: string;
  levelNumber: number;
  levelId: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'data-structure' | 'algorithm' | 'analysis';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  xpReward: number;
  prerequisites: string[];
  concept: string;
  keyTakeaways: string[];
  pythonCode: string;
  codeExplanation: string[];
  expectedOutput: string;
  commonMistakes: string;
  timeComplexity: {
    access?: string;
    search?: string;
    insertion?: string;
    deletion?: string;
    worstCase?: string;
    averageCase?: string;
    bestCase?: string;
    spaceComplexity: string;
  };
  practiceTask: string;
  quickCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface LevelPath {
  id: string;
  levelNumber: number;
  name: string;
  subtitle: string;
  themeColor: string;
  icon: string;
  lessons: Lesson[];
  requiredLevelToUnlock: number;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'output' | 'complexity' | 'data-structure' | 'find-bug' | 'order-steps';
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  xpReward: number;
}

export interface CodingMission {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  problemStatement: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  testCases: {
    inputDesc: string;
    expectedOutput: string;
  }[];
  explanation: string;
  complexityAnalysis: {
    time: string;
    space: string;
    notes: string;
  };
  xpReward: number;
}
