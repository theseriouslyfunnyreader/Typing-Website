import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlignLeft, Hash, BookOpen, Shuffle, ArrowRight } from 'lucide-react';

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

export function TestHome() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState('mixed');

  const handleStart = () => {
    navigate(`/test/run?mode=${selectedMode}`);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.35rem' }}>Typing Test</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '0.95rem' }}>
          Choose a mode and see how fast you can type.
        </p>
      </div>

      {/* Mode picker */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
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
