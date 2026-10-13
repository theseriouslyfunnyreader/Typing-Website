import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { Card } from '../components/Card';
import { Button } from '../components/Button.tsx';
import { Keyboard } from '../components/Keyboard';
import { useLocalStorage, INITIAL_PROGRESS, INITIAL_SETTINGS } from '../hooks/useLocalStorage';
import type { UserProgress, UserSettings } from '../hooks/useLocalStorage';
import { RotateCcw, Lock } from 'lucide-react';
import { useEffect, useRef, useMemo } from 'react';
import { TestResults } from '../components/TestResults';
import { lessonsData } from '../data/lessons.ts';
import { getTextForMode } from '../utils/textGenerator';

interface TypingTestProps {
  forceDefaultText?: boolean;
}

export function TypingTest({ forceDefaultText = false }: TypingTestProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lessonId: lessonIdParam } = useParams<{ lessonId: string }>();

  // If forceDefaultText (i.e. /test route), ignore any lesson params entirely
  const lessonId = forceDefaultText
    ? 0
    : lessonIdParam
      ? parseInt(lessonIdParam, 10)
      : parseInt(searchParams.get('lesson') || '0', 10);

  const [progress, setProgress] = useLocalStorage<UserProgress>('typesprint-progress', INITIAL_PROGRESS);
  const [settings] = useLocalStorage<UserSettings>('typesprint-settings', INITIAL_SETTINGS);

  // Migrate old data that might not have completedLessons
  const completedLessons: number[] = progress.completedLessons ?? [];

  // Is this lesson locked? Lesson 1 is always unlocked; any other lesson requires the previous one completed.
  const isLocked = lessonId > 1 && !completedLessons.includes(lessonId - 1);

  const mode = searchParams.get('mode') || 'mixed';
  const customModeText = useMemo(() => getTextForMode(mode), [mode]);

  const currentLesson = useMemo(() => {
    return lessonId ? lessonsData.find(l => l.id === lessonId) : null;
  }, [lessonId]);

  const lessonText = useMemo(() => {
    if (!lessonId) return customModeText;
    return currentLesson ? currentLesson.text : customModeText;
  }, [lessonId, currentLesson, customModeText]);

  // If lesson is a timer lesson, default to 60s. If regular lesson, untimed (0). If free test, respect duration or settings.
  const duration = useMemo(() => {
    if (lessonId > 0) {
      return currentLesson?.iconType === 'timer' ? 60 : 0;
    }
    const param = searchParams.get('duration');
    return param ? parseInt(param, 10) : settings.defaultDuration || 60;
  }, [lessonId, currentLesson, searchParams, settings.defaultDuration]);

  // Calculate a dynamic WPM goal for lessons. Starts at 20, maxes out at 40 over time.
  const goalWpm = lessonId ? Math.min(40, 20 + Math.floor(lessonId / 2)) : 40;

  const handleFinish = (stats: any) => {
    const elapsedSecs = stats.elapsedTime;
    
    // Calculate stars
    let earnedStars = 0;
    if (stats.accuracy === 100 && stats.wpm >= goalWpm) {
      earnedStars = 6;
    } else if (stats.accuracy >= 95) {
      earnedStars = 5;
    } else if (stats.accuracy >= 90) {
      earnedStars = 4;
    } else if (stats.accuracy >= 80) {
      earnedStars = 3;
    }

    const newTest = {
      date: new Date().toISOString(),
      wpm: stats.wpm,
      rawWpm: stats.rawWpm,
      accuracy: stats.accuracy,
      duration: elapsedSecs,
    };

    setProgress((prev: UserProgress) => {
      const prevHistory = prev.history ?? [];
      const history = [...prevHistory, newTest];
      const bestWpm = Math.max(prev.bestWpm ?? 0, stats.wpm);

      const totalWpm = history.reduce((sum, t) => sum + t.wpm, 0);
      const totalAcc = history.reduce((sum, t) => sum + t.accuracy, 0);

      const averageWpm = history.length > 0 ? Math.round(totalWpm / history.length) : 0;
      const averageAccuracy = history.length > 0 ? Math.round(totalAcc / history.length) : 0;
      const totalPracticeTime = (prev.totalPracticeTime ?? 0) + newTest.duration;

      let streak = prev.streak ?? 0;
      const today = new Date().toDateString();
      if (prev.lastPracticeDate !== today) {
        streak += 1;
      }

      // Mark this lesson as completed ONLY if they passed (3+ stars)
      const prevCompleted = prev.completedLessons ?? [];
      const completedLessonsUpdated = (lessonId && earnedStars >= 3 && !prevCompleted.includes(lessonId))
        ? [...prevCompleted, lessonId]
        : prevCompleted;
        
      const prevScores = prev.lessonScores ?? {};
      const lessonScoresUpdated = lessonId
        ? { ...prevScores, [lessonId]: Math.max(prevScores[lessonId] || 0, earnedStars) }
        : prevScores;

      return {
        ...prev,
        testsCompleted: (prev.testsCompleted ?? 0) + 1,
        totalPracticeTime,
        bestWpm,
        averageWpm,
        averageAccuracy,
        history,
        streak,
        lastPracticeDate: today,
        completedLessons: completedLessonsUpdated,
        lessonScores: lessonScoresUpdated,
      };
    });
  };

  const {
    text,
    cursor,
    errors,
    everWrong = [],
    status,
    elapsedTime,
    wpm,
    rawWpm,
    accuracy,
    lastPressedKey,
    errorKey,
    reset
  } = useTypingEngine(lessonText, duration, handleFinish);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ── Locked lesson screen ──────────────────────────────────────────────────
  if (isLocked) {
    const prevLesson = lessonsData.find(l => l.id === lessonId - 1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem', textAlign: 'center' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'var(--surface-2)', border: '2px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Lock size={32} style={{ color: 'var(--text-3)' }} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Lesson Locked</h2>
          <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', maxWidth: '360px' }}>
            You need to complete{' '}
            <strong>Lesson {lessonId - 1}{prevLesson ? ` — ${prevLesson.label}` : ''}</strong>{' '}
            before you can start this one.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button onClick={() => navigate(`/learn/${lessonId - 1}`)}>
            Go to Lesson {lessonId - 1}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/learn')}>
            Back to Lessons
          </Button>
        </div>
      </div>
    );
  }

  // ── Finished screen ───────────────────────────────────────────────────────
  if (status === 'finished') {
    const nextLessonId = lessonId ? lessonId + 1 : null;
    const nextLesson = nextLessonId ? lessonsData.find(l => l.id === nextLessonId) : null;
    
    let earnedStars = 0;
    if (accuracy === 100 && wpm >= goalWpm) {
      earnedStars = 6;
    } else if (accuracy >= 95) {
      earnedStars = 5;
    } else if (accuracy >= 90) {
      earnedStars = 4;
    } else if (accuracy >= 80) {
      earnedStars = 3;
    }

    return (
      <TestResults
        wpm={wpm}
        rawWpm={rawWpm}
        accuracy={accuracy}
        duration={elapsedTime}
        goalWpm={goalWpm}
        onRetry={reset}
        lessonId={lessonId}
        nextLessonId={nextLesson ? nextLessonId : null}
        stars={earnedStars}
      />
    );
  }

  // ── Main typing test ──────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <div className="w-full max-w-4xl">
        {/* Lesson header */}
        {lessonId > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Lesson {lessonId}
            </span>
            <span style={{ color: 'var(--border)', fontSize: '0.8rem' }}>·</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
              {lessonsData.find(l => l.id === lessonId)?.label}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-mono font-bold text-accent">
            {duration > 0
              ? formatTime(Math.max(0, duration - elapsedTime))
              : formatTime(elapsedTime)}
          </div>
          {status === 'running' && (
            <div className="flex gap-4">
              <span className="font-mono">WPM: {wpm}</span>
              <span className="font-mono">Acc: {accuracy}%</span>
            </div>
          )}
        </div>

        <Card
          className="relative text-2xl font-mono p-8 mb-8"
          style={{ lineHeight: '1.6', outline: 'none' }}
          tabIndex={0}
          ref={containerRef}
        >
          {status === 'idle' && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-color/80 z-10 rounded-lg backdrop-blur-sm pointer-events-none">
              <span className="text-xl text-secondary bg-surface-color px-4 py-2 rounded shadow-sm border border-border-color">
                Start typing to begin
              </span>
            </div>
          )}

          <div className="relative z-0" style={{ opacity: status === 'idle' ? 0.3 : 1 }}>
            {text.split('').map((char, index) => {
              const isError = errors.includes(index);
              const isEverWrong = everWrong.includes(index);
              const isSpace = char === ' ';
              const isCursor = index === cursor;

              let color = 'var(--text-3)';
              let bg = 'transparent';

              if (index < cursor) {
                if (isError) {
                  color = 'var(--red)';
                } else if (isEverWrong) {
                  color = 'var(--yellow)';
                } else {
                  color = 'var(--text-1)';
                }
              }

              // Highlight with a background if it's a target space they missed
              if (index < cursor && isError) {
                bg = isSpace ? 'color-mix(in srgb, var(--red) 30%, transparent)' : 'transparent';
              }

              // If it's a space that was typed correctly but was previously wrong, maybe give a slight tint
              if (index < cursor && !isError && isEverWrong && isSpace) {
                bg = 'color-mix(in srgb, var(--yellow) 20%, transparent)';
              }

              return (
                <span
                  key={index}
                  style={{
                    color,
                    backgroundColor: bg,
                    position: 'relative',
                    display: 'inline-block',
                    whiteSpace: 'pre-wrap',
                    minWidth: isSpace ? '1ch' : 'auto',
                    borderRadius: isSpace && isError ? '4px' : '0',
                  }}
                >
                  {isCursor && (
                    <span 
                      style={{
                        position: 'absolute',
                        left: '-1px',
                        top: '10%',
                        height: '80%',
                        width: '3px',
                        background: 'var(--accent)',
                        borderRadius: '2px',
                        zIndex: 10,
                      }} 
                    />
                  )}
                  {char}
                </span>
              );
            })}
          </div>
        </Card>

        {settings.showKeyboard && (
          <div className="mb-8">
            <Keyboard
              nextKey={text[cursor]}
              errorKey={errorKey}
              pressedKey={lastPressedKey}
            />
          </div>
        )}

        <div className="flex justify-center">
          <Button onClick={reset} variant="secondary" className="flex items-center gap-2">
            <RotateCcw size={16} /> Restart
          </Button>
        </div>
      </div>
    </div>
  );
}
