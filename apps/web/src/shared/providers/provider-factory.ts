import React, {
  createContext,
  type ComponentType,
  type ReactNode,
  useContext,
} from 'react';

/**
 * The result of {@link createProvider}. Contains the Provider component,
 * consumer hooks, and the underlying React context for advanced use.
 */
interface ProviderFactoryResult<T> {
  /** Provider component that supplies context value to its subtree. */
  Provider: ComponentType<{ value: T; children: ReactNode }>;
  /**
   * Hook that consumes the context value.
   * @throws {Error} if used outside the provider.
   */
  useConsumer: () => T;
  /**
   * Hook that consumes the context value, returning `null` if used
   * outside the provider. Useful for optional/consumable contexts.
   */
  useConsumerOrNull: () => T | null;
  /** The underlying React context object. */
  context: React.Context<T | null>;
}

/**
 * Creates a typed React context provider with consumer hooks.
 * Eliminates boilerplate for context creation across the codebase.
 *
 * @example
 * ```tsx
 * const { Provider, useConsumer, useConsumerOrNull } =
 *   createProvider<BookingContextValue>('BookingContext');
 *
 * // Use in a parent:
 * <Provider value={{ step: 'service', setStep }}>
 *   <Child />
 * </Provider>
 *
 * // Use in a child:
 * function Child() {
 *   const { step } = useConsumer();
 *   return <div>{step}</div>;
 * }
 * ```
 *
 * @param displayName - Name for React DevTools and error messages.
 * @param defaultValue - Optional default value (used only if a default context is needed).
 * @returns Provider, consumer hooks, and the raw context.
 */
function createProvider<T>(
  displayName: string,
  defaultValue?: T,
): ProviderFactoryResult<T> {
  const defaultVal = defaultValue ?? null;

  const ctx = createContext<T | null>(defaultVal);
  ctx.displayName = displayName;

  const Provider: ComponentType<{ value: T; children: ReactNode }> = ({
    value,
    children,
  }) => React.createElement(ctx.Provider, { value }, children);

  Provider.displayName = `${displayName}Provider`;

  /**
   * Consumes the context and throws if no provider is present.
   */
  const useConsumer = (): T => {
    const value = useContext(ctx);
    if (value === null || value === undefined) {
      throw new Error(
        `[${displayName}] must be used within a <${displayName}Provider>. ` +
          `No provider was found in the component tree.`,
      );
    }
    return value;
  };

  /**
   * Consumes the context, returning `null` if no provider is present.
   */
  const useConsumerOrNull = (): T | null => {
    return useContext(ctx);
  };

  return {
    Provider,
    useConsumer,
    useConsumerOrNull,
    context: ctx,
  };
}

export type { ProviderFactoryResult };
export { createProvider };
