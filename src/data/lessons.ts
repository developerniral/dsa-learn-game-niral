import { LevelPath } from '../types/game';

export const LEVEL_PATHS: LevelPath[] = [
  {
    id: 'level-1',
    levelNumber: 1,
    name: 'Array Explorer',
    subtitle: 'Contiguous memory, direct indexing, dynamic lists & linear search',
    themeColor: 'from-blue-600 to-cyan-500',
    icon: 'Layers',
    requiredLevelToUnlock: 1,
    lessons: [
      {
        id: 'array-basics',
        levelNumber: 1,
        levelId: 'level-1',
        title: 'Arrays & Python Lists',
        subtitle: 'Memory layout, 0-based indexing, and dynamic reallocation',
        description: 'Understand how arrays store sequential elements in contiguous memory blocks, granting instant O(1) random access.',
        category: 'data-structure',
        difficulty: 'Beginner',
        estimatedMinutes: 6,
        xpReward: 60,
        prerequisites: [],
        concept: 'In computer memory, a static array is a contiguous block of cells where each element is stored at memory address Base + (index * element_size). Because the offset calculation takes a single arithmetic step, reading or updating any element by index is constant time O(1). In Python, lists are implemented as dynamic arrays: when space runs out, Python automatically allocates a larger memory buffer (usually ~1.125x growth factor) and copies elements over, making append operations amortized O(1).',
        keyTakeaways: [
          'Random access by index is lightning-fast: O(1) time.',
          'Inserting or deleting at the front or middle requires shifting elements: O(n) time.',
          'Python lists are dynamic arrays, not linked lists.',
          'Appending to the end is amortized O(1).'
        ],
        pythonCode: `# Initializing a Python list (Dynamic Array)
scores = [85, 92, 78, 96, 88]

# 1. O(1) Access and In-Place Update
top_score = scores[3]      # 96 (constant time)
scores[0] = 89             # in-place modification

# 2. O(1) Amortized Append at the end
scores.append(100)         # [89, 92, 78, 96, 88, 100]

# 3. O(n) Insertion at arbitrary index (forces right-shift)
scores.insert(2, 95)       # [89, 92, 95, 78, 96, 88, 100]

# 4. O(n) Deletion by value
scores.remove(78)          # Shifts remaining elements left

print("Final scores:", scores)
print("Length:", len(scores))`,
        codeExplanation: [
          'Line 2: scores is assigned a dynamic array with 5 integer references.',
          'Line 5: scores[3] calculates the address offset directly and fetches 96 in O(1).',
          'Line 9: .append(100) places the new element into the pre-allocated spare capacity buffer.',
          'Line 12: .insert(2, 95) requires shifting every item from index 2 onward one slot to the right, which takes O(n) steps in the worst/average case.',
          'Line 15: .remove(78) searches for 78 (O(n)) then shifts elements to close the gap.'
        ],
        expectedOutput: `Final scores: [89, 92, 95, 96, 88, 100]
Length: 6`,
        commonMistakes: 'Using list.insert(0, val) or list.pop(0) in performance-critical loops. Both are O(n) because every single element in the array must be shifted in memory. For front operations, use collections.deque.',
        timeComplexity: {
          access: 'O(1)',
          search: 'O(n)',
          insertion: 'O(1) at end, O(n) at middle/front',
          deletion: 'O(1) at end, O(n) at middle/front',
          spaceComplexity: 'O(n)'
        },
        practiceTask: 'In the playground, insert a number into index 2 of an array and watch all higher index elements slide to make room.',
        quickCheck: {
          question: 'What is the time complexity of accessing an element at index i in a standard array?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctIndex: 0,
          explanation: 'Because array elements are stored in contiguous memory, memory_address = base_address + index * size. This calculation is a single arithmetic operation, resulting in O(1) constant time.'
        }
      },
      {
        id: 'linear-search-lesson',
        levelNumber: 1,
        levelId: 'level-1',
        title: 'Linear Search & Max Value',
        subtitle: 'Sequential scanning and boundary comparisons',
        description: 'Learn how to inspect elements sequentially when data is unsorted, and analyze best, average, and worst case execution paths.',
        category: 'algorithm',
        difficulty: 'Beginner',
        estimatedMinutes: 5,
        xpReward: 50,
        prerequisites: ['array-basics'],
        concept: 'When an array is not sorted, we have no prior knowledge of where a target value might reside. Therefore, our only option is to check each element one by one from index 0 to n-1. In the best case (target at index 0), it takes 1 comparison O(1). In the worst case (target is at the very end or absent), we must check all n elements, yielding O(n) time.',
        keyTakeaways: [
          'Linear search works on both sorted and unsorted collections.',
          'Requires no extra memory: O(1) auxiliary space.',
          'Worst-case runtime is O(n), making it inefficient for millions of records.'
        ],
        pythonCode: `def find_max(arr):
    if not arr:
        return None
    
    # Assume first element is the champion
    max_val = arr[0]
    comparisons = 0
    
    for x in arr[1:]:
        comparisons += 1
        if x > max_val:
            max_val = x
            
    return max_val, comparisons

data = [34, 12, 89, 5, 77, 91, 23]
result, steps = find_max(data)
print(f"Maximum: {result} found in {steps} comparisons")`,
        codeExplanation: [
          'Line 2: Guard against empty lists to avoid IndexError.',
          'Line 6: Initialize max_val to arr[0]. Never initialize to 0 or arbitrary numbers in case the array contains only negative numbers!',
          'Line 9: Iterate through the remaining n-1 elements and update max_val when a larger number is encountered.'
        ],
        expectedOutput: `Maximum: 91 found in 6 comparisons`,
        commonMistakes: 'Initializing max_value = 0 instead of arr[0]. If the array is [-10, -5, -2], a max_val of 0 will falsely report 0 as the maximum!',
        timeComplexity: {
          bestCase: 'O(1) (for search when target is first)',
          averageCase: 'O(n/2) = O(n)',
          worstCase: 'O(n)',
          spaceComplexity: 'O(1)'
        },
        practiceTask: 'Run the Linear Search visualizer in the Algorithm Lab on a 15-element array to watch the sequential scanning pointer.',
        quickCheck: {
          question: 'If an unsorted array contains 1,000,000 items and the target is not present, how many items must linear search examine?',
          options: ['1', '10', '1,000', '1,000,000'],
          correctIndex: 3,
          explanation: 'To confirm an item does not exist in an unsorted list, every single item must be checked until the end of the array is reached.'
        }
      }
    ]
  },
  {
    id: 'level-2',
    levelNumber: 2,
    name: 'Stack Master',
    subtitle: 'Last In, First Out (LIFO), call stacks & balanced parsing',
    themeColor: 'from-purple-600 to-indigo-500',
    icon: 'Layers',
    requiredLevelToUnlock: 2,
    lessons: [
      {
        id: 'stack-mechanics',
        levelNumber: 2,
        levelId: 'level-2',
        title: 'Stack Fundamentals (LIFO)',
        subtitle: 'Push, Pop, Peek, and call stack principles',
        description: 'Master the Last-In, First-Out (LIFO) paradigm used in browser history, undo/redo buffers, and function recursion.',
        category: 'data-structure',
        difficulty: 'Beginner',
        estimatedMinutes: 6,
        xpReward: 65,
        prerequisites: ['array-basics'],
        concept: 'A stack is a restricted linear data structure where additions and removals occur exclusively at one designated end called the "top". Think of a stack of clean plates: you place new plates on top and take plates off the top. Trying to remove from an empty stack triggers a "Stack Underflow", while exceeding allocated buffer memory triggers a "Stack Overflow".',
        keyTakeaways: [
          'LIFO: The element pushed most recently is always the first one popped.',
          'Push, Pop, and Peek are all guaranteed O(1) operations.',
          'In Python, a standard list serves as an efficient stack with .append() and .pop().'
        ],
        pythonCode: `# Stack implementation using a Python list
stack = []

# Push elements to the top of the stack: O(1)
stack.append("Page: /home")
stack.append("Page: /store")
stack.append("Page: /checkout")

# Peek at the top element without removing: O(1)
current_view = stack[-1]
print("Current top:", current_view)  # /checkout

# Pop top element (simulate user hitting Back button): O(1)
popped = stack.pop()
print("Navigated back from:", popped)
print("New top:", stack[-1])         # /store`,
        codeExplanation: [
          'Line 2: An empty list is initialized to hold stack frames.',
          'Lines 5-7: .append() puts items onto the end of the list (the top of our stack).',
          'Line 10: stack[-1] accesses the top item without mutating the structure.',
          'Line 14: .pop() removes and returns the top item in constant time O(1).'
        ],
        expectedOutput: `Current top: Page: /checkout
Navigated back from: Page: /checkout
New top: Page: /store`,
        commonMistakes: 'Popping from an empty list in Python raises IndexError. Always check `if stack:` before calling `stack.pop()`.',
        timeComplexity: {
          insertion: 'O(1) (push)',
          deletion: 'O(1) (pop)',
          access: 'O(1) (peek at top), O(n) arbitrary',
          search: 'O(n)',
          spaceComplexity: 'O(n)'
        },
        practiceTask: 'Head over to the Stack Playground, push 4 tokens, and observe how pop() always retrieves the last inserted element.',
        quickCheck: {
          question: 'Which of the following problems is naturally solved using a Stack?',
          options: ['Printer print-job queue', 'Checking for balanced parentheses in code', 'Finding shortest path between cities', 'Random access indexing'],
          correctIndex: 1,
          explanation: 'Checking balanced parentheses (e.g. {[()]}) requires matching each closing bracket with the most recently opened bracket, a quintessential LIFO problem.'
        }
      }
    ]
  },
  {
    id: 'level-3',
    levelNumber: 3,
    name: 'Queue Commander',
    subtitle: 'First In, First Out (FIFO), circular buffers & double-ended queues',
    themeColor: 'from-emerald-600 to-teal-500',
    icon: 'AlignJustify',
    requiredLevelToUnlock: 3,
    lessons: [
      {
        id: 'queue-mechanics',
        levelNumber: 3,
        levelId: 'level-3',
        title: 'Queue & collections.deque',
        subtitle: 'FIFO processing and why list.pop(0) is an anti-pattern',
        description: 'Understand First-In, First-Out (FIFO) queuing, job scheduling, and high-performance double-ended queues.',
        category: 'data-structure',
        difficulty: 'Beginner',
        estimatedMinutes: 6,
        xpReward: 65,
        prerequisites: ['stack-mechanics'],
        concept: 'A queue enforces FIFO (First-In, First-Out). Elements enter at the rear (enqueue) and exit at the front (dequeue). In Python, using `list.pop(0)` takes O(n) because every remaining element must shift left. Instead, the standard library provides `collections.deque` (double-ended queue), backed by a doubly linked list of fixed-size blocks, ensuring true O(1) appends and pops from both ends.',
        keyTakeaways: [
          'FIFO: The earliest item enqueued is the earliest to be serviced.',
          'Used in operating system task schedulers, printer queues, and BFS graph traversals.',
          'Always use collections.deque in Python for O(1) front pops.'
        ],
        pythonCode: `from collections import deque

# High-performance FIFO queue
ticket_queue = deque()

# 1. Enqueue customers at rear: O(1)
ticket_queue.append("Customer #101: Alice")
ticket_queue.append("Customer #102: Bob")
ticket_queue.append("Customer #103: Charlie")

# 2. Peek at next in line without removing: O(1)
print("Next to be served:", ticket_queue[0])

# 3. Dequeue customer from front: O(1)
served = ticket_queue.popleft()
print("Now serving:", served)
print("Remaining in queue:", list(ticket_queue))`,
        codeExplanation: [
          'Line 1: Imports deque from the collections module.',
          'Line 7-9: .append() puts new requests at the rear in O(1).',
          'Line 12: ticket_queue[0] peeks at the front item in O(1).',
          'Line 15: .popleft() extracts the front item in O(1) without shifting any elements.'
        ],
        expectedOutput: `Next to be served: Customer #101: Alice
Now serving: Customer #101: Alice
Remaining in queue: ['Customer #102: Bob', 'Customer #103: Charlie']`,
        commonMistakes: 'Using `queue.pop(0)` on a Python list. This creates an O(n) bottleneck inside loops that can slow programs down drastically as n grows.',
        timeComplexity: {
          insertion: 'O(1) (enqueue / append)',
          deletion: 'O(1) (dequeue / popleft)',
          access: 'O(1) at front/rear, O(n) middle',
          search: 'O(n)',
          spaceComplexity: 'O(n)'
        },
        practiceTask: 'In the Queue Playground, enqueue 5 items and dequeue 2 items. Notice how items exit from the front while newcomers join the back.',
        quickCheck: {
          question: 'Why is `collections.deque.popleft()` preferred over `list.pop(0)` in Python?',
          options: [
            'popleft() is O(1) while list.pop(0) shifts all elements taking O(n)',
            'popleft() can only store strings',
            'list.pop(0) deletes all elements at once',
            'deque uses zero memory'
          ],
          correctIndex: 0,
          explanation: 'In an array/list, removing the first item requires shifting all n-1 remaining elements left. deque uses linked blocks, allowing O(1) removal from the head.'
        }
      }
    ]
  },
  {
    id: 'level-4',
    levelNumber: 4,
    name: 'Set Specialist',
    subtitle: 'Hash tables, uniqueness guarantees & mathematical set operations',
    themeColor: 'from-amber-600 to-orange-500',
    icon: 'Radio',
    requiredLevelToUnlock: 4,
    lessons: [
      {
        id: 'set-operations',
        levelNumber: 4,
        levelId: 'level-4',
        title: 'Sets & Hash Table Lookups',
        subtitle: 'Average O(1) membership tests and Venn algebra',
        description: 'Harness the power of hash tables for instant element existence checks, deduplication, unions, and intersections.',
        category: 'data-structure',
        difficulty: 'Intermediate',
        estimatedMinutes: 6,
        xpReward: 70,
        prerequisites: ['queue-mechanics'],
        concept: 'A set is an unordered collection of distinct, hashable objects. Under the hood, Python sets are implemented as open-addressing hash tables. When you query `x in my_set`, Python calculates `hash(x)` and jumps directly to that bucket. This reduces membership checks from O(n) (for lists) to average O(1) time.',
        keyTakeaways: [
          'Duplicate values are automatically discarded.',
          'Average O(1) insertion, deletion, and membership lookups.',
          'Supports mathematical operations: Union (|), Intersection (&), Difference (-).',
          'Items must be immutable (hashable).'
        ],
        pythonCode: `# Deduplicating and testing membership
raw_tags = ["python", "dsa", "react", "python", "algorithms", "dsa"]
unique_tags = set(raw_tags)
print("Unique:", sorted(unique_tags))

# O(1) average membership check
is_present = "react" in unique_tags  # True

# Mathematical Set Operations
frontend_skills = {"html", "css", "javascript", "react"}
backend_skills = {"python", "sql", "docker", "javascript"}

# 1. Intersection: elements present in BOTH
both = frontend_skills & backend_skills
print("Full-stack bridge:", both)  # {'javascript'}

# 2. Union: all unique elements combined
all_skills = frontend_skills | backend_skills

# 3. Difference: only in frontend
frontend_only = frontend_skills - backend_skills
print("Frontend only:", frontend_only)`,
        codeExplanation: [
          'Line 3: Passing raw_tags to set() filters out duplicate occurrences in O(n) time.',
          'Line 7: Checking `x in unique_tags` computes hash(x) and evaluates in O(1) average time.',
          'Line 14: `&` performs intersection, producing a new set containing elements present in both.',
          'Line 21: `-` calculates set difference, subtracting backend_skills from frontend_skills.'
        ],
        expectedOutput: `Unique: ['algorithms', 'dsa', 'python', 'react']
Full-stack bridge: {'javascript'}
Frontend only: {'html', 'css', 'react'}`,
        commonMistakes: 'Attempting to add mutable objects (like lists or other sets) to a set. Elements must implement __hash__; to store sets within sets, use frozenset.',
        timeComplexity: {
          insertion: 'O(1) average, O(n) worst case (hash collisions)',
          deletion: 'O(1) average',
          search: 'O(1) average (membership test)',
          spaceComplexity: 'O(n)'
        },
        practiceTask: 'In the Set Playground, create two sets and visually compare their Union, Intersection, and Difference.',
        quickCheck: {
          question: 'What is the average time complexity of checking if an item exists in a Python set containing 500,000 items?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctIndex: 0,
          explanation: 'Python sets use hash tables. Computing the hash and probing the bucket takes O(1) constant time on average, regardless of whether there are 5 or 500,000 items.'
        }
      }
    ]
  },
  {
    id: 'level-5',
    levelNumber: 5,
    name: 'Tree Explorer',
    subtitle: 'Hierarchical nodes, Binary Search Trees & depth/breadth traversals',
    themeColor: 'from-green-600 to-emerald-500',
    icon: 'GitFork',
    requiredLevelToUnlock: 5,
    lessons: [
      {
        id: 'bst-traversal',
        levelNumber: 5,
        levelId: 'level-5',
        title: 'Binary Search Trees (BST)',
        subtitle: 'BST invariants, insertion, and DFS/BFS traversals',
        description: 'Explore hierarchical tree structures where left child < root < right child, enabling logarithmic search when balanced.',
        category: 'data-structure',
        difficulty: 'Intermediate',
        estimatedMinutes: 8,
        xpReward: 80,
        prerequisites: ['set-operations'],
        concept: 'A Binary Search Tree (BST) is a hierarchical node-based structure where for every node: all values in its left subtree are strictly smaller, and all values in its right subtree are strictly greater. In a balanced BST with height h = log₂(n), search, insertion, and deletion run in O(log n) time. Traversals visit nodes systematically: Inorder traversal (Left, Root, Right) always outputs values in strictly sorted ascending order.',
        keyTakeaways: [
          'Left subtree < Node < Right subtree.',
          'Inorder traversal yields sorted order.',
          'Search takes O(h) where h is tree height: O(log n) if balanced, O(n) if degenerate.',
          'Preorder is useful for copying trees; Postorder is used for deleting nodes.'
        ],
        pythonCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if not root:
        return Node(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def inorder_traversal(root):
    # Returns values in sorted order: Left -> Root -> Right
    if not root:
        return []
    return inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right)

# Constructing BST: 50 -> 30 -> 70 -> 20 -> 40
tree = None
for num in [50, 30, 70, 20, 40]:
    tree = insert(tree, num)

print("Inorder (Sorted):", inorder_traversal(tree))`,
        codeExplanation: [
          'Lines 1-5: Node definition with pointers to left and right children.',
          'Lines 7-14: Recursive insertion directs values smaller than root left, larger right.',
          'Lines 16-20: Inorder traversal recursively visits left child, appends current node, then visits right child, guaranteeing sorted output.'
        ],
        expectedOutput: `Inorder (Sorted): [20, 30, 40, 50, 70]`,
        commonMistakes: 'Inserting sequentially sorted data (e.g. 1, 2, 3, 4, 5) into an unbalanced BST. This turns the tree into a linked list of height n, degrading search from O(log n) to O(n). Self-balancing trees (AVL, Red-Black) solve this.',
        timeComplexity: {
          search: 'O(log n) balanced, O(n) worst case',
          insertion: 'O(log n) balanced, O(n) worst case',
          deletion: 'O(log n) balanced, O(n) worst case',
          spaceComplexity: 'O(n)'
        },
        practiceTask: 'Open the Tree Playground, insert values [50, 25, 75, 10, 30], and run the Inorder traversal animation.',
        quickCheck: {
          question: 'Which traversal of a Binary Search Tree produces elements in ascending numerical order?',
          options: ['Preorder (Root, Left, Right)', 'Inorder (Left, Root, Right)', 'Postorder (Left, Right, Root)', 'Level-order (BFS)'],
          correctIndex: 1,
          explanation: 'Inorder traversal processes the left subtree (all smaller values) first, then the root, then the right subtree (all larger values), guaranteeing ascending order.'
        }
      }
    ]
  },
  {
    id: 'level-6',
    levelNumber: 6,
    name: 'Graph Navigator',
    subtitle: 'Vertices, edges, adjacency lists & pathfinding (BFS / DFS)',
    themeColor: 'from-rose-600 to-pink-500',
    icon: 'Network',
    requiredLevelToUnlock: 6,
    lessons: [
      {
        id: 'graph-traversals',
        levelNumber: 6,
        levelId: 'level-6',
        title: 'Graph Traversals: BFS vs DFS',
        subtitle: 'Adjacency lists, shortest paths, and topological exploration',
        description: 'Learn how to represent networks of interconnected nodes and explore them level-by-level (BFS) or depth-first (DFS).',
        category: 'algorithm',
        difficulty: 'Intermediate',
        estimatedMinutes: 8,
        xpReward: 85,
        prerequisites: ['bst-traversal'],
        concept: 'A graph G = (V, E) consists of vertices (nodes) and edges (connections). Graphs can be directed or undirected, weighted or unweighted. Breadth-First Search (BFS) explores all neighbors at depth d before moving to depth d+1 using a Queue; it guarantees the shortest path in unweighted graphs. Depth-First Search (DFS) dives down a branch as far as possible before backtracking using a Stack or recursion.',
        keyTakeaways: [
          'Adjacency lists are space-efficient O(V + E) for sparse graphs.',
          'BFS uses a Queue and discovers the shortest path in unweighted graphs.',
          'DFS uses a Stack or recursion and is ideal for maze solving and cycle detection.',
          'Always maintain a visited set to avoid infinite loops on cyclical graphs.'
        ],
        pythonCode: `from collections import deque

# Graph represented as an Adjacency List
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

def bfs_shortest_path(graph, start, goal):
    queue = deque([[start]])
    visited = {start}
    
    while queue:
        path = queue.popleft()
        node = path[-1]
        
        if node == goal:
            return path
            
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(path + [neighbor])
                
    return None

shortest = bfs_shortest_path(graph, 'A', 'F')
print("Shortest path from A to F:", " -> ".join(shortest))`,
        codeExplanation: [
          'Line 4: An adjacency list maps each vertex to a list of its directly connected neighbors.',
          'Line 14: BFS initializes a FIFO queue holding paths, beginning with [start].',
          'Line 15: A visited set prevents reprocessing nodes, preventing infinite loops.',
          'Line 24: New paths are appended to the queue, ensuring exploration expands outward in concentric rings.'
        ],
        expectedOutput: `Shortest path from A to F: A -> C -> F`,
        commonMistakes: 'Forgetting to mark nodes as visited immediately upon adding to the queue. If you wait until a node is dequeued to mark it visited, duplicate nodes will flood the queue.',
        timeComplexity: {
          worstCase: 'O(V + E) time',
          spaceComplexity: 'O(V) for queue/stack and visited tracking'
        },
        practiceTask: 'In the Graph Playground, select a starting node and run both BFS and DFS to see the stark difference in exploration order.',
        quickCheck: {
          question: 'Which traversal algorithm guarantees finding the path with the fewest edges between two nodes in an unweighted graph?',
          options: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Inorder traversal', 'Linear scan'],
          correctIndex: 0,
          explanation: 'BFS explores nodes in order of their distance (edges) from the source (distance 0, then distance 1, then distance 2), so the first time the goal is reached, the path is minimal.'
        }
      }
    ]
  },
  {
    id: 'level-7',
    levelNumber: 7,
    name: 'Heap Hero',
    subtitle: 'Binary heaps, complete binary trees & priority queues',
    themeColor: 'from-teal-600 to-cyan-500',
    icon: 'Crown',
    requiredLevelToUnlock: 7,
    lessons: [
      {
        id: 'heap-mechanics',
        levelNumber: 7,
        levelId: 'level-7',
        title: 'Min-Heaps, Max-Heaps & heapq',
        subtitle: 'The heap invariant, sift-up, sift-down, and priority queues',
        description: 'Understand binary heaps: complete trees compactly stored in flat arrays where parent is always smaller (min-heap) or greater (max-heap).',
        category: 'data-structure',
        difficulty: 'Advanced',
        estimatedMinutes: 8,
        xpReward: 90,
        prerequisites: ['graph-traversals'],
        concept: 'A binary heap is a complete binary tree that satisfies the Heap Property. In a min-heap, for any given node C, parent P <= C. Because it is a complete tree with no holes, it can be mapped into a 1D array where for an index i: Left child = 2i + 1, Right child = 2i + 2, and Parent = (i - 1) // 2. Inserting requires adding to the array end and "sifting up" in O(log n). Extracting the minimum swaps the root with the last element and "sifts down" in O(log n).',
        keyTakeaways: [
          'Root element is always the minimum (min-heap) or maximum (max-heap) in O(1) peek time.',
          'Extract-min and Insert take O(log n) time.',
          'Building a heap from an unsorted array (heapify) takes O(n) linear time, not O(n log n).',
          'Python heapq module provides a min-heap implementation.'
        ],
        pythonCode: `import heapq

# Python heapq implements a MIN-HEAP by default
task_pq = []

# Push tasks with priority numbers (lower number = higher urgency)
heapq.heappush(task_pq, (3, "Code review"))
heapq.heappush(task_pq, (1, "Production server outage!"))
heapq.heappush(task_pq, (4, "Reply to emails"))
heapq.heappush(task_pq, (2, "Fix login CSS bug"))

# Peek at highest priority item without popping: O(1)
highest_priority = task_pq[0]
print("Top priority:", highest_priority)

# Extract items in priority order: O(log n) each
print("\\nProcessing tasks:")
while task_pq:
    priority, task = heapq.heappop(task_pq)
    print(f"[{priority}] Executed: {task}")`,
        codeExplanation: [
          'Line 1: Imports Python standard heapq module.',
          'Line 7-10: heappush() appends the tuple to the list and performs sift-up to preserve the min-heap invariant.',
          'Line 13: task_pq[0] is guaranteed to be the minimum item in O(1).',
          'Line 18: heappop() removes the root, moves the last leaf to index 0, and sifts it down to restore the invariant in O(log n).'
        ],
        expectedOutput: `Top priority: (1, 'Production server outage!')

Processing tasks:
[1] Executed: Production server outage!
[2] Executed: Fix login CSS bug
[3] Executed: Code review
[4] Executed: Reply to emails`,
        commonMistakes: 'Expecting heapq to keep the entire underlying list sorted. A heap only guarantees that parents are smaller than their children; index 1 is not necessarily smaller than index 2.',
        timeComplexity: {
          insertion: 'O(log n) (heappush)',
          deletion: 'O(log n) (heappop extract min)',
          access: 'O(1) (peek at root)',
          spaceComplexity: 'O(n)'
        },
        practiceTask: 'In the Heap Playground, insert random numbers and watch how the heap property is preserved in both the tree visualizer and the array view simultaneously.',
        quickCheck: {
          question: 'In a 0-indexed binary heap stored in an array, what is the formula to find the left child of an element at index i?',
          options: ['2 * i + 1', '2 * i + 2', '(i - 1) // 2', 'i + 2'],
          correctIndex: 0,
          explanation: 'In a complete binary tree stored in an array, index i has left child at 2i + 1, right child at 2i + 2, and parent at (i - 1) // 2.'
        }
      }
    ]
  },
  {
    id: 'level-8',
    levelNumber: 8,
    name: 'Big O Arena',
    subtitle: 'Asymptotic notation, growth orders & interview efficiency mastery',
    themeColor: 'from-amber-500 to-red-500',
    icon: 'Activity',
    requiredLevelToUnlock: 8,
    lessons: [
      {
        id: 'big-o-foundations',
        levelNumber: 8,
        levelId: 'level-8',
        title: 'Asymptotic Analysis & Big O Mastery',
        subtitle: 'Classifying O(1), O(log n), O(n), O(n log n), O(n²), and O(2ⁿ)',
        description: 'Understand how algorithms scale as input size N grows toward infinity. Big O measures operational growth, not clock seconds.',
        category: 'analysis',
        difficulty: 'Advanced',
        estimatedMinutes: 8,
        xpReward: 100,
        prerequisites: ['heap-mechanics'],
        concept: 'Big O notation characterizes the upper bound of an algorithm execution steps as the input size n approaches infinity. It ignores constant coefficients (e.g. 5n + 10 becomes O(n)) and lower-order terms (e.g. n² + 100n becomes O(n²)) because for sufficiently large inputs, the dominant term dictates scaling behavior. Common classes in increasing order of growth: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!).',
        keyTakeaways: [
          'Big O measures how operations scale with input size, not wall-clock time in seconds.',
          'Drop constant multipliers and non-dominant terms.',
          'Logarithmic O(log n) algorithms (like binary search) cut the search space in half each step.',
          'Quadratic O(n²) algorithms (like nested loops over the same array) become unviable for large n.'
        ],
        pythonCode: `# Comparing loop patterns and their Big O complexities

# 1. Constant Time: O(1)
def get_head(items):
    return items[0] if items else None

# 2. Logarithmic Time: O(log n) - Halving input each step
def count_halvings(n):
    steps = 0
    while n > 1:
        n //= 2
        steps += 1
    return steps

# 3. Linear Time: O(n) - Single loop through items
def sum_all(items):
    total = 0
    for x in items:
        total += x
    return total

# 4. Quadratic Time: O(n^2) - Nested loop over items
def find_all_pairs(items):
    pairs = []
    for a in items:
        for b in items:
            pairs.append((a, b))
    return pairs

print("Halvings for 1,000,000:", count_halvings(1_000_000))  # Only 19 steps!`,
        codeExplanation: [
          'Lines 4-5: O(1) takes the exact same number of machine steps regardless of whether items has 10 or 10,000,000 elements.',
          'Lines 8-13: O(log n) halves n each iteration. For n = 1,000,000, it completes in just 20 iterations!',
          'Lines 16-20: O(n) visits each item once. If n doubles, iterations double.',
          'Lines 23-28: O(n²) executes the inner loop n times for each of the n outer iterations (n * n = n²). If n = 10,000, operations reach 100,000,000.'
        ],
        expectedOutput: `Halvings for 1,000,000: 19`,
        commonMistakes: 'Assuming two sequential loops mean O(n²). A function with `for x in arr:` followed by `for y in arr:` runs in O(n + n) = O(2n) = O(n), NOT O(n²). Only nested loops multiply.',
        timeComplexity: {
          worstCase: 'Scales by growth hierarchy: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)',
          spaceComplexity: 'Auxiliary memory allocated during execution'
        },
        practiceTask: 'Visit the Big O Arena to interactively plot and compare complexity curves against different input sizes up to N=100.',
        quickCheck: {
          question: 'If an algorithm contains two non-nested loops, each iterating over an array of size n, what is its overall time complexity?',
          options: ['O(n²)', 'O(n)', 'O(log n)', 'O(2ⁿ)'],
          correctIndex: 1,
          explanation: 'Running loop 1 takes O(n) and loop 2 takes O(n). Total = O(n + n) = O(2n). In asymptotic Big O notation, constant coefficients are dropped, giving O(n).'
        }
      }
    ]
  }
];
