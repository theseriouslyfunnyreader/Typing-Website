// import { useMemo } from 'react'; // unused

// Simplified layout for QWERTY
const KEYBOARD_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'ShiftRight'],
  ['Space']
];

// Left hand: pinky (1), ring (2), middle (3), index (4)
// Right hand: index (5), middle (6), ring (7), pinky (8)
// Thumbs (9)
const FINGER_MAP: Record<string, number> = {
  '`': 1, '1': 1, 'q': 1, 'a': 1, 'z': 1, 'Tab': 1, 'Caps': 1, 'Shift': 1,
  '2': 2, 'w': 2, 's': 2, 'x': 2,
  '3': 3, 'e': 3, 'd': 3, 'c': 3,
  '4': 4, 'r': 4, 'f': 4, 'v': 4, '5': 4, 't': 4, 'g': 4, 'b': 4,
  '6': 5, 'y': 5, 'h': 5, 'n': 5, '7': 5, 'u': 5, 'j': 5, 'm': 5,
  '8': 6, 'i': 6, 'k': 6, ',': 6,
  '9': 7, 'o': 7, 'l': 7, '.': 7,
  '0': 8, 'p': 8, ';': 8, '/': 8, '-': 8, '[': 8, "'": 8, '=': 8, ']': 8, '\\': 8, 'Backspace': 8, 'Enter': 8, 'ShiftRight': 8,
  ' ': 9, 'Space': 9
};

const FINGER_COLORS = {
  1: '#fca5a5', // left pinky
  2: '#fcd34d', // left ring
  3: '#86efac', // left middle
  4: '#93c5fd', // left index
  5: '#c4b5fd', // right index
  6: '#86efac', // right middle
  7: '#fcd34d', // right ring
  8: '#fca5a5', // right pinky
  9: '#d1d5db', // thumbs
};

interface KeyboardProps {
  nextKey?: string;
  errorKey?: string;
  pressedKey?: string;
  layout?: 'QWERTY' | 'AZERTY' | 'Dvorak'; // Only QWERTY implemented for now
}

export function Keyboard({ nextKey, errorKey, pressedKey }: KeyboardProps) {
  
  const getNextKeyChar = (char?: string) => {
    if (!char) return null;
    const lower = char.toLowerCase();
    if (char === ' ') return 'Space';
    return lower;
  };

  const nextChar = getNextKeyChar(nextKey);
  const errorChar = getNextKeyChar(errorKey);
  const pressedChar = getNextKeyChar(pressedKey);

  const getKeyWidth = (key: string) => {
    switch(key) {
      case 'Backspace': return '5rem';
      case 'Tab': return '4rem';
      case 'Caps': return '4.5rem';
      case 'Enter': return '5.5rem';
      case 'Shift': return '6rem';
      case 'ShiftRight': return '6rem';
      case 'Space': return '20rem';
      default: return '3rem';
    }
  };

  const getLabel = (key: string) => {
    if (key === 'ShiftRight') return 'Shift';
    return key;
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center p-4 bg-surface-color rounded-xl shadow-inner border border-border-color">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.map((key) => {
            const isNext = nextChar === key || (key === 'Space' && nextChar === ' ');
            const isError = errorChar === key;
            const isPressed = pressedChar === key;
            const fingerId = FINGER_MAP[key] || 9;
            const baseColor = FINGER_COLORS[fingerId as keyof typeof FINGER_COLORS];
            
            let bgStyle = 'var(--surface-color)';
            let borderStyle = '1px solid var(--border-color)';
            let shadowStyle = 'var(--shadow-sm)';
            let transformStyle = 'none';

            if (isError) {
              bgStyle = 'var(--error-color)';
            } else if (isNext) {
              bgStyle = baseColor;
              borderStyle = `2px solid ${baseColor}`;
              shadowStyle = `0 0 10px ${baseColor}80`;
            } else if (isPressed) {
              bgStyle = 'var(--border-color)';
              transformStyle = 'translateY(2px)';
              shadowStyle = 'none';
            }

            return (
              <div
                key={key}
                className="flex items-center justify-center rounded text-sm font-mono transition-all duration-75"
                style={{
                  width: getKeyWidth(key),
                  height: '3rem',
                  backgroundColor: bgStyle,
                  border: borderStyle,
                  boxShadow: shadowStyle,
                  transform: transformStyle,
                  color: (isError || isNext) ? '#000' : 'var(--text-primary)',
                  fontWeight: isNext ? 'bold' : 'normal'
                }}
              >
                {getLabel(key)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
