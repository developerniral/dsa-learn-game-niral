import { AlgorithmStep } from '../types/dsa';

export function generateBubbleSortSteps(initial: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...initial];
  const n = arr.length;
  const sortedIndices: number[] = [];

  steps.push({
    array: [...arr],
    message: `Starting Bubble Sort with ${n} elements. We compare adjacent pairs and swap if out of order.`,
    sortedIndices: []
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        comparingIndices: [j, j + 1],
        sortedIndices: [...sortedIndices],
        message: `Comparing arr[${j}] = ${arr[j]} and arr[${j + 1}] = ${arr[j + 1]}`
      });

      if (arr[j] > arr[j + 1]) {
        // Swap
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;

        steps.push({
          array: [...arr],
          swappingIndices: [j, j + 1],
          sortedIndices: [...sortedIndices],
          message: `Swapped ${arr[j + 1]} and ${arr[j]} because ${arr[j + 1]} > ${arr[j]}`
        });
      }
    }
    sortedIndices.push(n - i - 1);
    steps.push({
      array: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Element at index ${n - i - 1} (${arr[n - i - 1]}) bubbled into its final sorted position.`
    });

    if (!swapped) {
      steps.push({
        array: [...arr],
        sortedIndices: Array.from({ length: n }, (_, k) => k),
        message: 'No swaps occurred during the pass! Early termination optimization triggered: array is fully sorted in O(n) best-case.'
      });
      return steps;
    }
  }

  sortedIndices.push(0);
  steps.push({
    array: [...arr],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    message: 'Bubble Sort complete! All elements are in non-decreasing order.'
  });

  return steps;
}

export function generateSelectionSortSteps(initial: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...initial];
  const n = arr.length;
  const sortedIndices: number[] = [];

  steps.push({
    array: [...arr],
    message: `Starting Selection Sort. Finds the minimum element from the unsorted segment and moves it to the front.`,
    sortedIndices: []
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      array: [...arr],
      pivotIndex: minIdx,
      sortedIndices: [...sortedIndices],
      message: `Pass ${i + 1}: Initial min candidate is index ${i} (value ${arr[i]}).`
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        comparingIndices: [minIdx, j],
        pivotIndex: minIdx,
        sortedIndices: [...sortedIndices],
        message: `Comparing current min candidate arr[${minIdx}] (${arr[minIdx]}) with arr[${j}] (${arr[j]}).`
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          pivotIndex: minIdx,
          sortedIndices: [...sortedIndices],
          message: `New minimum candidate found at index ${minIdx} (value ${arr[minIdx]}).`
        });
      }
    }

    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      steps.push({
        array: [...arr],
        swappingIndices: [i, minIdx],
        sortedIndices: [...sortedIndices],
        message: `Swapped minimum value ${arr[i]} into sorted position index ${i}.`
      });
    }

    sortedIndices.push(i);
  }

  sortedIndices.push(n - 1);
  steps.push({
    array: [...arr],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    message: 'Selection Sort complete! Performed exactly n(n-1)/2 comparisons in O(n²) time.'
  });

  return steps;
}

export function generateInsertionSortSteps(initial: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...initial];
  const n = arr.length;

  steps.push({
    array: [...arr],
    sortedIndices: [0],
    message: `Starting Insertion Sort. Index 0 (${arr[0]}) is trivially considered sorted.`
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      array: [...arr],
      pivotIndex: i,
      sortedIndices: Array.from({ length: i }, (_, k) => k),
      message: `Inserting key = ${key} (from index ${i}) into the left sorted sub-array.`
    });

    while (j >= 0 && arr[j] > key) {
      steps.push({
        array: [...arr],
        comparingIndices: [j, j + 1],
        sortedIndices: Array.from({ length: i }, (_, k) => k),
        message: `arr[${j}] (${arr[j]}) > key (${key}). Shifting ${arr[j]} one slot right.`
      });

      arr[j + 1] = arr[j];
      steps.push({
        array: [...arr],
        swappingIndices: [j, j + 1],
        message: `Shifted ${arr[j]} right.`
      });

      j--;
    }

    arr[j + 1] = key;
    steps.push({
      array: [...arr],
      sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
      message: `Placed key = ${key} into index ${j + 1}. Subarray [0..${i}] is now sorted.`
    });
  }

  steps.push({
    array: [...arr],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    message: 'Insertion Sort complete! Very efficient on nearly-sorted data (approaching O(n)).'
  });

  return steps;
}

export function generateQuickSortSteps(initial: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...initial];

  steps.push({
    array: [...arr],
    message: 'Starting Quick Sort (Divide & Conquer). Chooses a pivot and partitions elements.'
  });

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    steps.push({
      array: [...arr],
      pivotIndex: high,
      leftPointer: low,
      rightPointer: high,
      message: `Partition range [${low}..${high}]: Chosen pivot is arr[${high}] = ${pivot}.`
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        pivotIndex: high,
        comparingIndices: [j, high],
        leftPointer: i >= 0 ? i : undefined,
        message: `Comparing arr[${j}] (${arr[j]}) with pivot ${pivot}.`
      });

      if (arr[j] < pivot) {
        i++;
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        steps.push({
          array: [...arr],
          pivotIndex: high,
          swappingIndices: [i, j],
          message: `arr[${j}] < ${pivot}. Swapped arr[${i}] and arr[${j}].`
        });
      }
    }

    // Place pivot in its correct spot
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    steps.push({
      array: [...arr],
      pivotIndex: i + 1,
      swappingIndices: [i + 1, high],
      message: `Placed pivot ${pivot} into its final sorted position at index ${i + 1}.`
    });

    return i + 1;
  }

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  }

  quickSort(0, arr.length - 1);

  steps.push({
    array: [...arr],
    sortedIndices: Array.from({ length: arr.length }, (_, k) => k),
    message: 'Quick Sort complete! Average time complexity is O(n log n).'
  });

  return steps;
}

export function generateMergeSortSteps(initial: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...initial];

  steps.push({
    array: [...arr],
    message: 'Starting Merge Sort. Recursively splits array into halves, then merges sorted subarrays.'
  });

  function merge(low: number, mid: number, high: number) {
    const left = arr.slice(low, mid + 1);
    const right = arr.slice(mid + 1, high + 1);

    steps.push({
      array: [...arr],
      leftPointer: low,
      rightPointer: high,
      midPointer: mid,
      message: `Merging subarray [${low}..${mid}] and [${mid + 1}..${high}].`
    });

    let i = 0, j = 0, k = low;

    while (i < left.length && j < right.length) {
      steps.push({
        array: [...arr],
        comparingIndices: [low + i, mid + 1 + j],
        leftPointer: low + i,
        rightPointer: mid + 1 + j,
        message: `Comparing left ${left[i]} with right ${right[j]}.`
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      k++;
      steps.push({
        array: [...arr],
        sortedIndices: Array.from({ length: k - low }, (_, idx) => low + idx),
        message: `Placed smaller element into merged index ${k - 1}.`
      });
    }

    while (i < left.length) {
      arr[k] = left[i];
      i++;
      k++;
      steps.push({
        array: [...arr],
        message: `Copied remaining left element into index ${k - 1}.`
      });
    }

    while (j < right.length) {
      arr[k] = right[j];
      j++;
      k++;
      steps.push({
        array: [...arr],
        message: `Copied remaining right element into index ${k - 1}.`
      });
    }
  }

  function mergeSort(low: number, high: number) {
    if (low < high) {
      const mid = Math.floor((low + high) / 2);
      mergeSort(low, mid);
      mergeSort(mid + 1, high);
      merge(low, mid, high);
    }
  }

  mergeSort(0, arr.length - 1);

  steps.push({
    array: [...arr],
    sortedIndices: Array.from({ length: arr.length }, (_, k) => k),
    message: 'Merge Sort complete! Guaranteed O(n log n) in all cases, stable, but uses O(n) auxiliary memory.'
  });

  return steps;
}
