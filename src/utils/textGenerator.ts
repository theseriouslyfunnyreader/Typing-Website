export const MODE_TEXTS: Record<string, string> = {
  mixed:
    "Technology has transformed everyday communication across the globe. In 2024, more than 5.3 billion people used the internet daily. Speed and precision are essential skills for modern digital tasks! Can you type at 75 WPM without making errors? Practice consistently, stay relaxed, and remember that 100% accuracy always beats rushing through sentences with mistakes.",
  
  words:
    "the be to of and a in that have i it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us",
  
  sentences:
    "The journey of a thousand miles begins with a single confident step. Continuous improvement requires patient daily effort and steady focus. Reading diverse books expands your vocabulary and inspires creative problem solving. Great typists never look down at their fingers because muscle memory guides every keystroke naturally. Consistency and patience will always triumph over sporadic bursts of effort.",
  
  numbers:
    "In 1995, Windows 95 revolutionized PC software with a 32-bit architecture. Flight #408 departs from Terminal 2B at 14:45 on 12/08/2026. Account #8492-3104 confirmed a $1,250.75 deposit (interest rate: 4.85%). Total cost: 3 x $49.99 + 8.25% tax = $162.34. The secret coordinates were 48.8584 N, 2.2945 E with an elevation of 300m.",
  
  programmer:
    "const calculateSpeed = (totalChars, elapsedSeconds) => { const words = totalChars / 5; const minutes = elapsedSeconds / 60; return Math.round(words / minutes); }; function handleEvent(e) { e.preventDefault(); console.log(`Key pressed: ${e.key}`); return true; }",
};

export function getTextForMode(mode?: string): string {
  if (!mode) return MODE_TEXTS.mixed;
  const normalized = mode.toLowerCase();
  if (normalized.includes('word')) return MODE_TEXTS.words;
  if (normalized.includes('sentence')) return MODE_TEXTS.sentences;
  if (normalized.includes('number')) return MODE_TEXTS.numbers;
  if (normalized.includes('program')) return MODE_TEXTS.programmer;
  return MODE_TEXTS[normalized] || MODE_TEXTS.mixed;
}
