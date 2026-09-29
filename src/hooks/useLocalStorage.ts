import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// User Progress types
export interface TestResult {
  date: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  duration: number; // in seconds
}

export interface UserProgress {
  testsCompleted: number;
  totalPracticeTime: number; // in seconds
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  history: TestResult[];
  streak: number;
  lastPracticeDate: string | null;
  completedLessons: number[]; // lesson IDs that have been finished
  lessonScores: Record<number, number>; // lesson ID -> stars (1-6)
}

export const INITIAL_PROGRESS: UserProgress = {
  testsCompleted: 0,
  totalPracticeTime: 0,
  bestWpm: 0,
  averageWpm: 0,
  averageAccuracy: 0,
  history: [],
  streak: 0,
  lastPracticeDate: null,
  completedLessons: [],
  lessonScores: {},
};
