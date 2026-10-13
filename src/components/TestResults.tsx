import { Button } from './Button';
import { RotateCcw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface TestResultsProps {
  wpm: number;
  rawWpm?: number;
  accuracy: number;
  duration?: number;
  goalWpm?: number;
  onRetry: () => void;
  lessonId?: number;
  nextLessonId?: number | null;
  stars?: number;
}

function StatRing({
  type,
  mainValue,
  subLabel,
  subValue,
  bottomLabel,
  sideLabel,
  sideSubLabel,
  sideDirection,
  ringColor,
  fillPct = 100,
}: any) {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const innerR = 50;
  const outerR = 65;
  const isDuration = type === 'duration';

  const outerCircumference = 2 * Math.PI * outerR;
  // Full 360 circle fill
  const arcFill = Math.min(100, Math.max(0, fillPct));
  const filledArc = (arcFill / 100) * outerCircumference;
  const gapSize = outerCircumference - filledArc;
  const dashArray = `${filledArc} ${gapSize}`;
  // Rotate so arc starts from top (12 o'clock)
  const startAngle = -90; // degrees

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

      {/* Left side annotation */}
      {sideDirection === 'left' && (
        <div style={{
          position: 'absolute', right: 'calc(100% + 8px)', top: '55%', transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)' }}>{sideLabel}</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{sideSubLabel}</div>
          </div>
          <div style={{ width: '24px', height: '2px', background: 'var(--border-2)', flexShrink: 0 }} />
        </div>
      )}
      {/* Right side annotation */}
      {sideDirection === 'right' && (
        <div style={{
          position: 'absolute', left: 'calc(100% + 8px)', top: '55%', transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
        }}>
          <div style={{ width: '24px', height: '2px', background: 'var(--border-2)', flexShrink: 0 }} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)' }}>{sideLabel}</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{sideSubLabel}</div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '0.4rem', color: 'var(--text-2)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {bottomLabel}
      </div>

      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size}>
          {/* Background fill circle */}
          <circle cx={cx} cy={cy} r={outerR - 4} fill="var(--surface-2)" />

          {/* Inner dashed ring */}
          <circle
            cx={cx} cy={cy} r={innerR}
            fill="none"
            stroke="var(--border-2)"
            strokeWidth={10}
            strokeDasharray="2 9"
          />

          {/* Track ring (background of arc) */}
          {!isDuration && (
            <circle
              cx={cx} cy={cy} r={outerR}
              fill="none"
              stroke="var(--border)"
              strokeWidth={6}
            />
          )}

          {/* Filled accent arc */}
          {!isDuration && (
            <circle
              cx={cx} cy={cy} r={outerR}
              fill="none"
              stroke={ringColor || 'var(--yellow)'}
              strokeWidth={6}
              strokeDasharray={dashArray}
              strokeLinecap="round"
              style={{ transform: `rotate(${startAngle}deg)`, transformOrigin: 'center', transition: 'stroke-dasharray 1s ease-out' }}
            />
          )}

          {/* Outer border ring */}
          <circle cx={cx} cy={cy} r={outerR + 7} fill="none" stroke="var(--border)" strokeWidth={1} />
        </svg>

        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          paddingTop: '0.4rem', // Scooch down slightly
        }}>
          <div style={{ fontSize: type === 'duration' ? '1.4rem' : type === 'accuracy' ? '1.3rem' : '1.6rem', fontWeight: 800, lineHeight: 1, color: 'var(--text-1)' }}>
            {mainValue}
          </div>
          {subLabel && (
            <div style={{ fontSize: '0.55rem', color: 'var(--text-3)', marginTop: '0.2rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {subLabel}
            </div>
          )}
          {subValue && (
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-2)', marginTop: '0.1rem' }}>
              {subValue}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export function TestResults({ wpm, accuracy, duration = 0, goalWpm = 40, onRetry, lessonId, nextLessonId, stars = 0 }: TestResultsProps) {
  const navigate = useNavigate();
  const [showPlatinum, setShowPlatinum] = useState(false);

  const isPass = !lessonId || stars >= 3;
  const isPlatinum = stars === 6;
  const numStars = isPlatinum ? 5 : stars;

  useEffect(() => {
    if (isPlatinum) {
      const timer = setTimeout(() => {
        setShowPlatinum(true);
      }, 800); // Wait 800ms before flipping
      return () => clearTimeout(timer);
    }
  }, [isPlatinum]);

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const score = Math.round(wpm * (accuracy / 100) * 50);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Decorative gradient blob behind rings */}
      <div style={{
        position: 'absolute',
        width: '600px', height: '400px',
        background: `radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Stars Arc - using absolute positioning for proper crown shape */}
      {lessonId && lessonId > 0 && (() => {
        // Arc positions: [x%, y%] relative to container. Middle star highest.
        const positions = [
          { x: 0,   y: 22, rot: -24 },
          { x: 55,  y: 10, rot: -12 },
          { x: 110, y: 0,  rot: 0   },
          { x: 165, y: 10, rot: 12  },
          { x: 220, y: 22, rot: 24  },
        ];
        return (
          <div style={{ position: 'relative', width: '262px', height: '64px', marginBottom: '1.25rem', zIndex: 1 }}>
            {[1, 2, 3, 4, 5].map((star, i) => {
              const pos = positions[i];
              const isEarned = star <= numStars;
              
              // We render gold if it's earned, but if it's platinum we wait for showPlatinum to become true
              const isCurrentlyPlatinum = isPlatinum && showPlatinum;
              
              const fill = isEarned ? (isCurrentlyPlatinum ? 'var(--platinum)' : 'var(--yellow)') : 'var(--border)';
              const stroke = isEarned ? (isCurrentlyPlatinum ? 'var(--platinum)' : 'var(--yellow)') : 'var(--border-2)';
              
              // Add delay so they flip one by one from left to right
              const flipDelay = i * 0.15; 
              
              return (
                <div key={star} style={{
                  position: 'absolute',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  // The flip animation (rotateY)
                  transform: `rotate(${pos.rot}deg) ${isCurrentlyPlatinum ? 'rotateY(360deg)' : 'rotateY(0deg)'}`,
                  filter: isEarned ? `drop-shadow(0 2px 8px color-mix(in srgb, ${isCurrentlyPlatinum ? 'var(--platinum)' : 'var(--yellow)'} 60%, transparent))` : 'none',
                  transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${isCurrentlyPlatinum ? flipDelay : 0}s`,
                }}>
                  <svg width="42" height="42" viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1" style={{ transition: `fill 0.4s ${isCurrentlyPlatinum ? flipDelay + 0.1 : 0}s, stroke 0.4s ${isCurrentlyPlatinum ? flipDelay + 0.1 : 0}s` }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Pass/Fail or Complete pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        background: !lessonId
          ? 'color-mix(in srgb, var(--accent) 15%, transparent)'
          : isPass
            ? 'color-mix(in srgb, var(--green) 15%, transparent)'
            : 'color-mix(in srgb, var(--red) 15%, transparent)',
        border: `1px solid ${!lessonId ? 'var(--accent)' : isPass ? 'var(--green)' : 'var(--red)'}`,
        color: !lessonId ? 'var(--accent)' : isPass ? 'var(--green)' : 'var(--red)',
        borderRadius: '999px',
        padding: '0.3rem 1rem',
        fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
        marginBottom: '2rem',
        position: 'relative', zIndex: 1,
      }}>
        {!lessonId ? '✓ Test Complete' : isPass ? '✓ Passed' : '✗ Failed'}
        {lessonId ? ` — Lesson ${lessonId}` : ''}
      </div>

      {/* Three Rings */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', position: 'relative', zIndex: 1 }}>
        <StatRing
          type="accuracy"
          mainValue={`${accuracy}%`}
          subLabel="real accuracy"
          subValue={`${Math.max(0, accuracy - 2)}%`}
          bottomLabel="accuracy"
          sideDirection="left"
          sideLabel="80%"
          sideSubLabel="minimum accuracy"
          ringColor="var(--green)"
          fillPct={accuracy}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <StatRing
            type="duration"
            mainValue={formatMinSec(duration)}
            subLabel="min : seconds"
            bottomLabel="duration"
            ringColor="var(--accent)"
          />
          {/* Score */}
          <div style={{
            position: 'absolute', top: '105%',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>score</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.03em', lineHeight: 1, textShadow: '0 2px 20px var(--accent-glow)' }}>
              {score}
            </div>
          </div>
        </div>

        <StatRing
          type="speed"
          mainValue={wpm}
          subLabel="wpm"
          bottomLabel="speed"
          sideDirection="right"
          sideLabel={`${goalWpm} wpm`}
          sideSubLabel="requirement"
          ringColor="var(--accent)"
          fillPct={Math.min(100, (wpm / goalWpm) * 100)}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '6rem', position: 'relative', zIndex: 1 }}>
        <Button variant="secondary" onClick={onRetry}>
          <RotateCcw size={16} /> Try Again
        </Button>
        {lessonId && isPass && nextLessonId ? (
          <Button onClick={() => navigate(`/learn/${nextLessonId}`)}>
            Next Lesson <ArrowRight size={16} />
          </Button>
        ) : null}
        <Button variant="secondary" onClick={() => navigate(lessonId ? '/learn' : '/test')}>
          {lessonId ? 'Back to Lessons' : 'Back to Tests'}
        </Button>
        {!lessonId && (
          <Button onClick={() => navigate('/progress')}>
            View Progress <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
