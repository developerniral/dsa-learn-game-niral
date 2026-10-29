import { QuizQuestion } from '../types/game';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'complexity',
    topic: 'Arrays & Indexing',
    difficulty: 'Beginner',
    question: 'What is the average time complexity of inserting an element at index 0 of a standard Python list of length n?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswerIndex: 2,
    explanation: 'Inserting at index 0 requires shifting all n existing elements one index to the right in memory to open up the first slot, requiring O(n) operations.',
    xpReward: 20
  },
  {
    id: 'q2',
    type: 'output',
    topic: 'Stacks (LIFO)',
    difficulty: 'Beginner',
    question: 'What is the printed output of the following Python snippet?',
    codeSnippet: `stack = []
stack.append(10)
stack.append(20)
stack.pop()
stack.append(30)
stack.append(40)
print(stack.pop() + stack[-1])`,
    options: ['70', '60', '50', '40'],
    correctAnswerIndex: 0,
    explanation: 'Trace: stack after appends and first pop is [10]. Then 30 and 40 are pushed: [10, 30, 40]. stack.pop() removes 40, leaving [10, 30]. stack[-1] peeks at 30. 40 + 30 = 70.',
    xpReward: 25
  },
  {
    id: 'q3',
    type: 'data-structure',
    topic: 'Real-world Architecture',
    difficulty: 'Intermediate',
    question: 'You are designing the "Undo" feature for a graphic design tool. Which data structure is most appropriate?',
    options: ['FIFO Queue', 'LIFO Stack', 'Binary Search Tree', 'Hash Set'],
    correctAnswerIndex: 1,
    explanation: 'Undo requires reverting the most recent action first. The Last-In, First-Out (LIFO) property of a Stack makes it the ideal choice.',
    xpReward: 20
  },
  {
    id: 'q4',
    type: 'find-bug',
    topic: 'Binary Search',
    difficulty: 'Intermediate',
    question: 'Find the bug in this binary search implementation when mid is updated:',
    codeSnippet: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid     # <-- Line A
        else:
            high = mid - 1
    return -1`,
    options: [
      'Line A should be: low = mid + 1 to prevent infinite loops',
      'The while condition must be low < high',
      'mid should be (low + high) / 2 without floor division',
      'Binary search cannot work on lists'
    ],
    correctAnswerIndex: 0,
    explanation: 'Setting low = mid instead of low = mid + 1 will cause an infinite loop whenever low and high are adjacent and arr[mid] < target.',
    xpReward: 30
  },
  {
    id: 'q5',
    type: 'complexity',
    topic: 'Trees & Traversals',
    difficulty: 'Intermediate',
    question: 'What is the time complexity of an Inorder traversal on a binary tree with N nodes?',
    options: ['O(log N)', 'O(N)', 'O(N log N)', 'O(N²)'],
    correctAnswerIndex: 1,
    explanation: 'Inorder traversal visits every single node in the tree exactly once to inspect its value, taking O(N) time.',
    xpReward: 25
  },
  {
    id: 'q6',
    type: 'data-structure',
    topic: 'Sets & Hash Tables',
    difficulty: 'Intermediate',
    question: 'Given two lists of IDs with 100,000 items each, what is the most efficient way to find common IDs?',
    options: [
      'Convert one list into a Set, then check each item of the second list against the set: O(N) time',
      'Nested loops comparing every pair of items: O(N²) time',
      'Sort both lists and perform linear search: O(N² log N) time',
      'Push all items onto a Stack and pop them: O(N) time'
    ],
    correctAnswerIndex: 0,
    explanation: 'Converting to a set takes O(N) time, and subsequent lookups take O(1) average time. Checking N items takes O(N * 1) = O(N) total time.',
    xpReward: 30
  },
  {
    id: 'q7',
    type: 'output',
    topic: 'Heaps & Priority Queues',
    difficulty: 'Advanced',
    question: 'What is the value at index 0 after running this Python heapq code?',
    codeSnippet: `import heapq
numbers = [45, 12, 85, 32, 89, 3, 67]
heapq.heapify(numbers)
print(numbers[0])`,
    options: ['45', '12', '3', '89'],
    correctAnswerIndex: 2,
    explanation: 'heapq implements a Min-Heap in Python. heapify() transforms the list in O(n) so that the minimum element (3) is placed at root index 0.',
    xpReward: 25
  },
  {
    id: 'q8',
    type: 'complexity',
    topic: 'Graph Traversals',
    difficulty: 'Advanced',
    question: 'What is the time complexity of Breadth-First Search (BFS) on a graph with V vertices and E edges using an adjacency list?',
    options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V * E)'],
    correctAnswerIndex: 2,
    explanation: 'BFS visits every reachable vertex once O(V) and checks every incident edge once O(E), yielding a total time complexity of O(V + E).',
    xpReward: 30
  },
  {
    id: 'q9',
    type: 'order-steps',
    topic: 'Merge Sort',
    difficulty: 'Intermediate',
    question: 'Which sequence correctly describes the divide-and-conquer strategy of Merge Sort?',
    options: [
      'Divide array into halves -> Recursively sort each half -> Merge sorted halves together',
      'Pick a pivot -> Partition into smaller and larger -> Recurse on partitions',
      'Find the minimum element -> Swap to the front -> Repeat for remaining subarray',
      'Compare adjacent elements -> Swap if out of order -> Bubble largest to the end'
    ],
    correctAnswerIndex: 0,
    explanation: 'Merge sort divides the array down to base cases of size 1, then merges the sorted sublists back up in O(N log N) guaranteed time.',
    xpReward: 25
  },
  {
    id: 'q10',
    type: 'complexity',
    topic: 'Big O Comparison',
    difficulty: 'Advanced',
    question: 'For an input size of N = 1,000, which complexity class produces approximately 10,000 operations?',
    options: ['O(N) (1,000 ops)', 'O(N log₂ N) (~10,000 ops)', 'O(N²) (1,000,000 ops)', 'O(2ⁿ) (unfathomable ops)'],
    correctAnswerIndex: 1,
    explanation: 'For N = 1,000, log₂ 1,000 ≈ 9.97. Therefore N log₂ N ≈ 1,000 * 10 = 10,000 operations.',
    xpReward: 35
  }
];
