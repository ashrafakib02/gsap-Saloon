import { useState, useCallback } from 'react';

interface UseLocalStorageOptions<T> {
  /** Default value if key doesn't exist in localStorage */
  defaultValue: T;
  /** Custom serializer (default: JSON.stringify/parse) */
  serializer?: {
    read: (raw: string) => T;
    write: (value: T) => string;
  };
}

interface UseLocalStorageResult<T> {
  /** Current stored value */
  value: T;
  /** Setter: updates both state and localStorage */
  setValue: (value: T | ((prev: T) => T)) => void;
  /** Remove the key from localStorage and reset to default */
  removeValue: () => void;
}

/**
 * Type-safe wrapper around localStorage with React state.
 *
 * SSR-safe: uses defaultValue when window is unavailable.
 * Serializes/deserializes values via JSON by default.
 *
 * @example
 * ```tsx
 * const { value: theme, setValue: setTheme } = useLocalStorage('theme', {
 *   defaultValue: 'light',
 * });
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T>,
): UseLocalStorageResult<T> {
  const { defaultValue, serializer } = options;
  const serialize = serializer?.write ?? JSON.stringify;
  const deserialize = serializer?.read ?? JSON.parse;

  const [value, setValueState] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? deserialize(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (valueOrUpdater: T | ((prev: T) => T)): void => {
      setValueState((prev) => {
        const next = typeof valueOrUpdater === 'function'
          ? (valueOrUpdater as (prev: T) => T)(prev)
          : valueOrUpdater;

        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, serialize(next));
          }
        } catch {
          // Storage full or unavailable — silently fail
        }

        return next;
      });
    },
    [key, serialize],
  );

  const removeValue = useCallback((): void => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Silently fail
    }
    setValueState(defaultValue);
  }, [key, defaultValue]);

  return { value, setValue, removeValue };
}
