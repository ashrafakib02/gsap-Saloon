/**
 * useThree — Primary Public API for Three Context
 *
 * Provides access to the full {@link ThreeContextValue} or a derived slice
 * via a selector function. The selector overload follows the same mental
 * model as Redux's `useSelector` — a typed selector function narrows the
 * returned value, and an optional equality function prevents re-renders when
 * the selected slice is structurally unchanged.
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Components read this state; they never probe the device themselves."
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only.
 */

import { useContext, useRef } from 'react';

import { ThreeContext } from '../three-context';

import type { ThreeContextValue } from '../three.types';

/**
 * Access the full Three context value.
 *
 * Must be used within a {@link ThreeProvider}. Throws outside the provider.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isEnabled, quality } = useThree();
 *   if (!isEnabled) return null;
 *   return <div>{quality.preset}</div>;
 * }
 * ```
 */
export function useThree(): ThreeContextValue;

/**
 * Access a derived slice of the Three context value.
 *
 * The selector runs on every render where the context value changes. When
 * the selected slice is equal (by the provided `equalityFn`, defaulting to
 * `Object.is`), the component is not re-rendered — only when the slice
 * actually changes.
 *
 * @param selector  - A pure function that extracts a slice from context.
 * @param equalityFn - Optional comparator for the selected slice.
 *
 * @example
 * ```tsx
 * function QualityBadge() {
 *   const preset = useThree((ctx) => ctx.quality.preset);
 *   return <span>{preset}</span>;
 * }
 * ```
 */
export function useThree<T>(
  selector: (ctx: ThreeContextValue) => T,
  equalityFn?: (a: T, b: T) => boolean,
): T;

export function useThree<T>(
  selector?: (ctx: ThreeContextValue) => T,
  equalityFn?: (a: T, b: T) => boolean,
): ThreeContextValue | T {
  const ctx = useContext(ThreeContext);
  if (ctx === null) {
    throw new Error(
      'useThree must be used within a <ThreeProvider>. ' +
        'Wrap the subtree (or the app root) in <ThreeProvider> before ' +
        'calling useThree.',
    );
  }

  /* All hooks must be called unconditionally — store the latest selected
     value in a ref so the equality function can compare across renders
     without triggering a re-render on every context change. */
  const prevRef = useRef<{ selected: T; context: ThreeContextValue } | null>(
    null,
  );

  if (!selector) {
    return ctx;
  }

  const selected = selector(ctx);

  const eq = equalityFn ?? (Object as { is: (a: unknown, b: unknown) => boolean }).is;

  if (prevRef.current === null || prevRef.current.context !== ctx) {
    /* First render or context changed — always store and return. */
    prevRef.current = { selected, context: ctx };
  } else if (!eq(prevRef.current.selected, selected)) {
    /* Selected slice changed since last render. */
    prevRef.current = { selected, context: ctx };
  }

  return prevRef.current.selected;
}
