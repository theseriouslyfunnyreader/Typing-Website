import { useState, useEffect, useCallback, useRef } from 'react';

interface TypingEngineState {
  status: 'idle' | 'running' | 'finished';
  text: string;
  typed: string;
  cursor: number;
  errors: number[];
  everWrong: number[];
  startTime: number | null;
  endTime: number | null;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  elapsedTime: number;
  lastPressedKey?: string;
  errorKey?: string;
}

export function useTypingEngine(
  initialText: string,
  durationInSeconds: number = 60,
  onFinish?: (stats: any) => void
) {
  const [state, setState] = useState<TypingEngineState>({
    status: 'idle',
    text: initialText,
    typed: '',
    cursor: 0,
    errors: [],
    everWrong: [],
    startTime: null,
    endTime: null,
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    elapsedTime: 0,
    lastPressedKey: undefined,
    errorKey: undefined,
  });

  const timerRef = useRef<number | null>(null);

  const calculateStats = useCallback((
    typedStr: string,
    errorList: number[],
    start: number,
    end: number
  ) => {
    const elapsedMinutes = (end - start) / 1000 / 60;
    if (elapsedMinutes <= 0) return { wpm: 0, rawWpm: 0, accuracy: 100 };

    const totalTyped = typedStr.length;
    const incorrectCount = errorList.length;
    const correctCount = totalTyped - incorrectCount;

    const rawWpm = (totalTyped / 5) / elapsedMinutes;
    const wpm = (correctCount / 5) / elapsedMinutes;
    const accuracy = totalTyped > 0 ? (correctCount / totalTyped) * 100 : 100;

    return {
      wpm: Math.max(0, Math.round(wpm)),
      rawWpm: Math.max(0, Math.round(rawWpm)),
      accuracy: Math.max(0, Math.round(accuracy)),
    };
  }, []);



  useEffect(() => {
    if (state.status === 'running') {
      timerRef.current = window.setInterval(() => {
        setState((prev) => {
          if (prev.status !== 'running') return prev;
          
          const newTime = prev.elapsedTime + 1;
          const stats = calculateStats(prev.typed, prev.errors, prev.startTime!, Date.now());
          
          return {
            ...prev,
            ...stats,
            elapsedTime: newTime,
          };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.status, calculateStats]);

  // Auto-finish is now handled inside the timer interval above.

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (state.status === 'finished') return;

      const key = e.key;
      const isChar = key.length === 1;
      const isBackspace = key === 'Backspace';

      if (!isChar && !isBackspace) return;

      e.preventDefault();

      setState((prev) => {
        if (prev.status === 'idle') {
          return {
            ...prev,
            status: 'running',
            startTime: Date.now(),
            typed: isChar ? key : '',
            cursor: isChar ? 1 : 0,
            errors: isChar && key !== prev.text[0] ? [0] : [],
            everWrong: isChar && key !== prev.text[0] ? [0] : [],
            lastPressedKey: key,
            errorKey: isChar && key !== prev.text[0] ? key : undefined,
          };
        }

        if (isBackspace) {
          if (prev.cursor === 0) return prev;
          
          const newCursor = prev.cursor - 1;
          const newTyped = prev.typed.slice(0, -1);
          const newErrors = prev.errors.filter((i) => i !== newCursor);

          return {
            ...prev,
            typed: newTyped,
            cursor: newCursor,
            errors: newErrors,
            lastPressedKey: 'Backspace',
            errorKey: undefined,
          };
        }

        if (isChar) {
          const isCorrect = key === prev.text[prev.cursor];
          const newCursor = prev.cursor + 1;
          const newTyped = prev.typed + key;
          const newErrors = isCorrect ? prev.errors : [...prev.errors, prev.cursor];
          const newEverWrong = (isCorrect || prev.everWrong.includes(prev.cursor)) 
            ? prev.everWrong 
            : [...prev.everWrong, prev.cursor];

          if (newCursor >= prev.text.length) {
            // Reached end of text, finish immediately
            const now = Date.now();
            const elapsedMinutes = (now - prev.startTime!) / 1000 / 60;
            const totalTyped = newTyped.length;
            const incorrectCount = newErrors.length;
            const correctCount = totalTyped - incorrectCount;
            const rawWpm = elapsedMinutes > 0 ? (totalTyped / 5) / elapsedMinutes : 0;
            const wpm = elapsedMinutes > 0 ? (correctCount / 5) / elapsedMinutes : 0;
            const accuracy = totalTyped > 0 ? (correctCount / totalTyped) * 100 : 100;
            
            const finalState = {
              ...prev,
              typed: newTyped,
              cursor: newCursor,
              errors: newErrors,
              everWrong: newEverWrong,
              lastPressedKey: key,
              errorKey: isCorrect ? undefined : key,
              wpm: Math.max(0, Math.round(wpm)),
              rawWpm: Math.max(0, Math.round(rawWpm)),
              accuracy: Math.max(0, Math.round(accuracy)),
              status: 'finished' as const,
              endTime: now,
              timeRemaining: 0,
            };

            if (onFinish) {
               setTimeout(() => onFinish(finalState), 0);
            }
            return finalState;
          }

          return {
            ...prev,
            typed: newTyped,
            cursor: newCursor,
            errors: newErrors,
            everWrong: newEverWrong,
            lastPressedKey: key,
            errorKey: isCorrect ? undefined : key,
          };
        }

        return prev;
      });
    },
    [state.status, onFinish]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState({
      status: 'idle',
      text: initialText,
      typed: '',
      cursor: 0,
      errors: [],
      everWrong: [],
      startTime: null,
      endTime: null,
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      elapsedTime: 0,
      lastPressedKey: undefined,
      errorKey: undefined,
    });
  }, [initialText]);

  return { ...state, reset };
}
