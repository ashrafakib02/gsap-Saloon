import { createContext, type Context, useContext, useMemo } from 'react';

/**
 * Creates a React context and a type-safe hook that throws a descriptive
 * error when used outside the provider.
 *
 * @example
 * ```tsx
 * const [ThemeCtx, useTheme] = createSafeContext<Theme>('Theme');
 *
 * function App() {
 *   return (
 *     <ThemeCtx.Provider value="dark">
 *       <Child />
 *     </ThemeCtx.Provider>
 *   );
 * }
 *
 * function Child() {
 *   const theme = useTheme(); // "dark"
 *   return <div>{theme}</div>;
 * }
 * ```
 *
 * @param displayName - Name for React DevTools and error messages.
 * @returns A tuple of [Context, useHook].
 */
function createSafeContext<T>(
  displayName: string,
): [Context<T | null>, () => T] {
  const ctx = createContext<T | null>(null);
  ctx.displayName = displayName;

  const useSafeContext = (): T => {
    const value = useContext(ctx);
    if (value === null || value === undefined) {
      throw new Error(
        `[${displayName}] was used outside of its Provider. ` +
          `Ensure a <${displayName}.Provider> exists in the component tree above.`,
      );
    }
    return value;
  };

  return [ctx, useSafeContext];
}

/**
 * Extracts a derived value from context without causing re-renders
 * when the rest of the context changes.
 *
 * Only re-renders the component when the selected value changes
 * (by reference equality).
 *
 * @example
 * ```tsx
 * const theme = useContextSelector(AppCtx, (ctx) => ctx.theme);
 * ```
 *
 * @param context - The React context to read from.
 * @param selector - A function that extracts the desired value from context.
 * @returns The selected value.
 */
function useContextSelector<T, S>(context: Context<T>, selector: (value: T) => S): S {
  const value = useContext(context);
  const selected = selector(value);

  // Use a ref to compare previous vs current selection
  const prevRef = useMemo(() => ({ current: selected }), []); // eslint-disable-line react-hooks/exhaustive-deps
  if (prevRef.current !== selected) {
    prevRef.current = selected;
  }

  return prevRef.current;
}

/**
 * Like {@link useContextSelector} but memoizes the derived value via
 * `useMemo`. Use when the factory is expensive and you want to
 * guarantee memoization across renders.
 *
 * @example
 * ```tsx
 * const formattedDate = useContextFactory(AppCtx, (ctx) =>
 *   new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(ctx.date),
 * );
 * ```
 *
 * @param context - The React context to read from.
 * @param factory - A function that produces a derived value from context.
 * @returns The memoized derived value.
 */
function useContextFactory<T, S>(context: Context<T>, factory: (value: T) => S): S {
  const value = useContext(context);
  return useMemo(() => factory(value), [value, factory]); // eslint-disable-line react-hooks/exhaustive-deps
}

export { createSafeContext, useContextSelector, useContextFactory };
