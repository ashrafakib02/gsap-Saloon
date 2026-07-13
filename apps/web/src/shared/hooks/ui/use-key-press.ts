import { useState, useEffect } from 'react';

interface UseKeyPressOptions {
  /** Target element to listen on (default: document) */
  target?: EventTarget | null;
  /** Whether the handler is active. Default: true */
  enabled?: boolean;
}

/**
 * Detects when a specific keyboard key is pressed.
 *
 * Returns a boolean that is true while the key is held down.
 *
 * @example
 * ```tsx
 * const isEscapePressed = useKeyPress('Escape');
 * if (isEscapePressed) closeMenu();
 * ```
 */
export function useKeyPress(
  key: string,
  options: UseKeyPressOptions = {},
): boolean {
  const { target, enabled = true } = options;
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (typeof document === 'undefined') return;

    const eventTarget = target ?? document;

    const handleKeyDown = (e: Event): void => {
      if ((e as KeyboardEvent).key === key) {
        setIsPressed(true);
      }
    };

    const handleKeyUp = (e: Event): void => {
      if ((e as KeyboardEvent).key === key) {
        setIsPressed(false);
      }
    };

    eventTarget.addEventListener('keydown', handleKeyDown);
    eventTarget.addEventListener('keyup', handleKeyUp);

    return () => {
      eventTarget.removeEventListener('keydown', handleKeyDown);
      eventTarget.removeEventListener('keyup', handleKeyUp);
    };
  }, [key, target, enabled]);

  return isPressed;
}

/**
 * Fires a callback when a specific key is pressed.
 * Does not track hold state — fires once per press.
 *
 * @example
 * ```tsx
 * useKeyPressEffect('Escape', () => setIsOpen(false));
 * ```
 */
export function useKeyPressEffect(
  key: string,
  callback: () => void,
  options: UseKeyPressOptions = {},
): void {
  const { target, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;
    if (typeof document === 'undefined') return;

    const eventTarget = target ?? document;

    const handler = (e: Event): void => {
      if ((e as KeyboardEvent).key === key) {
        callback();
      }
    };

    eventTarget.addEventListener('keydown', handler);
    return () => eventTarget.removeEventListener('keydown', handler);
  }, [key, target, enabled, callback]);
}
