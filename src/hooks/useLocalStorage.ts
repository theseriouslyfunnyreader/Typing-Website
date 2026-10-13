import { useState, useEffect, useCallback } from 'react';

function getMergedValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return initialValue;
    const parsed = JSON.parse(item);
    if (
      typeof initialValue === 'object' &&
      initialValue !== null &&
      !Array.isArray(initialValue) &&
      typeof parsed === 'object' &&
      parsed !== null &&
      !Array.isArray(parsed)
    ) {
      return { ...initialValue, ...parsed };
    }
    return parsed;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => getMergedValue(key, initialValue));

  useEffect(() => {
    const handleStorage = () => {
      setStoredValue(getMergedValue(key, initialValue));
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('local-storage-update', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('local-storage-update', handleStorage);
    };
  }, [key, initialValue]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((current) => {
      try {
        const valueToStore =
          value instanceof Function ? value(current) : value;

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          window.dispatchEvent(new Event('local-storage-update'));
        }
        return valueToStore;
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
        return current;
      }
    });
  }, [key]);

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

export interface UserSettings {
  defaultDuration: number;
  showKeyboard: boolean;
  dailyReminder: boolean;
}

export const INITIAL_SETTINGS: UserSettings = {
  defaultDuration: 60,
  showKeyboard: true,
  dailyReminder: false,
};

