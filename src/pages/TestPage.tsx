import { TypingTest } from './TypingTest';

/**
 * The actual typing test runner — lives at /test/run
 * Always uses the default sample text (not a lesson).
 */
export function TestPage() {
  return <TypingTest forceDefaultText />;
}
