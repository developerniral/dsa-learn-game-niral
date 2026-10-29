import { AlgorithmStep } from '../types/dsa';

export function generateLinearSearchSteps(arr: number[], target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const n = arr.length;

  steps.push({
    array: [...arr],
    message: `Starting Linear Search for target = ${target}. Scanning left-to-right from index 0.`
  });

  for (let i = 0; i < n; i++) {
    steps.push({
      array: [...arr],
      comparingIndices: [i],
      leftPointer: i,
      message: `Checking index ${i}: arr[${i}] = ${arr[i]} against target ${target}.`
    });

    if (arr[i] === target) {
      steps.push({
        array: [...arr],
        targetIndex: i,
        sortedIndices: [i],
        message: `Match found! Element ${target} located at index ${i} after ${i + 1} comparisons.`
      });
      return steps;
    }
  }

  steps.push({
    array: [...arr],
    message: `Target ${target} was not found in the array after scanning all ${n} elements. Returned -1 in O(n) worst-case time.`
  });

  return steps;
}

export function generateBinarySearchSteps(sortedArr: number[], target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...sortedArr];

  steps.push({
    array: [...arr],
    message: `Starting Binary Search for target = ${target}. Requires sorted array. Initial range [0..${arr.length - 1}].`
  });

  let left = 0;
  let right = arr.length - 1;
  let iterations = 0;

  while (left <= right) {
    iterations++;
    const mid = Math.floor((left + right) / 2);

    steps.push({
      array: [...arr],
      leftPointer: left,
      rightPointer: right,
      midPointer: mid,
      comparingIndices: [mid],
      message: `Step ${iterations}: Range [${left}..${right}]. Midpoint is index ${mid} (value ${arr[mid]}).`
    });

    if (arr[mid] === target) {
      steps.push({
        array: [...arr],
        targetIndex: mid,
        midPointer: mid,
        sortedIndices: [mid],
        message: `Success! Target ${target} found at index ${mid} in only ${iterations} comparisons O(log n).`
      });
      return steps;
    } else if (arr[mid] < target) {
      steps.push({
        array: [...arr],
        leftPointer: left,
        rightPointer: right,
        midPointer: mid,
        message: `arr[${mid}] (${arr[mid]}) < ${target}. Target must be in the right half! Shifting left boundary to ${mid + 1}.`
      });
      left = mid + 1;
    } else {
      steps.push({
        array: [...arr],
        leftPointer: left,
        rightPointer: right,
        midPointer: mid,
        message: `arr[${mid}] (${arr[mid]}) > ${target}. Target must be in the left half! Shifting right boundary to ${mid - 1}.`
      });
      right = mid - 1;
    }
  }

  steps.push({
    array: [...arr],
    message: `Target ${target} not found. Search boundaries crossed (left > right). Completed in ${iterations} logarithmic steps.`
  });

  return steps;
}
