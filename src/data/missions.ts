import { CodingMission } from '../types/game';

export const CODING_MISSIONS: CodingMission[] = [
  {
    id: 'mission-1',
    title: 'Find Duplicates in a List',
    category: 'Arrays & Hash Sets',
    difficulty: 'Easy',
    description: 'Given an integer list, identify if any value appears at least twice.',
    problemStatement: `Write an efficient function has_duplicate(nums) that returns True if any value appears at least twice in the list, and False if every element is distinct.

Can you solve it in O(n) time using a Set instead of an O(n²) nested loop?`,
    starterCode: `def has_duplicate(nums):
    # Your mission: return True if duplicates exist, False otherwise
    seen = set()
    for num in nums:
        # TODO: Check if num is already in seen
        pass
    return False`,
    solutionCode: `def has_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
    hints: [
      'Hint 1: A brute-force comparison of every pair takes O(n²). Can we trade a little space for speed?',
      'Hint 2: A Python Set provides O(1) average lookup time. As you iterate, store items you have already observed.',
      'Hint 3: In each step of the loop, check `if num in seen: return True`. If not, do `seen.add(num)`.'
    ],
    testCases: [
      { inputDesc: '[1, 2, 3, 1]', expectedOutput: 'True' },
      { inputDesc: '[1, 2, 3, 4]', expectedOutput: 'False' },
      { inputDesc: '[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]', expectedOutput: 'True' }
    ],
    explanation: 'By using a hash set, we reduce the time complexity from O(n²) to O(n) linear time. We do a single pass over the array and do O(1) membership lookups for each element.',
    complexityAnalysis: {
      time: 'O(n) - Single pass through nums array with O(1) hash lookups',
      space: 'O(n) - Up to n elements stored in the seen set in the worst case',
      notes: 'An alternative is len(nums) != len(set(nums)), which is also O(n) and idiomatic in Python.'
    },
    xpReward: 60
  },
  {
    id: 'mission-2',
    title: 'Reverse a String Using a Stack',
    category: 'Stacks (LIFO)',
    difficulty: 'Easy',
    description: 'Utilize the Last-In, First-Out property of a stack to reverse characters.',
    problemStatement: `Implement reverse_string(s) using an explicit Python list as a stack.
1. Push each character of the string onto the stack.
2. Pop each character from the stack to construct the reversed string.`,
    starterCode: `def reverse_string(s):
    stack = []
    # 1. Push all characters to the stack
    for char in s:
        stack.append(char)
        
    reversed_chars = []
    # 2. Pop all characters off the stack
    # TODO: While stack has items, pop and append to reversed_chars
    
    return "".join(reversed_chars)`,
    solutionCode: `def reverse_string(s):
    stack = []
    for char in s:
        stack.append(char)
        
    reversed_chars = []
    while stack:
        reversed_chars.append(stack.pop())
        
    return "".join(reversed_chars)`,
    hints: [
      'Hint 1: Recall that stack.pop() removes and returns the most recently appended element (LIFO).',
      'Hint 2: Use `while stack:` to loop until the stack is completely empty.',
      'Hint 3: Inside the loop, call `stack.pop()` and add the returned character into your result collector.'
    ],
    testCases: [
      { inputDesc: '"algorithm"', expectedOutput: '"mhtirogla"' },
      { inputDesc: '"hello"', expectedOutput: '"olleh"' },
      { inputDesc: '"a"', expectedOutput: '"a"' }
    ],
    explanation: 'Because stacks are Last-In, First-Out (LIFO), pushing letters in original order (A, B, C) and popping them out produces the reverse order (C, B, A).',
    complexityAnalysis: {
      time: 'O(n) - Two sequential loops of length n each (2n steps = O(n))',
      space: 'O(n) - Auxiliary space to store the stack frames and reversed characters',
      notes: 'In Python, s[::-1] is optimized in C, but using a stack demonstrates call stack and parsing mechanics.'
    },
    xpReward: 60
  },
  {
    id: 'mission-3',
    title: 'Simulate a Printer Queue',
    category: 'Queues (FIFO)',
    difficulty: 'Medium',
    description: 'Process incoming documents in the exact order they arrive using collections.deque.',
    problemStatement: `Simulate an office printer queue. Incoming jobs arrive as tuples (document_name, page_count).
Implement process_printer_jobs(jobs) which:
1. Enqueues all incoming jobs into a collections.deque.
2. Dequeues each job from the front and records formatted log strings: "Printed <name> (<pages> pages)".
3. Returns the list of processed logs.`,
    starterCode: `from collections import deque

def process_printer_jobs(jobs):
    queue = deque()
    # 1. Enqueue all jobs
    for job in jobs:
        queue.append(job)
        
    logs = []
    # 2. Dequeue from front and format string
    # TODO: Pop from left while queue is not empty
    
    return logs`,
    solutionCode: `from collections import deque

def process_printer_jobs(jobs):
    queue = deque()
    for job in jobs:
        queue.append(job)
        
    logs = []
    while queue:
        doc_name, pages = queue.popleft()
        logs.append(f"Printed {doc_name} ({pages} pages)")
        
    return logs`,
    hints: [
      'Hint 1: Use `queue.popleft()` instead of `pop()` to ensure First-In, First-Out (FIFO) processing order.',
      'Hint 2: Unpack the tuple with `doc_name, pages = queue.popleft()`.',
      'Hint 3: Append the formatted string `f"Printed {doc_name} ({pages} pages)"` to your logs array.'
    ],
    testCases: [
      { inputDesc: '[("Resume.pdf", 2), ("Report.docx", 10)]', expectedOutput: '["Printed Resume.pdf (2 pages)", "Printed Report.docx (10 pages)"]' },
      { inputDesc: '[("Contract.pdf", 5)]', expectedOutput: '["Printed Contract.pdf (5 pages)"]' }
    ],
    explanation: 'Using deque.popleft() guarantees true O(1) dequeue operations, preserving arrival order without incurring the O(n) array shift penalty of standard list.pop(0).',
    complexityAnalysis: {
      time: 'O(n) - Each document is enqueued in O(1) and dequeued in O(1)',
      space: 'O(n) - The deque holds up to n document jobs in memory',
      notes: 'FIFO queue fairness is vital for network packet dispatching and task scheduling.'
    },
    xpReward: 70
  },
  {
    id: 'mission-4',
    title: 'Find Common Elements Between Two Sets',
    category: 'Set Algebra',
    difficulty: 'Easy',
    description: 'Compute the intersection of user permission lists.',
    problemStatement: `Given two lists of security roles user_roles and admin_roles, write find_shared_permissions(user_roles, admin_roles) returning a sorted list of roles present in both lists.`,
    starterCode: `def find_shared_permissions(user_roles, admin_roles):
    # TODO: Convert to sets, compute intersection, and return sorted list
    pass`,
    solutionCode: `def find_shared_permissions(user_roles, admin_roles):
    set_a = set(user_roles)
    set_b = set(admin_roles)
    shared = set_a & set_b  # or set_a.intersection(set_b)
    return sorted(list(shared))`,
    hints: [
      'Hint 1: Turn both input lists into sets: `set_a = set(user_roles)` and `set_b = set(admin_roles)`.',
      'Hint 2: The `&` operator computes set intersection (elements present in both sets).',
      'Hint 3: Convert the resulting set to a list and wrap with `sorted()` to pass test cases.'
    ],
    testCases: [
      { inputDesc: '["read", "write", "upload"], ["write", "delete", "read"]', expectedOutput: '["read", "write"]' },
      { inputDesc: '["guest"], ["admin", "root"]', expectedOutput: '[]' }
    ],
    explanation: 'Set intersection evaluates in O(len(set_a) + len(set_b)) time by hashing elements, vastly outperforming nested O(A * B) array comparisons.',
    complexityAnalysis: {
      time: 'O(A + B + K log K) where K is number of shared roles for final sort',
      space: 'O(A + B) for the hash set allocations',
      notes: 'In Python, set_a.intersection(set_b) automatically probes the smaller set against the larger set.'
    },
    xpReward: 65
  },
  {
    id: 'mission-5',
    title: 'Search Sorted Array with Binary Search',
    category: 'Binary Search',
    difficulty: 'Medium',
    description: 'Find target value index in a strictly sorted array in O(log n) time.',
    problemStatement: `Given a sorted array of distinct integers nums and a target value, write binary_search(nums, target).
Return the 0-based index of target if found, or -1 if target is not in nums.
Must run in logarithmic O(log n) time.`,
    starterCode: `def binary_search(nums, target):
    left = 0
    right = len(nums) - 1
    
    while left <= right:
        # TODO: Calculate mid index
        # TODO: Compare nums[mid] with target and update left/right
        pass
        
    return -1`,
    solutionCode: `def binary_search(nums, target):
    left = 0
    right = len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1`,
    hints: [
      'Hint 1: Calculate midpoint index with `mid = (left + right) // 2`.',
      'Hint 2: If `nums[mid] < target`, the target must lie in the right half, so set `left = mid + 1`.',
      'Hint 3: If `nums[mid] > target`, the target must lie in the left half, so set `right = mid - 1`.'
    ],
    testCases: [
      { inputDesc: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', expectedOutput: '4' },
      { inputDesc: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', expectedOutput: '-1' }
    ],
    explanation: 'By dividing the search space in half with every comparison, binary search cuts 1,000,000 items down to a single candidate in only 20 steps (log₂ 1,000,000 ≈ 20).',
    complexityAnalysis: {
      time: 'O(log n) - Search range halves each iteration',
      space: 'O(1) - Only two pointers left and right are tracked',
      notes: 'Requires the input list to be strictly sorted beforehand.'
    },
    xpReward: 80
  },
  {
    id: 'mission-6',
    title: 'Inorder Traversal of Binary Tree',
    category: 'Trees & Traversals',
    difficulty: 'Medium',
    description: 'Retrieve values of a binary tree in strictly sorted ascending order.',
    problemStatement: `Given the root of a Binary Search Tree (where each node has .val, .left, .right attributes), write inorder_traversal(root) returning a list of values ordered as Left -> Root -> Right.`,
    starterCode: `# Node definition:
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def inorder_traversal(root):
    # TODO: Implement recursive or iterative Inorder traversal
    pass`,
    solutionCode: `def inorder_traversal(root):
    result = []
    
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        result.append(node.val)
        dfs(node.right)
        
    dfs(root)
    return result`,
    hints: [
      'Hint 1: Inorder follows the rhythm: visit left subtree first, record current node value, then visit right subtree.',
      'Hint 2: Base case for recursion: if `node is None`, simply return.',
      'Hint 3: In a valid BST, Inorder traversal is mathematically guaranteed to output values in ascending order.'
    ],
    testCases: [
      { inputDesc: 'BST with nodes [4, 2, 7, 1, 3]', expectedOutput: '[1, 2, 3, 4, 7]' },
      { inputDesc: 'BST with root [2, 1, 3]', expectedOutput: '[1, 2, 3]' }
    ],
    explanation: 'Inorder traversal recursively exhausts all values smaller than root by traversing all the way left, records node values upon ascending back up, then explores right subtrees.',
    complexityAnalysis: {
      time: 'O(n) - Every node in the tree is visited once',
      space: 'O(h) - Auxiliary call stack space proportional to tree height h',
      notes: 'For a balanced tree, height is O(log n); for a degenerate linked tree, height is O(n).'
    },
    xpReward: 85
  },
  {
    id: 'mission-7',
    title: 'Find Shortest Path with BFS',
    category: 'Graph Traversals',
    difficulty: 'Hard',
    description: 'Find the minimum hops between two nodes in an unweighted social network graph.',
    problemStatement: `Implement shortest_network_path(graph, start, end) using Breadth-First Search (BFS).
The graph is given as an adjacency dictionary: { "Alice": ["Bob", "Claire"], ... }.
Return the list representing the path with the fewest edges, or None if no path exists.`,
    starterCode: `from collections import deque

def shortest_network_path(graph, start, end):
    # TODO: Initialize queue with path [start] and visited set
    # TODO: Explore neighbors level by level
    pass`,
    solutionCode: `from collections import deque

def shortest_network_path(graph, start, end):
    if start == end:
        return [start]
        
    queue = deque([[start]])
    visited = {start}
    
    while queue:
        path = queue.popleft()
        current_node = path[-1]
        
        if current_node == end:
            return path
            
        for neighbor in graph.get(current_node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(path + [neighbor])
                
    return None`,
    hints: [
      'Hint 1: Store the entire current path in each queue entry, e.g. `deque([[start]])`.',
      'Hint 2: When inspecting `current = path[-1]`, if it equals `end`, immediately return `path`.',
      'Hint 3: Mark `neighbor` in `visited` immediately when adding to the queue to prevent redundant explorations.'
    ],
    testCases: [
      { inputDesc: 'graph, start="A", end="D"', expectedOutput: '["A", "C", "D"]' },
      { inputDesc: 'graph, start="A", end="Disconnected"', expectedOutput: 'None' }
    ],
    explanation: 'Because BFS processes nodes strictly by path length (all 1-hop paths, then all 2-hop paths, etc.), the very first path that hits the target is guaranteed to have the minimal number of edges.',
    complexityAnalysis: {
      time: 'O(V + E) - Visits vertices and explores edges once',
      space: 'O(V) - Tracks visited nodes and queue memory',
      notes: 'Dijkstra algorithm is an extension of BFS using a min-heap for weighted graphs.'
    },
    xpReward: 95
  },
  {
    id: 'mission-8',
    title: 'Maintain a Min-Heap (Kth Smallest)',
    category: 'Heaps & Priority Queues',
    difficulty: 'Medium',
    description: 'Find the Kth smallest element in an unsorted stream using heapq.',
    problemStatement: `Write find_kth_smallest(nums, k) that returns the k-th smallest element from an unsorted list nums (1-indexed).
Use Python standard heapq module.`,
    starterCode: `import heapq

def find_kth_smallest(nums, k):
    # TODO: Heapify nums in O(n) or push elements
    # TODO: Pop k times to retrieve the k-th smallest
    pass`,
    solutionCode: `import heapq

def find_kth_smallest(nums, k):
    # Create min-heap in O(n)
    heap = list(nums)
    heapq.heapify(heap)
    
    kth_val = None
    for _ in range(k):
        kth_val = heapq.heappop(heap)
        
    return kth_val`,
    hints: [
      'Hint 1: `heapq.heapify(heap)` transforms a list into a valid min-heap in linear O(n) time.',
      'Hint 2: In a min-heap, each call to `heapq.heappop(heap)` extracts the current minimum in O(log n).',
      'Hint 3: Popping k times yields the 1st smallest, 2nd smallest, ... up to the k-th smallest.'
    ],
    testCases: [
      { inputDesc: 'nums = [7, 10, 4, 3, 20, 15], k = 3', expectedOutput: '7' },
      { inputDesc: 'nums = [7, 10, 4, 3, 20, 15], k = 1', expectedOutput: '3' }
    ],
    explanation: 'Heapifying takes O(n). Then extracting k times takes k * O(log n). Total time is O(n + k log n), which is much faster than sorting the entire array O(n log n) when k << n.',
    complexityAnalysis: {
      time: 'O(n + k log n) - O(n) heapify followed by k extractions',
      space: 'O(n) - Stores heap array copy',
      notes: 'For streaming data or finding Top-K largest, a fixed-size heap of size k runs in O(n log k).'
    },
    xpReward: 85
  },
  {
    id: 'mission-9',
    title: 'Determine Complexity of Mystery Functions',
    category: 'Big O Analysis',
    difficulty: 'Medium',
    description: 'Analyze loop growth rates and predict whether function is O(N) or O(N²).',
    problemStatement: `Analyze the mystery function below:
\`\`\`python
def mystery(n):
    count = 0
    i = 1
    while i < n:
        j = 0
        while j < n:
            count += 1
            j += 1
        i *= 2
    return count
\`\`\`
Determine its asymptotic time complexity Big O and explain why.`,
    starterCode: `def analyze_mystery():
    # Return a dictionary with:
    # "complexity": "<Big O string e.g. O(N) or O(N log N) or O(N^2)>"
    # "outer_loop": "<explanation of outer loop steps>"
    # "inner_loop": "<explanation of inner loop steps>"
    return {
        "complexity": "O(N log N)",
        "outer_loop": "Doubles i each step, executing log2(n) times",
        "inner_loop": "Increments j by 1 up to n, executing n times per outer iteration"
    }`,
    solutionCode: `def analyze_mystery():
    return {
        "complexity": "O(N log N)",
        "outer_loop": "Doubles i each step, executing log2(n) times",
        "inner_loop": "Increments j by 1 up to n, executing n times per outer iteration"
    }`,
    hints: [
      'Hint 1: Look at the outer loop: `i` starts at 1 and does `i *= 2`. How many times can you double a number until reaching n?',
      'Hint 2: Doubling each time means the outer loop runs log₂(n) times.',
      'Hint 3: Look at the inner loop: `j` runs from 0 to n linearly, which is n iterations. Combining them gives n * log₂(n) = O(n log n).'
    ],
    testCases: [
      { inputDesc: 'analyze_mystery()["complexity"]', expectedOutput: '"O(N log N)"' }
    ],
    explanation: 'The outer loop is logarithmic O(log n) because i grows exponentially (1, 2, 4, 8...). For each of those log n outer iterations, the inner loop executes n times. Therefore total steps = n * log n = O(n log n).',
    complexityAnalysis: {
      time: 'O(N log N)',
      space: 'O(1)',
      notes: 'Recognizing loop step patterns (i *= 2 vs i += 1) is key to analyzing algorithms like Merge Sort and Heap Sort.'
    },
    xpReward: 90
  }
];
