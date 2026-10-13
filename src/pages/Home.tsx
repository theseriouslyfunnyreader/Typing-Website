import { Link } from 'react-router-dom';
import { Button } from '../components/Button.tsx';
import { useLocalStorage, INITIAL_PROGRESS } from '../hooks/useLocalStorage';
import type { UserProgress } from '../hooks/useLocalStorage';
import { Target, Zap, Clock, Trophy, ArrowRight, BookOpen, FlaskConical } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, unit, color }: any) => (
  <div style={{
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
    flex: 1,
    minWidth: '140px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={16} style={{ color }} />
      </div>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-2)', fontWeight: 500 }}>{label}</span>
    </div>
    <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1 }}>
      {value}<span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-2)', marginLeft: '3px' }}>{unit}</span>
    </div>
  </div>
);

export function Home() {
  const [progress] = useLocalStorage<UserProgress>('typesprint-progress', INITIAL_PROGRESS);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent) 0%, #7b6cf0 100%)',
        borderRadius: '16px',
        padding: '3rem 2.5rem',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-accent)',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: '-80px', right: '-60px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', bottom: '-60px', left: '30px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '0.3rem 0.9rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', backdropFilter: 'blur(4px)' }}>
            🚀 Start your typing journey
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.75rem', color: '#fff' }}>
            Type faster. Type smarter.
          </h1>
          <p style={{ fontSize: '1.05rem', opacity: 0.85, maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Build real touch-typing skills with structured lessons, accuracy drills, and timed tests.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/learn">
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: '#fff', color: 'var(--accent)', fontWeight: 700,
                padding: '0.7rem 1.6rem', borderRadius: '10px', border: 'none',
                cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.18s',
              }}>
                Start Learning <ArrowRight size={16} />
              </button>
            </Link>
            <Link to="/test">
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: 600,
                padding: '0.7rem 1.6rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer', fontSize: '0.95rem', backdropFilter: 'blur(4px)',
                transition: 'all 0.18s',
              }}>
                Take a Test
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Stats</h2>
        {(progress.testsCompleted ?? 0) === 0 ? (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px',
            padding: '2.5rem', textAlign: 'center', color: 'var(--text-2)',
          }}>
            <p style={{ fontSize: '1rem', marginBottom: '0.35rem', fontWeight: 500 }}>No tests completed yet.</p>
            <p style={{ fontSize: '0.875rem' }}>Finish a lesson or test to see your stats here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <StatCard icon={Zap}    label="Best Speed"     value={progress.bestWpm ?? 0}                              unit="WPM"  color="var(--accent)" />
            <StatCard icon={Target} label="Avg Accuracy"   value={progress.averageAccuracy ?? 0}                     unit="%"    color="var(--green)" />
            <StatCard icon={Clock}  label="Practice Time"  value={Math.round((progress.totalPracticeTime ?? 0) / 60)} unit="min"  color="var(--sky)" />
            <StatCard icon={Trophy} label="Streak"         value={progress.streak ?? 0}                              unit="days" color="var(--yellow)" />
          </div>
        )}
      </div>

      {/* Bottom cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Continue Learning */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Continue Learning</h3>
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '0.6rem' }}>Lesson 2 · Keys: f & j</p>
            <div style={{ background: 'var(--border)', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
              <div style={{ width: '45%', height: '100%', background: 'var(--accent)', borderRadius: '99px' }} />
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-3)', textAlign: 'right', marginTop: '0.25rem' }}>45% complete</p>
          </div>
          <Link to="/learn" style={{ marginTop: 'auto' }}>
            <Button style={{ width: '100%' }}>Continue</Button>
          </Link>
        </div>

        {/* Quick Practice */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <FlaskConical size={18} style={{ color: 'var(--green)' }} />
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Quick Practice</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { label: '1-Min Test', path: '/test?duration=60' },
              { label: '3-Min Test', path: '/test?duration=180' },
              { label: 'Common Words', path: '/practice?mode=common' },
              { label: 'Numbers', path: '/practice?mode=numbers' },
            ].map(({ label, path }) => (
              <Link key={path} to={path}>
                <button style={{
                  width: '100%', padding: '0.55rem 0.5rem', borderRadius: '8px',
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  color: 'var(--text-1)', fontSize: '0.78rem', fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}>
                  {label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
