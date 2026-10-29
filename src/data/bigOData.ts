export interface ComplexityClass {
  id: string;
  name: string;
  symbol: string;
  nickname: string;
  color: string;
  calculateOps: (n: number) => number;
  description: string;
  exampleAlgorithm: string;
  pythonSnippet: string;
  verdict: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Catastrophic';
}

export const COMPLEXITY_CLASSES: ComplexityClass[] = [
  {
    id: 'o-1',
    name: 'Constant Time',
    symbol: 'O(1)',
    nickname: 'Instant Access',
    color: '#10B981', // emerald-500
    calculateOps: () => 1,
    description: 'Execution time remains strictly constant regardless of input volume. Array index access, stack push/pop, hash map lookup.',
    exampleAlgorithm: 'Array indexing, hash table access, stack peek',
    pythonSnippet: `def get_first_element(items):
    # Always 1 memory lookup step, whether len(items) is 10 or 10,000,000
    return items[0] if items else None`,
    verdict: 'Excellent'
  },
  {
    id: 'o-log-n',
    name: 'Logarithmic Time',
    symbol: 'O(log n)',
    nickname: 'Divide & Conquer',
    color: '#06B6D4', // cyan-500
    calculateOps: (n: number) => Math.max(1, Math.round(Math.log2(Math.max(1, n)))),
    description: 'Input size is divided by a constant factor (usually halved) with each iteration. Extremely scalable: for n = 1,000,000, log₂(n) is only ~20 operations.',
    exampleAlgorithm: 'Binary search, balanced BST search, heap push/pop',
    pythonSnippet: `def binary_search(arr, target):
    # Halves the search space every single iteration
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    verdict: 'Excellent'
  },
  {
    id: 'o-n',
    name: 'Linear Time',
    symbol: 'O(n)',
    nickname: 'Proportional Growth',
    color: '#3B82F6', // blue-500
    calculateOps: (n: number) => n,
    description: 'Execution operations scale directly in 1:1 proportion to the input size. If input doubles, runtime doubles.',
    exampleAlgorithm: 'Linear search, finding maximum, array traversal',
    pythonSnippet: `def find_max(items):
    # Must inspect each element exactly once
    max_val = items[0]
    for x in items[1:]:
        if x > max_val:
            max_val = x
    return max_val`,
    verdict: 'Good'
  },
  {
    id: 'o-n-log-n',
    name: 'Linearithmic Time',
    symbol: 'O(n log n)',
    nickname: 'Optimal Comparison Sorting',
    color: '#8B5CF6', // purple-500
    calculateOps: (n: number) => Math.max(1, Math.round(n * Math.log2(Math.max(1, n)))),
    description: 'Divide and conquer combined with linear reconstruction. The theoretical lower bound for general comparison-based sorting.',
    exampleAlgorithm: 'Merge Sort, Quick Sort (average), Heap Sort',
    pythonSnippet: `def merge_sort(arr):
    # Splits array into log(n) levels, merging takes n steps per level
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)  # Linear merge O(n)`,
    verdict: 'Fair'
  },
  {
    id: 'o-n2',
    name: 'Quadratic Time',
    symbol: 'O(n²)',
    nickname: 'Nested Traversal',
    color: '#F59E0B', // amber-500
    calculateOps: (n: number) => n * n,
    description: 'Every element in the input is compared with every other element via nested loops. Becomes impractical as n exceeds a few thousand.',
    exampleAlgorithm: 'Bubble Sort, Selection Sort, Insertion Sort (worst)',
    pythonSnippet: `def has_duplicate_naive(items):
    # Outer loop runs n times, inner loop runs n times = n * n operations
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j]:
                return True
    return False`,
    verdict: 'Poor'
  },
  {
    id: 'o-2n',
    name: 'Exponential Time',
    symbol: 'O(2ⁿ)',
    nickname: 'Combinatorial Explosion',
    color: '#EF4444', // red-500
    calculateOps: (n: number) => Math.min(1000000, Math.pow(2, n)),
    description: 'Operations double with each additional input element. Impractical for n > 30 unless pruned with dynamic programming memoization.',
    exampleAlgorithm: 'Naive recursive Fibonacci, finding all subsets (power set)',
    pythonSnippet: `def fibonacci_naive(n):
    # Generates 2 recursive calls for each node in a binary call tree
    if n <= 1:
        return n
    return fibonacci_naive(n - 1) + fibonacci_naive(n - 2)`,
    verdict: 'Catastrophic'
  }
];

export interface CodeClassificationChallenge {
  id: string;
  title: string;
  code: string;
  correctClass: string;
  explanation: string;
  loopPattern: string;
}

export const CODE_CHALLENGES: CodeClassificationChallenge[] = [
  {
    id: 'c1',
    title: 'Single Loop Over List',
    code: `def calculate_sum(nums):
    total = 0
    for x in nums:
        total += x
    return total`,
    correctClass: 'O(n)',
    explanation: 'The loop visits each of the n elements in nums exactly once and performs a constant-time addition.',
    loopPattern: 'Single sequential loop'
  },
  {
    id: 'c2',
    title: 'Halving While Loop',
    code: `def divide_until_one(n):
    steps = 0
    while n > 1:
        n = n // 2
        steps += 1
    return steps`,
    correctClass: 'O(log n)',
    explanation: 'The variable n is halved in each step. The number of times you can divide n by 2 before reaching 1 is log₂(n).',
    loopPattern: 'Logarithmic division loop'
  },
  {
    id: 'c3',
    title: 'Nested Matrix Traversal',
    code: `def print_multiplication_table(n):
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            print(f"{i * j}", end=" ")
        print()`,
    correctClass: 'O(n²)',
    explanation: 'For each of the n iterations of the outer loop, the inner loop runs n times. n * n = n² operations.',
    loopPattern: 'Double nested loop'
  },
  {
    id: 'c4',
    title: 'Sequential Non-Nested Loops',
    code: `def process_data(arr):
    # Loop 1
    for x in arr:
        print(x)
    # Loop 2
    for y in arr:
        print(y * 2)`,
    correctClass: 'O(n)',
    explanation: 'These loops are sequential, not nested! Time is O(n + n) = O(2n). In Big O notation, constant factors are dropped, resulting in O(n).',
    loopPattern: 'Two sequential non-nested loops'
  },
  {
    id: 'c5',
    title: 'Direct Dictionary Lookup',
    code: `def get_user_email(users_dict, user_id):
    if user_id in users_dict:
        return users_dict[user_id]
    return None`,
    correctClass: 'O(1)',
    explanation: 'Python dictionaries use hash tables. Computing the hash and retrieving the value takes average O(1) constant time regardless of dictionary size.',
    loopPattern: 'Constant time hash lookup'
  }
];
