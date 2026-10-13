import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlignLeft, Hash, BookOpen, Shuffle, ArrowRight, Clock } from 'lucide-react';
import { useLocalStorage, INITIAL_SETTINGS } from '../hooks/useLocalStorage';
import type { UserSettings } from '../hooks/useLocalStorage';

const modes = [
  {
    value: 'mixed',
    icon: Shuffle,
    label: 'Mixed',
    desc: 'Words, sentences, and numbers all in one — the full challenge',
    color: 'var(--accent)',
  },
  {
    value: 'words',
    icon: AlignLeft,
    label: 'Words',
    desc: 'Common English words — great for building speed',
    color: 'var(--green)',
  },
  {
    value: 'sentences',
    icon: BookOpen,
    label: 'Sentences',
    desc: 'Real sentences with punctuation and capitalization',
    color: 'var(--sky)',
  },
  {
    value: 'numbers',
    icon: Hash,
    label: 'Numbers & Symbols',
    desc: 'Practice digits, operators, and special characters',
    color: 'var(--yellow)',
  },
];

const DURATIONS = [
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
  { label: '2 min', value: 120 },
];

export function TestHome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [settings] = useLocalStorage<UserSettings>('typesprint-settings', INITIAL_SETTINGS);

  const initialMode = useMemo(() => {
    const param = searchParams.get('mode');
    if (!param) return 'mixed';
    if (param.includes('word')) return 'words';
    if (param.includes('sentence')) return 'sentences';
    if (param.includes('number')) return 'numbers';
    return param;
  }, [searchParams]);

  const initialDuration = useMemo(() => {
    const param = searchParams.get('duration');
    return param ? parseInt(param, 10) : settings.defaultDuration || 60;
  }, [searchParams, settings.defaultDuration]);

  const [selectedMode, setSelectedMode] = useState(initialMode);
  const [selectedDuration, setSelectedDuration] = useState(initialDuration);

  const handleStart = () => {
    navigate(`/test/run?mode=${selectedMode}&duration=${selectedDuration}`);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.35rem' }}>Typing Test</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '0.95rem' }}>
          Choose a mode and test duration to see how fast and accurate you can type.
        </p>
      </div>

      {/* Duration selector */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Clock size={16} /> Test Duration
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {DURATIONS.map(({ label, value }) => {
            const active = selectedDuration === value;
            return (
              <button
                key={value}
                onClick={() => setSelectedDuration(value)}
                style={{
                  flex: 1,
                  padding: '0.7rem 0.5rem',
                  borderRadius: '10px',
                  border: active ? '2px solid var(--accent)' : '1px solid var(--border)',
                  background: active ? 'color-mix(in srgb, var(--accent) 15%, var(--surface))' : 'var(--surface)',
                  color: active ? 'var(--accent)' : 'var(--text-1)',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit',
                  boxShadow: active ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode picker */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>
          Mode
        </div>
        {modes.map(({ value, icon: Icon, label, desc, color }) => {
          const active = selectedMode === value;
          return (
            <button
              key={value}
              onClick={() => setSelectedMode(value)}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.1rem',
                borderRadius: '12px',
                border: active ? `2px solid ${color}` : '2px solid var(--border)',
                background: active
                  ? `color-mix(in srgb, ${color} 10%, var(--surface))`
                  : 'var(--surface)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                boxShadow: active ? `0 0 0 3px color-mix(in srgb, ${color} 15%, transparent)` : 'var(--shadow-sm)',
                transition: 'all 0.18s',
                width: '100%',
              }}
            >
              {/* Icon badge */}
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
                background: active ? `color-mix(in srgb, ${color} 20%, transparent)` : 'var(--surface-2)',
                border: `1px solid ${active ? color : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.18s',
              }}>
                <Icon size={20} style={{ color: active ? color : 'var(--text-2)', transition: 'color 0.18s' }} />
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: 700, fontSize: '0.95rem',
                  color: active ? color : 'var(--text-1)',
                  marginBottom: '2px',
                  transition: 'color 0.18s',
                }}>
                  {label}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.4 }}>{desc}</div>
              </div>

              {/* Selected indicator */}
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%',
                border: active ? `2px solid ${color}` : '2px solid var(--border)',
                background: active ? color : 'transparent',
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.18s',
              }}>
                {active && (
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff' }} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Start button */}
      <button
        onClick={handleStart}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
          padding: '0.9rem 2rem',
          borderRadius: '12px',
          background: 'var(--accent)',
          color: '#fff',
          fontWeight: 700,
          fontSize: '1rem',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          boxShadow: 'var(--shadow-accent)',
          transition: 'all 0.18s',
          width: '100%',
        }}
        onMouseOver={e => (e.currentTarget.style.background = 'var(--accent-2)')}
        onMouseOut={e => (e.currentTarget.style.background = 'var(--accent)')}
      >
        Start Test <ArrowRight size={18} />
      </button>
    </div>
  );
}
