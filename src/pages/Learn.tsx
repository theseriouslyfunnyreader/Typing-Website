import { Package, Timer, Keyboard, Star, CheckCircle2, Award, Zap, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { lessonsData } from '../data/lessons.ts';
import type { LessonData } from '../data/lessons.ts';
import { useLocalStorage, INITIAL_PROGRESS } from '../hooks/useLocalStorage';
import type { UserProgress } from '../hooks/useLocalStorage';

function LessonIcon({ lesson }: { lesson: LessonData }) {
  const size = 34;
  const cls = 'lesson-card-icon';
  switch (lesson.iconType) {
    case 'timer':     return <Timer    size={size} className={cls} strokeWidth={1.5} />;
    case 'character': return <Zap      size={size} className={cls} strokeWidth={1.5} />;
    case 'keyboard':  return <Keyboard size={size} className={cls} strokeWidth={1.5} />;
    default:          return <Package  size={size} className={cls} strokeWidth={1.5} />;
  }
}

export function Learn() {
  const [progress] = useLocalStorage<UserProgress>('typesprint-progress', INITIAL_PROGRESS);
  const completedLessons: number[] = progress.completedLessons ?? [];
  const lessonScores: Record<number, number> = progress.lessonScores ?? {};

  const isUnlocked = (id: number) =>
    id === 1 || completedLessons.includes(id - 1);

  const isCompleted = (id: number) => completedLessons.includes(id);

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.3rem' }}>Lessons</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>
          Complete each lesson in order to unlock the next one.
        </p>
      </div>

      <div className="lesson-grid">
        {lessonsData.map((lesson) => {
          const unlocked = isUnlocked(lesson.id);
          const completed = isCompleted(lesson.id);
          const rawStars = lessonScores[lesson.id] || 0;
          const isPlatinum = rawStars === 6;
          const stars = isPlatinum ? 5 : rawStars;

          return (
            <Link
              key={lesson.id}
              to={unlocked ? `/learn/${lesson.id}` : '#'}
              className="lesson-card"
              style={{
                opacity: unlocked ? 1 : 0.5,
                pointerEvents: unlocked ? 'auto' : 'none',
                filter: unlocked ? 'none' : 'grayscale(0.4)',
                cursor: unlocked ? 'pointer' : 'default',
              }}
              aria-disabled={!unlocked}
            >
              {/* Header */}
              <div className="lesson-card-header">
                <span className="lesson-card-num">{lesson.id}</span>
                {lesson.hasBadge && unlocked && (
                  <Award size={14} style={{ color: 'var(--platinum)', fill: 'color-mix(in srgb, var(--platinum) 20%, transparent)' }} />
                )}
                {!unlocked && (
                  <Lock size={13} style={{ color: 'var(--text-3)' }} />
                )}
              </div>

              {/* Body */}
              <div className="lesson-card-body">
                {lesson.letters && unlocked && (
                  <span className="lesson-card-letters">{lesson.letters}</span>
                )}
                <div style={{ position: 'relative' }}>
                  {unlocked ? (
                    <LessonIcon lesson={lesson} />
                  ) : (
                    <Lock size={32} style={{ color: 'var(--text-3)' }} strokeWidth={1.5} />
                  )}
                  {completed && (
                    <div style={{
                      position: 'absolute', bottom: '-4px', right: '-6px',
                      background: 'var(--surface)', borderRadius: '50%',
                      display: 'flex', padding: '1px',
                    }}>
                      <CheckCircle2 size={14} style={{ color: 'var(--green)' }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Stars */}
              <div className="lesson-card-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={11}
                    style={{
                      color: star <= stars ? (isPlatinum ? 'var(--platinum)' : 'var(--yellow)') : 'var(--border-2)',
                      fill:  star <= stars ? (isPlatinum ? 'var(--platinum)' : 'var(--yellow)') : 'var(--border-2)',
                    }}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="lesson-card-footer">
                {unlocked ? (lesson.label || 'Lesson') : 'Locked'}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
